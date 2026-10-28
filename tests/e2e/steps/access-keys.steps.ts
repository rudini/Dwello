import { createBdd } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import {
	accessKeyCount,
	accessKeyRow,
	createRefusal,
	doneMessage,
	mcpStatus,
	mcpText,
	newAccessKeyNote,
	newAccessKeyShown,
	newAccessKeyText,
	newAccessKeyWarning,
	revokeConsequence
} from '../questions/access-keys';
import { pageTitle } from '../questions/navigation';
import { goToAuditLog } from '../tasks/audit-log';
import {
	callTool,
	closeTheNewAccessKey,
	confirmRevoking,
	createAccessKey,
	goToAccessKeys,
	openAccessKeys,
	startRevokingAccessKey
} from '../tasks/access-keys';

const { Given, When, Then } = createBdd(test);

// #817: the key itself is shown once; the seed keeps the one it created
const keyOf = (names: Map<string, string>, title: string) => names.get(`Zugangsschlüssel ${title}`)!;
const named = (names: Map<string, string>, text: string) =>
	[...names].reduce((result, [title, name]) => result.replaceAll(`«${title}»`, `«${name}»`), text);

Given('der Liegenschaftsverwalter ist auf der Seite "Zugangsschlüssel für KI-Programme"', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToAccessKeys);
});

Given('der Liegenschaftsverwalter hat den Zugangsschlüssel {string} erstellt', async ({ seed }, title: string) => {
	await seed.accessKey(title);
});

When('der Liegenschaftsverwalter die Zugangsschlüssel für KI-Programme öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openAccessKeys);
});

When('der Liegenschaftsverwalter den Zugangsschlüssel {string} erstellt', async ({ verwalter, seed }, title: string) => {
	await verwalter.attemptsTo(createAccessKey(seed.unique(title)));
});

When('der Liegenschaftsverwalter einen Zugangsschlüssel ohne Namen erstellen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(createAccessKey(''));
});

When('der Liegenschaftsverwalter den neuen Zugangsschlüssel schliesst', async ({ verwalter }) => {
	await verwalter.attemptsTo(closeTheNewAccessKey);
});

When('der Liegenschaftsverwalter den Zugangsschlüssel {string} widerrufen will', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(startRevokingAccessKey(names.get(title)!));
});

When('der Liegenschaftsverwalter im Protokoll nachsieht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToAuditLog);
});

When('der Liegenschaftsverwalter das Widerrufen bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmRevoking);
});

When(
	'ein KI-Programm mit dem Zugangsschlüssel {string} die Gebäude abfragt',
	async ({ kiProgramm, names }, title: string) => {
		await kiProgramm.attemptsTo(callTool(keyOf(names, title), 'buildings'));
	}
);

Then('zeigt Dwello den neuen Zugangsschlüssel mit dem Hinweis {string}', async ({ verwalter }, hint: string) => {
	await verwalter.sees(newAccessKeyText).toMatch(/^dwello_\S{40,}$/);
	await verwalter.sees(newAccessKeyNote).toBe(hint);
});

Then('warnt Dwello beim neuen Zugangsschlüssel {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(newAccessKeyWarning).toBe(text);
});

Then('zeigt Dwello den neuen Zugangsschlüssel nicht mehr', async ({ verwalter }) => {
	await verwalter.sees(pageTitle).toBe('Zugangsschlüssel für KI-Programme - Dwello');
	await verwalter.sees(newAccessKeyShown).toBe(false);
});

Then(
	'nennt die Liste der Zugangsschlüssel {string}, erstellt heute, noch nie benutzt, läuft in 90 Tagen ab',
	async ({ verwalter, names }, title: string) => {
		await verwalter.attemptsTo(goToAccessKeys);
		const row = accessKeyRow(names.get(title)!);
		await verwalter.sees(row).toContain(`Erstellt am ${swissDate(inDays(0))}`);
		await verwalter.sees(row).toContain('Noch nie benutzt');
		await verwalter.sees(row).toContain(`Läuft ab am ${swissDate(inDays(90))}`);
	}
);

Then('nennt die Liste der Zugangsschlüssel {string} heute zuletzt benutzt', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(goToAccessKeys);
	await verwalter.sees(accessKeyRow(names.get(title)!)).toContain(`Zuletzt benutzt am ${swissDate(inDays(0))}`);
});

Then('nennt die Liste der Zugangsschlüssel {string} nicht mehr', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(pageTitle).toBe('Zugangsschlüssel für KI-Programme - Dwello');
	await verwalter.sees(accessKeyCount(names.get(title)!)).toBe(0);
});

Then('sagt der Dialog zum Erstellen {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(createRefusal).toContain(text); // below the dialog's «Das hat nicht geklappt»
});

Then('bestätigt Dwello das Widerrufen mit {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(doneMessage).toBe(named(names, text));
});

Then('warnt Dwello vor dem Widerrufen {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(revokeConsequence).toBe(named(names, text));
});

Then('erhält das KI-Programm das Gebäude {string}', async ({ kiProgramm, names }, title: string) => {
	await kiProgramm.sees(mcpText).toContain(names.get(title)!);
});

Then(
	'erhält ein KI-Programm mit dem Zugangsschlüssel {string} keine Daten mehr',
	async ({ kiProgramm, names }, title: string) => {
		await kiProgramm.attemptsTo(callTool(keyOf(names, title), 'buildings'));
		await kiProgramm.sees(mcpStatus).toBe(401);
	}
);
