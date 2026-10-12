<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { balanceLabel, statusLabels, statusTones } from '$lib/statement';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// One statement: the whole row opens it, named by tenant and number; PDF and payment stay buttons of their own
	let {
		statement,
		onmarkpaid
	}: { statement: StatementWithDetails; onmarkpaid: (statement: StatementWithDetails) => void } =
		$props();

	const name = $derived(
		m.statements_row_name({ number: statement.statementNumber, tenant: statement.tenantName })
	);
	const open = $derived(statement.status === 'sent' || statement.status === 'overdue');
</script>

<!-- Stacked up to xl; side by side only where all columns fit, the actions never shrink -->
<li
	class="relative flex flex-col gap-2 p-4 hover:bg-sunken xl:flex-row xl:items-center xl:gap-4"
	data-testid="statement-row-{statement.id}"
>
	<div class="flex min-w-0 flex-col gap-2 break-words xl:flex-1">
		<a
			href="/statements/{statement.id}"
			class="flex flex-col after:absolute after:inset-0"
			data-testid="statement-view-link"
		>
			<span class="font-semibold text-accent underline underline-offset-4"
				>{statement.tenantName}</span
			>
			<span class="text-ink-muted">{statement.statementNumber}</span>
		</a>
		<p class="flex flex-col text-ink">
			<span
				>{statement.buildingName}, {m.buildings_apartment_number({
					number: statement.apartmentUnit
				})}</span
			>
			<span class="text-ink-muted"
				>{formatDate(statement.periodStart)} – {formatDate(statement.periodEnd)}</span
			>
		</p>
	</div>
	<p class="flex gap-2 tabular-nums xl:w-40 xl:shrink-0 xl:flex-col xl:gap-0 xl:text-right">
		<span class="text-ink-muted">{balanceLabel(statement.balance)}</span>
		<span class="font-semibold text-ink">{formatCurrency(Math.abs(statement.balance))}</span>
	</p>
	<div class="flex flex-col items-start gap-1 xl:w-40 xl:shrink-0">
		<Badge tone={statusTones[statement.status]} label={statusLabels[statement.status]} />
		{#if statement.status === 'overdue' && statement.lastReminderDate}
			<span class="text-ink-muted"
				>{m.statements_reminded_on({ date: formatDate(statement.lastReminderDate) })}</span
			>
		{/if}
	</div>
	<!-- Above the row link, so these stay their own buttons -->
	<div class="relative flex flex-wrap gap-2 xl:w-64 xl:shrink-0 xl:flex-col xl:items-end">
		{#if statement.pdfGeneratedAt}
			<Button
				href="/api/statements/{statement.id}/pdf"
				variant="ghost"
				icon="document-download"
				ariaLabel={m.statements_pdf_download_of({ name })}
				testid="statement-pdf-link">PDF</Button
			>
		{/if}
		{#if open}
			<!-- An action with a verb and a border, so it does not read like the status badge "Bezahlt" -->
			<Button
				icon="success"
				onclick={() => onmarkpaid(statement)}
				ariaLabel={m.statements_mark_paid_of({ name })}
				testid="statement-row-mark-paid">{m.statements_mark_paid()}</Button
			>
		{/if}
	</div>
</li>
