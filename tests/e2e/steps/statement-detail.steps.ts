import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { downloadedFile, downloadedPdfText, downloadedPdfTitle } from '../questions/download';
import { deleteOffer, heatingCosts, historyOf, paidDate, pdfToView, recipient, sendConfirmation, statusOfStatement } from '../questions/statement-detail';
import { emptyStatementList, statementOfYear, statementPath } from '../questions/statements';
import { searchStatements } from '../tasks/statements';
import { francs } from '../tasks/statement-generate-api';
import {
	deleteStatement,
	downloadStatementPdf,
	editStatementFromDetail,
	generateStatementPdf,
	markStatementPaid,
	markStatementPaidOn,
	openStatementApartment,
	openSendConfirmation,
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
	async ({ verwalter, seed, driver }, year: number, tenant: string) => {
		if (driver === 'api') verwalter.remember('statement', await seed.backend.get(statementPath(seed, tenant, year).slice(1)));
		else await visit(verwalter.page, statementPath(seed, tenant, year));
	}
);

When('der Liegenschaftsverwalter die Abrechnung versendet', async ({ verwalter }) => {
	await verwalter.perform(sendStatement);
});

When('der Liegenschaftsverwalter die Abrechnung als versendet markieren will', async ({ verwalter }) => {
	await verwalter.perform(openSendConfirmation);
});

Then(
	'nennt die Bestätigung den Empfänger {string} mit dem Korrespondenzkanal {string}',
	async ({ verwalter, names }, tenant: string, channel: string) => {
		await expect(recipient(verwalter)).toContainText(names.get(tenant) ?? tenant);
		await expect(recipient(verwalter)).toContainText(channel);
	}
);

Then('sagt die Bestätigung, dass Dwello die Abrechnung nicht selbst verschickt', async ({ verwalter }) => {
	await expect(sendConfirmation(verwalter)).toContainText('Dwello verschickt die Abrechnung nicht selbst');
});

Then('bietet die Bestätigung das PDF der Abrechnung zum Ansehen an', async ({ verwalter }) => {
	await expect(pdfToView(verwalter)).toHaveAttribute('href', /\/pdf\?ansehen$/);
});

When('der Liegenschaftsverwalter die Abrechnung als bezahlt markiert', async ({ verwalter }) => {
	await verwalter.perform(markStatementPaid);
});

When('der Liegenschaftsverwalter die Abrechnung als am {string} bezahlt markiert', async ({ verwalter }, date: string) => {
	await verwalter.perform(markStatementPaidOn(date));
});

Then('nennt der Verlauf {string} am {string}', async ({ verwalter }, label: string, date: string) => {
	await expect(historyOf(verwalter)).toContainText(new RegExp(`${label}\\s*${date.replace(/\./g, '\\.')}`));
});

Then('meldet das Feld «Bezahlt am» {string}', async ({ verwalter }, message: string) => {
	const field = paidDate(verwalter);
	await expect(field).toHaveAttribute('aria-invalid', 'true');
	await expect(field).toHaveAccessibleDescription(new RegExp(message.replace(/\./g, '\\.')));
});

When('der Liegenschaftsverwalter die Abrechnung löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteStatement);
});

Then('bietet die Detailseite das Löschen der Abrechnung nicht an', async ({ verwalter }) => {
	await expect(deleteOffer(verwalter)).toHaveCount(0);
});

When('der Liegenschaftsverwalter die Abrechnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(editStatementFromDetail);
});

When('der Liegenschaftsverwalter den Mieter der Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.perform(openStatementTenant);
});

When('der Liegenschaftsverwalter die Wohnung der Abrechnung öffnet', async ({ verwalter }) => {
	await verwalter.perform(openStatementApartment);
});

Then(
	'trägt {string} {int} % der Heizkosten, also {string}',
	async ({ verwalter, driver }, _tenant: string, share: number, amount: string) => {
		if (driver === 'api') {
			const { lineItems } = verwalter.recall<{ lineItems: { description: string; sharePercentage: string; tenantShare: string }[] }>('statement');
			const heating = lineItems.find((item) => item.description === 'Heating')!;
			expect([Number(heating.sharePercentage), Number(heating.tenantShare)]).toEqual([share, francs(amount)]);
			return;
		}
		await expect(heatingCosts(verwalter)).toContainText(`${share} %`);
		await expect(heatingCosts(verwalter)).toContainText(amount);
	}
);

Then('hat die Abrechnung den Status {string}', async ({ verwalter }, status: string) => {
	await expect(statusOfStatement(verwalter)).toHaveText(status);
});

Then(
	'ist der Liegenschaftsverwalter auf der Bearbeitungsseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await expect(verwalter.page).toHaveURL(`${statementPath(seed, tenant, year)}/edit`);
	}
);

When('der Liegenschaftsverwalter das PDF der Abrechnung erstellt', async ({ verwalter }) => {
	await verwalter.perform(generateStatementPdf);
});

When('der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt', async ({ verwalter }) => {
	await verwalter.perform(downloadStatementPdf);
});

Then('erhält der Liegenschaftsverwalter die Abrechnung als PDF', async ({ verwalter }) => {
	const file = await downloadedFile(verwalter);
	expect(file.name).toMatch(/\.pdf$/);
	expect(file.header).toBe('%PDF-');
});

// from any page: the list of statements, searched for the tenant
Then(
	'findet die Abrechnungsliste keine Abrechnung {int} von {string}',
	async ({ verwalter, names }, year: number, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await visit(verwalter.page, '/statements');
		await verwalter.perform(searchStatements(name));
		await expect(emptyStatementList(verwalter)).toBeVisible();
		await expect(statementOfYear(verwalter, name, year)).toHaveCount(0);
	}
);

Then(
	'die Abrechnung {int} von {string} ist nicht mehr auffindbar',
	async ({ verwalter, names }, year: number, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.perform(searchStatements(name));
		await expect(emptyStatementList(verwalter)).toBeVisible();
		await expect(statementOfYear(verwalter, name, year)).toHaveCount(0);
	}
);

Then('trägt das PDF den Titel {string}', async ({ verwalter }, title: string) => {
	expect(await downloadedPdfTitle(verwalter)).toContain(title);
});

Given('im Gebäude {string} war am {string} Heizöl für {string} Franken im Tank', async ({ seed }, building: string, date: string, amount: string) => {
	await seed.fuelStock(building, date, amount);
});

Then('steht im PDF {string}', async ({ verwalter }, text: string) => {
	expect(await downloadedPdfText(verwalter)).toContain(text);
});

Then('nennt die Abrechnung das Heizprofil {string}', async ({ verwalter, names }, profile: string) => {
	await expect(verwalter.page.getByTestId('statement-heating-profile')).toContainText(names.get(profile)!);
});
