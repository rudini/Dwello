import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	formulaMarkedInvalid,
	formulaOf,
	formulaProblem,
	formulaTestErrors,
	formulaValue,
	invoicesBy,
	keyActionCount,
	keyDeletable,
	keyListed,
	listedKeysNamed,
	nameProblem,
	shareOfSample
} from '../questions/distribution-keys';
import { pageTitle } from '../questions/navigation';
import { confirmedNames } from '../questions/app-frame';
import {
	changeFormula,
	createDistributionKey,
	createDistributionKeyInFrench,
	createDistributionKeyWithEnter,
	deleteDistributionKey,
	enterFormula,
	insertBlock,
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

Given(
	'im Gebäude {string} gibt es eine Rechnung vom {string}, die nach dem Verteilschlüssel {string} verteilt wird',
	async ({ seed }, building: string, date: string, key: string) => {
		await seed.invoiceByKey(building, key, date);
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
	'der Liegenschaftsverwalter den Verteilschlüssel {string} mit der Formel {string} mit der Eingabetaste speichert',
	async ({ verwalter, seed }, title: string, formula: string) => {
		await verwalter.attemptsTo(createDistributionKeyWithEnter(seed.unique(title), formula));
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

When(
	'der Liegenschaftsverwalter den Verteilschlüssel {string} noch einmal erfasst',
	async ({ verwalter, names }, key: string) => {
		await verwalter.attemptsTo(createDistributionKey(names.get(key)!, '{area}'));
	}
);

Then(
	'erfährt der Liegenschaftsverwalter beim Namen, dass es den Verteilschlüssel {string} schon gibt',
	async ({ verwalter, names }, key: string) => {
		await verwalter.sees(nameProblem).toContain(
			`Ein Verteilschlüssel mit dem Namen «${names.get(key)}» existiert bereits.`
		);
	}
);

// #678: the confirmation names the key as the list does, in the UI language
Then('nennt die Bestätigung den Verteilschlüssel {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(confirmedNames).toEqual([names.get(title)]);
});

// #737: the refusal stands at the Formel field, which is marked invalid (red border, aria-invalid)
Then('erfährt der Liegenschaftsverwalter bei der Formel {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(formulaProblem).toBe(text);
	await verwalter.sees(formulaMarkedInvalid).toBe('true');
});

// #737: an error that depends on the values shows once, not once per sample apartment
Then('zeigt der Test nur den Fehler {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(formulaTestErrors).toEqual([text]);
});

// #1200: the Summen des Gebäudes have insert buttons like the Bausteine
When('der Liegenschaftsverwalter die Formel {string} eingibt', async ({ verwalter }, formula: string) => {
	await verwalter.attemptsTo(enterFormula(formula));
});

When('der Liegenschaftsverwalter die Summe {string} einfügt', async ({ verwalter }, total: string) => {
	await verwalter.attemptsTo(insertBlock(total));
});

Then('steht in der Formel {string}', async ({ verwalter }, formula: string) => {
	await verwalter.sees(formulaValue).toBe(formula);
});

// #1200: a taken name and a broken formula of the same save, each at its field
When(
	'der Liegenschaftsverwalter den Verteilschlüssel {string} noch einmal mit der Formel {string} erfasst',
	async ({ verwalter, names }, key: string, formula: string) => {
		await verwalter.attemptsTo(createDistributionKey(names.get(key)!, formula));
	}
);

Then('erfährt der Liegenschaftsverwalter beim Namen {string}', async ({ verwalter, seed }, text: string) => {
	await verwalter.sees(nameProblem).toContain(seed.withNames(text)); // the description also holds the example
});
