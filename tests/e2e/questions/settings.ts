import { Accessible, Attribute, Checked, Count, FocusedElement, FocusedLabel, Value, Visibility } from '../screenplay/questions';
import { exportAllDataButton, holderIsSenderBox, savedNotice, settingField } from '../targets/settings';

export const settingsSaved = Visibility.of(savedNotice);
export const storedSetting = (name: string) => Value.of(settingField(name));
export const settingInvalid = (name: string) => Attribute.named('aria-invalid').of(settingField(name));
/** The help a screen reader reads with the field, the same text shown under it */
export const settingHelp = (name: string) => Accessible.descriptionOf(settingField(name));
/** #496: the help at «Alle Daten exportieren», as a screen reader reads it with the control */
export const exportHelp = Accessible.descriptionOf(exportAllDataButton);
/** #1088: how many fields of a setting the page has */
export const settingCount = (name: string) => Count.of(settingField(name));
/** #1166: whether «Kontoinhaber ist der Absender» is ticked */
export const holderIsSender = Checked.of(holderIsSenderBox);
/** #690 (persona Helga 690 H-4): the setting that has the focus, by its label */
export const focusedSetting = FocusedLabel;
/** persona Weber 690 W-7: the setting that has the focus, by its field */
export const focusedSettingField = FocusedElement;
/** #1175: the field's name as a screen reader announces it, its label with «(optional)» */
export const settingName = (name: string) => Accessible.nameOf(settingField(name));
