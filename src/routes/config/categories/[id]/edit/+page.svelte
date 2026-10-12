<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
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
	<CategoryForm
		category={data.category}
		errors={form?.errors}
		submitLabel={m.buildings_save_changes()}
	/>
</div>
