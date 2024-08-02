import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { getForecastByCity } from './services/weather.service.js';
import { getFormattedForecast } from './helpers/index.helper.js';

import { TelegramBotError } from './types/telegramBot.types.js';
import {
	getMonoBankCurrencyRate,
	getPrivateCurrencyRate,
} from './services/currency.service.js';

const INTERVAL_3_HOURS = 10800000;
const INTERVAL_6_HOURS = 21600000;

const city = 'Kyiv';

type UserIntervals = {
	[key: number]: NodeJS.Timeout;
};
const userIntervals: UserIntervals = {};

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const appid = process.env.OPEN_WEATHER_API_KEY || '';
const port: number = Number(process.env.PORT) || 3000;
const url = process.env.APP_URL || '/';

const commands = {
	weather_menu: '/Погода',
	currency_menu: '/Курс валют',
	previous_menu: 'Поперeднє меню',
	city_forecast: 'Погода в Києві',
	forecast_interval_3: 'Кожні 3 години',
	forecast_interval_6: 'Кожні 6 години',
	dollars_exchange: 'USD',
	euro_exchange: 'EUR',
};

let bot;

if (process.env.ENVIRONMENT === 'PRODUCTION') {
	bot = new TelegramBot(token, {
		webHook: {
			port,
		},
	});

	bot.setWebHook(`${url}/bot${token}`);
} else {
	bot = new TelegramBot(token, {
		polling: true,
	});
}

bot.setMyCommands([{ command: '/start', description: 'Запустити бота' }]);
const weatherMenuRegex = new RegExp(commands.weather_menu, 'i');
const currencyMenuRegex = new RegExp(commands.currency_menu, 'i');
const startMenuRegex = new RegExp(`\/start|${commands.previous_menu}`, 'i');

const weatherMenu = {
	reply_markup: {
		keyboard: [
			[{ text: commands.city_forecast }],
			[
				{ text: commands.forecast_interval_3 },
				{ text: commands.forecast_interval_6 },
			],
			[{ text: commands.previous_menu }],
		],
	},
};

const currencyMenu = {
	reply_markup: {
		keyboard: [
			[{ text: commands.dollars_exchange }, { text: commands.euro_exchange }],
			[{ text: commands.previous_menu }],
		],
	},
};

const mainMenu = {
	reply_markup: {
		keyboard: [[{ text: commands.weather_menu }], [{ text: commands.currency_menu }]],
	},
};

bot.onText(weatherMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Weather menu', weatherMenu);
});

bot.onText(currencyMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Оберіть валюту яка вас цікавить', currencyMenu);
});

bot.onText(startMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Головне меню', mainMenu);
});

const sendForecastToBot = async (id: number) => {
	try {
		const weather = await getForecastByCity(city, appid);
		if (weather) {
			const message = await getFormattedForecast(weather);
			await bot.sendMessage(id, message);
		}
	} catch (error) {
		const telegramBotError = error as TelegramBotError;
		console.error('error', error);

		if (telegramBotError?.response?.body?.error_code === 403) {
			clearInterval(userIntervals[id]);
		}
	}
};

const sendCurrencyRate = async (chatId: number, currency: 'USD' | 'EUR') => {
	const [monoBankRate, privateBankRate] = await Promise.all([
		getMonoBankCurrencyRate(),
		getPrivateCurrencyRate(),
	]);

	const monoRate = monoBankRate.find(
		(rate) =>
			rate.currencyCodeA === (currency === 'USD' ? 840 : 978) &&
			rate.currencyCodeB === 980
	);
	const privateRate = privateBankRate.find((rate) => rate.ccy === currency);

	bot.sendMessage(
		chatId,
		`${currency} CURRENCY RATE:\n\nMonobank:\n${monoRate?.rateBuy}/${monoRate?.rateSell}\n\nPrivate Bank:\n${privateRate?.buy}/${privateRate?.sale}`
	);
};

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;

	switch (msg.text) {
		case commands.city_forecast:
			await sendForecastToBot(chatId);
			break;
		case commands.forecast_interval_3:
			if (userIntervals[chatId]) clearInterval(userIntervals[chatId]);
			userIntervals[chatId] = setInterval(
				() => sendForecastToBot(chatId),
				INTERVAL_3_HOURS
			);
			break;
		case commands.forecast_interval_6:
			if (userIntervals[chatId]) clearInterval(userIntervals[chatId]);
			userIntervals[chatId] = setInterval(
				() => sendForecastToBot(chatId),
				INTERVAL_6_HOURS
			);
			break;
		case commands.dollars_exchange:
		case commands.euro_exchange:
			await sendCurrencyRate(
				chatId,
				msg.text === commands.dollars_exchange ? 'USD' : 'EUR'
			);
			break;
	}
});
