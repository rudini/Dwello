import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { pageAddress } from '../questions/navigation';
import {
	allBuildingsNoteText,
	currentStep,
	existingStatementsText,
	akontoHintOf,
	announcedFeeHint,
	balanceOf,
	billedOfBuilding,
	buildingChosen,
	buildingSelectable,
	categoryFindingOf,
	contractsWithoutFee,
	confirmationAsked,
	invoiceWithoutServicePeriodOn,
	countOfInvoicesWithoutServicePeriodOn,
	lateInvoiceOn,
	countOfLateInvoicesOn,
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
	partialInvoicesHints,
	oldAddressWarning,
	noContractsInPeriod,
	notesOnExistingStatement,
	periodRunning,
	missingStockFindings,
	periodChoiceShown,
	presetNoticeText,
	previewHasStatementOf,
	proposedHeatingProfile,
	settingsChoiceCount,
	settingsChoiceName,
	createdStatements,
	discardQuestion,
	statementsInPreview,
	tankQuestions,
	totalCostsOf,
	previewRowText,
	vacancyNoteText,
	skippedContractText,
	allSkippedText,
} from '../questions/statement-generate';
import { restoredDraftShown, restoredDraftText } from '../questions/wizard';
import {
	chooseAllBuildings,
	chooseBuilding,
	chooseBuildingsFor,
	chooseOfferedPeriod,
	chooseBuildingsForPeriod,
	closeRestoredNotice,
	confirmDespiteWarnings,
	confirmDiscarding,
	discardInput,
	editHintedInvoice,
	generateMore,
	openContractWithoutFee,
	openExistingStatement,
	generateStatements,
	goToGeneration,
	openPreview,
	openStatementWizard,
	openStatementWizardFor,
	recalculatePreview,
	recordInvoiceFromWarning,
	recordNoTankFromQuestion,
	reopenStatementWizard,
	returnToStatementList,
	setManagementFee,
	showCreatedStatements,
	downloadCreatedStatementsZip,
	requestCreatedStatementsZip,
	tryNextWithoutConfirmation,
	typeManagementFee,
	openSkippedContract,
} from '../tasks/statement-generate';
import { francs, signedFrancs } from '../questions/amounts';
import { filesInDownloadedZip } from '../questions/download';
import { inDays } from '../fixtures/dates';

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
	'der Liegenschaftsverwalter die Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string, profile: string) => {
		const options = { heatingProfileId: await seed.heatingProfileId(profile) };
		await verwalter.attemptsTo(generateStatements(year, seed.idOf(building)!, options));
	}
);

// the wizard preselects a heating profile, maybe one a parallel scenario already deleted: name a seeded one
Given(
	'der Liegenschaftsverwalter hat die Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} erstellt',
	async ({ verwalter, seed }, year: number, building: string, profile: string) => {
		const options = { heatingProfileId: await seed.heatingProfileId(profile) };
		await verwalter.attemptsTo(generateStatements(year, seed.idOf(building)!, options));
		await verwalter.sees(generationOutcomeShown).toBe(true);
	}
);

When('der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showCreatedStatements);
});

When('der Liegenschaftsverwalter die erstellten Abrechnungen als ZIP herunterlädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(downloadCreatedStatementsZip);
});

When('der Liegenschaftsverwalter die erstellten Abrechnungen als ZIP anfordert', async ({ verwalter }) => {
	await verwalter.attemptsTo(requestCreatedStatementsZip);
});

Then(
	'enthält die ZIP-Datei nur das PDF der Abrechnung {int} von {string}, benannt nach ihrer Abrechnungsnummer',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.sees(filesInDownloadedZip).toEqual([`${await seed.statementNumber(tenant, year)}.pdf %PDF-`]);
	}
);

When('der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt', async ({ verwalter }) => {
	await verwalter.attemptsTo(returnToStatementList);
});

Then('enthält die Vorschau die Abrechnung von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(previewHasStatementOf(names.get(tenant) ?? tenant)).toBe(true);
});

Then('die Vorschau enthält genau {int} Abrechnung(en)', async ({ verwalter }, count: number) => {
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
			openPreview(year, seed.idOf(building)!, { heatingProfileId: await seed.heatingProfileId(profile), managementFeePercent: fee })
		);
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen vom {string} bis {string} für das Gebäude {string} mit dem Heizprofil {string} öffnet',
	async ({ verwalter, seed }, start: string, end: string, building: string, profile: string) => {
		const options = { periodStart: start, periodEnd: end, heatingProfileId: await seed.heatingProfileId(profile) };
		await verwalter.attemptsTo(openPreview(Number(start.slice(0, 4)), seed.idOf(building)!, options));
	}
);

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen {int} für das Gebäude {string} mit dem Heizprofil {string} öffnet',
	async ({ verwalter, seed }, year: number, building: string, profile: string) => {
		await verwalter.attemptsTo(openPreview(year, seed.idOf(building)!, { heatingProfileId: await seed.heatingProfileId(profile) }));
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

Then('meldet die Prüfung der Kategorien nichts für {string}', async ({ verwalter }, category: string) => {
	await verwalter.sees(categoryFindingOf(category)).toBeNull();
});

Given(
	'im Gebäude {string} gibt es im Jahr {int} jeden Monat eine Rechnung der Kategorie {string} über {string} Franken',
	async ({ seed }, building: string, year: number, category: string, amount: string) => {
		for (let month = 1; month <= 12; month++) {
			const end = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
			await seed.invoiceOn(building, category, amount, end);
		}
	}
);

Given(
	'im Gebäude {string} gibt es im Jahr {int} jedes Quartal eine Rechnung der Kategorie {string} über {string} Franken',
	async ({ seed }, building: string, year: number, category: string, amount: string) => {
		for (const day of ['03-31', '06-30', '09-30', '12-31']) await seed.invoiceOn(building, category, amount, `${year}-${day}`);
	}
);

Then('warnt die Vorschau nicht vor fehlenden Rechnungen', async ({ verwalter }) => {
	await verwalter.sees(missingInvoicesWarnings).toBe(0);
});

Then('weist die Vorschau nicht auf Monate ohne Rechnung hin', async ({ verwalter }) => {
	await verwalter.sees(partialInvoicesHints).toBe(0);
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

Then('rät die Vorschau für {string}: {string}', async ({ verwalter, names }, tenant: string, hint: string) => {
	await verwalter.sees(akontoHintOf(names.get(tenant)!)).toContain(hint);
});

const lastYear = Number(inDays(0).slice(0, 4)) - 1;
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

Given('das Gebäude {string} wird inzwischen gelöscht', async ({ seed }, building: string) => {
	await seed.removeBuilding(building);
});

When('der Liegenschaftsverwalter die Gebäude für die Abrechnungen {int} wählen will', async ({ verwalter }, year: number) => {
	await verwalter.attemptsTo(chooseBuildingsFor(year));
});

Then('sagt der Hinweis auf die wiederhergestellten Angaben {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(restoredDraftText).toContain(text);
});

// the text may name the building: by its seeded name
Then('nennt die Wahl für {string} {string}', async ({ verwalter, seed, names }, building: string, text: string) => {
	await verwalter.sees(billedOfBuilding(seed.idOf(building)!)).toBe(text.replaceAll(building, names.get(building) ?? building));
});

// #199, #408 point 2: a building whose statements' period the run's overlaps without being equal
Then('lässt sich das Gebäude {string} für diese Abrechnungsperiode nicht wählen', async ({ verwalter, seed }, building: string) => {
	await verwalter.sees(billedOfBuilding(seed.idOf(building)!)).toContain('überschneidet sich');
	await verwalter.sees(buildingSelectable(seed.idOf(building)!)).toBe(false);
});

When(
	'der Liegenschaftsverwalter für {string} die Abrechnungsperiode ab {string} wählt',
	async ({ verwalter, seed }, building: string, periodStart: string) => {
		await verwalter.attemptsTo(chooseOfferedPeriod(seed.idOf(building)!, periodStart));
	}
);

Then(
	'ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude {string} vom {string} bis {string}',
	async ({ verwalter, seed }, building: string, start: string, end: string) => {
		await verwalter.sees(pageAddress).toMatch(new RegExp(`/statements/generate\\?building=${seed.idOf(building)}&start=${start}&end=${end}`));
		await verwalter.sees(heatingProfileOffered).toBe(true);
	}
);

When('der Liegenschaftsverwalter alle Gebäude wählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseAllBuildings);
});

Then('nicht das Gebäude {string}', async ({ verwalter, seed }, building: string) => {
	await verwalter.sees(buildingChosen(seed.idOf(building)!)).toBe(false);
});

Then(
	'sagt die Wahl der Gebäude, dass «Alle Gebäude» die Gebäude auslässt, deren Mietverträge alle schon eine Abrechnung haben',
	async ({ verwalter }) => {
		// other scenarios add fully billed buildings too: the count is not checked
		await verwalter.sees(allBuildingsNoteText).toMatch(
			/^«Alle Gebäude» lässt \d+ Gebäude aus, (dessen|deren) Mietverträge in dieser Abrechnungsperiode alle schon eine Abrechnung haben\.$/
		);
	}
);

When('der Liegenschaftsverwalter seine Angaben verwerfen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(discardInput);
});

Then('fragt der Assistent zuerst {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(discardQuestion).toContain(text);
});

When('der Liegenschaftsverwalter das Verwerfen bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmDiscarding);
});

When('der Liegenschaftsverwalter den Hinweis auf seine wiederhergestellten Angaben schliesst', async ({ verwalter }) => {
	await verwalter.attemptsTo(closeRestoredNotice);
});

Then('sieht der Liegenschaftsverwalter keinen Hinweis auf wiederhergestellte Angaben', async ({ verwalter }) => {
	await verwalter.sees(restoredDraftShown).toBe(false);
});

Then('meldet das Feld der Verwaltungspauschale {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(feeFieldDescription).toContain(message);
});

Then('bleibt der Assistent beim Schritt mit der Verwaltungspauschale', async ({ verwalter }) => {
	await verwalter.sees(feeFieldShown).toBe(true);
});

Given(
	'der Liegenschaftsverwalter hat für das Gebäude {string} die Verwaltungspauschale auf {float} % gesetzt',
	async ({ verwalter, seed }, building: string, fee: number) => {
		await verwalter.attemptsTo(setManagementFee(seed.idOf(building)!, fee));
	}
);

Then(
	'nennt der Assistent den Mietvertrag von {string} ohne vereinbarte Verwaltungspauschale',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(contractsWithoutFee).toContain(names.get(tenant)!);
	}
);

Then('nicht den Mietvertrag von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(contractsWithoutFee).not.toContain(names.get(tenant)!);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} ohne vereinbarte Verwaltungspauschale öffnet',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openContractWithoutFee(seed.idOf(`Mietvertrag ${tenant}`)!));
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung {int} mit {float} % Verwaltungspauschale',
	async ({ seed }, tenant: string, building: string, year: number, fee: number) => {
		await seed.statement(tenant, building, year, undefined, undefined, fee);
	}
);

Then('schlägt der Assistent eine Verwaltungspauschale von {string} % vor', async ({ verwalter }, fee: string) => {
	await verwalter.sees(feeFieldValue).toBe(fee);
});

Then('sagt der Assistent {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(presetNoticeText).toContain(text);
});

When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen vom {string} bis {string} für das Gebäude {string} öffnet',
	async ({ verwalter, seed }, start: string, end: string, building: string) => {
		await verwalter.attemptsTo(openPreview(Number(start.slice(0, 4)), seed.idOf(building)!, { periodStart: start, periodEnd: end }));
	}
);

Then('verlangt die Vorschau keine Bestätigung', async ({ verwalter }) => {
	await verwalter.sees(confirmationAsked).toBe(false);
});

Then(
	'nennt der Hinweis auf Rechnungen nach der Abrechnungsperiode die Rechnung vom {string} über {string}',
	async ({ verwalter }, date: string, amount: string) => {
		await verwalter.sees(lateInvoiceOn(date)).toContain(amount);
	}
);

Then('nennt der Hinweis auf Rechnungen nach der Abrechnungsperiode keine Rechnung vom {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(countOfLateInvoicesOn(date)).toBe(0);
});

Then(
	'nennt der Hinweis auf Rechnungen ohne Leistungszeitraum die Rechnung vom {string} über {string}',
	async ({ verwalter }, date: string, amount: string) => {
		await verwalter.sees(invoiceWithoutServicePeriodOn(date)).toContain(amount);
	}
);

Then('nennt der Hinweis auf Rechnungen ohne Leistungszeitraum keine Rechnung vom {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(countOfInvoicesWithoutServicePeriodOn(date)).toBe(0);
});

When('der Liegenschaftsverwalter die Rechnung vom {string} aus dem Hinweis bearbeitet', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(editHintedInvoice(date));
});
// A-5 (#114): the warning starts with the tenant's full name
Then(
	'warnt die Vorschau, dass {string} ausgezogen ist: {string}',
	async ({ verwalter, names }, tenant: string, rest: string) => {
		await verwalter.sees(oldAddressWarning).toContain(`${names.get(tenant)} ist ausgezogen. ${rest}`);
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung {int} mit dem Heizprofil {string} und {float} % Verwaltungspauschale',
	async ({ seed }, tenant: string, building: string, year: number, profile: string, fee: number) => {
		await seed.statement(tenant, building, year, profile, undefined, fee);
	}
);

Then('sagt die Vorschau {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(existingStatementsText).toContain(text);
});

// a seeded Heizprofil «Winter» is named «Winter <id>»
const withNames = (text: string, names: Map<string, string>) =>
	text.replace(/«([^»]+)»/g, (quoted, name: string) => (names.has(name) ? `«${names.get(name)}»` : quoted));

Then(
	'sagt die Vorschau zur Abrechnung {int} von {string} {string}',
	async ({ verwalter, seed, names }, year: number, tenant: string, text: string) => {
		await verwalter.sees(notesOnExistingStatement(seed.idOf(`Abrechnung ${tenant} ${year}`)!)).toContain(withNames(text, names));
	}
);

Then('zur Abrechnung {int} von {string} sagt die Vorschau nichts', async ({ verwalter, seed }, year: number, tenant: string) => {
	await verwalter.sees(notesOnExistingStatement(seed.idOf(`Abrechnung ${tenant} ${year}`)!)).toBeNull();
});

When(
	'der Liegenschaftsverwalter in der Vorschau die Abrechnung {int} von {string} öffnet',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openExistingStatement(seed.idOf(`Abrechnung ${tenant} ${year}`)!));
	}
);

// Tankbestand checks (#136, #72)
Given(
	'im Gebäude {string} war vor {int} Tagen Heizöl für {string} Franken im Tank',
	async ({ seed }, building: string, days: number, amount: string) => {
		await seed.fuelStock(building, inDays(-days), amount);
	}
);

Given(
	'im Gebäude {string} gibt es eine Heizkostenrechnung über {string} Franken von heute',
	async ({ seed }, building: string, amount: string) => {
		await seed.invoiceOn(building, 'Heizung', amount, inDays(0));
	}
);

Given('das Gebäude {string} hat keinen Tank oder der Tank ist stillgelegt', async ({ seed }, building: string) => {
	await seed.noTank(building);
});

// A period relative to today: running whatever day today is
When(
	'der Liegenschaftsverwalter die Vorschau der Abrechnungen von vor {int} Tagen bis in {int} Tagen für das Gebäude {string} öffnet',
	async ({ verwalter, seed }, ago: number, ahead: number, building: string) => {
		const [periodStart, periodEnd] = [inDays(-ago), inDays(ahead)];
		await verwalter.attemptsTo(openPreview(Number(periodStart.slice(0, 4)), seed.idOf(building)!, { periodStart, periodEnd }));
	}
);

When(
	'der Liegenschaftsverwalter die Gebäude für die Abrechnungen vom {string} bis {string} wählen will',
	async ({ verwalter }, periodStart: string, periodEnd: string) => {
		await verwalter.attemptsTo(chooseBuildingsForPeriod(periodStart, periodEnd));
	}
);

Then('nennt die Vorschau die bestehenden Abrechnungen von {string}', async ({ verwalter, names }, building: string) => {
	await verwalter.sees(existingStatementsText).toContain(`Für ${names.get(building) ?? building} gibt es in dieser Abrechnungsperiode schon`);
});

Then('ist der Assistent im Schritt {string}', async ({ verwalter }, step: string) => {
	await verwalter.sees(currentStep).toBe(step);
});

Then('nennt die Prüfung der Kategorien keinen fehlenden Tankbestand', async ({ verwalter }) => {
	await verwalter.sees(missingStockFindings).toBe(0);
});

Then('warnt die Vorschau, dass die Abrechnungsperiode noch läuft', async ({ verwalter }) => {
	await verwalter.sees(periodRunning).toContain('Periode läuft noch');
});

Then('fragt die Vorschau nicht nach dem Heizmaterial', async ({ verwalter }) => {
	await verwalter.sees(tankQuestions).toBe(0);
});

When(
	'der Liegenschaftsverwalter aus der Frage nach dem Heizmaterial festhalten will, dass {string} keinen Tank hat',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(recordNoTankFromQuestion(seed.idOf(building)!));
	}
);

// #453 (#327): days, Akonto and «Abgerechnet bis» per contract; contracts «Abgerechnet bis» covers in full
Then('nennt die Vorschau bei {string} {string}', async ({ verwalter, names }, tenant: string, text: string) => {
	await verwalter.sees(previewRowText(names.get(tenant)!)).toContain(text);
});

Then('nennt die Vorschau bei {string} nicht {string}', async ({ verwalter, names }, tenant: string, text: string) => {
	await verwalter.sees(previewRowText(names.get(tenant)!)).not.toContain(text);
});

Then('sagt die Vorschau zum Total {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(vacancyNoteText).toBe(text);
});

Then(
	'nennt die Vorschau den übergangenen Mietvertrag von {string}: {string}',
	async ({ verwalter, seed, names }, tenant: string, text: string) => {
		await verwalter.sees(skippedContractText(seed.idOf(`Mietvertrag ${tenant}`)!)).toContain(`${names.get(tenant)}: ${text}`);
	}
);

When(
	'der Liegenschaftsverwalter in der Vorschau den übergangenen Mietvertrag von {string} öffnet',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openSkippedContract(seed.idOf(`Mietvertrag ${tenant}`)!));
	}
);

Then('sagt die leere Vorschau zu {string} {string}', async ({ verwalter, seed, names }, building: string, text: string) => {
	await verwalter.sees(allSkippedText(seed.idOf(building)!)).toBe(text.replace(building, names.get(building)!));
});
