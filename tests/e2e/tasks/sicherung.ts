import { FRESH_APP } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, DownloadFrom, Enter, Navigate, Wait } from '../screenplay/interactions';
import { shownBackupCode } from '../questions/sicherung';
import {
	backupCode,
	backupCodeInput,
	backupConfirmation,
	backupPrivacyLink,
	backupSheetLink,
	backupSubmitButton
} from '../targets/sicherung';

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

/** Types the shown code again, as the landlord does after the setup, and waits for the overview that confirms it */
export const confirmShownBackupCode: Activity = async (actor) => {
	await actor.attemptsTo(Wait.until(backupCode));
	await actor.attemptsTo(confirmBackupCode((await actor.answer(shownBackupCode)) ?? ''), Wait.until(backupConfirmation));
};

export const downloadEmergencySheet = DownloadFrom(backupSheetLink);
export const openBackupPrivacy = Click.on(backupPrivacyLink);

/** The fresh installation with its code confirmed, as its other screens expect; nothing to do when it already is */
export const freshBackupSetUp: Activity = async (actor) => {
	await actor.attemptsTo(goToFreshBackup);
	const code = await actor.answer(shownBackupCode);
	if (code) await actor.attemptsTo(confirmBackupCode(code), Wait.until(backupConfirmation));
};
