import { target } from '../screenplay/target';

export const tenantEmailLink = target('E-Mail an den Mieter', (page) => page.getByTestId('tenant-email-link'));
export const tenantPhoneLink = target('Anruf beim Mieter', (page) => page.getByTestId('tenant-phone-link'));
