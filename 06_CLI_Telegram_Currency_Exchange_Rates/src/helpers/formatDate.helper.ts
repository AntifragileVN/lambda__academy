export const formatDate = (date: Date) => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	};

	return new Intl.DateTimeFormat('uk-UA', options).format(date);
};
