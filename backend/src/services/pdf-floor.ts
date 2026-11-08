/**
 * The floor of the apartment as the statement PDF prints it, in the tenant's language (moved from pdf.service.ts, #1284)
 */

import type { Language } from '../db/schema';

// The floor as tenants write it: ground floor, above, below
// English counts floors with ordinals: 1st, 2nd, 3rd, 4th (461-native-en, EN-32)
const ORDINAL: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const englishFloor = (word: string) => (n: number) =>
	`${n}${ORDINAL[new Intl.PluralRules('en', { type: 'ordinal' }).select(n)]} ${word}`; // below ground too (#449)
// the first floor below ground has no number, from the second on it is counted, as on the screens (#597)
const FLOORS: Record<Language, [string, (n: number) => string, string, (n: number) => string]> = {
	de: ['EG', (n) => `${n}. OG`, 'UG', (n) => `${n}. UG`],
	fr: [
		'rez-de-chaussée',
		(n) => (n === 1 ? '1er étage' : `${n}e étage`),
		'sous-sol',
		(n) => (n === 1 ? '1er sous-sol' : `${n}e sous-sol`)
	],
	it: ['pianterreno', (n) => `${n}° piano`, 'piano interrato', (n) => `${n}° piano interrato`],
	en: ['ground floor', englishFloor('floor'), 'basement', englishFloor('basement')]
};

export function formatFloor(floor: number, lang: Language): string {
	const [ground, above, basement, below] = FLOORS[lang];
	return floor === 0 ? ground : floor > 0 ? above(floor) : floor === -1 ? basement : below(-floor);
}

// «EG», «eg» or «EG Links» on the ground floor already name the floor: the PDF does not print it twice (#500);
// spaces and case do not count («1.OG»), a longer word does («EGG»)
const startsWithFloor = (number: string, name: string) =>
	new RegExp(
		`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s*')}(?=$|[\\s,-])`,
		'i'
	).test(number.trim());
// the name of the floor as many levels below ground can start with it («1° piano interrato» on floor 1): a contradiction stays;
// the first floor below ground typed with its count («1. UG») names it too (Fachreview 597-1 V-2)
const counted = (floor: number, lang: Language) => FLOORS[lang][3](Math.abs(floor));
export const namedByFloor = (number: string, floor: number, lang: Language) =>
	(startsWithFloor(number, formatFloor(floor, lang)) ||
		(floor === -1 && startsWithFloor(number, counted(floor, lang)))) &&
	!(floor > 0 && startsWithFloor(number, counted(floor, lang)));
