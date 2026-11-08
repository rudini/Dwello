import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages';
import {
	apartmentOption,
	impossibleYear,
	validateContract,
	type ContractFormValues
} from '$lib/contract-form';
import {
	advancePaymentNotice,
	contractSteps,
	contractSummary,
	startDateNotice
} from '$lib/contract-wizard';
import { load as newContractLoad } from '../routes/contracts/new/+page.server';

afterEach(() => overwriteGetLocale(() => baseLocale));

const empty: ContractFormValues = {
	tenantId: '',
	apartmentId: '',
	startDate: '',
	endDate: '',
	isUnlimited: false,
	baseRent: '',
	additionalRent: '',
	advancePayment: '',
	managementFee: '',
	managementFeeRate: ''
};

describe('Mietverträge in der gewählten Sprache', () => {
	it('nennt die Schritte des Mietvertrags auf Französisch wie die Hilfe', () => {
		overwriteGetLocale(() => 'fr');
		expect(contractSteps.map((step) => step.label)).toEqual([
			'Locataire',
			'Appartement',
			'Durée du contrat',
			'Loyer',
			'Vérification'
		]);
	});

	it('meldet fehlende Angaben auf Italienisch', () => {
		overwriteGetLocale(() => 'it');
		const errors = validateContract({ ...empty, baseRent: '1,450' });
		expect(errors.tenantId).toBe('Scelga un inquilino.');
		expect(errors.endDate).toBe(
			'La fine del contratto è obbligatoria per un contratto di locazione a tempo determinato.'
		);
		expect(errors.baseRent).toBe("Inserisca un importo valido, per esempio 1450.00 o 1'450.");
		expect(impossibleYear()).toBe('Verifichi la data: l’anno non è possibile.');
	});

	it('beschreibt Wohnung und Mietvertrag auf Englisch', () => {
		overwriteGetLocale(() => 'en');
		expect(apartmentOption({ unit: '2.02', building: 'Musterhaus' }, undefined, true).label).toBe(
			'Apartment 2.02 · Musterhaus (current)'
		);
		const summary = contractSummary(
			{ ...empty, apartmentId: 'a1', isUnlimited: true, startDate: '2027-01-01' },
			[],
			[{ id: 'a1', unit: '2.02', building: 'Musterhaus' }]
		);
		expect(summary.map((item) => item.label)).toContain('Net rent');
		expect(summary.find((item) => item.field === 'apartment')?.value).toBe(
			'Apartment 2.02 · Musterhaus'
		);
		expect(summary.find((item) => item.field === 'duration')?.value).toBe('Open-ended');
		expect(advancePaymentNotice(empty)).toMatch(
			/^Without an advance payment, the tenant usually pays a flat-rate/
		);
		expect(startDateNotice('2020-01-01', true)).toBe(
			'The contract start Wednesday, 1 January 2020 is in the past. Is the date correct?'
		);
	});

	it('nennt Zimmer und Gebäude der Wohnungen im neuen Mietvertrag auf Französisch', async () => {
		overwriteGetLocale(() => 'fr');
		const apartment = { id: 'a1', number: '1', rooms: '1', area: '40', status: 'vacant' };
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants')
					? { tenants: [] }
					: url.includes('categories')
						? []
						: { apartments: [apartment] }
			)) as typeof globalThis.fetch;
		const data = (await newContractLoad({ fetch } as never)) as {
			apartments: { size: string; building: string }[];
		};
		expect(data.apartments[0]).toMatchObject({ size: '1 pièce, 40 m²', building: 'Inconnu' });
	});
});

// #1264 (Helga P-3, Sven P-2): both hints of the step «Wohnung» say «Mietvertrag ohne Vertragsende»;
// wording of fach review 1264-1, word for word
describe('Hinweis auf die aufgehobene Wohnung', () => {
	it.each([
		[
			'de',
			'Für diese Wohnung ist ein Mietvertrag ohne Vertragsende erfasst. Dwello hat die Auswahl darum aufgehoben. Ist dieser Mietvertrag gekündigt oder ein Vertragsende vereinbart, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung.'
		],
		[
			'fr',
			'Un contrat de bail sans fin du contrat est saisi pour cet appartement. Dwello a donc annulé la sélection. Si ce contrat de bail est résilié ou qu’une fin du contrat a été convenue, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin ». Sinon, choisissez un autre appartement.'
		],
		[
			'it',
			'Per questo appartamento è registrato un contratto di locazione senza fine del contratto. Dwello ha quindi annullato la selezione. Se questo contratto di locazione è disdetto o è stata pattuita una fine del contratto, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». Altrimenti scelga un altro appartamento.'
		],
		[
			'en',
			'A rental contract without a contract end is recorded for this apartment. Dwello has therefore cleared the selection. If this rental contract was terminated by notice or a contract end was agreed, first enter the contract end on its page with «Enter end date». Otherwise choose another apartment.'
		]
	] as const)('nennt auf %s einen Mietvertrag ohne Vertragsende', (locale, text) => {
		overwriteGetLocale(() => locale);
		expect(m.contracts_apartment_cleared_text()).toBe(text);
	});
});

// #1265 (Helga P-4, Sven P-5): «nicht geprüft» first in the option, and explained at the field; fach review 1264-1
describe('Wohnung mit nicht geladenen Mietverträgen', () => {
	it.each([
		[
			'fr',
			'(non vérifié) Appartement 2.01 · Ahornhof',
			'Les appartements marqués « non vérifié » peuvent être choisis, même si Dwello n’a pas pu charger leurs contrats de bail. Dwello vérifie à l’enregistrement si l’appartement choisi est libre.'
		],
		[
			'it',
			'(non verificato) Appartamento 2.01 · Ahornhof',
			'Gli appartamenti contrassegnati con «non verificato» possono essere scelti, anche se Dwello non ha potuto caricare i loro contratti di locazione. Dwello verifica al salvataggio se l’appartamento scelto è libero.'
		],
		[
			'en',
			'(not checked) Apartment 2.01 · Ahornhof',
			'Apartments marked «not checked» can be chosen, even though Dwello could not load their rental contracts. Dwello checks on saving whether the chosen apartment is free.'
		]
	] as const)('markiert und erklärt sie auf %s', (locale, label, help) => {
		overwriteGetLocale(() => locale);
		expect(apartmentOption({ unit: '2.01', building: 'Ahornhof' }, null, false).label).toBe(label);
		expect(m.contracts_apartment_help_unchecked()).toBe(help);
	});
});

// #1287 (fach review 1264-1 M-1): the help names the contract that blocks like the hints of the step
describe('Hilfe zur Wohnung', () => {
	it.each([
		[
			'de',
			'Wohnungen, die frei sind oder später frei werden, stehen zuoberst. Wohnungen mit einem Mietvertrag ohne Vertragsende sind mit «nicht verfügbar» markiert und lassen sich nicht wählen.'
		],
		[
			'fr',
			'Les appartements libres ou qui seront libres plus tard figurent en haut. Les appartements avec un contrat de bail sans fin du contrat sont marqués « non disponible » et ne peuvent pas être choisis.'
		],
		[
			'it',
			'Gli appartamenti liberi o che si liberano più tardi sono in cima. Gli appartamenti con un contratto di locazione senza fine del contratto sono contrassegnati con «non disponibile» e non possono essere scelti.'
		],
		[
			'en',
			'Apartments that are free or become free later are listed first. Apartments with a rental contract without a contract end are marked «not available» and cannot be chosen.'
		]
	] as const)('nennt auf %s einen Mietvertrag ohne Vertragsende', (locale, text) => {
		overwriteGetLocale(() => locale);
		expect(m.contracts_apartment_help()).toBe(text);
	});
});

// #1288 (1288-fachreview-1 V-1, M-1): the hint on the tenant's own contract writes the apartment like the cleared hint
// and names the contract by tenant and apartment; a move does not end the contract (Art. 266a Abs. 1 OR)
describe('Hinweis auf den eigenen Mietvertrag des Mieters', () => {
	const apartment = 'Wohnung 2.02 · Ahornhof';
	it.each([
		[
			'de',
			'Für Anna Keller ist ein Mietvertrag für Wohnung 2.02 · Ahornhof ohne Vertragsende erfasst. Zieht Anna Keller um, endet dieser Mietvertrag nicht von selbst. Ist er gekündigt oder ein Vertragsende vereinbart, tragen Sie das Vertragsende auf seiner Seite mit «Enddatum erfassen» ein. Mietet Anna Keller beide Wohnungen, machen Sie hier weiter.',
			'Zum Mietvertrag von Anna Keller für Wohnung 2.02 · Ahornhof'
		],
		[
			'fr',
			'Pour Anna Keller, un contrat de bail sans fin du contrat est saisi pour Wohnung 2.02 · Ahornhof. Si Anna Keller déménage, ce contrat de bail ne prend pas fin de lui-même. S’il est résilié ou qu’une fin du contrat a été convenue, saisissez la fin du contrat sur sa page avec « Saisir la date de fin ». Si Anna Keller loue les deux appartements, continuez ici.',
			'Vers le contrat de bail de Anna Keller pour Wohnung 2.02 · Ahornhof'
		],
		[
			'it',
			'Per Anna Keller è registrato un contratto di locazione senza fine del contratto per Wohnung 2.02 · Ahornhof. Se Anna Keller trasloca, questo contratto di locazione non termina da sé. Se è disdetto o è stata pattuita una fine del contratto, inserisca la fine del contratto sulla sua pagina con «Registrare la data di fine». Se Anna Keller prende in locazione entrambi gli appartamenti, continui qui.',
			'Al contratto di locazione di Anna Keller per Wohnung 2.02 · Ahornhof'
		],
		[
			'en',
			'A rental contract for Wohnung 2.02 · Ahornhof without a contract end is recorded for Anna Keller. If Anna Keller moves, this rental contract does not end by itself. If it was terminated by notice or a contract end was agreed, enter the contract end on its page with «Enter end date». If Anna Keller rents both apartments, continue here.',
			'Go to the rental contract of Anna Keller for Wohnung 2.02 · Ahornhof'
		]
	] as const)('nennt auf %s Wohnung und Mietvertrag wie der Hinweis auf die nicht verfügbare Wohnung', (locale, text, link) => {
		overwriteGetLocale(() => locale);
		expect([
			m.contracts_open_contract_text({ name: 'Anna Keller', apartment }),
			m.contracts_open_contract_link({ name: 'Anna Keller', apartment })
		]).toEqual([text, link]);
	});
});
