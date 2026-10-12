<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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

	// short, with what to do; a confirmation reset by another day is said again
	const notice = $derived.by(() => {
		if (!past) return '';
		if (confirmedDay !== '' && confirmedDay !== endDate) return m.contracts_end_changed_again();
		return longAgo ? m.contracts_end_in_past_long() : m.contracts_end_in_past();
	});

	// the error names a day: another day typed takes it back
	let errorFor = untrack(() => endDate);
	$effect(() => {
		if (endDate === errorFor) return;
		errorFor = endDate;
		error = '';
	});
</script>

<!-- always present, so screen readers hear the short notice when it appears (empty it takes no space);
	the checkbox stays outside -->
<p
	aria-live="polite"
	class={['font-semibold text-ink', !notice && 'sr-only']}
	data-testid="contract-end-past-notice"
>
	{notice}
</p>
{#if past}
	<Checkbox
		id="pastConfirmed"
		label={m.contracts_end_confirm_label({ date: formatDate(endDate) })}
		help={m.contracts_end_confirm_help({ date: endedSince(endDate) })}
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
