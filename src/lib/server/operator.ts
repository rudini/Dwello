const env = (key: string) => process.env[key]?.trim() ?? '';

/** Who runs this installation (OPERATOR_* in .env), named in the terms and the privacy statement; null while not configured */
export function loadOperator() {
	const name = env('OPERATOR_NAME');
	return name ? { name, address: env('OPERATOR_ADDRESS'), contact: env('OPERATOR_CONTACT') } : null;
}
