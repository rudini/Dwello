import type { Page } from '@playwright/test';

// Wizard frame, shared with the statement wizard
export const finishedStep = (page: Page, label: string) => page.getByTestId('wizard-step').filter({ hasText: label });
export const saveStatus = (page: Page) => page.getByTestId('save-status');
