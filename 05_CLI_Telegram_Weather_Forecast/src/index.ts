import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { getCoordinates, getForecast } from './services/weather.js';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const appid = process.env.OPEN_WEATHER_API_KEY || '';

const city = 'Kyiv';

const commands = {
	city_forecast: 'Weather forecast in Kyiv',
	forecast_interval_3: 'With a 3-hour interval',
	forecast_interval_6: 'With a 6-hour interval',
};

const bot = new TelegramBot(token, {
	polling: {
		autoStart: true,
		interval: 3000,
		params: {
			timeout: 10,
		},
	},
});

const getCityForecast = async (city: string, appid: string) => {
	const coordinates = await getCoordinates({
		city,
		appid,
	});

	const { name, lat, lon, ...rest } = coordinates[0];
	const forecast = await getForecast({
		lang: 'uk',
		lat,
		lon,
		appid,
	});
	return forecast;
};

bot.on('message', async (msg) => {
	if (msg.text === commands.city_forecast) {
		const weather = await getCityForecast(city, appid);
		if (weather) {
			const message = weather.list
				.map(({ main, weather, dt_txt }) => {
					const date = new Date(dt_txt);
					return `${date.getHours()}, ${main.temp}, відчувається: ${
						main.feels_like
					}, ${weather[0].description} `;
				})
				.join('\n');
			bot.sendMessage(msg.chat.id, message);
		}
	}
	if (msg.text === commands.forecast_interval_3) {
		const weather = await getCityForecast(city, appid);
		bot.sendMessage(msg.chat.id, JSON.stringify(weather, null, 2));
	}
});

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
