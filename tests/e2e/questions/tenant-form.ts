import { Text } from '../screenplay/questions';
import { tenantChannel, tenantLanguage } from '../targets/tenant-form';

export const correspondence = Text.of(tenantChannel);
export const correspondenceLanguage = Text.of(tenantLanguage);
