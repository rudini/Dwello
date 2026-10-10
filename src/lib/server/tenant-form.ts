import { fail, redirect } from '@sveltejs/kit';
import { languageLabels } from '$lib/tenant';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type TenantFields = ReturnType<typeof readFields>;

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
		correspondenceChannel: field('correspondenceChannel') === 'email' ? 'email' : 'letter',
		language: field('language') in languageLabels ? field('language') : 'de'
	};
}

function contactErrors(t: TenantFields) {
	const errors: Record<string, string> = {};
	if (!t.firstName) errors.firstName = 'Vorname ist erforderlich';
	if (!t.lastName) errors.lastName = 'Nachname ist erforderlich';
	if (t.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) {
		errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
	}
	if (t.postalCode && !/^\d{4}$/.test(t.postalCode)) errors.postalCode = 'PLZ muss 4 Ziffern haben';
	return errors;
}

// Reminders and other documents go out by e-mail or letter, so the chosen channel needs its address
function channelErrors(t: TenantFields) {
	const errors: Record<string, string> = {};
	if (t.correspondenceChannel === 'email' && !t.email) {
		errors.email = 'Für die Korrespondenz per E-Mail ist eine E-Mail-Adresse erforderlich';
	}
	if (t.correspondenceChannel === 'letter' && !t.address)
		errors.address = 'Für Briefe ist eine Adresse erforderlich';
	if (t.correspondenceChannel === 'letter' && !t.city)
		errors.city = 'Für Briefe ist ein Ort erforderlich';
	return errors;
}

export function parseTenantForm(formData: FormData) {
	const fields = readFields(formData);
	const errors = { ...channelErrors(fields), ...contactErrors(fields) };
	const tenant = {
		...fields,
		email: fields.email || null,
		phone: fields.phone || null,
		address: fields.address || null,
		postalCode: fields.postalCode || null,
		city: fields.city || null
	};
	return { tenant, errors };
}

/** Form action body shared by "Neuer Mieter" (POST) and "Mieter bearbeiten" (PUT) */
export async function saveTenant(fetch: typeof globalThis.fetch, request: Request, id?: string) {
	const formData = await request.formData();
	const { tenant, errors } = parseTenantForm(formData);
	if (Object.keys(errors).length > 0) return fail(400, { errors });

	const response = await fetch(`${BACKEND_URL}/api/v1/tenants${id ? `/${id}` : ''}`, {
		method: id ? 'PUT' : 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(tenant)
	});
	if (!response.ok) {
		return fail(response.status, { errors: { form: 'Mieter konnte nicht gespeichert werden.' } });
	}
	const saved = await response.json();
	// Created from the rental contract wizard: back there, with the new tenant chosen
	if (formData.get('for') === 'contract')
		throw redirect(303, `/contracts/new?tenant=${saved.id}&created=1`);
	throw redirect(303, `/tenants/${id ?? saved.id}`);
}
