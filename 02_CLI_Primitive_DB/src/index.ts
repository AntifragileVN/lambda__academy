import { confirm } from '@inquirer/prompts';
import { User } from './types/user.type';
import { createUser, findUserByName } from './services/user.service';

const USERS: Array<User> = [];

const run = async () => {
	await createUser(USERS);
	if (USERS.length === 0) {
		console.log('There is no users in database');
		process.exit(0);
	}
	const confirmSearch = await confirm({ message: 'Find a user by name ?' });
	if (!confirmSearch) {
		process.exit(0);
	}
	await findUserByName(USERS);
	process.exit(0);
};

run();
