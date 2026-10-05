<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import CategoryForm from '../CategoryForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Neue Kategorie - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail
		links={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/categories', label: 'Kategorien' }
		]}
		current="Neue Kategorie"
	/>

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neue Kategorie</h1>
		<p class="text-gray-500 mt-1">Kostenkategorie, nach der Rechnungen eingeordnet werden.</p>
	</div>

	<Card>
		<CategoryForm errors={form?.errors} submitLabel="Kategorie erstellen" />
	</Card>
</div>
