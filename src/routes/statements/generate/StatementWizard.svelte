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
	let confirmed = $state(false); // statements despite buildings without invoices
	let generating = $state(false);
	let touched = $state(false); // a draft is kept only once the user has chosen something
	let savedAt = $state<Date | null>(null);
	let restoredAt = $state<Date | null>(null);
	let section = $state<HTMLElement>();

	const previewRows = $derived(form?.preview ?? []);
	const invoices = $derived(form?.invoices ?? []);
	const missingInvoices = $derived(invoices.some((i) => i.count === 0));
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
	});

	$effect(() => {
		const snapshot = $state.snapshot(selection);
		if (touched) savedAt = writeDraft(browserStorage(), DRAFT, snapshot, new Date());
	});

	// A server answer moves on: the preview to step 4, the created drafts to the result
	$effect(() => {
		if (form?.preview) untrack(() => goTo(4));
		if (form?.created != null) untrack(() => clearDraft(browserStorage(), DRAFT));
	});

	async function goTo(target: number) {
		step = target;
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
		errors = selectionErrors(selection, step);
		if (step === 4 && missingInvoices && !confirmed) errors = { confirm: CONFIRM };
		if (Object.keys(errors).length > 0) return (stay(), showErrors());
		if (step === 3 || step === 5) {
			generating = step === 5;
			return;
		}
		stay();
		goTo(step + 1);
	}
</script>

<form
	method="POST"
	action={step === 5 ? '?/generate' : '?/preview'}
	onsubmit={submitStep}
	oninput={() => (touched = true)}
	onchange={() => (touched = true)}
	use:enhance={() =>
		async ({ update }) => {
			await update({ reset: false, invalidateAll: false });
			generating = false;
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

	{#if restoredAt}
		<DraftNotice savedAt={restoredAt} ondiscard={discardDraft} />
	{/if}

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
		{#if form?.error}
			<Alert tone="critical" title="Das hat nicht geklappt" testid="server-error">
				<p>{form.error}</p>
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
			busy={generating}
			cancelHref="/statements"
		/>
	{/if}
</form>
