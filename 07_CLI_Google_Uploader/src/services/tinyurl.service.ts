import axios, { AxiosResponse } from 'axios';
import type { TinyUrlCreateDto, TinyUrlResponse } from '../types/tinyurl.type';

const tinyUrlApiKey = process.env.TINYURL_API_KEY || '';

const tinyAxios = axios.create({
	baseURL: 'https://api.tinyurl.com',
	headers: {
		Authorization: `Bearer ${tinyUrlApiKey}`,
	},
});

export const createShortenedLink = async (
	data: TinyUrlCreateDto
): Promise<TinyUrlResponse> => {
	try {
		const response: AxiosResponse<TinyUrlResponse> = await tinyAxios.post(
			'/create',
			data
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data);
			throw error;
		}
		console.error('Unexpected error:', error);
		throw error;
	}
};
