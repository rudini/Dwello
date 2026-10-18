<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// #91 (Art. 257a Abs. 2 OR): the Nebenkosten the contract agrees, one box per umlagefähige category; without a choice
	// (a new contract) every one is ticked. TODO(fachlich prüfen, #369): the term «Vereinbarte Nebenkosten»
	let {
		categories,
		agreed = $bindable(),
		help,
		flatRate = false
	}: {
		categories: { id: string; name: string }[];
		agreed: string[] | undefined;
		help: string;
		flatRate?: boolean; // a Nebenkostenpauschale: no box is the expected choice (persona Helga 429 P-1)
	} = $props();

	const isAgreed = (id: string) => agreed?.includes(id) ?? true;
	function choose(id: string, on: boolean) {
		const list = (agreed ?? categories.map((category) => category.id)).filter(
			(other) => other !== id
		);
		agreed = on ? [...list, id] : list;
	}
</script>

<!-- id: «Ändern» in «Prüfen» leads here (persona Marco W10c P-3) -->
<fieldset
	id="agreedCosts"
	tabindex="-1"
	class="flex flex-col gap-2"
	aria-describedby="agreed-costs-help"
	data-testid="contract-agreed-costs-choice"
>
	<legend class="mb-2 font-semibold text-ink">{m.contracts_agreed_costs_label()}</legend>
	<p id="agreed-costs-help" class="text-ink-muted">{help}</p>
	<div class="grid gap-x-8 sm:grid-cols-2">
		{#each categories as category (category.id)}
			<Checkbox
				id="agreed-{category.id}"
				label={category.name}
				bind:checked={() => isAgreed(category.id), (on) => choose(category.id, on)}
				testid="contract-category-{category.id}"
			/>
		{/each}
	</div>
	<!-- persona Marco W10c P-1: no tick bills no Nebenkosten at all, which should not happen unnoticed -->
	<div role="status">
		{#if agreed?.length === 0}
			<Alert
				tone={flatRate ? 'info' : 'caution'}
				title={m.contracts_agreed_costs_none_title()}
				testid="contract-agreed-costs-none"
			>
				<p>{m.contracts_agreed_costs_none_text()}</p>
			</Alert>
		{/if}
	</div>
</fieldset>
