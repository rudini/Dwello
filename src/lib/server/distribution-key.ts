import { error } from '@sveltejs/kit';
import type { DistributionKeyRow, FormulaTest } from '$lib/distribution-key';
import { deleteRecord, fetchRecord, saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/distribution-keys`;
const LIST = '/config/distribution-keys';

/** Backend key as shown in the German interface: `name` stays the English key */
export function toDistributionKey(d: Record<string, unknown>): DistributionKeyRow {
	return {
		id: d.id as string,
		name: (d.nameDE || d.name || '') as string,
		type: d.type === 'custom' ? 'custom' : 'predefined',
		formula: (d.formula || '') as string,
		description: (d.description || '') as string,
		usageCount: Number(d.invoiceCount) || 0
	};
}

/** Only custom keys can be edited; the predefined ones follow Swiss practice */
export async function fetchCustomKey(fetch: typeof globalThis.fetch, id: string) {
	const key = toDistributionKey(await fetchRecord(fetch, `${API}/${id}`, 'Verteilschlüssel'));
	if (key.type === 'predefined')
		throw error(403, 'Vordefinierte Verteilschlüssel können nicht bearbeitet werden');
	return key;
}

async function parseKey(request: Request) {
	const formData = await request.formData();
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = 'Name ist erforderlich';
	if (!field('formula')) errors.formula = 'Bitte geben Sie eine Formel ein.';
	return {
		name: field('name'),
		body: { description: field('description'), formula: field('formula') },
		errors
	};
}

const options = {
	failure: (_status: number, saved: { error?: string }) =>
		saved.error ?? 'Verteilschlüssel konnte nicht gespeichert werden.',
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
	deleteRecord(fetch, `${API}/${id}`, 'Verteilschlüssel konnte nicht gelöscht werden.', LIST);

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
	const { results = [], errors = [] }: { results?: Sample[]; errors?: string[] } = await response
		.json()
		.catch(() => ({}));
	return {
		test: {
			errors,
			results: results.map(({ apartment, share }) => ({
				apartment: `${apartment.area} m², ${apartment.rooms} Zimmer`,
				share
			}))
		}
	};
}
