import { Checked, Text, Value } from '../screenplay/questions';
import {
	belegAmount,
	belegBilledNote,
	belegCategory,
	belegInvoiceNumber,
	belegMessage,
	belegSelected,
	belegUnsure,
	deleteBelegNote,
	discardMessage,
	keepOriginalHint,
	uploadResult
} from '../targets/invoice-upload';

export const proposedAmount = (fileName: string) => Value.of(belegAmount(fileName));
export const proposedInvoiceNumber = (fileName: string) => Value.of(belegInvoiceNumber(fileName));
export const unsureNote = (fileName: string, field: string) => Text.of(belegUnsure(fileName, field));
export const noteOnBeleg = (fileName: string) => Text.of(belegMessage(fileName));
export const belegChosenForCreating = (fileName: string) => Checked.of(belegSelected(fileName));
export const uploadOutcome = Text.of(uploadResult);
export const discardQuestion = Text.of(discardMessage);
export const belegNoteOnDelete = Text.of(deleteBelegNote);
export const proposedCategory = (fileName: string) => Value.chosenIn(belegCategory(fileName));
export const keepOriginalNote = Text.of(keepOriginalHint);
export const belegBilledWarning = Text.of(belegBilledNote);
