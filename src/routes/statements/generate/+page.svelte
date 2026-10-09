<script lang="ts">
	import type { Building, HeatingProfile } from '$lib/types';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import WizardProgress from './WizardProgress.svelte';
	import WizardStep from './WizardStep.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import WizardNavigation from './WizardNavigation.svelte';
	import type { PreviewRow, WizardSelection } from './preview';
	import type { ActionData } from './$types';

	interface GenerateStatementData {
		buildings: (Building & { apartmentCount: number })[];
		heatingProfiles: HeatingProfile[];
		distributionKeys: { id: string; name: string }[];
		defaultManagementFeePercent: number;
		defaultHeatingProfileId: string;
		defaultPeriod: {
			start: string;
			end: string;
		};
	}

	let { data, form }: { data: GenerateStatementData; form: ActionData } = $props();

	// Wizard state
	let currentStep = $state(1);
	const totalSteps = 4;

	// Step 1 (period, defaults from the loader) and step 2 (buildings) selection
	let selection = $state<WizardSelection>(
		untrack(() => ({
			periodStart: data.defaultPeriod.start,
			periodEnd: data.defaultPeriod.end,
			heatingProfileId: data.defaultHeatingProfileId,
			managementFeePercent: data.defaultManagementFeePercent,
			managementFeeDistributionKeyId: '',
			buildingIds: []
		}))
	);

	// Step 3: Preview, one row per rental contract in the period (kept when a later step fails)
	let previewRows = $state<PreviewRow[]>([]);
	$effect(() => {
		if (!form?.preview) return;
		previewRows = form.preview;
		currentStep = 3;
	});

	// Step 4: Generation
	let isGenerating = $state(false);
	const createdCount = $derived(form?.created ?? null);

	const canProceed = $derived(
		[
			!!selection.periodStart &&
				!!selection.periodEnd &&
				!!selection.heatingProfileId &&
				Number.isFinite(selection.managementFeePercent) &&
				selection.managementFeePercent >= 0,
			selection.buildingIds.length > 0,
			previewRows.length > 0
		][currentStep - 1] ?? false
	);
	const formAction = $derived(currentStep === 2 ? '?/preview' : '?/generate');
	const showNavigation = $derived(!isGenerating && createdCount === null);

	// Step 2 submits ?/preview, step 4 submits ?/generate; the action result arrives as `form`
	const submit: SubmitFunction = () => {
		isGenerating = currentStep === totalSteps;
		return async ({ update }) => {
			await update({ reset: false, invalidateAll: false });
			isGenerating = false;
		};
	};
</script>

<svelte:head>
	<title>Abrechnungen erstellen - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/statements"
			data-testid="back-link"
			aria-label="Zurück zu den Abrechnungen"
			class="p-2 text-ink-muted hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={24} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Nebenkostenabrechnungen erstellen</h1>
			<p class="text-ink-muted mt-1">Schritt {currentStep} von {totalSteps}</p>
		</div>
	</div>

	<WizardProgress {currentStep} />

	<form method="POST" action={formAction} use:enhance={submit} class="space-y-6">
		<input type="hidden" name="periodStart" value={selection.periodStart} />
		<input type="hidden" name="periodEnd" value={selection.periodEnd} />
		<input type="hidden" name="heatingProfileId" value={selection.heatingProfileId} />
		<input type="hidden" name="managementFeePercent" value={selection.managementFeePercent} />
		<input
			type="hidden"
			name="managementFeeDistributionKeyId"
			value={selection.managementFeeDistributionKeyId}
		/>
		<input type="hidden" name="buildingIds" value={selection.buildingIds.join(',')} />

		<Card>
			<WizardStep
				{currentStep}
				buildings={data.buildings}
				heatingProfiles={data.heatingProfiles}
				distributionKeys={data.distributionKeys}
				{previewRows}
				{isGenerating}
				{createdCount}
				bind:selection
			/>
			<FieldError message={form?.error} />
		</Card>

		{#if showNavigation}
			<WizardNavigation bind:currentStep {canProceed} submitStep={2} lastStep={totalSteps} />
		{/if}
	</form>
</div>
