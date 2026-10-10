<script lang="ts">
	import type { invoiceRows, WizardSelection } from '$lib/statement-wizard';
	import type { Building, HeatingProfile } from '$lib/types';
	import BuildingStep from './BuildingStep.svelte';
	import GenerationStep from './GenerationStep.svelte';
	import PeriodStep from './PeriodStep.svelte';
	import PreviewStep from './PreviewStep.svelte';
	import SettingsStep from './SettingsStep.svelte';
	import type { PreviewRow } from './preview';

	// The content of the current step of "Abrechnungen erstellen"
	let {
		step,
		data,
		selection = $bindable(),
		confirmed = $bindable(),
		errors,
		previewRows,
		invoices,
		periodLabel,
		createdCount
	}: {
		step: number;
		data: {
			buildings: (Building & { apartmentCount: number })[];
			heatingProfiles: HeatingProfile[];
			distributionKeys: { id: string; name: string }[];
		};
		selection: WizardSelection;
		confirmed: boolean;
		errors: Record<string, string>;
		previewRows: PreviewRow[];
		invoices: Parameters<typeof invoiceRows>[0];
		periodLabel: string;
		createdCount: number | null;
	} = $props();
</script>

{#if step === 1}
	<PeriodStep
		bind:periodStart={selection.periodStart}
		bind:periodEnd={selection.periodEnd}
		{errors}
	/>
{:else if step === 2}
	<BuildingStep
		buildings={data.buildings}
		bind:selectedBuildingIds={selection.buildingIds}
		error={errors.buildings}
	/>
{:else if step === 3}
	<SettingsStep
		heatingProfiles={data.heatingProfiles}
		distributionKeys={data.distributionKeys}
		bind:heatingProfileId={selection.heatingProfileId}
		bind:managementFeePercent={selection.managementFeePercent}
		bind:managementFeeDistributionKeyId={selection.managementFeeDistributionKeyId}
		{errors}
	/>
{:else if step === 4}
	<PreviewStep
		{previewRows}
		{invoices}
		buildings={data.buildings}
		{periodLabel}
		bind:confirmed
		error={errors.confirm}
	/>
{:else}
	<GenerationStep count={previewRows.length} {createdCount} />
{/if}
