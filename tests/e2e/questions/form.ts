import { Enabled, Text, Visibility } from '../screenplay/questions';
import { deleteConfirmButton, formError, formErrors } from '../targets/form';

export const errorMessageShown = (text: string) => Visibility.of(formError(text));
export const errorMessage = Text.of(formErrors);
export const deletionConfirmable = Enabled.of(deleteConfirmButton);
