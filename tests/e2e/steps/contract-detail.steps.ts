import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { apartmentOfContract, endDateProblem, endOfContract, statusOfContract, totalRent } from '../questions/contract-detail';
import { emptyContractList, listedContract } from '../questions/contracts';
import {
	deleteContract,
	editContractFromDetail,
	endContract,
	endContractOn,
	openContractApartment,
	openContractTenant,
	showBuildingInvoices,
	showContractStatements,
	startDeletingContract
} from '../tasks/contract-detail';
import { searchContracts } from '../tasks/contracts';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await visit(verwalter.page, `/contracts/${seed.idOf(`Mietvertrag ${tenant}`)}`);
	}
);

When('der Liegenschaftsverwalter den Mietvertrag beendet', async ({ verwalter }) => {
	await verwalter.perform(endContract);
});

When('der Liegenschaftsverwalter den Mietvertrag auf den {string} beendet', async ({ verwalter }, date: string) => {
	await verwalter.perform(endContractOn(date));
});

// The same steps; the dialog refuses the date and stays open
When('der Liegenschaftsverwalter den Mietvertrag auf den {string} beenden will', async ({ verwalter }, date: string) => {
	await verwalter.perform(endContractOn(date));
});

When('der Liegenschaftsverwalter den Mietvertrag löschen will', async ({ verwalter }) => {
	await verwalter.perform(startDeletingContract);
});

When('der Liegenschaftsverwalter den Mietvertrag löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteContract);
});

When('der Liegenschaftsverwalter den Mietvertrag bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(editContractFromDetail);
});

When('der Liegenschaftsverwalter den Mieter öffnet', async ({ verwalter }) => {
	await verwalter.perform(openContractTenant);
});

When('der Liegenschaftsverwalter die Wohnung des Mietvertrags öffnet', async ({ verwalter }) => {
	await verwalter.perform(openContractApartment);
});

When('der Liegenschaftsverwalter die Nebenkostenabrechnungen des Mietvertrags anzeigt', async ({ verwalter }) => {
	await verwalter.perform(showContractStatements);
});

When('der Liegenschaftsverwalter die Rechnungen des Gebäudes anzeigt', async ({ verwalter }) => {
	await verwalter.perform(showBuildingInvoices);
});

Then('sieht der Liegenschaftsverwalter die Wohnung {string} im Mietvertrag', async ({ verwalter }, number: string) => {
	await expect(apartmentOfContract(verwalter)).toContainText(`Wohnung ${number}`);
});

Then('sieht der Liegenschaftsverwalter den monatlichen Mietzins {string}', async ({ verwalter }, amount: string) => {
	await expect(totalRent(verwalter)).toHaveText(amount);
});

Then('hat der Mietvertrag den Status {string}', async ({ verwalter }, status: string) => {
	await expect(statusOfContract(verwalter)).toHaveText(status);
});

// The end action sets today's date in Switzerland; the page shows it as formatDate does
Then('endet der Mietvertrag heute', async ({ verwalter }) => {
	const today = new Date().toLocaleDateString('de-CH', { timeZone: 'Europe/Zurich' });
	await expect(endOfContract(verwalter)).toHaveText(today);
});

Then('endet der Mietvertrag am {string}', async ({ verwalter }, date: string) => {
	await expect(endOfContract(verwalter)).toHaveText(date);
});

Then('meldet der Dialog {string}', async ({ verwalter }, message: string) => {
	await expect(endDateProblem(verwalter)).toContainText(message);
});

Then('der Mietvertrag von {string} ist nicht mehr auffindbar', async ({ verwalter, names }, tenant: string) => {
	const name = names.get(tenant) ?? tenant;
	await verwalter.perform(searchContracts(name));
	await expect(emptyContractList(verwalter)).toBeVisible();
	await expect(listedContract(verwalter, name)).toHaveCount(0);
});
