import { createBdd } from 'playwright-bdd';
import { swissDate, inDays } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { auditEntryCount, auditEntryDay, auditLogDescription, deleteAuditEntryConsequence } from '../questions/audit-log';
import { pageTitle } from '../questions/navigation';
import { goToAuditLog, openAuditLog, startDeletingAuditEntry, turnToLastAuditPage } from '../tasks/audit-log';

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

Given('der Eintrag zur Kategorie {string} ist inzwischen anderswo gelöscht', async ({ seed }, title: string) => {
	await seed.removeAuditEntriesOfCategory(title);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Protokoll"', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToAuditLog);
});

Then('erklären die Einstellungen beim Protokoll {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(auditLogDescription).toContain(text);
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

// The dialog names the entry's time of today, «17.10.2026, 14:05»
Then('warnt das Protokoll, der Eintrag von heute {string}', async ({ verwalter, names }, text: string) => {
	const rest = named(names, text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	await verwalter.sees(deleteAuditEntryConsequence).toMatch(new RegExp(`^Der Eintrag vom ${swissDate(inDays(0))}, \\d\\d:\\d\\d ${rest}$`));
});

Then('nennt das Protokoll {string} nicht mehr', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(pageTitle).toBe('Protokoll - Dwello');
	await verwalter.sees(auditEntryCount(named(names, text))).toBe(0);
});

Given('das Protokoll hat aus dem Jahr 2001 den Eintrag zum Zugangsschlüssel {string} und {int} neuere', async ({ seed }, title: string, newer: number) => {
	await seed.oldAuditEntries(title, newer);
});

When('der Liegenschaftsverwalter zur letzten Seite des Protokolls blättert', async ({ verwalter }) => {
	await verwalter.attemptsTo(turnToLastAuditPage);
});

Then('nennt die erste Seite des Protokolls {string} nicht', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(pageTitle).toBe('Protokoll - Dwello');
	await verwalter.sees(auditEntryCount(named(names, text))).toBe(0);
});

Then('nennt das Protokoll {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(auditEntryCount(named(names, text))).toBe(1);
});
