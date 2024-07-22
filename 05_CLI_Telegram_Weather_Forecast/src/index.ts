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
	city_forecast: 'Weather forecast in Kyiv',
	forecast_interval_3: 'With a 3-hour interval',
	forecast_interval_6: 'With a 6-hour interval',
};

const bot = new TelegramBot(token, {
	webHook: {
		port,
	},
});

bot.setWebHook(`${url}/bot${token}`);

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, 'Welcome', {
		reply_markup: {
			keyboard: [
				[{ text: commands.city_forecast }],
				[
					{ text: commands.forecast_interval_3 },
					{ text: commands.forecast_interval_6 },
				],
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

	switch (msg.text) {
		case commands.city_forecast:
			sendForecastToBot(chatId);
			break;

		case commands.forecast_interval_3:
			if (userIntervals[chatId]) {
				clearInterval(userIntervals[chatId]);
			}
			const intervalId3 = setInterval(
				() => sendForecastToBot(chatId),
				INTERVAL_3_HOURS
			);
			userIntervals[chatId] = intervalId3;
			break;

		case commands.forecast_interval_6:
			if (userIntervals[chatId]) {
				clearInterval(userIntervals[chatId]);
			}
			const intervalId6 = setInterval(
				() => sendForecastToBot(chatId),
				INTERVAL_6_HOURS
			);
			userIntervals[chatId] = intervalId6;
			break;

		default:
			break;
	}
});
