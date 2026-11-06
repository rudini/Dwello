import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { apartmentHintAnnounced, apartmentHintInWindow, confirmation, confirmationShown, failureOnTop, failures } from '../questions/contract-form';
import { focusedText } from '../questions/navigation';
import { stayOnConfirmationClose, tabOnFromErrorMessage } from '../tasks/contract-form';

const { When, Then } = createBdd(test);

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
