import { Text } from '../screenplay/questions';
import { addressHelp, tenantChannel, tenantLanguage } from '../targets/tenant-form';

export const correspondence = Text.of(tenantChannel);
export const correspondenceLanguage = Text.of(tenantLanguage);
export const addressHelpText = Text.of(addressHelp);
