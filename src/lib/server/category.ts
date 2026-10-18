import { error, fail } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { localName } from '$lib/names';
import type { Category } from '$lib/types';
import { deleteRecord, fetchRecord, saveRecord } from './save-form';

const BACKEND = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;
const API = `${BACKEND}/categories`;
const LIST = '/config/categories';

export type CategoryWithUsage = Category & { key: string; usageCount: number; predefined: boolean };

/** Backend category as shown in the German interface: `name` stays the English key for invoice recognition */
export function toCategory(c: Record<string, unknown>): CategoryWithUsage {
	return {
		id: c.id as string,
		// The stored name: the English key of a predefined category, which names its reason (#186)
		key: (c.name || '') as string,
		name: (c.nameDE || c.name || '') as string,
		nameFR: (c.nameFR || '') as string,
		nameIT: (c.nameIT || '') as string,
		nameEN: (c.nameEN || '') as string,
		isAllowedUtilityCost: (c.isAllowedUtilityCost ?? true) as boolean,
		isHeatingCost: (c.isHeatingCost ?? false) as boolean,
		isFuel: (c.isFuel ?? false) as boolean,
		description: (c.description || '') as string,
		sortOrder: Number(c.sortOrder) || 0,
		usageCount: Number(c.invoiceCount) || 0,
		// Dwello's own categories (English key and description) as the backend stores them
		predefined: c.type === 'predefined'
	};
}

/** Whether the operator switched the KI on; unknown counts as on, so a refusal says why (#219) */
export const kiEnabled = (fetch: typeof globalThis.fetch) =>
	fetch(`${BACKEND}/invoices/llm-recipient`)
		.then((response) => response.json())
		.then((answer) => answer.enabled !== false)
		.catch(() => true);

/**
 * The umlagefähige categories a Mietvertrag can agree (#91), named in the UI language; a list that failed to load
 * would save every category as not agreed, so the page fails instead
 */
export async function agreeableCategories(fetch: typeof globalThis.fetch) {
	const response = await fetch(`${API}?limit=100`);
	if (!response.ok) throw error(response.status, m.buildings_categories_load_failed());
	const { categories } = (await response.json()) as { categories: Record<string, unknown>[] };
	return categories
		.filter((category) => category.isAllowedUtilityCost)
		.map((category) => ({
			id: category.id as string,
			name: localName(category as Parameters<typeof localName>[0])
		}));
}

export const fetchCategory = async (fetch: typeof globalThis.fetch, id: string) =>
	toCategory(await fetchRecord(fetch, `${API}/${id}`, m.buildings_category()));

function parseCategory(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = m.categories_error_name_required();
	// No default: a category is never umlagefähig just because nobody looked (#176)
	const allowed = field('isAllowedUtilityCost');
	if (allowed !== 'true' && allowed !== 'false')
		errors.isAllowedUtilityCost = m.categories_error_allocable_required();
	const body = {
		nameDE: field('name'),
		description: field('description'),
		isAllowedUtilityCost: allowed === 'true',
		isHeatingCost: formData.get('isHeatingCost') === 'on',
		// only with heating costs, which the backend keeps (#100)
		isFuel: formData.get('isFuel') === 'on',
		...(field('sortOrder') && { sortOrder: Number(field('sortOrder')) }),
		nameFR: field('nameFR') || null,
		nameIT: field('nameIT') || null,
		nameEN: field('nameEN') || null
	};
	return { body, errors };
}

const options = {
	failure: (_status: number, saved: BackendError) =>
		backendMessage(saved, m.categories_save_failed()),
	location: () => LIST,
	conflict: 'name' // the backend refuses only a name another category has
};

/** "Neue Kategorie": the German name also becomes the category's key */
export async function createCategory(fetch: typeof globalThis.fetch, request: Request) {
	const { body, errors } = parseCategory(await request.formData());
	return saveRecord(
		fetch,
		API,
		{ body: { name: body.nameDE, ...body }, errors },
		undefined,
		options
	);
}

/** The KI's proposal whether a new category is umlagefähig, or why there is none, for what it checked */
export type Proposal = { name: string; description: string } & (
	{ isAllowedUtilityCost: boolean; reasoning: string } | { error: string }
);

/** "Von der KI prüfen lassen": asks the KI with the name and description the form holds */
export async function proposeAllocability(fetch: typeof globalThis.fetch, request: Request) {
	const { body, errors } = parseCategory(await request.formData());
	if (errors.name) return fail(400, { errors: { name: errors.name } });
	const response = await fetch(`${API}/propose`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: body.nameDE,
			description: body.description,
			language: getLocale()
		})
	});
	const answer = await response.json().catch(() => null);
	// Without a proposal the backend says whether the KI is unsure or not reachable (#186); any other refusal, in its
	// own words, counts as not reachable
	const proposal: Proposal =
		response.ok && answer
			? {
					name: body.nameDE,
					description: body.description,
					isAllowedUtilityCost: answer.isAllowedUtilityCost === true,
					reasoning: String(answer.reasoning ?? '')
				}
			: {
					name: body.nameDE,
					description: body.description,
					error:
						answer?.code === 'KI_PROPOSAL_UNSURE'
							? m.backend_ki_proposal_unsure()
							: m.backend_ki_proposal_unavailable()
				};
	return { proposal };
}

/** "Kategorie bearbeiten": renames only the German name, the key stays */
export async function updateCategory(fetch: typeof globalThis.fetch, request: Request, id: string) {
	return saveRecord(fetch, API, parseCategory(await request.formData()), id, options);
}

export const deleteCategory = (fetch: typeof globalThis.fetch, id: string) =>
	deleteRecord(fetch, `${API}/${id}`, m.categories_delete_failed(), LIST);
