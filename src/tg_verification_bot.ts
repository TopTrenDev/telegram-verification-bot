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
  const text = msg.text?.trim();

  // Ignore commands (like /start) and empty messages
  if (!text || text.startsWith("/")) return;

  if (isValidEmail(text)) {
    // Save email if needed
    userPendingVerification[chatId] = text;

    bot.sendMessage(
      chatId,
      `📧 You entered a valid email: <b>${text}</b>\nNow click "Verify Email" to continue.`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Verify Email", callback_data: "verify_email" }],
          ],
        },
      }
    );
  } else {
    // Save as a potential BloFin/Photon ID
    userPendingVerification[chatId] = text;

    bot.sendMessage(
      chatId,
      `🆔 You entered: <b>${text}</b>\nNow click "Verify ID" to verify it.`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Verify ID", callback_data: "verify_id" }],
          ],
        },
      }
    );
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message?.chat.id;
  const data = query.data;

  if (!chatId || !data) return;

  if (data === "join_clicked") {
    bot.answerCallbackQuery(query.id);

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
            ],
            [
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
        "Please input your digit ID as a message first."
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
    bot.answerCallbackQuery(query.id);

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
            ],
            [
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
    bot.answerCallbackQuery(query.id);

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

  if (data === "verify_email") {
    bot.answerCallbackQuery(query.id);

    const email = userPendingVerification[chatId!];

    if (!email) {
      return bot.sendMessage(chatId, "Please input your email first.");
    }

    if (isValidEmail(email)) {
      bot.sendMessage(
        chatId!,
        `✅ <b>Email Confirmation Successful!</b>

        Your email <b>${email}</b> has been confirmed successfully! Proceed to the last step to get your invite link
        
        👇 Click on the button below to proceed`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "➡️ Proceed to Final Step",
                  callback_data: "registration",
                },
              ],
            ],
          },
        }
      );
    } else {
      bot.sendMessage(chatId!, "Please enter a correct email address.");
    }
  }

  if (data === "registration") {
    bot.answerCallbackQuery(query.id);

    bot.sendMessage(
      chatId!,
      `✅ <b>Registration Successfully!</b>
      
      Now let's accept the <a href="https://gemhunters.co/disclaimer">DISCLAIMER</a>.

      👇 Click on ACCEPT DISCLAIMER when you've read and accepted the disclaimer`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Accept Disclaimer",
                callback_data: "join_gemHunter",
              },
            ],
          ],
        },
      }
    );
  }

  if (data === "join_gemHunter") {
    bot.answerCallbackQuery(query.id);

    // Send image (screenshot of the Gem Hunters page)
    bot.sendPhoto(
      chatId!,
      "https://gemhunters.co/images/get-access-left_1get-access-left.webp",
      {
        caption: "<b>GEM HUNTERS</b>\n\n",
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Join Gem Hunters Lite",
                url: "https://gemhunters.co", // actual join link
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
