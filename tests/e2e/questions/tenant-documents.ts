import { Accessible, Attribute, Colour, Count, Enabled, HoldsFocus, Text, Value, Visibility } from '../screenplay/questions';
import {
	chosenDocumentFile,
	deleteDocumentButton,
	deleteDocumentCancel,
	dialogBusyNote,
	openDialog,
	deleteDocumentConfirm,
	deleteDocumentStatus,
	documentFileButton,
	documentFileInput,
	documentsEmpty,
	documentsTenantFilter,
	deleteDocumentMessage,
	deleteTenantMessage,
	documentRow,
	documentRowControls,
	documentStatus,
	documentTitleInput,
	duplicateFileNote,
	noDocumentsHint,
	uploadDocumentButton,
	uploadDocumentProgress,
	uploadDocumentStatus
} from '../targets/documents';

export const documentTitleEntered = Value.of(documentTitleInput);
export const noDocumentsNote = Text.of(noDocumentsHint);
export const listedDocuments = Count.of(documentRow(''));
export const deliveryStatesOf = (title: string) => Count.of(documentStatus(title));
export const controlNamesOf = (title: string, tenantName = '') =>
	Attribute.named('aria-label').ofAll(documentRowControls(title, tenantName));
export const deleteOffersFor = (title: string) => Count.of(deleteDocumentButton(title));
export const deleteTenantConsequence = Text.of(deleteTenantMessage);
export const deleteDocumentConsequence = Text.of(deleteDocumentMessage);
export const duplicateFileWarning = Text.of(duplicateFileNote);
export const chosenFile = Text.of(chosenDocumentFile);
export const duplicateFileWarnings = Count.of(duplicateFileNote);
// #677 (decisions 9, 10): a busy button keeps the focus and says what it does
export const uploadButtonFocused = HoldsFocus.of(uploadDocumentButton);
export const uploadButtonStatus = Text.of(uploadDocumentStatus);
// #1182 (persona Helga P-11): a busy button stays readable and looks like a disabled field
export const uploadButtonContrast = Colour.contrastOf(uploadDocumentButton);
export const uploadButtonBackground = Colour.backgroundOf(uploadDocumentButton, ['sunken', 'surface', 'accent', 'critical']);
// #1209 (persona Helga P-1, P-2): the progress sign shows, and the cancel beside the busy button keeps its look
export const uploadProgressShown = Visibility.of(uploadDocumentProgress);
export const deleteCancelContrast = Colour.contrastOf(deleteDocumentCancel);
// #1261 (Sven P-1): a screen reader hears «Abbrechen» as unavailable, with the reason
export const dialogBusyNoteText = Text.of(dialogBusyNote);
export const deleteConfirmShown = Visibility.of(deleteDocumentConfirm);
export const dialogText = Text.of(openDialog);
export const deleteCancelUnavailable = Attribute.named('aria-disabled').of(deleteDocumentCancel);
export const deleteCancelDescription = Accessible.descriptionOf(deleteDocumentCancel);
export const deleteConfirmFocused = HoldsFocus.of(deleteDocumentConfirm);
export const deleteConfirmStatus = Text.of(deleteDocumentStatus);
// #677 (persona Sven P-7): what a screen reader says at the file field after its name
export const fileFieldDescription = Accessible.descriptionOf(documentFileInput);
// #677 (persona Sven S-1): in «Dokumente»
export const tenantFilterFocused = HoldsFocus.of(documentsTenantFilter);
export const documentsEmptyNote = Text.of(documentsEmpty);
// #1262 (persona Sven P-3, Helga): while an upload runs its fields take no change, for the eye and the screen reader
export const fileFieldChangeable = Enabled.of(documentFileInput);
export const titleFieldChangeable = Enabled.of(documentTitleInput);
export const fileButtonBackground = Colour.backgroundOf(documentFileButton, ['sunken', 'surface']);
export const titleFieldBackground = Colour.backgroundOf(documentTitleInput, ['sunken', 'surface']);
