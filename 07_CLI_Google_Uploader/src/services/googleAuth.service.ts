import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { input } from '@inquirer/prompts';
import type { ClientSecret } from '../types/index.type';
const TOKEN_PATH = path.resolve(__dirname, '../../token.json');

export const generateOAuthClient = async (
	keysObj: ClientSecret,
	scopes: Array<string>
) => {
	const { client_secret, client_id, redirect_uris } = keysObj.installed;
	let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	try {
		const { client_secret, client_id, redirect_uris } = keysObj.installed;

		oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		google.options({ auth: oAuth2Client });

		const tokenFile = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
		if (tokenFile !== undefined && Object.keys(tokenFile).length !== 0) {
			oAuth2Client.setCredentials(tokenFile);
			await oAuth2Client.getAccessToken();
		} else {
			console.log('🤬🤬🤬 Token is empty!');
			throw new Error('Empty token');
		}
		return Promise.resolve(oAuth2Client);
	} catch (err) {
		console.log('Token not found or expired, generating a new one 🤨');
		oAuth2Client = await getAccessToken(oAuth2Client, scopes);
		return oAuth2Client;
	}
};
async function getAccessToken(oAuth2Client: OAuth2Client, scopes: Array<string>) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
	});
	console.log('⚠️ Authorize this app by visiting this url:', authUrl);
	const answer = await input({
		message: 'Enter the code from that page here:',
	});
	console.log(`🤝 Ok, your access_code is ${answer}`);
	const response = await oAuth2Client.getToken(answer);

	oAuth2Client.setCredentials(response.tokens);

	fs.writeFileSync(TOKEN_PATH, JSON.stringify(response.tokens, null, 4), 'utf-8');

	return Promise.resolve(oAuth2Client);
}
