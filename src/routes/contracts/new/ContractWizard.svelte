<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { backendMessage } from '$lib/backend-error';
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
		lastRent,
		normalizeAmounts,
		rentTakenOver,
		rentToPreset,
		type ListedContract,
		startDateNotice,
		startValues,
		stepErrors,
		offeredBilledUntil
	} from '$lib/contract-wizard';
	import { contractPeriod } from '$lib/contract-status';
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
	import OpenContracts from './OpenContracts.svelte';
	import { retried } from './ContractsUnknown.svelte';
	import PeriodStep from './PeriodStep.svelte';
	import RentStep from './RentStep.svelte';
	import ReviewStep from './ReviewStep.svelte';
	import TenantStep from './TenantStep.svelte';

	// "Mietvertrag erfassen" in five steps; the input is kept as a draft in this browser until it is saved
	let {
		tenants,
		apartments,
		categories,
		agreed = null
	}: {
		tenants: { id: string; name: string; place?: string }[];
		apartments: {
			id: string;
			unit: string;
			building: string;
			size?: string;
			blocked?: boolean; // whether a new contract can be recorded, as the backend decides (#815)
			availableFrom?: string | null;
		}[];
		categories: { id: string; name: string }[]; // the umlagefähige ones it can agree (#91)
		agreed?: string[] | null; // a contract from the old one: its agreed Nebenkosten (#368)
	} = $props();

	const DRAFT = 'contract';
	const OVERLAP = m.contracts_overlap_wizard();
	// Error keys of the fields whose id differs from the value's name
	const errorKey: Record<string, string> = { tenant: 'tenantId', apartment: 'apartmentId' };
	const params = untrack(() => $page.url.searchParams);
	const today = new Date().toLocaleDateString('sv-SE'); // local YYYY-MM-DD
	let values = $state(
		untrack(() => ({
			...initialContractValues(undefined, params),
			...(agreed && { agreedCategoryIds: agreed })
		}))
	);
	let step = $state(1);
	const agreedHelp = $derived(agreed ? m.contracts_agreed_costs_help_follow_up() : undefined);
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
	let listed = $state(new Map<string, Parameters<typeof lastRent>[0]>()); // the answers, for their amounts (#144)
	let preset: ReturnType<typeof lastRent> = null; // the amounts filled in last

	const availability = $derived(
		new Map(
			[...(contracts ?? [])].map(([id, list]) => [
				id,
				list && computeAvailability(apartments.find((a) => a.id === id) ?? {})
			])
		)
	);
	const unknown = $derived(contracts?.get(values.apartmentId) === null);
	const loading = $derived(step === 2 && !contracts); // «Weiter» waits for the apartments' contracts (#468)
	const startLimit = $derived(availableFrom(availability.get(values.apartmentId)));
	const overlap = $derived(overlapWarning(values, contracts?.get(values.apartmentId) ?? []));
	// contracts of the chosen tenant without a Vertragsende (#156)
	const openContracts = $derived(
		apartments.flatMap((apartment) =>
			(contracts?.get(apartment.id) ?? [])
				.filter((c) => c.tenant_id === values.tenantId && !c.end_date)
				.map((c) => ({ id: c.id, apartment }))
		)
	);
	const tenantName = $derived(tenants.find((t) => t.id === values.tenantId)?.name ?? '');

	const contractsOf = async (apartmentId: string) => {
		const response = await apiCall<{ contracts: ListedContract[] }>(
			`/contracts?apartmentId=${apartmentId}`
		);
		return [apartmentId, forAvailability(response), response] as const;
	};
	// the amounts of the apartment's contract before this one, while the fields still hold them (#144)
	const taken = $derived(lastRent(listed.get(values.apartmentId) ?? {}, values.startDate));
	const takenFrom = $derived(
		taken && rentTakenOver(values, taken)
			? contractPeriod(taken.startDate, taken.endDate, taken.status, taken.terminated)
			: null
	);

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
		// a contract from the old one keeps that one's agreed Nebenkosten (#368, code review C-1)
		values = { ...start.values, ...(agreed && { agreedCategoryIds: agreed }) };
		restored = { at: draft.savedAt, dropped: start.dropped };
	}

	// also «Erneut versuchen» when the chosen apartment's contracts could not be loaded; the input stays (#151)
	let loads = 0; // only the latest load counts (review #151 R2-4); true when this one is it
	async function loadContracts() {
		const load = ++loads;
		const entries = await Promise.all(apartments.map((a) => contractsOf(a.id)));
		if (load === loads) {
			contracts = new Map(entries.map(([id, list]) => [id, list]));
			listed = new Map(entries.map(([id, , response]) => [id, response]));
		}
		return load === loads;
	}

	async function retry() {
		if (!(await loadContracts())) return;
		await tick();
		retried(unknown, section?.querySelector('h2'));
	}

	onMount(() => {
		restoreDraft();
		loadContracts();
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

	// On the step «Miete», the amounts of the apartment's last contract, never over typed ones (#144)
	$effect(() => {
		if (step !== 4) return;
		const rent = taken;
		untrack(() => {
			const next = rentToPreset(values, rent, preset);
			if (!next) return;
			Object.assign(values, next); // in place: a new object would rerun the effects
			preset = rent;
		});
	});

	function edited(event: Event) {
		touched = true;
		const { id, name } = event.target as HTMLInputElement;
		if (id === 'startDate') startEdited = true;
		delete errors[errorKey[id] ?? id];
		if (name) delete errors[name]; // a radio group's error is named after the group (#89)
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
		const response = await apiCall('/contracts', {
			method: 'POST',
			body: contractBody(offeredBilledUntil(values, today), categories)
		});
		saving = false;
		if (response.error) {
			// the backend answers in English: an overlap, or «Abgerechnet bis» after the browser's today (#453)
			errors = /overlap/i.test(response.error.message)
				? { form: OVERLAP }
				: { form: savedFailed(response.error.details) };
			return;
		}
		touched = false;
		clearDraft(browserStorage(), DRAFT);
		const tenant = tenants.find((t) => t.id === values.tenantId)?.name;
		addToast('success', m.contracts_saved_toast({ name: String(tenant) }), 10_000); // long enough to read at large zoom
		await goto('/contracts');
	}

	// a coded refusal in words; without a code never the backend's English (code review 453-1 C-2)
	const savedFailed = (details?: Record<string, unknown>) =>
		details?.code ? backendMessage(details, m.contracts_save_failed()) : m.contracts_save_failed();

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
		errors = stepErrors(values, step, today);
		if (step === 3 && !errors.startDate && !errors.billedUntil)
			errors = { ...errors, ...periodWarnings() };
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
				apartmentId={values.apartmentId}
				{tenants}
				createdId={params.has('created') ? params.get('tenant') : null}
				error={errors.tenantId}
			/>
		{:else if step === 2}
			<OpenContracts name={tenantName} contracts={openContracts} />
			<ApartmentStep
				bind:apartmentId={values.apartmentId}
				{apartments}
				{availability}
				loading={!contracts}
				notice={startLimit.notice}
				{unknown}
				onretry={retry}
				error={errors.apartmentId}
			/>
		{:else if step === 3}
			<PeriodStep
				bind:startDate={values.startDate}
				bind:endDate={values.endDate}
				bind:isUnlimited={values.isUnlimited}
				bind:billedUntil={values.billedUntil}
				offerBilledUntil
				min={startLimit.min}
				{unknown}
				onretry={retry}
				{today}
				{overlap}
				{errors}
			/>
		{:else if step === 4}
			<RentStep
				bind:values
				{errors}
				{takenFrom}
				{categories}
				{agreedHelp}
			/>
		{:else}
			<ReviewStep
				values={offeredBilledUntil(values, today)}
				{tenants}
				{apartments}
				{categories}
				{unknown}
				onretry={retry}
				onedit={editField}
			/>
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
		{loading}
		cancelHref="/contracts"
	/>
</form>
