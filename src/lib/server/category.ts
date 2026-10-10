import type { Category } from '$lib/types';
import { deleteRecord, fetchRecord, saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/categories`;
const LIST = '/config/categories';

export type CategoryWithUsage = Category & { usageCount: number; predefined: boolean };

/** Backend category as shown in the German interface: `name` stays the English key for invoice recognition */
export function toCategory(c: Record<string, unknown>): CategoryWithUsage {
	return {
		id: c.id as string,
		name: (c.nameDE || c.name || '') as string,
		nameFR: (c.nameFR || '') as string,
		nameIT: (c.nameIT || '') as string,
		nameEN: (c.nameEN || '') as string,
		isAllowedUtilityCost: (c.isAllowedUtilityCost ?? true) as boolean,
		description: (c.description || '') as string,
		sortOrder: Number(c.sortOrder) || 0,
		usageCount: Number(c.invoiceCount) || 0,
		// Dwello's own categories keep their English key (and English description); one recorded here is keyed by its German name
		predefined: !!c.nameDE && c.name !== c.nameDE
	};
}

export const fetchCategory = async (fetch: typeof globalThis.fetch, id: string) =>
	toCategory(await fetchRecord(fetch, `${API}/${id}`, 'Kategorie'));

function parseCategory(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (!field('name')) errors.name = 'Name ist erforderlich';
	const body = {
		nameDE: field('name'),
		description: field('description'),
		isAllowedUtilityCost: formData.get('isAllowedUtilityCost') === 'on',
		...(field('sortOrder') && { sortOrder: Number(field('sortOrder')) }),
		nameFR: field('nameFR') || null,
		nameIT: field('nameIT') || null,
		nameEN: field('nameEN') || null
	};
	return { body, errors };
}

const options = {
	failure: (_status: number, saved: { error?: string }) =>
		saved.error ?? 'Kategorie konnte nicht gespeichert werden.',
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

/** "Kategorie bearbeiten": renames only the German name, the key stays */
export async function updateCategory(fetch: typeof globalThis.fetch, request: Request, id: string) {
	return saveRecord(fetch, API, parseCategory(await request.formData()), id, options);
}

export const deleteCategory = (fetch: typeof globalThis.fetch, id: string) =>
	deleteRecord(fetch, `${API}/${id}`, 'Kategorie konnte nicht gelöscht werden.', LIST);
