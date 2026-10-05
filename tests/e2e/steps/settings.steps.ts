import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { settingsSaved, storedSetting } from '../questions/settings';
import { openMasterData, saveSettings } from '../tasks/settings';

const { Given, When, Then } = createBdd(test);

// Gherkin labels → form fields
const FIELDS: Record<string, string> = {
	Firmenname: 'companyName',
	Adresse: 'companyAddress',
	PLZ: 'companyPostalCode',
	Ort: 'companyCity',
	IBAN: 'iban'
};

Given('der Liegenschaftsverwalter ist auf den Einstellungen', async ({ verwalter }) => {
	await visit(verwalter.page, '/config');
});

When('der Liegenschaftsverwalter folgenden Absender speichert:', async ({ verwalter }, table: DataTable) => {
	const fields = Object.entries(table.rowsHash()).map(([label, value]) => [FIELDS[label], value]);
	await verwalter.perform(saveSettings(Object.fromEntries(fields)));
});

When('der Liegenschaftsverwalter die {word} {string} speichert', async ({ verwalter }, label: string, value: string) => {
	await verwalter.perform(saveSettings({ [FIELDS[label]]: value }));
});

When('der Liegenschaftsverwalter die Stammdaten {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.perform(openMasterData(label));
});

Then('bestätigt die Seite, dass die Einstellungen gespeichert sind', async ({ verwalter }) => {
	await expect(settingsSaved(verwalter)).toBeVisible();
});

Then(
	'nach erneutem Öffnen der Einstellungen ist die IBAN {string} hinterlegt',
	async ({ verwalter }, iban: string) => {
		await visit(verwalter.page, '/config');
		await expect(storedSetting(verwalter, 'iban')).toHaveValue(iban);
	}
);
