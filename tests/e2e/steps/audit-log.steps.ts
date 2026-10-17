import { createBdd } from 'playwright-bdd';
import { swissDate, inDays } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { auditEntryCount, auditEntryDay, deleteAuditEntryConsequence } from '../questions/audit-log';
import { pageTitle } from '../questions/navigation';
import { goToAuditLog, openAuditLog, startDeletingAuditEntry } from '../tasks/audit-log';

const { Given, When, Then } = createBdd(test);

// The entry names the seeded records with their scenario names ("Hauswart Meier 3f2a…")
const named = (names: Map<string, string>, text: string) =>
	[...names].reduce((result, [title, name]) => result.replaceAll(title, name), text);

Given('die Kategorie {string} ist inzwischen nicht umlagefähig', async ({ seed }, title: string) => {
	await seed.categoryAllowance(title, false);
});

Given('die Rechnung von {string} ist vom {string}', async ({ seed }, supplier: string, date: string) => {
	await seed.invoiceDate(supplier, date);
});

Given('die Rechnung von {string} ist inzwischen als nicht umlagefähig markiert', async ({ seed }, supplier: string) => {
	await seed.invoiceAllocable(supplier, false);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Protokoll"', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToAuditLog);
});

When('der Liegenschaftsverwalter das Protokoll öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openAuditLog);
});

When('der Liegenschaftsverwalter den Eintrag {string} löschen will', async ({ verwalter, names }, text: string) => {
	await verwalter.attemptsTo(startDeletingAuditEntry(named(names, text)));
});

Then('nennt das Protokoll mit heutigem Datum {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(auditEntryDay(named(names, text))).toContain(swissDate(inDays(0)));
});

Then('warnt das Protokoll {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(deleteAuditEntryConsequence).toBe(named(names, text));
});

Then('nennt das Protokoll {string} nicht mehr', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(pageTitle).toBe('Protokoll - Dwello');
	await verwalter.sees(auditEntryCount(named(names, text))).toBe(0);
});
