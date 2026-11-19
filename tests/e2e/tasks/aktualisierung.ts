import { FRESH_APP, FRESH_KI_STUB } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Check, Click, Cookies, Navigate, Uncheck, Wait } from '../screenplay/interactions';
import {
	backupLink,
	laterButton,
	updateButton,
	updateCancelButton,
	updateCheckBox,
	updateConfirmButton,
	updateFailure,
	updateNotice,
	updateOverlay,
	unsavedWarning
} from '../targets/aktualisierung';
import { pageTitle } from '../targets/app-frame';
import { saveSettingsButton, savedNotice } from '../targets/settings';

// The update of the fresh installation (#1453), signed in like the Liegenschaftsverwalter of the main stack
const openFresh =
	(path: string): Activity =>
	async (actor) =>
		actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP)), Navigate.to(`${FRESH_APP}${path}`));

export const openFreshTenants = openFresh('/tenants');
/** In the sign-in the page already has */
export const goToFreshTenants: Activity = (actor) => actor.attemptsTo(Navigate.to(`${FRESH_APP}/tenants`));
export const openFreshSettings = openFresh('/config');
export const postponeUpdate: Activity = (actor) => actor.attemptsTo(Click.on(laterButton), Wait.untilGone(updateNotice));
export const askToUpdate: Activity = (actor) => actor.attemptsTo(Click.on(updateButton), Wait.until(unsavedWarning));
export const cancelUpdate: Activity = (actor) => actor.attemptsTo(askToUpdate, Click.on(updateCancelButton));
export const confirmUpdate: Activity = (actor) => actor.attemptsTo(askToUpdate, Click.on(updateConfirmButton), Wait.until(updateOverlay));
export const followBackupLink: Activity = (actor) => actor.attemptsTo(Click.on(backupLink));
export const switchOffUpdateCheck: Activity = (actor) =>
	actor.attemptsTo(openFreshSettings, Uncheck.the(updateCheckBox), Click.on(saveSettingsButton), Wait.until(savedNotice));
/** Until the page loads again after the update (the stand-in's three steps of 2 s and the browser's asking) */
export const waitForUpdate: Activity = (actor) => actor.attemptsTo(Wait.untilGone(updateOverlay, 30_000), Wait.until(pageTitle));
/** Until the update ends without success (the stand-in's three steps of 2 s) */
export const waitForFailure: Activity = (actor) => actor.attemptsTo(Wait.until(updateFailure, 30_000));

// The axe and language check (#1453): the stand-in publishes 1.5.0 and ends the next update as the look needs;
// switching the search off and on has the backend ask at once. Afterwards no newer version again, as the scenarios expect
const publish = (release: string, outcome: string): Activity => (actor) =>
	actor.attemptsTo(
		Navigate.outsideApp(`${FRESH_KI_STUB}/stub/update?release=${release}&outcome=${outcome}`),
		// only a switch makes the backend ask again
		openFreshSettings,
		Uncheck.the(updateCheckBox),
		Click.on(saveSettingsButton),
		Wait.until(savedNotice),
		openFreshSettings,
		Check.the(updateCheckBox),
		Click.on(saveSettingsButton),
		Wait.until(savedNotice)
	);
export const publishedForTheLook = (outcome: 'done' | 'failed' | 'restore' | 'hold') => publish('1.5.0', outcome);
export const noNewVersionAfterTheLook = publish('1.4.0', 'done');
/** #1457: the stand-in holds the next update again: each look of the axe and language check starts its own, and the
 * backend starts none while the update service says one runs */
export const holdNextUpdate: Activity = (actor) => actor.attemptsTo(Navigate.outsideApp(`${FRESH_KI_STUB}/stub/update?outcome=hold`));
