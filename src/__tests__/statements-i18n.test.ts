import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { balanceLabel, paidDateError } from '$lib/statement';
import { akontoHint, findingText, selectionErrors, statementSteps } from '$lib/statement-wizard';
import { formatCurrency } from '$lib/utils/format';
import { m } from '$lib/paraglide/messages';
import { loadStatement } from '$lib/server/statement';
import { sendStatement, sendStatementReminder } from '$lib/server/statement-actions';
import { loadDocuments } from '$lib/server/documents';
import { invoicesInPeriod } from '$lib/server/statement-generation';
import backendStatement from '../../tests/contracts/statement.json';
import invoiceCompleteness from '../../tests/contracts/invoice-completeness.json';
import sendRefused from '../../tests/contracts/statement-send-refused.json';
import documentsJson from '../../tests/contracts/documents.json';

afterEach(() => overwriteGetLocale(() => baseLocale));

const heating = { id: 'c1', name: 'Heating', nameDE: 'Heizung', nameFR: 'Chauffage' };
const caretaker = {
	id: invoiceCompleteness.findings[0].categoryId,
	name: 'Caretaker',
	nameDE: 'Hauswart',
	nameFR: 'Conciergerie'
};
const perArea = {
	id: 'k1',
	name: 'Per Area (m²)',
	nameDE: 'Pro Fläche (m²)',
	nameFR: 'Par surface (m²)'
};

describe('Nebenkostenabrechnungen in der gewählten Sprache', () => {
	it('nennt schon abgerechnete Mietverträge auf Italienisch und Englisch ohne falschen Bezug (fach-review V-10, V-11)', () => {
		overwriteGetLocale(() => 'it');
		expect(m.statements_building_billed_many({ billed: 2, total: 8 })).toMatch(/^Su 8 contratti/);
		overwriteGetLocale(() => 'en');
		expect(m.statements_building_billed_all_many()).toContain('covers all or part of this period');
	});

	it('nennt den Saldo auf Französisch wie das PDF', () => {
		overwriteGetLocale(() => 'fr');
		expect([balanceLabel(120), balanceLabel(-80), balanceLabel(0)]).toEqual([
			'Montant à payer',
			'Remboursement',
			'Solde nul'
		]);
	});

	it('nennt die Schritte wie die Hilfe auf Französisch', () => {
		overwriteGetLocale(() => 'fr');
		expect(statementSteps).toEqual([
			'Période de décompte',
			'Immeubles',
			'Profil de chauffage et frais d’administration',
			'Aperçu',
			'Établissement'
		]);
	});

	it('meldet Fehler im Assistenten auf Italienisch', () => {
		overwriteGetLocale(() => 'it');
		const selection = {
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: 'hp1',
			managementFeePercent: 3,
			buildingIds: []
		};
		expect(selectionErrors(selection, 2)).toEqual({ buildings: 'Scelga almeno un immobile.' });
		expect(paidDateError('', '2025-01-15')).toBe('Inserisca la data di pagamento nel formato GG.MM.AAAA.');
	});

	it('nennt den fehlenden Monat in der gewählten Sprache', () => {
		overwriteGetLocale(() => 'fr');
		const finding = {
			categoryId: 'c1',
			categoryName: 'Heizung',
			kind: 'gap' as const,
			current: { count: 1, total: 100 },
			previous: { count: 2, total: 200 },
			missingParts: [{ start: '2024-03-01', end: '2024-03-31' }],
			changePercent: null
		};
		expect(findingText(finding)).toBe(
			'La facture pour mars manque. L’année précédente\u00a0: 2 factures.'
		);
	});

	it('weist auf Englisch auf ein zu tiefes Akonto hin', () => {
		overwriteGetLocale(() => 'en');
		expect(akontoHint({ totalCosts: 600, totalAdvancePayments: 1000 })).toBe(
			`Costs are ${formatCurrency(400)} (40 %) below the advance payments. Are invoices missing?`
		);
	});

	it('nennt Kategorie und Verteilschlüssel jeder Position in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'fr');
		const [line] = backendStatement.lineItems;
		const fetch = (async (url: string) => {
			if (url.includes('/categories')) return Response.json({ categories: [heating] });
			if (url.includes('/distribution-keys')) return Response.json({ data: [perArea] });
			return Response.json({
				...backendStatement,
				lineItems: [line, { ...line, id: 'l2', distributionKeyId: null }]
			});
		}) as typeof globalThis.fetch;

		const { lineItems } = await loadStatement(fetch, 's1');

		expect(lineItems.map((item) => [item.categoryName, item.distributionKeyName])).toEqual([
			['Chauffage', 'Par surface (m²)'],
			['Chauffage', 'À parts égales par appartement']
		]);
	});

	// The backend names a line item without category in German
	it('nennt eine Position ohne Kategorie in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'it');
		const [line] = backendStatement.lineItems;
		const uncategorised = { ...line, categoryId: null, description: 'Nicht kategorisiert' };
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/statements/') ? { ...backendStatement, lineItems: [uncategorised] } : {}
			)) as typeof globalThis.fetch;

		const { lineItems } = await loadStatement(fetch, 's1');

		expect(lineItems[0].categoryName).toBe('Non categorizzata');
	});

	it('nennt die Kategorie im Vergleich mit dem Vorjahr in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'fr');
		const fetch = (async (url: string) => {
			if (url.includes('/categories')) return Response.json({ categories: [caretaker] });
			if (url.includes('/statements?')) return Response.json({ data: [] });
			if (url.includes('/completeness/')) return Response.json(invoiceCompleteness);
			return Response.json([]);
		}) as typeof globalThis.fetch;

		const [row] = await invoicesInPeriod(fetch, {
			buildingIds: ['b1'],
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: 'hp1',
			managementFeePercent: 3
		});

		expect(row.check?.findings[0].categoryName).toBe('Conciergerie');
	});

	it('nennt die eben gesendete Mahnung in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'fr');
		const document = { type: 'reminder', reminderLevel: 1, title: 'Zahlungserinnerung' };
		const fetch = (async () =>
			Response.json({ document }, { status: 201 })) as typeof globalThis.fetch;

		const result = await sendStatementReminder(fetch, 's1');

		expect(result).toMatchObject({ reminder: { document: { title: 'Rappel de paiement' } } });
	});

	// #86: what went wrong and what to do, never the backend's own text
	it('sagt in der gewählten Sprache, warum die Abrechnung nicht per E-Mail hinausging', async () => {
		overwriteGetLocale(() => 'fr');
		const fetch = (async () =>
			Response.json(sendRefused, { status: 400 })) as typeof globalThis.fetch;

		const refused = await sendStatement(fetch, 's1', false);

		expect(refused).toEqual({
			status: 400,
			message: m.backend_statement_tenant_no_email({}, { locale: 'fr' }),
			undelivered: true
		});
		expect(refused?.message).not.toBe(m.backend_statement_tenant_no_email({}, { locale: 'de' }));
	});

	it('nennt die per E-Mail versendete Abrechnung unter «Dokumente» in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'it');
		const [upload] = documentsJson.data;
		const fetch = (async () =>
			Response.json({ data: [{ ...upload, type: 'statement', title: 'Nebenkostenabrechnung' }] })) as typeof globalThis.fetch;

		const [document] = await loadDocuments(fetch, 'statementId=s1');

		expect(document.title).toBe('Conteggio spese accessorie');
	});
});
