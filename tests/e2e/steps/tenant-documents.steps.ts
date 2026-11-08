import { createBdd } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { documentFor, documentsFor } from '../questions/documents';
import { downloadedFileMagic, downloadedFileName } from '../questions/download';
import {
	controlNamesOf,
	deleteDocumentConsequence,
	deleteOffersFor,
	deleteTenantConsequence,
	deliveryStatesOf,
	documentTitleEntered,
	chosenFile,
	deleteCancelContrast,
	deleteCancelDescription,
	deleteCancelUnavailable,
	deleteConfirmFocused,
	deleteConfirmStatus,
	deleteConfirmShown,
	dialogBusyNoteText,
	dialogText,
	documentsEmptyNote,
	duplicateFileWarning,
	duplicateFileWarnings,
	fileFieldDescription,
	listedDocuments,
	noDocumentsNote,
	tenantFilterFocused,
	uploadButtonBackground,
	uploadProgressShown,
	uploadButtonContrast,
	uploadButtonFocused,
	uploadButtonStatus
} from '../questions/tenant-documents';
import {
	chooseView,
	openDocuments,
	openDocumentsToSend,
	openTenantOf,
	showDocumentsByKeyboardOf,
	showDocumentsOf
} from '../tasks/documents';
import {
	cancelDeleting,
	chooseFile,
	confirmDeleting,
	deletingWaits,
	imageFile,
	openDocument,
	requestDocument,
	pdfFile,
	startDeletingDocument,
	uploadDocument,
	uploadsFail,
	uploadsWait,
	uploadWithoutFile,
	wordFile
} from '../tasks/tenant-documents';

const { Given, When, Then } = createBdd(test);

Given('{string} hat das hochgeladene Dokument {string}', async ({ seed }, tenant: string, title: string) => {
	await seed.upload(tenant, title);
});

Given('das Dokument {string} von {string} wurde inzwischen gelöscht', async ({ seed }, title: string, tenant: string) => {
	await seed.removeDocument(tenant, title);
});

Given('das Hochladen von Dokumenten zu {string} ist gestört', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(uploadsFail(seed.idOf(tenant)!));
});

When(
	/^der Liegenschaftsverwalter die PDF-Datei "([^"]+)" als "([^"]+)" (?:hochlädt|hochladen will)$/,
	async ({ verwalter }, file: string, title: string) => {
		await verwalter.attemptsTo(uploadDocument(pdfFile(file), title));
	}
);

When('der Liegenschaftsverwalter die PDF-Datei {string} ohne Titel hochlädt', async ({ verwalter }, file: string) => {
	await verwalter.attemptsTo(uploadDocument(pdfFile(file), ''));
});

When(
	'der Liegenschaftsverwalter eine PDF-Datei mit {int} MB als {string} hochladen will',
	async ({ verwalter }, megabytes: number, title: string) => {
		await verwalter.attemptsTo(uploadDocument(pdfFile('scan.pdf', megabytes * 1024 * 1024), title));
	}
);

When(
	'der Liegenschaftsverwalter die Word-Datei {string} als {string} hochladen will',
	async ({ verwalter }, file: string, title: string) => {
		await verwalter.attemptsTo(uploadDocument(wordFile(file), title));
	}
);

When('der Liegenschaftsverwalter das Foto {string} als {string} hochlädt', async ({ verwalter }, file: string, title: string) => {
	await verwalter.attemptsTo(uploadDocument(imageFile(file), title));
});

When('der Liegenschaftsverwalter das Dokument {string} löschen will', async ({ verwalter }, title: string) => {
	await verwalter.attemptsTo(startDeletingDocument(title));
});

When('der Liegenschaftsverwalter das Löschen bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmDeleting);
});

When('der Liegenschaftsverwalter alle Dokumente ansieht', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDocuments);
});

When('der Liegenschaftsverwalter die zu versendenden Dokumente ansieht', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDocumentsToSend);
});

Then('liegt beim Mieter das Dokument {string}, heute hochgeladen', async ({ verwalter }, title: string) => {
	await verwalter.sees(documentFor(title, '')).toContain(`Hochgeladen am ${swissDate(inDays(0))}`);
});

Then('hat das Dokument {string} keinen Versandstatus', async ({ verwalter }, title: string) => {
	await verwalter.sees(documentFor(title, '')).toContain(title);
	await verwalter.sees(deliveryStatesOf(title)).toBe(0);
});

// The first bytes of each kind, as Dwello checks them
const MAGIC: Record<string, string> = { PDF: '255044', JPG: 'ffd8ff' };

Then(
	/^öffnet das Dokument "([^"]+)" die (PDF|JPG)-Datei "([^"]+)"$/,
	async ({ verwalter }, title: string, kind: string, file: string) => {
		await verwalter.attemptsTo(openDocument(title));
		await verwalter.sees(downloadedFileName).toBe(file);
		await verwalter.sees(downloadedFileMagic).toBe(MAGIC[kind]);
	}
);

Then('steht als Titel des Dokuments weiterhin {string}', async ({ verwalter }, title: string) => {
	await verwalter.sees(documentTitleEntered).toBe(title);
});

Then('liegen beim Mieter noch keine Dokumente', async ({ verwalter }) => {
	await verwalter.sees(noDocumentsNote).toBe('Noch keine Dokumente.');
	await verwalter.sees(listedDocuments).toBe(0);
});

Then('sagt die Bestätigung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(deleteDocumentConsequence).toBe(text);
});

Then(
	'sagt die Bestätigung, dass {string} zusammen mit den hochgeladenen Dokumenten endgültig gelöscht wird',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter
			.sees(deleteTenantConsequence)
			.toBe(
				`${names.get(tenant)} wird endgültig gelöscht, zusammen mit den hochgeladenen Dokumenten. Das lässt sich nicht rückgängig machen.`
			);
	}
);

Then(
	'liegt das Dokument {string} zu {string}, heute hochgeladen, ohne Versandstatus vor',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter
			.sees(documentFor(title, names.get(tenant) ?? tenant))
			.toContain(`Zu ${names.get(tenant)}, hochgeladen am ${swissDate(inDays(0))}`);
		await verwalter.sees(deliveryStatesOf(title)).toBe(0);
	}
);

Then('kann der Liegenschaftsverwalter die {string} nicht löschen', async ({ verwalter }, title: string) => {
	await verwalter.sees(documentFor(title, '')).toContain(title);
	await verwalter.sees(deleteOffersFor(title)).toBe(0);
});

When('der Liegenschaftsverwalter das Dokument {string} herunterladen will', async ({ verwalter }, title: string) => {
	await verwalter.attemptsTo(requestDocument(title));
});

// #677 (Helga P-3, Marco P-5): two uploads of the same file differ in their time; the row names the file, on the tenant
// page («Hochgeladen am») and in «Dokumente» («Zu …, hochgeladen am»)
Then(
	'nennt das Dokument {string} die Datei {string} und die Uhrzeit, zu der es heute hochgeladen wurde',
	async ({ verwalter }, title: string, file: string) => {
		await verwalter
			.sees(documentFor(title, ''))
			.toMatch(new RegExp(`[Hh]ochgeladen am ${swissDate(inDays(0)).replaceAll('.', '\\.')} um \\d{2}:\\d{2}, Datei «${file.replaceAll('.', '\\.')}»`));
	}
);

When('der Liegenschaftsverwalter die PDF-Datei {string} zum Hochladen wählt', async ({ verwalter }, file: string) => {
	await verwalter.attemptsTo(chooseFile(pdfFile(file)));
});

Then(
	'warnt Dwello bei «Datei», dass die Datei {string} heute schon als Dokument {string} hochgeladen wurde',
	async ({ verwalter }, file: string, title: string) => {
		await verwalter
			.sees(duplicateFileWarning)
			.toBe(
				`Eine Datei «${file}» haben Sie schon am ${swissDate(inDays(0))} hochgeladen, als Dokument «${title}». Laden Sie sie nur hoch, wenn es eine neue Fassung ist.`
			);
	}
);

Then('liegen beim Mieter {int} Dokumente {string}', async ({ verwalter }, count: number, title: string) => {
	await verwalter.sees(documentsFor(title, '')).toBe(count);
});

// #677 (Anna P-4, Weber P-4): in «Dokumente» the tenant's name leads to the tenant, and a filter shows one tenant
When(
	'der Liegenschaftsverwalter beim Dokument {string} den Mieter {string} öffnet',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(openTenantOf(title, names.get(tenant) ?? tenant));
	}
);

When('der Liegenschaftsverwalter nur die Dokumente von {string} ansieht', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(showDocumentsOf(seed.idOf(tenant)!));
});

Then('liegt kein Dokument zu {string} vor', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(documentsFor('', `Zu ${names.get(tenant) ?? tenant},`)).toBe(0);
});

When('der Liegenschaftsverwalter die Ansicht {string} wählt', async ({ verwalter }, view: string) => {
	await verwalter.attemptsTo(chooseView(view as 'Alle' | 'Zu versenden'));
});

// #677 (V-3): only this tenant's uploads count; the chosen file beside the button is the positive anchor
Then('nennt Dwello bei «Datei» die gewählte Datei {string} ohne Warnung', async ({ verwalter }, file: string) => {
	await verwalter.sees(chosenFile).toBe(file);
	await verwalter.sees(duplicateFileWarnings).toBe(0);
});

// #677 (decisions 9, 10, persona Sven P-3): while Dwello sends, the busy button keeps the focus and says so
Given('Dwello antwortet beim Hochladen von Dokumenten zu {string} noch nicht', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(uploadsWait(seed.idOf(tenant)!));
});

Given('Dwello antwortet beim Löschen von Dokumenten zu {string} noch nicht', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(deletingWaits(seed.idOf(tenant)!));
});

// the status first: it speaks only while busy, so the focus is checked while the request waits
Then('sagt Dwello bei «Dokument hochladen» {string} an, und der Fokus bleibt dort', async ({ verwalter }, text: string) => {
	await verwalter.sees(uploadButtonStatus).toBe(text);
	await verwalter.sees(uploadButtonFocused).toBe(true);
});

Then('sagt Dwello bei «Dokument löschen» {string} an, und der Fokus bleibt dort', async ({ verwalter }, text: string) => {
	await verwalter.sees(deleteConfirmStatus).toBe(text);
	await verwalter.sees(deleteConfirmFocused).toBe(true);
});

// #1182 (persona Helga P-11): the label of the busy button, not the idle one: the status says it is busy
Then(
	'hebt sich {string} bei «Dokument hochladen» mindestens {float}:1 vom Hintergrund ab',
	async ({ verwalter }, text: string, minimum: number) => {
		await verwalter.sees(uploadButtonStatus).toBe(text);
		await verwalter.sees(uploadButtonContrast).toBeGreaterThanOrEqual(minimum);
	}
);

// #1209 (persona Helga P-1): the status first, so the sign is checked while the request waits
Then('zeigt «Dokument hochladen» mit {string} ein Fortschrittszeichen', async ({ verwalter }, text: string) => {
	await verwalter.sees(uploadButtonStatus).toBe(text);
	await verwalter.sees(uploadProgressShown).toBe(true);
});

// #1209 (persona Helga P-2): a disabled button fades to about 3:1; the cancel keeps the contrast of its normal look
Then(
	'hebt sich «Abbrechen» im Dialog mindestens {float}:1 vom Hintergrund ab, während Dwello {string} ansagt',
	async ({ verwalter }, minimum: number, text: string) => {
		await verwalter.sees(deleteConfirmStatus).toBe(text);
		await verwalter.sees(deleteCancelContrast).toBeGreaterThanOrEqual(minimum);
	}
);

// #1261 (Helga P-1, Sven P-1): the dialog says why «Abbrechen» does nothing
Then('sagt der Dialog während des Löschens {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(dialogBusyNoteText).toBe(text);
});

// the open dialog's confirm button first, so the missing sentence is not an error page
Then('sagt der Dialog vor dem Bestätigen noch nicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(deleteConfirmShown).toBe(true);
	await verwalter.sees(dialogText).not.toContain(text);
});

Then('liest ein Screenreader «Abbrechen» als nicht verfügbar vor, mit dem Satz {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(deleteCancelUnavailable).toBe('true');
	await verwalter.sees(deleteCancelDescription).toBe(text);
});

When('der Liegenschaftsverwalter im Dialog «Abbrechen» drückt', async ({ verwalter }) => {
	await verwalter.attemptsTo(cancelDeleting);
});

// `sunken`: the grey of a disabled field (docs/design/token-referenz.md)
Then('«Dokument hochladen» ist ausgegraut', async ({ verwalter }) => {
	await verwalter.sees(uploadButtonBackground).toBe('sunken');
});

When('der Liegenschaftsverwalter das Dokument {string} ohne Datei hochladen will', async ({ verwalter }, title: string) => {
	await verwalter.attemptsTo(uploadWithoutFile(title));
});

// #677 (persona Sven P-7): the error comes right after the field's name, the help after it
Then(
	'liest ein Screenreader bei «Datei» zuerst den Fehler {string} und danach den Hinweis {string} vor',
	async ({ verwalter }, error: string, help: string) => {
		const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		await verwalter.sees(fileFieldDescription).toMatch(new RegExp(`^${escaped(error)} .*${escaped(help)}`));
	}
);

// #677 (persona Sven S-1): a filter that applies on change keeps the focus, also when nothing is left to show
When('der Liegenschaftsverwalter im Filter «Mieter» mit der Tastatur {string} wählt', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(showDocumentsByKeyboardOf(seed.idOf(tenant)!));
});

Then('zeigt «Dokumente» {string}, und der Fokus bleibt im Filter «Mieter»', async ({ verwalter }, text: string) => {
	await verwalter.sees(documentsEmptyNote).toContain(text);
	await verwalter.sees(tenantFilterFocused).toBe(true);
});

// #1181 (Helga H-1, Sven S-4): two uploads of one tenant with the same title differ by a running number, in the row and
// in the names of its link and button (on «Dokumente» there is no delete button)
Then(
	/^heissen die Dokumente (?:beim Mieter|zu "([^"]+)") "([^"]+)" und "([^"]+)", auch auf ihren Schaltflächen$/,
	async ({ verwalter, names }, tenant: string | undefined, first: string, second: string) => {
		const tenantName = tenant ? (names.get(tenant) ?? tenant) : '';
		for (const title of [first, second]) {
			await verwalter.sees(documentsFor(title, tenantName)).toBe(1);
			await verwalter
				.sees(controlNamesOf(title, tenantName))
				.toEqual(tenant ? [`Datei herunterladen: ${title}`] : [`Datei herunterladen: ${title}`, `Löschen: ${title}`]);
		}
	}
);
