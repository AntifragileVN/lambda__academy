import path from 'path';

export const readFileByPath = async (filePath: string) => {
	try {
		const normalizedPath = path.normalize(filePath);
		const fileInfo = path.parse(normalizedPath);
		return fileInfo;
	} catch (error) {
		if (error instanceof Error)
			console.error(`Got an error trying to read the file: ${error.message}`);
	}
};
