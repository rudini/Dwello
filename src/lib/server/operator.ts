const env = (key: string) => process.env[key]?.trim() ?? '';

/** Who runs this installation (OPERATOR_* in .env), named in the terms and the privacy statement; null while not configured */
export function loadOperator() {
	const name = env('OPERATOR_NAME');
	return name ? { name, address: env('OPERATOR_ADDRESS'), contact: env('OPERATOR_CONTACT') } : null;
}

/** Where the server and the SMTP mail server stand, named in the privacy statement when set (Art. 19 Abs. 4 DSG, #458) */
export function loadHosting() {
	const [name, country] = [env('MAIL_PROVIDER_NAME'), env('MAIL_PROVIDER_COUNTRY')];
	return {
		serverCountry: env('OPERATOR_SERVER_COUNTRY') || null,
		mailProvider: name && country ? { name, country } : null
	};
}
