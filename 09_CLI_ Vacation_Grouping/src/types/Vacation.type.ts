export type Vacation = {
	userId: string;
	name: string;
	weekendDates: {
		startDate: string;
		endDate: string;
	}[];
};

export type VacationRequest = {
	_id: string;
	user: {
		_id: string;
		name: string;
	};
	usedDays: number;
	startDate: string;
	endDate: string;
	status?: string;
};
