import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { google } from 'googleapis';
import { generatePublicUrl } from './services/googleDrive.service';
import {
	askForFilePath,
	askForNewFileName,
	confirmRenameFile,
	confirmShortenLink,
} from './services/prompts.service';
import { createShortenedLink } from './services/tinyurl.service';
import { generateOAuthClient } from './services/googleAuth.service';
import clientSecrets from '../client_secret.json';
import { readFileByPath } from './helpers/readFileByPath.helper';
import { displayFileInfo } from './helpers/displayFileInfo.helper';

import type { ClientSecret } from './types/index.type';

process.stdin.on('data', (key) => {
	if (key.toString() == '\u0003') {
		process.exit(0);
	}
});

const googleFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const SCOPE = ['https://www.googleapis.com/auth/drive'];

const run = async () => {
	try {
		const oAuth2Client = await generateOAuthClient(
			clientSecrets as ClientSecret,
			SCOPE
		);
		const drive = google.drive({ version: 'v3', auth: oAuth2Client });

		const filePath = await askForFilePath();
		const fileData = await readFileByPath(filePath);

		if (!fileData) {
			throw Error('No file data');
		}

		displayFileInfo(fileData);

		const confirmRename = await confirmRenameFile(fileData?.name);

		let newFileName;
		if (confirmRename) {
			newFileName = await askForNewFileName();
		}
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
