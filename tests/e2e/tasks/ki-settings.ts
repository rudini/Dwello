import { EMPTY_APP, FRESH_APP, FRESH_KI_STUB } from '../fixtures/fresh-installation';
import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Check, Click, Cookies, Enter, Navigate, Wait } from '../screenplay/interactions';
import {
	kiApiKeyInput,
	kiBaseUrlInput,
	kiCheckButton,
	kiCheckResult,
	kiCountryInput,
	kiLinkInSettings,
	kiMode,
	kiModelDownloadButton,
	kiModelInput,
	kiPrivacyConfirm,
	kiProviderInput,
	kiSaveAnswer,
	kiSaveButton
} from '../targets/ki-settings';
import { uploadInvoicesButton } from '../targets/invoice-upload';

/** A provider as the KI stand-in answers it (backend/scripts/llm-stub.ts): it refuses the key «falsch» and reads no
 * images with the model «text-modell»; nothing listens on port 9 */
export type Provider = { address: string; key: string; model: string; provider: string; country: string; confirmed: boolean };
export const stubProvider = (provider: string, country: string): Provider => ({
	address: `${FRESH_KI_STUB}/v1`,
	key: 'gueltig',
	model: 'bild-modell',
	provider,
	country,
	confirmed: true
});
export const UNREACHABLE = 'http://127.0.0.1:9/v1';

const signInFresh: Activity = async (actor) => actor.attemptsTo(Cookies.add(await sessionCookies(FRESH_APP)));

export const openFreshSettingsKi: Activity = (actor) =>
	actor.attemptsTo(signInFresh, Navigate.to(`${FRESH_APP}/config`), Click.on(kiLinkInSettings));
export const openFreshKi: Activity = (actor) => actor.attemptsTo(signInFresh, Navigate.to(`${FRESH_APP}/config/ki`));
export const openKi = Navigate.to('/config/ki');
export const openFreshUpload: Activity = (actor) =>
	actor.attemptsTo(signInFresh, Navigate.to(`${FRESH_APP}/invoices`), Click.on(uploadInvoicesButton));

const fillProvider =
	(provider: Provider): Activity =>
	(actor) =>
		actor.attemptsTo(
			Click.on(kiMode('provider')),
			Enter.theValue(provider.address).into(kiBaseUrlInput),
			Enter.theValue(provider.key).into(kiApiKeyInput),
			Enter.theValue(provider.model).into(kiModelInput),
			Enter.theValue(provider.provider).into(kiProviderInput),
			Enter.theValue(provider.country).into(kiCountryInput),
			...(provider.confirmed ? [Check.the(kiPrivacyConfirm)] : [])
		);

export const saveProvider =
	(provider: Provider): Activity =>
	(actor) =>
		actor.attemptsTo(openFreshKi, fillProvider(provider), Click.on(kiSaveButton), Wait.until(kiSaveAnswer));

export const checkConnection =
	(provider: Provider): Activity =>
	(actor) =>
		actor.attemptsTo(openFreshKi, fillProvider(provider), Click.on(kiCheckButton), Wait.until(kiCheckResult));

export const saveMode =
	(mode: 'local' | 'none'): Activity =>
	(actor) =>
		actor.attemptsTo(openFreshKi, Click.on(kiMode(mode)), Click.on(kiSaveButton), Wait.until(kiSaveAnswer));

export const readFreshPrivacy = Navigate.to(`${FRESH_APP}/privacy`);

export const openFreshAuditLog: Activity = (actor) => actor.attemptsTo(signInFresh, Navigate.to(`${FRESH_APP}/config/audit-log`));

/** The KI of the empty instance, whose KI stand-in fails the model download */
export const openKiWithFailedModel: Activity = async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(EMPTY_APP)), Navigate.to(`${EMPTY_APP}/config/ki`));

export const downloadModelAgain: Activity = (actor) => actor.attemptsTo(openFreshKi, Click.on(kiModelDownloadButton));
