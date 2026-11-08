<script lang="ts">
	import type { HintedInvoice } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import type { Tone } from '$lib/ui/tone';
	import HintedInvoices from '$lib/statement-wizard/HintedInvoices.svelte';

	// Invoices without Leistungszeitraum per building that may count in the wrong period; each opens to be edited
	let {
		buildings,
		title,
		text,
		tone = 'info',
		testid
	}: {
		buildings: { buildingId: string; name: string; invoices: HintedInvoice[] }[];
		title: string;
		text: string;
		tone?: Exclude<Tone, 'neutral'>;
		testid: string;
	} = $props();
	// saving or cancelling the edit leads back to the wizard (Persona Dr. Weber P-2, #452)
	const back = '/statements/generate?schritt=3';
</script>

{#if buildings.length}
	<Alert {tone} {title} {testid}>
		<p>{text}</p>
		{#each buildings as row (row.buildingId)}
			<p class="font-semibold" aria-hidden="true">{row.name}</p>
			<HintedInvoices invoices={row.invoices} {back} label={row.name} />
		{/each}
	</Alert>
{/if}
