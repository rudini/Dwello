import { getLocale } from '$lib/paraglide/runtime';

const KEYS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
] as const;

const format = (key: string, month: 'long' | 'short') =>
	new Intl.DateTimeFormat(`${getLocale()}-CH`, { month, timeZone: 'UTC' }).format(
		new Date(Date.UTC(2000, KEYS.indexOf(key as (typeof KEYS)[number]), 1))
	);
const capitalised = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

/** The month's name in the UI language as written in a sentence ("janvier"); an unknown key stays as it is */
export const monthName = (key: string) =>
	KEYS.includes(key as (typeof KEYS)[number]) ? format(key, 'long') : key;

/** The months of a heating profile, labelled in the UI language ("Janvier", short "Janv.") */
export const MONTHS = KEYS.map((key) => ({
	key,
	get label() {
		return capitalised(format(key, 'long'));
	},
	get short() {
		return capitalised(format(key, 'short'));
	}
}));

/** Sum of the monthly shares in percent, to the hundredth */
export const profileTotal = (shares: Record<string, number>) =>
	Math.round(Object.values(shares).reduce((sum, share) => sum + share, 0) * 100) / 100;
