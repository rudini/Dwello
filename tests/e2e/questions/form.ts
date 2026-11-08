import { Text, Visibility } from '../screenplay/questions';
import { dialogActionButtons, formError, formErrors } from '../targets/form';

export const errorMessageShown = (text: string) => Visibility.of(formError(text));
export const errorMessage = Text.of(formErrors);
// the labels of the buttons that end the open dialog, in page order
export const dialogActions = Text.ofAll(dialogActionButtons);
