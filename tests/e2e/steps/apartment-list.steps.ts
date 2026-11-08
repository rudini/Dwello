import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { inDays, swissDate } from '../fixtures/dates';
import { apartmentCount, apartmentEmptyHint, apartmentResults, filterOrderOf, apartmentSearchHelp, apartmentSearchTerm, occupancyOf, moveOutOf, moveOutShownOf } from '../questions/apartments';
import {
	chooseVacantApartments,
	openApartment,
	openApartmentList,
	searchApartments,
	showAllApartments,
	showApartmentsOfBuilding,
	showApartmentsOfBuildingWhileLoading,
	startNewApartment
} from '../tasks/apartments';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Wohnungsliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openApartmentList);
});

Given(
	'der Liegenschaftsverwalter zeigt die Wohnungen im Gebäude {string} an',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When('der Liegenschaftsverwalter die leeren Wohnungen wählt, ohne zu suchen', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseVacantApartments);
});

When(
	'der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!, 'vacant'));
	}
);

When(
	'der Liegenschaftsverwalter nur die aufgehobenen Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!, 'discontinued'));
	}
);

When(
	'der Liegenschaftsverwalter das Gebäude {string} wählt, bevor die Wohnungsliste fertig geladen ist, und sucht',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuildingWhileLoading(seed.idOf(building)!));
	}
);

When('der Liegenschaftsverwalter eine neue Wohnung erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewApartment);
});

When('der Liegenschaftsverwalter die Wohnung {string} aus der Liste öffnet', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(openApartment(number));
});

Then('ist die Wohnung {string} {string}', async ({ verwalter }, number: string, occupancy: string) => {
	await verwalter.sees(occupancyOf(number)).toBe(occupancy);
});

Then('die Wohnungsliste enthält genau {int} Wohnung(en)', async ({ verwalter }, count: number) => {
	await verwalter.sees(apartmentCount).toBe(count);
});

When('der Liegenschaftsverwalter nach Wohnungen mit {string} sucht', async ({ verwalter, seed }, term: string) => {
	await verwalter.attemptsTo(searchApartments(seed.withNames(term)));
});

When('der Liegenschaftsverwalter wieder alle Wohnungen anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showAllApartments);
});

When(
	'der Liegenschaftsverwalter im Gebäude {string} nach der Wohnung {string} sucht',
	async ({ verwalter, seed }, building: string, number: string) => {
		await verwalter.attemptsTo(searchApartments(number, seed.idOf(building)!));
	}
);

Then('sieht der Liegenschaftsverwalter in der Wohnungsliste den Hinweis {string}', async ({ verwalter, seed }, text: string) => {
	await verwalter.sees(apartmentEmptyHint).toContain(seed.withNames(text));
});

Then('erfährt der Liegenschaftsverwalter bei der Wohnungssuche {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(apartmentSearchHelp).toContain(text);
});

// other scenarios add apartments in parallel: the unfiltered list is only known to be not empty
Then('zeigt die Wohnungsliste wieder Wohnungen', async ({ verwalter }) => {
	await verwalter.sees(apartmentCount).toBeGreaterThan(0);
});

Then('die Wohnungssuche ist leer', async ({ verwalter }) => {
	await verwalter.sees(apartmentSearchTerm).toBe('');
});

// #664: the calendar year is the building's Abrechnungsperiode, the one the Vertragsende falls in
Then(
	'nennt die Wohnungsliste bei der Wohnung {string} den Auszug von {string} heute mit der Schlussabrechnung nach dem Ende des Jahres',
	async ({ verwalter, names }, number: string, tenant: string) => {
		await verwalter.sees(moveOutOf(number)).toBe(
			`Auszug von ${names.get(tenant) ?? tenant} am ${swissDate(inDays(0))}, Schlussabrechnung nach dem 31.12.${inDays(0).slice(0, 4)}`
		);
	}
);

Then('nennt die Wohnungsliste bei der Wohnung {string} {string}', async ({ verwalter, seed }, number: string, text: string) => {
	await verwalter.sees(moveOutOf(number)).toBe(seed.withNames(text));
});

// after its Mietstatus, so an error page does not pass
Then('nennt die Wohnungsliste bei der Wohnung {string} keinen Auszug', async ({ verwalter }, number: string) => {
	await verwalter.sees(moveOutShownOf(number)).toBe(false);
});

Given(
	'im Gebäude {string} gibt es {int} weitere leere Wohnungen',
	async ({ seed }, building: string, count: number) => {
		for (let i = 1; i <= count; i++) await seed.apartment(building, `9.${String(i).padStart(2, '0')}`, 'vacant');
	}
);

Then('steht über der Wohnungsliste {string}', async ({ verwalter }, heading: string) => {
	await verwalter.sees(apartmentResults).toBe(heading);
});

Then(
	'nennt der Gebäudefilter das Gebäude {string} vor dem Gebäude {string}',
	async ({ verwalter, names }, first: string, second: string) => {
		const buildings = [first, second].map((title) => names.get(title)!);
		await verwalter.sees(filterOrderOf(buildings)).toEqual(buildings);
	}
);
