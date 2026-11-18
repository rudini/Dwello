import { Attribute, HoldsFocus, Text, Visibility } from '../screenplay/questions';
import { backupCodeShown, currentStep, updateButton, updateFailure, updateNotice, updateNoticeText, unsavedWarning, updateOverlay, whatsNewLink } from '../targets/aktualisierung';

// The notice of a new version and the update (#1453)
export const noticeText = Text.of(updateNoticeText);
export const noticeShown = Visibility.of(updateNotice);
export const whatsNewAddress = Attribute.named('href').of(whatsNewLink);
export const updateOffered = Visibility.of(updateButton);
export const unsavedWarningText = Text.of(unsavedWarning);
export const shownStep = Text.of(currentStep);
export const failureText = Text.of(updateFailure);
export const atBackupCode = HoldsFocus.of(backupCodeShown);
export const updateRunning = Visibility.of(updateOverlay);
