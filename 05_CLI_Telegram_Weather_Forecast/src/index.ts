import 'dotenv/config';
import { getForecast } from './services/weather.js';

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY || '';
const weather = await getForecast({
	lang: 'uk',
	lat: 50.4500336,
	lon: 30.5241361,
	appid: OPEN_WEATHER_API_KEY,
});
console.log(weather);
