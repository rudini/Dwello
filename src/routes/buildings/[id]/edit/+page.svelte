<script lang="ts">
	import type { BuildingEditData } from './+page.server';
	import type { ActionData } from './$types';
	import BuildingForm from '../../BuildingForm.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	let { data, form }: { data: BuildingEditData; form: ActionData } = $props();

	const building = $derived(data.building);
	const name = $derived(building.name || building.address);
	const errors = $derived(form?.errors || {});
</script>

<svelte:head>
	<title>Gebäude bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Gebäude bearbeiten"
		purpose="Korrigieren Sie die Angaben von {name}."
		trail={[
			{ href: '/buildings', label: 'Gebäude' },
			{ href: `/buildings/${building.id}`, label: name }
		]}
	/>
	<Panel>
		<BuildingForm
			mode="edit"
			initial={data.building}
			{errors}
			cancelHref="/buildings/{building.id}"
		/>
	</Panel>
</div>
