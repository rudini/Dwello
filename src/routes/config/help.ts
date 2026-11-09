import { m } from '$lib/paraglide/messages';

// The settings' domain terms, explained with the glossary's own text and what the field adds (#698)
export const help = {
	get heatingProfile() {
		return m.glossary_profile_text();
	},
	get distributionKey() {
		return `${m.glossary_key_text()} ${m.config_help_distribution_key_more()}`;
	},
	get managementFee() {
		return m.glossary_fee_text();
	}
};
