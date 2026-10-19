import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { inDays } from '../fixtures/dates';
import {
	everythingExported,
	exportedContractApartments,
	exportedReminderFiles,
	exportedReminderStatements,
	exportedStatementNumbers,
	exportedTenantName,
	fileNamesInDownloadedZip
} from '../questions/download';
import { exportTenantData } from '../tasks/tenant-detail';

const { Given, When, Then } = createBdd(test);

// the year of «hat eine versendete Abrechnung, …» (dashboard.steps.ts)
const lastYear = Number(inDays(0).slice(0, 4)) - 1;

Given('die PDF dieser Abrechnung von {string} liegt vor', async ({ seed }, tenant: string) => {
	await seed.statementPdf(tenant, lastYear);
});

Given('{string} hat für diese Abrechnung eine Zahlungserinnerung erhalten', async ({ seed }, tenant: string) => {
	await seed.remind(tenant, lastYear);
});

When('der Liegenschaftsverwalter die Daten von {string} exportiert', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(exportTenantData(seed.idOf(tenant)!));
});

Then(
	'enthält der Export Name und Kontaktdaten, den Mietvertrag, die Abrechnung und die Zahlungserinnerung von {string}',
	async ({ verwalter, names, seed }, tenant: string) => {
		const statement = await seed.statementNumber(tenant, lastYear);
		await verwalter.sees(exportedTenantName).toBe(names.get(tenant));
		await verwalter.sees(exportedContractApartments).toEqual(['1.01']);
		await verwalter.sees(exportedStatementNumbers).toEqual([statement]);
		await verwalter.sees(exportedReminderStatements).toEqual([statement]);
	}
);

Then(
	'enthält der Export das Dokument {string}, das PDF der Abrechnung und die Zahlungserinnerung von {string}',
	async ({ verwalter, seed }, title: string, tenant: string) => {
		const statement = `abrechnungen/${await seed.statementNumber(tenant, lastYear)}.pdf`;
		const documents = [title, 'Zahlungserinnerung'].map((name) => `dokumente/${inDays(0)} ${name}.pdf`);
		await verwalter.sees(fileNamesInDownloadedZip).toEqual(['daten.json', ...documents, statement].sort());
		await verwalter.sees(exportedReminderFiles).toEqual([documents[1]]);
	}
);

Then('enthält der Export keine Daten von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(everythingExported).not.toContain(names.get(tenant)!.split(' ')[1]);
	await verwalter.sees(everythingExported).not.toContain('Kündigung');
});
