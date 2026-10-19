<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// At the Betrag of a saved invoice: the Akontorechnungen the Rechnungssteller deducted on its Beleg, as the KI saw
	// them when it was uploaded, with the rule as help below (#455)
	let { amount, rule }: { amount: string; rule: string } = $props(); // rule: where «Rechnung löschen» is (455 V-14)
</script>

<Alert
	tone="caution"
	title={m.invoices_beleg_deducted({ amount: formatCurrency(Number(amount)) })}
	testid="invoice-deducted-hint"
>
	<p class="text-ink-muted" data-testid="invoice-deducted-rule">
		{rule}
	</p>
</Alert>
