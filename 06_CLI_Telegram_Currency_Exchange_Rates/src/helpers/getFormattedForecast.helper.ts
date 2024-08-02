import { Forecast } from '../types/weather.type';
import {
	formatDate,
	formatTime,
	groupForecastByDate,
	displayTemperature,
} from './index.helper';

export const getFormattedForecast = async (weather: Forecast) => {
	const groupedForecast = groupForecastByDate(weather);
	const message = groupedForecast
		.map(({ items, date }) => {
			const dayForecast = items
				.map(({ main: { temp, feels_like }, weather, dt_txt }) => {
					const date = new Date(dt_txt);
					const description = weather[0].description;
					const formattedTime = formatTime(date);
					const formattedTemp = displayTemperature(Math.round(temp));
					const formattedFeelsLike = displayTemperature(Math.round(feels_like));
					return `  ${formattedTime}, ${formattedTemp}, відчувається: ${formattedFeelsLike}, ${description} `;
				})
				.join('\n');
			return `${formatDate(new Date(date))}\n${dayForecast}`;
		})
		.join('\n\n');
	return message;
};
