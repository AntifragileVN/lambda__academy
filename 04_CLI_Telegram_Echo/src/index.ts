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

const run = () => {
	console.log('Telegram bot successfully started. . .');
};

run();

bot.on('message', (msg) => {
	try {
		const userName = msg.from?.first_name;
		if (msg.text === 'photo') {
			const dateNow = Date.now();
			const photoPath = `https://picsum.photos/200?random=${dateNow}`;
			bot.sendPhoto(msg.chat.id, photoPath);
			console.log(`Користувач ${userName} запросив картинку`);
			return;
		}
		bot.sendMessage(msg.chat.id, `Ви написали '${msg.text}'`);
		console.log(`Користувач ${userName} написав:  ${msg.text}`);
	} catch (error) {
		console.error(error);
	}
});
