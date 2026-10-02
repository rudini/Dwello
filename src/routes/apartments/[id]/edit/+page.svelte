<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import ApartmentFormFields from '$lib/components/ApartmentFormFields.svelte';
	import StatusField from './StatusField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const apartment = $derived(data.apartment);
	const errors = $derived(form?.errors ?? {});
</script>

<svelte:head>
	<title>Wohnung {apartment.number} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/apartments" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">Wohnungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/apartments/{apartment.id}" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">
			Wohnung {apartment.number}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Wohnung {apartment.number} bearbeiten</h1>
		<p class="text-gray-500 mt-1">{apartment.building.name}, {apartment.building.address}</p>
	</div>

	<Card>
		<form method="POST" use:enhance={() => ({ update }) => update({ reset: false })} class="space-y-6">
			<FieldError message={errors.form} />

			<ApartmentFormFields buildingId={apartment.buildingId} {apartment} {errors} />

			<StatusField {apartment} />

			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/apartments/{apartment.id}" variant="secondary" testid="form-cancel">Abbrechen</Button>
				<Button type="submit" variant="primary" testid="apartment-submit">
					<Icon name="save" size={18} />
					Speichern
				</Button>
			</div>
		</form>
	</Card>
</div>
