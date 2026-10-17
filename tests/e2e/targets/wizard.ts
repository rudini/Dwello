import { target } from '../screenplay/target';

// Wizard frame, shared by the contract and the statement wizard
export const nextButton = target('Weiter', (page) => page.getByTestId('wizard-next'));
export const finishedStep = (label: string) =>
	target(`Schritt «${label}»`, (page) => page.getByTestId('wizard-step').filter({ hasText: label }));
export const draftRestored = target('Hinweis Angaben wiederhergestellt', (page) => page.getByTestId('draft-restored'));
export const discardDraftButton = target('Angaben verwerfen', (page) => page.getByTestId('draft-discard'));
export const discardDraftMessage = target('Rückfrage Verwerfen', (page) => page.getByTestId('draft-discard-message'));
export const discardDraftConfirm = target('Verwerfen bestätigen', (page) => page.getByTestId('draft-discard-confirm'));
export const closeDraftNotice = target('Hinweis schliessen', (page) => page.getByTestId('draft-close'));
export const saveStatusLine = target('Speicherstatus', (page) => page.getByTestId('save-status'));
export const saveStatus = (text: string) =>
	target(`Speicherstatus «${text}»`, (page) => page.getByTestId('save-status').getByText(text));
