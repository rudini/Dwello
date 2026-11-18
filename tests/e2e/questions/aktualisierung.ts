import type { FreshInstallation } from '../fixtures/fresh-installation';
import { question } from '../screenplay/actor';
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
/** #1457: how far the update service is; «idle» while no update was started (backend/scripts/update-stub.ts) */
export const updateServiceState = (frisch: FreshInstallation) => question('Stand des Update-Diensts', () => frisch.updateServiceState());
/** #1457: what happened in which order around the update, e.g. erschienen, gesichert, heruntergeladen */
export const orderOfUpdate = (frisch: FreshInstallation) =>
	question('Reihenfolge von Sicherung und Herunterladen', async () =>
		Object.entries(await frisch.updateTimes())
			.sort(([, earlier], [, later]) => earlier.localeCompare(later))
			.map(([what]) => what)
	);
