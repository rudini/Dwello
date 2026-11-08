import { Accessible, Text, Value, Visibility } from '../screenplay/questions';
import { dialogActionButtons, dialogTitle, fieldLabelled, formError, formErrors } from '../targets/form';

export const errorMessageShown = (text: string) => Visibility.of(formError(text));
export const errorMessage = Text.of(formErrors);
// the labels of the buttons that end the open dialog, in page order
export const dialogActions = Text.ofAll(dialogActionButtons);
export const dialogTitleText = Text.of(dialogTitle);
// #1201: what a screen reader reads at the field, its error first (Field.svelte)
export const fieldDescription = (label: string) => Accessible.descriptionOf(fieldLabelled(label));
export const fieldValue = (label: string) => Value.of(fieldLabelled(label));
