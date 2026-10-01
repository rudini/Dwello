import type { Page } from '@playwright/test';

export const periodStartInput = (page: Page) => page.getByTestId('period-start-input');
export const periodEndInput = (page: Page) => page.getByTestId('period-end-input');
export const buildingCheckbox = (page: Page, buildingId: string) =>
	page.getByTestId(`generate-building-${buildingId}`);
export const nextButton = (page: Page) => page.getByTestId('wizard-next');
export const generateButton = (page: Page) => page.getByTestId('generate-statements-button');
export const previewCount = (page: Page) => page.getByTestId('preview-count');
export const previewRows = (page: Page) => page.getByTestId('preview-row');
export const previewEmpty = (page: Page) => page.getByTestId('preview-empty');
export const generationResult = (page: Page) => page.getByTestId('generation-result');
export const showStatementsButton = (page: Page) => page.getByTestId('show-statements-button');
export const backLink = (page: Page) => page.getByTestId('back-link');
