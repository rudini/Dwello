<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CategoryForm from '../CategoryForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Neue Kategorie - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neue Kategorie"
		purpose="Eine Kostenart, nach der Sie Rechnungen einordnen."
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/categories', label: 'Kategorien' }
		]}
	/>
	<CategoryForm errors={form?.errors} submitLabel="Kategorie speichern" />
</div>
