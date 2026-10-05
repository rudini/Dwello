<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import BuildingForm from '$lib/components/BuildingForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// Get errors from form action or local validation
	const errors = $derived(form?.errors || {});
</script>

<svelte:head>
	<title>Neues Gebäude - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/buildings" data-testid="breadcrumb-link" class="hover:text-primary transition-colors"
			>Gebäude</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Neues Gebäude</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neues Gebäude erstellen</h1>
		<p class="text-gray-500 mt-1">Fügen Sie ein neues Gebäude zu Ihrem Portfolio hinzu.</p>
	</div>

	<!-- Form -->
	<Card>
		<BuildingForm mode="create" {errors} cancelHref="/buildings" />
	</Card>
</div>
