import { Command } from 'commander';
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const program = new Command();
const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.USER_CHAT_ID || '';

const bot = new TelegramBot(token, {
	polling: {
		autoStart: true,
		interval: 3000,
		params: {
			timeout: 10,
		},
	},
});

program.version('0.0.1');

program
	.command('message <message>')
	.alias('m')
	.description('Send message to Telegram Bot')
	.action((message) => {
		if (!chatId) {
			console.log('No chatId available');
		} else {
			bot.sendMessage(chatId, message);
		}
	});

program
	.command('photo <path>')
	.alias('p')
	.description(
		'Send photo to Telegram Bot. Just drag and drop it in console after p-flag'
	)
	.action((path) => {
		if (!chatId) {
			console.log('No chatId available.');
		} else {
			bot.sendPhoto(chatId, path);
		}
	});

program.parse(process.argv);
