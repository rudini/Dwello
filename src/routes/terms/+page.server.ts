import type { PageServerLoad } from './$types';

const env = (key: string) => process.env[key]?.trim() ?? '';

// Who runs this installation (OPERATOR_* in .env): named under availability, null while not configured
export const load: PageServerLoad = () => {
	const name = env('OPERATOR_NAME');
	return { operator: name ? { name, address: env('OPERATOR_ADDRESS'), contact: env('OPERATOR_CONTACT') } : null };
};
