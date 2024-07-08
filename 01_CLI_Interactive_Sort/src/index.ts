import readline from 'readline';
import {
	sortAlphabetically,
	showUniqueValueInArray,
	showUniqueWords,
	displayNumbersAscending,
	displayNumbersDescending,
	displayWordsAscendingByLength,
} from './services/sortBy';
import { checkWordCount, displaySortResult } from './helpers';

let ENTERED_WORDS = '';
const REQUIRED_WORD_COUNT = 10;

const prompts = readline.createInterface(process.stdin, process.stdout);

const askForWords = () => {
	if (!checkWordCount(ENTERED_WORDS, REQUIRED_WORD_COUNT)) {
		prompts.question(`Enter 10 words and numbers: `, (str) => {
			if (!checkWordCount(str.trim(), REQUIRED_WORD_COUNT)) {
				console.log('There must be exactly 10 words');
				askForWords();
			}
			ENTERED_WORDS = str.trim();
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
