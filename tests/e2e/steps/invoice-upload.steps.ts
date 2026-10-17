import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	belegChosenForCreating,
	belegHowTo,
	billedAdviceOnDelete,
	createButtonLabel,
	createdInvoiceNames,
	hintsOfUpload,
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
	proposedInvoiceNumber,
	unsureNote,
	uploadOutcome
} from '../questions/invoice-upload';
import {
	chooseCategory,
	confirmCancelling,
	createInvoices,
	creatingFails,
	extractionFails,
	fillInBeleg,
	invoicePdf,
	invoicePhoto,
	openBeleg,
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

// the row's note is there (its first check), it only lacks this sentence
Then('sagt die Datei von {string} nicht {string}', async ({ verwalter, names }, supplier: string, text: string) => {
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).not.toBeNull();
	await verwalter.sees(noteOnBeleg(names.get(supplier)!)).not.toContain(text);
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
