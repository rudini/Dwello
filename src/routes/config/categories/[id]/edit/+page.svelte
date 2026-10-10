<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CategoryForm from '../../CategoryForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>{data.category.name} bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="{data.category.name} bearbeiten"
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/categories', label: 'Kategorien' }
		]}
	/>
	<CategoryForm category={data.category} errors={form?.errors} submitLabel="Änderungen speichern" />
</div>
