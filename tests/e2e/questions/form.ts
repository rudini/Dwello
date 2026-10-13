import { Enabled, Visibility } from '../screenplay/questions';
import { deleteConfirmButton, formError } from '../targets/form';

export const errorMessageShown = (text: string) => Visibility.of(formError(text));
export const deletionConfirmable = Enabled.of(deleteConfirmButton);
