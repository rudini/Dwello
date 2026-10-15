import type { Activity } from '../screenplay/actor';
import { Click, EnterDate, Enter, FailRequests, Select, Upload, Wait } from '../screenplay/interactions';
import { deleteButton } from '../targets/invoice-detail';
import {
	belegBillingEntity,
	belegDescription,
	belegDetailsToggle,
	belegFileInput,
	belegAmount,
	belegInvoiceDate,
	belegRow,
	belegUploadButton,
	cancelUploadButton,
	createInvoicesButton,
	discardConfirm,
	uploadBuildingSelect,
	uploadFileInput,
	uploadInvoicesButton
} from '../targets/invoice-upload';
import type { File } from './tenant-documents';

/** A one-page PDF a viewer can open, with its cross-reference table at the right offsets */
export function invoicePdf(name: string): File {
	const text = 'BT /F1 24 Tf 72 760 Td (Rechnung) Tj ET';
	const objects = [
		'<< /Type /Catalog /Pages 2 0 R >>',
		'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
		`<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
	];
	let pdf = '%PDF-1.4\n';
	const offsets = objects.map((body, i) => {
		const offset = pdf.length;
		pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
		return offset;
	});
	const xref = pdf.length;
	pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
	pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
	return { name, mimeType: 'application/pdf', buffer: Buffer.from(pdf, 'latin1') };
}

/** Opens the dialog on the invoice list, chooses the building and adds the files */
export const uploadBelege = (buildingId: string, files: File[]): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(uploadInvoicesButton),
		Select.option(buildingId).from(uploadBuildingSelect),
		Upload.theFile(files).into(uploadFileInput)
	);

export const openBeleg = (fileName: string) => Click.on(belegDetailsToggle(fileName));

export const fillInBeleg = (
	fileName: string,
	invoice: { billingEntity: string; description: string; amount: string; invoiceDate: string }
): Activity => (actor) =>
	actor.attemptsTo(
		Wait.until(belegRow(fileName)),
		openBeleg(fileName),
		Enter.theValue(invoice.billingEntity).into(belegBillingEntity(fileName)),
		Enter.theValue(invoice.description).into(belegDescription(fileName)),
		Enter.theValue(invoice.amount).into(belegAmount(fileName)),
		EnterDate.of(invoice.invoiceDate).into(belegInvoiceDate(fileName))
	);

export const createInvoices = Click.on(createInvoicesButton);
export const startCancellingUpload = Click.on(cancelUploadButton);
export const confirmCancelling = Click.on(discardConfirm);

// The BFF endpoints the dialog calls, answered with an error
export const extractionFails = FailRequests.to('/api/invoices/extract', {});
export const creatingFails = FailRequests.to('/api/invoices', {});

export const replaceBeleg = (file: File): Activity => (actor) =>
	actor.attemptsTo(Upload.theFile(file).into(belegFileInput), Click.on(belegUploadButton));

export const startDeletingInvoice = Click.on(deleteButton);
