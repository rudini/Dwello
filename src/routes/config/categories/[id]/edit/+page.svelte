<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import CategoryForm from '../../CategoryForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>{data.category.name} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail links={[{ href: '/config', label: 'Einstellungen' }, { href: '/config/categories', label: 'Kategorien' }]} current={data.category.name} />

	<h1 class="text-2xl font-bold text-gray-900">Kategorie bearbeiten</h1>

	<Card>
		<CategoryForm category={data.category} errors={form?.errors} submitLabel="Speichern" />
	</Card>
</div>
