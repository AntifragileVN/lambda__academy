import { confirm } from '@inquirer/prompts';
import { User } from './types/user.type';
import { createUser, findUserByName } from './services/user.service';

const USERS: Array<User> = [];

const run = async () => {
	let continueCreating = true;
	let continueSearching = true;

	while (continueCreating) {
		const createdUser = await createUser(USERS);
		console.log(USERS);
		console.log(`\n`);
		const confirmContinue = await confirm({ message: 'Create another user ?' });
		if (!confirmContinue) {
			continueCreating = false;
		}
	}

	const confirmSearch = await confirm({ message: 'Find a user by name ?' });
	if (!confirmSearch) {
		console.log('Have a nice day ^-^');
		process.exit(0);
	}
	if (USERS.length === 0) {
		console.log('There is no users in database\n');
		process.exit(0);
	}

	while (continueSearching) {
		const foundUser = await findUserByName(USERS);
		if (foundUser) {
			console.log(foundUser);
		}
		const confirmContinue = await confirm({ message: 'Continue users searching ?' });
		if (!confirmContinue) {
			continueSearching = false;
		}
	}
	console.log('Have a nice day ^-^');
	process.exit(0);
};

run();
