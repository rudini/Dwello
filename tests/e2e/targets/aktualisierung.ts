import { target } from '../screenplay/target';

// The notice of a new version and the update (#1453)
export const updateNotice = target('Hinweis zur neuen Version', (page) => page.getByTestId('update-notice'));
export const updateNoticeText = target('Text des Hinweises zur neuen Version', (page) => page.getByTestId('update-notice-text'));
export const whatsNewLink = target('«Was ist neu?»', (page) => page.getByTestId('update-notice-whats-new'));
export const updateButton = target('Aktualisieren', (page) => page.getByTestId('update-notice-update'));
export const laterButton = target('Später', (page) => page.getByTestId('update-notice-later'));
export const backupLink = target('Link zur Sicherung im Hinweis', (page) => page.getByTestId('update-notice-backup-link'));
export const updateConfirmButton = target('Jetzt aktualisieren', (page) => page.getByTestId('update-confirm'));
export const updateCancelButton = target('Abbrechen des Updates', (page) => page.getByTestId('dialog-cancel'));
export const unsavedWarning = target('Warnung vor ungespeicherten Eingaben', (page) => page.getByTestId('update-confirm-unsaved'));
export const updateOverlay = target('Update', (page) => page.getByTestId('update-overlay'));
export const currentStep = target('laufender Schritt des Updates', (page) => page.getByTestId('update-step-current'));
export const updateFailure = target('Meldung des fehlgeschlagenen Updates', (page) => page.getByTestId('update-failed'));
export const backupCodeShown = target('Wiederherstellungscode der Sicherung', (page) => page.getByTestId('backup-code-shown'));
export const updateCheckBox = target('Täglich nach neuen Versionen suchen', (page) => page.getByTestId('setting-updateCheck'));
