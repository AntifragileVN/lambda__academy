import { input, select, confirm } from '@inquirer/prompts';
import { isNumeric } from '../helpers/isNumeric.helper';
import { User, Gender } from '../types/user.type';

export const findUserByName = async (users: Array<User>) => {
	const searchedUserName = await input({
		message: 'Enter searched user name',
		validate: (name: string) => {
			if (name.trim().length <= 0) {
				return 'Name can`t me empty string';
			}
			if (isNumeric(name)) {
				return 'Name can`t be number';
			}
			return true;
		},
		transformer: (name) => name.trim(),
	});

	const foundUser = users.filter((user) => user.name === searchedUserName);
	if (!foundUser) {
		console.log(`There is no user with name - ${searchedUserName}`);
		return null;
	}
	return foundUser;
};

export const createUser = async (users: Array<User>) => {
	const name = await input({
		message: 'Enter your name',
		validate: (name: string) => {
			if (isNumeric(name)) {
				return 'Name can`t be number';
			}
			return true;
		},
		transformer: (name) => name.trim(),
	});
	if (name === '') {
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

	const age = await input({
		message: 'Enter your age',
		validate: (age) => {
			if (!age) {
				return 'Age can`t be undefined';
			}
			if (!isNumeric(age)) {
				return 'Age must be a number';
			}
			if (parseInt(age) < 0) {
				return 'Age can`t be negative number';
			}
			if (parseInt(age) > 160) {
				return 'Age can`t be bigger than 160';
			}
			return true;
		},
	});
	const createdUser = { name, gender, age: parseInt(age) };

	users.push(createdUser);
	return createdUser;
};
