import { m } from '$lib/paraglide/messages';
import { fail, redirect } from '@sveltejs/kit';
import { countryCodes, languageLabels } from '$lib/tenant';
import { refusedFields } from '$lib/backend-error';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

function readFields(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	return {
		firstName: field('firstName'),
		lastName: field('lastName'),
		email: field('email'),
		phone: field('phone'),
		address: field('address'),
		postalCode: field('postalCode'),
		city: field('city'),
		country: countryCodes.includes(field('country')) ? field('country') : 'CH',
		correspondenceChannel: field('correspondenceChannel') === 'email' ? 'email' : 'letter',
		language: field('language') in languageLabels ? field('language') : 'de'
	};
}

/** The tenant as entered; the backend checks it (H-28, #717) */
export function parseTenantForm(formData: FormData) {
	const fields = readFields(formData);
	const tenant = {
		...fields,
		email: fields.email || null,
		phone: fields.phone || null,
		address: fields.address || null,
		postalCode: fields.postalCode || null,
		city: fields.city || null
	};
	return { tenant };
}

/** Form action body shared by "Neuer Mieter" (POST) and "Mieter bearbeiten" (PUT) */
export async function saveTenant(fetch: typeof globalThis.fetch, request: Request, id?: string) {
	const formData = await request.formData();
	const { tenant } = parseTenantForm(formData);

	const response = await fetch(`${BACKEND_URL}/api/v1/tenants${id ? `/${id}` : ''}`, {
		method: id ? 'PUT' : 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(tenant)
	});
	if (!response.ok) {
		const refused = await response.json().catch(() => ({}));
		// the form's checks are the backend's (H-28, #717): each at its field
		const errors = refused.causes ? refusedFields(refused) : { form: m.tenants_save_failed() };
		return fail(response.status, { errors });
	}
	const saved = await response.json();
	// Created from the rental contract wizard: back there, with the new tenant chosen
	if (formData.get('for') === 'contract') {
		const apartment = String(formData.get('apartment') ?? ''); // chosen before the detour (#144)
		const kept = apartment ? `&apartment=${encodeURIComponent(apartment)}` : '';
		throw redirect(303, `/contracts/new?tenant=${saved.id}&created=1${kept}`);
	}
	throw redirect(303, `/tenants/${id ?? saved.id}`);
}
