import { fail, redirect } from '@sveltejs/kit';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/apartments`;

function parseApartmentForm(formData: FormData, isNew: boolean) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (isNew && !field('buildingId')) errors.buildingId = 'Bitte wählen Sie ein Gebäude aus';
	if (!field('number')) errors.number = 'Wohnungsnummer ist erforderlich';
	if (!field('floor')) errors.floor = 'Stockwerk ist erforderlich';
	if (!field('area')) errors.area = 'Fläche ist erforderlich';
	if (!field('rooms')) errors.rooms = 'Zimmeranzahl ist erforderlich';

	const apartment = {
		number: field('number'),
		floor: Number(field('floor')),
		area: field('area'),
		rooms: field('rooms')
	};
	// A new apartment starts vacant; contracts make it occupied
	const body = isNew
		? { buildingId: field('buildingId'), ...apartment, status: 'vacant' }
		: { ...apartment, status: field('status') || undefined };
	return { body, errors };
}

/** Form action body shared by "Neue Wohnung" (POST) and "Wohnung bearbeiten" (PUT) */
export async function saveApartment(fetch: typeof globalThis.fetch, request: Request, id?: string) {
	const { body, errors } = parseApartmentForm(await request.formData(), !id);
	if (Object.keys(errors).length > 0) return fail(400, { errors });

	const response = await fetch(id ? `${API}/${id}` : API, {
		method: id ? 'PUT' : 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const saved = await response.json().catch(() => ({}));
	if (!response.ok) {
		// 409: the apartment number is taken, the backend says which one
		const message = response.status === 409 ? saved.error : 'Wohnung konnte nicht gespeichert werden.';
		return fail(response.status, { errors: { form: message } as Record<string, string> });
	}
	throw redirect(303, `/apartments/${id ?? saved.id}`);
}
