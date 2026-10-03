import type { Page } from '@playwright/test';

export const tenantEmailLink = (page: Page) => page.getByTestId('tenant-email-link');
export const tenantPhoneLink = (page: Page) => page.getByTestId('tenant-phone-link');
