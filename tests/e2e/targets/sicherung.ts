import { target } from '../screenplay/target';

// «Sicherung einrichten» (#718): the Wiederherstellungscode, its confirmation and the Notfallblatt
export const backupPage = target('Seite «Sicherung einrichten»', (page) => page.getByTestId('backup-page'));
export const backupCode = target('Wiederherstellungscode', (page) => page.getByTestId('backup-code'));
export const backupCodeInput = target('Wiederherstellungscode zur Bestätigung', (page) => page.getByTestId('backup-code-input'));
export const backupSubmitButton = target('Sicherung starten', (page) => page.getByTestId('backup-submit'));
export const backupError = target('Fehler der Sicherung', (page) => page.getByTestId('backup-error'));
export const backupSheetLink = target('Notfallblatt herunterladen', (page) => page.getByTestId('backup-sheet-link'));
export const backupPrivacyLink = target('Datenschutzerklärung der Sicherung', (page) => page.getByTestId('backup-privacy-link'));
export const backupGuideLink = target('Link zur Installationsanleitung', (page) => page.getByTestId('backup-guide-link'));
export const backupConfirmation = target('Bestätigung der Sicherung in der Übersicht', (page) => page.getByTestId('backup-confirmed'));
export const backupWarning = target('Warnung der Übersicht ohne Sicherung', (page) => page.getByTestId('backup-stale'));
