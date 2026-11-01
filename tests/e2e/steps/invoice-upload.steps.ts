import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	belegChosenForCreating,
	belegToggleText,
	discardButtonLabel,
	whyBelegSelectedOrNot,
	deductedRuleOnBeleg,
	fileChooserLabel,
	belegHowTo,
	billedAdviceOnDelete,
	billedRuleOnDelete,
	createButtonLabel,
	createdInvoiceNames,
	recordRestHref,
	hintsOfUpload,
	hintsOfUploadOrNone,
	uploadDialogShown,
	uploadState,
	belegShown,
	openedBelegMagic,
	openedBelegName,
	belegBilledWarning,
	belegNoteOnDelete,
	keepOriginalNote,
	proposedCategory,
	discardQuestion,
	noteOnBeleg,
	proposedAmount,
	proposedKey,
	proposedInvoiceNumber,
	unsureNote,
	uploadOutcome
} from '../questions/invoice-upload';
import {
	chooseCategory,
	chooseKey,
	chooseForCreating,
	escapeFromCategory,
	openUploadDialog,
	confirmCancelling,
	createInvoices,
	creatingFails,
	extractionFails,
	fillInBeleg,
	invoicePdf,
	invoicePhoto,
	openBeleg,
	openBelegOnce,
	openBelegOnceRead,
	openBelegOfInvoice,
	openFileLarge,
	removeFile,
	replaceBeleg,
	startCancellingUpload,
	startDeletingInvoice,
	uploadBelege
} from '../tasks/invoice-upload';
import { imageFile, wordFile } from '../tasks/tenant-documents';
import { confirmation } from '../questions/contract-form';

const { Given, When, Then } = createBdd(test);

// The file of a supplier's invoice is named after the supplier: the KI stand-in reads the supplier from the name
// (backend/scripts/llm-stub.ts), and a scenario's suppliers are its own
const supplierName = (names: Map<string, string>, unique: (title: string) => string, supplier: string) =>
	names.get(supplier) ?? unique(supplier);
const pdfOf = (supplier: string) => `${supplier}.pdf`;

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die PDF-Rechnung von {string} und das Foto der Rechnung von {string} hochlädt',
	async ({ verwalter, seed, names }, building: string, first: string, second: string) => {
		const files = [
			invoicePdf(pdfOf(supplierName(names, seed.unique, first))),
			invoicePhoto(`${supplierName(names, seed.unique, second)}.png`)
		];
		await verwalter.attemptsTo(uploadBelege(seed.idOf(building)!, files));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die PDF-Rechnung von {string} und die Word-Datei {string} hochlädt',
	async ({ verwalter, seed, names }, building: string, supplier: string, word: string) => {
		const files = [invoicePdf(pdfOf(supplierName(names, seed.unique, supplier))), wordFile(word)];
		await verwalter.attemptsTo(uploadBelege(seed.idOf(building)!, files));
	}
);

// The stand-in fails for a file named «… ohne KI» and answers no JSON for «… unlesbar» (backend/scripts/llm-stub.ts)
const KI_FILE_SUFFIX: Record<string, string> = { 'nicht verfügbar ist': ' ohne KI', 'nichts Lesbares antwortet': ' unlesbar' };

When(
	/^der Liegenschaftsverwalter für das Gebäude "([^"]+)" die PDF-Rechnung von "([^"]+)" hochlädt(?:, während die KI (nicht verfügbar ist|nichts Lesbares antwortet))?$/,
	async ({ verwalter, seed, names }, building: string, supplier: string, how?: string) => {
		const name = supplierName(names, seed.unique, supplier);
		const file = how ? `${name}${KI_FILE_SUFFIX[how]}.pdf` : pdfOf(name);
		await verwalter.attemptsTo(uploadBelege(seed.idOf(building)!, [invoicePdf(file)]));
	}
);

When(
	'der Liegenschaftsverwalter bei der Datei den Rechnungssteller {string}, die Beschreibung {string}, den Betrag {string} und das Rechnungsdatum {string} erfasst',
	async ({ verwalter, names }, supplier: string, description: string, amount: string, invoiceDate: string) => {
		await verwalter.attemptsTo(
			fillInBeleg(names.get(supplier)!, { billingEntity: supplier, description, amount, invoiceDate })
		);
	}
);

When('der Liegenschaftsverwalter die Rechnungen erstellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(createInvoices);
});

When('der Liegenschaftsverwalter das Hochladen abbrechen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startCancellingUpload);
});

When('der Liegenschaftsverwalter das Abbrechen bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmCancelling);
});

Given('das Auslesen von Dateien ist gestört', async ({ verwalter }) => {
	await verwalter.attemptsTo(extractionFails);
});

Given('das Erstellen von Rechnungen ist gestört', async ({ verwalter }) => {
	await verwalter.attemptsTo(creatingFails);
});

Given('die Rechnung von {string} hat die Rechnungsnummer {string}', async ({ seed }, supplier: string, number: string) => {
	await seed.invoiceNumber(supplier, number);
});

Given('die Rechnung von {string} hat den Beleg {string}', async ({ seed }, supplier: string, fileName: string) => {
	await seed.beleg(supplier, fileName);
});

When(
	/^der Liegenschaftsverwalter (?:den Beleg durch das Foto "([^"]+)" ersetzt|das Foto "([^"]+)" als Beleg hinzufügt)$/,
	async ({ verwalter }, replacing?: string, adding?: string) => {
		const fileName = (replacing ?? adding)!;
		await verwalter.attemptsTo(replaceBeleg(imageFile(fileName)));
		// saved only with the confirmation: a Beleg opened before still is the old one (#226, CI of #242)
		await verwalter.sees(confirmation).toContain(`Beleg ${fileName} gespeichert`);
	}
);

When(
	'der Liegenschaftsverwalter bei der Datei von {string} die Kategorie {string} wählt',
	async ({ verwalter, names }, supplier: string, category: string) => {
		await verwalter.attemptsTo(chooseCategory(names.get(supplier)!, category));
	}
);

When(
	'der Liegenschaftsverwalter bei der Datei von {string} den Verteilschlüssel {string} wählt',
	async ({ verwalter, names }, supplier: string, key: string) => {
		await verwalter.attemptsTo(chooseKey(names.get(supplier)!, key));
	}
);

When('der Liegenschaftsverwalter die Rechnung löschen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startDeletingInvoice);
});

Then(
	'schlägt die KI für die Rechnung von {string} den Betrag {string}, die Rechnungsnummer {string} und die Kategorie {string} vor',
	async ({ verwalter, names }, supplier: string, amount: string, number: string, category: string) => {
		const file = pdfOf(names.get(supplier)!);
		await verwalter.attemptsTo(openBeleg(file));
		await verwalter.sees(proposedAmount(file)).toBe(amount);
		await verwalter.sees(proposedInvoiceNumber(file)).toBe(number);
		await verwalter.sees(proposedCategory(file)).toBe(category);
	}
);

Then(
	'schlägt die KI nach dem langen Lesen für die Rechnung von {string} den Betrag {string} vor',
	async ({ verwalter, names, $testInfo }, supplier: string, amount: string) => {
		$testInfo.setTimeout(120_000); // the stand-in reads for 35 s
		const file = pdfOf(names.get(supplier)!);
		await verwalter.attemptsTo(openBelegOnceRead(file, 90_000));
		await verwalter.sees(proposedAmount(file)).toBe(amount);
	}
);

Then(
	'ist bei der Rechnung von {string} das Rechnungsdatum als unsicher markiert',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.sees(unsureNote(pdfOf(names.get(supplier)!), 'invoiceDate')).toContain('unsicher');
	}
);

Then('sagt Dwello {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(uploadOutcome).toContain(text);
});

Then('sagt die Datei {string} {string}', async ({ verwalter }, fileName: string, text: string) => {
	await verwalter.sees(noteOnBeleg(fileName)).toContain(text);
});

Then('sagt die Datei von {string} {string}', async ({ verwalter, names }, supplier: string, text: string) => {
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).toContain(text);
});

// #760: a file nobody read opens its empty fields to enter (code review 760 C-3)
Then('bietet die Datei von {string} {string} an', async ({ verwalter, names }, supplier: string, label: string) => {
	await verwalter.sees(belegToggleText(names.get(supplier)!)).toBe(label);
});

// the row's note is there (its first check), it only lacks this sentence
Then('sagt die Datei von {string} nicht {string}', async ({ verwalter, names }, supplier: string, text: string) => {
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).not.toBeNull();
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).not.toContain(text);
});

// nothing left to do, also not «Füllen Sie die markierten Felder aus.» of the last attempt (#548)
Then('hat die Datei von {string} keinen Hinweis mehr', async ({ verwalter, names }, supplier: string) => {
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).toBeNull();
});

Then('ist die Datei von {string} nicht zum Erstellen ausgewählt', async ({ verwalter, names }, supplier: string) => {
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).not.toBeNull();
	await verwalter.sees(belegChosenForCreating(names.get(supplier)!)).toBe(false);
});

Then('fragt Dwello zurück {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(discardQuestion).toContain(text);
});

Then('öffnet der Beleg die PDF-Rechnung von {string}', async ({ verwalter, names }, supplier: string) => {
	await verwalter.attemptsTo(openBelegOfInvoice);
	await verwalter.sees(belegShown).toBe(true);
	await verwalter.sees(openedBelegName).toBe(pdfOf(names.get(supplier)!));
});

// The first bytes of each kind, as Dwello checks them
const MAGIC: Record<string, string> = { PDF: '255044', JPG: 'ffd8ff' };

Then(/^öffnet der Beleg die (PDF|JPG)-Datei "([^"]+)"$/, async ({ verwalter }, kind: string, fileName: string) => {
	await verwalter.attemptsTo(openBelegOfInvoice);
	await verwalter.sees(belegShown).toBe(true);
	await verwalter.sees(openedBelegName).toBe(fileName);
	await verwalter.sees(openedBelegMagic).toBe(MAGIC[kind]);
});

for (const step of ['erinnert Dwello daran, die Originalrechnungen aufzubewahren', 'erinnert Dwello daran, die Originalrechnung aufzubewahren'])
	Then(step, async ({ verwalter }) => {
		await verwalter.sees(keepOriginalNote).toContain('Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.');
	});

Then('warnt der Beleg {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(belegBilledWarning).toContain(text);
});

Then('sagt die Bestätigung zum Löschen der Rechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(belegNoteOnDelete).toBe(text);
});

When(
	'der Liegenschaftsverwalter für das Gebäude {string} die PDF-Rechnungen von {string} und {string} hochlädt',
	async ({ verwalter, seed, names }, building: string, first: string, second: string) => {
		const files = [first, second].map((supplier) => invoicePdf(pdfOf(supplierName(names, seed.unique, supplier))));
		await verwalter.attemptsTo(uploadBelege(seed.idOf(building)!, files));
	}
);

Then('kann der Liegenschaftsverwalter das Gebäude und die Dateien der Rechnungen wählen', async ({ verwalter }) => {
	await verwalter.sees(uploadDialogShown).toBe(true);
});

Then('erklärt Dwello {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(keepOriginalNote).toContain(text);
});

Then('bietet Dwello {string} an', async ({ verwalter }, label: string) => {
	await verwalter.sees(createButtonLabel).toBe(label);
});

Then('führt Dwello von dort zum Erfassen einer Rechnung', async ({ verwalter }) => {
	await verwalter.sees(recordRestHref).toBe('/invoices/new');
});

Then('nennt Dwello die Datei von {string} als noch offen', async ({ verwalter, names }, supplier: string) => {
	await verwalter.sees(uploadOutcome).toContain(pdfOf(names.get(supplier)!));
});

Then(
	'verlinkt Dwello die erstellte Rechnung von {string} vom {string}',
	async ({ verwalter, names }, supplier: string, date: string) => {
		await verwalter.sees(createdInvoiceNames).toContain(`${names.get(supplier)}, ${date}`);
	}
);

Then('erinnert der Beleg {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(hintsOfUpload).toContain(text);
});

Then('erklärt der Beleg {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(belegHowTo).toContain(text);
});

Then('rät die Bestätigung zum Löschen der Rechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(billedAdviceOnDelete).toBe(text);
});

Then('meldet Dwello {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(uploadState).toBe(text);
});

When('der Liegenschaftsverwalter die Datei {string} entfernt', async ({ verwalter }, fileName: string) => {
	await verwalter.attemptsTo(removeFile(fileName));
});

When('der Liegenschaftsverwalter die Datei von {string} gross ansieht', async ({ verwalter, names }, supplier: string) => {
	await verwalter.attemptsTo(openFileLarge(pdfOf(names.get(supplier)!)));
});

Then('zeigt ein neuer Tab die Datei als PDF', async ({ verwalter }) => {
	await verwalter.sees(belegShown).toBe(true);
	await verwalter.sees(openedBelegMagic).toBe(MAGIC.PDF);
});

Then(
	'erklärt der Hinweis zu den Akontorechnungen von {string} {string}',
	async ({ verwalter, names }, supplier: string, text: string) => {
		await verwalter.sees(deductedRuleOnBeleg(pdfOf(names.get(supplier)!))).toBe(text);
	}
);

When('der Liegenschaftsverwalter die Datei von {string} zum Erstellen auswählt', async ({ verwalter, names }, supplier: string) => {
	await verwalter.attemptsTo(chooseForCreating(pdfOf(names.get(supplier)!)));
});

When('der Liegenschaftsverwalter das Hochladen von Rechnungen öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openUploadDialog);
});

Then('bietet der Dialog die Dateien mit {string} zur Auswahl an', async ({ verwalter }, label: string) => {
	await verwalter.sees(fileChooserLabel).toBe(label);
});

When(
	'der Liegenschaftsverwalter die Auswahl der Kategorie bei der Datei von {string} mit Escape schliesst',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.attemptsTo(escapeFromCategory(pdfOf(names.get(supplier)!)));
	}
);

// the dialog is still open (its first check), and asks nothing
Then('fragt Dwello nicht, ob das Hochladen abgebrochen werden soll', async ({ verwalter }) => {
	await verwalter.sees(uploadDialogShown).toBe(true);
	await verwalter.sees(discardQuestion).toBeNull();
});

// after the hint at the Betrag (its first check): the Beleg card no longer holds it (#455, domain review V-7)
Then('erinnert der Beleg nicht an abgezogene Akontorechnungen', async ({ verwalter }) => {
	await verwalter.sees(hintsOfUploadOrNone).not.toContain('Akontorechnungen');
});

// the key of the building's invoices of the Kategorie the KI chose (#455, #268)
Then(
	'schlägt Dwello bei der Datei von {string} den Verteilschlüssel {string} vor',
	async ({ verwalter, names }, supplier: string, key: string) => {
		const file = pdfOf(names.get(supplier)!);
		await verwalter.attemptsTo(openBelegOnce(file));
		await verwalter.sees(proposedKey(file)).toBe(key);
	}
);

// what to do before deleting an invoice in a statement (#455, Dr. Weber P-6, P-7)
Then('sagt die Bestätigung zum Löschen einer abgerechneten Rechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(billedRuleOnDelete).toContain(text);
});

Then('erklärt die Auswahl der Datei von {string} {string}', async ({ verwalter, names }, supplier: string, text: string) => {
	await verwalter.sees(whyBelegSelectedOrNot(pdfOf(names.get(supplier)!))).toBe(text);
});

// the file still open with its reason (#245, Anna P-1 of #233)
Then(
	'nennt Dwello die Datei von {string} als noch offen, weil {string}',
	async ({ verwalter, names }, supplier: string, reason: string) => {
		await verwalter.sees(uploadOutcome).toContain(`${pdfOf(names.get(supplier)!)}: ${reason}`);
	}
);

Then('bietet Dwello zum Verwerfen {string} an', async ({ verwalter }, label: string) => {
	await verwalter.sees(discardButtonLabel).toBe(label);
});

// after the anchor (the row's note): the help at the checkbox is gone
Then('erklärt die Auswahl der Datei von {string} nichts mehr', async ({ verwalter, names }, supplier: string) => {
	await verwalter.sees(noteOnBeleg(pdfOf(names.get(supplier)!))).not.toBeNull();
	await verwalter.sees(whyBelegSelectedOrNot(pdfOf(names.get(supplier)!))).toBeNull();
});
