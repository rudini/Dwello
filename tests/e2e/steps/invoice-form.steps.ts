import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { inDays } from '../fixtures/dates';
import {
	billedWarningText,
	categoryLabelText,
	dateOutsidePeriodWarning,
	dateOutsidePeriodWarnings,
	invoiceDate,
	invoiceDateInWords,
	invoiceDateShown,
	markedAsUtilityCost,
	nonAllocableCategoryWarning,
	servicePeriodHelpText,
	utilityCostHelpText,
	utilityCostMarkable
} from '../questions/invoice-form';
import { amountOfListedInvoice, categoryOfListedInvoice } from '../questions/invoices';
import {
	chooseCategory,
	clearCategory,
	clearSupplier,
	correctAmount,
	correctInvoiceNumber,
	enterInvoiceDate,
	openInvoiceEdit,
	openNewInvoice,
	overrideCategory,
	recategorize,
	registerInvoice,
	saveInvoice,
	typeInvoiceDate
} from '../tasks/invoice-form';
import { searchInvoices } from '../tasks/invoices';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Rechnung"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewInvoice);
});

Given('die KI hat die Kategorie der Rechnung von {string} vorgeschlagen', async ({ seed }, supplier: string) => {
	await seed.kiSuggestion(supplier);
});

Given('der Liegenschaftsverwalter bearbeitet die Rechnung von {string}', async ({ verwalter, seed }, supplier: string) => {
	await verwalter.attemptsTo(openInvoiceEdit(seed.idOf(`Rechnung ${supplier}`)!));
});

When(
	'der Liegenschaftsverwalter die Rechnung von {string} über {string} Franken für {string} im Gebäude {string} in der Kategorie {string} erfasst',
	async ({ verwalter, seed }, supplier: string, amount: string, description: string, building: string, category: string) => {
		await verwalter.attemptsTo(
			registerInvoice({ buildingId: seed.idOf(building)!, supplier: seed.unique(supplier), amount, description, category })
		);
	}
);

When('der Liegenschaftsverwalter die Kategorie {string} wählt', async ({ verwalter }, category: string) => {
	await verwalter.attemptsTo(chooseCategory(category));
});

When('der Liegenschaftsverwalter die Rechnung ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveInvoice);
});

When('der Liegenschaftsverwalter den Betrag auf {string} Franken korrigiert', async ({ verwalter }, amount: string) => {
	await verwalter.attemptsTo(correctAmount(amount));
});

When('der Liegenschaftsverwalter die Rechnung der Kategorie {string} zuordnet', async ({ verwalter }, category: string) => {
	await verwalter.attemptsTo(recategorize(category));
});

When(
	'der Liegenschaftsverwalter die Rechnung mit dem Grund {string} der Kategorie {string} zuordnet',
	async ({ verwalter }, reason: string, category: string) => {
		await verwalter.attemptsTo(overrideCategory(category, reason));
	}
);

When('der Liegenschaftsverwalter die Rechnung ohne Rechnungssteller speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(clearSupplier);
});

Then(
	'die Rechnung von {string} über {string} in der Kategorie {string} ist auffindbar',
	async ({ verwalter, names }, supplier: string, amount: string, category: string) => {
		const name = names.get(supplier) ?? supplier;
		await verwalter.attemptsTo(searchInvoices(name));
		await verwalter.sees(amountOfListedInvoice(name)).toBe(amount);
		await verwalter.sees(categoryOfListedInvoice(name)).toBe(category);
	}
);

Then('ist die Rechnung nicht als umlagefähig markiert', async ({ verwalter }) => {
	await verwalter.sees(markedAsUtilityCost).toBe(false);
});

Then('lässt sich die Rechnung nicht als umlagefähig markieren', async ({ verwalter }) => {
	await verwalter.sees(utilityCostMarkable).toBe(false);
});

Then(
	'weist ein Hinweis darauf hin, dass die Kosten nicht auf die Mieter umgelegt werden können',
	async ({ verwalter }) => {
		await verwalter.sees(nonAllocableCategoryWarning).toContain('nicht auf Mieter umgelegt');
	}
);

When('der Liegenschaftsverwalter das Rechnungsdatum {string} einträgt', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(enterInvoiceDate(date));
});

Then(
	'warnt das Rechnungsformular, dass das Rechnungsdatum nicht in der Abrechnungsperiode {string} liegt',
	async ({ verwalter }, period: string) => {
		await verwalter
			.sees(dateOutsidePeriodWarning)
			.toContain(`Das Rechnungsdatum liegt nicht in der Abrechnungsperiode ${period}`);
	}
);

When('der Liegenschaftsverwalter als Rechnungsdatum {string} eintippt', async ({ verwalter }, text: string) => {
	await verwalter.attemptsTo(typeInvoiceDate(text));
});

Then('zeigt das Feld Rechnungsdatum {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(invoiceDate).toBe(text);
});

Then('steht unter dem Rechnungsdatum {string}', async ({ verwalter }, words: string) => {
	await verwalter.sees(invoiceDateInWords).toBe(words);
});

When('der Liegenschaftsverwalter die Rechnung von {string} bearbeitet', async ({ verwalter, seed }, supplier: string) => {
	await verwalter.attemptsTo(openInvoiceEdit(seed.idOf(`Rechnung ${supplier}`)!));
});

Then('warnt das Formular, dass es mit dieser Rechnung schon Abrechnungen gibt', async ({ verwalter }) => {
	await verwalter.sees(billedWarningText).toContain('gibt es schon Abrechnungen mit dieser Rechnung');
});

Then('ist das Rechnungsdatum leer, damit es bewusst gewählt wird', async ({ verwalter }) => {
	await verwalter.sees(invoiceDate).toBe('');
});

Then('warnt das Rechnungsformular nicht vor dem Rechnungsdatum', async ({ verwalter }) => {
	await verwalter.sees(invoiceDateShown).toBe(true); // the form is shown
	await verwalter.sees(dateOutsidePeriodWarnings).toBe(0);
});

When('der Liegenschaftsverwalter die Rechnungsnummer auf {string} korrigiert', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(correctInvoiceNumber(number));
});

Then('erklärt das Formular {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(utilityCostHelpText).toBe(text);
});

Then('erklärt das Formular beim Leistungszeitraum {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(servicePeriodHelpText).toContain(text);
});

When('der Liegenschaftsverwalter die Kategorie der Rechnung entfernt und speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(clearCategory);
});

// the statements of the year the invoice dated today is in, with number and status (#245, Dr. Weber P-5 of #233)
Then(
	'nennt die Warnung die Abrechnung des laufenden Jahres von {string} im Status {string}',
	async ({ verwalter, seed }, tenant: string, status: string) => {
		const number = await seed.statementNumber(tenant, Number(inDays(0).slice(0, 4)));
		await verwalter.sees(billedWarningText).toContain(`${number}, ${status}`);
	}
);

// the form names the field without «(optional)»: the Kategorie is required (#245, Helga P-5 of #233)
Then('ist die Kategorie im Formular keine freiwillige Angabe', async ({ verwalter }) => {
	await verwalter.sees(categoryLabelText).toBe('Kategorie');
});
