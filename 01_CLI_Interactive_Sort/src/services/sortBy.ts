import { isNumeric } from '../helpers';

//a
export const sortAlphabetically = (str: string) => {
	const strArray = str.split(' ');
	const insertArray = [...strArray];

	const wordsArray = strArray.filter((item) => !isNumeric(item));
	wordsArray.sort((a, b) => {
		return a.localeCompare(b, 'en', { sensitivity: 'base' });
	});

	return insertArray
		.map((item) => {
			if (!isNumeric(item)) {
				return wordsArray.shift();
			}
			return item;
		})
		.join(' ');
};
//b
export const displayNumbersAscending = (str: string) => {
	const strArray = str.split(' ');

	const numbersArray = strArray.filter((item) => isNumeric(item));
	return numbersArray
		.sort((a, b) => {
			if (a > b) {
				return 1;
			}

			if (a < b) {
				return -1;
			}

			return 0;
		})
		.join(' ');
};
//c
export const displayNumbersDescending = (str: string) => {
	const strArray = str.split(' ');

	const numbersArray = strArray.filter((item) => isNumeric(item));
	return numbersArray
		.sort((a, b) => {
			if (b > a) {
				return 1;
			}

			if (b < a) {
				return -1;
			}

			return 0;
		})
		.join(' ');
};
//d
export const displayWordsAscendingByLength = (str: string) => {
	const strArray = str.split(' ');
	const insertArray = [...strArray];

	const wordsArray = strArray.filter((item) => !isNumeric(item));
	wordsArray.sort((a, b) => {
		return a.length - b.length;
	});

	return insertArray
		.map((item) => {
			if (!isNumeric(item)) {
				return wordsArray.shift();
			}
			return item;
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
