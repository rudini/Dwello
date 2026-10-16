import { question } from '../screenplay/actor';
import { Checked, OpenedFile, Text, Value, Visibility } from '../screenplay/questions';
import {
	belegAmount,
	belegHow,
	belegUploadHints,
	createInvoicesButton,
	createdInvoiceLinks,
	deleteBilledNote,
	belegBilledNote,
	belegCategory,
	belegInvoiceNumber,
	belegMessage,
	belegSelected,
	belegUnsure,
	deleteBelegNote,
	discardMessage,
	keepOriginalHint,
	uploadBuildingSelect,
	uploadResult,
	uploadStatus
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

// The Beleg the actor opened: shown in the browser (not saved), its name, and its first three bytes in hex
export const belegShown = question('whether the Beleg was shown', async (actor) => (await actor.answer(OpenedFile)).shown);
export const openedBelegName = question('the name of the opened Beleg', async (actor) => (await actor.answer(OpenedFile)).name);
export const openedBelegMagic = question('the kind of the opened Beleg', async (actor) =>
	(await actor.answer(OpenedFile)).content.subarray(0, 3).toString('hex')
);
export const createdInvoiceNames = Text.ofAll(createdInvoiceLinks);
export const createButtonLabel = Text.of(createInvoicesButton);
export const belegHowTo = Text.of(belegHow);
export const hintsOfUpload = Text.of(belegUploadHints);
export const billedAdviceOnDelete = Text.of(deleteBilledNote);
export const uploadDialogShown = Visibility.of(uploadBuildingSelect);
export const uploadState = Text.of(uploadStatus);
