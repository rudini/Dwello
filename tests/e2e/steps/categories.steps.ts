import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { errorMessageShown } from '../questions/form';
import { pageTitle } from '../questions/navigation';
import {
	allowance,
	categoryDeletable,
	categoryListed,
	invoicesOf,
	listedCategoriesNamed
} from '../questions/categories';
import {
	createCategory,
	deleteCategory,
	openCategories,
	openCategoryEdit,
	openNewCategory,
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
	await verwalter.attemptsTo(openCategories);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewCategory);
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie {string}',
	async ({ verwalter, seed }, category: string) => {
		await verwalter.attemptsTo(openCategoryEdit(seed.idOf(category)!));
	}
);

When('der Liegenschaftsverwalter nur die umlagefähigen Kategorien anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showAllowedCategories);
});

When(
	'der Liegenschaftsverwalter die umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.attemptsTo(createCategory(names.get(title) ?? seed.unique(title), true));
	}
);

When(
	'der Liegenschaftsverwalter die nicht umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.attemptsTo(createCategory(names.get(title) ?? seed.unique(title), false));
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} als nicht umlagefähig speichert',
	async ({ verwalter, names }, title: string) => {
		await verwalter.attemptsTo(saveAsNotAllowed(names.get(title)!));
	}
);

When('der Liegenschaftsverwalter die Kategorie {string} löscht', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(deleteCategory(names.get(title)!));
});

Then('sieht der Liegenschaftsverwalter die Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(categoryListed(names.get(title)!)).toBe(true);
});

Then('nicht die Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(listedCategoriesNamed(names.get(title)!)).toBe(0);
});

Then('sieht der Liegenschaftsverwalter die Kategorie {string} nicht mehr', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(pageTitle).toBe('Kategorien - Dwello');
	await verwalter.sees(listedCategoriesNamed(names.get(title)!)).toBe(0);
});

Then('ist die Kategorie {string} nicht umlagefähig', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(allowance(names.get(title)!)).toBe('Nicht umlagefähig');
});

Then(
	'erfährt der Liegenschaftsverwalter, dass es die Kategorie {string} schon gibt',
	async ({ verwalter, names }, title: string) => {
		const message = `Eine Kategorie mit dem Namen "${names.get(title)}" existiert bereits.`;
		await verwalter.sees(errorMessageShown(message)).toBe(true);
	}
);

Then(
	'wird die Kategorie {string} von {int} Rechnung(en) verwendet',
	async ({ verwalter, names }, title: string, count: number) => {
		await verwalter.sees(invoicesOf(names.get(title)!)).toBe(`${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'}`);
	}
);

Then(
	'kann der Liegenschaftsverwalter die Kategorie {string} nicht löschen',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(categoryDeletable(names.get(title)!)).toBe(false);
	}
);
