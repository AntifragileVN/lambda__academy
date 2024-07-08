const readline = require('readline');
let ENTERED_WORDS = '';
const REQUIRED_WORD_COUNT = 10;

const prompts = readline.createInterface(process.stdin, process.stdout);

const checkWordCount = (str, wordsCount) => {
	return str.split(' ').length === wordsCount;
};

function isNumeric(str) {
	return /^\d+$/.test(str);
}

//a
const sortAlphabetically = (str) => {
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
const displayNumbersAscending = (str) => {
	const strArray = str.split(' ');

	const numbersArray = strArray.filter((item) => isNumeric(item));
	return numbersArray.sort((a, b) => a - b).join(' ');
};
//c
const displayNumbersDescending = (str) => {
	const strArray = str.split(' ');

	const numbersArray = strArray.filter((item) => isNumeric(item));
	return numbersArray.sort((a, b) => b - a).join(' ');
};
//d
const displayWordAscendingByLength = (str) => {
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
const showUniqueWords = (str) => {
	const strArray = str.split(' ');
	const wordsArray = strArray.filter((word) => !isNumeric(word));

	return [...new Set(wordsArray)].join(' ');
};

//f
const showUniqueValueInArray = (str) => {
	const strArray = str.split(' ');
	return [...new Set(strArray)].join(' ');
};

// console.log(sortAlphabetically('b c 2 1 d 3 a t 3 1 2'));

// console.log(showUniqueWords('b b c 2 1 d 3 a a t 3 1 2'));

// console.log(showUniqueValueInArray('b b c 2 1 d 3 a a t 3 1 2'));

// console.log(displayNumbersAscending('b b c 2 1 d 3 a a t 3 1 2'));

// console.log(displayNumbersDescending('b b c 2 1 d 3 a a t 3 1 2'));

// console.log(displayWordAscendingByLength('bbb bbbbb cc 2 1 d 3 a a t 3 1 2'));

const askForWords = () => {
	if (!checkWordCount(ENTERED_WORDS, REQUIRED_WORD_COUNT)) {
		prompts.question(`Enter 10 words and numbers: `, (str) => {
			if (str.trim() === '') {
				console.log('The line can`t be empty');
				askForWords();
				return;
			}
			if (!checkWordCount(str, REQUIRED_WORD_COUNT)) {
				console.log('There must be exactly 10 words');
				askForWords();
				return;
			}
			ENTERED_WORDS = str;
			askForWords();
		});
	} else {
		showMenu();
	}
};

const showMenu = () => {
	prompts.question(
		'\n> Please Choose an option:\n\n' +
			'a) Sort the words alphabetically.\n' +
			'b) Display the numbers in ascending order.\n' +
			'c) Display the numbers in descending order.\n' +
			'd) Display the words in ascending order based on the number of letters in each word.\n' +
			'e) Show only unique words.\n' +
			'f) Show only the unique values from the entire set of words and numbers entered by the user.\n' +
			'exit\n\n',

		(line) => {
			switch (line.trim()) {
				case 'a':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result: ', sortAlphabetically(ENTERED_WORDS));
					showMenu();
					break;
				case 'b':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result: ', displayNumbersAscending(ENTERED_WORDS));
					showMenu();
					break;
				case 'c':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result: ', displayNumbersDescending(ENTERED_WORDS));
					showMenu();
					break;
				case 'd':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result: ', displayWordAscendingByLength(ENTERED_WORDS));
					showMenu();
					break;
				case 'e':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result: ', showUniqueWords(ENTERED_WORDS));
					showMenu();
					break;
				case 'f':
					console.log('\nInitial: ', ENTERED_WORDS);
					console.log('Result:  ', showUniqueValueInArray(ENTERED_WORDS));
					showMenu();
					break;
				case 'exit':
					return prompts.close();
					break;
				default:
					console.log('No such option. Please enter another: ');
					showMenu();
			}
		}
	);
};

askForWords();

prompts.on('close', () => {
	console.log('Exiting the program');
	process.exit(0);
});
