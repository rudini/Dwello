import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { downloadedFile } from '../questions/download';
import { heatingCosts, statusOfStatement } from '../questions/statement-detail';
import { statementPath } from '../questions/statements';
import {
	deleteStatement,
	downloadStatementPdf,
	editStatementFromDetail,
	generateStatementPdf,
	markStatementPaid,
	openStatementApartment,
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
		await visit(verwalter.page, statementPath(seed, tenant, year));
	}
);

When('der Liegenschaftsverwalter die Abrechnung versendet', async ({ verwalter }) => {
	await verwalter.perform(sendStatement);
});

When('der Liegenschaftsverwalter die Abrechnung als bezahlt markiert', async ({ verwalter }) => {
	await verwalter.perform(markStatementPaid);
});

When('der Liegenschaftsverwalter die Abrechnung löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteStatement);
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
	async ({ verwalter }, _tenant: string, share: number, amount: string) => {
		await expect(heatingCosts(verwalter)).toContainText(`${share}%`);
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
