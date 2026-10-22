import { EMPTY_APP, FRESH_APP } from '../fixtures/fresh-installation';
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
	setupKiChoice,
	overviewKiLink,
	setupTermsLink
} from '../targets/einrichtung';

export const openFreshDwello = Navigate.to(`${FRESH_APP}/`);
export const openSetup = Navigate.to(`${FRESH_APP}/setup`);
export const openSetupPrivacy = Click.on(setupPrivacyLink);
export const openSetupTerms = Click.on(setupTermsLink);

/** Fills in the setup and sends it; `repeat` differs from the password only when a scenario wants it to */
export const setUpDwello =
	(code: string, account: { email: string; password: string }, repeat = account.password): Activity =>
	(actor) =>
		actor.attemptsTo(
			Enter.theValue(code).into(setupCodeInput),
			Enter.theValue(account.email).into(setupEmailInput),
			Enter.theValue(account.password).into(setupPasswordInput),
			Enter.theValue(repeat).into(setupPasswordRepeatInput),
			Click.on(setupSubmitButton)
		);

/** The setup with a choice of the KI (#620): the local KI, or none until it is chosen in the settings */
export const setUpDwelloWithKi =
	(code: string, account: { email: string; password: string }, ki: 'local' | 'none'): Activity =>
	(actor) =>
		actor.attemptsTo(Click.on(setupKiChoice(ki)), setUpDwello(code, account));

export const openKiFromFreshOverview: Activity = (actor) => actor.attemptsTo(openFreshOverview, Click.on(overviewKiLink));

/** The overview of the fresh installation, signed in like the Liegenschaftsverwalter of the main stack */
export const openFreshOverview: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP)), Navigate.to(`${FRESH_APP}/dashboard`));

/** The overview of the empty instance, whose KI stand-in fails the model download */
export const openOverviewWithFailedModel: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(EMPTY_APP)), Navigate.to(`${EMPTY_APP}/dashboard`));
