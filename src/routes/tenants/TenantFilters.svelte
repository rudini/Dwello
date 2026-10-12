<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';

	// Search and status as a plain GET form: the address keeps them, and a choice made while loading counts
	let { filters }: { filters: { search: string; status: string } } = $props();

	// Aktiv: with a running or future rental contract; ehemalig: all contracts ended (glossary "Mieter")
	const statuses = [
		{ value: 'active', label: m.tenants_active_filter() },
		{ value: 'inactive', label: m.tenants_former_filter() }
	];
	const filtered = $derived(!!(filters.search || filters.status));
</script>

<form
	method="GET"
	action="/tenants"
	role="search"
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 lg:flex-row lg:items-end"
>
	<div class="lg:flex-1">
		<Field id="search" label={m.buildings_search()} help={m.tenants_search_help()}>
			{#snippet children(control)}
				<input
					id={control.id}
					name="search"
					type="search"
					value={filters.search}
					aria-describedby={control.describedBy}
					class={controlClass(false)}
					data-testid="tenants-search-input"
				/>
			{/snippet}
		</Field>
	</div>
	<Field id="status" label={m.nav_tenants()}>
		{#snippet children(control)}
			<select
				id={control.id}
				name="status"
				class={controlClass(false)}
				data-testid="tenants-status-filter"
			>
				<option value="" selected={!filters.status}>{m.tenants_all()}</option>
				{#each statuses as status (status.value)}
					<option value={status.value} selected={status.value === filters.status}
						>{status.label}</option
					>
				{/each}
			</select>
		{/snippet}
	</Field>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="tenants-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if filtered}<Button variant="ghost" href="/tenants">{m.buildings_reset_filters()}</Button
			>{/if}
	</div>
</form>
