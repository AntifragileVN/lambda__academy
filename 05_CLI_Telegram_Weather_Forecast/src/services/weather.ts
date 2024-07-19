import axios, { AxiosResponse } from 'axios';
import { Forecast } from '../types/weather.type.js';

type GetWeatherProps = {
	appid: string;
	lat: number;
	lon: number;
	lang?: string;
	units?: string;
};

type GetCoordinatesProps = {
	appid: string;
	city: string;
};

export const getForecast = async ({ lat, lon, lang, units, appid }: GetWeatherProps) => {
	try {
		const response: AxiosResponse = await axios.get(
			'https://api.openweathermap.org/data/2.5/forecast',
			{
				params: {
					lat,
					lon,
					lang,
					appid,
					units,
				},
			}
		);
		const forecast: Forecast = response.data;
		return forecast;
	} catch (error) {
		console.log(error);
	}
};

export const getCoordinates = async ({ appid, city }: GetCoordinatesProps) => {
	try {
		const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
			params: {
				q: city,
				appid,
			},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getForecastByCity = async (city: string, appid: string) => {
	try {
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
			units: 'metric',
		});
		return forecast;
	} catch (error) {
		console.log(error);
	}
};
