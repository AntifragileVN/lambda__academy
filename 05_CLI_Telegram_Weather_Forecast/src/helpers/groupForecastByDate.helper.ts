import { Forecast, ForecastItem } from '../types/weather.type.js';

export const groupForecastByDate = (forecast: Forecast) => {
	return forecast.list.reduce(
		(total: Array<{ date: string; items: Array<ForecastItem> }>, current) => {
			const group = total.find(
				(item) => item.date === current?.dt_txt.split(' ')[0]
			);

			if (!group) {
				total.push({
					date: current.dt_txt.split(' ')[0],
					items: [current],
				});
				return total;
			}
			group.items.push(current);
			return total;
		},
		[]
	);
};
