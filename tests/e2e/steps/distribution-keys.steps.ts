import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { deletion, formulaOf, invoicesBy, keyActions, listedKey, sampleShare } from '../questions/distribution-keys';
import { changeFormula, createDistributionKey, deleteDistributionKey, testFormula } from '../tasks/distribution-keys';

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
	await visit(verwalter.page, '/config/distribution-keys');
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"', async ({ verwalter }) => {
	await visit(verwalter.page, '/config/distribution-keys/new');
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Verteilschlüssels {string}',
	async ({ verwalter, seed }, key: string) => {
		await visit(verwalter.page, `/config/distribution-keys/${seed.idOf(key)}/edit`);
	}
);

When('der Liegenschaftsverwalter die Formel {string} testet', async ({ verwalter }, formula: string) => {
	await verwalter.perform(testFormula(formula));
});

When(
	'der Liegenschaftsverwalter den Verteilschlüssel {string} mit der Formel {string} erfasst',
	async ({ verwalter, seed }, title: string, formula: string) => {
		await verwalter.perform(createDistributionKey(seed.unique(title), formula));
	}
);

When(
	'der Liegenschaftsverwalter die Formel des Verteilschlüssels {string} auf {string} ändert',
	async ({ verwalter, names }, title: string, formula: string) => {
		await verwalter.perform(changeFormula(names.get(title)!, formula));
	}
);

When('der Liegenschaftsverwalter den Verteilschlüssel {string} löscht', async ({ verwalter, names }, title: string) => {
	await verwalter.perform(deleteDistributionKey(names.get(title)!));
});

Then(
	'trägt die Beispielwohnung mit {string} {string} der Kosten',
	async ({ verwalter }, apartment: string, share: string) => {
		await expect(sampleShare(verwalter, apartment)).toHaveText(share);
	}
);

Then(
	'verteilt der Verteilschlüssel {string} nach der Formel {string}',
	async ({ verwalter, names }, title: string, formula: string) => {
		await expect(formulaOf(verwalter, names.get(title)!)).toHaveText(formula);
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Verteilschlüssel {string} nicht mehr',
	async ({ verwalter, names }, title: string) => {
		await expect(listedKey(verwalter, names.get(title)!)).toHaveCount(0);
	}
);

Then(
	'werden {int} Rechnungen nach dem Verteilschlüssel {string} verteilt',
	async ({ verwalter, names }, count: number, title: string) => {
		await expect(invoicesBy(verwalter, names.get(title)!)).toHaveText(`${count} Rechnungen`);
	}
);

Then(
	'kann der Liegenschaftsverwalter den Verteilschlüssel {string} nicht löschen',
	async ({ verwalter, names }, title: string) => {
		await expect(deletion(verwalter, names.get(title)!)).toBeDisabled();
	}
);

Then(
	'kann der Liegenschaftsverwalter den Verteilschlüssel {string} weder bearbeiten noch löschen',
	async ({ verwalter }, name: string) => {
		await expect(listedKey(verwalter, name)).toBeVisible();
		await expect(keyActions(verwalter, name)).toHaveCount(0);
	}
);
