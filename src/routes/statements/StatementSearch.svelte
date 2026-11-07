<script lang="ts">
	import { applyFilterChoice } from '$lib/utils/list-filter';
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Search and building filter as a plain GET form: works before the page is hydrated, keeps the status
	let {
		search,
		building,
		status,
		contract = '',
		periodStart = '',
		periodEnd = '',
		reset = '',
		buildings
	}: {
		search: string;
		building: string;
		status: string;
		contract?: string;
		periodStart?: string;
		periodEnd?: string;
		/** where «Filter zurücksetzen» leads, none while it would change nothing (#673) or the list is empty (#682) */
		reset?: string;
		buildings: { id: string; name: string }[];
	} = $props();

	// Bound, so what is typed before hydration is kept; EarlySelect keeps an early building choice
	let term = $derived(search);
</script>

<form
	method="GET"
	action="/statements"
	role="search"
	onchange={applyFilterChoice}
	aria-label={m.list_search_label()}
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 md:flex-row md:items-end"
>
	{#if status}<input type="hidden" name="status" value={status} />{/if}
	{#if contract}<input type="hidden" name="contract" value={contract} />{/if}
	{#if periodStart}<input type="hidden" name="periodStart" value={periodStart} />{/if}
	{#if periodEnd}<input type="hidden" name="periodEnd" value={periodEnd} />{/if}
	<div class="flex-1">
		<TextInput
			id="search"
			name="search"
			label={m.buildings_search()}
			help={m.statements_search_help()}
			required={false}
			bind:value={term}
			testid="statement-search-input"
		/>
	</div>
	<!-- #673 (Marco P-5): a contract's statements are all of one building -->
	{#if !contract}
		<div class="flex-1">
			<EarlySelect
				id="building"
				name="building"
				label={m.apartments_building()}
				placeholder={m.apartments_all_buildings()}
				required={false}
				options={buildings.map((b) => ({ value: b.id, label: b.name }))}
				value={building}
				testid="statement-building-filter"
			/>
		</div>
	{/if}
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="statement-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if reset}
			<Button href={reset} variant="ghost" icon="close" testid="statement-filter-reset"
				>{m.buildings_reset_filters()}</Button
			>
		{/if}
	</div>
</form>
