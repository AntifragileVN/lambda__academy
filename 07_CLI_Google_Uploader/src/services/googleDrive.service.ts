import fs from 'fs';
import { google } from 'googleapis';

import type { drive_v3 } from 'googleapis';
import type { ApiKeys } from '../types/index.type';

export const authorize = async (apikeys: ApiKeys, SCOPE: string[]) => {
	const jwtClient = new google.auth.JWT(
		apikeys.client_email,
		undefined,
		apikeys.private_key,
		SCOPE
	);
	await jwtClient.authorize();
	return jwtClient;
};

type UploadFie = {
	parents: string[];
};

export const uploadFile = async (drive: drive_v3.Drive, fileMetaData: UploadFie) => {
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

export const generatePublicUrl = async (drive: drive_v3.Drive, fileId: string) => {
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
};
