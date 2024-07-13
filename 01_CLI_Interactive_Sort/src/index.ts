import readline from 'readline/promises';
import chalk from 'chalk';
import {
	sortAlphabetically,
	showUniqueValueInArray,
	showUniqueWords,
	displayNumbersAscending,
	displayNumbersDescending,
	displayWordsAscendingByLength,
} from './services/sortBy.service';
import { checkWordCount, displaySortResult, isNumeric } from './helpers/index.helper';
import { errorCharacter, questionCharacter } from './helpers/constants.helper';

let ENTERED_WORDS = '';
let REQUIRED_WORD_COUNT = 10;
const CHANGE_WORDS = 'g';
const CHANGE_WORD_COUNT = 'h';

const prompts = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const getMenuOptions = () => {
	const menuOptions = [
		`${chalk.bold('a)')} Sort the words alphabetically.`,
		`${chalk.bold('b)')} Display the numbers in ascending order.`,
		`${chalk.bold('c)')} Display the numbers in descending order.`,
		`${chalk.bold(
			'd)'
		)} Display the words in ascending order based on the number of letters in each word.`,
		`${chalk.bold('e)')} Show only unique words.`,
		`${chalk.bold(
			'f)'
		)} Show only the unique values from the entire set of words and numbers entered by the user.`,
		`${chalk.bold('g)')} Change words.`,
		`${chalk.bold('h)')} Change required words count.`,
		chalk.red.bold('exit\n'),
	].join('\n');

	return menuOptions;
};

const askForWords = async () => {
	try {
		const str = await prompts.question(
			chalk.bold(
				`${questionCharacter} Hello. Enter ${REQUIRED_WORD_COUNT} words or digits dividing them in spaces :\n`
			)
		);
		if (!checkWordCount(str.trim(), REQUIRED_WORD_COUNT)) {
			console.log(
				`${errorCharacter} There must be exactly ${REQUIRED_WORD_COUNT} words`
			);
			return '';
		}
		return str.trim();
	} catch (error) {
		console.error(
			`${errorCharacter} An error occurred while processing your input:`,
			error
		);
		return '';
	}
};

const changeWordsLimit = async () => {
	try {
		const newWordCount = await prompts.question(
			chalk.bold(`${questionCharacter} Enter new words count:  `)
		);

		const trimmedStr = newWordCount.trim();

		if (!isNumeric(trimmedStr)) {
			console.log(`\n${errorCharacter} ${trimmedStr} is not a number`);
			return null;
		}
		if (parseInt(trimmedStr) < 2) {
			console.log(`${errorCharacter} Required words count must be at least 2`);
			return null;
		}
		return parseInt(trimmedStr);
	} catch (error) {
		console.error(
			`${errorCharacter} An error occurred while processing your input:`,
			error
		);
		return null;
	}
};

const showMenu = async () => {
	try {
		const selectedOption = await prompts.question(
			`\n${questionCharacter} ${chalk.bold(
				'Please Choose an option:'
			)}\n\n${getMenuOptions()}`
		);
		let result;
		switch (selectedOption.trim()) {
			case 'a':
				result = sortAlphabetically(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'b':
				result = displayNumbersAscending(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'c':
				result = displayNumbersDescending(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'd':
				result = displayWordsAscendingByLength(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'e':
				result = showUniqueWords(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'f':
				result = showUniqueValueInArray(ENTERED_WORDS);
				displaySortResult(ENTERED_WORDS, result);
				return result;
			case 'g':
				ENTERED_WORDS = '';
				return CHANGE_WORDS;
			case 'h':
				ENTERED_WORDS = '';
				REQUIRED_WORD_COUNT = 0;
				return CHANGE_WORD_COUNT;
			case 'exit':
				prompts.close();
				return result;
			default:
				console.log(`${errorCharacter} No such option. Please enter another: `);
		}
	} catch (error) {
		console.error(
			`${errorCharacter} An error occurred while processing your selection:`,
			error
		);
	}
};

const run = async () => {
	let continueShowMenu = true;
	let continueAsking = true;
	let continueChangeCount = false;

	while (continueShowMenu) {
		while (continueChangeCount) {
			const answer = await changeWordsLimit();
			if (answer) {
				REQUIRED_WORD_COUNT = answer;
				continueAsking = true;
				continueChangeCount = false;
			}
		}

		while (continueAsking) {
			const answer = await askForWords();
			if (answer) {
				ENTERED_WORDS = answer;
				continueAsking = false;
			}
		}

		const menuResponse = await showMenu();
		if (menuResponse === CHANGE_WORDS) {
			continueAsking = true;
		}
		if (menuResponse === CHANGE_WORD_COUNT) {
			continueChangeCount = true;
		}
	}
};
run();

prompts.on('close', () => {
	console.log('Exiting the program');
	process.exit(0);
});
