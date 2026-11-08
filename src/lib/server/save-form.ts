import { backendMessage, refusedFields, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { error, fail, redirect } from '@sveltejs/kit';

type Saved = { id?: string } & BackendError;

/**
 * Form action body: reports the form's errors, or sends the record to the backend
 * (POST creates it, PUT with an id updates it) and opens the saved record.
 * A refusal is shown for the whole form, for `options.conflict` when the backend answers 409 (e.g. a name taken),
 * for the field `options.field` names after the refusal's code (e.g. a formula error at «Formel»), or each at the
 * field its cause names.
 */
export async function saveRecord(
	fetch: typeof globalThis.fetch,
	url: string,
	{ body, errors }: { body: object; errors: Record<string, string> },
	id: string | undefined,
	options: {
		failure: (status: number, saved: Saved) => string;
		location: (id: string) => string;
		conflict?: string;
		field?: (saved: Saved) => string | undefined;
	}
) {
	if (Object.keys(errors).length > 0) return fail(400, { errors });

	const response = await fetch(id ? `${url}/${id}` : url, {
		method: id ? 'PUT' : 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const saved: Saved = await response.json().catch(() => ({}));
	if (!response.ok) {
		// refused fields, e.g. a text longer than its column (#1201): each message at its field; the German name an
		// edit sends as nameDE is the form's «Name»
		if (saved.causes?.every((cause) => cause.params?.field)) {
			const { nameDE, ...errors } = refusedFields(saved);
			return fail(response.status, {
				errors: { ...(nameDE && { name: nameDE }), ...errors } as Record<string, string>
			});
		}
		const key = (response.status === 409 && options.conflict) || options.field?.(saved) || 'form';
		const message = options.failure(response.status, saved);
		return fail(response.status, { errors: { [key]: message } as Record<string, string> });
	}
	throw redirect(303, options.location(id ?? saved.id!));
}

/** Form action body: deletes the record and opens `location`, or reports why the backend keeps it */
export async function deleteRecord(
	fetch: typeof globalThis.fetch,
	url: string,
	failure: string,
	location: string
) {
	const response = await fetch(url, { method: 'DELETE' });
	if (!response.ok) {
		const body: BackendError = await response.json().catch(() => ({}));
		return fail(response.status, { error: backendMessage(body, failure) });
	}
	throw redirect(303, location);
}

/** Page load body: the record as JSON, or an error page naming what is missing */
export async function fetchRecord(fetch: typeof globalThis.fetch, url: string, record: string) {
	const response = await fetch(url);
	if (response.status === 404) throw error(404, m.record_not_found({ record }));
	if (!response.ok) throw error(response.status, m.record_not_loaded({ record }));
	return response.json();
}

/** The optional fr/it/en names of a form (`NameTranslations.svelte`); an empty one is none, so the German name stands */
export const nameTranslations = (field: (key: string) => string) => ({
	nameFR: field('nameFR') || null,
	nameIT: field('nameIT') || null,
	nameEN: field('nameEN') || null
});
