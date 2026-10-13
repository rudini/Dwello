import { Attribute, Count } from '../screenplay/questions';
import { tenantEmailLink, tenantPhoneLink } from '../targets/contact';

export const emailLinkAddress = Attribute.named('href').of(tenantEmailLink);
export const emailLinks = Count.of(tenantEmailLink);
export const phoneLinkAddress = Attribute.named('href').of(tenantPhoneLink);
