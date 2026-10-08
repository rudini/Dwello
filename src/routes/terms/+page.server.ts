import type { PageServerLoad } from './$types';

// Who runs this installation (OPERATOR_* in .env): named under availability, null while not configured
export const load: PageServerLoad = () => {
	const { OPERATOR_NAME: name, OPERATOR_ADDRESS: address = '', OPERATOR_CONTACT: contact = '' } = process.env;
	return { operator: name ? { name, address, contact } : null };
};
