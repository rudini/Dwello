import { FRESH_APP } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, Enter, Navigate } from '../screenplay/interactions';
import {
	setupCodeInput,
	setupEmailInput,
	setupPasswordInput,
	setupPasswordRepeatInput,
	setupPrivacyLink,
	setupSubmitButton,
	setupTermsLink
} from '../targets/einrichtung';

export const openFreshDwello = Navigate.to(`${FRESH_APP}/`);
export const openSetup = Navigate.to(`${FRESH_APP}/setup`);
export const openSetupPrivacy = Click.on(setupPrivacyLink);
export const openSetupTerms = Click.on(setupTermsLink);

export const setUpDwello =
	(code: string, account: { email: string; password: string }): Activity =>
	(actor) =>
		actor.attemptsTo(
			Enter.theValue(code).into(setupCodeInput),
			Enter.theValue(account.email).into(setupEmailInput),
			Enter.theValue(account.password).into(setupPasswordInput),
			Enter.theValue(account.password).into(setupPasswordRepeatInput),
			Click.on(setupSubmitButton)
		);

/** The overview of the fresh installation, signed in like the Liegenschaftsverwalter of the main stack */
export const openFreshOverview: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP)), Navigate.to(`${FRESH_APP}/dashboard`));
