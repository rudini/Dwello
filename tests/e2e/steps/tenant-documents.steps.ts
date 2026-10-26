import { createBdd } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { documentFor } from '../questions/documents';
import { downloadedFileMagic, downloadedFileName } from '../questions/download';
import {
	deleteDocumentConsequence,
	deleteOffersFor,
	deleteTenantConsequence,
	deliveryStatesOf,
	documentTitleEntered,
	listedDocuments,
	noDocumentsNote
} from '../questions/tenant-documents';
import { openDocuments, openDocumentsToSend } from '../tasks/documents';
import {
	confirmDeleting,
	imageFile,
	openDocument,
	pdfFile,
	startDeletingDocument,
	uploadDocument,
	uploadsFail,
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
