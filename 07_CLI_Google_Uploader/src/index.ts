import fs from 'fs';
import { google } from 'googleapis';
import 'dotenv/config';
import { confirm } from '@inquirer/prompts';
import apikeys from '../apikey.json';

import type { drive_v3 } from 'googleapis';

process.stdin.on('data', (key) => {
	if (key.toString() == '\u0003') {
		process.exit(0);
	}
});

const googleFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const SCOPE = ['https://www.googleapis.com/auth/drive'];

const authorize = async () => {
	const jwtClient = new google.auth.JWT(
		apikeys.client_email,
		undefined,
		apikeys.private_key,
		SCOPE
	);
	await jwtClient.authorize();
	return jwtClient;
};

const uploadFile = async (drive: drive_v3.Drive) => {
	const fileMetaData = {
		name: 'text.txt',
		parents: [googleFolderId],
	};

	const res = await drive.files.create({
		requestBody: fileMetaData,
		media: {
			body: fs.createReadStream('text.txt'),
			mimeType: 'text/plain',
		},
		fields: 'id',
	});
	return res.data.id;
};

async function generatePublicUrl(drive: drive_v3.Drive, fileId: string) {
	try {
		await drive.permissions.create({
			fileId: fileId,
			requestBody: {
				role: 'reader',
				type: 'anyone',
			},
		});
		const result = await drive.files.get({
			fileId: fileId,
			fields: 'webViewLink, webContentLink',
		});
		return result;
	} catch (err) {
		console.log(err);
	}
}

const run = async () => {
	try {
		const authClient = await authorize();
		const drive = google.drive({ version: 'v3', auth: authClient });
		const fileId = (await uploadFile(drive)) || '';
		const response = await generatePublicUrl(drive, fileId);
		const publicUrl = response?.data.webViewLink;

		console.log(publicUrl);
	} catch (error) {
		console.log(error);
	}
};

run();
