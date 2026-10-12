<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Panel from '$lib/ui/Panel.svelte';

	// Plain-language explanations derived from the definitions in UBIQUITOUS_LANGUAGE.md
	const terms = [
		{
			term: m.glossary_period_term(),
			text: m.glossary_period_text()
		},
		{
			term: m.glossary_advance_term(),
			text: m.glossary_advance_text()
		},
		{
			term: m.glossary_net_rent_term(),
			text: m.glossary_net_rent_text()
		},
		{
			term: m.glossary_additional_rent_term(),
			text: m.glossary_additional_rent_text()
		},
		{
			term: m.glossary_key_term(),
			text: m.glossary_key_text()
		},
		{
			term: m.glossary_profile_term(),
			text: m.glossary_profile_text()
		},
		{
			term: m.glossary_fee_term(),
			// TODO(fachlich prüfen): the glossary still says of the building's costs, shared by a key (offene-punkte.md)
			text: m.glossary_fee_text()
		},
		{
			term: m.glossary_days_term(),
			text: m.glossary_days_text()
		},
		{
			term: m.glossary_allocable_term(),
			text: m.glossary_allocable_text()
		},
		{
			term: m.glossary_balance_term(),
			// TODO(fachlich prüfen): the glossary does not name the rounding to 5 Rappen (offene-punkte.md)
			text: m.glossary_balance_text()
		},
		{
			term: m.glossary_deadline_term(),
			text: m.glossary_deadline_text()
		},
		{
			term: m.glossary_reminder_term(),
			text: m.glossary_reminder_text()
		},
		{
			term: m.glossary_channel_term(),
			text: m.glossary_channel_text()
		},
		{
			term: m.glossary_status_term(),
			text: m.glossary_status_text()
		}
	];
</script>

<Panel title={m.glossary_title()} testid="page-section">
	<dl class="flex flex-col gap-4">
		{#each terms as { term, text } (term)}
			<div class="flex flex-col gap-1">
				<dt class="font-semibold text-ink">{term}</dt>
				<dd class="text-ink">{text}</dd>
			</div>
		{/each}
	</dl>
</Panel>
