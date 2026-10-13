import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { listedProfilesNamed, profileActionCount, shareOf, totalShare } from '../questions/heating-profiles';
import { pageTitle } from '../questions/navigation';
import {
	changeShares,
	createHeatingProfile,
	deleteHeatingProfile,
	openHeatingProfile,
	openHeatingProfileDetail,
	openHeatingProfileEdit,
	openHeatingProfiles,
	openNewHeatingProfile
} from '../tasks/heating-profiles';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Heizprofile"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openHeatingProfiles);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewHeatingProfile);
});

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Heizprofils {string}',
	async ({ verwalter, seed }, profile: string) => {
		await verwalter.attemptsTo(openHeatingProfileDetail(seed.idOf(profile)!));
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Heizprofils {string}',
	async ({ verwalter, seed }, profile: string) => {
		await verwalter.attemptsTo(openHeatingProfileEdit(seed.idOf(profile)!));
	}
);

When(
	'der Liegenschaftsverwalter das Heizprofil {string} mit {string} % im Januar und je {string} % in den übrigen Monaten erfasst',
	async ({ verwalter, seed }, name: string, january: string, others: string) => {
		await verwalter.attemptsTo(createHeatingProfile(seed.unique(name), january, others));
	}
);

When(
	'der Liegenschaftsverwalter den Januar auf {string} % und den Dezember auf {string} % ändert',
	async ({ verwalter }, january: string, december: string) => {
		await verwalter.attemptsTo(changeShares({ january, december }));
	}
);

When('der Liegenschaftsverwalter das Heizprofil löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteHeatingProfile);
});

When('der Liegenschaftsverwalter das Heizprofil {string} öffnet', async ({ verwalter }, name: string) => {
	await verwalter.attemptsTo(openHeatingProfile(name));
});

Then('trägt der Januar im Heizprofil {string} der Heizkosten', async ({ verwalter }, share: string) => {
	await verwalter.sees(shareOf('january')).toBe(share);
});

Then('ergeben die Monatsanteile zusammen {string}', async ({ verwalter }, total: string) => {
	await verwalter.sees(totalShare).toBe(total);
});

Then('fehlt das Heizprofil {string} in der Liste', async ({ verwalter, names }, profile: string) => {
	await verwalter.sees(pageTitle).toBe('Heizprofile - Dwello');
	await verwalter.sees(listedProfilesNamed(names.get(profile)!)).toBe(0);
});

Then('kann der Liegenschaftsverwalter das Heizprofil weder bearbeiten noch löschen', async ({ verwalter }) => {
	await verwalter.sees(pageTitle).toBe('Heizung Bergregion - Dwello');
	await verwalter.sees(profileActionCount).toBe(0);
});
