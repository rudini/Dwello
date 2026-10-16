import { Accessible, Value, Visibility } from '../screenplay/questions';
import { savedNotice, settingField } from '../targets/settings';

export const settingsSaved = Visibility.of(savedNotice);
export const storedSetting = (name: string) => Value.of(settingField(name));
/** The help a screen reader reads with the field, the same text shown under it */
export const settingHelp = (name: string) => Accessible.descriptionOf(settingField(name));
