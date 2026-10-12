<script lang="ts">
	import { endedSince, pastEndConfirmation } from '$lib/contract-status';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { formatDate } from '$lib/utils/format';

	// A Vertragsende in the past, e.g. a notice recorded late, is confirmed with its consequence;
	// the confirmation holds only for the day shown when it was given
	let {
		endDate,
		today,
		confirmedDay = $bindable(''),
		error = $bindable('')
	}: { endDate: string; today: string; confirmedDay?: string; error?: string } = $props();

	const past = $derived(pastEndConfirmation(endDate, today) !== null);
	// a day over a year back is often a typo in the year
	const yearAgo = $derived(`${Number(today.slice(0, 4)) - 1}${today.slice(4)}`);
</script>

<!-- announced when it appears: a past day needs a confirmation -->
<div aria-live="polite">
	{#if past}
		<Checkbox
			id="pastConfirmed"
			label="Der Mietvertrag endete am {formatDate(endDate)}."
			help="Das Vertragsende liegt in der Vergangenheit.{endDate < yearAgo
				? ' Das ist über ein Jahr her. Prüfen Sie das Jahr.'
				: ''} Seit dem {endedSince(
				endDate
			)} gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter. Das Akonto des Mieters zählt nur bis zum Vertragsende."
			{error}
			bind:checked={
				() => confirmedDay !== '' && confirmedDay === endDate,
				(checked) => {
					confirmedDay = checked ? endDate : '';
					if (checked) error = '';
				}
			}
			testid="contract-end-past-confirm"
		/>
	{/if}
</div>
