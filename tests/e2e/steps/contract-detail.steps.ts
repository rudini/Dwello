import { createBdd } from 'playwright-bdd';
import { invoicePeriodFilterText } from '../questions/invoices';
import { test } from '../fixtures/test';
import {
	apartmentOfContract,
	deleteDialogText,
	endConfirmationInWindow,
	endDialogDeathText,
	endDialogText,
	noticePeriodHintShown,
	noticePeriodHintText,
	noticeReceivedOn,
	endDateProblemShown,
	endOfContract,
	managementFeeOfContract,
	missingStatementsText,
	missingStatementsShown,
	shortPeriodHelpText,
	missingStatementInvoicesLabel,
	missingStatementOffer,
	billedUntilOfContract,
	nextStepsText,
	statementLinkedInDeleteDialog,
	statusOfContract,
	totalRent,
	fixedTermCheckShown,
	fixedTermCheckText,
	fixedTermErrorText,
	flatRateUtilityCharge,
	advancePeriodOf,
	dialogErrorCount,
	mistakeConfirmed
} from '../questions/contract-detail';
import { statementPath } from '../questions/statements';
import { contractListEmpty, listedContractsOf } from '../questions/contracts';
import { chosenInvoiceBuilding, chosenInvoiceYear } from '../questions/invoices';
import { pageAddress } from '../questions/navigation';
import {
	chooseNextStep,
	confirmMistake,
	createMissingStatement,
	deleteAdvance,
	deleteContract,
	deleteContractEnteredByMistake,
	deleteDraftAndEndContract,
	editContractFromDetail,
	endContract,
	confirmEnd,
	fillEndWithNotice,
	startEndingContract,
	endContractOn,
	openContract,
	openContractApartment,
	openContractTenant,
	openRefusedStatement,
	scrollToEndConfirmation,
	showBuildingInvoices,
	showContractStatements,
	showMissingStatementInvoices,
	openStatementFromDeleteDialog,
	startDeletingContract,
	useWindowOf,
	continueOpenEnded,
	confirmMovedOut,
	deleteDraftAndContinue
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
	'für {string} gibt es die versendete Abrechnung {int} im Gebäude {string}',
	async ({ seed }, tenant: string, year: number, building: string) => {
		await seed.statement(tenant, building, year);
		await seed.sendStatement(tenant, year);
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

When('der Liegenschaftsverwalter den Mietvertrag löschen will, ohne den Irrtum zu bestätigen', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteContract);
});

When('der Liegenschaftsverwalter den Irrtum danach bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmMistake);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag löscht und bestätigt, dass er irrtümlich erfasst wurde',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(deleteContractEnteredByMistake);
	}
);

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
// the confirmation ticked is the anchor: the dialog is still open and took the choice (#654)
Then('meldet der Dialog keinen Fehler mehr', async ({ verwalter }) => {
	await verwalter.sees(mistakeConfirmed).toBe(true);
	await verwalter.sees(dialogErrorCount).toBe(0);
});

Then('meldet der Dialog {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(endDateProblemShown(message)).toBe(true);
});

// what the delete dialog says when it opens (#116)
Then('nennt der Dialog {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(deleteDialogText).toContain(message);
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

Given(
	'für {string} gibt es die Abrechnung vom {string} bis {string} im Gebäude {string}',
	async ({ seed }, tenant: string, start: string, end: string, building: string) => {
		await seed.statement(tenant, building, Number(start.slice(0, 4)), undefined, [start, end]);
	}
);

Then('meldet der Mietvertrag die fehlende Abrechnung {string}', async ({ verwalter }, period: string) => {
	await verwalter.sees(missingStatementsText).toContain(period);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass es für diese Tage noch keine Abrechnung gibt',
	async ({ verwalter }) => {
		await verwalter.sees(missingStatementsText).toMatch(/deckt nur einen Teil der Abrechnungsperiode ab; für .+ gibt es noch keine Abrechnung/);
	}
);

// #408 point 2: the way the warning offers for the days from that day, by its label
Then('bietet der Mietvertrag für die Tage ab {string} {string} an', async ({ verwalter }, periodStart: string, label: string) => {
	await verwalter.sees(missingStatementOffer(periodStart)).toBe(label);
});

Then('rät der Mietvertrag {string}', async ({ verwalter }, help: string) => {
	await verwalter.sees(shortPeriodHelpText).toBe(help);
});

When('der Liegenschaftsverwalter die fehlende Abrechnung ab {string} erstellen will', async ({ verwalter }, periodStart: string) => {
	await verwalter.attemptsTo(createMissingStatement(periodStart));
});

Then('nennt der Mietvertrag «Abgerechnet bis» nicht als Ausweg', async ({ verwalter }) => {
	await verwalter.sees(missingStatementsShown).toBe(true);
	await verwalter.sees(missingStatementsText).not.toContain('Abgerechnet bis');
});

When(
	'der Liegenschaftsverwalter die Rechnungen der fehlenden Abrechnung {int} anzeigt',
	async ({ verwalter }, year: number) => {
		await verwalter.attemptsTo(showMissingStatementInvoices(`${year}-01-01`));
	}
);

Then(
	'bietet der Mietvertrag für die Tage ab {string} die Rechnungen {string} an',
	async ({ verwalter }, periodStart: string, label: string) => {
		await verwalter.sees(missingStatementInvoicesLabel(periodStart)).toBe(label);
	}
);

When('der Liegenschaftsverwalter die Rechnungen der fehlenden Tage ab {string} anzeigt', async ({ verwalter }, periodStart: string) => {
	await verwalter.attemptsTo(showMissingStatementInvoices(periodStart));
});

// #454: the link sets building and period; the list names the filter
Then(
	'zeigt die Rechnungsliste die Rechnungen der Abrechnungsperiode vom {string} bis {string} im Gebäude {string}',
	async ({ verwalter, seed, names }, start: string, end: string, building: string) => {
		await verwalter.sees(pageAddress).toMatch(new RegExp(`/invoices\\?building=${seed.idOf(building)}&periodStart=${start}&periodEnd=${end}`));
		await verwalter.sees(invoicePeriodFilterText).toContain(names.get(building)!);
	}
);

Then(
	'zeigt die Rechnungsliste die Rechnungen des Jahres {int} im Gebäude {string}',
	async ({ verwalter, names }, year: number, building: string) => {
		await verwalter.sees(chosenInvoiceBuilding).toBe(names.get(building)!);
		await verwalter.sees(chosenInvoiceYear).toBe(String(year));
	}
);

Given(
	'der Mietvertrag von {string} ist bis {string} ausserhalb von Dwello abgerechnet',
	async ({ seed }, tenant: string, date: string) => {
		await seed.billedUntil(tenant, date);
	}
);

Then('zeigt der Mietvertrag «Abgerechnet bis» {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(billedUntilOfContract).toBe(date);
});

Given(
	'der Mietvertrag von {string} ist bis Ende des letzten Jahres ausserhalb von Dwello abgerechnet',
	async ({ seed }, tenant: string) => {
		await seed.billedUntil(tenant, `${lastYear}-12-31`);
	}
);

Then('zeigt der Mietvertrag «Abgerechnet bis» am Ende des letzten Jahres', async ({ verwalter }) => {
	await verwalter.sees(billedUntilOfContract).toBe(`31.12.${lastYear}`);
});

Given(
	'der Mietvertrag von {string} hat ab {string} {string} Franken Akonto',
	async ({ seed }, tenant: string, date: string, advance: string) => {
		await seed.advancePayment(tenant, advance, date);
	}
);

Then(
	'zeigt der Mietvertrag das Akonto {string} vom {string} bis {string}',
	async ({ verwalter }, amount: string, from: string, to: string) => {
		await verwalter.sees(advancePeriodOf(amount)).toContain(from);
		await verwalter.sees(advancePeriodOf(amount)).toContain(to);
	}
);

Then('zeigt der Mietvertrag das Akonto {string} ab {string}', async ({ verwalter }, amount: string, from: string) => {
	await verwalter.sees(advancePeriodOf(amount)).toContain(from);
});

Given('der Mietvertrag von {string} hat {string} Franken Akonto', async ({ seed }, tenant: string, advance: string) => {
	await seed.advancePayment(tenant, advance);
});

Given(
	'der Mietvertrag von {string} hat {string} Franken Nebenkostenpauschale',
	async ({ seed }, tenant: string, amount: string) => {
		await seed.flatRateUtilityCharge(tenant, amount);
	}
);

Then('zeigt der Mietvertrag die Nebenkostenpauschale {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(flatRateUtilityCharge).toBe(amount);
});

Then('zeigt der Mietvertrag das Monatlich total {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(totalRent).toBe(amount);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass er eine ausserhalb von Dwello abgerechnete Periode mit «Abgerechnet bis» einträgt',
	async ({ verwalter }) => {
		await verwalter.sees(missingStatementsText).toContain('«Abgerechnet bis» ein');
	}
);

Then('meldet der Mietvertrag keine fehlende Abrechnung', async ({ verwalter }) => {
	await verwalter.sees(missingStatementsShown).toBe(false);
});

Given('im Mietvertrag von {string} ist keine Verwaltungspauschale vereinbart', async ({ seed }, tenant: string) => {
	await seed.managementFee(tenant, false);
});

Given(
	'im Mietvertrag von {string} ist eine Verwaltungspauschale von {int} % vereinbart',
	async ({ seed }, tenant: string, percent: number) => {
		await seed.managementFee(tenant, true, String(percent));
	}
);

Then('zeigt der Mietvertrag bei der Verwaltungspauschale {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(managementFeeOfContract).toBe(text);
});

When(
	'der Liegenschaftsverwalter als nächsten Schritt einen neuen Mietvertrag für {string} erfassen will',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(chooseNextStep(`Neuen Mietvertrag für ${names.get(tenant) ?? tenant} erfassen`));
	}
);

When('der Liegenschaftsverwalter den Mietvertrag beenden will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startEndingContract);
});

Then(
	'erfährt der Liegenschaftsverwalter im Dialog «Mietvertrag beenden», dass der Mietvertrag beim Tod des Mieters weiterläuft',
	async ({ verwalter }) => {
		await verwalter.sees(endDialogDeathText).toContain('Ist der Mieter gestorben, endet der Mietvertrag nicht von selbst');
		await verwalter.sees(endDialogDeathText).toContain('erst, wenn die Erben oder Sie gekündigt haben');
	}
);

// A-3 (#112): the day the notice arrived gives a hint on a short Kündigungsfrist, never a block
When(
	'der Liegenschaftsverwalter den Mietvertrag auf den {string} beenden will und die Kündigung am {string} erhalten hat',
	async ({ verwalter }, endDate: string, receivedOn: string) => {
		await verwalter.attemptsTo(fillEndWithNotice(endDate, receivedOn));
	}
);

When('der Liegenschaftsverwalter den Mietvertrag trotzdem beendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmEnd);
});

Then(
	'weist der Dialog darauf hin, dass zwischen Eingang und Vertragsende weniger als 3 Monate liegen',
	async ({ verwalter }) => {
		await verwalter.sees(noticePeriodHintText).toContain('Zwischen Eingang und Vertragsende liegen weniger als 3 Monate.');
		await verwalter.sees(noticePeriodHintText).toContain('erst auf den nächsten Kündigungstermin');
		await verwalter.sees(noticePeriodHintText).toContain('Der Mieter schlägt Ihnen einen zumutbaren Ersatzmieter vor');
	}
);

// anchored on the field's help: an empty or broken dialog shows no hint either
Then('zeigt der Dialog keinen Hinweis auf die Frist', async ({ verwalter }) => {
	await verwalter.sees(endDialogText).toContain('Der Tag, an dem das Kündigungsschreiben angekommen ist.');
	await verwalter.sees(endDialogText).toContain('Die Kündigung des Mieters muss schriftlich sein.');
	await verwalter.sees(noticePeriodHintShown).toBe(false);
});

Then('zeigt der Mietvertrag die Kündigung als erhalten am {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(noticeReceivedOn).toBe(date);
});

// A-5 (#114): the address step names the tenant
Then(
	'bitten die nächsten Schritte, die neue Adresse von {string} einzutragen: {string}',
	async ({ verwalter, names }, tenant: string, rest: string) => {
		await verwalter.sees(nextStepsText).toContain(
			`Bitten Sie ${names.get(tenant)} um die neue Adresse und tragen Sie sie beim Mieter ein. ${rest}`
		);
	}
);

Then(
	'verlinkt der Dialog die Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		const id = seed.idOf(`Abrechnung ${tenant} ${year}`)!;
		await verwalter.sees(statementLinkedInDeleteDialog(id)).toBe(statementPath(seed, tenant, year));
	}
);

When(
	'der Liegenschaftsverwalter im Dialog die Abrechnung {int} von {string} öffnet',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementFromDeleteDialog(seed.idOf(`Abrechnung ${tenant} ${year}`)!));
	}
);

// A-6 (#115): an expired fixed-term contract continues open-ended, or the tenant has moved out
When('der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt', async ({ verwalter }) => {
	await verwalter.attemptsTo(continueOpenEnded);
});

When('der Liegenschaftsverwalter bestätigt, dass der Mieter ausgezogen ist', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmMovedOut);
});

When('der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag unbefristet weiterführt', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteDraftAndContinue);
});

Then(
	/^fragt der Mietvertrag nicht(?: mehr)?, ob der Mieter noch in der Wohnung wohnt$/,
	async ({ verwalter }) => {
		await verwalter.sees(fixedTermCheckShown).toBe(false);
	}
);

Then('meldet der Mietvertrag {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(fixedTermErrorText).toContain(message);
});

Then('ist der Mietvertrag von {string} unbefristet', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(openContract(seed.idOf(`Mietvertrag ${tenant}`)!));
	await verwalter.sees(endOfContract).toBe('Unbefristet');
});

// #457 (#410 point 3): the objection help after a fixed-term end
Then('sagt der Hinweis zum abgelaufenen Mietvertrag {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(fixedTermCheckText).toContain(text);
});

When('der Liegenschaftsverwalter das Akonto {string} löscht', async ({ verwalter }, amount: string) => {
	await verwalter.attemptsTo(deleteAdvance(amount));
});
