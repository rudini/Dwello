import { backendMessage, type BackendError } from '$lib/backend-error';
import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import type { FormulaTest } from '$lib/distribution-key';
import type { DistributionKey, Json } from '$lib/types';
import type { DistributionKeyWithUsage } from '../../../backend/src/api/distribution-key';
import type { InvoiceWithDetails } from '../../../backend/src/api/invoice';
import { deleteRecord, fetchRecord, nameTranslations, saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/distribution-keys`;
const LIST = '/config/distribution-keys';

/** A row of `GET /distribution-keys` or the key an invoice names, which has only some of the fields */
export type DistributionKeyRow = NonNullable<InvoiceWithDetails['distributionKey']> &
	Partial<Json<DistributionKeyWithUsage>>;

/** Backend key as shown in the German interface: `name` stays the English key */
export function toDistributionKey(d: DistributionKeyRow): DistributionKey {
	return {
		id: d.id,
		name: d.nameDE || d.name,
		nameFR: d.nameFR,
		nameIT: d.nameIT,
		nameEN: d.nameEN,
		type: d.type === 'custom' ? 'custom' : 'predefined',
		formula: d.formula || '',
		description: d.description || '',
		usageCount: Number(d.invoiceCount) || 0
	};
}

/** All keys, predefined and custom, or an error page when the backend does not answer */
export async function listDistributionKeys(
	fetch: typeof globalThis.fetch
): Promise<DistributionKey[]> {
	const response = await fetch(`${API}?limit=1000`); // all of them (#588)
	if (!response.ok) throw error(response.status, m.keys_load_failed());
	const { data = [] }: { data?: DistributionKeyRow[] } = await response.json();
	return data.map(toDistributionKey);
}

/** Only custom keys can be edited; the predefined ones follow Swiss practice */
export async function fetchCustomKey(fetch: typeof globalThis.fetch, id: string) {
	const key = toDistributionKey(await fetchRecord(fetch, `${API}/${id}`, m.glossary_key_term()));
	if (key.type === 'predefined') throw error(403, m.keys_predefined_not_editable());
	return key;
}

async function parseKey(request: Request) {
	const formData = await request.formData();
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = m.categories_error_name_required();
	if (!field('formula')) errors.formula = m.backend_formula_required();
	return {
		name: field('name'),
		body: { description: field('description'), formula: field('formula'), ...nameTranslations(field) },
		errors
	};
}

const options = {
	failure: (_status: number, saved: BackendError) => backendMessage(saved, m.keys_save_failed()),
	location: () => LIST
};

/** "Neuer Verteilschlüssel": the German name also becomes the key's name */
export async function createDistributionKey(fetch: typeof globalThis.fetch, request: Request) {
	const { name, body, errors } = await parseKey(request);
	return saveRecord(
		fetch,
		API,
		{ body: { name, nameDE: name, type: 'custom', ...body }, errors },
		undefined,
		options
	);
}

/** "Verteilschlüssel bearbeiten": renames only the German name */
export async function updateDistributionKey(
	fetch: typeof globalThis.fetch,
	request: Request,
	id: string
) {
	const { name, body, errors } = await parseKey(request);
	return saveRecord(fetch, API, { body: { nameDE: name, ...body }, errors }, id, options);
}

export const deleteDistributionKey = (fetch: typeof globalThis.fetch, id: string) =>
	deleteRecord(fetch, `${API}/${id}`, m.keys_delete_failed(), LIST);

type Sample = { apartment: { area: number; rooms: number }; share: string };

/** "Formel testen": shares of four sample apartments, calculated by the backend */
export async function testFormula(
	fetch: typeof globalThis.fetch,
	request: Request
): Promise<{ test: FormulaTest }> {
	const formula = String((await request.formData()).get('formula') ?? '').trim();
	const response = await fetch(`${API}/test-formula`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ formula })
	});
	const {
		results = [],
		errors = [],
		errorCodes = []
	}: { results?: Sample[]; errors?: string[]; errorCodes?: BackendError[] } = await response
		.json()
		.catch(() => ({}));
	return {
		test: {
			errors: errors.map((_, i) => backendMessage(errorCodes[i], m.keys_test_failed())),
			results: results.map(({ apartment, share }) => ({
				apartment: m.keys_sample_apartment(apartment),
				share
			}))
		}
	};
}
