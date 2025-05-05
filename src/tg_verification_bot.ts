import TelegramBot from "node-telegram-bot-api";

const token = "7688083755:AAHKx_GXFQQZBxFuh0LQ99EZB7Xz9eLjB3I";
const bot = new TelegramBot(token, { polling: true });
const userPendingVerification: Record<number, string> = {}; // chatId → userInput

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `👋 Welcome, ${msg.from?.first_name || "friend"}! 
  To join this exclusive crypto channel, please complete the following steps:
  
  <b>Step 1</b>: Register with BloFin
  <b>Step 1</b>: Register with Photon
  <b>Step 1</b>: Insert your Email Address
  <b>Step 1</b>: Gain Instant Access
  
  Watch the video below to understand how to join Gem Hunters Lite. Then click "Start Verification" to open the in app browser.
  
  https://youtu.be/IYoRXSWOvml`;

  const joinButton: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Join Gem Hunters",
            callback_data: "join_clicked",
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, message, joinButton);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands (like /start) and non-text messages
  if (!text || text.startsWith("/")) return;

  // Save user input ID (this is where the user sends their ID)
  userPendingVerification[chatId] = text.trim();

  // Notify the user that ID has been received and ask for verification
  bot.sendMessage(
    chatId,
    `You entered: <b>${text}</b>\nNow click "Verify" button to verify it.`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "✅ Verify", callback_data: "verify_id" }]],
      },
    }
  );
});

bot.on("callback_query", (query) => {
  const chatId = query.message?.chat.id;
  const data = query.data;

  if (!chatId || !data) return;

  if (data === "join_clicked") {
    bot.sendMessage(
      chatId!,
      `First step: Register with BloFin

      1. Click "Sign up" button to sign up BloFin.
      2. Please sign up BloFin site.
      3. Copy your user ID from BloFin.
      4. Click "Verify" button and verify with your ID.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔗 Sign Up for BloFin",
                url: "https://blofin.com/register?redirect=",
              },
              {
                text: "📝 Verify with your BloFin ID",
                callback_data: "verify_id",
              },
            ],
          ],
        },
      }
    );
  }

  if (data === "verify_id") {
    bot.answerCallbackQuery(query.id);

    const userInput = userPendingVerification[chatId];

    if (!userInput) {
      return bot.sendMessage(
        chatId,
        "Please send your digit ID as a message first."
      );
    }

    const isValid = verifyBlofinUser(userInput);

    if (isValid) {
      bot.sendMessage(
        chatId,
        `✅ <b>Blofin Verification successful!</b>\n
        Now register for Photon and verify your account
        
        👇 Click on the button below to proceed`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "➡️ Proceed to next step",
                  callback_data: "signup_photon",
                },
              ],
            ],
          },
        }
      );
    } else {
      bot.sendMessage(
        chatId,
        `❌ <b>Verification failed.</b>\nThe ID must be exact. Please check your ID and try again.`,
        {
          parse_mode: "HTML",
        }
      );
    }
  }

  if (data === "signup_photon") {
    bot.sendMessage(
      chatId!,
      `Second step: Verify with Photon

      1. Click "Sign up" button to sign up Photon.
      2. Please sign up Photon.
      3. Click "Verify" button.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔗 Sign Up for Photon",
                url: "https://photon-sol.tinyastro.io/",
              },
              {
                text: "📝 Verify with your Photon",
                callback_data: "verify_photon",
              },
            ],
          ],
        },
      }
    );
  }

  if (data === "verify_photon") {
    bot.sendMessage(
      chatId!,
      `✅ You have successfully signed up for Photon. Please proceed to the next step!
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "➡️ Proceed to Email Confirmation",
                callback_data: "verify_email",
              },
            ],
          ],
        },
      }
    );
  }
});

function verifyBlofinUser(userId: string): boolean {
  // Check if it's exactly 11 digits (numbers only)
  const isValid = /^\d{11}$/.test(userId.trim());
  return isValid;
}
