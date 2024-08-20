import { isNumeric } from '../helpers/index.helper';

//a
export const sortAlphabetically = (str: string) => {
	const strArray = str.split(' ');

	const wordsArray = strArray.filter((item) => !isNumeric(item));
	return wordsArray
		.sort((a, b) => {
			return a.localeCompare(b, 'en', { sensitivity: 'base' });
		})
		.join(' ');
};
//b
export const displayNumbersAscending = (str: string) => {
	return str
		.split(' ')
		.filter(isNumeric)
		.map(Number)
		.sort((a, b) => a - b)
		.join(' ');
};
//c
export const displayNumbersDescending = (str: string) => {
	return str
		.split(' ')
		.filter(isNumeric)
		.map(Number)
		.sort((a, b) => b - a)
		.join(' ');
};
//d
export const displayWordsAscendingByLength = (str: string) => {
	const strArray = str.split(' ');

	const wordsArray = strArray.filter((item) => !isNumeric(item));
	return wordsArray
		.sort((a, b) => {
			return a.length - b.length;
		})
		.join(' ');
};

//e
export const showUniqueWords = (str: string) => {
	const strArray = str.split(' ');
	const wordsArray = strArray.filter((word) => !isNumeric(word));

	return [...new Set(wordsArray)].join(' ');
};

//f
export const showUniqueValueInArray = (str: string) => {
	const strArray = str.split(' ');
	return [...new Set(strArray)].join(' ');
};
