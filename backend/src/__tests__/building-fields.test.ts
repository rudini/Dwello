/**
 * H-28 (#717): the checks of the building form are the backend's (product owner 23.10.2026: form validation belongs in
 * the backend); each failed check names its field, so the form shows it there
 */
import { describe, expect, it } from 'bun:test';
import { apartmentFieldErrors, buildingFieldErrors } from '../services/building-fields';

const entered = { name: 'Lindenhof', address: 'Lindenweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH', yearBuilt: 1965 };
const fields = (errors: { code: string; params: { field?: string | number } }[]) => errors.map(({ code, params }) => [params.field, code]);

describe('Prüfung des Gebäudeformulars', () => {
	it('lässt ein vollständiges Gebäude durch', () => {
		expect(buildingFieldErrors(entered, '2026-10-23')).toEqual([]);
	});

	it('verlangt Name, Adresse, PLZ, Ort und Kanton', () => {
		const empty = { name: '', address: ' ', postalCode: '', city: '', canton: '', yearBuilt: null };

		expect(fields(buildingFieldErrors(empty, '2026-10-23'))).toEqual([
			['name', 'BUILDING_NAME_REQUIRED'],
			['address', 'BUILDING_ADDRESS_REQUIRED'],
			['postalCode', 'POSTAL_CODE_REQUIRED'],
			['city', 'BUILDING_CITY_REQUIRED'],
			['canton', 'BUILDING_CANTON_REQUIRED']
		]);
	});

	it('verlangt eine Schweizer PLZ mit 4 Ziffern', () => {
		expect(fields(buildingFieldErrors({ ...entered, postalCode: '840' }, '2026-10-23'))).toEqual([['postalCode', 'POSTAL_CODE_DIGITS']]);
		expect(fields(buildingFieldErrors({ ...entered, postalCode: '8400a' }, '2026-10-23'))).toEqual([['postalCode', 'POSTAL_CODE_DIGITS']]);
	});

	it('verlangt ein Baujahr zwischen 1800 und dem laufenden Jahr', () => {
		const year = (yearBuilt: number) => fields(buildingFieldErrors({ ...entered, yearBuilt }, '2026-10-23'));

		expect(year(1799)).toEqual([['yearBuilt', 'BUILDING_YEAR_BUILT_INVALID']]);
		expect(year(2027)).toEqual([['yearBuilt', 'BUILDING_YEAR_BUILT_INVALID']]);
		expect(year(1800)).toEqual([]);
		expect(year(2026)).toEqual([]);
	});

	// the edit form changes a building in part: what it does not send stays as it is
	it('prüft beim Ändern nur die gesendeten Felder', () => {
		expect(fields(buildingFieldErrors({ postalCode: '84' }, '2026-10-23'))).toEqual([['postalCode', 'POSTAL_CODE_DIGITS']]);
	});
});

// #479: the Wohnungen taken from the Gebäuderegister, keyed like the form's fields
describe('Prüfung der übernommenen Wohnungen', () => {
	const apartment = { number: '1.01', floor: '1', area: '72.5', rooms: '3.5' };

	it('lässt vollständige Wohnungen durch, auch mit Komma', () => {
		expect(apartmentFieldErrors([apartment, { ...apartment, number: '1.02', area: '72,5', rooms: '3,5' }])).toEqual([]);
	});

	it('verlangt Nummer, Stockwerk, Fläche und Zimmeranzahl jeder Wohnung', () => {
		expect(fields(apartmentFieldErrors([apartment, { number: '', floor: '', area: '', rooms: '' }]))).toEqual([
			['apartments.1.number', 'APARTMENT_NUMBER_REQUIRED'],
			['apartments.1.floor', 'APARTMENT_FLOOR_REQUIRED'],
			['apartments.1.area', 'APARTMENT_AREA_REQUIRED'],
			['apartments.1.rooms', 'APARTMENT_ROOMS_REQUIRED']
		]);
	});

	// the columns: decimal(8,2) and decimal(3,1); a Fläche above 0, Zimmer in half rooms
	it.each([
		['area', '0', 'APARTMENT_AREA_INVALID'],
		['area', '72.555', 'APARTMENT_AREA_INVALID'],
		['area', '1234567', 'APARTMENT_AREA_INVALID'],
		['area', 'gross', 'APARTMENT_AREA_INVALID'],
		['rooms', '3.3', 'APARTMENT_ROOMS_INVALID'],
		['rooms', '0', 'APARTMENT_ROOMS_INVALID'],
		['rooms', '100', 'APARTMENT_ROOMS_INVALID']
	] as const)('lehnt %s «%s» ab', (key, value, code) => {
		expect(fields(apartmentFieldErrors([{ ...apartment, [key]: value }]))).toEqual([[`apartments.0.${key}`, code]]);
	});
});
