<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { addToast } from '$lib/stores';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	let {
		startDate,
		endDate,
		advancePayments = [],
		advanceDelete = null,
		readonly = false
	}: {
		startDate: string;
		endDate?: string | null;
		advancePayments?: { validFrom: string; amount: string }[]; // each Akonto with its «Gültig ab» (#464)
		advanceDelete?: { validFrom: string; error: string } | null; // a refused deletion, shown in its dialog
		readonly?: boolean; // in the edit form: the amounts already entered, deleted on the contract page (persona Helga 464-2 P-1)
	} = $props();

	// #464: each Akonto up to the day before the next; the first from the Vertragsbeginn, the last up to the end
	const dayBefore = (iso: string) => {
		const [year, month, day] = iso.split('-').map(Number);
		return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
	};
	const advancePeriods = $derived(
		advancePayments.length < 2
			? []
			: advancePayments.map(({ validFrom, amount }, index) => {
					const from = formatDate(index ? validFrom : startDate);
					const next = advancePayments[index + 1];
					const to = next ? dayBefore(next.validFrom) : endDate;
					const values = { amount: formatCurrency(Number(amount)), from };
					return {
						validFrom,
						values,
						before: index ? formatCurrency(Number(advancePayments[index - 1].amount)) : null, // the first stays
						text: to
							? m.contracts_advance_period({ ...values, to: formatDate(to) })
							: m.contracts_advance_period_open(values)
					};
				})
	);
	// #464 (product owner on F-13): a later Akonto can be deleted; the one before applies again from its day
	let deleting = $state(untrack(() => advanceDelete?.validFrom ?? ''));
	let deleteOpen = $state(untrack(() => !!advanceDelete));
	const deleted = $derived(advancePeriods.find((period) => period.validFrom === deleting));
	const deleteError = $derived(
		advanceDelete?.validFrom === deleting ? advanceDelete.error : undefined
	);
</script>

{#if advancePeriods.length}
	<div class="flex flex-col gap-2">
		<h4 class="font-semibold text-ink">{m.contracts_advance_periods()}</h4>
		<ul class="flex flex-col gap-2 tabular-nums">
			{#each advancePeriods as period (period.validFrom)}
				<li
					class="flex flex-wrap items-center justify-between gap-2 text-ink"
					data-testid="contract-advance-period"
				>
					<span>{period.text}</span>
					{#if period.before && !readonly}
						<Button
							variant="danger-ghost"
							icon="delete"
							onclick={() => ((deleting = period.validFrom), (deleteOpen = true))}
							testid="contract-advance-delete"
							>{m.contracts_advance_delete({ from: period.values.from })}</Button
						>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}
{#if deleted?.before}
	<ActionDialog
		bind:open={deleteOpen}
		action="?/deleteAdvance"
		title={m.contracts_advance_delete_title({ from: deleted.values.from })}
		confirmLabel={m.contracts_advance_delete_confirm()}
		danger
		confirmTestid="contract-advance-delete-confirm"
		error={deleteError}
		fields={{ validFrom: deleting }}
		onsuccess={() => addToast('success', m.contracts_advance_deleted_toast({ from: deleted.values.from }))}
	>
		<p>{m.contracts_advance_delete_text({ ...deleted.values, before: deleted.before })}</p>
	</ActionDialog>
{/if}
