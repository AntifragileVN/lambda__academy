import axios from 'axios';

type MonoBankCurrencyRate = {
	currencyCodeA: number;
	currencyCodeB: number;
	date: number;
	rateBuy?: number;
	rateSell?: number;
	rateCross?: number;
};

type PrivateBankCurrencyRate = {
	ccy: string;
	base_ccy: string;
	buy: string;
	sale: string;
};

export const getPrivateCurrencyRate = async (): Promise<PrivateBankCurrencyRate[]> => {
	try {
		const response = await axios.get(
			'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching currency rates:', error);
		return [];
	}
};

export const getMonoBankCurrencyRate = async (): Promise<MonoBankCurrencyRate[]> => {
	try {
		const response = await axios.get('https://api.monobank.ua/bank/currency');

		const data: MonoBankCurrencyRate[] = response.data;
		return data;

		// const eurRate = data.find(
		// 	(rate) => rate.currencyCodeA === 978 && rate.currencyCodeB === 980
		// );
		// const usdRate = data.find(
		// 	(rate) => rate.currencyCodeA === 840 && rate.currencyCodeB === 980
		// );

		// return [eurRate, usdRate];
	} catch (error) {
		console.error('Error fetching currency rates from MonoBank:', error);
		return [];
	}
};
