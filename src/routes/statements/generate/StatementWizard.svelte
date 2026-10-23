<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { onMount, tick, untrack } from 'svelte';
	import {
		invoiceRows,
		needsConfirmation,
		restoredSelection,
		restoredStep,
		droppedNotes,
		selectionErrors,
		statementSteps,
		type WizardSelection
	} from '$lib/statement-wizard';
	import type { Building, HeatingProfile } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import DraftNotice from '$lib/ui/DraftNotice.svelte';
	import SaveStatus from '$lib/ui/SaveStatus.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import WizardNav from '$lib/ui/WizardNav.svelte';
	import { formatDate } from '$lib/utils/format';
	import { browserStorage, clearDraft, readDraft, writeDraft } from '$lib/wizard-draft';
	import LateChecks from './LateChecks.svelte';
	import PresetNotice from './PresetNotice.svelte';
	import StatementStep from './StatementStep.svelte';
	import type { PreviewRow } from './preview';

	// "Abrechnungen erstellen" in five steps; the preview (step 4) and the generation (step 5) run on the server
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
			defaultBuildingIds: string[]; // chosen by the link that opened the wizard (A-10)
			preset?: {
				building: string;
				start: string;
				end: string;
				fromStatements: boolean;
				feeFromSettings: boolean;
			} | null;
		};
		form: {
			preview?: PreviewRow[];
			invoices?: Parameters<typeof invoiceRows>[0];
			created?: string[];
			error?: string;
		} | null;
	} = $props();

	const DRAFT = 'statements';
	const CONFIRM = m.statements_confirm_needed();
	const busyLabels: Record<number, string> = {
		3: m.statements_preview_busy(),
		5: m.statements_drafts_busy()
	};
	const NOTHING = m.statements_nothing();
	const fresh = (): WizardSelection => ({
		periodStart: data.defaultPeriod.start,
		periodEnd: data.defaultPeriod.end,
		heatingProfileId: data.defaultHeatingProfileId,
		managementFeePercent: data.defaultManagementFeePercent,
		buildingIds: [...data.defaultBuildingIds]
	});

	let selection = $state(untrack(fresh));
	// a link that chose building and period opens the settings, the step before the preview
	const chosen = untrack(() => data.defaultBuildingIds.length > 0);
	let step = $state(
		untrack(() => (form?.created != null ? 5 : form?.preview ? 4 : chosen ? 3 : 1))
	);
	let errors = $state<Record<string, string>>({});
	let confirmed = $state(false); // statements despite buildings without invoices, for this preview only
	let agreementsBlocking = $state(false); // step 3: whether the contracts agree the period's costs is open (#91)
	let busy = $state(false); // the server is calculating the preview or creating the drafts
	// the step still loads what it shows: «Weiter» waits (#468); step 2 its buildings' rows, step 3 the checks below
	let buildingsLoading = $state(false);
	let checksLoading = $state(false);
	const loading = $derived(buildingsLoading || checksLoading);
	// #470: said at the top of the step, seen without scrolling
	// its place is kept once loaded, so it does not move «Weiter» up (code review 470-1 C-2)
	const loadingText = $derived(
		step === 2
			? m.statements_buildings_loading()
			: step === 3
				? m.statements_agreements_loading()
				: ''
	);
	let touched = $state(false); // a draft is kept only once the user has chosen something
	let savedAt = $state<Date | null>(null);
	let restoredAt = $state<Date | null>(null);
	let dropped = $state({ buildings: 0, heatingProfile: false }); // what the draft named and is gone meanwhile
	let resumed = $state(false); // back from "Rechnung erfassen", on the step before the preview
	let section = $state<HTMLElement>();
	let wizard = $state<HTMLFormElement>();

	// The last preview stays when creating the drafts fails
	let previewRows = $state(untrack(() => form?.preview ?? []));
	let invoices = $state(untrack(() => form?.invoices ?? []));
	let shownError = $state(untrack(() => form?.error ?? '')); // only until the user moves on
	const confirmationNeeded = $derived(needsConfirmation(invoices));
	const statusText = $derived(busy ? busyLabels[step] : loading ? loadingText : '');
	const periodLabel = $derived(
		`${formatDate(selection.periodStart)} – ${formatDate(selection.periodEnd)}`
	);

	onMount(() => {
		if (form || chosen) return; // coming back from the server, or a link chose for this visit
		const draft = readDraft<WizardSelection & { step?: number }>(browserStorage(), DRAFT);
		if (!draft) return;
		const { step: left, ...values } = draft.values;
		({ selection, dropped } = restoredSelection(values, {
			buildingIds: data.buildings.map((b) => b.id),
			heatingProfileIds: data.heatingProfiles.map((p) => p.id)
		}));
		restoredAt = draft.savedAt;
		// In the step it was left in (#201); back from "Rechnung erfassen" the step before the preview, so "Weiter"
		// calculates it anew; a building gone meanwhile is checked first, in step 2 (code review C-5)
		const back = new URL(location.href).searchParams.get('schritt') === '3';
		step = restoredStep(back ? 3 : left, selection, dropped);
		resumed = back && step === 3;
	});

	// #470: what a step loads late never moves «Weiter» on the screen: the page scrolls by the height it added above
	$effect.pre(() => {
		if (loading) return;
		const next = untrack(() => wizard?.querySelector<HTMLElement>('[data-testid="wizard-next"]'));
		const before = next?.getBoundingClientRect().top;
		tick().then(() => {
			const moved = before === undefined ? 0 : next!.getBoundingClientRect().top - before;
			if (moved) window.scrollBy(0, moved);
		});
	});

	$effect(() => {
		const snapshot = { ...$state.snapshot(selection), step };
		if (touched) savedAt = writeDraft(browserStorage(), DRAFT, snapshot, new Date());
	});

	// «Weiter» waited for the check of the agreed Nebenkosten: the wizard goes on once it is done (#439)
	$effect(() => {
		if (step === 3 && errors.agreements && !agreementsBlocking) wizard?.requestSubmit();
	});

	async function goTo(target: number) {
		step = target;
		shownError = '';
		await focusHeading();
	}

	async function focusHeading() {
		await tick();
		section?.querySelector<HTMLElement>('h2')?.focus();
	}

	// in the whole form: step 3's questions are below «Weiter» (#470, code review 470-1 C-1)
	async function showErrors() {
		await tick();
		wizard
			?.querySelector<HTMLElement>(
				':is(input, select, textarea)[aria-invalid="true"], [role="radiogroup"][aria-invalid="true"] input, [data-testid="confirm-missing-invoices"]'
			)
			?.focus();
	}

	// An input counts for the draft and clears the errors of its step
	function edited() {
		touched = true;
		errors = {};
	}

	function discardDraft() {
		clearDraft(browserStorage(), DRAFT);
		selection = fresh();
		restoredAt = null;
		savedAt = null;
		touched = false;
		goTo(1);
	}

	// Steps 1, 2 and 4 stay in the browser; steps 3 and 5 go to the server through `enhance`
	function submitStep(event: SubmitEvent) {
		const stay = () => {
			event.preventDefault();
			event.stopImmediatePropagation();
		};
		errors = {
			...selectionErrors(selection, step),
			...(step === 3 && agreementsBlocking ? { agreements: m.statements_agreement_error() } : {}),
			...(step === 4 ? previewErrors() : {})
		};
		if (Object.keys(errors).length > 0) return (stay(), showErrors());
		if (step === 3 || step === 5) return void (busy = true); // to the server through `enhance`
		stay();
		goTo(step + 1);
	}

	function previewErrors(): Record<string, string> {
		if (previewRows.length === 0) return { preview: NOTHING };
		if (invoices.some((row) => row.uncategorized?.length))
			return { uncategorized: m.statements_uncategorized_error() };
		return confirmationNeeded && !confirmed ? { confirm: CONFIRM } : {};
	}

	// A server answer: the preview leads to step 4 (a new preview needs a new confirmation), drafts to the result
	async function answered(result: { type: string; data?: Record<string, unknown> }) {
		busy = false;
		if (result.type !== 'success') {
			shownError = form?.error ?? '';
			return focusHeading(); // the busy button lost the focus
		}
		const data = result.data ?? {};
		if ('created' in data) return created();
		previewRows = data.preview as PreviewRow[];
		invoices = data.invoices as typeof invoices;
		confirmed = false;
		await goTo(4);
	}

	function created() {
		touched = false; // nothing left to keep
		clearDraft(browserStorage(), DRAFT);
		return goTo(5);
	}
</script>

<form
	bind:this={wizard}
	method="POST"
	action={step === 5 ? '?/generate' : '?/preview'}
	onsubmit={submitStep}
	oninput={edited}
	onchange={edited}
	use:enhance={() =>
		async ({ update, result }) => {
			await update({ reset: false, invalidateAll: false });
			await answered(result as { type: string; data?: Record<string, unknown> });
		}}
	novalidate
	class="flex flex-col gap-8"
	data-testid="statement-wizard"
>
	<input type="hidden" name="periodStart" value={selection.periodStart} />
	<input type="hidden" name="periodEnd" value={selection.periodEnd} />
	<input type="hidden" name="heatingProfileId" value={selection.heatingProfileId} />
	<input type="hidden" name="managementFeePercent" value={selection.managementFeePercent} />
	<input type="hidden" name="buildingIds" value={selection.buildingIds.join(',')} />

	<DraftNotice savedAt={restoredAt} ondiscard={discardDraft} notes={droppedNotes(dropped)}>
		<!-- Back from "Rechnung erfassen": why the wizard shows the step before the preview -->
		<p class:hidden={!resumed || step !== 3} data-testid="resume-notice">
			{m.statements_resume()}
		</p>
	</DraftNotice>

	<!-- read out while the server works: the busy button itself cannot keep the focus -->
	<p role="status" class="sr-only" data-testid="wizard-status">{statusText}</p>

	<Stepper steps={statementSteps} current={step} onselect={goTo} />

	<section
		bind:this={section}
		aria-labelledby="step-heading"
		class="flex flex-col gap-6 rounded-panel border border-line bg-surface p-6"
	>
		<h2 id="step-heading" tabindex="-1" class="text-2xl font-bold text-ink">
			<span class="sr-only"
				>{m.contracts_step_of({ current: step, total: statementSteps.length })}</span
			>
			<span data-step-label data-testid="statement-step-label">{statementSteps[step - 1]}</span>
		</h2>
		<PresetNotice preset={data.preset} {step} />
		<!-- read out by the wizard's status above -->
		<p
			aria-hidden="true"
			class="text-ink-muted"
			class:hidden={!loadingText}
			class:invisible={!loading}
			data-testid="step-loading"
		>
			{loadingText}
		</p>
		{#if shownError}
			<Alert tone="critical" title={m.ui_action_failed()} testid="server-error">
				<p>{shownError}</p>
			</Alert>
		{/if}
		<StatementStep
			{step}
			{data}
			bind:selection
			bind:confirmed
			bind:loading={buildingsLoading}
			{errors}
			{previewRows}
			{invoices}
			{periodLabel}
			created={form?.created ?? null}
		/>
	</section>

	{#if form?.created == null}
		<SaveStatus {savedAt} />
		<WizardNav
			{step}
			last={statementSteps.length}
			onback={() => goTo(step - 1)}
			finalLabel={m.statements_create_drafts()}
			finalTestid="generate-statements-button"
			{busy}
			{loading}
			busyLabel={busyLabels[step]}
			cancelHref="/statements"
		/>
		<LateChecks
			{step}
			buildingIds={selection.buildingIds}
			period={{ start: selection.periodStart, end: selection.periodEnd }}
			bind:blocking={agreementsBlocking}
			bind:loading={checksLoading}
			error={errors.agreements}
		/>
	{/if}
</form>
