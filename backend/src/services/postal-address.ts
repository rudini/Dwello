// Mail abroad (Swiss Post, #102): the country alone on the last line, in capitals; a neighbouring country in its own
// language, any other in English. A Korrespondenzadresse in Switzerland names no country
const NEIGHBOURS: Record<string, string> = { DE: 'de', AT: 'de', LI: 'de', FR: 'fr', IT: 'it' };

export const countryLine = (country?: string | null) =>
	country && country !== 'CH'
		? new Intl.DisplayNames([NEIGHBOURS[country] ?? 'en'], { type: 'region' }).of(country)?.toUpperCase()
		: undefined;

// QR-bill payment part and receipt (SIX): the country code before the postal code for a debtor outside Switzerland
export const qrTown = (postalCode: string, city: string, country?: string) =>
	`${country && country !== 'CH' ? `${country}-` : ''}${postalCode} ${city}`;
