<script lang="ts" module>
	import { m } from '$lib/paraglide/messages';
	import type { RegisterApartment } from '$lib/server/building-register';

	// The Wohnungen the Gebäuderegister knows, to check and complete before saving (#479). A row left out is disabled,
	// so the form does not send it; what the register lacks is marked at its field and required
	export type RegisterRow = RegisterApartment & {
		included: boolean;
		floorValue: string;
		legend: string;
	};

	/** The register's Wohnungen as rows of the form, all taken until the landlord leaves one out */
	export const toRows = (apartments: RegisterApartment[]): RegisterRow[] =>
		apartments.map((apartment) => ({
			...apartment,
			included: true,
			floorValue: apartment.floor === null ? '' : String(apartment.floor),
			legend: apartment.number
				? m.buildings_register_apartment({ number: apartment.number })
				: m.buildings_register_apartment_unnumbered()
		}));
</script>

<script lang="ts">
	import { floorOptions } from '$lib/apartment';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	let {
		rows = $bindable(),
		errors
	}: { rows: RegisterRow[]; errors: Record<string, string | undefined> } = $props();

	const note = (row: RegisterRow, field: 'number' | 'floor' | 'area' | 'rooms', i: number) =>
		row.missing.includes(field)
			? { text: m.buildings_register_missing(), testid: `register-apartment-${field}-note-${i}` }
			: undefined;
</script>

<fieldset class="flex flex-col gap-6">
	<legend class="mb-4 text-xl font-bold text-ink">{m.buildings_register_apartments()}</legend>
	<p class="text-ink-muted">{m.buildings_register_apartments_check()}</p>
	<p class="text-ink-muted" data-testid="building-register-apartments-help">
		{m.buildings_register_apartments_leave_out()}
	</p>
	{#each rows as row, i (i)}
		<fieldset
			class="flex flex-col gap-4 rounded-control border border-line p-4"
			data-testid="register-apartment-{i}"
		>
			<legend class="px-2 font-semibold text-ink">{row.legend}</legend>
			<Checkbox
				id="apartments-{i}-include"
				label={m.buildings_register_include()}
				bind:checked={row.included}
				testid="register-apartment-include-{i}"
			/>
			<div class="grid gap-4 sm:grid-cols-2">
				<TextInput
					id="apartments-{i}-number"
					name="apartments.{i}.number"
					label={m.apartments_number()}
					bind:value={row.number}
					disabled={!row.included}
					error={errors[`apartments.${i}.number`]}
					note={note(row, 'number', i)}
					testid="register-apartment-number-{i}"
				/>
				<Select
					id="apartments-{i}-floor"
					name="apartments.{i}.floor"
					label={m.apartments_floor()}
					options={floorOptions(row.floor)}
					placeholder={m.apartments_floor_choose()}
					bind:value={row.floorValue}
					disabled={!row.included}
					error={errors[`apartments.${i}.floor`]}
					note={note(row, 'floor', i)}
					testid="register-apartment-floor-{i}"
				/>
				<TextInput
					id="apartments-{i}-area"
					name="apartments.{i}.area"
					label={m.apartments_area()}
					inputmode="decimal"
					bind:value={row.area}
					disabled={!row.included}
					error={errors[`apartments.${i}.area`]}
					note={note(row, 'area', i)}
					testid="register-apartment-area-{i}"
				/>
				<TextInput
					id="apartments-{i}-rooms"
					name="apartments.{i}.rooms"
					label={m.apartments_rooms()}
					help={m.buildings_register_rooms_help()}
					helpTestid="register-apartment-rooms-help-{i}"
					inputmode="decimal"
					bind:value={row.rooms}
					disabled={!row.included}
					error={errors[`apartments.${i}.rooms`]}
					note={note(row, 'rooms', i)}
					testid="register-apartment-rooms-{i}"
				/>
			</div>
		</fieldset>
	{/each}
</fieldset>
