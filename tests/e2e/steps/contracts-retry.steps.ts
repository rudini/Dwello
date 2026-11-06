import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { apartmentClearedExplanation, apartmentClearedHint, apartmentClearedLinkText, apartmentHintAnnounced, chosenApartmentId, apartmentHintInWindow, confirmation, confirmationShown, failureOnTop, failures, overlapBoxText, warning } from '../questions/contract-form';
import { focusedText } from '../questions/navigation';
import { closeWarning, enterStartDate, openClearedApartmentContract, stayOnConfirmationClose, tabOnFromErrorMessage } from '../tasks/contract-form';

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
When('der Liegenschaftsverwalter die Warnung schliesst', async ({ verwalter }) => {
	await verwalter.attemptsTo(closeWarning);
});

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
