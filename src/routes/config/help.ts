import { m } from '$lib/paraglide/messages';

// Plain-language explanations of the settings' domain terms, from UBIQUITOUS_LANGUAGE.md (docs/archive/redesign/01-plan.md §7)
export const help = {
	get heatingProfile() {
		return m.config_help_heating_profile();
	},
	get distributionKey() {
		return m.config_help_distribution_key();
	},
	get managementFee() {
		return m.config_help_management_fee();
	},
	get accountingPeriod() {
		return m.config_help_accounting_period();
	}
};
