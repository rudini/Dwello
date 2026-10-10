<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import type { Building, HeatingProfile } from '$lib/types';
	import StatementWizard from './StatementWizard.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: {
		data: {
			buildings: (Building & { apartmentCount: number })[];
			heatingProfiles: HeatingProfile[];
			distributionKeys: { id: string; name: string }[];
			defaultManagementFeePercent: number;
			defaultHeatingProfileId: string;
			defaultPeriod: { start: string; end: string };
		};
		form: ActionData;
	} = $props();
</script>

<svelte:head>
	<title>Abrechnungen erstellen - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Abrechnungen erstellen"
		purpose="Erstellen Sie die Nebenkostenabrechnungen einer Abrechnungsperiode für ganze Gebäude. Es entstehen Entwürfe, die Sie danach prüfen und versenden."
		trail={[{ href: '/statements', label: 'Nebenkostenabrechnungen' }]}
	/>
	<StatementWizard
		data={{
			buildings: data.buildings,
			heatingProfiles: data.heatingProfiles,
			distributionKeys: data.distributionKeys,
			defaultManagementFeePercent: data.defaultManagementFeePercent,
			defaultHeatingProfileId: data.defaultHeatingProfileId,
			defaultPeriod: data.defaultPeriod
		}}
		{form}
	/>
</div>
