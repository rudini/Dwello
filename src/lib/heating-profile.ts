export const MONTHS = [
	{ key: 'january', label: 'Januar' },
	{ key: 'february', label: 'Februar' },
	{ key: 'march', label: 'März' },
	{ key: 'april', label: 'April' },
	{ key: 'may', label: 'Mai' },
	{ key: 'june', label: 'Juni' },
	{ key: 'july', label: 'Juli' },
	{ key: 'august', label: 'August' },
	{ key: 'september', label: 'September' },
	{ key: 'october', label: 'Oktober' },
	{ key: 'november', label: 'November' },
	{ key: 'december', label: 'Dezember' }
] as const;

/** Sum of the monthly shares in percent, to the hundredth */
export const profileTotal = (shares: Record<string, number>) =>
	Math.round(Object.values(shares).reduce((sum, share) => sum + share, 0) * 100) / 100;
