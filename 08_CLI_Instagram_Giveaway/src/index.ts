import fs from 'fs';
import path from 'path';

async function readFile(filePath: string) {
	const normalizedPath = path.normalize(filePath);
	const fileInfo = path.parse(normalizedPath);
	return fileInfo;
}

const run = async () => {
	try {
	} catch (error) {
		console.log(error);
	}
};

run();
