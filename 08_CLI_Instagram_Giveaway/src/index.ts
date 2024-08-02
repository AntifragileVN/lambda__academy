import path from 'path';
import { readdir, readFile } from 'fs/promises';

const DIRECTORY = path.resolve(__dirname, '../words');

const readFiles = async (files: string[]) => {
	const filePromises = files.map((file) =>
		readFile(path.join(DIRECTORY, file), 'utf8')
	);
	return Promise.all(filePromises);
};

const processFiles = (fileContents: string[]) => {
	const userMap = new Map<string, number>();

	fileContents.forEach((content) => {
		const usernames = new Set(content.split('\n'));
		usernames.forEach((username) => {
			userMap.set(username, (userMap.get(username) || 0) + 1);
		});
	});

	return userMap;
};

const getUniqueUsernames = async (files: string[]) => {
	const fileContents = await readFiles(files);
	const userMap = processFiles(fileContents);
	return userMap.size;
};

const getUsernamesInAllFiles = async (files: string[]) => {
	const fileContents = await readFiles(files);
	const userMap = processFiles(fileContents);
	return Array.from(userMap.values()).filter((count) => count === 20).length;
};

const getUsernamesInAtLeast10Files = async (files: string[]) => {
	const fileContents = await readFiles(files);
	const userMap = processFiles(fileContents);
	console.log(JSON.stringify(userMap, null, 4));
	return Array.from(userMap.values()).filter((count) => count >= 10).length;
};

const main = async () => {
	console.time('Processing Time');
	try {
		const files = await readdir(DIRECTORY);
		const uniqueUsernames = await getUniqueUsernames(files);
		const usernamesInAllFiles = await getUsernamesInAllFiles(files);
		const usernamesInAtLeast10Files = await getUsernamesInAtLeast10Files(files);

		console.log(`Unique usernames: ${uniqueUsernames}`);
		console.log(`Usernames in all 20 files: ${usernamesInAllFiles}`);
		console.log(`Usernames in at least 10 files: ${usernamesInAtLeast10Files}`);
	} catch (err) {
		console.error('Error processing files:', err);
	}
	console.timeEnd('Processing Time');
};

main();
