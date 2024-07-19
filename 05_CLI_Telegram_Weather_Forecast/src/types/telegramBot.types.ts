export type TelegramBotError = {
	code: string;
	response: {
		body: {
			ok: boolean;
			error_code: number;
			description: string;
		};
	};
};
