<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import { formatDateLong } from '$lib/utils/format';

	// Datenschutzerklärung and Nutzungsbedingungen: title, purpose and the day their texts last changed (#458); each
	// page its own day (#1176)
	let { title, purpose, asOf }: { title: string; purpose: string; asOf: string } = $props();
</script>

<PageHeader {title} {purpose} />
<p class="text-ink-muted" data-testid="legal-as-of">
	{m.legal_as_of({ date: formatDateLong(asOf, { weekday: false }) })}
</p>
