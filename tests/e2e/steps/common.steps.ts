import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { deleteConfirmation, errorMessage } from '../questions/form';
import { cancelEditing, chooseBreadcrumb } from '../tasks/form';

const { When, Then } = createBdd(test);

When('der Liegenschaftsverwalter die Bearbeitung abbricht', async ({ verwalter }) => {
	await verwalter.perform(cancelEditing);
});

When('der Liegenschaftsverwalter im Breadcrumb {string} wählt', async ({ verwalter, names }, label: string) => {
	await verwalter.perform(chooseBreadcrumb(names.get(label) ?? label));
});

// The apartment page names its building after the number ("Wohnung 2.01, Lindenhof … - Dwello")
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

Then('ist der Liegenschaftsverwalter auf der Seite {string}', async ({ verwalter }, title: string) => {
	const building = title.startsWith('Wohnung ') && !title.endsWith(' bearbeiten') ? ', .+' : '';
	await expect(verwalter.page).toHaveTitle(new RegExp(`^${escaped(title)}${building} - Dwello$`));
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite von {string}',
	async ({ verwalter, names }, title: string) => {
		await expect(verwalter.page).toHaveTitle(`${names.get(title) ?? title} - Dwello`);
	}
);

Then('sieht der Liegenschaftsverwalter die Fehlermeldung {string}', async ({ verwalter }, text: string) => {
	await expect(errorMessage(verwalter, text)).toBeVisible();
});

Then('kann der Liegenschaftsverwalter das Löschen nicht bestätigen', async ({ verwalter }) => {
	await expect(deleteConfirmation(verwalter)).toBeDisabled();
});

Then(
	'ist der Liegenschaftsverwalter auf der Bearbeitungsseite von {string}',
	async ({ verwalter, names }, title: string) => {
		await expect(verwalter.page).toHaveTitle(`${names.get(title) ?? title} bearbeiten - Dwello`);
	}
);
