import { Vacation, VacationRequest } from '../types/Vacation.type';

export const groupVacationByUsers = (vacations: Array<VacationRequest>) => {
	return vacations.reduce((total, current) => {
		const { user, startDate, endDate } = current;

		const foundUser = total.find((request) => request.userId === user._id);

		const vacationPeriod = {
			startDate: startDate,
			endDate: endDate,
		};

		if (foundUser) {
			foundUser.weekendDates.push(vacationPeriod);
		} else {
			total.push({
				userId: user._id,
				name: user.name,
				weekendDates: [vacationPeriod],
			});
		}
		return total;
	}, [] as Array<Vacation>);
};
