import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { errorMessage } from '../questions/form';
import { deletion, invoicesOf, isAllowed, listedCategory } from '../questions/categories';
import {
	createCategory,
	deleteCategory,
	saveAsNotAllowed,
	showAllowedCategories
} from '../tasks/categories';

const { Given, When, Then } = createBdd(test);

Given('es gibt die umlagefähige Kategorie {string}', async ({ seed }, title: string) => {
	await seed.category(title, true);
});

Given('es gibt die nicht umlagefähige Kategorie {string}', async ({ seed }, title: string) => {
	await seed.category(title, false);
});

Given(
	'eine Rechnung des Gebäudes {string} ist der Kategorie {string} zugeordnet',
	async ({ seed }, building: string, category: string) => {
		await seed.invoiceInCategory(building, category);
	}
);

Given('der Liegenschaftsverwalter ist auf der Seite "Kategorien"', async ({ verwalter }) => {
	await visit(verwalter.page, '/config/categories');
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"', async ({ verwalter }) => {
	await visit(verwalter.page, '/config/categories/new');
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie {string}',
	async ({ verwalter, seed }, category: string) => {
		await visit(verwalter.page, `/config/categories/${seed.idOf(category)}/edit`);
	}
);

When(
	'der Liegenschaftsverwalter nur die umlagefähigen Kategorien anzeigt',
	async ({ verwalter }) => {
		await verwalter.perform(showAllowedCategories);
	}
);

When(
	'der Liegenschaftsverwalter die umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.perform(createCategory(names.get(title) ?? seed.unique(title), true));
	}
);

When(
	'der Liegenschaftsverwalter die nicht umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.perform(createCategory(names.get(title) ?? seed.unique(title), false));
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} als nicht umlagefähig speichert',
	async ({ verwalter, names }, title: string) => {
		await verwalter.perform(saveAsNotAllowed(names.get(title)!));
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} löscht',
	async ({ verwalter, names }, title: string) => {
		await verwalter.perform(deleteCategory(names.get(title)!));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Kategorie {string}',
	async ({ verwalter, names }, title: string) => {
		await expect(listedCategory(verwalter, names.get(title)!)).toBeVisible();
	}
);

Then('nicht die Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await expect(listedCategory(verwalter, names.get(title)!)).toHaveCount(0);
});

Then(
	'sieht der Liegenschaftsverwalter die Kategorie {string} nicht mehr',
	async ({ verwalter, names }, title: string) => {
		await expect(listedCategory(verwalter, names.get(title)!)).toHaveCount(0);
	}
);

Then(
	'ist die Kategorie {string} nicht umlagefähig',
	async ({ verwalter, names }, title: string) => {
		await expect(isAllowed(verwalter, names.get(title)!)).toHaveText('Nein');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass es die Kategorie {string} schon gibt',
	async ({ verwalter, names }, title: string) => {
		const message = `Eine Kategorie mit dem Namen "${names.get(title)}" existiert bereits.`;
		await expect(errorMessage(verwalter, message)).toBeVisible();
	}
);

Then(
	'wird die Kategorie {string} von {int} Rechnungen verwendet',
	async ({ verwalter, names }, title: string, count: number) => {
		await expect(invoicesOf(verwalter, names.get(title)!)).toHaveText(`${count} Rechnungen`);
	}
);

Then(
	'kann der Liegenschaftsverwalter die Kategorie {string} nicht löschen',
	async ({ verwalter, names }, title: string) => {
		await expect(deletion(verwalter, names.get(title)!)).toBeDisabled();
	}
);
