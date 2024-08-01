import { Vacation, VacationRequest } from '../types/Vacation.type';

export const groupVacationByUsers = (vacations: Array<VacationRequest>) => {
	return vacations.reduce((total, current) => {
		const { user, startDate, endDate } = current;

		const foundUser = total.find((request) => request.userId === user._id);
		if (foundUser) {
			foundUser.weekendDates.push({
				startDate,
				endDate,
			});
		}
		total.push({
			userId: user._id,
			name: user.name,
			weekendDates: [
				{
					startDate,
					endDate,
				},
			],
		});
		return total;
	}, [] as Array<Vacation>);
};
