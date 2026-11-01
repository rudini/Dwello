import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { deletionConfirmable, errorMessageShown } from '../questions/form';
import { focusedPlace, focusedText, pageTitle } from '../questions/navigation';
import { goBackInBrowser } from '../tasks/app-frame';
import { cancelEditing, chooseBreadcrumb } from '../tasks/form';

const { When, Then } = createBdd(test);

When('der Liegenschaftsverwalter die Bearbeitung abbricht', async ({ verwalter }) => {
	await verwalter.attemptsTo(cancelEditing);
});

When('der Liegenschaftsverwalter im Breadcrumb {string} wählt', async ({ verwalter, names }, label: string) => {
	await verwalter.attemptsTo(chooseBreadcrumb(names.get(label) ?? label));
});

// The apartment page names its building after the number ("Wohnung 2.01, Lindenhof … - Dwello")
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

Then('ist der Liegenschaftsverwalter auf der Seite {string}', async ({ verwalter }, title: string) => {
	const building = title.startsWith('Wohnung ') && !title.endsWith(' bearbeiten') ? ', .+' : '';
	await verwalter.sees(pageTitle).toMatch(new RegExp(`^${escaped(title)}${building} - Dwello$`));
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite von {string}',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(pageTitle).toBe(`${names.get(title) ?? title} - Dwello`);
	}
);

Then('sieht der Liegenschaftsverwalter die Fehlermeldung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(errorMessageShown(text)).toBe(true);
});

// a negative check: the step before it names what the page shows instead
Then('sieht der Liegenschaftsverwalter die Fehlermeldung {string} nicht mehr', async ({ verwalter }, text: string) => {
	await verwalter.sees(errorMessageShown(text)).toBe(false);
});

Then('kann der Liegenschaftsverwalter das Löschen nicht bestätigen', async ({ verwalter }) => {
	await verwalter.sees(deletionConfirmable).toBe(false);
});

Then(
	'ist der Liegenschaftsverwalter auf der Bearbeitungsseite von {string}',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(pageTitle).toBe(`${names.get(title) ?? title} bearbeiten - Dwello`);
	}
);

When('der Liegenschaftsverwalter im Browser zurückgeht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goBackInBrowser);
});

// #681: after a search, a reset, a page of the list or the browser's back button
Then('steht der Fokus auf dem Ergebnis der Liste', async ({ verwalter }) => {
	await verwalter.sees(focusedPlace).toBe('list-results');
});

// Names the result, so a check after the browser's back button tells the page it returns to from the one it left
Then('steht der Fokus auf dem Ergebnis {string}', async ({ verwalter }, result: string) => {
	await verwalter.sees(focusedText).toBe(result);
});
