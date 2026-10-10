<script lang="ts">
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

	const name = $derived(`Abrechnung ${statement.statementNumber} von ${statement.tenantName}`);
	const open = $derived(statement.status === 'sent' || statement.status === 'overdue');
</script>

<li
	class="relative flex flex-col gap-2 p-4 hover:bg-sunken md:grid md:grid-cols-12 md:items-center md:gap-4"
	data-testid="statement-row-{statement.id}"
>
	<a
		href="/statements/{statement.id}"
		class="flex flex-col after:absolute after:inset-0 md:col-span-4"
		data-testid="statement-view-link"
	>
		<span class="font-semibold text-accent underline underline-offset-4"
			>{statement.tenantName}</span
		>
		<span class="text-ink-muted">{statement.statementNumber}</span>
	</a>
	<p class="flex flex-col text-ink md:col-span-3">
		<span>{statement.buildingName}, Wohnung {statement.apartmentUnit}</span>
		<span class="text-ink-muted"
			>{formatDate(statement.periodStart)} – {formatDate(statement.periodEnd)}</span
		>
	</p>
	<p class="flex gap-2 tabular-nums md:col-span-2 md:flex-col md:gap-0 md:text-right">
		<span class="text-ink-muted">{balanceLabel(statement.balance)}</span>
		<span class="font-semibold text-ink">{formatCurrency(Math.abs(statement.balance))}</span>
	</p>
	<div class="flex flex-col items-start gap-1 md:col-span-2">
		<Badge tone={statusTones[statement.status]} label={statusLabels[statement.status]} />
		{#if statement.status === 'overdue' && statement.lastReminderDate}
			<span class="text-ink-muted">Gemahnt am {formatDate(statement.lastReminderDate)}</span>
		{/if}
	</div>
	<!-- Above the row link, so these stay their own buttons -->
	<div class="relative flex flex-wrap gap-2 md:col-span-1 md:flex-col">
		{#if statement.pdfGeneratedAt}
			<Button
				href="/api/statements/{statement.id}/pdf"
				variant="ghost"
				icon="document-download"
				ariaLabel="PDF herunterladen: {name}"
				testid="statement-pdf-link">PDF</Button
			>
		{/if}
		{#if open}
			<Button
				variant="ghost"
				icon="success"
				onclick={() => onmarkpaid(statement)}
				ariaLabel="Bezahlt markieren: {name}"
				testid="statement-row-mark-paid">Bezahlt</Button
			>
		{/if}
	</div>
</li>
