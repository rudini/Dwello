import { fetchRecord } from '$lib/server/save-form';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Who receives invoice data for the KI categorization: null while the model runs on the operator's server
export const load: PageServerLoad = async ({
	fetch
}): Promise<{ recipient: { provider: string; country: string } | null }> =>
	fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/llm-recipient`, 'Datenschutzerklärung');
