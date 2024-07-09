import { bold, cyan } from 'chalk';

export const displaySortResult = (str: string, sortMethod: (str: string) => string) => {
	console.log(`\n${bold('Initial:')} ${cyan(str)}`);
	console.log(`${bold('Result :')} ${cyan(sortMethod(str))}`);
};
