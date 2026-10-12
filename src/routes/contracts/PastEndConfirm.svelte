<script lang="ts">
	import { untrack } from 'svelte';
	import { endedSince, pastEndConfirmation } from '$lib/contract-status';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { formatDate } from '$lib/utils/format';

	// A Vertragsende in the past, e.g. a notice recorded late, is confirmed with its consequence;
	// the confirmation holds only for the day shown when it was given
	let {
		endDate,
		startDate,
		today,
		confirmedDay = $bindable(''),
		error = $bindable('')
	}: {
		endDate: string;
		startDate: string;
		today: string;
		confirmedDay?: string;
		error?: string;
	} = $props();

	// a day before the Vertragsbeginn is an error at the field, not a confirmation
	const past = $derived(
		pastEndConfirmation(endDate, today) !== null && endDate >= startDate.slice(0, 10)
	);
	// a day over a year back is often a typo in the year
	const longAgo = $derived(endDate < `${Number(today.slice(0, 4)) - 1}${today.slice(4)}`);

	// the error names a day: another day typed takes it back
	let errorFor = untrack(() => endDate);
	$effect(() => {
		if (endDate === errorFor) return;
		errorFor = endDate;
		error = '';
	});
</script>

<!-- always present, so screen readers hear the short notice when it appears; the checkbox stays outside -->
<p aria-live="polite" class="font-semibold text-ink" data-testid="contract-end-past-notice">
	{#if past}
		Das Vertragsende liegt in der Vergangenheit{longAgo
			? ', über ein Jahr zurück. Prüfen Sie das Jahr.'
			: '.'} Bestätigen Sie das Vertragsende mit dem Kästchen.
	{/if}
</p>
{#if past}
	<Checkbox
		id="pastConfirmed"
		label="Der Mietvertrag endete am {formatDate(endDate)}."
		help="Seit dem {endedSince(
			endDate
		)} gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende."
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
