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

// Width and height in mm of each field drawn with 0.75 pt corner marks (pdfkit: «0.75 w», then «x y m/l» lines, «S»)
const blankFields = (streams: string[]) =>
	streams.flatMap((content) =>
		[...content.matchAll(/0\.75 w\n(?:.*\n)*?((?:[\d.]+ [\d.]+ [ml]\n)+)S/g)].map(([, path]) => {
			const points = [...path.matchAll(/([\d.]+) ([\d.]+) [ml]/g)].map(([, x, y]) => [Number(x), Number(y)]);
			const extent = (i: number) => Math.round((Math.max(...points.map((p) => p[i])) - Math.min(...points.map((p) => p[i]))) / (72 / 25.4));
			return [extent(0), extent(1)];
		})
	);

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

// #84 FR-7: «1er», not «1e»
describe('Stockwerk im französischen PDF', () => {
	it.each([
		[-1, 'A2, 1er sous-sol'],
		[-2, 'A2, 2e sous-sol']
	])('nennt das Stockwerk %i als «%s»', async (floor, text) => {
		const data = { ...refund, apartment: { ...refund.apartment, floor } };
		const pdf = readPdf(Buffer.from(await generateStatementPDFBase64(data, config, 'fr'), 'base64'));

		expect(pdf.flowing).toContain(text);
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
		expect(it).toContain('Arrotondamento a 5 centesimi + 0.02');
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

	// SIX: die Angaben im Zahlteil entsprechen dem QR-Code, auch wo er ein Zeichen ersetzt (#78)
	it('druckt Zahlungsempfänger und Zahlungspflichtigen wie im QR-Code', async () => {
		const shop = { ...config, companyName: 'Müller’s Immobilien' };
		const tenant = { firstName: 'Nina', lastName: 'D’Angelo', address: 'Seeweg 15', postalCode: '6003', city: 'Luzern' };
		const pdf = readPdf(Buffer.from(await generateStatementPDFBase64({ ...due, tenant }, shop, 'de'), 'base64')).flowing;

		expect(pdf).toContain("Zahlbar an CH44 3199 9123 0008 8901 2 Müller's Immobilien Firmenweg 9 8001 Zürich");
		expect(pdf).toContain("Zahlbar durch Nina D'Angelo Seeweg 15 6003 Luzern");
	});

	// Der QR-Code nennt den Zahlungspflichtigen nur mit vollständiger Adresse; sonst lassen Empfangsschein und Zahlteil
	// unter «Zahlbar durch (Name/Adresse)» ein leeres Feld mit Eckmarken frei (SIX IG, #78)
	it('lässt ohne Postleitzahl und Ort ein Feld für Name und Adresse frei', async () => {
		const tenant = { firstName: 'Nina', lastName: 'Brunner' };
		const pdf = await textOf({ ...due, tenant });
		const fr = readPdf(Buffer.from(await generateStatementPDFBase64({ ...due, tenant }, config, 'fr'), 'base64')).flowing;

		expect(pdf.flowing.match(/Zahlbar durch \(Name\/Adresse\)/g)).toHaveLength(2);
		expect(pdf.flowing).not.toContain('Zahlbar durch Nina');
		expect(fr.match(/Payable par \(nom\/adresse\)/g)).toHaveLength(2);
		expect(blankFields(pdf.streams)).toEqual([[52, 20], [65, 25]]); // Empfangsschein, Zahlteil
		expect(blankFields((await textOf(due)).streams)).toEqual([]);
	});

	// Ein langer Zahlungsempfänger braucht im Empfangsschein mehr Zeilen: das Feld endet über «Währung» und «Betrag»
	it('lässt das Feld im Empfangsschein nicht in den Betrag reichen', async () => {
		const long = { ...config, companyName: 'Immobilienverwaltung Muster & Partner GmbH Winterthur', address: 'Hauptstrasse der Gemeinde Oberwinterthur 125b' };
		const pdf = readPdf(Buffer.from(await generateStatementPDFBase64({ ...due, tenant: { firstName: 'Nina', lastName: 'Brunner' } }, long, 'de'), 'base64'));

		expect(blankFields(pdf.streams)[0][1]).toBeLessThan(20);
	});

	// Post ins Ausland: das Land in Grossbuchstaben allein auf der letzten Zeile der Adresse, ein Nachbarland in seiner
	// Sprache, jedes andere englisch; im Zahlteil der Ländercode vor der Postleitzahl, ausser in der Schweiz (#102)
	it('nennt bei einer Korrespondenzadresse im Ausland das Land in der Adresse und im Zahlteil', async () => {
		const abroad = { firstName: 'Nina', lastName: 'Brunner', address: 'Marktstätte 3', postalCode: '78462', city: 'Konstanz', country: 'DE' };
		const pdf = readPdf(Buffer.from(await generateStatementPDFBase64({ ...due, tenant: abroad }, config, 'fr'), 'base64'));

		expect(pdf.text).toContain('Nina Brunner\nMarktstätte 3\n78462 Konstanz\nDEUTSCHLAND');
		expect(pdf.text).toContain('DE-78462 Konstanz');
		expect(pdf.pages).toBe(2); // the payment part on a page of its own
		expect(pdf.pageTexts[0]).not.toContain('DE-'); // the address block keeps the postal code alone
		expect((await textOf({ ...due, tenant: { ...abroad, country: 'US' } })).text).toContain('78462 Konstanz\nUNITED STATES');
		expect((await textOf({ ...due, tenant: { ...abroad, country: 'LI' } })).text).toContain('LI-78462 Konstanz');
		const home = await textOf({ ...due, tenant: { ...abroad, country: 'CH' } });
		expect(home.text).toContain('78462 Konstanz\n');
		expect(home.text).not.toContain('SCHWEIZ');
		expect(home.text).not.toContain('CH-78462');
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

// #403: ein Saldo unter CHF 5 wird weder eingefordert noch ausbezahlt, sondern mit der nächsten Abrechnung verrechnet:
// kein Zahlteil, keine Bitte um die IBAN
describe('PDF mit einem Saldo unter CHF 5', () => {
	it('verrechnet eine kleine Nachzahlung mit der nächsten Abrechnung und druckt keinen Zahlteil', async () => {
		const pdf = await textOf({ ...due, totalAdvancePayments: 780, balance: 4.1, paymentDeadline: '2026-03-17', carried: true });

		expect(pdf.flowing).toContain('Nachzahlung CHF 4.10');
		expect(pdf.flowing).toContain(
			'Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung; Sie müssen jetzt nichts bezahlen.'
		);
		expect(pdf.flowing).not.toContain('Zahlteil');
	});

	it('verrechnet eine kleine Rückerstattung mit der nächsten Abrechnung und fragt nicht nach der IBAN', async () => {
		const pdf = await textOf({ ...refund, totalAdvancePayments: 787, balance: -2.85, paymentDeadline: '2026-03-17', carried: true });

		expect(pdf.flowing).toContain('Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung.');
		expect(pdf.flowing).not.toContain('bezahlen');
		expect(pdf.flowing).not.toContain('IBAN');
		expect(pdf.flowing).not.toContain('überweisen');
	});

	it('verrechnet den Betrag auf Französisch, Italienisch und Englisch', async () => {
		const data = { ...refund, totalAdvancePayments: 787, balance: -2.85, carried: true };
		const texts = await Promise.all(
			(['fr', 'it', 'en'] as const).map(async (language) => readPdf(Buffer.from(await generateStatementPDFBase64(data, config, language), 'base64')).flowing)
		);

		expect(texts[0]).toContain('Le montant est inférieur à CHF 5.00. Nous le compensons avec le prochain décompte des charges.');
		expect(texts[1]).toContain('L’importo è inferiore a CHF 5.00. Lo compensiamo con il prossimo conteggio delle spese accessorie.');
		expect(texts[2]).toContain('The amount is less than CHF 5.00. We will offset it against the next utility cost statement.');
	});

	// #94 versendet: der Mieter hat gelesen, dass nichts folgt; der Text bleibt, ohne «Bezahlt am» und «Überwiesen am»
	it('sagt bei einer nach #94 erledigten Abrechnung weiter, dass der Betrag nicht eingefordert oder ausbezahlt wird', async () => {
		const waived = await textOf({ ...refund, totalAdvancePayments: 780, balance: 4.1, paidDate: '2026-02-15', waived: true });
		const back = await textOf({ ...refund, totalAdvancePayments: 787, balance: -2.85, paidDate: '2026-02-15', waived: true });

		expect(waived.flowing).toContain('Wir verzichten darauf; Sie müssen nichts bezahlen.');
		expect(waived.flowing).not.toContain('Bezahlt am');
		expect(waived.flowing).not.toContain('Zahlteil');
		expect(back.flowing).toContain('Wir zahlen ihn nicht aus.');
		expect(back.flowing).not.toContain('Überwiesen am');
	});

	it('fordert CHF 5.00 mit dem Zahlteil ein', async () => {
		const pdf = await textOf({ ...due, totalAdvancePayments: 779.15, balance: 5 });

		expect(pdf.flowing).toContain('Zahlteil');
	});

	// die Schlussabrechnung kennt keinen Mindestbetrag
	it('fordert auf der Schlussabrechnung auch CHF 4.10 mit dem Zahlteil ein', async () => {
		const pdf = await textOf({ ...due, totalAdvancePayments: 780, balance: 4.1, paymentDeadline: '2026-03-17' });

		expect(pdf.flowing).toContain('Zahlteil');
		expect(pdf.flowing).not.toContain('verrechnet');
		expect(pdf.flowing).not.toContain('kleiner als');
	});
});

// #403: der Übertrag der letzten Abrechnung desselben Mietvertrags, vor der Rundung in den Saldo gerechnet
describe('PDF mit einem Übertrag', () => {
	// 784.13 − 600.00 + 3.00 = 187.13, auf 5 Rappen zugunsten des Mieters 187.10
	const carriedIn: StatementPDFData = { ...due, balance: 187.1, carryOver: { statementNumber: 'NK-1-2024-0001', amount: 3 } };

	it('zählt eine übertragene Nachzahlung vor der Rundung dazu', async () => {
		const flowing = (await textOf(carriedIn)).flowing;

		expect(flowing).toContain('Akontobeiträge – 600.00 Übertrag aus Abrechnung NK-1-2024-0001: CHF 3.00 + 3.00');
		expect(flowing).toContain('Nachzahlung vor Rundung 187.13 Rundung auf 5 Rappen – 0.03 Nachzahlung 187.10');
	});

	// 784.13 − 600.00 − 3.00 = 181.13 → 181.10
	it('zieht eine übertragene Rückerstattung vor der Rundung ab', async () => {
		const flowing = (await textOf({ ...due, balance: 181.1, carryOver: { statementNumber: 'NK-1-2024-0001', amount: -3 } })).flowing;

		expect(flowing).toContain('Übertrag aus Abrechnung NK-1-2024-0001: CHF 3.00 – 3.00');
		expect(flowing).toContain('Nachzahlung vor Rundung 181.13');
	});

	it('nennt den Übertrag auf Französisch', async () => {
		const fr = readPdf(Buffer.from(await generateStatementPDFBase64(carriedIn, config, 'fr'), 'base64')).flowing;

		expect(fr).toContain('Report du décompte NK-1-2024-0001 : CHF 3.00');
	});
});

// #403 (6): die Bemerkung der Abrechnung steht im PDF, bei einer berichtigten Abrechnung etwa der Grund
describe('PDF mit einer Bemerkung', () => {
	it('druckt die Bemerkung', async () => {
		expect((await textOf({ ...due, notes: 'Berichtigt: die Hauswartrechnung fehlte.' })).flowing).toContain('Berichtigt: die Hauswartrechnung fehlte.');
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
		expect((await textOf(heated)).flowing).toContain('Kosten des Gebäudes bei Heizmaterial aus dem Tank: der Verbrauch');
		expect((await textOf(due)).flowing).not.toContain('aus dem Tank');
	});
});

// Das PDF nennt das Gebäude und seine Kosten mit den Worten der App (statements_building_costs), nicht «Liegenschaft» (#249)
describe('Gebäude im PDF', () => {
	it('sagt «Gebäude» und «Kosten des Gebäudes»', async () => {
		const { flowing } = await textOf(due);

		expect(flowing).toContain('Gebäude Seepark');
		expect(flowing).toContain('Kosten des Gebäudes: die Rechnungen der Abrechnungsperiode');
		expect(flowing).toContain('Wohnungsanteil: der Anteil Ihrer Wohnung an den Kosten des Gebäudes nach dem Verteilschlüssel');
		expect(flowing).not.toContain('Liegenschaft');
	});

	it.each([
		['fr', 'Immeuble Seepark', 'Coûts de l’immeuble', 'la part des coûts de l’immeuble qui revient à votre logement'],
		['it', 'Immobile Seepark', 'Costi immobile', 'la quota dei costi dell’immobile a carico del suo appartamento'],
		['en', 'Building Seepark', 'Building costs', 'your apartment’s part of the building costs']
	] as const)('sagt auf %s die Worte der App', async (language, building, costs, apartmentShare) => {
		const { flowing } = readPdf(Buffer.from(await generateStatementPDFBase64(due, config, language), 'base64'));

		expect(flowing).toContain(building);
		expect(flowing).toContain(costs);
		expect(flowing).toContain(apartmentShare);
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

	// #236: eine Zeile ohne Leistungszeitraum nennt ihre Rechnung, in jeder Sprache; die eindeutige nicht
	it.each([
		['de', 'Ohne Leistungszeitraum: CHF 600.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode (Rechnung «Hauswartung Q3»)'],
		['fr', 'Sans période de prestation : CHF 600.00, vos jours de location 139 sur 365 jours de la période de décompte (facture « Hauswartung Q3 »)'],
		['it', 'Senza periodo di prestazione: CHF 600.00, i suoi giorni di locazione 139 su 365 giorni del periodo di conteggio (fattura «Hauswartung Q3»)'],
		['en', 'Without a service period: CHF 600.00, your days rented 139 of 365 days of the billing period (invoice ‘Hauswartung Q3’)']
	] as const)('nennt die Rechnung einer Zeile ohne Leistungszeitraum auf %s', async (language, line) => {
		const named = [{ ...special[0], description: 'Hauswartung Q3' }, { ...special[1], description: 'Hauswartung Winter' }];
		const data = { ...mixed, lineItems: [{ ...mixed.lineItems[0], totalAmount: 1395.65, apartmentShare: 697.83, periodShare: 0.7338, invoiceParts: named, tenantShare: 512.08 }] };
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(data, config, language), 'base64')).flowing;
		expect(text).toContain(line);
		expect(text).not.toContain('Hauswartung Winter');
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

// #71: Einzug im Mai, eine Heizrechnung für Januar bis März und eine ohne Leistungszeitraum: jede mit ihrem Anteil nach
// Heizprofil, die mit Leistungszeitraum mit den Monaten darin und der Teilung (nachrechenbar wie #232)
describe('Heizkosten mit Leistungszeitraum nach dem Heizprofil im PDF', () => {
	const months = (shares: [number, number][]) => shares.map(([month, percentage]) => ({ month, percentage }));
	const invoiceParts = [
		{ start: '2024-01-01', end: '2024-03-31', amount: 1000, days: 0, total: 91, profile: { percent: 0, months: [], periodMonths: months([[1, 18], [2, 14], [3, 11]]) } },
		{ start: '2024-01-01', end: '2024-12-31', amount: 1000, days: 245, total: 366, noPeriod: true as const, profile: { percent: 52, months: months([[5, 2], [12, 26]]), periodMonths: [] } }
	];
	const winter: StatementPDFData = {
		...due,
		heating: { profile: 'Winter', percent: 52, months: months([[5, 2], [6, 0], [7, 0], [8, 0], [9, 2], [10, 8], [11, 14], [12, 26]]) },
		lineItems: [{ category: 'Heizung', key: 'Pro Fläche (m²)', totalAmount: 2000, apartmentShare: 2000, periodShare: 0.26, invoiceParts, byProfile: true, heating: true, tenantShare: 520 }]
	};

	it('nennt jede Rechnung mit ihrem Anteil nach Heizprofil und rechnet bis zu Ihrem Anteil', async () => {
		const text = (await textOf(winter)).flowing;
		expect(text).toContain("Leistungszeitraum 01.01.2024 – 31.03.2024: CHF 1'000.00, Anteile der Monate im Heizprofil: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 %. Anteile der Monate Ihres Mietverhältnisses darin: keine; zusammen 0.00 %. Anteil nach Heizprofil: 0.00 % / 43.00 % = 0.00 %");
		expect(text).toContain("Ohne Leistungszeitraum: CHF 1'000.00, Anteil nach Heizprofil: 52.00 % (siehe Heiz- und Warmwasserkosten)");
		expect(text).toContain("Ihr Anteil: 2'000.00 × (1'000.00 × 0.00 % + 1'000.00 × 52.00 %) / 2'000.00 = 520.00");
	});

	// Fachreview 1, M-1 und M-3: der Satz zum Heizprofil gilt nur für die Rechnung ohne Leistungszeitraum
	it('schränkt den Anteil im Heizungsabschnitt und die Erläuterung auf Rechnungen ohne Leistungszeitraum ein', async () => {
		const text = (await textOf(winter)).flowing;
		expect(text).toContain('Heizkosten nach Heizprofil «Winter»: 52.00 % für eine Rechnung ohne Leistungszeitraum. Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition.');
		expect(text).toContain('Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil; bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin. Haben diese Monate im Heizprofil zusammen 0 %, zählen stattdessen Ihre Mietstage darin.');
		expect((await textOf(heated)).flowing).toContain('44.20 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode');
	});

	// Fachreview 1, V-1: der Teil in der Periode nach Tagen, mit dem Beleg wie #241; darin die Monate des Heizprofils
	it('nennt bei einem Leistungszeitraum über die Periode hinaus den Beleg und die Monate in der Periode', async () => {
		const beyond = { start: '2024-01-01', end: '2024-03-31', amount: 905.03, days: 91, total: 91, whole: { start: '2023-10-01', end: '2024-03-31', amount: 1820 }, profile: { percent: 100, months: months([[1, 18], [2, 14], [3, 11]]), periodMonths: months([[1, 18], [2, 14], [3, 11]]) } };
		const text = (await textOf({ ...winter, lineItems: [{ ...winter.lineItems[0], invoiceParts: [beyond, invoiceParts[1]] }] })).flowing;
		expect(text).toContain("Leistungszeitraum 01.10.2023 – 31.03.2024 (Rechnung CHF 1'820.00), davon 01.01.2024 – 31.03.2024: CHF 905.03, Anteile der Monate im Heizprofil: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 %. Anteile der Monate Ihres Mietverhältnisses darin: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 %. Anteil nach Heizprofil: 43.00 % / 43.00 % = 100.00 %");
	});

	it.each([
		['fr', "Période de prestation 01.01.2024 – 31.03.2024 : CHF 1'000.00, parts des mois dans le profil de chauffage : janv. 18.00 %, févr. 14.00 %, mars 11.00 % ; au total 43.00 %. Parts des mois de votre bail dans cette période : aucune ; au total 0.00 %. Part selon le profil de chauffage : 0.00 % / 43.00 % = 0.00 %", "Sans période de prestation : CHF 1'000.00, part selon le profil de chauffage : 52.00 % (voir « Frais de chauffage et d’eau chaude »)", '52.00 % pour une facture sans période de prestation.'],
		['it', "Periodo di prestazione 01.01.2024 – 31.03.2024: CHF 1'000.00, quote dei mesi nel profilo di riscaldamento: gen 18.00 %, feb 14.00 %, mar 11.00 %; in totale 43.00 %. Quote dei mesi della sua locazione in tale periodo: nessuna; in totale 0.00 %. Quota secondo il profilo di riscaldamento: 0.00 % / 43.00 % = 0.00 %", "Senza periodo di prestazione: CHF 1'000.00, quota secondo il profilo di riscaldamento: 52.00 % (vedi spese di riscaldamento e acqua calda)", '52.00 % per una fattura senza periodo di prestazione.'],
		['en', "Service period 01.01.2024 – 31.03.2024: CHF 1'000.00, monthly shares in the heating profile: Jan 18.00 %, Feb 14.00 %, Mar 11.00 %; in total 43.00 %. Monthly shares during your tenancy within it: none; in total 0.00 %. Share under the heating profile: 0.00 % / 43.00 % = 0.00 %", "Without a service period: CHF 1'000.00, share under the heating profile: 52.00 % (see ‘Heating and hot water costs’)", '52.00 % for an invoice without a service period.']
	] as const)('nennt die Rechnungen nach Heizprofil auch auf %s', async (language, line, run, note) => {
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(winter, config, language), 'base64')).flowing;
		expect(text).toContain(line);
		expect(text).toContain(run);
		expect(text).toContain(note);
	});
});

// #120, #358: die berichtigte Abrechnung nennt die ersetzte und rechnet an, was darauf schon bezahlt ist
describe('PDF einer berichtigten Abrechnung', () => {
	// bezahlt 100.00 auf NK-1-2025-0001: 784.13 − 600.00 − 100.00 = 84.13, auf 5 Rappen zugunsten des Mieters 84.10
	const corrected: StatementPDFData = {
		...due,
		statementNumber: 'NK-1-2025-0002',
		balance: 84.1,
		replaces: { statementNumber: 'NK-1-2025-0001', statementDate: '2026-02-01', paidOn: ['NK-1-2025-0001'], priorPayments: 100 }
	};

	// Fachreview W2e V-2: der Mieter hat die alte Abrechnung mit ihrem Zahlteil noch
	it('sagt, dass die ersetzte Abrechnung nicht mehr gilt und nur noch dieser Saldo zu bezahlen ist', async () => {
		expect((await textOf(corrected)).flowing).toContain(
			'Diese Abrechnung ersetzt die Abrechnung NK-1-2025-0001 vom 01.02.2026. Die Abrechnung NK-1-2025-0001 gilt nicht mehr. Bezahlen Sie nur noch den Saldo dieser Abrechnung.'
		);
	});

	it('verlangt bei einer Rückerstattung keine Zahlung', async () => {
		const flowing = (await textOf({ ...corrected, balance: -20 })).flowing;
		expect(flowing).toContain('Diese Abrechnung ersetzt die Abrechnung NK-1-2025-0001 vom 01.02.2026. Die Abrechnung NK-1-2025-0001 gilt nicht mehr.');
		expect(flowing).not.toContain('Bezahlen Sie nur noch');
	});

	it('zieht das schon Bezahlte vor der Rundung ab', async () => {
		const flowing = (await textOf(corrected)).flowing;
		expect(flowing).toContain('Akontobeiträge – 600.00 Bereits bezahlt auf NK-1-2025-0001 – 100.00');
		expect(flowing).toContain('Nachzahlung vor Rundung 84.13 Rundung auf 5 Rappen – 0.03 Nachzahlung 84.10');
		expect(flowing).toContain('bereits bezahlt CHF 100.00');
	});

	// Fachreview W2e V-4, V-11: jede Abrechnung der Kette; eine schon bezahlte Rückerstattung zählt dazu
	it('nennt jede Abrechnung, auf die zurückerstattet wurde, und zählt den Betrag dazu', async () => {
		const flowing = (
			await textOf({ ...corrected, balance: 204.1, replaces: { ...corrected.replaces!, paidOn: ['NK-1-2025-0001', 'NK-1-2025-0002'], priorPayments: -20 } })
		).flowing;
		expect(flowing).toContain('Bereits zurückerstattet auf NK-1-2025-0001 und NK-1-2025-0002 + 20.00');
		expect(flowing).toContain('bereits zurückerstattet CHF 20.00');
	});

	// Fachreview 448-1 V-2: der Saldo der ersetzten Abrechnung steht schon als Übertrag in der nächsten
	it('nennt einen schon übertragenen Saldo als verrechnet mit der nächsten Abrechnung', async () => {
		const flowing = (
			await textOf({
				...corrected,
				balance: 181.1,
				replaces: { ...corrected.replaces!, paidOn: [], priorPayments: 3, offsetWith: [{ statementNumber: 'NK-1-2026-0001', amount: 3 }] }
			})
		).flowing;
		expect(flowing).toContain('Akontobeiträge – 600.00 Bereits verrechnet mit NK-1-2026-0001 – 3.00');
		expect(flowing).not.toContain('Bereits bezahlt');
		expect(flowing).toContain('bereits verrechnet CHF 3.00');
	});

	it('nennt die ersetzte Abrechnung auf Französisch', async () => {
		const fr = readPdf(Buffer.from(await generateStatementPDFBase64(corrected, config, 'fr'), 'base64')).flowing;
		expect(fr).toContain('Ce décompte remplace le décompte NK-1-2025-0001 du 01.02.2026.');
		expect(fr).toContain('Déjà payé sur NK-1-2025-0001');
	});
});

// #464 (#103, domain review 464-1 F-6, F-9): das Akonto als Monate mal Betrag, eine Zeile pro Betrag und angebrochenem
// Monat, mit geschlossenem Zeitraum; der Hinweis sagt, dass das vereinbarte Akonto abgezogen ist
describe('Akonto als Monate mal Betrag im PDF', () => {
	const changed: StatementPDFData = {
		...refund,
		totalAdvancePayments: 1141.94,
		balance: -357.8,
		advanceLines: [
			{ from: '2025-03-16', to: '2025-03-31', days: 16, daysInMonth: 31, amount: 120, total: 61.94 },
			{ from: '2025-04-01', to: '2025-12-31', months: 9, amount: 120, total: 1080 }
		]
	};

	it('nennt jede Zeile mit ihrem Betrag unter den Akontobeiträgen und den Hinweis zum vereinbarten Akonto', async () => {
		const pdf = await textOf(changed);

		expect(pdf.flowing).toContain("Akontobeiträge – 1'141.94 16/31 Tage × CHF 120.00 (16.03.2025 – 31.03.2025) 61.94 9 Monate × CHF 120.00 (01.04.2025 – 31.12.2025) 1'080.00");
		expect(pdf.flowing).toContain('Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind. Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.');
	});

	it('nennt einen einzelnen Monat in der Einzahl, auch auf Französisch', async () => {
		const one = { ...changed, advanceLines: [{ from: '2025-12-01', to: '2025-12-31', months: 1, amount: 120, total: 120 }] };
		const french = readPdf(Buffer.from(await generateStatementPDFBase64(one, config, 'fr'), 'base64')).flowing;

		expect(french).toContain('1 mois × CHF 120.00 (01.12.2025 – 31.12.2025) 120.00');
		expect((await textOf(one)).flowing).toContain('1 Monat × CHF 120.00 (01.12.2025 – 31.12.2025) 120.00');
	});

	// #477 (product owner 2026-10-19, fach review 477-1): Dwello deducts the agreed Akonto, not the paid one
	it.each([
		['de', 'Akontobeiträge', 'Geleistete'],
		['fr', 'Acomptes', 'versés'],
		['it', 'Acconti', 'versati'],
		['en', 'Advance payments', 'made']
	] as const)('nennt die Zeile auf %s ohne «geleistet»', async (language, label, paid) => {
		const text = readPdf(Buffer.from(await generateStatementPDFBase64(changed, config, language), 'base64')).flowing;

		expect(text).toContain(`${label} – 1'141.94`);
		expect(text).not.toContain(paid);
	});

	it('zeigt bei einer älteren Abrechnung ohne gespeicherte Zeilen nur die Summe', async () => {
		expect((await textOf(refund)).flowing).not.toContain('Monate ×');
	});
});
