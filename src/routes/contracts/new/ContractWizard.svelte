<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, tick, untrack } from 'svelte';
	import { apiCall } from '$lib/api';
	import {
		availableFrom,
		contractBody,
		forAvailability,
		initialContractValues,
		overlapWarning,
		suggestedStartDate,
		validateContract,
		type ContractFormValues
	} from '$lib/contract-form';
	import { contractSteps, firstStepWithError, startValues, stepErrors } from '$lib/contract-wizard';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import SaveStatus from '$lib/ui/SaveStatus.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import WizardNav from '$lib/ui/WizardNav.svelte';
	import {
		computeAvailability,
		type AvailabilityInfo,
		type ContractForAvailability
	} from '$lib/utils/contract-availability';
	import { clearDraft, readDraft, writeDraft } from '$lib/wizard-draft';
	import ApartmentStep from './ApartmentStep.svelte';
	import PeriodStep from './PeriodStep.svelte';
	import RentStep from './RentStep.svelte';
	import ReviewStep from './ReviewStep.svelte';
	import TenantStep from './TenantStep.svelte';

	// "Mietvertrag erfassen" in five steps; the input is kept as a draft in this browser until it is saved
	let {
		tenants,
		apartments
	}: {
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string }[];
	} = $props();

	const DRAFT = 'contract';
	const params = untrack(() => $page.url.searchParams);
	let values = $state(initialContractValues(undefined, params));
	let step = $state(1);
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let savedAt = $state<Date | null>(null);
	let restored = $state<{ at: Date; dropped: boolean } | null>(null);
	let keeping = $state(false); // from mount on, every change is kept as a draft
	let heading = $state<HTMLElement>();
	let availability = $state(new Map<string, AvailabilityInfo>());
	let loadingAvailability = $state(true);
	let apartmentContracts = $state<ContractForAvailability[]>([]);

	const startLimit = $derived(availableFrom(availability.get(values.apartmentId), true));
	const overlap = $derived(overlapWarning(values, apartmentContracts));

	async function contractsOf(apartmentId: string) {
		const response = await apiCall<{ contracts: Parameters<typeof forAvailability>[0] }>(
			`/contracts?apartmentId=${apartmentId}`
		);
		return forAvailability(response.data?.contracts ?? []);
	}

	onMount(() => {
		const draft = readDraft<ContractFormValues>(localStorage, DRAFT);
		if (draft) {
			// a tenant chosen before the page was live counts like one in the address
			const given = new URLSearchParams(params);
			if (values.tenantId) given.set('tenant', values.tenantId);
			const known = {
				tenantIds: tenants.map((t) => t.id),
				apartmentIds: apartments.map((a) => a.id)
			};
			const start = startValues(given, draft.values, known);
			values = start.values;
			restored = { at: draft.savedAt, dropped: start.dropped };
		}
		keeping = true;
		Promise.all(
			apartments.map(async (a) => [a.id, computeAvailability(await contractsOf(a.id))] as const)
		)
			.then((entries) => (availability = new Map(entries)))
			.finally(() => (loadingAvailability = false));
	});

	$effect(() => {
		const snapshot = $state.snapshot(values);
		const hasInput = Object.entries(snapshot).some(
			([field, value]) => field !== 'isUnlimited' && value
		);
		if (keeping && hasInput) savedAt = writeDraft(localStorage, DRAFT, snapshot, new Date());
	});

	// Contracts of the chosen apartment, for the overlap check
	$effect(() => {
		const apartmentId = values.apartmentId;
		apartmentContracts = [];
		if (apartmentId) contractsOf(apartmentId).then((contracts) => (apartmentContracts = contracts));
	});

	$effect(() => {
		const start = suggestedStartDate(values.startDate, availability.get(values.apartmentId));
		if (start) values.startDate = start;
	});

	function discardDraft() {
		clearDraft(localStorage, DRAFT);
		values = initialContractValues(undefined, params);
		restored = null;
		savedAt = null;
		errors = {};
		step = 1;
	}

	async function goTo(target: number) {
		step = target;
		await tick();
		heading?.focus();
	}

	async function save() {
		errors = validateContract(values);
		const wrong = firstStepWithError(errors);
		if (wrong) return goTo(wrong);
		saving = true;
		const response = await apiCall('/contracts', { method: 'POST', body: contractBody(values) });
		saving = false;
		if (response.error) {
			errors = { form: response.error.message };
			return;
		}
		keeping = false;
		clearDraft(localStorage, DRAFT);
		addToast(
			'success',
			`Mietvertrag von ${tenants.find((t) => t.id === values.tenantId)?.name} gespeichert`
		);
		await goto('/contracts');
	}

	function submitStep(event: SubmitEvent) {
		event.preventDefault();
		if (step === contractSteps.length) return save();
		errors = stepErrors(values, step);
		if (Object.keys(errors).length === 0) goTo(step + 1);
	}
</script>

<form onsubmit={submitStep} novalidate class="flex flex-col gap-8" data-testid="contract-wizard">
	{#if restored}
		<Alert title="Entwurf wiederhergestellt" testid="draft-restored">
			<p>
				Sie haben diesen Mietvertrag am {restored.at.toLocaleDateString('de-CH')} um {restored.at.toLocaleTimeString(
					'de-CH',
					{ hour: '2-digit', minute: '2-digit' }
				)} begonnen. Ihre Angaben sind wieder da.
			</p>
			{#if restored.dropped}
				<p>
					Ein Mieter oder eine Wohnung aus dem Entwurf gibt es nicht mehr. Bitte wählen Sie neu.
				</p>
			{/if}
			{#snippet action()}
				<Button variant="secondary" icon="delete" onclick={discardDraft} testid="draft-discard"
					>Entwurf verwerfen</Button
				>
			{/snippet}
		</Alert>
	{/if}

	<Stepper steps={contractSteps.map((s) => s.label)} current={step} onselect={goTo} />

	<section
		aria-labelledby="step-heading"
		class="flex flex-col gap-6 rounded-panel border border-line bg-surface p-6"
	>
		<h2 id="step-heading" tabindex="-1" bind:this={heading} class="text-2xl font-bold text-ink">
			{contractSteps[step - 1].label}
		</h2>
		{#if step === 1}
			<TenantStep
				bind:tenantId={values.tenantId}
				{tenants}
				created={params.has('created')}
				error={errors.tenantId}
			/>
		{:else if step === 2}
			<ApartmentStep
				bind:apartmentId={values.apartmentId}
				{apartments}
				{availability}
				loading={loadingAvailability}
				notice={startLimit.notice}
				error={errors.apartmentId}
			/>
		{:else if step === 3}
			<PeriodStep
				bind:startDate={values.startDate}
				bind:endDate={values.endDate}
				bind:isUnlimited={values.isUnlimited}
				min={startLimit.min}
				{overlap}
				{errors}
			/>
		{:else if step === 4}
			<RentStep bind:values {errors} />
		{:else}
			<ReviewStep {values} {tenants} {apartments} onedit={goTo} />
			{#if errors.form}
				<Alert tone="critical" title="Der Mietvertrag wurde nicht gespeichert" testid="form-error">
					<p>{errors.form}</p>
					<p>Prüfen Sie die Angaben und versuchen Sie es erneut.</p>
				</Alert>
			{/if}
		{/if}
	</section>

	<SaveStatus {savedAt} />
	<WizardNav
		{step}
		last={contractSteps.length}
		onback={() => goTo(step - 1)}
		finalLabel="Mietvertrag speichern"
		busy={saving}
		cancelHref="/contracts"
	/>
</form>
