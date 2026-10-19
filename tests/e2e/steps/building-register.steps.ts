import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { saveBuilding } from '../tasks/building-form';
import {
	chooseRegisterAddress,
	completeApartment,
	leaveOutApartment,
	openExistingBuilding,
	registerUnreachable,
	searchRegister
} from '../tasks/building-register';
import { chosenBuildingType, buildingFormValue } from '../questions/building-form';
import {
	missingInRegister,
	proposedApartmentNumbers,
	proposedRooms,
	registerApartmentsHelpText,
	registerNoticeText,
	roomsHelp,
	shownApartmentCount,
	indexOfApartment
} from '../questions/building-register';
import { listedApartment } from '../questions/building-detail';

const { Given, When, Then } = createBdd(test);

// The stand-in answers the searched text as the street, so the scenario's unique name stays in the address
Given(
	'das Gebäude {string} an der Adresse {string} in {string} existiert',
	async ({ seed }, title: string, street: string, city: string) => {
		await seed.building(title, city, street);
	}
);

Given('das Gebäuderegister ist nicht erreichbar', async ({ verwalter }) => {
	await verwalter.attemptsTo(registerUnreachable);
});

When('der Liegenschaftsverwalter im Gebäuderegister die Adresse {string} wählt', async ({ verwalter, seed, names }, address: string) => {
	await verwalter.attemptsTo(chooseRegisterAddress(names.get(address) ?? seed.unique(address)));
});

When('der Liegenschaftsverwalter im Gebäuderegister nach {string} sucht', async ({ verwalter, seed }, address: string) => {
	await verwalter.attemptsTo(searchRegister(seed.unique(address)));
});

When('der Liegenschaftsverwalter das Gebäude mit seinen Wohnungen erstellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveBuilding);
});

When('der Liegenschaftsverwalter die Wohnung {string} nicht übernimmt', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(leaveOutApartment(number));
});

When(
	'der Liegenschaftsverwalter bei der Wohnung {string} die Fläche {string}, das Stockwerk {string} und die Zimmeranzahl {string} ergänzt',
	async ({ verwalter }, number: string, area: string, floor: string, rooms: string) => {
		await verwalter.attemptsTo(completeApartment(number, { area, floor, rooms }));
	}
);

When('der Liegenschaftsverwalter das schon erfasste Gebäude öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openExistingBuilding);
});

Then('zeigt die Gebäudeseite {int} Wohnungen', async ({ verwalter }, count: number) => {
	await verwalter.sees(shownApartmentCount).toBe(count);
});

Then(
	'zeigt die Gebäudeseite die Wohnung {string} mit {string} und {string}',
	async ({ verwalter }, number: string, rooms: string, area: string) => {
		await verwalter.sees(listedApartment(number)).toContain(rooms);
		await verwalter.sees(listedApartment(number)).toContain(area);
	}
);

Then('schlägt die Erfassung folgende Angaben zum Gebäude vor:', async ({ verwalter, seed }, table: DataTable) => {
	const fields = table.rowsHash();
	await verwalter.sees(buildingFormValue('name')).toBe(seed.withNames(fields.Name));
	await verwalter.sees(buildingFormValue('address')).toBe(seed.withNames(fields.Adresse));
	await verwalter.sees(buildingFormValue('postalCode')).toBe(fields.PLZ);
	await verwalter.sees(buildingFormValue('city')).toBe(fields.Ort);
	await verwalter.sees(buildingFormValue('canton')).toBe(fields.Kanton);
	await verwalter.sees(chosenBuildingType).toBe(fields.Gebäudetyp);
	await verwalter.sees(buildingFormValue('yearBuilt')).toBe(fields.Baujahr);
});

Then('schlägt die Erfassung den Gebäudenamen {string} vor', async ({ verwalter, seed }, name: string) => {
	await verwalter.sees(buildingFormValue('name')).toBe(seed.withNames(name));
});

Then('schlägt die Erfassung die Wohnungen {string} vor', async ({ verwalter }, numbers: string) => {
	await verwalter.sees(proposedApartmentNumbers).toEqual(numbers.split(', '));
});

Then(
	'schlägt die Erfassung für die Wohnung {string} die Zimmeranzahl {string} vor',
	async ({ verwalter }, number: string, rooms: string) => {
		await verwalter.sees(proposedRooms(number)).toBe(rooms);
	}
);

Then('erfährt der Liegenschaftsverwalter bei der Zimmeranzahl {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(roomsHelp(0)).toBe(text);
});

Then('erfährt der Liegenschaftsverwalter bei den Wohnungen {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(registerApartmentsHelpText).toBe(text);
});

Then(
	'erfährt der Liegenschaftsverwalter bei der Wohnung {string}, dass im Gebäuderegister {string} fehlen',
	async ({ verwalter }, number: string, fields: string) => {
		await verwalter.sees(indexOfApartment(number)).toBeGreaterThanOrEqual(0);
		await verwalter.sees(missingInRegister(number)).toBe(fields);
	}
);

Then('sieht der Liegenschaftsverwalter bei der Erfassung den Hinweis {string}', async ({ verwalter, seed }, text: string) => {
	await verwalter.sees(registerNoticeText).toContain(seed.withNames(text));
});
