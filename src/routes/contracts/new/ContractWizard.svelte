<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
	import {
		contractSteps,
		firstStepWithError,
		normalizeAmounts,
		startDateNotice,
		startValues,
		stepErrors
	} from '$lib/contract-wizard';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import DraftNotice from '$lib/ui/DraftNotice.svelte';
	import SaveStatus from '$lib/ui/SaveStatus.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import WizardNav from '$lib/ui/WizardNav.svelte';
	import {
		computeAvailability,
		type ContractForAvailability
	} from '$lib/utils/contract-availability';
	import { browserStorage, clearDraft, readDraft, writeDraft } from '$lib/wizard-draft';
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
		tenants: { id: string; name: string; place?: string }[];
		apartments: { id: string; unit: string; building: string; size?: string }[];
	} = $props();

	const DRAFT = 'contract';
	const OVERLAP = m.contracts_overlap_wizard();
	// Error keys of the fields whose id differs from the value's name
	const errorKey: Record<string, string> = { tenant: 'tenantId', apartment: 'apartmentId' };
	const params = untrack(() => $page.url.searchParams);
	const today = new Date().toLocaleDateString('sv-SE'); // local YYYY-MM-DD
	let values = $state(initialContractValues(undefined, params));
	let step = $state(1);
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let savedAt = $state<Date | null>(null);
	let restored = $state<{ at: Date; dropped: boolean } | null>(null);
	let touched = $state(false); // a draft is kept only once the user has entered something
	let confirmedPastStart = ''; // a start in the past the user confirmed by pressing "Weiter" again
	let startEdited = false; // the suggestion never overwrites a start date being typed
	let section = $state<HTMLElement>();
	// per apartment; null for an apartment whose contracts could not be loaded: it is not shown as free (#143)
	let contracts = $state<Map<string, ContractForAvailability[] | null> | null>(null);

	const availability = $derived(
		new Map(
			[...(contracts ?? [])].flatMap(([id, list]) =>
				list ? [[id, computeAvailability(list)] as const] : []
			)
		)
	);
	const unknown = $derived(contracts?.get(values.apartmentId) === null);
	const startLimit = $derived(availableFrom(availability.get(values.apartmentId), true));
	const overlap = $derived(overlapWarning(values, contracts?.get(values.apartmentId) ?? []));

	const contractsOf = async (apartmentId: string) =>
		[apartmentId, forAvailability(await apiCall(`/contracts?apartmentId=${apartmentId}`))] as const;

	function restoreDraft() {
		const draft = readDraft<ContractFormValues>(browserStorage(), DRAFT);
		if (!draft) return;
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

	onMount(() => {
		restoreDraft();
		Promise.all(apartments.map((a) => contractsOf(a.id))).then(
			(entries) => (contracts = new Map(entries))
		);
		// A notice shown right after a page change is read out only when it takes the focus
		tick().then(() =>
			document
				.querySelector<HTMLElement>(
					'[data-testid="tenant-created"], [data-testid="draft-restored"]'
				)
				?.focus()
		);
	});

	$effect(() => {
		const snapshot = $state.snapshot(values);
		if (touched) savedAt = writeDraft(browserStorage(), DRAFT, snapshot, new Date());
	});

	// Once an apartment is chosen, the contract starts by default on the day it becomes free
	$effect(() => {
		const info = availability.get(values.apartmentId);
		untrack(() => {
			const start = suggestedStartDate(values.startDate, info);
			if (start && !startEdited) values.startDate = start;
		});
	});

	function edited(event: Event) {
		touched = true;
		const id = (event.target as HTMLElement).id;
		if (id === 'startDate') startEdited = true;
		delete errors[errorKey[id] ?? id];
		if (errors.startDate === OVERLAP) delete errors.startDate; // any period change may resolve it
	}

	async function goTo(target: number) {
		step = target;
		await tick();
		section?.querySelector<HTMLElement>('h2')?.focus();
	}

	// "… ändern" in the review: the step, with the focus on the field to change
	async function editField(target: number, field: string) {
		await goTo(target);
		section?.querySelector<HTMLElement>(`[id="${field}"], [name="${field}"]`)?.focus();
	}

	// After a failed step the first field with an error gets the focus, so its error is read out
	async function showErrors(target: number) {
		if (target !== step) await goTo(target);
		await focusFirstError(section);
	}

	function discardDraft() {
		clearDraft(browserStorage(), DRAFT);
		values = initialContractValues(undefined, params);
		restored = null;
		savedAt = null;
		touched = false;
		startEdited = false;
		errors = {};
		goTo(1);
	}

	async function save() {
		errors = validateContract(values);
		const wrong = firstStepWithError(errors);
		if (wrong) return showErrors(wrong);
		saving = true;
		const response = await apiCall('/contracts', { method: 'POST', body: contractBody(values) });
		saving = false;
		if (response.error) {
			// the backend answers in English; the only refusal a valid form can meet is an overlap
			errors = /overlap/i.test(response.error.message)
				? { form: OVERLAP }
				: { form: m.contracts_save_failed() };
			return;
		}
		touched = false;
		clearDraft(browserStorage(), DRAFT);
		const tenant = tenants.find((t) => t.id === values.tenantId)?.name;
		addToast('success', m.contracts_saved_toast({ name: String(tenant) }), 10_000); // long enough to read at large zoom
		await goto('/contracts');
	}

	// The overlap blocks; a start in the past only asks once, so it is read out and can be confirmed
	function periodWarnings(): Record<string, string> {
		if (overlap) return { startDate: OVERLAP };
		const past = startDateNotice(values.startDate, today);
		if (!past || confirmedPastStart === values.startDate) return {};
		confirmedPastStart = values.startDate;
		return { startDate: m.contracts_confirm_past({ notice: past }) };
	}

	function submitStep(event: SubmitEvent) {
		event.preventDefault();
		Object.assign(values, normalizeAmounts(values)); // in place: a new object would rerun the effects
		if (step === contractSteps.length) return save();
		errors = stepErrors(values, step);
		if (step === 3 && !errors.startDate) errors = { ...errors, ...periodWarnings() };
		if (Object.keys(errors).length > 0) return showErrors(step);
		goTo(step + 1);
	}
</script>

<form
	onsubmit={submitStep}
	oninput={edited}
	onchange={edited}
	novalidate
	class="flex flex-col gap-8"
	data-testid="contract-wizard"
>
	{#if restored}
		<DraftNotice savedAt={restored.at} ondiscard={discardDraft}>
			{#if restored.dropped}
				<p>{m.contracts_draft_dropped()}</p>
			{/if}
		</DraftNotice>
	{/if}

	<Stepper steps={contractSteps.map((s) => s.label)} current={step} onselect={goTo} />

	<section
		bind:this={section}
		aria-labelledby="step-heading"
		class="flex flex-col gap-6 rounded-panel border border-line bg-surface p-6"
	>
		<!-- focused on every step change: screen readers hear where they are -->
		<h2 id="step-heading" tabindex="-1" class="text-2xl font-bold text-ink">
			<span class="sr-only"
				>{m.contracts_step_of({ current: step, total: contractSteps.length })}</span
			>
			<span data-step-label>{contractSteps[step - 1].label}</span>
		</h2>
		{#if step === 1}
			<TenantStep
				bind:tenantId={values.tenantId}
				{tenants}
				createdId={params.has('created') ? params.get('tenant') : null}
				error={errors.tenantId}
			/>
		{:else if step === 2}
			<ApartmentStep
				bind:apartmentId={values.apartmentId}
				{apartments}
				{availability}
				loading={!contracts}
				notice={startLimit.notice}
				{unknown}
				error={errors.apartmentId}
			/>
		{:else if step === 3}
			<PeriodStep
				bind:startDate={values.startDate}
				bind:endDate={values.endDate}
				bind:isUnlimited={values.isUnlimited}
				min={startLimit.min}
				{unknown}
				{today}
				{overlap}
				{errors}
			/>
		{:else if step === 4}
			<RentStep bind:values {errors} />
		{:else}
			<ReviewStep {values} {tenants} {apartments} onedit={editField} />
			{#if errors.form}
				<Alert tone="critical" title={m.contracts_not_saved()} testid="form-error">
					<p>{errors.form}</p>
				</Alert>
			{/if}
		{/if}
	</section>

	<SaveStatus {savedAt} />
	<WizardNav
		{step}
		last={contractSteps.length}
		onback={() => goTo(step - 1)}
		finalLabel={m.contracts_save()}
		busy={saving}
		cancelHref="/contracts"
	/>
</form>
