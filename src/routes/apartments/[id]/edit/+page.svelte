<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ApartmentForm from '../../ApartmentForm.svelte';
	import StatusField from './StatusField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const apartment = $derived(data.apartment);
	const errors = $derived(form?.errors ?? {});
</script>

<svelte:head>
	<title>Wohnung {apartment.number} bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Wohnung {apartment.number} bearbeiten"
		purpose="{apartment.building.name}, {apartment.building.address}"
		trail={[
			{ href: '/apartments', label: 'Wohnungen' },
			{ href: `/apartments/${apartment.id}`, label: `Wohnung ${apartment.number}` }
		]}
	/>
	<Panel>
		<ApartmentForm
			buildingId={apartment.buildingId}
			{apartment}
			{errors}
			cancelHref="/apartments/{apartment.id}"
			submitLabel="Änderungen speichern"
		>
			{#snippet status()}
				<StatusField {apartment} />
			{/snippet}
		</ApartmentForm>
	</Panel>
</div>
