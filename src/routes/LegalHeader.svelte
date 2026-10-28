<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import { formatDateLong } from '$lib/utils/format';

	// Datenschutzerklärung and Nutzungsbedingungen: title, purpose and the day their texts last changed (#458)
	let { title, purpose }: { title: string; purpose: string } = $props();
</script>

<PageHeader {title} {purpose} />
<p class="text-ink-muted" data-testid="legal-as-of">
	{m.legal_as_of({ date: formatDateLong('2026-10-20', { weekday: false }) })}
</p>
