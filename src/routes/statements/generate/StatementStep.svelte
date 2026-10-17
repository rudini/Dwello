<script lang="ts">
	import { localName } from '$lib/names';
	import { draftsLink, invoiceRows, type WizardSelection } from '$lib/statement-wizard';
	import type { Building, HeatingProfile } from '$lib/types';
	import BuildingStep from './BuildingStep.svelte';
	import GenerationStep from './GenerationStep.svelte';
	import PeriodStep from './PeriodStep.svelte';
	import PreviewStep from './PreviewStep.svelte';
	import SettingsStep from './SettingsStep.svelte';
	import FeeNotAgreed from './FeeNotAgreed.svelte';
	import AgreedCosts from './AgreedCosts.svelte';
	import type { PreviewRow } from './preview';

	// The content of the current step of "Abrechnungen erstellen"
	let {
		step,
		data,
		selection = $bindable(),
		confirmed = $bindable(),
		unansweredAgreements = $bindable(0),
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
		};
		selection: WizardSelection;
		confirmed: boolean;
		unansweredAgreements?: number;
		errors: Record<string, string>;
		previewRows: PreviewRow[];
		invoices: Parameters<typeof invoiceRows>[0];
		periodLabel: string;
		createdCount: number | null;
	} = $props();

	const heatingProfile = $derived(
		data.heatingProfiles.find((p) => p.id === selection.heatingProfileId)
	);
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
		period={{ start: selection.periodStart, end: selection.periodEnd }}
		error={errors.buildings}
	/>
{:else if step === 3}
	<SettingsStep
		heatingProfiles={data.heatingProfiles}
		bind:heatingProfileId={selection.heatingProfileId}
		bind:managementFeePercent={selection.managementFeePercent}
		{errors}
	/>
	<FeeNotAgreed
		buildingIds={selection.buildingIds}
		period={{ start: selection.periodStart, end: selection.periodEnd }}
	/>
	<AgreedCosts
		buildingIds={selection.buildingIds}
		period={{ start: selection.periodStart, end: selection.periodEnd }}
		bind:unanswered={unansweredAgreements}
		error={errors.agreements}
	/>
{:else if step === 4}
	<PreviewStep
		{previewRows}
		{invoices}
		buildings={data.buildings}
		{periodLabel}
		period={selection}
		heatingProfile={heatingProfile && localName(heatingProfile)}
		feePercent={selection.managementFeePercent}
		bind:confirmed
		{errors}
	/>
{:else}
	<GenerationStep
		count={previewRows.length}
		{createdCount}
		draftsHref={draftsLink(selection)}
		withoutInvoices={invoiceRows(invoices, data.buildings, selection)
			.filter((row) => row.missing)
			.map((row) => row.name)}
		incomplete={invoiceRows(invoices, data.buildings, selection)
			.filter((row) => row.incomplete)
			.map((row) => row.name)}
	/>
{/if}
