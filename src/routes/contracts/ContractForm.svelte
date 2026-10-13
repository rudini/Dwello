<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { apiCall } from '$lib/api';
	import {
		availableFrom,
		contractBody,
		forAvailability,
		initialContractValues,
		overlapWarning,
		validateContract
	} from '$lib/contract-form';
	import {
		contractStatusOn,
		localToday,
		pastEndConfirmation,
		billedDaysError,
		type RefusedStatement
	} from '$lib/contract-status';
	import { wizardLink } from '$lib/statement-wizard';
	import { backendMessage } from '$lib/backend-error';
	import { normalizeAmounts, stepErrors } from '$lib/contract-wizard';
	import { addToast } from '$lib/stores';
	import type { RentalContract } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Panel from '$lib/ui/Panel.svelte';
	import Select from '$lib/ui/Select.svelte';
	import {
		computeAvailability,
		type AvailabilityInfo,
		type ContractForAvailability
	} from '$lib/utils/contract-availability';
	import ApartmentStep from './new/ApartmentStep.svelte';
	import PeriodStep from './new/PeriodStep.svelte';
	import RentStep from './new/RentStep.svelte';
	import PastEndConfirm from './PastEndConfirm.svelte';
	import RefusedStatements from './RefusedStatements.svelte';
	import NoticeHint from './NoticeHint.svelte';

	// Form of a contract being edited, with the fields, help and checks of the wizard in ./new
	let {
		contract,
		tenants,
		apartments
	}: {
		contract: RentalContract;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string }[];
	} = $props();

	const errorKey: Record<string, string> = { tenant: 'tenantId', apartment: 'apartmentId' };
	let values = $state(untrack(() => initialContractValues(contract, $page.url.searchParams)));
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let refused = $state<RefusedStatement[]>([]); // statements that refused the last save
	// the chosen apartment's contracts, for the overlap check: an overlap shows only once they are loaded
	let contractsState = $state<'loading' | 'loaded' | 'failed'>('loading');
	let contractsRequest = 0;
	let availability = $state<Map<string, AvailabilityInfo> | null>(null);
	let apartmentContracts = $state<ContractForAvailability[]>([]);
	let form = $state<HTMLFormElement>();

	const today = localToday();
	// Only a start moved before the saved one and into the past is questioned
	const pastBefore = untrack(() => [today, values.startDate].sort()[0]);
	const running = $derived(
		contractStatusOn(contract.startDate, contract.endDate, today) === 'active'
	);
	// the chosen apartment's contracts could not be loaded: it is not shown as free (#143)
	const unknown = $derived(contractsState === 'failed');
	const startLimit = $derived(
		availableFrom(
			availability?.get(values.apartmentId),
			values.apartmentId !== contract.apartmentId
		)
	);
	// a changed Vertragsende in the past is confirmed as in «Beenden»; an unchanged one is not asked again
	const endChanged = $derived(
		!values.isUnlimited && values.endDate !== (contract.endDate?.slice(0, 10) ?? '')
	);
	let confirmedDay = $state('');
	const overlap = $derived(overlapWarning(values, apartmentContracts, contract.id));
	const back = $derived(`/contracts/${contract.id}`);
	// «Befristet» for a contract saved open-ended: a notice is entered with «Beenden» (Sven K1 M1); a saved notice
	// always has an end (backend `checkNotice`)
	const noticeHint = $derived(!contract.endDate && !values.isUnlimited && !values.terminated);
	const tenantName = $derived(tenants.find((t) => t.id === values.tenantId)?.name ?? '');

	const contractsOf = async (apartmentId: string) =>
		forAvailability(await apiCall(`/contracts?apartmentId=${apartmentId}`));

	// The contract being edited does not block its own apartment; an apartment whose contracts are unknown is left out
	async function availabilityOf(apartmentId: string) {
		const own = apartmentId === contract.apartmentId ? contract.id : undefined;
		const list = await contractsOf(apartmentId);
		return list ? [[apartmentId, computeAvailability(list, own)] as const] : [];
	}

	$effect(() => {
		Promise.all(apartments.map((a) => availabilityOf(a.id))).then(
			(entries) => (availability = new Map(entries.flat()))
		);
	});

	// Contracts of the chosen apartment, for the overlap check
	$effect(() => {
		const apartmentId = values.apartmentId;
		const request = ++contractsRequest; // only the latest answer counts, also after switching back
		apartmentContracts = []; // the previous apartment's contracts say nothing about this one
		contractsState = apartmentId ? 'loading' : 'loaded';
		if (!apartmentId) return;
		contractsOf(apartmentId).then((list) => {
			if (request !== contractsRequest) return;
			apartmentContracts = list ?? [];
			contractsState = list ? 'loaded' : 'failed';
		});
	});

	function edited(event: Event) {
		const id = (event.target as HTMLElement).id;
		delete errors[errorKey[id] ?? id];
		// the offer belongs to the values refused (review K-2); its message points to it below
		if (refused.length) delete errors.form;
		refused = [];
	}

	// the backend answers in English: a valid form is refused for an overlap or a statement after the end
	function saveError({ message, details }: { message: string; details?: Record<string, unknown> }) {
		if (Array.isArray(details?.statements)) return billedDaysError(details.statements);
		if (/overlap/i.test(message)) return m.backend_contract_overlap();
		return m.contracts_save_failed();
	}

	// the fields' errors; true when the form may be sent
	function valid() {
		Object.assign(values, normalizeAmounts(values)); // "1'450" as typed in Switzerland
		errors = { ...validateContract(values), ...stepErrors(values, 3) };
		const unconfirmed = endChanged && confirmedDay !== values.endDate;
		const pastConfirmed = unconfirmed && pastEndConfirmation(values.endDate, today);
		if (pastConfirmed) errors.pastConfirmed = pastConfirmed;
		return Object.keys(errors).length === 0;
	}

	// saves and opens `next`; a refusal names the statements it concerns (A-10)
	async function put(next: string) {
		saving = true;
		const response = await apiCall(back, { method: 'PUT', body: contractBody(values) });
		saving = false;
		if (response.error) {
			errors = { form: saveError(response.error) };
			const statements = response.error.details?.statements;
			refused = Array.isArray(statements) ? (statements as RefusedStatement[]) : [];
			return focusFirstError(form);
		}
		// a withdrawn notice says what changed, not only «gespeichert» (personas J1)
		const saved =
			contract.terminated && values.isUnlimited
				? m.contracts_notice_withdrawn_toast({ name: tenantName })
				: m.contracts_saved_toast({ name: tenantName });
		addToast('success', saved, 10_000);
		await goto(next);
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();
		if (!valid()) return focusFirstError(form);
		await put(back);
	}

	// the one draft the new dates would change goes first; the wizard then creates it anew (A-10)
	const contractsMessage = (state: typeof contractsState) =>
		state === 'loading'
			? m.contracts_apartment_contracts_loading()
			: m.contracts_apartment_contracts_unknown();

	async function deleteDraftAndSave(draft: RefusedStatement) {
		if (!valid()) return focusFirstError(form);
		// an overlap would refuse the save after the delete: the draft would be gone for nothing (review K-2);
		// without the apartment's contracts an overlap cannot be ruled out (Haiku review R5)
		if (overlap || contractsState !== 'loaded') {
			errors = { form: overlap ? m.backend_contract_overlap() : contractsMessage(contractsState) };
			refused = [];
			return focusFirstError(form);
		}
		saving = true;
		const deleted = await apiCall(`/statements/${draft.id}`, { method: 'DELETE' });
		saving = false;
		if (deleted.error) {
			errors = { form: backendMessage(deleted.error, m.contracts_save_failed()) };
			refused = [];
			return focusFirstError(form);
		}
		await put(wizardLink(draft.buildingId, draft.periodStart, draft.periodEnd));
	}
</script>

<form
	bind:this={form}
	onsubmit={save}
	oninput={edited}
	onchange={edited}
	novalidate
	class="flex flex-col gap-6"
>
	{#if running}
		<!-- TODO(fachlich prüfen, #66): the hint on legal notice periods is not from the glossary -->
		<Alert tone="caution" title={m.contracts_running_title()}>
			<p>{m.contracts_running_text()}</p>
		</Alert>
	{/if}

	<Panel title={m.contracts_tenant_and_apartment()}>
		<Select
			id="tenant"
			label={m.contracts_tenant()}
			help={m.contracts_tenant_help_short()}
			options={tenants.map((t) => ({ value: t.id, label: t.name }))}
			bind:value={values.tenantId}
			placeholder={m.contracts_choose_tenant()}
			error={errors.tenantId}
			testid="contract-tenant-select"
		/>
		<ApartmentStep
			bind:apartmentId={values.apartmentId}
			{apartments}
			availability={availability ?? new Map()}
			loading={!availability}
			notice={startLimit.notice}
			{unknown}
			error={errors.apartmentId}
		/>
	</Panel>

	<Panel title={m.contracts_period()}>
		<PeriodStep
			bind:startDate={values.startDate}
			bind:endDate={values.endDate}
			bind:isUnlimited={values.isUnlimited}
			bind:terminated={values.terminated}
			noticed={contract.terminated}
			min={startLimit.min}
			{unknown}
			today={pastBefore}
			{overlap}
			{errors}
		/>
		<PastEndConfirm
			endDate={endChanged ? values.endDate : ''}
			startDate={values.startDate}
			{today}
			bind:confirmedDay
			bind:error={() => errors.pastConfirmed ?? '', (error) => (errors.pastConfirmed = error)}
		/>
		<NoticeHint shown={noticeHint} href={back} />
	</Panel>

	<Panel title={m.contracts_rent()}>
		<RentStep bind:values {errors} />
	</Panel>

	{#if errors.form}
		<Alert tone="critical" title={m.contracts_not_saved()} testid="form-error">
			<p>{errors.form}</p>
		</Alert>
		{#if refused.length}
			<RefusedStatements statements={refused}>
				{#snippet action(draft, consequence)}
					<div>
						<Button
							variant="danger"
							icon="delete"
							busy={saving}
							busyLabel={m.ui_please_wait()}
							describedby={consequence}
							onclick={() => deleteDraftAndSave(draft)}
							testid="delete-draft-and-save">{m.contracts_delete_draft_and_save()}</Button
						>
					</div>
				{/snippet}
			</RefusedStatements>
		{/if}
	{/if}

	<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
		<Button href={back} testid="form-cancel">{m.ui_cancel()}</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel={m.ui_saving()}
			testid="submit-button">{m.buildings_save_changes()}</Button
		>
	</div>
</form>
