import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { translationsIn } from '../fixtures/translations';
import {
	listedProfilesNamed,
	listedTranslationMarkers,
	listedTranslationsOf,
	nameProblem,
	profileActionCount,
	shareOf,
	sharesHelpText,
	totalShare,
	translationMarkersOnDetail,
	translationsOnDetail
} from '../questions/heating-profiles';
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

// A profile of the scenario by its seeded name, or a predefined one by its German name
When('der Liegenschaftsverwalter das Heizprofil {string} öffnet', async ({ verwalter, names }, name: string) => {
	await verwalter.attemptsTo(openHeatingProfile(names.get(name) ?? name));
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

Then('erklärt die Bearbeitungsseite bei den Monatsanteilen {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(sharesHelpText).toContain(text);
});

When(
	'der Liegenschaftsverwalter das Heizprofil {string} noch einmal erfasst',
	async ({ verwalter, names }, profile: string) => {
		await verwalter.attemptsTo(createHeatingProfile(names.get(profile)!, '16.4', '7.6'));
	}
);

// a predefined profile's name, without a token: the scenario must not save it
When('der Liegenschaftsverwalter ein Heizprofil unter dem Namen {string} erfasst', async ({ verwalter }, name: string) => {
	await verwalter.attemptsTo(createHeatingProfile(name, '16.4', '7.6'));
});

Then(
	'erfährt der Liegenschaftsverwalter beim Namen, dass es das Heizprofil {string} schon gibt',
	async ({ verwalter, names }, profile: string) => {
		const name = names.get(profile) ?? profile; // a predefined profile has no token
		await verwalter.sees(nameProblem).toContain(`Ein Heizprofil mit dem Namen «${name}» existiert bereits.`);
	}
);

Given('das Heizprofil {string} hat Namen auf Französisch, Italienisch und Englisch', async ({ seed }, title: string) => {
	await seed.translateHeatingProfile(title, translationsIn('Französisch, Italienisch und Englisch', title));
});

Then('steht beim Heizprofil {string} {string}', async ({ verwalter, names }, title: string, text: string) => {
	await verwalter.sees(listedTranslationsOf(names.get(title)!)).toBe(text);
});

Then('steht auf der Detailseite des Heizprofils {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(translationsOnDetail).toBe(text);
});

// A predefined profile has its names in every language: list and detail page say nothing about them
Then('steht beim vordefinierten Heizprofil {string} nichts zur Übersetzung', async ({ verwalter }, name: string) => {
	await verwalter.sees(listedProfilesNamed(name)).toBe(1);
	await verwalter.sees(listedTranslationMarkers(name)).toBe(0);
});

Then('steht auf der Detailseite des Heizprofils nichts zur Übersetzung', async ({ verwalter }) => {
	await verwalter.sees(translationMarkersOnDetail).toBe(0);
});
