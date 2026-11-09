<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/utils/format';

	// #1410: until when to keep the invoice and why; a wertvermehrende Investition until the sale (Fachreview 1410-1 V-2);
	// nothing once its Aufbewahrungsfrist has passed
	let { keepUntil }: { keepUntil?: string | null } = $props();
</script>

{#if keepUntil}
	<p id="invoice-delete-retention-note" data-testid="invoice-delete-retention-note">
		{keepUntil === 'sale'
			? m.invoices_delete_retention_investment()
			: m.invoices_delete_retention({ date: formatDate(keepUntil) })}
	</p>
{/if}
