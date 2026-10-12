import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { heatingProfileSelect } from '../interactions/statement-generate';
import {
	allPreviewRows,
	chosenBuilding,
	draftsOnly,
	feeAboveGuideline,
	announcedFeeHint,
	feeField,
	feeOfRun,
	settingsChoices,
	invoicesOfBuilding,
	missingInvoicesWarning,
	generationOutcome,
	noContractsInPeriod,
	periodChoice,
	previewRow,
	categoryFinding
} from '../questions/statement-generate';
import {
	chooseBuilding,
	confirmDespiteWarnings,
	generateMore,
	generateStatements,
	goToGeneration,
	openPreview,
	recalculatePreview,
	recordInvoiceFromWarning,
	reopenStatementWizard,
	tryNextWithoutConfirmation,
	returnToStatementList,
	setManagementFee,
	typeManagementFee,
	showCreatedStatements
} from '../tasks/statement-generate';

import {
	createdStatements,
	francs,
	generateStatementsViaApi,
	openPreviewViaApi,
	previewBalances,
	previewTotals
} from '../tasks/statement-generate-api';

const { Given, When, Then } = createBdd(test);

// The preview through the UI or, for @api scenarios, through the backend API
const previewWith = (
	driver: string,
	seed: Parameters<typeof openPreviewViaApi>[0],
	year: number,
	buildingId: string,
	options: Parameters<typeof openPreview>[2]
) => (driver === 'api' ? openPreviewViaApi(seed, year, buildingId, options) : openPreview(year, buildingId, options));

Given(
	'der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen',
	async ({ verwalter, driver }) => {
		if (driver === 'ui') await visit(verwalter.page, '/statements/generate');
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string) => {
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? openPreviewViaApi(seed, year, buildingId) : openPreview(year, buildingId)
		);
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed, driver }, year: number, building: string) => {
		const buildingId = seed.idOf(building)!;
		await verwalter.perform(
			driver === 'api' ? generateStatementsViaApi(seed, year, buildingId) : generateStatements(year, buildingId)
		);
	}
);

Given(
	'der Liegenschaftsverwalter hat die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.perform(generateStatements(year, seed.idOf(building)!));
		await expect(generationOutcome(verwalter)).toBeVisible();
	}
);

When('der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt', async ({ verwalter }) => {
	await verwalter.perform(showCreatedStatements);
});

When('der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt', async ({ verwalter }) => {
	await verwalter.perform(returnToStatementList);
});

Then(
	'enthält die Vorschau die Abrechnung von {string}',
	async ({ verwalter, names, driver }, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		if (driver === 'api') expect([...previewTotals(verwalter).keys()]).toContain(name);
		else await expect(previewRow(verwalter, name)).toBeVisible();
	}
);

Then('die Vorschau enthält genau {int} Abrechnungen', async ({ verwalter, driver }, count: number) => {
	if (driver === 'api') expect(previewTotals(verwalter).size).toBe(count);
	else await expect(allPreviewRows(verwalter)).toHaveCount(count);
});

Then(
	'meldet die Vorschau, dass es in der Periode keine Mietverträge gibt',
	async ({ verwalter, driver }) => {
		if (driver === 'api') expect(previewTotals(verwalter).size).toBe(0);
		else await expect(noContractsInPeriod(verwalter)).toBeVisible();
	}
);

Then('wurde 1 Nebenkostenabrechnung erstellt', async ({ verwalter, driver }) => {
	if (driver === 'api') expect(createdStatements(verwalter)).toBe(1);
	else await expect(generationOutcome(verwalter)).toContainText('1 Nebenkostenabrechnung ist als Entwurf erstellt');
});

Then('wurden {int} Nebenkostenabrechnungen erstellt', async ({ verwalter, driver }, count: number) => {
	if (driver === 'api') expect(createdStatements(verwalter)).toBe(count);
	else await expect(generationOutcome(verwalter)).toContainText(`${count} Nebenkostenabrechnungen sind als Entwurf erstellt`);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} und {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string, profile: string, fee: number) => {
		await verwalter.perform(
			previewWith(driver, seed, year, seed.idOf(building)!, { heatingProfileId: seed.idOf(profile), managementFeePercent: fee })
		);
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed, driver }, year: number, building: string, fee: number) => {
		await verwalter.perform(previewWith(driver, seed, year, seed.idOf(building)!, { managementFeePercent: fee }));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die Verwaltungspauschale auf {float} % setzt',
	async ({ verwalter, seed }, building: string, fee: number) => {
		await verwalter.perform(setManagementFee(seed.idOf(building)!, fee));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die Verwaltungspauschale {string} eintippt',
	async ({ verwalter, seed }, building: string, text: string) => {
		await verwalter.perform(typeManagementFee(seed.idOf(building)!, text));
	}
);

Then('nennt die Vorschau eine Verwaltungspauschale von {string}', async ({ verwalter }, text: string) => {
	await expect(feeOfRun(verwalter)).toContainText(text);
});

Then('steht im Feld der Verwaltungspauschale {string}', async ({ verwalter }, text: string) => {
	await expect(feeField(verwalter)).toHaveValue(text);
});

Then('meldet der Assistent, dass die Verwaltungspauschale über dem üblichen Richtwert liegt', async ({ verwalter }) => {
	await expect(announcedFeeHint(verwalter)).toBeVisible();
});

When('der Liegenschaftsverwalter das Gebäude {string} für die Abrechnungen wählt', async ({ verwalter, seed }, building: string) => {
	await verwalter.perform(chooseBuilding(seed.idOf(building)!));
});

When('der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet', async ({ verwalter }) => {
	await verwalter.perform(reopenStatementWizard);
});

When('der Liegenschaftsverwalter bestätigt, dass die Abrechnungen trotzdem erstellt werden sollen', async ({ verwalter }) => {
	await verwalter.perform(confirmDespiteWarnings);
});

When('der Liegenschaftsverwalter die Vorschau neu berechnen lässt', async ({ verwalter }) => {
	await verwalter.perform(recalculatePreview);
});

When('der Liegenschaftsverwalter zum Erstellen weitergeht', async ({ verwalter }) => {
	await verwalter.perform(goToGeneration);
});

Then(
	'warnt die Vorschau, dass für {string} in der Abrechnungsperiode keine Rechnungen erfasst sind',
	async ({ verwalter, names }, building: string) => {
		await expect(missingInvoicesWarning(verwalter)).toContainText(names.get(building) ?? building);
	}
);

Then(
	'meldet die Prüfung der Kategorien für {string}: {string}',
	async ({ verwalter }, category: string, finding: string) => {
		await expect(categoryFinding(verwalter, category)).toContainText(finding);
	}
);

Then('warnt die Vorschau nicht vor fehlenden Rechnungen', async ({ verwalter }) => {
	await expect(missingInvoicesWarning(verwalter)).toHaveCount(0);
});

When('der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will', async ({ verwalter }) => {
	await verwalter.perform(tryNextWithoutConfirmation);
});

Then(
	'nennt die Vorschau für {string} {int} erfasste Rechnung',
	async ({ verwalter, names }, building: string, count: number) => {
		await expect(invoicesOfBuilding(verwalter, names.get(building) ?? building)).toContainText(`${count} Rechnung`);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die Abrechnungen als Entwurf entstehen und nichts verschickt wird',
	async ({ verwalter }) => {
		await expect(draftsOnly(verwalter)).toContainText('nichts verschickt');
	}
);

Then('ist für die Abrechnungen das Gebäude {string} gewählt', async ({ verwalter, seed }, building: string) => {
	await expect(chosenBuilding(verwalter, seed.idOf(building)!)).toBeChecked();
});

Then(
	'beträgt der Saldo von {string} {string}',
	async ({ verwalter, names, driver }, tenant: string, saldo: string) => {
		const name = names.get(tenant) ?? tenant;
		const signed = (saldo.startsWith('Rückerstattung') ? -1 : 1) * francs(saldo);
		if (driver === 'api') expect(previewBalances(verwalter).get(name)).toBe(signed);
		else await expect(previewRow(verwalter, name)).toContainText(saldo);
	}
);

Then(
	'kostet die Abrechnung von {string} {string}',
	async ({ verwalter, names, driver }, tenant: string, amount: string) => {
		if (driver === 'api') expect(previewTotals(verwalter).get(names.get(tenant) ?? tenant)).toBe(francs(amount));
		else await expect(previewRow(verwalter, names.get(tenant) ?? tenant)).toContainText(amount);
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Hinweis, dass die Verwaltungspauschale über dem üblichen Richtwert liegt',
	async ({ verwalter }) => {
		await expect(feeAboveGuideline(verwalter)).toBeVisible();
	}
);

Then(
	'erklärt der Assistent, dass die Verwaltungspauschale ein Prozentsatz der eigenen Nebenkosten jedes Mieters ist',
	async ({ verwalter }) => {
		await expect(feeField(verwalter)).toHaveAccessibleDescription(/Prozentsatz der eigenen Nebenkosten jedes Mieters/);
	}
);

Then('bietet der Assistent keine Verteilung der Verwaltungspauschale an', async ({ verwalter }) => {
	await expect(feeField(verwalter)).toBeVisible();
	await expect(settingsChoices(verwalter)).toHaveCount(1);
	await expect(settingsChoices(verwalter)).toHaveAccessibleName('Heizprofil');
});

When('der Liegenschaftsverwalter weitere Abrechnungen erstellen will', async ({ verwalter }) => {
	await verwalter.perform(generateMore);
});

Then('beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode', async ({ verwalter }) => {
	await expect(periodChoice(verwalter)).toBeVisible();
	await expect(generationOutcome(verwalter)).toHaveCount(0);
});

When('der Liegenschaftsverwalter aus der Warnung eine Rechnung erfassen will', async ({ verwalter }) => {
	await verwalter.perform(recordInvoiceFromWarning);
});

Given('es gibt das Heizprofil {string}', async ({ seed }, title: string) => {
	await seed.heatingProfile(title, [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
});

// the link a contract or a refusal offers: building and period chosen, on the settings step
When(
	'der Liegenschaftsverwalter den Assistenten für das Gebäude {string} und {int} öffnet',
	async ({ verwalter, seed }, building: string, year: number) => {
		await visit(verwalter.page, `/statements/generate?building=${seed.idOf(building)}&start=${year}-01-01&end=${year}-12-31`);
	}
);

Then('schlägt der Assistent das Heizprofil {string} vor', async ({ verwalter, names }, profile: string) => {
	// the option names the profile and its sum, «Winter … (100%)»
	await expect(heatingProfileSelect(verwalter.page).locator('option:checked')).toContainText(names.get(profile)!);
});

const lastYear = new Date().getFullYear() - 1;
const inWizardFor = async (page: import('@playwright/test').Page, buildingId: string, year: number) => {
	await expect(page).toHaveURL(new RegExp(`/statements/generate\\?building=${buildingId}&start=${year}-01-01&end=${year}-12-31`));
	await expect(heatingProfileSelect(page)).toBeVisible();
};

Then(
	'ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude {string} und {int}',
	async ({ verwalter, seed }, building: string, year: number) => {
		await inWizardFor(verwalter.page, seed.idOf(building)!, year);
	}
);

Then(
	'ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude {string} und das letzte Jahr',
	async ({ verwalter, seed }, building: string) => {
		await inWizardFor(verwalter.page, seed.idOf(building)!, lastYear);
	}
);
