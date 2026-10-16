import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { settingHelp, settingsSaved, storedSetting } from '../questions/settings';
import { openMasterData, openSettings, saveSettings } from '../tasks/settings';

const { Given, When, Then } = createBdd(test);

// Gherkin labels → form fields
const FIELDS: Record<string, string> = {
	Firmenname: 'companyName',
	Adresse: 'companyAddress',
	PLZ: 'companyPostalCode',
	Ort: 'companyCity',
	IBAN: 'iban',
	Zahlungsfrist: 'paymentDeadlineDays',
	'Zahlungsfrist (Tage)': 'paymentDeadlineDays',
	Mahnfrist: 'reminderAfterDays',
	'Mahnfrist (Tage)': 'reminderAfterDays'
};

Given('der Liegenschaftsverwalter ist auf den Einstellungen', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSettings);
});

When('der Liegenschaftsverwalter folgende Einstellungen speichert:', async ({ verwalter }, table: DataTable) => {
	const fields = Object.entries(table.rowsHash()).map(([label, value]) => [FIELDS[label], value]);
	await verwalter.attemptsTo(saveSettings(Object.fromEntries(fields)));
});

When('der Liegenschaftsverwalter die {word} {string} speichert', async ({ verwalter }, label: string, value: string) => {
	await verwalter.attemptsTo(saveSettings({ [FIELDS[label]]: value }));
});

When('der Liegenschaftsverwalter die Stammdaten {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(openMasterData(label));
});

Then('bestätigt die Seite, dass die Einstellungen gespeichert sind', async ({ verwalter }) => {
	await verwalter.sees(settingsSaved).toBe(true);
});

Then(
	'nach erneutem Öffnen der Einstellungen ist die IBAN {string} hinterlegt',
	async ({ verwalter }, iban: string) => {
		await verwalter.attemptsTo(openSettings);
		await verwalter.sees(storedSetting('iban')).toBe(iban);
	}
);

Then(
	'sind die Zahlungsfrist {string} und die Mahnfrist {string} hinterlegt',
	async ({ verwalter }, paymentDays: string, reminderDays: string) => {
		await verwalter.sees(storedSetting('paymentDeadlineDays')).toBe(paymentDays);
		await verwalter.sees(storedSetting('reminderAfterDays')).toBe(reminderDays);
	}
);

Then('erklärt die Einstellung {string} {string}', async ({ verwalter }, label: string, help: string) => {
	await verwalter.sees(settingHelp(FIELDS[label])).toContain(help);
});

Then('erklären die Einstellungen bei der IBAN {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(settingHelp(FIELDS.IBAN)).toContain(text);
});
