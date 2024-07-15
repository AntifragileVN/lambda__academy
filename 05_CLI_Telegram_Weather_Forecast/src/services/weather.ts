import axios from 'axios';

type GetWeatherProps = {
	appid: string;
	lat: number;
	lon: number;
	lang?: string;
};

type GetForecastResponse = {
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

export const getForecast = async ({
	lat,
	lon,
	lang,
	appid = 'fbdad6e2a16c807552ac86e36257b386',
}: GetWeatherProps) => {
	try {
		console.log(lat, lon, lang, appid);
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/forecast`,
			{
				params: {
					lat,
					lon,
					lang,
					appid,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
