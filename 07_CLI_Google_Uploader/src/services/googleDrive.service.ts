import type { drive_v3 } from 'googleapis';

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
