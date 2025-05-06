import TelegramBot from "node-telegram-bot-api";

const token = "Your_Bot's_Token";
const bot = new TelegramBot(token, { polling: true });
const userPendingVerification: Record<number, string> = {}; // chatId → userInput

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `👋 Welcome, ${msg.from?.first_name || "friend"}! 
  To join this exclusive crypto channel, please complete the following steps:
  
  <b>Step 1</b>: Register with Photon
  <b>Step 2</b>: Verify with Photon
  <b>Step 3</b>: Gain Instant Access
  
  Watch the video below to understand how to join Gem Hunters Lite. Then click "Start Verification" to open the in app browser.
  
  https://youtu.be/IYoRXSWOvml`;

  const joinButton: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Start Verification",
            callback_data: "join_clicked",
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, message, joinButton);
});

bot.on("message", (msg) => {
  if (msg.web_app_data?.data) {
    const data = JSON.parse(msg.web_app_data.data);
    if (data.status === "verified") {
      bot.sendMessage(msg.chat.id, "✅ You are verified as a Photon user!");
    } else {
      bot.sendMessage(
        msg.chat.id,
        "❌ You are not verified. Please sign up on Photon."
      );
    }
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
      `First step: Register with Photon
      
      Now register for Photon and verify your account.
      
      👇 Click on the button below to proceed.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "➡️ Proceed first step",
                callback_data: "signup_photon",
              },
            ],
          ],
        },
      }
    );
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
                web_app: { url: "https://my-photon-checker.vercel.app" },
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
                text: "🚀 Join Gem Hunter group",
                callback_data: "registration",
              },
            ],
          ],
        },
      }
    );
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
        caption: "<b>GEM HUNTERS</b>",
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
