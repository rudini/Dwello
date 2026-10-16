import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	apartmentOfContract,
	endConfirmationInWindow,
	endDateProblemShown,
	endOfContract,
	missingStatementsText,
	statusOfContract,
	totalRent
} from '../questions/contract-detail';
import { contractListEmpty, listedContractsOf } from '../questions/contracts';
import { pageAddress } from '../questions/navigation';
import {
	chooseNextStep,
	createMissingStatement,
	deleteContract,
	deleteDraftAndEndContract,
	editContractFromDetail,
	endContract,
	endContractOn,
	openContract,
	openContractApartment,
	openContractTenant,
	openRefusedStatement,
	scrollToEndConfirmation,
	showBuildingInvoices,
	showContractStatements,
	startDeletingContract,
	useWindowOf
} from '../tasks/contract-detail';
import { searchContracts } from '../tasks/contracts';
import { inDays } from '../fixtures/dates';

const { Given, When, Then } = createBdd(test);

const lastYear = Number(inDays(0).slice(0, 4)) - 1;

Given(
	'für {string} gibt es die Abrechnung {int} im Gebäude {string}',
	async ({ seed }, tenant: string, year: number, building: string) => {
		await seed.statement(tenant, building, year);
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openContract(seed.idOf(`Mietvertrag ${tenant}`)!));
	}
);

When('der Liegenschaftsverwalter den Mietvertrag beendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(endContract);
});

When('der Liegenschaftsverwalter den Mietvertrag auf den {string} beendet', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(endContractOn(date));
});

When(
	'der Liegenschaftsverwalter den Mietvertrag auf den {string} beendet und die Folge bestätigt',
	async ({ verwalter }, date: string) => {
		await verwalter.attemptsTo(endContractOn(date, { confirmPast: true }));
	}
);

// The same steps; the dialog refuses the date and stays open
When('der Liegenschaftsverwalter den Mietvertrag auf den {string} beenden will', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(endContractOn(date));
});

Given('das Browserfenster ist {int} auf {int} Pixel gross', async ({ verwalter }, width: number, height: number) => {
	await verwalter.attemptsTo(useWindowOf(width, height));
});

// the confirm button can be scrolled into view inside the dialog, not cut off by the window
Then('kann der Liegenschaftsverwalter den Mietvertrag im Dialog beenden', async ({ verwalter }) => {
	await verwalter.attemptsTo(scrollToEndConfirmation);
	await verwalter.sees(endConfirmationInWindow).toBe(true);
});

When('der Liegenschaftsverwalter den Mietvertrag löschen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startDeletingContract);
});

When('der Liegenschaftsverwalter den Mietvertrag löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteContract);
});

When('der Liegenschaftsverwalter den Mietvertrag bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(editContractFromDetail);
});

When('der Liegenschaftsverwalter den Mieter öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openContractTenant);
});

When('der Liegenschaftsverwalter die Wohnung des Mietvertrags öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openContractApartment);
});

When('der Liegenschaftsverwalter die Nebenkostenabrechnungen des Mietvertrags anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showContractStatements);
});

When('der Liegenschaftsverwalter die Rechnungen des Gebäudes anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showBuildingInvoices);
});

Then('sieht der Liegenschaftsverwalter die Wohnung {string} im Mietvertrag', async ({ verwalter }, number: string) => {
	await verwalter.sees(apartmentOfContract).toContain(`Wohnung ${number}`);
});

Then('sieht der Liegenschaftsverwalter den monatlichen Mietzins {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(totalRent).toBe(amount);
});

Then('hat der Mietvertrag den Status {string}', async ({ verwalter }, status: string) => {
	await verwalter.sees(statusOfContract).toBe(status);
});

// The end action sets today's date in Switzerland as a notice; the page shows it as formatDate does
Then('endet der Mietvertrag heute', async ({ verwalter }) => {
	const today = new Date().toLocaleDateString('de-CH', { timeZone: 'Europe/Zurich' });
	await verwalter.sees(endOfContract).toBe(`Unbefristet, gekündigt auf den ${today}`);
});

// the field's error and a refusal of the server use the same frame: the one with the message counts
Then('meldet der Dialog {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(endDateProblemShown(message)).toBe(true);
});

Then('zeigt der Mietvertrag {string}', async ({ verwalter }, end: string) => {
	await verwalter.sees(endOfContract).toBe(end);
});

Then('ist der Mietvertrag unbefristet', async ({ verwalter }) => {
	await verwalter.sees(endOfContract).toBe('Unbefristet');
});

Then('der Mietvertrag von {string} ist nicht mehr auffindbar', async ({ verwalter, names }, tenant: string) => {
	const name = names.get(tenant) ?? tenant;
	await verwalter.attemptsTo(searchContracts(name));
	await verwalter.sees(contractListEmpty).toBe(true);
	await verwalter.sees(listedContractsOf(name)).toBe(0);
});

When('der Liegenschaftsverwalter den nächsten Schritt {string} wählt', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(chooseNextStep(label));
});

// the link names the apartment; that the wizard preselects it from `?apartment=` is tested in contract-new-load.test.ts
Then('gilt der neue Mietvertrag für die Wohnung {string}', async ({ verwalter, seed }, apartment: string) => {
	await verwalter.sees(pageAddress).toMatch(new RegExp(`apartment=${seed.idOf(apartment)}`));
});

When('der Liegenschaftsverwalter den genannten Entwurf öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openRefusedStatement);
});

When('der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag beendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteDraftAndEndContract);
});

When('der Liegenschaftsverwalter die fehlende Abrechnung des letzten Jahres erstellen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(createMissingStatement(`${lastYear}-01-01`));
});

Then('meldet der Mietvertrag die fehlende Abrechnung {int}', async ({ verwalter }, year: number) => {
	await verwalter.sees(missingStatementsText).toContain(String(year));
});

Then('meldet der Mietvertrag keine fehlende Abrechnung des letzten Jahres', async ({ verwalter }) => {
	await verwalter.sees(missingStatementsText).not.toContain(String(lastYear));
});

Then('endet der Mietvertrag von {string} am {string}', async ({ verwalter, seed }, tenant: string, date: string) => {
	await verwalter.attemptsTo(openContract(seed.idOf(`Mietvertrag ${tenant}`)!));
	await verwalter.sees(endOfContract).toContain(date);
});

When(
	'der Liegenschaftsverwalter als nächsten Schritt einen neuen Mietvertrag für {string} erfassen will',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(chooseNextStep(`Neuen Mietvertrag für ${names.get(tenant) ?? tenant} erfassen`));
	}
);
