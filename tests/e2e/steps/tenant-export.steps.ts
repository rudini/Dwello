import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { inDays } from '../fixtures/dates';
import {
	exportedContractApartments,
	exportedStatementNumbers,
	exportedTenantName,
	fileNamesInDownloadedZip
} from '../questions/download';
import { exportTenantData } from '../tasks/tenant-detail';

const { When, Then } = createBdd(test);

// the year of «hat eine versendete Abrechnung, …» (dashboard.steps.ts)
const lastYear = Number(inDays(0).slice(0, 4)) - 1;

When('der Liegenschaftsverwalter die Daten von {string} exportiert', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(exportTenantData(seed.idOf(tenant)!));
});

Then(
	'enthält der Export die Stammdaten, den Mietvertrag und die Abrechnung von {string}',
	async ({ verwalter, names, seed }, tenant: string) => {
		await verwalter.sees(exportedTenantName).toBe(names.get(tenant));
		await verwalter.sees(exportedContractApartments).toEqual(['1.01']);
		await verwalter.sees(exportedStatementNumbers).toEqual([await seed.statementNumber(tenant, lastYear)]);
	}
);

Then(
	'enthält der Export das Dokument {string} und das PDF der Abrechnung von {string}',
	async ({ verwalter, seed }, title: string, tenant: string) => {
		const statement = `abrechnungen/${await seed.statementNumber(tenant, lastYear)}.pdf`;
		await verwalter.sees(fileNamesInDownloadedZip).toEqual(['daten.json', `dokumente/${title}.pdf`, statement].sort());
	}
);
