import { FRESH_APP } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, DownloadFrom, Enter, Navigate, Wait } from '../screenplay/interactions';
import { shownBackupCode } from '../questions/sicherung';
import { backupCode, backupCodeInput, backupPrivacyLink, backupSheetLink, backupSubmitButton } from '../targets/sicherung';

export const SHOWN_CODE = 'backup-code';

/** The page «Sicherung einrichten» of the fresh installation (#718), signed in */
export const goToFreshBackup: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP)), Navigate.to(`${FRESH_APP}/backup`));

/** «Sicherung einrichten», remembering the code it shows */
export const openFreshBackup: Activity = async (actor) => {
	await actor.attemptsTo(goToFreshBackup, Wait.until(backupCode));
	actor.remember(SHOWN_CODE, await actor.answer(shownBackupCode));
};

export const reopenBackup: Activity = (actor) => actor.attemptsTo(Navigate.reload);

/** Types a code into the confirmation and starts the Sicherung */
export const confirmBackupCode =
	(code: string): Activity =>
	(actor) =>
		actor.attemptsTo(Enter.theValue(code).into(backupCodeInput), Click.on(backupSubmitButton));

/** Types the shown code again, as the landlord does after the setup */
export const confirmShownBackupCode: Activity = async (actor) =>
	actor.attemptsTo(confirmBackupCode((await actor.answer(shownBackupCode)) ?? ''));

export const downloadEmergencySheet = DownloadFrom(backupSheetLink);
export const openBackupPrivacy = Click.on(backupPrivacyLink);
