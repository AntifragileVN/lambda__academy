import readline from 'readline';
import {
	sortAlphabetically,
	showUniqueValueInArray,
	showUniqueWords,
	displayNumbersAscending,
	displayNumbersDescending,
	displayWordsAscendingByLength,
} from './services/sortBy';
import { checkWordCount, displaySortResult, isNumeric } from './helpers';

let ENTERED_WORDS = '';
let REQUIRED_WORD_COUNT = 10;

const prompts = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askForWords = () => {
	if (!checkWordCount(ENTERED_WORDS, REQUIRED_WORD_COUNT)) {
		prompts.question(
			`Hello. Enter ${REQUIRED_WORD_COUNT} words or digits dividing them in spaces :\n`,
			(str) => {
				try {
					if (!checkWordCount(str.trim(), REQUIRED_WORD_COUNT)) {
						console.log(`There must be exactly ${REQUIRED_WORD_COUNT} words`);
						askForWords();
						return;
					}
					ENTERED_WORDS = str.trim();
					askForWords();
				} catch (error) {
					console.error(
						'An error occurred while processing your input:',
						error
					);
					askForWords();
				}
			}
		);
	} else {
		showMenu();
	}
};

const changeWordsLimit = () => {
	if (!!REQUIRED_WORD_COUNT) {
		askForWords();
		return;
	} else {
		prompts.question(`Enter new words count:  `, (str) => {
			try {
				const trimmedStr = str.trim();

				if (!isNumeric(trimmedStr)) {
					console.log(`\n${trimmedStr} is not a number`);
					changeWordsLimit();
					return;
				}
				if (parseInt(trimmedStr) < 2) {
					console.log(`Required words count must be at least 2`);
					changeWordsLimit();
					return;
				}
				REQUIRED_WORD_COUNT = parseInt(trimmedStr);
				askForWords();
			} catch (error) {
				console.error('An error occurred while processing your input:', error);
				changeWordsLimit();
			}
		});
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
			'g) Change words.\n' +
			'h) Change required words count.\n' +
			'exit\n\n',

		(line) => {
			try {
				switch (line.trim()) {
					case 'a':
						displaySortResult(ENTERED_WORDS, sortAlphabetically);
						showMenu();
						break;
					case 'b':
						displaySortResult(ENTERED_WORDS, displayNumbersAscending);
						showMenu();
						break;
					case 'c':
						displaySortResult(ENTERED_WORDS, displayNumbersDescending);
						showMenu();
						break;
					case 'd':
						displaySortResult(ENTERED_WORDS, displayWordsAscendingByLength);
						showMenu();
						break;
					case 'e':
						displaySortResult(ENTERED_WORDS, showUniqueWords);
						showMenu();
						break;
					case 'f':
						displaySortResult(ENTERED_WORDS, showUniqueValueInArray);
						showMenu();
						break;
					case 'g':
						ENTERED_WORDS = '';
						askForWords();
						break;
					case 'h':
						ENTERED_WORDS = '';
						REQUIRED_WORD_COUNT = 0;
						changeWordsLimit();
						break;
					case 'exit':
						return prompts.close();
						break;
					default:
						console.log('No such option. Please enter another: ');
						showMenu();
				}
			} catch (error) {
				console.error(
					'An error occurred while processing your selection:',
					error
				);
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
