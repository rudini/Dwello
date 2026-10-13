import { Value, Visibility } from '../screenplay/questions';
import { savedNotice, settingField } from '../targets/settings';

export const settingsSaved = Visibility.of(savedNotice);
export const storedSetting = (name: string) => Value.of(settingField(name));
