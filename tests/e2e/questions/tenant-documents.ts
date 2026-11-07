import { Accessible, Colour, Count, HoldsFocus, Text, Value } from '../screenplay/questions';
import {
	chosenDocumentFile,
	deleteDocumentButton,
	deleteDocumentConfirm,
	deleteDocumentStatus,
	documentFileInput,
	documentsEmpty,
	documentsTenantFilter,
	deleteDocumentMessage,
	deleteTenantMessage,
	documentRow,
	documentStatus,
	documentTitleInput,
	duplicateFileNote,
	noDocumentsHint,
	uploadDocumentButton,
	uploadDocumentStatus
} from '../targets/documents';

export const documentTitleEntered = Value.of(documentTitleInput);
export const noDocumentsNote = Text.of(noDocumentsHint);
export const listedDocuments = Count.of(documentRow(''));
export const deliveryStatesOf = (title: string) => Count.of(documentStatus(title));
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
export const deleteConfirmFocused = HoldsFocus.of(deleteDocumentConfirm);
export const deleteConfirmStatus = Text.of(deleteDocumentStatus);
// #677 (persona Sven P-7): what a screen reader says at the file field after its name
export const fileFieldDescription = Accessible.descriptionOf(documentFileInput);
// #677 (persona Sven S-1): in «Dokumente»
export const tenantFilterFocused = HoldsFocus.of(documentsTenantFilter);
export const documentsEmptyNote = Text.of(documentsEmpty);
