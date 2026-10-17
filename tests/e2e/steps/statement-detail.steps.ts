import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { francs } from '../questions/amounts';
import { downloadedFileHeader, downloadedFileName, downloadedPdfText, downloadedPdfTitle } from '../questions/download';
import {
	deleteOffers,
	heatingCostsOfTenant,
	heatingProfileOfStatement,
	history,
	languageOfPdf,
	paidDateInvalid,
	paidDateProblem,
	pdfRefusalText,
	pdfToView,
	recipient,
	resetConfirmation,
	sendConfirmation,
	statusOfStatement,
	oldAddressWarningText
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
	'trägt {string} {int} % der Heizkosten, also {string}',
	async ({ verwalter }, _tenant: string, share: number, amount: string) => {
		await verwalter.sees(heatingCostsOfTenant).toEqual({ share, amount: francs(amount) });
	}
);

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
