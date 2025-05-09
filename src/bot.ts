import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });
const WEBAPP_URL = process.env.WEBAPP_URL!;

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 <b>Welcome, ${msg.from?.first_name || "friend"}! </b>

To join our Malikonchain crypto channel, please complete these steps:

1️⃣ Register with Photon  

2️⃣ Verify here  

3️⃣ Join our Telegram Channel
`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Start Verification with Mini-App",
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    }
  );
});

console.log("🤖 Bot running~🚀... ");
