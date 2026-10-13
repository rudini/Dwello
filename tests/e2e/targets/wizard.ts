import { target } from '../screenplay/target';

// Wizard frame, shared by the contract and the statement wizard
export const nextButton = target('Weiter', (page) => page.getByTestId('wizard-next'));
export const finishedStep = (label: string) =>
	target(`Schritt «${label}»`, (page) => page.getByTestId('wizard-step').filter({ hasText: label }));
export const draftRestored = target('Hinweis Entwurf wiederhergestellt', (page) => page.getByTestId('draft-restored'));
export const discardDraftButton = target('Entwurf verwerfen', (page) => page.getByTestId('draft-discard'));
export const saveStatus = (text: string) =>
	target(`Speicherstatus «${text}»`, (page) => page.getByTestId('save-status').getByText(text));
