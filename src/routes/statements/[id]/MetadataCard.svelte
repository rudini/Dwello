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
		delivery = null,
		resent = [],
		newPdfMadeAt = null
	}: {
		createdAt?: string | null;
		pdfGeneratedAt?: string | null;
		sentOn?: string | null;
		paidOn?: string | null;
		paymentResets?: { resetOn: string; paidDate: string | null }[]; // payments taken back (#92)
		correctionDeclinedOn?: string | null; // «Nicht berichtigen» (#454)
		delivery?: Delivery | null; // without a Dokument (before #449, or no PDF) only «Versendet»
		resent?: { id: string; newPdf: boolean; sentAt: string | null; createdAt?: string }[]; // again by letter (#534), a new PDF (#968)
		newPdfMadeAt?: string | null; // the new PDF still to send (#968)
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
					// its own day: the statement date moves with a redelivery (#534)
					date: delivery?.sentAt ? formatDate(delivery.sentAt) : sentOn && formatDate(sentOn)
				}
	);
	// each later sending on its day; the PDF the tenant got last is the one to show (#965)
	// a new PDF first with the time it was made, when the change was saved (Persona Dr. Weber 534-2 P-1)
	const madeRow = (at: string | null | undefined) => ({ label: m.statements_history_new_pdf(), date: at && formatDateTime(at) });
	const later = $derived(
		resent.flatMap((sending) => [
			...(sending.newPdf ? [madeRow(sending.createdAt)] : []),
			{
				label: sending.newPdf ? m.statements_history_new_pdf_sent_letter() : m.statements_history_redelivered_letter(),
				date: sending.sentAt && formatDate(sending.sentAt)
			}
		])
	);
	const lastSent = $derived(resent.at(-1)?.sentAt ?? delivery?.sentAt);
	const sentPdfId = $derived(resent.at(-1)?.id ?? delivery?.id);

	// a PDF made after the last sending is a new one: the sent one stays as its Dokument (#524, Fachreview 524-1 V-3;
	// glossary «Versendetes PDF», «neues PDF», #965)
	const newPdf = $derived(!newPdfMadeAt && !!pdfGeneratedAt && !!lastSent && pdfGeneratedAt > lastSent);
	// the PDF of the first sending was made then: it stays in the Verlauf when a change discards it (534-2 P-1)
	// a PDF made after it never takes its place (Code-Review 534close-1 C-1)
	const firstPdfAt = $derived(delivery?.sentAt && (!pdfGeneratedAt || pdfGeneratedAt > delivery.sentAt) ? delivery.sentAt : pdfGeneratedAt);
	const pdfRow = $derived({ label: m.statements_pdf_created(), date: firstPdfAt && formatDateTime(firstPdfAt) });
	const newPdfRow = $derived(madeRow(pdfGeneratedAt));
	const dates = $derived(
		[
			{ label: m.statements_history_created(), date: createdAt && formatDateTime(createdAt) },
			pdfRow,
			{ label: sent.label, date: sentOn && sent.date },
			...later,
			...(newPdf ? [newPdfRow] : []),
			...(newPdfMadeAt ? [madeRow(newPdfMadeAt)] : []),
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
		{#if sentPdfId}
			<div>
				<Button
					variant="secondary"
					href="/documents/{sentPdfId}/pdf"
					icon="document-download"
					testid="statement-history-sent-pdf">{m.statements_history_sent_pdf()}</Button
				>
			</div>
		{/if}
	</Panel>
{/if}
