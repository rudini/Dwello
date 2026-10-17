import { Accessible, Text } from '../screenplay/questions';
import { addressHelp, languageOptions, languageSelect, tenantChannel, tenantLanguage } from '../targets/tenant-form';

export const correspondence = Text.of(tenantChannel);
export const correspondenceLanguage = Text.of(tenantLanguage);
export const languageLabel = Accessible.nameOf(languageSelect);
export const offeredLanguages = Text.ofAll(languageOptions);
export const addressHelpText = Text.of(addressHelp);
