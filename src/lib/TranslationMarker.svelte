<script lang="ts">
	import { translatedLanguages } from '$lib/names';
	import { m } from '$lib/paraglide/messages';

	// Whether an own category, distribution key or heating profile has names in other languages (#689): the codes
	// on screen, the language names for a screen reader
	let { names, testid }: { names: Parameters<typeof translatedLanguages>[0]; testid: string } =
		$props();

	const spoken = {
		FR: m.tenants_language_fr,
		IT: m.tenants_language_it,
		EN: m.tenants_language_en
	};
	const languages = $derived(translatedLanguages(names));
</script>

<p class="text-ink-muted">
	{#if languages.length}<span aria-hidden="true" data-testid={testid}
			>{m.config_translated({ languages: languages.join(', ') })}</span
		><span class="sr-only"
			>{m.config_translated({
				languages: languages.map((code) => spoken[code]()).join(', ')
			})}</span
		>{:else}<span data-testid={testid}>{m.config_not_translated()}</span>{/if}
</p>
