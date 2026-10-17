import { Text, Visibility } from '../screenplay/questions';
import { draftRestored, saveStatusLine } from '../targets/wizard';

// Wizard frame, shared by the contract and the statement wizard
export const restoredDraftText = Text.of(draftRestored);
export const restoredDraftShown = Visibility.of(draftRestored);
export const saveStatusText = Text.of(saveStatusLine);
