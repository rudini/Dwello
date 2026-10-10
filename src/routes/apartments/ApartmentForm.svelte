<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { floorOptions, roomOptions } from '$lib/apartment';
	import { addToast } from '$lib/stores';
	import type { Apartment } from '$lib/types';
	import { normalizeDecimal } from '$lib/utils/format';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';

	// "Neue Wohnung" and "Wohnung bearbeiten": the apartment's fields, explained with the glossary's words
	let {
		buildingId,
		apartment = {},
		errors = {},
		cancelHref,
		submitLabel,
		building,
		status
	}: {
		buildingId: string;
		apartment?: Partial<Apartment>;
		errors?: Record<string, string>;
		cancelHref: string;
		submitLabel: string;
		building?: Snippet; // which building, before the fields
		status?: Snippet; // the Mietstatus, after them
	} = $props();

	const start = untrack(() => apartment);
	let number = $state(start.number ?? '');
	let floor = $state(start.floor === undefined ? '' : String(start.floor));
	let rooms = $state(normalizeDecimal(String(start.rooms ?? '')));
	let numberTaken = $state(false);
	let saving = $state(false);

	// Warn while typing when another apartment of the building already has this number
	$effect(() => {
		const candidate = number.trim();
		const params = new URLSearchParams({
			buildingId,
			number: candidate,
			excludeId: start.id ?? ''
		});
		if (!buildingId || !candidate) {
			numberTaken = false;
			return;
		}
		const timer = setTimeout(async () => {
			const response = await fetch(`/api/apartments/check-number?${params}`);
			numberTaken = response.ok && (await response.json()).exists;
		}, 300);
		return () => clearTimeout(timer);
	});
</script>

<form
	method="POST"
	use:enhance={() => {
		saving = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') addToast('success', `Wohnung ${number.trim()} gespeichert`);
			await update({ reset: false });
			saving = false;
		};
	}}
	class="flex flex-col gap-6"
>
	{#if errors.form}
		<Alert tone="critical" title="Nicht gespeichert" testid="form-error">
			<p>{errors.form}</p>
		</Alert>
	{/if}

	{@render building?.()}

	<div class="grid gap-6 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<TextInput
				id="number"
				name="number"
				label="Wohnungsnummer"
				help="Bezeichnung der Wohnung im Gebäude, pro Gebäude eindeutig."
				example="3.01"
				bind:value={number}
				error={errors.number}
				testid="apartment-number-input"
			/>
			{#if numberTaken}
				<Alert tone="caution" title="Nummer schon vergeben" testid="apartment-number-taken">
					<p>Die Wohnungsnummer "{number.trim()}" existiert bereits in diesem Gebäude.</p>
				</Alert>
			{/if}
		</div>
		<Select
			id="floor"
			name="floor"
			label="Stockwerk"
			help="Lage der Wohnung im Gebäude: UG, EG, 1. OG, 2. OG usw."
			options={floorOptions}
			placeholder="Stockwerk wählen"
			bind:value={floor}
			error={errors.floor}
			testid="apartment-floor-select"
		/>
	</div>

	<div class="grid gap-6 sm:grid-cols-2">
		<Field
			id="area"
			label="Fläche (m²)"
			help="Nettowohnfläche in Quadratmetern. Grundlage für Verteilschlüssel nach Fläche."
			example="85"
			error={errors.area}
		>
			{#snippet children(control)}
				<input
					id={control.id}
					name="area"
					type="number"
					step="0.1"
					min="1"
					value={start.area ?? ''}
					aria-required="true"
					aria-describedby={control.describedBy}
					aria-invalid={control.invalid || undefined}
					class={controlClass(control.invalid)}
					data-testid="apartment-area-input"
				/>
			{/snippet}
		</Field>
		<Select
			id="rooms"
			name="rooms"
			label="Zimmeranzahl"
			help="Anzahl Zimmer, nach Schweizer Konvention mit halben Zimmern."
			example="3.5"
			options={roomOptions.map((value) => ({ value, label: `${value} Zimmer` }))}
			placeholder="Zimmer wählen"
			bind:value={rooms}
			error={errors.rooms}
			testid="apartment-rooms-select"
		/>
	</div>

	{@render status?.()}

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row">
		<Button href={cancelHref} testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel="Wird gespeichert …"
			testid="apartment-submit">{submitLabel}</Button
		>
	</div>
</form>
