import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { francs } from '../questions/amounts';
import { downloadedFileHeader, downloadedFileName, downloadedPdfText, downloadedPdfTitle } from '../questions/download';
import {
	deleteOffers,
	heatingCostsOfTenant,
	heatingProfileOfStatement,
	history,
	paidDateInvalid,
	paidDateProblem,
	pdfRefusalText,
	pdfToView,
	recipient,
	sendConfirmation,
	statusOfStatement
} from '../questions/statement-detail';
import { listedStatementsOfYear, pageAddressInApp, statementListEmpty, statementPath } from '../questions/statements';
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
	openSendConfirmation,
	openStatementApartment,
	openStatementDetail,
	openStatementTenant,
	sendStatement
} from '../tasks/statement-detail';

const { Given, When, Then } = createBdd(test);

Given('das Heizprofil {string} verteilt die Heizkosten so:', async ({ seed }, title: string, table: DataTable) => {
	await seed.heatingProfile(title, table.hashes().map((row) => Number(row.Anteil)));
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

Then('nennt der Verlauf {string} am {string}', async ({ verwalter }, label: string, date: string) => {
	await verwalter.sees(history).toMatch(new RegExp(`${label}\\s*${date.replace(/\./g, '\\.')}`));
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

// from any page: the list of statements, searched for the tenant
Then(
	'findet die Abrechnungsliste keine Abrechnung {int} von {string}',
	async ({ verwalter, names }, year: number, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openStatementList, searchStatements(name));
		await verwalter.sees(listedStatementsOfYear(name, year)).toBe(0);
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

Then('nennt die Abrechnung das Heizprofil {string}', async ({ verwalter, names }, profile: string) => {
	await verwalter.sees(heatingProfileOfStatement).toContain(names.get(profile)!);
});

When('der Liegenschaftsverwalter das PDF der Abrechnung anfordert', async ({ verwalter }) => {
	await verwalter.attemptsTo(requestStatementPdf);
});

When('der Liegenschaftsverwalter von dort zu den Nebenkostenabrechnungen zurückkehrt', async ({ verwalter }) => {
	await verwalter.attemptsTo(leavePdfRefusal);
});

Then('liest der Liegenschaftsverwalter {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(pdfRefusalText).toBe(text);
});
