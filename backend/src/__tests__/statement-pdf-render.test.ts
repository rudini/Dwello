/**
 * The statement PDF as the tenant reads it, rendered from given data (no database)
 */

import { describe, expect, it } from 'bun:test';
import { generateStatementPDFBase64, type StatementPDFData } from '../services/pdf.service';
import { calculateBalance } from '../services/calculation.service';
import { generateQRBillForStatement } from '../services/qr-bill.service';
import { readPdf } from './helpers/pdf-text';

const config = { iban: 'CH4431999123000889012', companyName: 'Muster Immobilien AG', address: 'Firmenweg 9', postalCode: '8001', city: 'Zürich' };

const refund: StatementPDFData = {
	id: '00000000-0000-0000-0000-000000000001',
	statementNumber: 'NK-1-2025-0001',
	statementDate: '2026-02-15',
	periodStart: '2025-01-01',
	periodEnd: '2025-12-31',
	rentalDays: 365,
	tenant: { firstName: 'Nina', lastName: 'Brunner', address: 'Seeweg 15', postalCode: '6003', city: 'Luzern' },
	apartment: { number: 'A2', floor: 0, area: '82.00' },
	building: { name: 'Seepark', address: 'Seeweg 15', place: '6003 Luzern' },
	lineItems: [{ category: 'Hauswart', key: 'Pro Fläche (m²)', totalAmount: 3060, apartmentShare: 784.13, periodShare: 1, tenantShare: 784.13 }],
	rentalStart: '2025-01-01',
	rentalEnd: '2025-12-31',
	periodDays: 365,
	subtotal: 784.13,
	managementFee: 0,
	managementFeePercent: 0,
	totalCosts: 784.13,
	totalAdvancePayments: 878,
	balance: -93.85 // 784.13 − 878.00 = −93.87, commercially to 5 Rappen: a statement made before #79 keeps it
};

const textOf = async (data: StatementPDFData) => readPdf(Buffer.from(await generateStatementPDFBase64(data, config, 'de'), 'base64'));

describe('PDF einer Rückerstattung', () => {
	it('nennt die Rückerstattung als Betrag ohne Minuszeichen und ohne Zahlteil', async () => {
		const pdf = await textOf(refund);

		expect(pdf.flowing).toContain('Rückerstattung 93.85');
		expect(pdf.flowing).not.toContain('-93.85');
		expect(pdf.flowing).not.toContain('Zahlteil');
		expect(pdf.pages).toBe(1);
	});

	// Ein Entwurf vor der Einführung der Anteile hat keine gespeicherten Anteile: die Spalten bleiben leer
	it('lässt Wohnungs- und Zeitanteil älterer Abrechnungen leer', async () => {
		const older = { ...refund, lineItems: [{ ...refund.lineItems[0], apartmentShare: null, periodShare: null }] };

		expect((await textOf(older)).flowing).toContain("Hauswart Pro Fläche (m²) 3'060.00 – – 784.13");
	});
});

describe('Heizkosten nach Mietstagen im PDF (#137)', () => {
	// a period whose months carry 0 % in the profile: the calculation shared the heating costs by days
	const byDays: StatementPDFData = {
		...refund,
		rentalDays: 48,
		periodDays: 92,
		lineItems: [{ category: 'Heizung', key: 'Pro Fläche (m²)', totalAmount: 1000, apartmentShare: 500, periodShare: 0.5217, byProfile: false, heating: true, tenantShare: 260.87 }]
	};

	it('nennt die Mietstage, kein Heizprofil und weiter das Recht auf die detaillierte Heizkostenabrechnung', async () => {
		const pdf = (await textOf(byDays)).flowing;
		expect(pdf).toContain('48/92 Tage');
		expect(pdf).not.toContain('Heizprofil');
		expect(pdf).toContain('detaillierte Abrechnung der Heiz- und Warmwasserkosten verlangen');
	});

	it('erklärt den Zeitanteil der Heizkosten nach dem Heizprofil, wenn eine Position danach geteilt ist', async () => {
		const byProfile = { ...byDays, lineItems: [{ ...byDays.lineItems[0], byProfile: true }], heating: { profile: 'Winter', percent: 52.17, months: [] } };
		expect((await textOf(byProfile)).flowing).toContain('Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.');
	});

	// #229: eine Periode, deren Monate nicht 100 % tragen, nennt beide Summen, in jeder Sprache
	it('nennt bei einer Periode unter einem Jahr die Summen der Monate, auch auf Englisch', async () => {
		const months = [{ month: 3, percentage: 10 }, { month: 4, percentage: 10 }, { month: 5, percentage: 10 }, { month: 6, percentage: 0 }];
		const short = { ...byDays, lineItems: [{ ...byDays.lineItems[0], byProfile: true }], heating: { profile: 'Winter', percent: 60, months, periodPercent: 50 } };
		const english = readPdf(Buffer.from(await generateStatementPDFBase64(short, config, 'en'), 'base64')).flowing;
		expect(english).toContain('; in total 30.00 %. The months of the billing period total 50.00 % in the heating profile.');
	});
});

const due: StatementPDFData = { ...refund, totalAdvancePayments: 600, balance: 184.15, paymentDeadline: '2026-03-17' };

// Der Saldo ist auf 5 Rappen gerundet; die Zeile «Rundung» lässt die Rechnung aufgehen
describe('Rundung des Saldos im PDF', () => {
	it('nennt die Rundung zwischen Akonto und Saldo, bei Nachzahlung und Rückerstattung', async () => {
		// von oben nach unten lesbar: der Betrag vor der Rundung, die Rundung dieses Betrags, der Saldo
		expect((await textOf(due)).flowing).toContain('Nachzahlung vor Rundung 184.13 Rundung auf 5 Rappen + 0.02 Nachzahlung 184.15');
		expect((await textOf(refund)).flowing).toContain('Rückerstattung vor Rundung 93.87 Rundung auf 5 Rappen – 0.02 Rückerstattung 93.85');
		expect((await textOf(refund)).flowing).toContain('auf 5 Rappen gerundet');
	});

	// Nur zugunsten des Mieters (#79): die Nachzahlung wird kleiner (–), die Rückerstattung grösser (+), um bis 4 Rappen
	it('zeigt die Rundung zugunsten des Mieters vom gezeigten Betrag aus', async () => {
		const rounded = (data: StatementPDFData) => ({ ...data, balance: calculateBalance(data.totalCosts, data.totalAdvancePayments) });
		expect((await textOf(rounded(due))).flowing).toContain('Nachzahlung vor Rundung 184.13 Rundung auf 5 Rappen – 0.03 Nachzahlung 184.10');
		expect((await textOf(rounded(refund))).flowing).toContain('Rückerstattung vor Rundung 93.87 Rundung auf 5 Rappen + 0.03 Rückerstattung 93.90');
		const smallest = rounded({ ...refund, totalCosts: 877.99 });
		expect((await textOf(smallest)).flowing).toContain('Rückerstattung vor Rundung 0.01 Rundung auf 5 Rappen + 0.04 Rückerstattung 0.05');
		const evened = rounded({ ...due, totalCosts: 600.03 });
		expect((await textOf(evened)).flowing).toContain('Nachzahlung vor Rundung 0.03 Rundung auf 5 Rappen – 0.03 Ausgeglichen 0.00');
	});

	// 1000.02 − 1000.00 gibt nach der Rundung 0: der Text sagt, dass nach der Rundung nichts zu bezahlen ist
	it('nennt bei einem Saldo von 0 nach der Rundung die Rundung statt gleich hoher Beträge', async () => {
		const evened = { ...due, totalCosts: 1000.02, totalAdvancePayments: 1000, balance: 0 };
		const pdf = (await textOf(evened)).flowing;
		expect(pdf).toContain('Nachzahlung vor Rundung 0.02 Rundung auf 5 Rappen – 0.02 Ausgeglichen 0.00');
		expect(pdf).toContain('Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen und erhalten nichts zurück.');
		expect(pdf).not.toContain('sind gleich hoch');
		// mit dem Versenden erledigt (bezahlt): der Text bleibt derselbe
		expect((await textOf({ ...evened, paidDate: '2026-03-01' })).flowing).toContain('Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen und erhalten nichts zurück.');
	});

	// Die Zeile passt in allen Sprachen auf eine Zeile, sonst kann der Saldo allein auf die nächste Seite rutschen
	it('nennt die Rundung auf Italienisch in einer Zeile mit ihrem Betrag', async () => {
		const it = readPdf(Buffer.from(await generateStatementPDFBase64(due, config, 'it'), 'base64')).flowing;
		expect(it).toContain('Arrotondamento + 0.02');
		expect(it).toContain('prima dell’arrotondamento 184.13');
	});

	it('lässt die Zeile weg, wenn nichts gerundet ist', async () => {
		expect((await textOf({ ...due, totalAdvancePayments: 600.03, balance: 184.1 })).flowing).not.toContain('Rundung');
	});
});

describe('PDF einer Nachzahlung', () => {
	// SIX: die Angaben im Zahlteil entsprechen dem QR-Code
	it('druckt die Mitteilung im Zahlteil wie im QR-Code', async () => {
		const fr = readPdf(Buffer.from(await generateStatementPDFBase64(due, config, 'fr'), 'base64')).flowing;

		expect(fr).toContain('Informations supplémentaires Décompte des charges NK-1-2025-0001');
	});

	// Der QR-Code nennt den Zahlungspflichtigen nur mit vollständiger Adresse
	it('nennt «Zahlbar durch» nur mit Name, Postleitzahl und Ort', async () => {
		const pdf = await textOf({ ...due, tenant: { firstName: 'Nina', lastName: 'Brunner' } });

		expect(pdf.flowing).not.toContain('Zahlbar durch');
	});

	it('wiederholt den Tabellenkopf auf jeder Seite der Kostenübersicht', async () => {
		const many = { ...due, lineItems: Array.from({ length: 45 }, (_, i) => ({ ...refund.lineItems[0], category: `Kategorie ${i + 1}` })) };

		const pdf = await textOf(many);

		expect(pdf.pages).toBeGreaterThanOrEqual(3); // two pages of positions and the payment part
		expect(pdf.flowing.split('Kategorie Verteilschlüssel').length - 1).toBe(pdf.pages - 1);
	});

	it('schreibt Zeichen ausserhalb der Schrift lesbar, statt sie zu verstümmeln', async () => {
		const pdf = await textOf({ ...due, tenant: { ...due.tenant, firstName: 'Łukasz', lastName: 'Dragoș' } });

		expect(pdf.flowing).toContain('Lukasz Dragos');
	});

	it('nennt die Grundlage der Verwaltungspauschale als Zwischensumme', async () => {
		const pdf = await textOf({ ...due, managementFee: 23.52, managementFeePercent: 3 });

		expect(pdf.flowing).toContain("3 % der Zwischensumme von CHF 784.13");
	});
});

describe('PDF ohne Saldo und einer bezahlten Abrechnung', () => {
	it('sagt bei Saldo 0, dass nichts zu bezahlen ist', async () => {
		const pdf = await textOf({ ...due, totalAdvancePayments: 784.13, balance: 0 });

		expect(pdf.flowing).toContain('Ausgeglichen');
		expect(pdf.flowing).not.toContain('mit dem Zahlteil');
	});

	// Eine bezahlte Abrechnung neu gedruckt: kein Zahlteil, sonst zahlt der Mieter zweimal
	it('druckt für eine bezahlte Abrechnung keinen Zahlteil', async () => {
		const pdf = await textOf({ ...due, paidDate: '2026-03-01' });

		expect(pdf.flowing).toContain('Bezahlt am 01.03.2026');
		expect(pdf.flowing).not.toContain('Zahlteil');
	});

	// Bei einer Rückerstattung hat die Verwaltung bezahlt: kein Dank an den Mieter
	it('nennt bei einer bezahlten Rückerstattung den Tag der Überweisung', async () => {
		const pdf = await textOf({ ...refund, paidDate: '2026-03-01' });

		expect(pdf.flowing).toContain('Überwiesen am 01.03.2026.');
		expect(pdf.flowing).not.toContain('Vielen Dank');
	});

	// Zwischensumme bis Saldo gehören zusammen: der Saldo stand sonst allein auf der nächsten Seite
	it('hält die Summen bis zum Saldo auf einer Seite', async () => {
		for (let n = 10; n <= 20; n++) {
			const items = Array.from({ length: n }, (_, i) => ({ ...refund.lineItems[0], category: `Kategorie ${i + 1}` }));
			const pages = (await textOf({ ...due, lineItems: items, managementFee: 23.52, managementFeePercent: 3 })).text.split('Seite ');
			const pageOf = (row: RegExp) => pages.findIndex((page) => row.test(page));

			// die Zeilen der Tabelle, nicht der Saldo-Kasten oben («CHF …»)
			expect([/Verwaltungspauschale/, /Ihre Nebenkosten\n\d/, /Nachzahlung\n\d/].map(pageOf), `${n} Positionen`).toEqual(Array(3).fill(pageOf(/Zwischensumme/)));
		}
	});

	it('nennt bei einer Rückerstattung den Termin', async () => {
		const pdf = await textOf({ ...refund, paymentDeadline: '2026-03-17' });

		expect(pdf.flowing).toContain('Wir überweisen Ihnen den Betrag bis 17.03.2026.');
	});
});

describe('QR-Code im Zahlteil', () => {
	// 46 mm gedruckt: mit 166 Pixeln waren die Module ungleich breit; jetzt ganze Pixel je Modul, scharf auch beim Druck
	it('bettet den QR-Code mit ganzen Pixeln je Modul in Druckauflösung ein', async () => {
		const { qrCodeImage } = await generateQRBillForStatement({ id: due.id, statementNumber: due.statementNumber, balance: '184.15', tenant: due.tenant }, config);
		const width = qrCodeImage.readUInt32BE(16); // PNG header

		expect(width).toBeGreaterThanOrEqual(500);
		expect(width % 10).toBe(0);
	});
});

const heated: StatementPDFData = {
	...due,
	heating: { profile: 'Heizung Mittelland', percent: 44.2, months: [{ month: 11, percentage: 10.7 }, { month: 12, percentage: 13 }] },
	fuel: { category: 'Heizöl und Brennstoffe für die Zentralheizung inklusive Tankreinigung und Tankrevision', openingDate: '2025-01-01', opening: 1000, invoices: 3000, closingDate: '2025-12-31', closing: 500, total: 3500 }
};

describe('Heiz- und Warmwasserkosten im PDF', () => {
	it('schreibt die Anteile der Monate einheitlich mit zwei Stellen', async () => {
		expect((await textOf(heated)).flowing).toContain('Nov 10.70 %, Dez 13.00 %');
	});

	// «Jun 3.70» und «%» standen auf zwei Zeilen
	it('trennt einen Monatsanteil nicht von seinem Prozentzeichen', async () => {
		const months = [13.6, 12.1, 11.5, 9.3, 5.6, 3.7].map((percentage, i) => ({ month: i + 1, percentage }));
		const pdf = await textOf({ ...heated, heating: { profile: 'Heizung + Warmwasser', percent: 55.8, months } });

		expect(pdf.text).toContain('Jun 3.70 %');
	});

	// Beim Tank zählt nicht die Rechnung, sondern der Verbrauch
	it('erklärt in der Fussnote, dass beim Tank der Verbrauch zählt', async () => {
		expect((await textOf(heated)).flowing).toContain('Kosten Liegenschaft bei Heizmaterial aus dem Tank: der Verbrauch');
		expect((await textOf(due)).flowing).not.toContain('aus dem Tank');
	});
});

// Zwei Rechnungen über verschiedene Leistungszeiträume, Einzug am 15. August: 600 × 0/91 + 1'200 × 47/92 (#226)
describe('Rechnungen einer Position über verschiedene Tage im PDF', () => {
	const invoiceParts = [
		{ start: '2025-04-01', end: '2025-06-30', amount: 600, days: 0, total: 91 },
		{ start: '2025-07-01', end: '2025-09-30', amount: 1200, days: 47, total: 92 }
	];
	const mixed = { ...due, lineItems: [{ ...refund.lineItems[0], totalAmount: 1800, apartmentShare: 900, periodShare: 0.3406, invoiceParts, tenantShare: 306.52 }] };

	it.each([
		['fr', "Période de prestation 01.07.2025 – 30.09.2025 : CHF 1'200.00, vos jours de location 47 sur 92", "Votre part : 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52", 'Si un poste du décompte comporte des factures sur des jours différents, le calcul figure en dessous.'],
		['it', "Periodo di prestazione 01.07.2025 – 30.09.2025: CHF 1'200.00, i suoi giorni di locazione 47 su 92", "La sua quota: 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52", 'Se una voce del conteggio comprende fatture su giorni diversi, il calcolo figura sotto.'],
		['en', "Service period 01.07.2025 – 30.09.2025: CHF 1'200.00, your days rented 47 of 92", "Your share: 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52", 'If a statement line has invoices over different days, the calculation is shown below it.']
	] as const)('nennt die Tage jeder Rechnung und die Berechnung auch auf %s', async (language, line, share, note) => {
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(mixed, config, language), 'base64')).flowing;
		expect(text).toContain(line);
		expect(text).toContain(share);
		expect(text).toContain(note); // the terms of docs/design/i18n-begriffe.md (#226, C-8, C-10)
	});

	// #241 P-2, P-3: jede Zeile sagt, was ihre Zahlen sind, und die Berechnung führt bis zu Ihrem Anteil
	it('beschriftet jede Rechnung mit ihrem Leistungszeitraum und rechnet bis zu Ihrem Anteil', async () => {
		const text = (await textOf(mixed)).flowing;
		expect(text).toContain("Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1'200.00, Ihre Mietstage 47 von 92 Tagen");
		expect(text).toContain("Ihr Anteil: 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52");
	});

	// #241 V-1: eine Rechnung ohne Leistungszeitraum und eine über die Periode hinaus heissen nicht einfach «Leistungszeitraum»
	const special = [
		{ start: '2025-01-01', end: '2025-12-31', amount: 600, days: 139, total: 365, noPeriod: true as const },
		{ start: '2025-11-01', end: '2025-12-31', amount: 795.65, days: 61, total: 61, whole: { start: '2025-11-01', end: '2026-01-31', amount: 1200 } }
	];
	it.each([
		['de', 'Ohne Leistungszeitraum: CHF 600.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode', "Leistungszeitraum 01.11.2025 – 31.01.2026 (Rechnung CHF 1'200.00), davon 01.11.2025 – 31.12.2025: CHF 795.65, Ihre Mietstage 61 von 61 Tagen"],
		['fr', 'Sans période de prestation : CHF 600.00, vos jours de location 139 sur 365 jours de la période de décompte', "Période de prestation 01.11.2025 – 31.01.2026 (facture CHF 1'200.00), dont 01.11.2025 – 31.12.2025 : CHF 795.65, vos jours de location 61 sur 61"],
		['it', 'Senza periodo di prestazione: CHF 600.00, i suoi giorni di locazione 139 su 365 giorni del periodo di conteggio', "Periodo di prestazione 01.11.2025 – 31.01.2026 (fattura CHF 1'200.00), di cui 01.11.2025 – 31.12.2025: CHF 795.65, i suoi giorni di locazione 61 su 61"],
		['en', 'Without a service period: CHF 600.00, your days rented 139 of 365 days of the billing period', "Service period 01.11.2025 – 31.01.2026 (invoice CHF 1'200.00), of which 01.11.2025 – 31.12.2025: CHF 795.65, your days rented 61 of 61"]
	] as const)('nennt eine Rechnung ohne und eine über die Periode hinaus auf %s als solche', async (language, without, beyond) => {
		const data = { ...mixed, lineItems: [{ ...mixed.lineItems[0], totalAmount: 1395.65, apartmentShare: 697.83, periodShare: 0.7338, invoiceParts: special, tenantShare: 512.08 }] };
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(data, config, language), 'base64')).flowing;
		expect(text).toContain(without);
		expect(text).toContain(beyond);
	});

	// #239: die Veränderung des Tankbestands ist keine Rechnung, in jeder Sprache
	it.each([
		['de', 'Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, Ihre Mietstage 139 von 365 Tagen'],
		['fr', 'Variation du stock de combustible 01.01.2025 – 31.12.2025 : CHF 500.00, vos jours de location 139 sur 365'],
		['it', 'Variazione della scorta di combustibile 01.01.2025 – 31.12.2025: CHF 500.00, i suoi giorni di locazione 139 su 365'],
		['en', 'Change in fuel stock 01.01.2025 – 31.12.2025: CHF 500.00, your days rented 139 of 365']
	] as const)('nennt die Veränderung des Tankbestands auf %s als solche', async (language, line) => {
		const stock = [
			{ start: '2025-07-01', end: '2025-09-30', amount: 900, days: 47, total: 92 },
			{ start: '2025-01-01', end: '2025-12-31', amount: 500, days: 139, total: 365, fuelStock: true as const }
		];
		const data = { ...mixed, lineItems: [{ ...mixed.lineItems[0], totalAmount: 1400, apartmentShare: 1400, periodShare: 0.4644, invoiceParts: stock, tenantShare: 650.19 }] };
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(data, config, language), 'base64')).flowing;
		expect(text).toContain(line);
	});

	// Dr. Weber P-1 (#226), #241 P-1, V-2, V-6 bis V-8: die Erläuterung in kurzen Sätzen, mit dem gerundeten Prozentwert
	it('erklärt die Rechnungen unter der Position und den gerundeten Prozentwert in kurzen Sätzen', async () => {
		const text = (await textOf(mixed)).flowing;
		expect(text).toContain('Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum. Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter. Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position.');
	});

	it('hält die Rechnungen beim Seitenwechsel bei ihrer Position, unter dem Tabellenkopf', async () => {
		const many = { ...mixed, lineItems: Array.from({ length: 30 }, (_, i) => ({ ...mixed.lineItems[0], category: `Kategorie ${i + 1}` })) };

		const pdf = await textOf(many);

		expect(pdf.pages).toBeGreaterThanOrEqual(3);
		expect(pdf.flowing.split('Kategorie Verteilschlüssel').length - 1).toBe(pdf.pages - 1);
		expect(pdf.flowing).not.toMatch(/Kategorie Verteilschlüssel[^(]*\d{2}\.\d{2}\.2025 – 30\.06\.2025/);
	});

	// Code-Review C-1: eine Position über mehrere Zeilen am Seitenende, ihre Rechnungen gingen ohne Tabellenkopf weiter
	// (nach 20, 21 und 62 Positionen brach die Formel auf die nächste Seite)
	it.each([20, 21, 62])('hält die Rechnungen auch bei einer langen Kategorie nach %i Positionen bei ihr', async (before) => {
		const long = { ...mixed.lineItems[0], category: 'Allgemeine Betriebskosten Treppenhaus Umgebung Garten Spielplatz Velokeller Waschküche Trocknungsraum' };
		const plain = (i: number) => ({ category: `Kat ${i}`, key: 'Pro Einheit', totalAmount: 100, apartmentShare: 50, periodShare: 0.3808, tenantShare: 19 });

		const { pageTexts } = await textOf({ ...mixed, lineItems: [...Array.from({ length: before }, (_, i) => plain(i)), long] });

		const pageOf = (text: string) => pageTexts.findIndex((page) => page.includes(text));
		expect([pageOf('01.04.2025'), pageOf('(600.00')]).toEqual([pageOf('306.52'), pageOf('306.52')]);
	});

});
