import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { uploadPurposeText } from '../questions/invoice-upload';
import { enteredApiKey, kiCheckText, kiPageText, kiSaveButtons, modelDownloadOffered, shownKiAddress } from '../questions/ki-settings';
import {
	checkConnection,
	downloadModelAgain,
	openFreshAuditLog,
	openFreshKi,
	openKiWithFailedModel,
	openFreshSettingsKi,
	openFreshUpload,
	openKi,
	readFreshPrivacy,
	saveMode,
	saveProvider,
	stubProvider,
	UNREACHABLE,
	type Provider
} from '../tasks/ki-settings';

const { Given, When, Then } = createBdd(test);

// #580: the KI of the fresh installation, whose operator did not set it (fixtures/fresh-installation.ts)
When('der Liegenschaftsverwalter der frischen Installation in den Einstellungen die KI öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshSettingsKi);
});

When('der Liegenschaftsverwalter die KI der frischen Installation öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshKi);
});

When('der Liegenschaftsverwalter die KI öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openKi);
});

When(
	'der Liegenschaftsverwalter den Anbieter {string} in {string} mit geprüftem Datenschutz speichert',
	async ({ verwalter }, provider: string, country: string) => {
		await verwalter.attemptsTo(saveProvider(stubProvider(provider, country)));
	}
);

Given('der Anbieter {string} in {string} ist gespeichert', async ({ frisch }, provider: string, country: string) => {
	await frisch.kiProvider(stubProvider(provider, country));
});

When(/^der Liegenschaftsverwalter "(Keine KI|Lokale KI)" speichert$/, async ({ verwalter }, mode: string) => {
	await verwalter.attemptsTo(saveMode(mode === 'Keine KI' ? 'none' : 'local'));
});

const without: Record<string, Partial<Provider>> = {
	Bestätigung: { confirmed: false },
	'Namen des Anbieters': { provider: '' },
	Land: { country: '' },
	Adresse: { address: '' },
	Modell: { model: '' }
};
When(
	/^der Liegenschaftsverwalter einen Anbieter der KI ohne (Bestätigung|Namen des Anbieters|Land|Adresse|Modell) speichert$/,
	async ({ verwalter }, missing: string) => {
		await verwalter.attemptsTo(saveProvider({ ...stubProvider('Muster KI AG', 'Deutschland'), ...without[missing] }));
	}
);

const cases: Record<string, Partial<Provider>> = {
	'gültigem Schlüssel': {},
	'falschem Schlüssel': { key: 'falsch' },
	'unerreichbarer Adresse': { address: UNREACHABLE },
	'einem Modell ohne Bilder': { model: 'text-modell' }
};
When(/^der Liegenschaftsverwalter die Verbindung zu einem Anbieter mit (.+) prüft$/, async ({ verwalter }, kind: string) => {
	await verwalter.attemptsTo(checkConnection({ ...stubProvider('Muster KI AG', 'Deutschland'), ...cases[kind] }));
});

When('der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest', async ({ verwalter }) => {
	await verwalter.attemptsTo(readFreshPrivacy);
});

Then(/^sieht der Liegenschaftsverwalter auf der Seite "KI" (?:die Meldung|den Fehler) "(.+)"$/, async ({ verwalter }, text: string) => {
	await verwalter.sees(kiPageText).toContain(text);
});

Then('sagt die Seite "KI" {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(kiPageText).toContain(text);
});

Then('ist das Feld für den API-Schlüssel leer', async ({ verwalter }) => {
	await verwalter.sees(enteredApiKey).toBe('');
});

Then('zeigt die Seite "KI" die Adresse {string}', async ({ verwalter }, address: string) => {
	await verwalter.sees(shownKiAddress).toBe(address);
});

Then('kann der Liegenschaftsverwalter die KI nicht speichern', async ({ verwalter }) => {
	await verwalter.sees(kiSaveButtons).toBe(0);
});

Then('sagt die Prüfung der Verbindung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(kiCheckText).toBe(text);
});

When(
	'der Liegenschaftsverwalter den Anbieter {string} in {string} ohne Bestätigung speichert',
	async ({ verwalter }, provider: string, country: string) => {
		await verwalter.attemptsTo(saveProvider({ ...stubProvider(provider, country), confirmed: false }));
	}
);

When('der Liegenschaftsverwalter für den Anbieter eine neue Adresse ohne API-Schlüssel speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveProvider({ ...stubProvider('Muster KI AG', 'Deutschland'), address: 'http://127.0.0.1:2531/v1', key: '' }));
});

When('der Liegenschaftsverwalter das Protokoll der frischen Installation öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshAuditLog);
});

When(
	'der Liegenschaftsverwalter die KI einer Installation öffnet, deren KI-Modell nicht geladen werden konnte',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(openKiWithFailedModel);
	}
);

Then('kann der Liegenschaftsverwalter das KI-Modell erneut herunterladen', async ({ verwalter }) => {
	await verwalter.sees(modelDownloadOffered).toBe(true);
});

Given('das Herunterladen des KI-Modells ist gescheitert', async ({ frisch }) => {
	await frisch.modelFailed();
});

Given('die lokale KI antwortet nicht', async ({ frisch }) => {
	await frisch.localKiOffline();
});

When('der Liegenschaftsverwalter auf der Seite "KI" das KI-Modell erneut herunterlädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(downloadModelAgain);
});

When('der Liegenschaftsverwalter die Verbindung zu einer neuen Adresse ohne API-Schlüssel prüft', async ({ verwalter }) => {
	await verwalter.attemptsTo(
		checkConnection({ ...stubProvider('Muster KI AG', 'Deutschland'), address: 'http://127.0.0.1:2531/v1', key: '' })
	);
});

// #626: «Rechnungen hochladen» on the fresh installation, after «Keine KI»
When('der Liegenschaftsverwalter in der frischen Installation "Rechnungen hochladen" öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshUpload);
});

Then('sagt der Dialog "Rechnungen hochladen" {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(uploadPurposeText).toBe(text);
});
