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

import { openPreviewViaApi, previewTotalOf } from '../tasks/statement-generate-api';

const { Given, When, Then } = createBdd(test);

// "CHF 1’250.50" → 1250.5
const francs = (amount: string) => Number(amount.replace(/[^\d.]/g, ''));

Given(
	'der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen',
	async ({ verwalter, driver }) => {
		if (driver === 'ui') await visit(verwalter.page, '/statements/generate');
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} öffnet',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.perform(openPreview(year, seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.perform(generateStatements(year, seed.idOf(building)!));
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
	async ({ verwalter, names }, tenant: string) => {
		await expect(previewRow(verwalter, names.get(tenant) ?? tenant)).toBeVisible();
	}
);

Then('die Vorschau enthält genau {int} Abrechnungen', async ({ verwalter }, count: number) => {
	await expect(allPreviewRows(verwalter)).toHaveCount(count);
});

Then(
	'meldet die Vorschau, dass es in der Periode keine Mietverträge gibt',
	async ({ verwalter }) => {
		await expect(noContractsInPeriod(verwalter)).toBeVisible();
	}
);

Then('wurden {int} Nebenkostenabrechnungen erstellt', async ({ verwalter }, count: number) => {
	await expect(generationOutcome(verwalter)).toHaveText(
		`${count} Nebenkostenabrechnungen wurden erfolgreich erstellt.`
	);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} und {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed }, year: number, building: string, profile: string, fee: number) => {
		await verwalter.perform(
			openPreview(year, seed.idOf(building)!, { heatingProfileId: seed.idOf(profile), managementFeePercent: fee })
		);
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale nach dem Verteilschlüssel {string} öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string, fee: number, key: string) => {
		await verwalter.perform(
			driver === 'api'
				? openPreviewViaApi(seed, year, seed.idOf(building)!, fee, key)
				: openPreview(year, seed.idOf(building)!, { managementFeePercent: fee, managementFeeKey: key })
		);
	}
);

When('der Liegenschaftsverwalter die Verwaltungspauschale auf {float} % setzt', async ({ verwalter }, fee: number) => {
	await verwalter.perform(setManagementFee(fee));
});

Then(
	'kostet die Abrechnung von {string} {string}',
	async ({ verwalter, names, driver }, tenant: string, amount: string) => {
		if (driver === 'api') expect(previewTotalOf(verwalter, names.get(tenant) ?? tenant)).toBe(francs(amount));
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
