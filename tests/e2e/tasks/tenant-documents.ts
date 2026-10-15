import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, FailRequests, Upload } from '../screenplay/interactions';
import { deleteConfirmButton } from '../targets/form';
import {
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
// A photo as phones save it: the JPEG start of image marker
export const imageFile = (name: string): File => ({
	name,
	mimeType: 'image/jpeg',
	buffer: Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(1024)])
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

export const startDeletingDocument = (title: string) => Click.on(deleteDocumentButton(title));
// the open delete dialog, of a document or of the tenant
export const confirmDeleting = Click.on(deleteConfirmButton);

export const openDocument = (title: string) => DownloadFrom(openDocumentLink(title));

// The page's form action that stores the upload answers with an error
export const uploadsFail = (tenantId: string) => FailRequests.to(`/tenants/${tenantId}`, { '/upload': '' });
