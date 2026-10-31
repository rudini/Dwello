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
// «Neuer Wiederherstellungscode» in the settings (#718, part 3): first the password again (or Google), then as above
export const newCodePasswordInput = target('Passwort für einen neuen Wiederherstellungscode', (page) => page.getByTestId('backup-password-input'));
export const newCodeButton = target('Neuen Code erstellen', (page) => page.getByTestId('backup-new-code'));
export const newCodeGoogleLink = target('Erneut mit Google anmelden', (page) => page.getByTestId('backup-google-link'));
export const newCodeConfirmation = target('Bestätigung des neuen Wiederherstellungscodes', (page) => page.getByTestId('backup-new-confirmed'));
export const backupSettingsLink = target('Sicherung in den Einstellungen', (page) => page.getByTestId('quick-link-backup'));
