<script lang="ts">
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
		statementsAfterEndError
	} from '$lib/contract-status';
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
	let availability = $state<Map<string, AvailabilityInfo> | null>(null);
	let apartmentContracts = $state<ContractForAvailability[]>([]);
	let form = $state<HTMLFormElement>();

	const today = localToday();
	// Only a start moved before the saved one and into the past is questioned
	const pastBefore = untrack(() => [today, values.startDate].sort()[0]);
	const running = $derived(
		contractStatusOn(contract.startDate, contract.endDate, today) === 'active'
	);
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
	const tenantName = $derived(tenants.find((t) => t.id === values.tenantId)?.name ?? '');

	async function contractsOf(apartmentId: string) {
		const response = await apiCall<{ contracts: Parameters<typeof forAvailability>[0] }>(
			`/contracts?apartmentId=${apartmentId}`
		);
		return forAvailability(response.data?.contracts ?? []);
	}

	// The contract being edited does not block its own apartment
	async function availabilityOf(apartmentId: string) {
		const own = apartmentId === contract.apartmentId ? contract.id : undefined;
		return [apartmentId, computeAvailability(await contractsOf(apartmentId), own)] as const;
	}

	$effect(() => {
		Promise.all(apartments.map((a) => availabilityOf(a.id))).then(
			(entries) => (availability = new Map(entries))
		);
	});

	// Contracts of the chosen apartment, for the overlap check
	$effect(() => {
		const apartmentId = values.apartmentId;
		if (apartmentId) contractsOf(apartmentId).then((list) => (apartmentContracts = list));
		else apartmentContracts = [];
	});

	function edited(event: Event) {
		const id = (event.target as HTMLElement).id;
		delete errors[errorKey[id] ?? id];
	}

	// the backend answers in English: a valid form is refused for an overlap or a statement after the end
	function saveError({ message, details }: { message: string; details?: Record<string, unknown> }) {
		if (Array.isArray(details?.statements)) return statementsAfterEndError(details.statements);
		if (/overlap/i.test(message))
			return 'Der Zeitraum überschneidet sich mit einem anderen Mietvertrag dieser Wohnung.';
		return 'Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.';
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();
		Object.assign(values, normalizeAmounts(values)); // "1'450" as typed in Switzerland
		errors = { ...validateContract(values), ...stepErrors(values, 3) };
		const unconfirmed = endChanged && confirmedDay !== values.endDate;
		const pastConfirmed = unconfirmed && pastEndConfirmation(values.endDate, today);
		if (pastConfirmed) errors.pastConfirmed = pastConfirmed;
		if (Object.keys(errors).length > 0) return focusFirstError(form);
		saving = true;
		const response = await apiCall(back, { method: 'PUT', body: contractBody(values) });
		saving = false;
		if (response.error) {
			errors = { form: saveError(response.error) };
			return focusFirstError(form);
		}
		addToast('success', `Mietvertrag von ${tenantName} gespeichert`, 10_000);
		await goto(back);
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
		<!-- TODO(fachlich prüfen): the hint on legal notice periods is not from the glossary -->
		<Alert tone="caution" title="Laufender Mietvertrag">
			<p>
				Änderungen an einem laufenden Mietvertrag gelten sofort. Bei Mietanpassungen sollten Sie die
				gesetzlichen Kündigungsfristen beachten.
			</p>
		</Alert>
	{/if}

	<Panel title="Mieter und Wohnung">
		<Select
			id="tenant"
			label="Mieter"
			help="Die Person, die die Wohnung mietet."
			options={tenants.map((t) => ({ value: t.id, label: t.name }))}
			bind:value={values.tenantId}
			placeholder="Mieter wählen"
			error={errors.tenantId}
			testid="contract-tenant-select"
		/>
		<ApartmentStep
			bind:apartmentId={values.apartmentId}
			{apartments}
			availability={availability ?? new Map()}
			loading={!availability}
			notice={startLimit.notice}
			error={errors.apartmentId}
		/>
	</Panel>

	<Panel title="Vertragsdauer">
		<PeriodStep
			bind:startDate={values.startDate}
			bind:endDate={values.endDate}
			bind:isUnlimited={values.isUnlimited}
			min={startLimit.min}
			today={pastBefore}
			{overlap}
			{errors}
		/>
		{#if endChanged}
			<PastEndConfirm
				endDate={values.endDate}
				{today}
				bind:confirmedDay
				bind:error={() => errors.pastConfirmed ?? '', (error) => (errors.pastConfirmed = error)}
			/>
		{/if}
	</Panel>

	<Panel title="Miete">
		<RentStep bind:values {errors} />
	</Panel>

	{#if errors.form}
		<Alert tone="critical" title="Der Mietvertrag wurde nicht gespeichert" testid="form-error">
			<p>{errors.form}</p>
		</Alert>
	{/if}

	<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
		<Button href={back} testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel="Wird gespeichert …"
			testid="submit-button">Änderungen speichern</Button
		>
	</div>
</form>
