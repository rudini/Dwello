import type { HeatingProfile } from '$lib/types';

const MONTHS = [
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

/** Backend heating profile row (januaryPct … decemberPct) as frontend HeatingProfile */
export function toHeatingProfile(hp: Record<string, unknown>): HeatingProfile {
	return {
		id: hp.id,
		name: hp.name || '',
		type: hp.type || 'predefined',
		description: hp.description || '',
		isActive: hp.isActive ?? true,
		monthlyPercentages:
			hp.monthlyPercentages ||
			Object.fromEntries(
				MONTHS.map((month) => [month, parseFloat(hp[`${month}Pct`] as string) || 0])
			)
	} as HeatingProfile;
}
