import { m } from '$lib/paraglide/messages';

export const formError = (form: string) => ({
	success: false,
	errors: { form } as Record<string, string>
});

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

	const errors: Record<string, string> = {};
	if (!building.name) errors.name = m.buildings_error_name();
	if (!building.address) errors.address = m.buildings_error_address();
	if (!building.postalCode) errors.postalCode = m.buildings_error_postal_code();
	else if (!/^\d{4}$/.test(building.postalCode))
		errors.postalCode = m.buildings_error_postal_code_digits();
	if (!building.city) errors.city = m.buildings_error_city();
	if (!building.canton) errors.canton = m.buildings_error_canton();
	const year = building.yearBuilt;
	if (year !== null && !(year >= 1800 && year <= new Date().getFullYear())) {
		errors.yearBuilt = m.buildings_error_year_built();
	}

	return { building, errors };
}
