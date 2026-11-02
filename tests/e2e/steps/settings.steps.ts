import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { runningPeriodChange, startedPeriodChange, swissDate } from '../fixtures/dates';
import { freshAccountingPeriod } from '../fixtures/fresh-installation';
import {
	periodChangeHintShown,
	periodChangeHintText,
	periodChangeLetterAddress,
	settingHelp,
	settingInvalid,
	settingsSaved,
	storedSetting
} from '../questions/settings';
import { openMasterData, openSettings, saveAccountingPeriod, saveSettings } from '../tasks/settings';

const { Given, When, Then } = createBdd(test);

// Gherkin labels → form fields
const FIELDS: Record<string, string> = {
	Firmenname: 'companyName',
	Adresse: 'companyAddress',
	PLZ: 'companyPostalCode',
	Ort: 'companyCity',
	Telefon: 'companyPhone',
	'E-Mail': 'companyEmail',
	IBAN: 'iban',
	Zahlungsfrist: 'paymentDeadlineDays',
	'Zahlungsfrist (Tage)': 'paymentDeadlineDays',
	Mahnfrist: 'reminderAfterDays',
	'Mahnfrist (Tage)': 'reminderAfterDays',
	Abrechnungsperiode: 'accountingPeriod'
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
	'nach erneutem Öffnen der Einstellungen sind das Telefon {string} und die E-Mail {string} hinterlegt',
	async ({ verwalter }, phone: string, email: string) => {
		await verwalter.attemptsTo(openSettings);
		await verwalter.sees(storedSetting('companyPhone')).toBe(phone);
		await verwalter.sees(storedSetting('companyEmail')).toBe(email);
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

// #450, persona Helga P-2: the empty fields the IBAN's message names; the street stays optional
Then('kennzeichnen die Einstellungen Firmenname, PLZ und Ort als fehlend', async ({ verwalter }) => {
	for (const label of ['Firmenname', 'PLZ', 'Ort']) await verwalter.sees(settingInvalid(FIELDS[label])).toBe('true');
	await verwalter.sees(settingInvalid(FIELDS.Adresse)).toBeNull();
});

Then('erklären die Einstellungen bei der IBAN {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(settingHelp(FIELDS.IBAN)).toContain(text);
});

// #1036 (@frische-installation): the change of the day whose short period still runs, or has ended (fixtures/dates.ts),
// from the earlier type set without a stored change
When(
	/^der Liegenschaftsverwalter die Abrechnungsperiode wechselt, (während die kurze Abrechnungsperiode noch läuft|nachdem die kurze Abrechnungsperiode schon beendet ist)$/,
	async ({ verwalter }, when: string) => {
		const { from, to } = when.startsWith('während') ? runningPeriodChange() : startedPeriodChange();
		freshAccountingPeriod(from);
		await verwalter.attemptsTo(saveAccountingPeriod(to));
	}
);

Given('die Abrechnungsperiode hat heute gewechselt, und die kurze Abrechnungsperiode läuft noch', async ({ seed }) => {
	const { from, to } = runningPeriodChange();
	freshAccountingPeriod(from);
	await seed.accountingPeriod(to);
});

const shortPeriod = ({ short }: { short: { start: string; end: string } }) =>
	`Die Tage davor rechnen Sie als kurze Abrechnungsperiode ${swissDate(short.start)} – ${swissDate(short.end)} ab.`;

Then('sagen die Einstellungen, wann die neue Abrechnungsperiode beginnt', async ({ verwalter }) => {
	const change = runningPeriodChange();
	await verwalter.sees(periodChangeHintText).toContain(`Die neue Abrechnungsperiode beginnt am ${swissDate(change.start)}. ${shortPeriod(change)}`);
});

// Fachreview 1036-1 V-1: the letter now, not before a day already past
Then('sagen die Einstellungen, dass die neue Abrechnungsperiode schon begonnen hat', async ({ verwalter }) => {
	const change = startedPeriodChange();
	await verwalter.sees(periodChangeHintText).toContain(`Die neue Abrechnungsperiode hat am ${swissDate(change.start)} schon begonnen. ${shortPeriod(change)}`);
});

Then(
	'nennen die Einstellungen den Mietvertrag von {string} in der Wohnung {string} mit dem Brief zur Zustimmung',
	async ({ verwalter, seed, names }, tenant: string, apartment: string) => {
		const contractId = seed.idOf(`Mietvertrag ${tenant}`)!;
		await verwalter.sees(periodChangeHintText).toContain(`${names.get(tenant)}, Wohnung ${apartment}`);
		await verwalter.sees(periodChangeLetterAddress(contractId)).toBe(`/contracts/${contractId}/consent-letter`);
	}
);

Then('nennen die Einstellungen den Mietvertrag von {string} nicht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(periodChangeHintText).not.toContain(names.get(tenant)!);
});

Then('nennen die Einstellungen keinen Mietvertrag zur Zustimmung', async ({ verwalter }) => {
	await verwalter.sees(periodChangeHintShown).toBe(false);
});
