import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { listedProfile, profileActions, shareOf, totalShare } from '../questions/heating-profiles';
import {
	changeShares,
	createHeatingProfile,
	deleteHeatingProfile,
	openHeatingProfile
} from '../tasks/heating-profiles';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Heizprofile"', async ({ verwalter }) => {
	await visit(verwalter.page, '/config/heating-profiles');
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"', async ({ verwalter }) => {
	await visit(verwalter.page, '/config/heating-profiles/new');
});

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Heizprofils {string}',
	async ({ verwalter, seed }, profile: string) => {
		await visit(verwalter.page, `/config/heating-profiles/${seed.idOf(profile)}`);
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Heizprofils {string}',
	async ({ verwalter, seed }, profile: string) => {
		await visit(verwalter.page, `/config/heating-profiles/${seed.idOf(profile)}/edit`);
	}
);

When(
	'der Liegenschaftsverwalter das Heizprofil {string} mit {string} % im Januar und je {string} % in den übrigen Monaten erfasst',
	async ({ verwalter, seed }, name: string, january: string, others: string) => {
		await verwalter.perform(createHeatingProfile(seed.unique(name), january, others));
	}
);

When(
	'der Liegenschaftsverwalter den Januar auf {string} % und den Dezember auf {string} % ändert',
	async ({ verwalter }, january: string, december: string) => {
		await verwalter.perform(changeShares({ january, december }));
	}
);

When('der Liegenschaftsverwalter das Heizprofil löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteHeatingProfile);
});

When(
	'der Liegenschaftsverwalter das Heizprofil {string} öffnet',
	async ({ verwalter }, name: string) => {
		await verwalter.perform(openHeatingProfile(name));
	}
);

Then(
	'trägt der Januar im Heizprofil {string} der Heizkosten',
	async ({ verwalter }, share: string) => {
		await expect(shareOf(verwalter, 'january')).toHaveText(share);
	}
);

Then('ergeben die Monatsanteile zusammen {string}', async ({ verwalter }, total: string) => {
	await expect(totalShare(verwalter)).toHaveText(total);
});

Then(
	'fehlt das Heizprofil {string} in der Liste',
	async ({ verwalter, names }, profile: string) => {
		await expect(listedProfile(verwalter, names.get(profile)!)).toHaveCount(0);
	}
);

Then(
	'kann der Liegenschaftsverwalter das Heizprofil weder bearbeiten noch löschen',
	async ({ verwalter }) => {
		await expect(verwalter.page).toHaveTitle('Heating Mountain - Dwello');
		await expect(profileActions(verwalter)).toHaveCount(0);
	}
);
