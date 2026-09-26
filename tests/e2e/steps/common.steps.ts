import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { errorMessage } from '../questions/form';
import { cancelEditing, chooseBreadcrumb } from '../tasks/form';

const { When, Then } = createBdd(test);

When('der Liegenschaftsverwalter die Bearbeitung abbricht', async ({ verwalter }) => {
	await verwalter.perform(cancelEditing);
});

When('der Liegenschaftsverwalter im Breadcrumb {string} wählt', async ({ verwalter, names }, label: string) => {
	await verwalter.perform(chooseBreadcrumb(names.get(label) ?? label));
});

Then('ist der Liegenschaftsverwalter auf der Seite {string}', async ({ verwalter }, title: string) => {
	await expect(verwalter.page).toHaveTitle(`${title} - Dwello`);
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
