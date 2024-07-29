export type TinyUrlCreateDto = {
	url: string;
	domain?: string;
	alias?: string;
	tags?: string;
	expires_at?: string;
	description?: string;
};

interface UrlAliasData {
	domain: string;
	alias: string;
	deleted: boolean;
	archived: boolean;
	tags: string[];
	analytics: {
		enabled: boolean;
		public: boolean;
	};
	tiny_url: string;
	created_at: string;
	expires_at: string | null;
	url: string;
}

export type TinyUrlResponse = {
	data: UrlAliasData;
	code: number;
	errors: Array<string>;
};
