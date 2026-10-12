<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ApartmentForm from '../ApartmentForm.svelte';
	import BuildingField from './BuildingField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const errors = $derived(form?.errors ?? {});
	// Coming from a building page, the apartment belongs to that building
	const preset = $derived(data.buildings.find((b) => b.id === data.presetBuildingId));
	let buildingId = $state(untrack(() => data.presetBuildingId ?? ''));
	const trail = $derived(
		preset
			? [
					{ href: '/buildings', label: m.nav_buildings() },
					{ href: `/buildings/${preset.id}`, label: preset.name }
				]
			: [{ href: '/apartments', label: m.nav_apartments() }]
	);
</script>

<svelte:head>
	<title>{m.apartments_new_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader title={m.apartments_new_title()} purpose={m.apartments_new_purpose()} {trail} />
	<Panel>
		<ApartmentForm
			{buildingId}
			{errors}
			cancelHref={trail[trail.length - 1].href}
			submitLabel={m.buildings_add_apartment()}
		>
			{#snippet building()}
				<BuildingField
					buildings={data.buildings}
					{preset}
					error={errors.buildingId}
					onselect={(id) => (buildingId = id)}
				/>
			{/snippet}
		</ApartmentForm>
	</Panel>
</div>
