<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
			defaultManagementFeePercent: number;
			defaultHeatingProfileId: string;
			defaultPeriod: { start: string; end: string };
			defaultBuildingIds: string[];
			preset: {
				building: string;
				start: string;
				end: string;
				fromStatements: boolean;
				feeFromSettings: boolean;
			} | null;
		};
		form: ActionData;
	} = $props();
</script>

<svelte:head>
	<title>{m.dashboard_create_statements()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.dashboard_create_statements()}
		purpose={m.statements_generate_purpose()}
		trail={[{ href: '/statements', label: m.nav_statements() }]}
	/>
	<StatementWizard
		data={{
			buildings: data.buildings,
			heatingProfiles: data.heatingProfiles,
			defaultManagementFeePercent: data.defaultManagementFeePercent,
			defaultHeatingProfileId: data.defaultHeatingProfileId,
			defaultPeriod: data.defaultPeriod,
			defaultBuildingIds: data.defaultBuildingIds,
			preset: data.preset
		}}
		{form}
	/>
</div>
