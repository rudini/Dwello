<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { untrack } from 'svelte';

	// #91 (Art. 257a Abs. 2 OR): the Nebenkosten the contract agrees, one box per umlagefähige category; without a choice
	// (a new contract) every one is ticked
	let {
		categories,
		agreed = $bindable(),
		from = $bindable(),
		help,
		flatRate = false,
		advance = false
	}: {
		categories: { id: string; name: string }[];
		agreed: string[] | undefined;
		from?: Record<string, string>; // #368: «Vereinbart ab» per category
		help: string;
		flatRate?: boolean; // a Nebenkostenpauschale: no box may be right, so no warning (persona Helga 429 P-1)
		advance?: boolean; // an Akonto: no box is wrong even with a Pauschale, the Akonto is all paid back (#444)
	} = $props();

	const isAgreed = (id: string) => agreed?.includes(id) ?? true;
	// the boxes decide: an agreed category the form does not list ticks none of them
	const noneTicked = $derived(!!agreed && !categories.some((category) => agreed!.includes(category.id)));
	function choose(id: string, on: boolean) {
		const list = (agreed ?? categories.map((category) => category.id)).filter(
			(other) => other !== id
		);
		agreed = on ? [...list, id] : list;
		// #368 (Fachreview 368-B V-6): an unticked category is not agreed from any day either
		if (!on && from?.[id])
			from = Object.fromEntries(Object.entries(from).filter(([other]) => other !== id));
	}
	// open when a day is saved; closing it drops the days, so the form shows what Dwello bills
	let fromOpen = $state(untrack(() => Object.values(from ?? {}).some(Boolean)));
	function toggleFrom() {
		fromOpen = !fromOpen;
		if (!fromOpen) from = {};
	}
	const dayOf = (id: string) => from?.[id] ?? '';
	const setDay = (id: string, day: string) => (from = { ...from, [id]: day });
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
	<div>
		<Button
			variant="ghost"
			expanded={fromOpen}
			onclick={toggleFrom}
			testid="contract-agreed-from-toggle">{m.contracts_agreed_from_toggle()}</Button
		>
	</div>
	{#if fromOpen}
		<p class="text-ink-muted" data-testid="contract-agreed-from-help">
			{m.contracts_agreed_from_help()}
		</p>
		<div class="grid gap-x-8 sm:grid-cols-2">
			{#each categories.filter((category) => isAgreed(category.id)) as category (category.id)}
				<DateInput
					id="agreed-from-{category.id}"
					label={m.contracts_agreed_from_field({ category: category.name })}
					bind:value={() => dayOf(category.id), (day) => setDay(category.id, day)}
					optional
					testid="contract-category-from-{category.id}"
				/>
			{/each}
		</div>
	{/if}
	<!-- persona Marco W10c P-1: no tick bills no Nebenkosten at all, which should not happen unnoticed -->
	<div role="status">
		{#if noneTicked}
			<Alert
				tone={flatRate && !advance ? 'info' : 'caution'}
				title={m.contracts_agreed_costs_none_title()}
				testid="contract-agreed-costs-none"
			>
				<p>
					{advance
						? m.contracts_agreed_costs_none_text_advance()
						: m.contracts_agreed_costs_none_text()}
				</p>
			</Alert>
		{/if}
	</div>
</fieldset>
