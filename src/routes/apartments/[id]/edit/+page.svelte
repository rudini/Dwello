<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import DateInput from '$lib/ui/DateInput.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ApartmentForm from '../../ApartmentForm.svelte';
	import StatusField from './StatusField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const apartment = $derived(data.apartment);
	const errors = $derived(form?.errors ?? {});
</script>

<svelte:head>
	<title>{m.apartments_edit_title({ number: apartment.number })} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.apartments_edit_title({ number: apartment.number })}
		purpose="{apartment.building.name}, {apartment.building.address}"
		trail={[
			{ href: '/apartments', label: m.nav_apartments() },
			{
				href: `/apartments/${apartment.id}`,
				label: m.buildings_apartment_number({ number: apartment.number })
			}
		]}
	/>
	<Panel>
		<ApartmentForm
			buildingId={apartment.buildingId}
			{apartment}
			{errors}
			cancelHref="/apartments/{apartment.id}"
			submitLabel={m.buildings_save_changes()}
		>
			{#snippet status()}
				<!-- #1301: the day from which the Fläche and Zimmeranzahl above apply («Gültig ab»); empty on every visit,
				the day belongs to one save -->
				<DateInput
					id="sizeFrom"
					name="sizeFrom"
					label={m.apartments_form_size_from_label()}
					help={m.apartments_form_size_from_help()}
					value=""
					optional
					testid="apartment-size-from-input"
				/>
				<StatusField {apartment} />
				<!-- #1284: the day from which the apartment no longer exists; only here, a new one exists -->
				<DateInput
					id="discontinuedFrom"
					name="discontinuedFrom"
					label={m.apartments_form_discontinued_label()}
					help="{m.apartments_form_discontinued_help()} {m.apartments_form_discontinued_merge_enter()} {m.apartments_form_discontinued_own_use_note()}"
					value={apartment.discontinuedFrom ?? ''}
					optional
					testid="apartment-discontinued-input"
				/>
			{/snippet}
		</ApartmentForm>
	</Panel>
</div>
