import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	allPreviewRows,
	generationOutcome,
	noContractsInPeriod,
	previewRow
} from '../questions/statement-generate';
import {
	generateStatements,
	openPreview,
	returnToStatementList,
	showCreatedStatements
} from '../tasks/statement-generate';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen',
	async ({ verwalter }) => {
		await visit(verwalter.page, '/statements/generate');
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
