import { m } from '$lib/paraglide/messages';
import { fetchRecord } from '$lib/server/save-form';
import { getConfiguredProviders, PROVIDER_NAMES } from '$lib/server/oauth';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Who receives invoice data for the KI categorization (null while the model runs on the operator's server),
// and the login providers this installation offers
export const load: PageServerLoad = async ({
	fetch
}): Promise<{ recipient: { provider: string; country: string } | null; providers: string[] }> => ({
	...(await fetchRecord(fetch, `${BACKEND_URL}/api/v1/invoices/llm-recipient`, m.privacy_record())),
	providers: getConfiguredProviders().map((id) => PROVIDER_NAMES[id])
});
