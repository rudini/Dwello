import { FRESH_APP } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, DownloadFrom, Enter, Navigate, Wait } from '../screenplay/interactions';
import { userMenuButton } from '../targets/app-frame';
import { signInWithPassword } from './authentication';
import { shownBackupCode } from '../questions/sicherung';
import {
	backupCode,
	backupCodeInput,
	backupConfirmation,
	backupPrivacyLink,
	backupSheetLink,
	backupSettingsLink,
	backupSubmitButton,
	newCodeBackLink,
	newCodeButton,
	newCodeConfirmation,
	newCodePasswordInput
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

/** Only the first group of the shown code, as a long press selects on a phone (#947) */
export const confirmFirstGroupOfShownCode: Activity = async (actor) => {
	await actor.attemptsTo(Wait.until(backupCode));
	await actor.attemptsTo(confirmBackupCode(((await actor.answer(shownBackupCode)) ?? '').slice(0, 4)));
};

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

// #718, part 3: «Neuer Wiederherstellungscode» in the settings of the fresh installation
export const NEW_CODE_PAGE = `${FRESH_APP}/config/backup`;

/** Signed in on the fresh installation with its Konto mit Passwort, as the landlord does it */
export const signInFreshWithPassword =
	(email: string, password: string): Activity =>
	(actor) =>
		actor.attemptsTo(Cookies.signOut, Navigate.to(`${FRESH_APP}/login`), signInWithPassword(email, password), Wait.until(userMenuButton));

/** Signed in on the fresh installation with Google an hour ago (#718: too long ago for a new code) */
export const signedInFreshWithGoogleAnHourAgo: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP, '2h', undefined, 3600)));

export const openBackupSettings: Activity = (actor) =>
	actor.attemptsTo(Navigate.to(`${FRESH_APP}/config`), Click.on(backupSettingsLink));

export const openNewCodePage: Activity = (actor) => actor.attemptsTo(Navigate.to(NEW_CODE_PAGE));

/** «Neuen Code erstellen» with the password typed again */
export const createNewCode =
	(password: string): Activity =>
	(actor) =>
		actor.attemptsTo(openNewCodePage, Enter.theValue(password).into(newCodePasswordInput), Click.on(newCodeButton));

/** A new code made with the right password, remembering the code the page shows */
export const createdNewCode =
	(password: string): Activity =>
	async (actor) => {
		await actor.attemptsTo(createNewCode(password), Wait.until(backupCode));
		actor.remember(SHOWN_CODE, await actor.answer(shownBackupCode));
	};

/** The new code shown, typed again and confirmed */
export const confirmNewShownCode: Activity = async (actor) => {
	await actor.attemptsTo(Wait.until(backupCode));
	await actor.attemptsTo(confirmBackupCode((await actor.answer(shownBackupCode)) ?? ''), Wait.until(newCodeConfirmation));
};

/** From the confirmation of the new code back to «Einstellungen» (#956) */
export const backToSettings = Click.on(newCodeBackLink);
