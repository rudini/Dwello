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
	import { contractStatusOn, localToday } from '$lib/contract-status';
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

	async function save(event: SubmitEvent) {
		event.preventDefault();
		Object.assign(values, normalizeAmounts(values)); // "1'450" as typed in Switzerland
		errors = { ...validateContract(values), ...stepErrors(values, 3) };
		if (Object.keys(errors).length > 0) return focusFirstError(form);
		saving = true;
		const response = await apiCall(back, { method: 'PUT', body: contractBody(values) });
		saving = false;
		if (response.error) {
			// the backend answers in English; a valid form is refused only for an overlap
			errors = {
				form: /overlap/i.test(response.error.message)
					? m.backend_contract_overlap()
					: m.contracts_save_failed()
			};
			return focusFirstError(form);
		}
		addToast('success', m.contracts_saved_toast({ name: tenantName }), 10_000);
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
			error={errors.apartmentId}
		/>
	</Panel>

	<Panel title={m.contracts_period()}>
		<PeriodStep
			bind:startDate={values.startDate}
			bind:endDate={values.endDate}
			bind:isUnlimited={values.isUnlimited}
			min={startLimit.min}
			today={pastBefore}
			{overlap}
			{errors}
		/>
	</Panel>

	<Panel title={m.contracts_rent()}>
		<RentStep bind:values {errors} />
	</Panel>

	{#if errors.form}
		<Alert tone="critical" title={m.contracts_not_saved()} testid="form-error">
			<p>{errors.form}</p>
		</Alert>
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
