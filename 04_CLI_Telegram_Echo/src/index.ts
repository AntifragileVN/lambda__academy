import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN || '';

const bot = new TelegramBot(token, {
	polling: {
		autoStart: true,
		interval: 3000,
		params: {
			timeout: 10,
		},
	},
});
