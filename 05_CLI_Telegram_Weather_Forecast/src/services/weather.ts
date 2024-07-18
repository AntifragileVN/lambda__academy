import axios, { AxiosResponse } from 'axios';

type GetWeatherProps = {
	appid: string;
	lat: number;
	lon: number;
	lang?: string;
};

type GetCoordinatesProps = {
	appid: string;
	city: string;
};

type Forecast = {
	cod: string;
	message: number;
	cnt: number;
	list: [
		{
			dt: number;
			main: {
				temp: number;
				feels_like: number;
				temp_min: number;
				temp_max: number;
				pressure: number;
				sea_level: number;
				grnd_level: number;
				humidity: number;
				temp_kf: number;
			};
			weather: [
				{
					id: number;
					main: string;
					description: string;
					icon: string;
				}
			];
			clouds: {
				all: number;
			};
			wind: {
				speed: number;
				deg: number;
				gust: number;
			};
			visibility: number;
			pop: number;
			rain?: {
				[key: string]: number;
			};
			sys: {
				pod: string;
			};
			dt_txt: string;
		}
	];
};

export const getForecast = async ({ lat, lon, lang, appid }: GetWeatherProps) => {
	try {
		const response: AxiosResponse = await axios.get(
			'https://api.openweathermap.org/data/2.5/forecast',
			{
				params: {
					lat,
					lon,
					lang,
					appid,
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
