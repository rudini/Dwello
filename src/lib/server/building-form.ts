import { backendMessage, type BackendError } from '$lib/backend-error';

export const formError = (form: string) => ({
	success: false,
	errors: { form } as Record<string, string>
});

/** The building as entered; the backend checks it (H-28, #717) */
export function parseBuildingForm(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const yearBuilt = field('yearBuilt');
	const building = {
		name: field('name'),
		address: field('address'),
		postalCode: field('postalCode'),
		city: field('city'),
		canton: field('canton'),
		buildingType: field('buildingType') || undefined,
		yearBuilt: yearBuilt ? Number(yearBuilt) : null,
		noTank: formData.has('noTank')
	};
	return { building };
}

/**
 * The Wohnungen taken from the Gebäuderegister (#479), as `apartments.<row>.<field>`: rows the landlord left out are
 * disabled in the form and not sent. As entered; `rows` names the form row of each one sent, for the backend's refusals.
 */
export function parseRegisterApartments(formData: FormData) {
	const rows = [
		...new Set([...formData.keys()].flatMap((key) => key.match(/^apartments\.(\d+)\./)?.[1] ?? []))
	];
	const field = (row: string, key: string) =>
		String(formData.get(`apartments.${row}.${key}`) ?? '').trim();
	const apartments = rows.map((row) => ({
		number: field(row, 'number'),
		floor: field(row, 'floor'),
		area: field(row, 'area'),
		rooms: field(row, 'rooms')
	}));
	return { apartments, rows };
}

/**
 * The backend's refusal of the form, each message at the field it names (H-28, #717); an apartment's field
 * (`apartments.<index>.<field>`) at the form row it came from
 */
export function refusedFields(refused: BackendError, rows: string[] = []): Record<string, string> {
	return Object.fromEntries(
		(refused.causes ?? []).map((cause) => {
			const field = String(cause.params?.field ?? 'form').replace(
				/^apartments\.(\d+)\./,
				(_, index) => `apartments.${rows[Number(index)]}.`
			);
			return [field, backendMessage(cause, '')];
		})
	);
}
