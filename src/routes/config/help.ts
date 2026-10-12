import { m } from '$lib/paraglide/messages';

// Plain-language explanations of the settings' domain terms, from UBIQUITOUS_LANGUAGE.md (docs/archive/redesign/01-plan.md §7)
export const help = {
	get heatingProfile() {
		return m.config_help_heating_profile();
	},
	get distributionKey() {
		return m.config_help_distribution_key();
	},
	// TODO(fachlich prüfen): the glossary still says of the building's costs (docs/archive/offene-punkte-verlauf.md)
	get managementFee() {
		return m.config_help_management_fee();
	},
	get accountingPeriod() {
		return m.config_help_accounting_period();
	}
};
