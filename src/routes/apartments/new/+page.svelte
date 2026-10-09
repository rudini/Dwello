<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import ApartmentFormFields from '$lib/components/ApartmentFormFields.svelte';
	import BuildingField from './BuildingField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const errors = $derived(form?.errors ?? {});
	// Coming from a building page, the apartment belongs to that building
	const preset = $derived(data.buildings.find((b) => b.id === data.presetBuildingId));
	let buildingId = $state(untrack(() => data.presetBuildingId ?? ''));
	const crumbs = $derived(
		preset
			? [
					{ href: '/buildings', label: 'Gebäude' },
					{ href: `/buildings/${preset.id}`, label: preset.name }
				]
			: [{ href: '/apartments', label: 'Wohnungen' }]
	);
	const backHref = $derived(crumbs[crumbs.length - 1].href);
</script>

<svelte:head>
	<title>Neue Wohnung - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<PageTrail links={crumbs} current="Neue Wohnung" />

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neue Wohnung erstellen</h1>
		<p class="text-ink-muted mt-1">
			Die Wohnung ist zunächst leer. Mit einem Mietvertrag weisen Sie ihr einen Mieter zu.
		</p>
	</div>

	<Card>
		<form method="POST" use:enhance class="space-y-6">
			<FieldError message={errors.form} />
			<BuildingField
				buildings={data.buildings}
				{preset}
				error={errors.buildingId}
				onselect={(id) => (buildingId = id)}
			/>
			<ApartmentFormFields {buildingId} {errors} />

			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href={backHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
				<Button type="submit" variant="primary" testid="apartment-submit">
					<Icon name="add" size={18} />
					Wohnung erstellen
				</Button>
			</div>
		</form>
	</Card>
</div>
