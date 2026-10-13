import { target } from '../screenplay/target';

export const buildingSelect = target('Gebäudeauswahl', (page) => page.getByTestId('apartment-building-select'));
export const numberInput = target('Wohnungsnummer', (page) => page.getByTestId('apartment-number-input'));
export const floorSelect = target('Stockwerk', (page) => page.getByTestId('apartment-floor-select'));
export const areaInput = target('Fläche', (page) => page.getByTestId('apartment-area-input'));
export const roomsSelect = target('Zimmer', (page) => page.getByTestId('apartment-rooms-select'));
export const statusSelect = target('Statusauswahl', (page) => page.getByTestId('apartment-status-select'));
export const numberTakenWarning = target('Warnung Nummer vergeben', (page) => page.getByTestId('apartment-number-taken'));
export const submitButton = target('Wohnung speichern', (page) => page.getByTestId('apartment-submit'));
export const rentedStatus = target('Status aus den Mietverträgen', (page) => page.getByTestId('apartment-status-rented'));
