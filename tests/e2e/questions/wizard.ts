import { Text, Visibility, Width } from '../screenplay/questions';
import { currentStepName, draftRestored, saveStatusLine } from '../targets/wizard';

// Wizard frame, shared by the contract and the statement wizard
export const restoredDraftText = Text.of(draftRestored);
export const restoredDraftShown = Visibility.of(draftRestored);
export const saveStatusText = Text.of(saveStatusLine);
// #673: a name hidden for screen readers only (sr-only) is one pixel wide
export const currentStepNameText = Text.of(currentStepName);
export const currentStepNameWidth = Width.of(currentStepName);
