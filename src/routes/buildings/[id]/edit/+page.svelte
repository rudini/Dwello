<script lang="ts">
	import type { BuildingEditData } from './+page.server';
	import type { ActionData } from './$types';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import BuildingForm from '$lib/components/BuildingForm.svelte';

	let { data, form }: { data: BuildingEditData; form: ActionData } = $props();

	// Reactive building reference for display
	const building = $derived(data.building);

	// Get errors from form action
	const errors = $derived(form?.errors || {});
</script>

<svelte:head>
	<title>Gebäude bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/buildings" data-testid="breadcrumb-link" class="hover:text-blue-600 transition-colors">Gebäude</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/buildings/{building.id}" data-testid="breadcrumb-link" class="hover:text-blue-600 transition-colors">
			{building.name || building.address}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Gebäude bearbeiten</h1>
		<p class="text-gray-500 mt-1">
			Bearbeiten Sie die Details von {building.name || building.address}.
		</p>
	</div>

	<!-- Form -->
	<Card>
		<BuildingForm
			mode="edit"
			initial={data.building}
			{errors}
			cancelHref="/buildings/{building.id}"
		/>
	</Card>
</div>
