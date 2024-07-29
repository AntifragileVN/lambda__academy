import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { google } from 'googleapis';
import { authorize, generatePublicUrl } from './services/googleDrive.service';
import apikeys from '../apikey.json';
import { ApiKeys } from './types/index.type';
import {
	askForFilePath,
	askForNewFileName,
	confirmRenameFile,
	confirmShortenLink,
} from './services/prompts.service';
import { displayFileInfo } from './helpers/displayFileInfo.helper';
import { createShortenedLink } from './services/tinyurl.service';

process.stdin.on('data', (key) => {
	if (key.toString() == '\u0003') {
		process.exit(0);
	}
});

async function readFileByPath(filePath: string) {
	try {
		const normalizedPath = path.normalize(filePath);
		const fileInfo = path.parse(normalizedPath);
		return fileInfo;
	} catch (error) {
		if (error instanceof Error)
			console.error(`Got an error trying to read the file: ${error.message}`);
	}
}

const googleFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const SCOPE = ['https://www.googleapis.com/auth/drive'];

const run = async () => {
	try {
		const filePath = await askForFilePath();
		const fileData = await readFileByPath(filePath);

		if (!fileData) {
			throw Error('');
		}

		displayFileInfo(fileData);

		const confirmRename = await confirmRenameFile(fileData?.name);

		let newFileName;
		if (confirmRename) {
			newFileName = await askForNewFileName();
		}
		const authClient = await authorize(apikeys as ApiKeys, SCOPE);
		const drive = google.drive({ version: 'v3', auth: authClient });
		const fileMetaData = {
			name: newFileName || fileData?.name,
			parents: [googleFolderId],
		};
		const media = {
			body: fs.createReadStream(path.normalize(filePath)),
			mimeType: 'image/jpeg',
		};

		const fileId =
			(
				await drive.files.create({
					requestBody: fileMetaData,
					media,
					fields: 'id',
				})
			).data.id || '';
		const publicUrl = (await generatePublicUrl(drive, fileId))?.data.webViewLink;

		const shortenLinkConfirmed = await confirmShortenLink();
		let shortenUrl;
		if (shortenLinkConfirmed && publicUrl) {
			shortenUrl = await createShortenedLink({ url: publicUrl });
			console.log('Your shorten link: ' + shortenUrl.data.tiny_url);
			process.exit(0);
		}

		console.log(publicUrl);
		process.exit(0);
	} catch (error) {
		console.log(error);
	}
};

run();
