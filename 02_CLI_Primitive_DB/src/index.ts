import { input, select, confirm } from '@inquirer/prompts';

type Gender = 'male' | 'female';

type User = {
	name: string;
	gender: Gender;
	age: number;
};

const USERS: Array<User> = [];

const findUserByName = async () => {
	const confirmSearch = await confirm({ message: 'Find a user by name ?' });
	if (!confirmSearch) {
		process.exit(0);
	}

	const searchedUserName = await input({ message: 'Enter searched user name' });

	console.log(USERS);
};

const createUser = async (): Promise<void> => {
	const name = await input({ message: 'Enter your name' });
	if (name === '') {
		findUserByName();
		return;
	}
	const gender = (await select({
		message: 'Select gender',
		choices: [
			{
				name: 'male',
				value: 'male',
			},
			{
				name: 'female',
				value: 'female',
			},
		],
	})) as Gender;

	const age = await input({ message: 'Enter your age' });

	USERS.push({ name, gender, age: parseInt(age) });
	createUser();
	return;
};

createUser();
