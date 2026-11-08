import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { apartmentClearedAnnounced, apartmentClearedExplanation, apartmentClearedHint, apartmentClearedHints, runningContractHintTextOf, runningContractLinkTextOf, toasts, apartmentClearedLinkText, apartmentHintAnnounced, chosenApartmentId, apartmentHintInWindow, runningContractHintsOf, confirmation, confirmationShown, failureOnTop, failures, overlapBoxText, warning } from '../questions/contract-form';
import { focusedText } from '../questions/navigation';
import { enterStartDate, openClearedApartmentContract, stayOnConfirmationClose, tabOnFromErrorMessage } from '../tasks/contract-form';

const { When, Then } = createBdd(test);

// a text with the names the scenario gives, as the seed wrote them (with their suffix)
const named = (names: Map<string, string>, text: string) =>
	[...names].reduce((shown, [given, seeded]) => shown.replaceAll(given, seeded), text);

// #669: «Erneut versuchen» for the apartment's contracts (#151): its messages, their announcement and their place

// the retry waited for the confirmation, which anchors the check
Then('zeigt Dwello keine Fehlermeldung mehr', async ({ verwalter }) => {
	await verwalter.sees(failures).toBe(0);
});

Then(
	'kündigt ein Screenreader bei der Wohnung den Hinweis {string} ohne {string} an',
	async ({ verwalter }, hint: string, left: string) => {
		await verwalter.sees(apartmentHintAnnounced).toContain(hint);
		await verwalter.sees(apartmentHintAnnounced).not.toContain(left);
	}
);

When('der Liegenschaftsverwalter von «Meldung schliessen» mit der Tabulatortaste weitergeht', async ({ verwalter }) => {
	await verwalter.attemptsTo(tabOnFromErrorMessage);
});

Then('ist der Liegenschaftsverwalter in der Fusszeile bei {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(focusedText).toBe(label);
});

Then('bestätigt Dwello das Laden mit {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(confirmation).toBe(text);
});

Then('steht der Hinweis oben im Formular ganz im ersten Bildschirm', async ({ verwalter }) => {
	await verwalter.sees(apartmentHintInWindow).toBe(1);
});

// #669 (code review C-1): the drawer of the menu does not cover the messages
Then('liegt die Fehlermeldung über dem offenen Menü', async ({ verwalter }) => {
	await verwalter.sees(failureOnTop).toBe(true);
});

When('der Liegenschaftsverwalter {int} Sekunden auf «Meldung schliessen» bleibt', async ({ verwalter }, seconds: number) => {
	await verwalter.attemptsTo(stayOnConfirmationClose(seconds));
});

Then('steht die Erfolgsmeldung noch da', async ({ verwalter }) => {
	await verwalter.sees(confirmationShown).toBe(true);
});

// #669 (Helga H-2): an overlap is bad news, said as a warning
Then('warnt Dwello nach dem Laden mit {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(warning).toBe(text);
});

When('der Liegenschaftsverwalter den Vertragsbeginn leert', async ({ verwalter }) => {
	await verwalter.attemptsTo(enterStartDate(''));
});

Then('ist im Mietvertrag keine Wohnung gewählt', async ({ verwalter }) => {
	await verwalter.sees(chosenApartmentId).toBe('');
});

Then('steht in der Prüfung der Hinweis «Zeitraum überschneidet sich» mit {string}', async ({ verwalter, names }, text: string) => {
	await verwalter.sees(overlapBoxText).toContain(named(names, text));
});

// #1153 (Personas Sven S-7, Helga H-6): the step «Wohnung» says which apartment the cleared choice was and which contract blocks it
Then('steht im Schritt «Wohnung» der Hinweis {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(apartmentClearedHint).toContain(named(names, title));
});

Then('erklärt der Hinweis im Schritt «Wohnung» {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(apartmentClearedExplanation).toBe(text);
});

Then('bietet der Hinweis im Schritt «Wohnung» den Link {string}', async ({ verwalter, names }, label: string) => {
	await verwalter.sees(apartmentClearedLinkText).toBe(named(names, label));
});

When('der Liegenschaftsverwalter im Hinweis im Schritt «Wohnung» den Mietvertrag öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openClearedApartmentContract);
});

Then('steht der Fokus wieder auf dem Schritt «Wohnung»', async ({ verwalter }) => {
	await verwalter.sees(focusedText).toMatch(/^Schritt 2 von \d: Wohnung$/);
});

// #1158 (Sven P-3): the hint on the tenant's own open-ended contract waits until the step has an apartment
Then('zeigt der Schritt «Wohnung» keinen Hinweis auf einen Mietvertrag von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(runningContractHintsOf(names.get(tenant) ?? tenant)).toBe(0);
});

// #1289: no toast after «Erneut versuchen»; the hint in the step says it, announced once, and goes with another apartment
Then('kündigt ein Screenreader im Schritt «Wohnung» den Hinweis {string} an', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(apartmentClearedAnnounced).toContain(named(names, title));
});

Then('zeigt Dwello nach dem Laden keine Meldung', async ({ verwalter }) => {
	await verwalter.sees(toasts).toBe(0);
});

Then('zeigt der Schritt «Wohnung» keinen Hinweis auf eine nicht verfügbare Wohnung', async ({ verwalter }) => {
	await verwalter.sees(apartmentClearedHints).toBe(0);
});

// #1288: the tenant's own contract is named like the one of the cleared apartment
Then('nennt der Hinweis auf den Mietvertrag von {string} die Wohnung {string}', async ({ verwalter, names }, tenant: string, apartment: string) => {
	await verwalter.sees(runningContractHintTextOf(names.get(tenant) ?? tenant)).toContain(named(names, apartment));
});

Then('bietet der Hinweis auf den Mietvertrag von {string} den Link {string}', async ({ verwalter, names }, tenant: string, label: string) => {
	await verwalter.sees(runningContractLinkTextOf(names.get(tenant) ?? tenant)).toBe(named(names, label));
});
