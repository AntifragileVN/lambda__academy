export const IpToNumber = (ip: string) => {
	const parts = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (parts) {
		let integerIp = 0;
		let power = 1;
		for (let i = 4; i >= 1; i -= 1) {
			integerIp += power * parseInt(parts[i]);
			power *= 256;
		}
		return integerIp;
	}
	return -1;
};
