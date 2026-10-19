import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { francs } from '../questions/amounts';
import { downloadedFileHeader, downloadedFileName, downloadedPdfText, downloadedPdfTitle } from '../questions/download';
import {
	balanceAmount,
	changeOffers,
	correctConfirmation,
	deadlineShown,
	paymentText,
	replacedDone,
	priorPaymentsAmount,
	replacedStatementLink,
	deleteOffers,
	heatingCostsOfTenant,
	heatingProfileOfStatement,
	history,
	invoiceOfPosition,
	invoicesOfPosition,
	laterInvoicesHint,
	laterInvoicesHints,
	languageOfPdf,
	paidDateInvalid,
	paidDateProblem,
	pdfRefusalText,
	pdfToView,
	recipient,
	resetConfirmation,
	sendConfirmation,
	sharesOfPosition,
	statusOfStatement,
	tenancyOfStatement,
	totalLabelOfStatement,
	oldAddressWarningText,
	advancePaidOfStatement,
	advanceDiffersText
} from '../questions/statement-detail';
import {
	downloadedFileNameByNumber,
	listedStatementNumber,
	listedStatementsOfYear,
	pageAddressInApp,
	statementListEmpty,
	statementPath
} from '../questions/statements';
import { openStatementList, searchStatements } from '../tasks/statements';
import {
	correctStatement,
	recalculateDraft,
	createCorrection,
	openCorrectConfirmation,
	openCorrection,
	openReplacedContract,
	openReplacedStatement,
	deleteStatement,
	downloadStatementPdf,
	requestStatementPdf,
	leavePdfRefusal,
	editStatementFromDetail,
	generateStatementPdf,
	markStatementPaid,
	markStatementPaidOn,
	openResetPaymentConfirmation,
	openSendConfirmation,
	openStatementApartment,
	openInvoiceOfPosition,
	openStatementDetail,
	openStatementTenant,
	resetPayment,
	sendStatement,
	confirmSending
} from '../tasks/statement-detail';
import { inDays } from '../fixtures/dates';

const { Given, When, Then } = createBdd(test);

// The day a statement sent in the scenario is dated, as the page prints it
const sendingDay = () => inDays(0).split('-').reverse().join('.');

Given('das Heizprofil {string} verteilt die Heizkosten so:', async ({ seed }, title: string, table: DataTable) => {
	await seed.heatingProfile(title, table.hashes().map((row) => Number(row.Anteil)));
});

Given('das Heizprofil {string} heisst danach {string}', async ({ seed }, title: string, newTitle: string) => {
	await seed.renameHeatingProfile(title, newTitle);
});

Given('das Heizprofil {string} verteilt die Heizkosten danach so:', async ({ seed }, title: string, table: DataTable) => {
	await seed.changeHeatingProfile(title, table.hashes().map((row) => Number(row.Anteil)));
});

Given(
	'im Gebäude {string} gibt es eine Heizkostenrechnung über {string} Franken für {int}',
	async ({ seed }, building: string, amount: string, year: number) => {
		await seed.heatingInvoice(building, amount, year);
	}
);

Given(
	'im Gebäude {string} gibt es eine Rechnung der Kategorie {string} über {string} Franken vom {string} für die Zeit vom {string} bis {string}',
	async ({ seed }, building: string, category: string, amount: string, date: string, from: string, to: string) => {
		await seed.invoiceOn(building, category, amount, date, [from, to]);
	}
);

Given(
	'im Gebäude {string} gibt es eine Rechnung der Kategorie {string} über {string} Franken vom {string}',
	async ({ seed }, building: string, category: string, amount: string, date: string) => {
		await seed.invoiceOn(building, category, amount, date);
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung {int} mit dem Heizprofil {string}',
	async ({ seed }, tenant: string, building: string, year: number, profile: string) => {
		await seed.statement(tenant, building, year, profile);
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung vom {string} bis {string} mit dem Heizprofil {string}',
	async ({ seed }, tenant: string, building: string, start: string, end: string, profile: string) => {
		await seed.statement(tenant, building, Number(start.slice(0, 4)), profile, [start, end]);
	}
);

Given('die Abrechnung {int} von {string} ist versendet', async ({ seed }, year: number, tenant: string) => {
	await seed.sendStatement(tenant, year);
});

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementDetail(statementPath(seed, tenant, year)));
	}
);

When('der Liegenschaftsverwalter die Abrechnung versendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(sendStatement);
});

When('der Liegenschaftsverwalter die Abrechnung als versendet markieren will', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSendConfirmation);
});

Then(
	'nennt die Bestätigung den Empfänger {string} mit dem Korrespondenzkanal {string}',
	async ({ verwalter, names }, tenant: string, channel: string) => {
		await verwalter.sees(recipient).toContain(names.get(tenant) ?? tenant);
		await verwalter.sees(recipient).toContain(channel);
	}
);

Then('nennt die Bestätigung die Korrespondenzadresse {string}', async ({ verwalter }, address: string) => {
	await verwalter.sees(recipient).toContain(address);
});

Then('sagt die Bestätigung, dass Dwello die Abrechnung nicht selbst verschickt', async ({ verwalter }) => {
	await verwalter.sees(sendConfirmation).toContain('Dwello verschickt die Abrechnung nicht selbst');
});

Then('bietet die Bestätigung das PDF der Abrechnung zum Ansehen an', async ({ verwalter }) => {
	await verwalter.sees(pdfToView).toMatch(/\/pdf\?ansehen$/);
});

When('der Liegenschaftsverwalter die Abrechnung als bezahlt markiert', async ({ verwalter }) => {
	await verwalter.attemptsTo(markStatementPaid);
});

When('der Liegenschaftsverwalter die Abrechnung als am {string} bezahlt markiert', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(markStatementPaidOn(date));
});

Then('meldet das Feld «Bezahlt am» {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(paidDateInvalid).toBe('true');
	await verwalter.sees(paidDateProblem).toMatch(new RegExp(message.replace(/\./g, '\\.')));
});

When('der Liegenschaftsverwalter die Abrechnung löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteStatement);
});

Then('bietet die Detailseite das Löschen der Abrechnung nicht an', async ({ verwalter }) => {
	await verwalter.sees(deleteOffers).toBe(0);
});

When('der Liegenschaftsverwalter die Abrechnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(editStatementFromDetail);
});

When('der Liegenschaftsverwalter den Mieter der Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openStatementTenant);
});

When('der Liegenschaftsverwalter die Wohnung der Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openStatementApartment);
});

Then(
	'trägt {string} {float} % der Heizkosten, also {string}',
	async ({ verwalter }, _tenant: string, share: number, amount: string) => {
		await verwalter.sees(heatingCostsOfTenant).toEqual({ share, amount: francs(amount) });
	}
);

Then('sagt die Zahlung der Abrechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(paymentText).toBe(text);
});

Then('hat die Abrechnung den Status {string}', async ({ verwalter }, status: string) => {
	await verwalter.sees(statusOfStatement).toBe(status);
});

Then(
	'ist der Liegenschaftsverwalter auf der Bearbeitungsseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.sees(pageAddressInApp).toBe(`${statementPath(seed, tenant, year)}/edit`);
	}
);

When('der Liegenschaftsverwalter das PDF der Abrechnung erstellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(generateStatementPdf);
});

When('der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(downloadStatementPdf);
});

Then('erhält der Liegenschaftsverwalter die Abrechnung als PDF', async ({ verwalter }) => {
	await verwalter.sees(downloadedFileName).toMatch(/\.pdf$/);
	await verwalter.sees(downloadedFileHeader).toBe('%PDF-');
});

Then('heisst die Datei wie die Abrechnungsnummer, mit der Endung {string}', async ({ verwalter }, ending: string) => {
	await verwalter.sees(downloadedFileNameByNumber).toBe(`<Nummer>${ending}`);
});

Then('endet die Abrechnungsnummer von {string} auf {string}', async ({ verwalter, names }, tenant: string, ending: string) => {
	await verwalter.sees(listedStatementNumber(names.get(tenant) ?? tenant)).toMatch(new RegExp(`${ending}$`));
});

// from any page: the list of statements, searched for the tenant
Then(
	/^findet die Abrechnungsliste (keine|die) Abrechnung (\d+) von "([^"]*)"$/,
	async ({ verwalter, names }, which: string, year: string, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openStatementList, searchStatements(name));
		await verwalter.sees(listedStatementsOfYear(name, Number(year))).toBe(which === 'die' ? 1 : 0);
	}
);

Then(
	'die Abrechnung {int} von {string} ist nicht mehr auffindbar',
	async ({ verwalter, names }, year: number, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(searchStatements(name));
		await verwalter.sees(statementListEmpty).toBe(true);
		await verwalter.sees(listedStatementsOfYear(name, year)).toBe(0);
	}
);

Then('trägt das PDF den Titel {string}', async ({ verwalter }, title: string) => {
	await verwalter.sees(downloadedPdfTitle).toContain(title);
});

Given('im Gebäude {string} war am {string} Heizöl für {string} Franken im Tank', async ({ seed }, building: string, date: string, amount: string) => {
	await seed.fuelStock(building, date, amount);
});

Then('steht im PDF {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(downloadedPdfText).toContain(text);
});

Then('steht im PDF nicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(downloadedPdfText).not.toContain(text);
});

Then('nennt die Abrechnung das Heizprofil {string}', async ({ verwalter, names }, profile: string) => {
	await verwalter.sees(heatingProfileOfStatement).toContain(names.get(profile)!);
});

Then('nennt die Abrechnung kein Heizprofil', async ({ verwalter }) => {
	await verwalter.sees(heatingProfileOfStatement).toBeNull();
});

Then(
	'nennt die Abrechnung das Heizprofil {string} als nicht angewendet: {string}',
	async ({ verwalter, names }, profile: string, reason: string) => {
		await verwalter.sees(heatingProfileOfStatement).toContain(`${names.get(profile)} (nicht angewendet: ${reason})`);
	}
);

When('der Liegenschaftsverwalter das PDF der Abrechnung anfordert', async ({ verwalter }) => {
	await verwalter.attemptsTo(requestStatementPdf);
});

When('der Liegenschaftsverwalter von dort zu den Nebenkostenabrechnungen zurückkehrt', async ({ verwalter }) => {
	await verwalter.attemptsTo(leavePdfRefusal);
});

Then('liest der Liegenschaftsverwalter {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(pdfRefusalText).toBe(text);
});

Then('nennt die Abrechnung das Mietverhältnis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(tenancyOfStatement).toBe(text);
});

Then(
	'nennt die Position {string} den Wohnungsanteil {string}, den Zeitanteil {string} und den Betrag {string}',
	async ({ verwalter }, category: string, apartment: string, time: string, amount: string) => {
		await verwalter.sees(sharesOfPosition(category)).toEqual({ apartment, time, amount });
	}
);

Then('heisst die Summe der Kosten der Abrechnung {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(totalLabelOfStatement).toBe(label);
});

Then(
	'nennt die Position {string} die Rechnung {string} mit {string}',
	async ({ verwalter }, category: string, invoice: string, text: string) => {
		await verwalter.sees(invoiceOfPosition(category, invoice)).toContain(text);
	}
);

Then('nennt die Position {string} {string}', async ({ verwalter }, category: string, text: string) => {
	await verwalter.sees(invoicesOfPosition(category)).toContain(text);
});

When(
	'der Liegenschaftsverwalter die Rechnung {string} der Position {string} öffnet',
	async ({ verwalter }, invoice: string, category: string) => {
		await verwalter.attemptsTo(openInvoiceOfPosition(category, invoice));
	}
);

Then('weist die Abrechnung darauf hin: {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(laterInvoicesHint).toContain(text);
});

Then('weist die Abrechnung auf keine geänderten Rechnungen hin', async ({ verwalter }) => {
	await verwalter.sees(laterInvoicesHints).toBe(0);
});

Then('nennt die Abrechnung {string}', async ({ verwalter }, language: string) => {
	await verwalter.sees(languageOfPdf).toBe(language);
});

Given('die Abrechnung {int} von {string} ist bezahlt', async ({ seed }, year: number, tenant: string) => {
	await seed.markPaid(tenant, year);
});

Given('die Zahlung der Abrechnung {int} von {string} ist inzwischen zurückgesetzt', async ({ seed }, year: number, tenant: string) => {
	await seed.resetPayment(tenant, year);
});

When('der Liegenschaftsverwalter die Abrechnung als am Tag des Versands bezahlt markiert', async ({ verwalter }) => {
	await verwalter.attemptsTo(markStatementPaidOn(inDays(0)));
});

Then('nennt der Verlauf {string} am Tag des Versands', async ({ verwalter }, label: string) => {
	await verwalter.sees(history).toMatch(new RegExp(`${label}\\s*${sendingDay().replace(/\./g, '\\.')}`));
});

Then(
	'meldet das Feld «Bezahlt am», dass das Zahlungsdatum vor dem Abrechnungsdatum vom Tag des Versands liegt',
	async ({ verwalter }) => {
		await verwalter.sees(paidDateInvalid).toBe('true');
		await verwalter.sees(paidDateProblem).toContain(`Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom ${sendingDay()}.`);
	}
);

When('der Liegenschaftsverwalter die Zahlung zurücksetzt', async ({ verwalter }) => {
	await verwalter.attemptsTo(resetPayment);
});

When('der Liegenschaftsverwalter die Zahlung zurücksetzen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(openResetPaymentConfirmation);
});

Then('nennt der Verlauf das Zurücksetzen der Zahlung vom Tag des Versands', async ({ verwalter }) => {
	await verwalter.sees(history).toContain(`Zahlung vom ${sendingDay()} zurückgesetzt ${sendingDay()}`);
});

Then(
	'sagt die Bestätigung, dass die Abrechnung wieder als nicht bezahlt gilt und das Zahlungsdatum gelöscht wird',
	async ({ verwalter }) => {
		await verwalter.sees(resetConfirmation).toContain('gilt dann wieder als nicht bezahlt');
		await verwalter.sees(resetConfirmation).toContain(`Das Zahlungsdatum ${sendingDay()} wird gelöscht.`);
	}
);

// #120, #358: berichtigte Abrechnung
Given('die Abrechnung {int} von {string} ist ersetzt', async ({ seed }, year: number, tenant: string) => {
	await seed.replaceStatement(tenant, year);
});

Given('der Mietvertrag von {string} beginnt danach am {string}', async ({ seed }, tenant: string, date: string) => {
	await seed.contractStart(tenant, date);
});

Given('die Abrechnung {int} von {string} ist berichtigt', async ({ seed }, year: number, tenant: string) => {
	await seed.replaceStatement(tenant, year, true);
});

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementDetail(`/statements/${seed.idOf(`Berichtigte Abrechnung ${tenant} ${year}`)}`));
	}
);

When('der Liegenschaftsverwalter den Entwurf neu berechnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(recalculateDraft);
});

When('der Liegenschaftsverwalter die Abrechnung berichtigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(correctStatement);
});

When('der Liegenschaftsverwalter die Abrechnung berichtigen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(openCorrectConfirmation);
});

When('der Liegenschaftsverwalter die berichtigte Abrechnung erstellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(createCorrection);
});

When('der Liegenschaftsverwalter die berichtigte Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openCorrection);
});

When('der Liegenschaftsverwalter den Mietvertrag der ersetzten Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openReplacedContract);
});

Then('bestätigt Dwello {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(replacedDone).toContain(text);
});

Then('sagt die Abrechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(paymentText).toContain(text);
});

Then('nennt die Abrechnung keine Zahlungsfrist', async ({ verwalter }) => {
	await verwalter.sees(deadlineShown).toBe(0);
});

When('der Liegenschaftsverwalter die ersetzte Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openReplacedStatement);
});

Then(
	'nennt die Abrechnung, dass sie die Abrechnung {int} von {string} ersetzt',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.sees(replacedStatementLink).toBe(statementPath(seed, tenant, year));
	}
);

Then('sagt die Bestätigung, dass die Abrechnung ersetzt wird und unverändert bleibt', async ({ verwalter }) => {
	await verwalter.sees(correctConfirmation).toContain('durch eine berichtigte Abrechnung ersetzt');
	await verwalter.sees(correctConfirmation).toContain('bleibt unverändert erhalten');
});

Then('nennt die Bestätigung die Verjährung nach fünf Jahren', async ({ verwalter }) => {
	await verwalter.sees(correctConfirmation).toContain('fünf Jahren (Art. 128 Ziff. 1 OR)');
});

Then(
	'warnt die berichtigte Abrechnung, dass ihre Akontobeiträge {string} anders sind als die {string} der ersetzten Abrechnung {int} von {string}',
	async ({ verwalter, seed }, now: string, before: string, year: number, tenant: string) => {
		const replaced = await seed.statementNumber(tenant, year);
		await verwalter
			.sees(advanceDiffersText)
			.toContain(`Die Akontobeiträge dieser Abrechnung (${now}) sind anders als in der ersetzten Abrechnung ${replaced} (${before}). Stimmt ein früherer Betrag am Mietvertrag nicht, löschen Sie diesen Entwurf, tragen Sie den Betrag mit seinem «Gültig ab» ein und erstellen Sie die berichtigte Abrechnung erneut.`);
	}
);

Then('zieht die Abrechnung {string} Akontobeiträge ab', async ({ verwalter }, amount: string) => {
	await verwalter.sees(advancePaidOfStatement).toContain(amount);
});

Then('rechnet die Abrechnung {string} als bereits bezahlt an', async ({ verwalter }, amount: string) => {
	await verwalter.sees(priorPaymentsAmount).toBe(francs(amount));
});

Then('beträgt der Saldo der Abrechnung {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(balanceAmount).toBe(francs(amount));
});

Then('bietet die Detailseite weder Zahlung noch Mahnung noch Bearbeitung noch Berichtigung der Abrechnung an', async ({ verwalter }) => {
	await verwalter.sees(changeOffers).toBe(0);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der berichtigten Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.sees(pageAddressInApp).toBe(`/statements/${seed.idOf(`Berichtigte Abrechnung ${tenant} ${year}`)}`);
	}
);

When('der Liegenschaftsverwalter den Versand trotzdem bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmSending);
});

// A-5 (#114): the warning starts with the tenant's full name
Then(
	'warnt die Bestätigung, dass {string} ausgezogen ist: {string}',
	async ({ verwalter, names }, tenant: string, rest: string) => {
		await verwalter.sees(sendConfirmation).toContain(`${names.get(tenant)} ist ausgezogen. ${rest}`);
	}
);

// Persona W3c Anna P-2: on the page itself, before the dialog
Then(
	'warnt die Detailseite der Abrechnung, dass {string} ausgezogen ist: {string}',
	async ({ verwalter, names }, tenant: string, rest: string) => {
		await verwalter.sees(oldAddressWarningText).toContain(`${names.get(tenant)} ist ausgezogen. ${rest}`);
	}
);
