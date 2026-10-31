<script lang="ts" module>
	/** How the statement went out, from its own Dokument (#449) */
	export type Delivery = { id?: string; channel: 'email' | 'letter' | null; recipient: string | null; sentAt: string | null };
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatDate, formatDateTime } from '$lib/utils/format';

	// When the statement and its PDF were made, sent (its date, from which the deadline runs) and paid
	let {
		createdAt,
		pdfGeneratedAt,
		sentOn,
		paidOn,
		paymentResets = [],
		correctionDeclinedOn,
		delivery = null
	}: {
		createdAt?: string | null;
		pdfGeneratedAt?: string | null;
		sentOn?: string | null;
		paidOn?: string | null;
		paymentResets?: { resetOn: string; paidDate: string | null }[]; // payments taken back (#92)
		correctionDeclinedOn?: string | null; // «Nicht berichtigen» (#454)
		delivery?: Delivery | null; // without a Dokument (before #449, or no PDF) only «Versendet»
	} = $props();

	// the way it went: by letter on the statement date, by e-mail to the address at its hour (#449, #404 point 7)
	const sent = $derived(
		delivery?.channel === 'email'
			? {
					label: delivery.recipient
						? m.statements_history_sent_email_to({ email: delivery.recipient })
						: m.statements_history_sent_email(),
					date: delivery.sentAt ? formatDateTime(delivery.sentAt) : sentOn && formatDate(sentOn)
				}
			: {
					label: delivery?.channel === 'letter' ? m.statements_history_sent_letter() : m.statements_status_sent(),
					date: sentOn && formatDate(sentOn)
				}
	);

	// a PDF made after the sending is a new one: the sent one stays as its Dokument (#524, Fachreview 524-1 V-3)
	// TODO(fachlich prüfen, #965)
	const newPdf = $derived(!!pdfGeneratedAt && !!delivery?.sentAt && pdfGeneratedAt > delivery.sentAt);
	const pdfRow = $derived({
		label: newPdf ? m.statements_history_new_pdf() : m.statements_pdf_created(),
		date: pdfGeneratedAt && formatDateTime(pdfGeneratedAt)
	});
	const dates = $derived(
		[
			{ label: m.statements_history_created(), date: createdAt && formatDateTime(createdAt) },
			...(newPdf ? [] : [pdfRow]),
			{ label: sent.label, date: sentOn && sent.date },
			...(newPdf ? [pdfRow] : []),
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
		{#if delivery?.id}
			<div>
				<Button
					variant="secondary"
					href="/documents/{delivery.id}/pdf"
					icon="document-download"
					testid="statement-history-sent-pdf">{m.statements_history_sent_pdf()}</Button
				>
			</div>
		{/if}
	</Panel>
{/if}
