import { ParsedPath } from 'path';

export const displayFileInfo = (fileData: ParsedPath): void => {
	console.log(`Path to file: ${fileData.dir}`);
	console.log(`File name ${fileData?.base}`);
	console.log(`File extension ${fileData?.ext}`);
};
