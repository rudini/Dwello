<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { backendMessage } from '$lib/backend-error';
	import { periodName } from '$lib/accounting-period';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { tick, untrack } from 'svelte';
	import { apiCall } from '$lib/api';
	import {
		contractBody,
		forAvailability,
		initialContractValues,
		overlapWarning,
		validateContract,
		billedUntilError
	} from '$lib/contract-form';
	import {
		billsIn,
		contractStatusOn,
		localToday,
		pastEndConfirmation,
		billedDaysError,
		type RefusedStatement
	} from '$lib/contract-status';
	import { wizardLink } from '$lib/statement-wizard';
	import { formatDate } from '$lib/utils/format';
	import { normalizeAmounts, stepErrors } from '$lib/contract-wizard';
	import { addToast } from '$lib/stores';
	import type { RentalContract } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Panel from '$lib/ui/Panel.svelte';
	import type { ContractForAvailability } from '$lib/utils/contract-availability';
	import ContractsUnknown, { retried } from './new/ContractsUnknown.svelte';
	import PeriodStep from './new/PeriodStep.svelte';
	import RentStep from './new/RentStep.svelte';
	import AdvancePeriods from './[id]/AdvancePeriods.svelte';
	import PastEndConfirm from './PastEndConfirm.svelte';
	import RefusedStatements from './RefusedStatements.svelte';
	import NoticeHint from './NoticeHint.svelte';

	// Form of a contract being edited, with the fields, help and checks of the wizard in ./new;
	// tenant and apartment are fixed (#152): a move or a Mieterwechsel is a new contract
	let {
		contract,
		tenant,
		apartment,
		categories
	}: {
		contract: RentalContract;
		tenant: string;
		apartment: string;
		categories: { id: string; name: string }[]; // the umlagefähige ones it can agree (#91)
	} = $props();

	let values = $state(untrack(() => initialContractValues(contract, $page.url.searchParams)));
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let refused = $state<RefusedStatement[]>([]); // statements that refused the last save
	// the apartment's contracts, for the overlap check: an overlap shows only once they are loaded
	let contractsState = $state<'loading' | 'loaded' | 'failed'>('loading');
	let contractsRequest = 0;
	let apartmentContracts = $state<ContractForAvailability[]>([]);
	let form = $state<HTMLFormElement>();

	const today = localToday();
	// Only a start moved before the saved one and into the past is questioned
	const pastBefore = untrack(() => [today, values.startDate].sort()[0]);
	const running = $derived(
		contractStatusOn(contract.startDate, contract.endDate, today) === 'active'
	);
	const fixedTerm = $derived(!!contract.endDate && !contract.terminated);
	const runningText = $derived(
		fixedTerm ? m.contracts_running_text_fixed_term() : m.contracts_running_text()
	);
	// #464: a new Akonto applies from «Gültig ab»; an increase follows the rules of a rent increase, only in a running
	// contract: before or after it a change corrects the entry (fach review 464-2 V-5)
	const changeHelp = $derived(
		fixedTerm ? m.contracts_advance_change_help_fixed_term() : m.contracts_advance_change_help()
	);
	const advanceHelp = $derived(
		running ? `${m.contracts_advance_help()} ${changeHelp}` : m.contracts_advance_help()
	);
	// the apartment's contracts could not be loaded: an overlap cannot be ruled out (#143); it stays during a
	// retry, so «Erneut versuchen» keeps the focus (review b15-merge M-1)
	let unknown = $state(false);
	// a changed Vertragsende in the past is confirmed as in «Beenden»; an unchanged one is not asked again
	const endChanged = $derived(
		!values.isUnlimited && values.endDate !== (contract.endDate?.slice(0, 10) ?? '')
	);
	let confirmedDay = $state('');
	const overlap = $derived(overlapWarning(values, apartmentContracts, contract.id));
	const back = $derived(`/contracts/${contract.id}`);
	const link =
		'inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
	// the earliest start of a new contract after this one (YYYY-MM-DD is midnight UTC)
	const nextDay = (end: string) =>
		new Date(Date.parse(end.slice(0, 10)) + 86_400_000).toISOString().slice(0, 10);
	const dayAfter = (end: string) => formatDate(nextDay(end));
	// «Befristet» for a contract saved open-ended: a notice is entered with «Beenden» (Sven K1 M1); a saved notice
	// always has an end (backend `checkNotice`)
	const noticeHint = $derived(!contract.endDate && !values.isUnlimited && !values.terminated);

	// Contracts of the apartment, for the overlap check
	async function loadContracts() {
		const request = ++contractsRequest; // only the latest answer counts
		contractsState = 'loading';
		const list = forAvailability(await apiCall(`/contracts?apartmentId=${contract.apartmentId}`));
		if (request !== contractsRequest) return false;
		apartmentContracts = list ?? [];
		contractsState = list ? 'loaded' : 'failed';
		unknown = !list;
		return true; // this answer decided
	}

	$effect(() => {
		untrack(loadContracts);
	});

	// «Erneut versuchen»: the request again, the input stays (#151)
	async function retry() {
		if (!(await loadContracts())) return; // overtaken by a newer request: it decides (review R2-2)
		await tick();
		retried(unknown, document.getElementById('startDate'));
	}

	function edited(event: Event) {
		const { id, name } = event.target as HTMLInputElement;
		delete errors[id];
		if (name) delete errors[name]; // a radio group's error is named after the group (#89)
		// the offer belongs to the values refused (review K-2); its message points to it below
		if (refused.length) delete errors.form;
		refused = [];
	}

	// a draft whose whole period «Abgerechnet bis» now covers, not the contract dates: no statement is created for it
	// again (fach review V-10, V-15)
	function covered(draft: RefusedStatement) {
		const dates = {
			startDate: values.startDate,
			endDate: values.isUnlimited ? null : values.endDate
		};
		const period = { start: draft.periodStart, end: draft.periodEnd };
		return (
			billsIn(dates, period) && !billsIn({ ...dates, billedUntil: values.billedUntil }, period)
		);
	}
	const onlyCovered = (statements: RefusedStatement[]) =>
		statements.length === 1 && statements[0].status === 'draft' && covered(statements[0]);

	const coveredConsequence = $derived(
		onlyCovered(refused)
			? m.contracts_delete_draft_covered_consequence({ number: refused[0].statementNumber })
			: undefined
	);

	// the backend answers in English: a valid form is refused for an overlap or a statement after the end
	// #499: «Abgerechnet bis» over a Dwello statement, said at the field, its period by its name
	function billedByDwello({ code, params }: { code?: string; params?: Record<string, string | number> }) {
		if (!code?.startsWith('BILLED_UNTIL_BILLED') || !params) return null;
		const { start, end, ...rest } = params;
		const period = periodName({ start: String(start), end: String(end) });
		return backendMessage({ code, params: { ...rest, period } }, m.contracts_save_failed());
	}

	function saveError({
		message,
		code,
		params,
		details
	}: {
		message: string;
		code?: string;
		params?: Record<string, string | number>;
		details?: Record<string, unknown>;
	}) {
		const statements = details?.statements;
		if (Array.isArray(statements) && onlyCovered(statements))
			return m.contracts_billed_draft_covered({ number: statements[0].statementNumber });
		if (Array.isArray(statements)) return billedDaysError(statements);
		if (/overlap/i.test(message)) return m.backend_contract_overlap();
		// a refusal with its own message, e.g. an Akonto in a billed time (#464); never the backend's own text
		return backendMessage({ code, params }, m.contracts_save_failed());
	}

	// the fields' errors; true when the form may be sent
	function valid() {
		Object.assign(values, normalizeAmounts(values)); // "1'450" as typed in Switzerland
		errors = { ...validateContract(values), ...stepErrors(values, 3) };
		const unconfirmed = endChanged && confirmedDay !== values.endDate;
		const pastConfirmed = unconfirmed && pastEndConfirmation(values.endDate, today);
		if (pastConfirmed) errors.pastConfirmed = pastConfirmed;
		// a typed «Abgerechnet bis» that is no date is not sent as none (code review C-2); the field says why
		const billedText = form?.querySelector<HTMLInputElement>('#billedUntil')?.value.trim();
		const billed = billedUntilError(values, today); // #453 (#337)
		if (billedText && !values.billedUntil)
			errors.billedUntil = m.ui_date_not_a_date({ example: '31.12.2024' });
		else if (billed) errors.billedUntil = billed;
		return Object.keys(errors).length === 0;
	}

	// saves and opens `next`; a refusal names the statements it concerns (A-10); `deleteDraft` names a draft the
	// backend deletes with the change, or keeps when it refuses it (#141)
	async function put(next: string, deleteDraft?: string) {
		saving = true;
		const body = { ...contractBody(values, categories), deleteDraft };
		const response = await apiCall(back, { method: 'PUT', body });
		saving = false;
		if (response.error) {
			const atField = billedByDwello(response.error);
			errors = atField ? { billedUntil: atField } : { form: saveError(response.error) };
			const statements = response.error.details?.statements;
			refused = Array.isArray(statements) ? (statements as RefusedStatement[]) : [];
			return focusFirstError(form);
		}
		// a withdrawn notice says what changed, not only «gespeichert» (personas J1)
		const saved =
			contract.terminated && values.isUnlimited
				? m.contracts_notice_withdrawn_toast({ name: tenant })
				: m.contracts_saved_toast({ name: tenant });
		addToast('success', saved, 10_000);
		await goto(next);
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();
		if (!valid()) return focusFirstError(form);
		await put(back);
	}

	// the one draft the new dates would change goes with the save; the wizard then creates it anew (A-10)
	const contractsMessage = (state: typeof contractsState) =>
		state === 'loading'
			? m.contracts_apartment_contracts_loading()
			: m.contracts_delete_draft_contracts_unknown();

	async function deleteDraftAndSave(draft: RefusedStatement) {
		if (!valid()) return focusFirstError(form);
		// an overlap is said here, before the request (review K-2); the backend keeps the draft when it refuses (#141);
		// without the apartment's contracts an overlap cannot be ruled out (Haiku review R5)
		if (overlap || contractsState !== 'loaded') {
			errors = { form: overlap ? m.backend_contract_overlap() : contractsMessage(contractsState) };
			// once the contracts are loaded, the same draft can be deleted (review #151 R-1)
			if (overlap) refused = [];
			return focusFirstError(form);
		}
		const next = covered(draft)
			? back
			: wizardLink(draft.buildingId, draft.periodStart, draft.periodEnd);
		await put(next, draft.id);
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
		<!-- a rent increase per Art. 269d OR; a befristeter Mietvertrag has no Kündigungstermin before its end (#66, #76),
		     an increase it provides for still needs the official form (#388) -->
		<Alert tone="caution" title={m.contracts_running_title()} testid="contract-running-hint">
			<p>{runningText}</p>
		</Alert>
	{/if}

	<Panel title={m.contracts_tenant_and_apartment()}>
		<dl class="flex flex-col gap-4">
			<div>
				<dt class="text-ink-muted">{m.contracts_tenant()}</dt>
				<dd class="text-ink" data-testid="contract-form-tenant">{tenant}</dd>
			</div>
			<div>
				<dt class="text-ink-muted">{m.tenants_apartment()}</dt>
				<dd class="text-ink" data-testid="contract-form-apartment">{apartment}</dd>
			</div>
		</dl>
		<!-- always present, so screen readers hear the hint when it appears -->
		<div role="status">
			{#if unknown}
				<ContractsUnknown onretry={retry} testid="apartment-contracts-unknown" />
			{/if}
		</div>
		<div class="flex flex-col gap-2 text-ink-muted" data-testid="contract-parties-help">
			<p>
				{contract.endDate
					? m.contracts_parties_fixed_ended({ date: dayAfter(contract.endDate) })
					: m.contracts_parties_fixed_open()}
			</p>
			<p>{m.contracts_parties_fixed_mistake()}</p>
			<p>{m.contracts_parties_fixed_by_law()}</p>
			<p>{m.contracts_parties_fixed_transfer()}</p>
			<a href={back} class={link} data-testid="contract-parties-link"
				>{m.contracts_parties_fixed_link({ name: tenant })}</a
			>
			{#if contract.endDate}
				<!-- for the same tenant, e.g. a move within the house (#156); the name keeps it from the Nachmieter -->
				<a
					href="/contracts/new?tenant={contract.tenantId}&start={nextDay(contract.endDate)}"
					class={link}
					data-testid="contract-parties-new">{m.contracts_new_for_tenant({ name: tenant })}</a
				>
			{/if}
		</div>
	</Panel>

	<Panel title={m.contracts_period()}>
		<PeriodStep
			bind:startDate={values.startDate}
			bind:endDate={values.endDate}
			bind:isUnlimited={values.isUnlimited}
			bind:terminated={values.terminated}
			noticed={contract.terminated}
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
		<!-- #133: billed outside Dwello up to this day; runs bill from the day after -->
		<DateInput
			id="billedUntil"
			label={m.contracts_billed_until()}
			help={m.contracts_billed_until_help()}
			bind:value={values.billedUntil}
			optional
			error={errors.billedUntil}
			testid="billed-until-input"
		/>
	</Panel>

	<Panel title={m.contracts_rent()}>
		<RentStep
			bind:values
			{errors}
			{categories}
			agreedHelp={m.contracts_agreed_costs_help_edit()}
			{advanceHelp}
		/>
		<AdvancePeriods
			startDate={contract.startDate}
			endDate={contract.endDate}
			advancePayments={contract.advancePayments}
			readonly
		/>
	</Panel>

	{#if errors.form}
		<Alert tone="critical" title={m.contracts_not_saved()} testid="form-error">
			<p>{errors.form}</p>
		</Alert>
		{#if refused.length}
			<RefusedStatements statements={refused} consequence={coveredConsequence}>
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
