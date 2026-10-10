<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, tick, untrack } from 'svelte';
	import {
		invoiceRows,
		restoredSelection,
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
			distributionKeys: { id: string; name: string }[];
			defaultManagementFeePercent: number;
			defaultHeatingProfileId: string;
			defaultPeriod: { start: string; end: string };
		};
		form: {
			preview?: PreviewRow[];
			invoices?: Parameters<typeof invoiceRows>[0];
			created?: number;
			error?: string;
		} | null;
	} = $props();

	const DRAFT = 'statements';
	const CONFIRM = 'Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.';
	const busyLabels: Record<number, string> = {
		3: 'Vorschau wird berechnet …',
		5: 'Entwürfe werden erstellt …'
	};
	const NOTHING = 'Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude.';
	const fresh = (): WizardSelection => ({
		periodStart: data.defaultPeriod.start,
		periodEnd: data.defaultPeriod.end,
		heatingProfileId: data.defaultHeatingProfileId,
		managementFeePercent: data.defaultManagementFeePercent,
		managementFeeDistributionKeyId: '',
		buildingIds: []
	});

	let selection = $state(untrack(fresh));
	let step = $state(untrack(() => (form?.created != null ? 5 : form?.preview ? 4 : 1)));
	let errors = $state<Record<string, string>>({});
	let confirmed = $state(false); // statements despite buildings without invoices, for this preview only
	let busy = $state(false); // the server is calculating the preview or creating the drafts
	let touched = $state(false); // a draft is kept only once the user has chosen something
	let savedAt = $state<Date | null>(null);
	let restoredAt = $state<Date | null>(null);
	let resumed = $state(false); // back from "Rechnung erfassen", on the step before the preview
	let section = $state<HTMLElement>();

	// The last preview stays when creating the drafts fails
	let previewRows = $state(untrack(() => form?.preview ?? []));
	let invoices = $state(untrack(() => form?.invoices ?? []));
	let shownError = $state(untrack(() => form?.error ?? '')); // only until the user moves on
	// No invoices, or statements that already exist: going on needs a confirmation
	const needsConfirmation = $derived(
		invoices.some((i) => i.count === 0 || (i.statements ?? 0) > 0)
	);
	const statusText = $derived(busy ? busyLabels[step] : '');
	const periodLabel = $derived(
		`${formatDate(selection.periodStart)} – ${formatDate(selection.periodEnd)}`
	);

	onMount(() => {
		if (form) return; // coming back from the server, not a new visit
		const draft = readDraft<WizardSelection>(browserStorage(), DRAFT);
		if (!draft) return;
		selection = restoredSelection(draft.values, {
			buildingIds: data.buildings.map((b) => b.id),
			heatingProfileIds: data.heatingProfiles.map((p) => p.id)
		});
		restoredAt = draft.savedAt;
		// Back from "Rechnung erfassen": the step before the preview, so "Weiter" calculates it anew
		const complete = [1, 2].every((n) => !Object.keys(selectionErrors(selection, n)).length);
		if (new URL(location.href).searchParams.get('schritt') === '3' && complete) {
			step = 3;
			resumed = true;
		}
	});

	$effect(() => {
		const snapshot = $state.snapshot(selection);
		if (touched) savedAt = writeDraft(browserStorage(), DRAFT, snapshot, new Date());
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

	async function showErrors() {
		await tick();
		section
			?.querySelector<HTMLElement>(
				':is(input, select, textarea)[aria-invalid="true"], [data-testid="confirm-missing-invoices"]'
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
		errors = { ...selectionErrors(selection, step), ...(step === 4 ? previewErrors() : {}) };
		if (Object.keys(errors).length > 0) return (stay(), showErrors());
		if (step === 3 || step === 5) return void (busy = true); // to the server through `enhance`
		stay();
		goTo(step + 1);
	}

	function previewErrors(): Record<string, string> {
		if (previewRows.length === 0) return { preview: NOTHING };
		return needsConfirmation && !confirmed ? { confirm: CONFIRM } : {};
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
		clearDraft(browserStorage(), DRAFT);
		return goTo(5);
	}
</script>

<form
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
	<input
		type="hidden"
		name="managementFeeDistributionKeyId"
		value={selection.managementFeeDistributionKeyId}
	/>
	<input type="hidden" name="buildingIds" value={selection.buildingIds.join(',')} />

	<DraftNotice savedAt={restoredAt} ondiscard={discardDraft}>
		<!-- Back from "Rechnung erfassen": why the wizard shows the step before the preview -->
		<p class:hidden={!resumed || step !== 3} data-testid="resume-notice">
			Mit «Weiter» berechnet Dwello die Vorschau mit der neuen Rechnung.
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
			<span class="sr-only">Schritt {step} von {statementSteps.length}:</span>
			<span data-step-label>{statementSteps[step - 1]}</span>
		</h2>
		{#if shownError}
			<Alert tone="critical" title="Das hat nicht geklappt" testid="server-error">
				<p>{shownError}</p>
			</Alert>
		{/if}
		<StatementStep
			{step}
			{data}
			bind:selection
			bind:confirmed
			{errors}
			{previewRows}
			{invoices}
			{periodLabel}
			createdCount={form?.created ?? null}
		/>
	</section>

	{#if form?.created == null}
		<SaveStatus {savedAt} />
		<WizardNav
			{step}
			last={statementSteps.length}
			onback={() => goTo(step - 1)}
			finalLabel="Entwürfe erstellen"
			finalTestid="generate-statements-button"
			{busy}
			busyLabel={busyLabels[step]}
			cancelHref="/statements"
		/>
	{/if}
</form>
