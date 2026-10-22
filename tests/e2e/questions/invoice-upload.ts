import { question } from '../screenplay/actor';
import { Checked, OpenedFile, Text, Value, Visibility } from '../screenplay/questions';
import {
	belegAmount,
	belegRow,
	belegDeductedRule,
	belegDistributionKey,
	belegHow,
	belegUploadHints,
	createInvoicesButton,
	createdInvoiceLinks,
	deleteBilledNote,
	deleteBilledText,
	belegBilledNote,
	belegCategory,
	belegInvoiceNumber,
	belegMessage,
	belegSelected,
	belegSelectedHelp,
	belegUnsure,
	deleteBelegNote,
	discardConfirm,
	discardMessage,
	keepOriginalHint,
	uploadBuildingSelect,
	uploadFileChoose,
	uploadPurpose,
	uploadResult,
	uploadStatus
} from '../targets/invoice-upload';

export const uploadPurposeText = Text.of(uploadPurpose);
export const belegRowText = (fileName: string) => Text.of(belegRow(fileName));
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
export const deductedRuleOnBeleg = (fileName: string) => Text.of(belegDeductedRule(fileName));
export const fileChooserLabel = Text.of(uploadFileChoose);
// what the Beleg card says from the upload, empty without a hint
export const hintsOfUploadOrNone = question('the hints from the upload at the Beleg', async (actor) => (await actor.answer(hintsOfUpload)) ?? '');
export const proposedKey = (fileName: string) => Value.chosenIn(belegDistributionKey(fileName));
export const billedRuleOnDelete = Text.of(deleteBilledText);
export const whyBelegSelectedOrNot = (fileName: string) => Text.of(belegSelectedHelp(fileName));
export const discardButtonLabel = Text.of(discardConfirm);
