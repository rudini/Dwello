<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { apiCall } from '$lib/api';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import FormActions from '$lib/components/FormActions.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { keepEarlyChoice } from '$lib/early-choice';
	import {
		availableFrom,
		contractBody,
		fieldBorder,
		initialContractValues,
		overlapWarning,
		saveErrorMessage,
		suggestedStartDate,
		validateContract
	} from '$lib/contract-form';
	import type { RentalContract } from '$lib/types';
	import {
		computeAvailability,
		type AvailabilityInfo,
		type ContractForAvailability
	} from '$lib/utils/contract-availability';
	import ApartmentSelect from './ApartmentSelect.svelte';
	import PeriodFields from './PeriodFields.svelte';
	import RentFields from './RentFields.svelte';

	// Form of a new contract or, given one, of a contract being edited
	let {
		contract,
		tenants,
		apartments
	}: {
		contract?: RentalContract;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string }[];
	} = $props();

	let form = $state(untrack(() => initialContractValues(contract, $page.url.searchParams)));
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let isLoadingAvailability = $state(true);
	let apartmentAvailability = $state(new Map<string, AvailabilityInfo>());
	let apartmentContracts = $state<ContractForAvailability[]>([]);

	const currentApartmentId = $derived(contract?.apartmentId);
	const selectedAvailability = $derived(apartmentAvailability.get(form.apartmentId));
	const startLimit = $derived(
		availableFrom(selectedAvailability, form.apartmentId !== currentApartmentId)
	);
	const overlap = $derived(overlapWarning(form, apartmentContracts, contract?.id));
	const isRunning = $derived(!!contract && !contract.endDate);
	// Where the form saves to and returns to, and how its submit button reads
	const target = $derived(
		contract
			? {
					path: `/contracts/${contract.id}`,
					method: 'PUT' as const,
					back: `/contracts/${contract.id}`,
					icon: 'save',
					label: 'Änderungen speichern',
					busyLabel: 'Wird gespeichert...'
				}
			: {
					path: '/contracts',
					method: 'POST' as const,
					back: '/contracts',
					icon: 'add',
					label: 'Vertrag erstellen',
					busyLabel: 'Wird erstellt...'
				}
	);

	async function contractsOf(apartmentId: string) {
		const response = await apiCall<{ contracts: ContractForAvailability[] }>(
			`/contracts?apartmentId=${apartmentId}`
		);
		return response.data?.contracts || [];
	}

	// The contract being edited does not block its own apartment
	async function availabilityOf(apartmentId: string) {
		const ownContract = apartmentId === contract?.apartmentId ? contract.id : undefined;
		return [apartmentId, computeAvailability(await contractsOf(apartmentId), ownContract)] as const;
	}

	$effect(() => {
		Promise.all(apartments.map((apt) => availabilityOf(apt.id)))
			.then((entries) => (apartmentAvailability = new Map(entries)))
			.catch((error) => console.error('Error fetching apartment availability:', error))
			.finally(() => (isLoadingAvailability = false));
	});

	// Contracts of the chosen apartment, for the overlap check
	$effect(() => {
		const apartmentId = form.apartmentId;
		if (!apartmentId) {
			apartmentContracts = [];
			return;
		}
		contractsOf(apartmentId)
			.then((contracts) => (apartmentContracts = contracts))
			.catch((error) => {
				console.error('Error fetching apartment contracts:', error);
				apartmentContracts = [];
			});
	});

	$effect(() => {
		const start = suggestedStartDate(!contract, form.startDate, selectedAvailability);
		if (start) form.startDate = start;
	});

	async function save(event: SubmitEvent) {
		event.preventDefault();
		errors = validateContract(form);
		if (Object.keys(errors).length > 0) return;

		isSubmitting = true;
		try {
			const response = await apiCall(target.path, {
				method: target.method,
				body: contractBody(form)
			});
			if (response.error) throw new Error(response.error.message);
			await goto(target.back);
		} catch (error) {
			console.error('Error saving contract:', error);
			errors = { form: saveErrorMessage(error) };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Card>
	<form onsubmit={save} class="space-y-6">
		{#if errors.form}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<p class="text-sm text-critical" data-testid="form-error">{errors.form}</p>
			</div>
		{/if}

		{#if isRunning}
			<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<Icon name="warning" size={20} class="text-caution mt-0.5" />
					<div class="text-sm text-caution">
						<p class="font-medium">Aktiver Vertrag</p>
						<p class="mt-1">
							Änderungen an einem aktiven Vertrag werden sofort wirksam. Bei Mietanpassungen sollten
							Sie die gesetzlichen Kündigungsfristen beachten.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<div>
			<label for="tenant" class="block text-sm font-medium text-gray-700 mb-1">
				Mieter <span class="text-critical">*</span>
			</label>
			<select
				id="tenant"
				data-testid="contract-tenant-select"
				onchange={(e) => (form.tenantId = e.currentTarget.value)}
				use:keepEarlyChoice={(id) => (form.tenantId = id)}
				class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {fieldBorder(
					errors.tenantId
				)}"
			>
				<option value="" selected={!form.tenantId}>Mieter auswählen...</option>
				{#each tenants as tenant (tenant.id)}
					<option value={tenant.id} selected={tenant.id === form.tenantId}>{tenant.name}</option>
				{/each}
			</select>
			<FieldError message={errors.tenantId} />
		</div>

		<ApartmentSelect
			bind:value={form.apartmentId}
			{apartments}
			availability={apartmentAvailability}
			loading={isLoadingAvailability}
			{currentApartmentId}
			error={errors.apartmentId}
			notice={startLimit.notice}
		/>

		<PeriodFields
			bind:startDate={form.startDate}
			bind:endDate={form.endDate}
			bind:isUnlimited={form.isUnlimited}
			min={startLimit.min}
			{errors}
			{overlap}
		/>

		<RentFields
			bind:baseRent={form.baseRent}
			bind:additionalRent={form.additionalRent}
			bind:advancePayment={form.advancePayment}
			{errors}
		/>

		<FormActions
			cancelHref={target.back}
			submitting={isSubmitting}
			icon={target.icon}
			label={target.label}
			busyLabel={target.busyLabel}
		/>
	</form>
</Card>
