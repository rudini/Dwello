import { m } from '$lib/paraglide/messages';
import { backendMessage } from '$lib/backend-error';
import { saveRecord } from './save-form';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/apartments`;

function parseApartmentForm(formData: FormData, isNew: boolean) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const errors: Record<string, string> = {};
	if (isNew && !field('buildingId')) errors.buildingId = m.apartments_error_building();
	if (!field('number')) errors.number = m.apartments_error_number();
	if (!field('floor')) errors.floor = m.apartments_error_floor();
	if (!field('area')) errors.area = m.apartments_error_area();
	if (!field('rooms')) errors.rooms = m.apartments_error_rooms();

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
	return saveRecord(fetch, API, parseApartmentForm(await request.formData(), !id), id, {
		// 409: the apartment number is taken, the backend says which one
		failure: (status, saved) =>
			status === 409
				? backendMessage(saved, m.apartments_save_failed())
				: m.apartments_save_failed(),
		location: (saved) => `/apartments/${saved}`
	});
}
