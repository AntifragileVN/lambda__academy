import { input, select } from '@inquirer/prompts';

type Gender = 'male' | 'female';

type User = {
	name: string;
	gender: Gender;
	age: number;
};

const USERS: Array<User> = [];

const createUser = async (): Promise<void> => {
	const name = await input({ message: 'Enter your name' });
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
	console.log(USERS);
};

createUser();
