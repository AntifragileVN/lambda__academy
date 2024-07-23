import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { getForecastByCity } from './services/weather.js';
import {
	formatTime,
	displayTemperature,
	groupForecastByDate,
	formatDate,
} from './helpers/index.helper.js';
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

if (process.env.environment === 'PRODUCTION') {
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

const weatherMenuRegex = new RegExp(`${commands.weather_menu}`, 'i');
const currencyMenuRegex = new RegExp(`${commands.currency_menu}`, 'i');
const startMenuRegex = new RegExp(`\/start|${commands.previous_menu}`, 'i');

bot.onText(weatherMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Weather menu', {
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
	});
});

bot.onText(currencyMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Оберіть валюту яка вас цікавить', {
		reply_markup: {
			keyboard: [
				[{ text: commands.dollars_exchange }, { text: commands.euro_exchange }],
				[{ text: commands.previous_menu }],
			],
		},
	});
});

bot.onText(startMenuRegex, (msg) => {
	bot.sendMessage(msg.chat.id, 'Start Menu', {
		reply_markup: {
			keyboard: [
				[{ text: commands.weather_menu }],
				[{ text: commands.currency_menu }],
			],
		},
	});
});

const getFormattedForecast = async () => {
	const weather = await getForecastByCity(city, appid);
	if (weather) {
		const groupedForecast = groupForecastByDate(weather);
		const message = groupedForecast
			.map(({ items, date }) => {
				const dayForecast = items
					.map(({ main: { temp, feels_like }, weather, dt_txt }) => {
						const date = new Date(dt_txt);
						const description = weather[0].description;
						const formattedTime = formatTime(date);
						const formattedTemp = displayTemperature(Math.round(temp));
						const formattedFeelsLike = displayTemperature(
							Math.round(feels_like)
						);
						return `  ${formattedTime}, ${formattedTemp}, відчувається: ${formattedFeelsLike}, ${description} `;
					})
					.join('\n');
				return `${formatDate(new Date(date))}\n${dayForecast}`;
			})
			.join('\n\n');
		return message;
	}
	return '';
};

const sendForecastToBot = async (id: number) => {
	try {
		const message = await getFormattedForecast();
		await bot.sendMessage(id, message);
	} catch (error) {
		const telegramBotError = error as TelegramBotError;
		console.error('error', error);

		if (telegramBotError?.response?.body?.error_code === 403) {
			clearInterval(userIntervals[id]);
		}
	}
};

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;

	if (msg.text === commands.city_forecast) {
		sendForecastToBot(chatId);
	} else if (msg.text === commands.forecast_interval_3) {
		if (userIntervals[chatId]) {
			clearInterval(userIntervals[chatId]);
		}
		const intervalId3 = setInterval(
			() => sendForecastToBot(chatId),
			INTERVAL_3_HOURS
		);
		userIntervals[chatId] = intervalId3;
	} else if (msg.text === commands.forecast_interval_6) {
		if (userIntervals[chatId]) {
			clearInterval(userIntervals[chatId]);
		}
		const intervalId6 = setInterval(
			() => sendForecastToBot(chatId),
			INTERVAL_6_HOURS
		);
		userIntervals[chatId] = intervalId6;
	} else if (msg.text === commands.dollars_exchange) {
		const monoBankRate = await getMonoBankCurrencyRate();
		const privateBankRate = await getPrivateCurrencyRate();

		const monoUsdRate = monoBankRate.find(
			(rate) => rate.currencyCodeA === 840 && rate.currencyCodeB === 980
		);
		const privateUsdRate = privateBankRate.find((rate) => rate.ccy === 'USD');

		bot.sendMessage(
			chatId,
			`DOLLARS CURRENCY RATE:\n\nMonobank:\n${monoUsdRate?.rateBuy}/${monoUsdRate?.rateSell}\n\nPrivate Bank:\n${privateUsdRate?.buy}/${privateUsdRate?.sale}`
		);
	} else if (msg.text === commands.euro_exchange) {
		const monoBankRate = await getMonoBankCurrencyRate();
		const privateBankRate = await getPrivateCurrencyRate();

		const monoEuroRate = monoBankRate.find(
			(rate) => rate.currencyCodeA === 978 && rate.currencyCodeB === 980
		);
		const privateEuroRate = privateBankRate.find((rate) => rate.ccy === 'EUR');

		bot.sendMessage(
			chatId,
			`EURO CURRENCY RATE:\n\nMonobank:\n${monoEuroRate?.rateBuy}/${monoEuroRate?.rateSell}\n\nPrivate Bank:\n${privateEuroRate?.buy}/${privateEuroRate?.sale}`
		);
	} else {
	}
});
