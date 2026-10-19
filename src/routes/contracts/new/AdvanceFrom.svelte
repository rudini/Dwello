<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import DateInput from '$lib/ui/DateInput.svelte';

	// «Gültig ab» of the Akonto (#464): only on a contract that exists, whose form brings the day
	let { value = $bindable(), error }: { value?: string; error?: string } = $props();
</script>

{#if value !== undefined}
	<!-- TODO(fachlich prüfen, #477): «Gültig ab» -->
	<DateInput
		id="advancePaymentFrom"
		label={m.contracts_advance_from_label()}
		help={m.contracts_advance_from_help()}
		bind:value
		{error}
		testid="contract-advance-from-input"
	/>
{/if}
