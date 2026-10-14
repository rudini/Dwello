import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, FailRequests, Upload } from '../screenplay/interactions';
import {
	confirmDeleteDocumentButton,
	deleteDocumentButton,
	documentFileInput,
	documentTitleInput,
	openDocumentLink,
	uploadDocumentButton
} from '../targets/documents';

export type File = { name: string; mimeType: string; buffer: Buffer };

// A PDF as scanners write it: the header Dwello checks, then content of the given size
export const pdfFile = (name: string, bytes = 1024): File => ({
	name,
	mimeType: 'application/pdf',
	buffer: Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(bytes)])
});
// A Word file starts like any zip archive
export const wordFile = (name: string): File => ({
	name,
	mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	buffer: Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(1024)])
});

export const uploadDocument = (file: File, title: string): Activity => (actor) =>
	actor.attemptsTo(
		Upload.theFile(file).into(documentFileInput),
		Enter.theValue(title).into(documentTitleInput),
		Click.on(uploadDocumentButton)
	);

export const deleteDocument = (title: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(deleteDocumentButton(title)), Click.on(confirmDeleteDocumentButton));

export const openDocument = (title: string) => DownloadFrom(openDocumentLink(title));

// The page's form action that stores the upload answers with an error
export const uploadsFail = (tenantId: string) => FailRequests.to(`/tenants/${tenantId}`, { '/upload': '' });
