import vacations from '../vacations.json';
import { groupVacationByUsers } from './helper/groupVacationByUsers.helper';

const run = async () => {
	try {
		const vacationsGroupedByUser = groupVacationByUsers(vacations);
		console.log(JSON.stringify(vacationsGroupedByUser, null, 4));
	} catch (error) {
		console.error(error);
	}
};

run();
