import { Accessible, Attribute, Text, Value, Visibility } from '../screenplay/questions';
import { exportAllDataButton, periodChangeHint, periodChangeLetter, savedNotice, settingField } from '../targets/settings';

export const settingsSaved = Visibility.of(savedNotice);
export const storedSetting = (name: string) => Value.of(settingField(name));
export const settingInvalid = (name: string) => Attribute.named('aria-invalid').of(settingField(name));
/** The help a screen reader reads with the field, the same text shown under it */
export const settingHelp = (name: string) => Accessible.descriptionOf(settingField(name));
/** #496: the help at «Alle Daten exportieren», as a screen reader reads it with the control */
export const exportHelp = Accessible.descriptionOf(exportAllDataButton);
/** #1036: the hint after saving another Abrechnungsperiode, and where its letter of a Mietvertrag leads */
export const periodChangeHintText = Text.of(periodChangeHint);
export const periodChangeHintShown = Visibility.of(periodChangeHint);
export const periodChangeLetterAddress = (contractId: string) => Attribute.named('href').of(periodChangeLetter(contractId));
