import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	allPreviewRows,
	feeAboveGuideline,
	generationOutcome,
	noContractsInPeriod,
	periodChoice,
	previewRow
} from '../questions/statement-generate';
import {
	generateMore,
	generateStatements,
	openPreview,
	returnToStatementList,
	setManagementFee,
	showCreatedStatements
} from '../tasks/statement-generate';

import {
	createdStatements,
	francs,
	generateStatementsViaApi,
	openPreviewViaApi,
	previewTotals
} from '../tasks/statement-generate-api';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen',
	async ({ verwalter, driver }) => {
		if (driver === 'ui') await visit(verwalter.page, '/statements/generate');
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string) => {
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? openPreviewViaApi(seed, year, buildingId) : openPreview(year, buildingId)
		);
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed, driver }, year: number, building: string) => {
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? generateStatementsViaApi(seed, year, buildingId) : generateStatements(year, buildingId)
		);
	}
);

Given(
	'der Liegenschaftsverwalter hat die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.perform(generateStatements(year, seed.idOf(building)!));
		await expect(generationOutcome(verwalter)).toBeVisible();
	}
);

When('der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt', async ({ verwalter }) => {
	await verwalter.perform(showCreatedStatements);
});

When('der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt', async ({ verwalter }) => {
	await verwalter.perform(returnToStatementList);
});

Then(
	'enthält die Vorschau die Abrechnung von {string}',
	async ({ verwalter, names, driver }, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		if (driver === 'api') expect([...previewTotals(verwalter).keys()]).toContain(name);
		else await expect(previewRow(verwalter, name)).toBeVisible();
	}
);

Then('die Vorschau enthält genau {int} Abrechnungen', async ({ verwalter, driver }, count: number) => {
	if (driver === 'api') expect(previewTotals(verwalter).size).toBe(count);
	else await expect(allPreviewRows(verwalter)).toHaveCount(count);
});

Then(
	'meldet die Vorschau, dass es in der Periode keine Mietverträge gibt',
	async ({ verwalter, driver }) => {
		if (driver === 'api') expect(previewTotals(verwalter).size).toBe(0);
		else await expect(noContractsInPeriod(verwalter)).toBeVisible();
	}
);

Then('wurden {int} Nebenkostenabrechnungen erstellt', async ({ verwalter, driver }, count: number) => {
	if (driver === 'api') expect(createdStatements(verwalter)).toBe(count);
	else await expect(generationOutcome(verwalter)).toHaveText(`${count} Nebenkostenabrechnungen wurden erfolgreich erstellt.`);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} und {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string, profile: string, fee: number) => {
		const options = { heatingProfileId: seed.idOf(profile), managementFeePercent: fee };
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? openPreviewViaApi(seed, year, buildingId, options) : openPreview(year, buildingId, options)
		);
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale nach dem Verteilschlüssel {string} öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string, fee: number, key: string) => {
		const options = { managementFeePercent: fee, managementFeeKey: key };
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? openPreviewViaApi(seed, year, buildingId, options) : openPreview(year, buildingId, options)
		);
	}
);

When('der Liegenschaftsverwalter die Verwaltungspauschale auf {float} % setzt', async ({ verwalter }, fee: number) => {
	await verwalter.perform(setManagementFee(fee));
});

Then(
	'kostet die Abrechnung von {string} {string}',
	async ({ verwalter, names, driver }, tenant: string, amount: string) => {
		if (driver === 'api') expect(previewTotals(verwalter).get(names.get(tenant) ?? tenant)).toBe(francs(amount));
		else await expect(previewRow(verwalter, names.get(tenant) ?? tenant)).toContainText(amount);
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Hinweis, dass die Verwaltungspauschale über dem üblichen Richtwert liegt',
	async ({ verwalter }) => {
		await expect(feeAboveGuideline(verwalter)).toBeVisible();
	}
);

When('der Liegenschaftsverwalter weitere Abrechnungen erstellen will', async ({ verwalter }) => {
	await verwalter.perform(generateMore);
});

Then('beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode', async ({ verwalter }) => {
	await expect(periodChoice(verwalter)).toBeVisible();
	await expect(generationOutcome(verwalter)).toHaveCount(0);
});
