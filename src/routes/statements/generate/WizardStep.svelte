<script lang="ts">
	import type { Building, HeatingProfile } from '$lib/types';
	import { formatDate } from '$lib/utils/format';
	import PeriodStep from './PeriodStep.svelte';
	import BuildingStep from './BuildingStep.svelte';
	import PreviewStep from './PreviewStep.svelte';
	import GenerationStep from './GenerationStep.svelte';
	import ManagementFeeField from './ManagementFeeField.svelte';
	import type { PreviewRow, WizardSelection } from './preview';

	let {
		currentStep,
		buildings,
		heatingProfiles,
		distributionKeys,
		previewRows,
		isGenerating,
		createdCount,
		selection = $bindable()
	}: {
		currentStep: number;
		buildings: (Building & { apartmentCount: number })[];
		heatingProfiles: HeatingProfile[];
		distributionKeys: { id: string; name: string }[];
		previewRows: PreviewRow[];
		isGenerating: boolean;
		createdCount: number | null;
		selection: WizardSelection;
	} = $props();

	const periodLabel = $derived(
		`${new Date(selection.periodStart).getFullYear()} (${formatDate(selection.periodStart)} - ${formatDate(selection.periodEnd)})`
	);
</script>

{#if currentStep === 1}
	<PeriodStep
		{heatingProfiles}
		bind:periodStart={selection.periodStart}
		bind:periodEnd={selection.periodEnd}
		bind:heatingProfileId={selection.heatingProfileId}
	/>
	<div class="mt-6">
		<ManagementFeeField
			bind:value={selection.managementFeePercent}
			bind:distributionKeyId={selection.managementFeeDistributionKeyId}
			{distributionKeys}
		/>
	</div>
{:else if currentStep === 2}
	<BuildingStep {buildings} bind:selectedBuildingIds={selection.buildingIds} />
{:else if currentStep === 3}
	<PreviewStep {previewRows} {periodLabel} />
{:else}
	<GenerationStep {isGenerating} {createdCount} count={previewRows.length} />
{/if}
