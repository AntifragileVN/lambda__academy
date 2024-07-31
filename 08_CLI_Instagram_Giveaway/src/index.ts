import fs from 'fs';
import { readdir } from 'fs/promises';
import readline from 'readline';
import path from 'path';

async function readFile(filePath: string) {
	const fileStream = fs.createReadStream(filePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const userNames = new Set<string>();
	for await (const line of rl) {
		userNames.add(line.trim());
	}
	return userNames;
}

const WORDS_DIR = path.resolve(__dirname, '../words');

const run = async () => {
	try {
		console.time('Processing Time');
		const data = await readdir(WORDS_DIR);
		const filePaths = data.map((filePath) => path.resolve(WORDS_DIR, filePath));

		const fileContents = await Promise.all(filePaths.map(readFile));

		const uniqueUsernames = new Set<string>();
		const usernameCounts = new Map<string, number>();

		fileContents.forEach((content) => {
			content.forEach((username) => {
				uniqueUsernames.add(username);
				usernameCounts.set(username, (usernameCounts.get(username) || 0) + 1);
			});
		});

		const usernamesInAllFiles = [...usernameCounts.entries()].filter(
			([, count]) => count === filePaths.length
		);
		const usernamesInAtLeast10Files = [...usernameCounts.entries()].filter(
			([, count]) => count >= 10
		);

		console.log(`Unique usernames: ${uniqueUsernames.size}`);
		console.log(`Usernames in all files: ${usernamesInAllFiles.length}`);
		console.log(
			`Usernames in at least 10 files: ${usernamesInAtLeast10Files.length}`
		);
		console.timeEnd('Processing Time');
	} catch (error) {
		console.log(error);
	}
};

run();
