import { input, confirm } from '@inquirer/prompts';
import { isNumeric } from '../helpers/isNumeric.helper';

export const askForFilePath = async (): Promise<string> => {
	return await input({
		message: 'Drag and drop your image to terminal and press Enter for upload:',
		validate: (path) => {
			if (path.trim().length <= 0) {
				return 'You must write something';
			}
			if (isNumeric(path)) {
				return 'Name can`t be number';
			}
			return true;
		},
		transformer: (name) => name.trim(),
	});
};

export const confirmRenameFile = async (fileName: string): Promise<boolean> => {
	return await confirm({
		message: `You're uploading a file with the name: ${fileName}. Would you like to change it?`,
	});
};

export const askForNewFileName = async (): Promise<string> => {
	return await input({
		message: 'Enter new file name (WITHOUT extension aka .jpg, .png, etc.)',
		validate: (name) => {
			if (name.trim().length <= 0) {
				return 'You must write something';
			}
			if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(name)) {
				return 'There must be no photo extensions';
			}
			return true;
		},
		transformer: (name) => name.trim(),
	});
};

export const confirmShortenLink = async (): Promise<boolean> => {
	return await confirm({
		message: 'Would you like to shorten your link ?',
	});
};
