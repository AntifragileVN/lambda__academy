export const checkWordCount = (str: string, wordsCount: number) => {
	return str.split(' ').length === wordsCount;
};
