import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { pageAddress } from '../questions/navigation';
import {
	announcedFeeHint,
	balanceOf,
	buildingChosen,
	categoryFindingOf,
	draftsOnly,
	feeAboveGuideline,
	feeFieldDescription,
	feeFieldShown,
	feeFieldValue,
	feeOfRun,
	generationOutcomeCount,
	generationOutcomeShown,
	heatingProfileOffered,
	invoicesOfBuilding,
	missingInvoicesWarning,
	missingInvoicesWarnings,
	noContractsInPeriod,
	periodChoiceShown,
	previewHasStatementOf,
	proposedHeatingProfile,
	settingsChoiceCount,
	settingsChoiceName,
	createdStatements,
	statementsInPreview,
	totalCostsOf
} from '../questions/statement-generate';
import {
	chooseBuilding,
	confirmDespiteWarnings,
	generateMore,
	generateStatements,
	goToGeneration,
	openPreview,
	openStatementWizard,
	openStatementWizardFor,
	recalculatePreview,
	recordInvoiceFromWarning,
	reopenStatementWizard,
	returnToStatementList,
	setManagementFee,
	showCreatedStatements,
	tryNextWithoutConfirmation,
	typeManagementFee
} from '../tasks/statement-generate';
import { francs, signedFrancs } from '../questions/amounts';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen', async ({ verwalter }) => {
	await verwalter.attemptsTo(openStatementWizard);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} öffnet',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.attemptsTo(openPreview(year, seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.attemptsTo(generateStatements(year, seed.idOf(building)!));
	}
);

Given(
	'der Liegenschaftsverwalter hat die Abrechnungen {int} für das Gebäude {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.attemptsTo(generateStatements(year, seed.idOf(building)!));
		await verwalter.sees(generationOutcomeShown).toBe(true);
	}
);

When('der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showCreatedStatements);
});

When('der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt', async ({ verwalter }) => {
	await verwalter.attemptsTo(returnToStatementList);
});

Then('enthält die Vorschau die Abrechnung von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(previewHasStatementOf(names.get(tenant) ?? tenant)).toBe(true);
});

Then('die Vorschau enthält genau {int} Abrechnungen', async ({ verwalter }, count: number) => {
	await verwalter.sees(statementsInPreview).toBe(count);
});

Then('meldet die Vorschau, dass es in der Periode keine Mietverträge gibt', async ({ verwalter }) => {
	await verwalter.sees(noContractsInPeriod).toBe(true);
});

Then('wurde 1 Nebenkostenabrechnung erstellt', async ({ verwalter }) => {
	await verwalter.sees(createdStatements).toBe(1);
});

Then('wurden {int} Nebenkostenabrechnungen erstellt', async ({ verwalter }, count: number) => {
	await verwalter.sees(createdStatements).toBe(count);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} und {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed }, year: number, building: string, profile: string, fee: number) => {
		await verwalter.attemptsTo(
			openPreview(year, seed.idOf(building)!, { heatingProfileId: seed.idOf(profile), managementFeePercent: fee })
		);
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale öffnet',
	async ({ verwalter, seed }, year: number, building: string, fee: number) => {
		await verwalter.attemptsTo(openPreview(year, seed.idOf(building)!, { managementFeePercent: fee }));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die Verwaltungspauschale auf {float} % setzt',
	async ({ verwalter, seed }, building: string, fee: number) => {
		await verwalter.attemptsTo(setManagementFee(seed.idOf(building)!, fee));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die Verwaltungspauschale {string} eintippt',
	async ({ verwalter, seed }, building: string, text: string) => {
		await verwalter.attemptsTo(typeManagementFee(seed.idOf(building)!, text));
	}
);

Then('nennt die Vorschau eine Verwaltungspauschale von {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(feeOfRun).toContain(text);
});

Then('steht im Feld der Verwaltungspauschale {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(feeFieldValue).toBe(text);
});

Then('meldet der Assistent, dass die Verwaltungspauschale über dem üblichen Richtwert liegt', async ({ verwalter }) => {
	await verwalter.sees(announcedFeeHint).toBe(true);
});

When('der Liegenschaftsverwalter das Gebäude {string} für die Abrechnungen wählt', async ({ verwalter, seed }, building: string) => {
	await verwalter.attemptsTo(chooseBuilding(seed.idOf(building)!));
});

When('der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(reopenStatementWizard);
});

When('der Liegenschaftsverwalter bestätigt, dass die Abrechnungen trotzdem erstellt werden sollen', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmDespiteWarnings);
});

When('der Liegenschaftsverwalter die Vorschau neu berechnen lässt', async ({ verwalter }) => {
	await verwalter.attemptsTo(recalculatePreview);
});

When('der Liegenschaftsverwalter zum Erstellen weitergeht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToGeneration);
});

Then(
	'warnt die Vorschau, dass für {string} in der Abrechnungsperiode keine Rechnungen erfasst sind',
	async ({ verwalter, names }, building: string) => {
		await verwalter.sees(missingInvoicesWarning).toContain(names.get(building) ?? building);
	}
);

Then(
	'meldet die Prüfung der Kategorien für {string}: {string}',
	async ({ verwalter }, category: string, finding: string) => {
		await verwalter.sees(categoryFindingOf(category)).toContain(finding);
	}
);

Then('warnt die Vorschau nicht vor fehlenden Rechnungen', async ({ verwalter }) => {
	await verwalter.sees(missingInvoicesWarnings).toBe(0);
});

When('der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(tryNextWithoutConfirmation);
});

Then(
	'nennt die Vorschau für {string} {int} erfasste Rechnung',
	async ({ verwalter, names }, building: string, count: number) => {
		await verwalter.sees(invoicesOfBuilding(names.get(building) ?? building)).toContain(`${count} Rechnung`);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die Abrechnungen als Entwurf entstehen und nichts verschickt wird',
	async ({ verwalter }) => {
		await verwalter.sees(draftsOnly).toContain('nichts verschickt');
	}
);

Then('ist für die Abrechnungen das Gebäude {string} gewählt', async ({ verwalter, seed }, building: string) => {
	await verwalter.sees(buildingChosen(seed.idOf(building)!)).toBe(true);
});

Then('beträgt der Saldo von {string} {string}', async ({ verwalter, names }, tenant: string, saldo: string) => {
	await verwalter.sees(balanceOf(names.get(tenant) ?? tenant)).toBe(signedFrancs(saldo));
});

Then('kostet die Abrechnung von {string} {string}', async ({ verwalter, names }, tenant: string, amount: string) => {
	await verwalter.sees(totalCostsOf(names.get(tenant) ?? tenant)).toBe(francs(amount));
});

Then(
	'sieht der Liegenschaftsverwalter den Hinweis, dass die Verwaltungspauschale über dem üblichen Richtwert liegt',
	async ({ verwalter }) => {
		await verwalter.sees(feeAboveGuideline).toBe(true);
	}
);

Then(
	'erklärt der Assistent, dass die Verwaltungspauschale ein Prozentsatz der eigenen Nebenkosten jedes Mieters ist',
	async ({ verwalter }) => {
		await verwalter.sees(feeFieldDescription).toMatch(/Prozentsatz der eigenen Nebenkosten jedes Mieters/);
	}
);

Then('bietet der Assistent keine Verteilung der Verwaltungspauschale an', async ({ verwalter }) => {
	await verwalter.sees(feeFieldShown).toBe(true);
	await verwalter.sees(settingsChoiceCount).toBe(1);
	await verwalter.sees(settingsChoiceName).toBe('Heizprofil');
});

When('der Liegenschaftsverwalter weitere Abrechnungen erstellen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(generateMore);
});

Then('beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode', async ({ verwalter }) => {
	await verwalter.sees(periodChoiceShown).toBe(true);
	await verwalter.sees(generationOutcomeCount).toBe(0);
});

When('der Liegenschaftsverwalter aus der Warnung eine Rechnung erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(recordInvoiceFromWarning);
});

Given('es gibt das Heizprofil {string}', async ({ seed }, title: string) => {
	await seed.heatingProfile(title, [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
});

// the link a contract or a refusal offers: building and period chosen, on the settings step
When(
	'der Liegenschaftsverwalter den Assistenten für das Gebäude {string} und {int} öffnet',
	async ({ verwalter, seed }, building: string, year: number) => {
		await verwalter.attemptsTo(openStatementWizardFor(seed.idOf(building)!, year));
	}
);

Then('schlägt der Assistent das Heizprofil {string} vor', async ({ verwalter, names }, profile: string) => {
	await verwalter.sees(proposedHeatingProfile).toContain(names.get(profile)!);
});

const lastYear = new Date().getFullYear() - 1;
const wizardAddressFor = (buildingId: string, year: number) =>
	new RegExp(`/statements/generate\\?building=${buildingId}&start=${year}-01-01&end=${year}-12-31`);

Then(
	'ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude {string} und {int}',
	async ({ verwalter, seed }, building: string, year: number) => {
		await verwalter.sees(pageAddress).toMatch(wizardAddressFor(seed.idOf(building)!, year));
		await verwalter.sees(heatingProfileOffered).toBe(true);
	}
);

Then(
	'ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude {string} und das letzte Jahr',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.sees(pageAddress).toMatch(wizardAddressFor(seed.idOf(building)!, lastYear));
		await verwalter.sees(heatingProfileOffered).toBe(true);
	}
);
