/**
 * H-28 (#717): the checks of the building form (product owner 23.10.2026: form validation belongs in the backend). Each
 * failed check is a code with the field it is about, so the form shows its message there; all of them at once.
 */
import type { ErrorCode } from './coded-error';
import { swissToday } from './today';

type Entered = { name?: string; address?: string; postalCode?: string; city?: string; canton?: string; yearBuilt?: number | null };
type EnteredApartment = { number?: string; floor?: string | number; area?: string; rooms?: string };

const blank = (value: unknown) => String(value ?? '').trim() === '';

/** The building's fields; a field not sent (a change in part) is not checked */
export function buildingFieldErrors(b: Entered, today = swissToday()): ErrorCode[] {
	const errors: ErrorCode[] = [];
	const required = (field: keyof Entered, code: string) => {
		if (field in b && blank(b[field])) errors.push({ code, params: { field } });
	};
	required('name', 'BUILDING_NAME_REQUIRED');
	required('address', 'BUILDING_ADDRESS_REQUIRED');
	if ('postalCode' in b) {
		if (blank(b.postalCode)) errors.push({ code: 'POSTAL_CODE_REQUIRED', params: { field: 'postalCode' } });
		else if (!/^\d{4}$/.test(b.postalCode!.trim())) errors.push({ code: 'POSTAL_CODE_DIGITS', params: { field: 'postalCode' } });
	}
	required('city', 'BUILDING_CITY_REQUIRED');
	required('canton', 'BUILDING_CANTON_REQUIRED');
	const year = b.yearBuilt;
	if (year != null && !(year >= 1800 && year <= Number(today.slice(0, 4))))
		errors.push({ code: 'BUILDING_YEAR_BUILT_INVALID', params: { field: 'yearBuilt' } });
	return errors;
}

// the columns: decimal(8,2) above 0 and decimal(3,1) in half rooms
const decimals = {
	area: { pattern: /^\d{1,6}(\.\d{1,2})?$/, code: 'APARTMENT_AREA_INVALID' },
	rooms: { pattern: /^\d{1,2}(\.[05])?$/, code: 'APARTMENT_ROOMS_INVALID' }
};

/** A Fläche or Zimmeranzahl as entered, with a comma or a point */
export const decimalOf = (value: unknown) => String(value ?? '').trim().replace(',', '.');

/** The Wohnungen taken from the Gebäuderegister (#479), each field keyed `apartments.<index>.<field>` */
export function apartmentFieldErrors(apartments: EnteredApartment[]): ErrorCode[] {
	return apartments.flatMap((a, i) => {
		const at = (key: string) => `apartments.${i}.${key}`;
		const missing = (
			[
				['number', 'APARTMENT_NUMBER_REQUIRED'],
				['floor', 'APARTMENT_FLOOR_REQUIRED'],
				['area', 'APARTMENT_AREA_REQUIRED'],
				['rooms', 'APARTMENT_ROOMS_REQUIRED']
			] as const
		).flatMap(([key, code]) => (blank(a[key]) ? [{ code, params: { field: at(key) } }] : []));
		const invalid = (['area', 'rooms'] as const).flatMap((key) => {
			const value = decimalOf(a[key]);
			const { pattern, code } = decimals[key];
			return value && !(pattern.test(value) && Number(value) > 0) ? [{ code, params: { field: at(key) } }] : [];
		});
		return [...missing, ...invalid];
	});
}
