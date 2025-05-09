# Telegram Mini App Verification Bot 🤖

This project is a full-featured Telegram bot with a connected Mini App, built using TypeScript and `node-telegram-bot-api`. It allows users to verify their identity by signing up via [Photon](https://photon-sol.tinyastro.io/) and stores/verifies their information through a backend Express server.

## Features

- Telegram Bot with `/start` command
- Telegram Mini App integration
- Photon sign-up and identity linking
- Local user data storage using `JSON`
- User scraping and verification
- Express.js backend API
- TypeScript project structure

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/TopTrenDev/telegram-verification-bot.git
cd telegram-verification-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Bot

Please input your bot token into .env file.

```bash
const token = 'YOUR_BOT_TOKEN'; // Get from BotFather
```

### 4. Running the Bot

Running the bot with this command.

```bash
npm start
```
