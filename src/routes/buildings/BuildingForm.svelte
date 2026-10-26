<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { addToast } from '$lib/stores';
	import { apiCall } from '$lib/api';
	import AddressSearch from './AddressSearch.svelte';
	import RegisterApartments, { toRows, type RegisterRow } from './RegisterApartments.svelte';
	import RegisterNotices from './RegisterNotices.svelte';
	import type { AddressHit, RegisterBuilding } from '$lib/types';
	import { buildingTypeLabel, buildingTypes } from '$lib/building-type';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	interface BuildingValues {
		name?: string | null;
		address?: string;
		postalCode?: string;
		city?: string;
		canton?: string | null;
		buildingType?: string | null;
		yearBuilt?: number | null;
		noTank?: boolean;
	}

	interface Props {
		mode: 'create' | 'edit';
		initial?: BuildingValues;
		errors: Record<string, string | undefined>;
		cancelHref: string;
	}

	let { mode, initial = {}, errors, cancelHref }: Props = $props();
	const isCreate = $derived(mode === 'create');

	// Form state, seeded once from the initial values
	const start = untrack(() => initial);
	let name = $state(start.name || '');
	let address = $state(start.address || '');
	let postalCode = $state(start.postalCode || '');
	let city = $state(start.city || '');
	let canton = $state(start.canton || '');
	let buildingType = $state(start.buildingType || '');
	let yearBuilt = $state(start.yearBuilt?.toString() || '');
	let noTank = $state(!!start.noTank);

	let isSubmitting = $state(false);

	// The server opens the saved building; the toast says which one was saved
	const submit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result, update, formElement }) => {
			if (result.type === 'redirect') addToast('success', m.buildings_saved_toast({ name }));
			await update({ reset: false });
			isSubmitting = false;
			focusFirstError(formElement);
		};
	};

	const cantons = (
		[
			['AG', m.buildings_canton_ag],
			['AI', m.buildings_canton_ai],
			['AR', m.buildings_canton_ar],
			['BE', m.buildings_canton_be],
			['BL', m.buildings_canton_bl],
			['BS', m.buildings_canton_bs],
			['FR', m.buildings_canton_fr],
			['GE', m.buildings_canton_ge],
			['GL', m.buildings_canton_gl],
			['GR', m.buildings_canton_gr],
			['JU', m.buildings_canton_ju],
			['LU', m.buildings_canton_lu],
			['NE', m.buildings_canton_ne],
			['NW', m.buildings_canton_nw],
			['OW', m.buildings_canton_ow],
			['SG', m.buildings_canton_sg],
			['SH', m.buildings_canton_sh],
			['SO', m.buildings_canton_so],
			['SZ', m.buildings_canton_sz],
			['TG', m.buildings_canton_tg],
			['TI', m.buildings_canton_ti],
			['UR', m.buildings_canton_ur],
			['VD', m.buildings_canton_vd],
			['VS', m.buildings_canton_vs],
			['ZG', m.buildings_canton_zg],
			['ZH', m.buildings_canton_zh]
		] as const
	).map(([value, label]) => ({ value, label: `${label()} (${value})` }));

	// Gebäudetyp (UBIQUITOUS_LANGUAGE.md): stored in German, shown in the UI language
	const buildingTypeOptions = buildingTypes.map((type) => ({
		value: type,
		label: buildingTypeLabel(type)
	}));

	// The Gebäuderegister (#479): what the search found, the chosen building's Wohnungen, and a Gebäude with the same
	// address that is already entered
	let searchOutcome = $state<'hits' | 'none' | 'unreachable'>('hits');
	let registerRead = $state(false);
	let rows = $state<RegisterRow[]>([]);
	let existing = $state<{ id: string; name: string }>();
	const submitLabel = $derived(
		!isCreate
			? m.buildings_save_changes()
			: rows.some((row) => row.included)
				? m.buildings_register_create()
				: m.buildings_add()
	);

	// what the last chosen address proposed: a field still holding it takes the next address's proposal, one the
	// landlord changed stays
	let proposed = { name: '', buildingType: '', yearBuilt: '' };
	const propose = (field: keyof typeof proposed, current: string, next: string) => {
		const value = current === '' || current === proposed[field] ? next : current;
		proposed[field] = next;
		return value;
	};

	async function handleAddressSelect(selected: AddressHit) {
		address = selected.street;
		postalCode = selected.postalCode;
		city = selected.city;
		canton = selected.canton;
		name = propose('name', name, selected.street);
		registerRead = false;
		rows = [];
		existing = undefined;
		const [register, same] = await Promise.all([
			apiCall<RegisterBuilding>(`/addresses/${selected.egid}`),
			apiCall<{ buildings: { id: string; name: string; address: string; postalCode: string }[] }>(
				'/buildings',
				{
					params: { search: selected.street }
				}
			)
		]);
		existing = same.data?.buildings.find(
			(b) =>
				b.address.toLowerCase() === selected.street.toLowerCase() &&
				b.postalCode === selected.postalCode
		);
		if (!register.data) {
			searchOutcome = 'unreachable';
			return;
		}
		buildingType = propose('buildingType', buildingType, register.data.buildingType ?? '');
		yearBuilt = propose('yearBuilt', yearBuilt, String(register.data.yearBuilt ?? ''));
		rows = toRows(register.data.apartments);
		registerRead = true;
	}
</script>

<form method="POST" use:enhance={submit} class="flex flex-col gap-8">
	{#if errors.form}
		<Alert tone="critical" title={m.buildings_not_saved()} testid="form-error">
			<p>{errors.form}</p>
		</Alert>
	{/if}

	<TextInput
		id="name"
		name="name"
		label={m.buildings_name()}
		help={m.buildings_name_help()}
		example={m.buildings_name_example()}
		bind:value={name}
		error={errors.name}
		testid="building-name-input"
	/>

	<fieldset class="flex flex-col gap-6">
		<legend class="mb-4 text-xl font-bold text-ink">{m.buildings_address()}</legend>
		{#if isCreate}
			<AddressSearch
				help={m.buildings_address_search_help()}
				example={m.buildings_address_search_example()}
				onselect={handleAddressSelect}
				onfound={(outcome) => (searchOutcome = outcome)}
			/>
			<RegisterNotices
				outcome={searchOutcome}
				{existing}
				registered={registerRead}
				apartmentCount={rows.length}
			/>
		{/if}
		<TextInput
			id="address"
			name="address"
			label={m.buildings_street()}
			example={m.buildings_street_example()}
			bind:value={address}
			error={errors.address}
			testid="building-address-input"
		/>
		<div class="grid gap-6 sm:grid-cols-3">
			<TextInput
				id="postalCode"
				name="postalCode"
				label={m.buildings_postal_code()}
				example="8400"
				bind:value={postalCode}
				error={errors.postalCode}
				testid="building-postal-code-input"
			/>
			<div class="sm:col-span-2">
				<TextInput
					id="city"
					name="city"
					label={m.buildings_city()}
					example="Winterthur"
					bind:value={city}
					error={errors.city}
					testid="building-city-input"
				/>
			</div>
		</div>
		<Select
			id="canton"
			name="canton"
			label={m.buildings_canton()}
			help={isCreate ? m.buildings_canton_help() : undefined}
			options={cantons}
			placeholder={m.buildings_canton_choose()}
			bind:value={canton}
			error={errors.canton}
			testid="building-canton-select"
		/>
	</fieldset>

	<fieldset class="flex flex-col gap-6">
		<legend class="mb-4 text-xl font-bold text-ink">{m.buildings_more_details()}</legend>
		<div class="grid gap-6 sm:grid-cols-2">
			<Select
				id="buildingType"
				name="buildingType"
				label={m.buildings_type()}
				help={m.buildings_type_help()}
				options={buildingTypeOptions}
				placeholder={m.buildings_type_none()}
				bind:value={buildingType}
				optional
				testid="building-type-select"
			/>
			<TextInput
				id="yearBuilt"
				name="yearBuilt"
				type="number"
				label={m.buildings_year_built()}
				help={m.buildings_year_built_help()}
				example="1985"
				min="1800"
				max={String(new Date().getFullYear())}
				bind:value={yearBuilt}
				error={errors.yearBuilt}
				optional
				testid="building-year-built-input"
			/>
		</div>
		<!-- the statement wizard then stops asking about a Tankbestand (#72) -->
		<Checkbox
			id="noTank"
			name="noTank"
			label={m.buildings_no_tank()}
			help={m.buildings_no_tank_help()}
			bind:checked={noTank}
			testid="building-no-tank-checkbox"
		/>
	</fieldset>

	{#if rows.length}
		<RegisterApartments bind:rows {errors} />
	{/if}

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row">
		<Button href={cancelHref} testid="form-cancel">{m.ui_cancel()}</Button>
		<Button
			type="submit"
			variant="primary"
			icon={isCreate ? 'add' : 'save'}
			busy={isSubmitting}
			busyLabel={m.ui_saving()}
			testid="building-form-submit"
		>
			{submitLabel}
		</Button>
	</div>
</form>
