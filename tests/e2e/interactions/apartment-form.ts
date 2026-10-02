import type { Page } from '@playwright/test';

export const buildingSelect = (page: Page) => page.getByTestId('apartment-building-select');
export const numberInput = (page: Page) => page.getByTestId('apartment-number-input');
export const floorSelect = (page: Page) => page.getByTestId('apartment-floor-select');
export const areaInput = (page: Page) => page.getByTestId('apartment-area-input');
export const roomsSelect = (page: Page) => page.getByTestId('apartment-rooms-select');
export const statusSelect = (page: Page) => page.getByTestId('apartment-status-select');
export const numberTakenWarning = (page: Page) => page.getByTestId('apartment-number-taken');
export const submitButton = (page: Page) => page.getByTestId('apartment-submit');
