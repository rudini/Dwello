<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CategoryForm from '../../CategoryForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const title = $derived(m.tenants_edit_page_title({ name: localName(data.category) }));
</script>

<svelte:head>
	<title>{title} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		{title}
		trail={[
			{ href: '/config', label: m.nav_settings() },
			{ href: '/config/categories', label: m.nav_categories() }
		]}
	/>
	<!-- What changing one of Dwello's categories does, from the allocability it has (#166) -->
	{#if data.category.predefined}
		<Alert title={m.categories_predefined_title()} testid="category-predefined-hint">
			<p>{m.categories_predefined_hint()}</p>
			<p>
				{data.category.isAllowedUtilityCost
					? m.categories_predefined_allocable()
					: m.categories_predefined_not_allocable()}
			</p>
			{#if data.kiEnabled}<p>{m.categories_predefined_ki()}</p>{/if}
		</Alert>
	{/if}
	<CategoryForm
		category={data.category}
		errors={form?.errors}
		submitLabel={m.buildings_save_changes()}
	/>
</div>
