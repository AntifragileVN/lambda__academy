import { bold, cyan } from 'chalk';

export const displaySortResult = (initial: string, result: string) => {
	console.log(`\n${bold('Initial:')} ${cyan(initial)}`);
	console.log(`${bold('Result :')} ${cyan(result)}`);
};
