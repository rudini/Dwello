import { createBdd, type DataTable } from 'playwright-bdd';
import { ON_FRESH, test } from '../fixtures/test';
import { focusedSetting, focusedSettingField, holderIsSender, settingCount, settingHelp, settingInvalid, settingName, settingsSaved, storedSetting } from '../questions/settings';
import { giveOwnHolder, giveSenderAsHolder, openMasterData, openSettings, saveSettings } from '../tasks/settings';

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
	'Name des Kontoinhabers': 'accountHolderName',
	'Adresse des Kontoinhabers': 'accountHolderAddress',
	'PLZ des Kontoinhabers': 'accountHolderPostalCode',
	'Ort des Kontoinhabers': 'accountHolderCity',
	Zahlungsfrist: 'paymentDeadlineDays',
	'Zahlungsfrist (Tage)': 'paymentDeadlineDays',
	Mahnfrist: 'reminderAfterDays',
	'Mahnfrist (Tage)': 'reminderAfterDays'
};

Given('der Liegenschaftsverwalter ist auf den Einstellungen', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSettings);
});

// #690: a setting the parallel scenarios would break on: only on the fresh installation
Given(
	'die Verwaltung hat die IBAN {string} ohne Firmenname, PLZ und Ort hinterlegt',
	async ({ seed, $tags }, iban: string) => {
		if (!$tags.includes(ON_FRESH)) throw new Error(`a scenario with this step runs on the fresh installation: tag it ${ON_FRESH}`);
		await seed.ibanWithoutCompanyAddress(iban);
	}
);

// #690 (persona Weber 690 W-1, W-2): stored before the save required it; only on the fresh installation
const STORED: Record<string, string> = { PLZ: 'company_postal_code', 'Ort des Kontoinhabers': 'account_holder_city' };
Given('in den Einstellungen fehlt inzwischen {string}', async ({ seed, $tags }, label: string) => {
	if (!$tags.includes(ON_FRESH)) throw new Error(`a scenario with this step runs on the fresh installation: tag it ${ON_FRESH}`);
	await seed.withoutSetting(STORED[label]);
});

When('der Liegenschaftsverwalter die Einstellungen erneut öffnet', async ({ verwalter }) => {
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

Then('steht der Fokus in den Einstellungen auf {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(focusedSetting).toBe(label);
});

// persona Weber 690 W-7: «Ort» is the label of two fields
Then('steht der Fokus in den Einstellungen bei {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(focusedSettingField).toBe(`setting-${FIELDS[label]}`);
});

Then('erklären die Einstellungen bei der IBAN {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(settingHelp(FIELDS.IBAN)).toContain(text);
});

// #1088: the Zahlungsfrist is the anchor: the page shows its settings
Then('bieten die Einstellungen keine Abrechnungsperiode an', async ({ verwalter }) => {
	await verwalter.sees(settingCount('paymentDeadlineDays')).toBe(1);
	await verwalter.sees(settingCount('accountingPeriod')).toBe(0);
});

// #1166: the Kontoinhaber of the IBAN in the payment part; set back to the Absender afterwards
When(
	'der Liegenschaftsverwalter folgende Einstellungen mit eigenem Kontoinhaber speichert:',
	async ({ verwalter, seed, $tags }, table: DataTable) => {
		// only a scenario holding the settings lock may set it back: an unlocked teardown would clear the Kontoinhaber
		// a parallel locked scenario just saved (WebKit run of #1185); a refused save stores nothing to set back
		if ($tags.includes('@einstellungen-global')) seed.restoreAccountHolder();
		const fields = Object.entries(table.rowsHash()).map(([label, value]) => [FIELDS[label], value]);
		await verwalter.attemptsTo(giveOwnHolder, saveSettings(Object.fromEntries(fields)));
	}
);

Given(
	'das Konto der IBAN {string} gehört {string}, {string}, {string}',
	async ({ seed }, iban: string, name: string, street: string, place: string) => {
		await seed.accountHolder(iban, name, street, place);
	}
);

When('der Liegenschaftsverwalter in den Einstellungen den Absender als Kontoinhaber angibt und speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSettings, giveSenderAsHolder, saveSettings({}));
});

Then('ist in den Einstellungen angegeben, dass der Kontoinhaber der Absender ist', async ({ verwalter }) => {
	await verwalter.sees(holderIsSender).toBe(true);
});

Then('nach erneutem Öffnen der Einstellungen ist angegeben, dass der Kontoinhaber der Absender ist', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSettings);
	await verwalter.sees(holderIsSender).toBe(true);
});

Then(
	'nach erneutem Öffnen der Einstellungen ist der Kontoinhaber {string}, {string}, {string} {string} hinterlegt',
	async ({ verwalter }, name: string, street: string, postalCode: string, city: string) => {
		await verwalter.attemptsTo(openSettings);
		await verwalter.sees(holderIsSender).toBe(false);
		await verwalter.sees(storedSetting('accountHolderName')).toBe(name);
		await verwalter.sees(storedSetting('accountHolderAddress')).toBe(street);
		await verwalter.sees(storedSetting('accountHolderPostalCode')).toBe(postalCode);
		await verwalter.sees(storedSetting('accountHolderCity')).toBe(city);
	}
);

// the fields show once the checkbox is cleared: empty, as nothing is stored
Then('ist kein eigener Kontoinhaber mehr hinterlegt', async ({ verwalter }) => {
	await verwalter.attemptsTo(giveOwnHolder);
	for (const field of ['accountHolderName', 'accountHolderAddress', 'accountHolderPostalCode', 'accountHolderCity'])
		await verwalter.sees(storedSetting(field)).toBe('');
});

// the street stays optional
Then('kennzeichnen die Einstellungen Name, PLZ und Ort des Kontoinhabers als fehlend', async ({ verwalter }) => {
	for (const field of ['accountHolderName', 'accountHolderPostalCode', 'accountHolderCity'])
		await verwalter.sees(settingInvalid(field)).toBe('true');
	await verwalter.sees(settingInvalid('accountHolderAddress')).toBeNull();
});

// Fachreview 1166-1 V-4: the fields show only once the checkbox is cleared
Then('fragen die Einstellungen nicht nach einem eigenen Kontoinhaber', async ({ verwalter }) => {
	for (const field of ['accountHolderName', 'accountHolderAddress', 'accountHolderPostalCode', 'accountHolderCity'])
		await verwalter.sees(settingCount(field)).toBe(0);
});

// #1175: clears «Kontoinhaber ist der Absender» without saving
When('der Liegenschaftsverwalter in den Einstellungen einen eigenen Kontoinhaber angibt', async ({ verwalter }) => {
	await verwalter.attemptsTo(giveOwnHolder);
});

Then('heisst die Einstellung {string} {string}', async ({ verwalter }, label: string, name: string) => {
	await verwalter.sees(settingName(FIELDS[label])).toBe(name);
});
