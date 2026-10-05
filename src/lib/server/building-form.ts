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
		yearBuilt: yearBuilt ? Number(yearBuilt) : null
	};

	const errors: Record<string, string> = {};
	if (!building.name) errors.name = 'Gebäudename ist erforderlich';
	if (!building.address) errors.address = 'Adresse ist erforderlich';
	if (!building.postalCode) errors.postalCode = 'PLZ ist erforderlich';
	else if (!/^\d{4}$/.test(building.postalCode)) errors.postalCode = 'PLZ muss 4 Ziffern haben';
	if (!building.city) errors.city = 'Stadt ist erforderlich';
	if (!building.canton) errors.canton = 'Kanton ist erforderlich';
	const year = building.yearBuilt;
	if (year !== null && !(year >= 1800 && year <= new Date().getFullYear())) {
		errors.yearBuilt = 'Baujahr muss zwischen 1800 und heute liegen';
	}

	return { building, errors };
}
