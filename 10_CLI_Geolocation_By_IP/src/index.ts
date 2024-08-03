import { IpToNumber } from './utils/IpToNumber.util';

const run = async () => {
	try {
		const integer = IpToNumber('45.232.208.143');
		console.log(integer);
	} catch (error) {
		console.error(error);
	}
};

run();
