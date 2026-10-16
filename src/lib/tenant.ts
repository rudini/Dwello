import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import type { ActionResult } from '@sveltejs/kit';
import { addToast } from './stores';
import type { Tenant } from './types';

/** Languages a tenant's statements can be written in, named in the UI language (getters: read when shown) */
export const languageLabels: Record<Tenant['language'], string> = {
	get de() {
		return m.tenants_language_de();
	},
	get fr() {
		return m.tenants_language_fr();
	},
	get it() {
		return m.tenants_language_it();
	},
	get rm() {
		return m.tenants_language_rm();
	},
	get en() {
		return m.tenants_language_en();
	}
};

// ISO 3166-1 codes the QR-bill takes for the country of the Korrespondenzadresse (#102)
export const countryCodes =
	'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(
		' '
	);

/** A country by its code, named in the UI language */
export const countryName = (code: string) =>
	new Intl.DisplayNames([getLocale()], { type: 'region' }).of(code) ?? code;

/** After saving the tenant form, a confirmation naming the tenant; back in the contract wizard, the wizard confirms */
export function confirmSaved(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const name = `${field('firstName')} ${field('lastName')}`;
	const quiet = field('for') === 'contract';
	return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
		if (result.type === 'redirect' && !quiet) addToast('success', m.tenants_saved_toast({ name }));
		await update();
	};
}
