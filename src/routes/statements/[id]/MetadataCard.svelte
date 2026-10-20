<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatDate, formatDateTime } from '$lib/utils/format';

	// When the statement and its PDF were made, sent (its date, from which the deadline runs) and paid
	let {
		createdAt,
		pdfGeneratedAt,
		sentOn,
		paidOn,
		paymentResets = [],
		correctionDeclinedOn
	}: {
		createdAt?: string | null;
		pdfGeneratedAt?: string | null;
		sentOn?: string | null;
		paidOn?: string | null;
		paymentResets?: { resetOn: string; paidDate: string | null }[]; // payments taken back (#92)
		correctionDeclinedOn?: string | null; // «Nicht berichtigen» (#454)
	} = $props();

	const dates = $derived(
		[
			{ label: m.statements_history_created(), date: createdAt && formatDateTime(createdAt) },
			{
				label: m.statements_pdf_created(),
				date: pdfGeneratedAt && formatDateTime(pdfGeneratedAt)
			},
			{ label: m.statements_status_sent(), date: sentOn && formatDate(sentOn) },
			...paymentResets.map((reset) => ({
				label: m.statements_history_payment_reset({
					date: reset.paidDate ? formatDate(reset.paidDate) : '–'
				}),
				date: formatDate(reset.resetOn)
			})),
			{ label: m.statements_status_paid(), date: paidOn && formatDate(paidOn) },
			{
				label: m.statements_history_correction_declined(),
				date: correctionDeclinedOn && formatDate(correctionDeclinedOn)
			}
		].filter((row) => row.date)
	);
</script>

{#if dates.length}
	<Panel title={m.statements_history()} level={2}>
		<dl class="flex flex-col gap-2">
			{#each dates as row, index (index)}
				<div class="flex justify-between gap-4">
					<dt class="text-ink-muted">{row.label}</dt>
					<dd class="text-ink">{row.date}</dd>
				</div>
			{/each}
		</dl>
	</Panel>
{/if}
