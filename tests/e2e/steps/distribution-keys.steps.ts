import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	formulaOf,
	invoicesBy,
	keyActionCount,
	keyDeletable,
	keyListed,
	listedKeysNamed,
	shareOfSample
} from '../questions/distribution-keys';
import { pageTitle } from '../questions/navigation';
import {
	changeFormula,
	createDistributionKey,
	createDistributionKeyInFrench,
	deleteDistributionKey,
	openDistributionKeyEdit,
	openDistributionKeys,
	openNewDistributionKey,
	testFormula
} from '../tasks/distribution-keys';

const { Given, When, Then } = createBdd(test);

Given(
	'es gibt den Verteilschlüssel {string} mit der Formel {string}',
	async ({ seed }, title: string, formula: string) => {
		await seed.distributionKey(title, formula);
	}
);

Given(
	'eine Rechnung des Gebäudes {string} wird nach dem Verteilschlüssel {string} verteilt',
	async ({ seed }, building: string, key: string) => {
		await seed.invoiceByKey(building, key);
	}
);

Given('der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDistributionKeys);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewDistributionKey);
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Verteilschlüssels {string}',
	async ({ verwalter, seed }, key: string) => {
		await verwalter.attemptsTo(openDistributionKeyEdit(seed.idOf(key)!));
	}
);

When('der Liegenschaftsverwalter die Formel {string} testet', async ({ verwalter }, formula: string) => {
	await verwalter.attemptsTo(testFormula(formula));
});

When(
	'der Liegenschaftsverwalter den Verteilschlüssel {string} mit der Formel {string} erfasst',
	async ({ verwalter, seed }, title: string, formula: string) => {
		await verwalter.attemptsTo(createDistributionKey(seed.unique(title), formula));
	}
);

When(
	'der Liegenschaftsverwalter den Verteilschlüssel {string} mit der Formel {string} und dem französischen Namen {string} erfasst',
	async ({ verwalter, seed }, title: string, formula: string, frenchName: string) => {
		await verwalter.attemptsTo(createDistributionKeyInFrench(seed.unique(title), formula, seed.unique(frenchName)));
	}
);

When(
	'der Liegenschaftsverwalter die Formel des Verteilschlüssels {string} auf {string} ändert',
	async ({ verwalter, names }, title: string, formula: string) => {
		await verwalter.attemptsTo(changeFormula(names.get(title)!, formula));
	}
);

When('der Liegenschaftsverwalter den Verteilschlüssel {string} löscht', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(deleteDistributionKey(names.get(title)!));
});

Then(
	'trägt die Beispielwohnung mit {string} {string} der Kosten',
	async ({ verwalter }, apartment: string, share: string) => {
		await verwalter.sees(shareOfSample(apartment)).toBe(share);
	}
);

Then(
	'verteilt der Verteilschlüssel {string} nach der Formel {string}',
	async ({ verwalter, names }, title: string, formula: string) => {
		await verwalter.sees(formulaOf(names.get(title)!)).toBe(formula);
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Verteilschlüssel {string} nicht mehr',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(pageTitle).toBe('Verteilschlüssel - Dwello');
		await verwalter.sees(listedKeysNamed(names.get(title)!)).toBe(0);
	}
);

Then(
	'zeigt die Seite "Verteilschlüssel" den Verteilschlüssel {string}',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(listedKeysNamed(names.get(title)!)).toBe(1);
	}
);

Then(
	'wird/werden {int} Rechnung(en) nach dem Verteilschlüssel {string} verteilt',
	async ({ verwalter, names }, count: number, title: string) => {
		await verwalter.sees(invoicesBy(names.get(title)!)).toBe(`${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'}`);
	}
);

Then(
	'kann der Liegenschaftsverwalter den Verteilschlüssel {string} nicht löschen',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(keyDeletable(names.get(title)!)).toBe(false);
	}
);

Then(
	'kann der Liegenschaftsverwalter den Verteilschlüssel {string} weder bearbeiten noch löschen',
	async ({ verwalter }, name: string) => {
		await verwalter.sees(keyListed(name)).toBe(true);
		await verwalter.sees(keyActionCount(name)).toBe(0);
	}
);
