export const displaySortResult = (str: string, sortMethod: (str: string) => string) => {
	console.log('\nInitial: ', str);
	console.log('Result : ', sortMethod(str));
};
