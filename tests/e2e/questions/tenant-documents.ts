import { Count, Text, Value } from '../screenplay/questions';
import {
	deleteDocumentButton,
	deleteDocumentMessage,
	deleteTenantMessage,
	documentRow,
	documentStatus,
	documentTitleInput,
	noDocumentsHint
} from '../targets/documents';

export const documentTitleEntered = Value.of(documentTitleInput);
export const noDocumentsNote = Text.of(noDocumentsHint);
export const listedDocuments = Count.of(documentRow(''));
export const deliveryStatesOf = (title: string) => Count.of(documentStatus(title));
export const deleteOffersFor = (title: string) => Count.of(deleteDocumentButton(title));
export const deleteTenantConsequence = Text.of(deleteTenantMessage);
export const deleteDocumentConsequence = Text.of(deleteDocumentMessage);
