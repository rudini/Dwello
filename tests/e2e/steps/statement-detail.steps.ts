import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { downloadedFile, downloadedPdfTitle } from '../questions/download';
import { heatingCosts, pdfToView, recipient, sendConfirmation, statusOfStatement } from '../questions/statement-detail';
import { emptyStatementList, statementOfYear, statementPath } from '../questions/statements';
import { searchStatements } from '../tasks/statements';
import { francs } from '../tasks/statement-generate-api';
import {
	deleteStatement,
	downloadStatementPdf,
	editStatementFromDetail,
	generateStatementPdf,
	markStatementPaid,
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
	async ({ verwalter, driver }, _tenant: string, share: number, amount: string) => {
		if (driver === 'api') {
			const { lineItems } = verwalter.recall<{ lineItems: { description: string; sharePercentage: string; tenantShare: string }[] }>('statement');
			const heating = lineItems.find((item) => item.description === 'Heating')!;
			expect([Number(heating.sharePercentage), Number(heating.tenantShare)]).toEqual([share, francs(amount)]);
			return;
		}
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
