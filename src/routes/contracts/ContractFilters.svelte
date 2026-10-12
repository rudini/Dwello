<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';

	// Search and filters as a plain GET form: the address keeps them, and a choice made while loading counts
	let {
		filters,
		buildings
	}: {
		filters: { search: string; building: string; status: string };
		buildings: { id: string; name: string; address: string }[];
	} = $props();

	const statuses = [
		{ value: 'active', label: m.contracts_filter_active() },
		{ value: 'future', label: m.contracts_filter_future() },
		{ value: 'ended', label: m.contracts_filter_ended() }
	];
	const filtered = $derived(Object.values(filters).some(Boolean));
</script>

{#snippet choice(
	control: { id: string; describedBy: string | undefined },
	all: string,
	options: { value: string; label: string }[],
	value: string,
	testid: string
)}
	<select
		id={control.id}
		name={control.id}
		aria-describedby={control.describedBy}
		class={controlClass(false)}
		data-testid={testid}
	>
		<option value="" selected={!value}>{all}</option>
		{#each options as option (option.value)}
			<option value={option.value} selected={option.value === value}>{option.label}</option>
		{/each}
	</select>
{/snippet}

<form
	method="GET"
	action="/contracts"
	role="search"
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 lg:flex-row lg:items-end"
>
	<div class="lg:flex-1">
		<Field id="search" label={m.buildings_search()} help={m.contracts_search_help()}>
			{#snippet children(control)}
				<input
					id={control.id}
					name="search"
					type="search"
					value={filters.search}
					aria-describedby={control.describedBy}
					class={controlClass(false)}
					data-testid="contract-search-input"
				/>
			{/snippet}
		</Field>
	</div>
	<Field id="building" label={m.apartments_building()}>
		{#snippet children(control)}
			{@render choice(
				control,
				m.apartments_all_buildings(),
				buildings.map((b) => ({ value: b.id, label: b.name || b.address })),
				filters.building,
				'contract-building-filter'
			)}
		{/snippet}
	</Field>
	<Field id="status" label={m.contracts_status_label()}>
		{#snippet children(control)}
			{@render choice(
				control,
				m.contracts_filter_all(),
				statuses,
				filters.status,
				'contract-status-filter'
			)}
		{/snippet}
	</Field>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="contract-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if filtered}<Button variant="ghost" href="/contracts">{m.buildings_reset_filters()}</Button
			>{/if}
	</div>
</form>
