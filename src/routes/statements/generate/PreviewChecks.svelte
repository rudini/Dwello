<script lang="ts">
	import type { invoiceRows } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// Plausibility checks of the preview: no invoices or existing statements need a confirmation, a gap is a hint
	let {
		rows,
		confirmed = $bindable(),
		error
	}: { rows: ReturnType<typeof invoiceRows>; confirmed: boolean; error?: string } = $props();

	const missing = $derived(rows.filter((row) => row.missing));
	const partial = $derived(rows.filter((row) => row.partial));
	const existing = $derived(rows.filter((row) => row.existing > 0));
	const statements = (count: number) =>
		count === 1 ? '1 Nebenkostenabrechnung' : `${count} Nebenkostenabrechnungen`;
</script>

{#if missing.length}
	<Alert tone="caution" title="Rechnungen fehlen" testid="missing-invoices">
		<p>
			Für {missing.map((row) => row.name).join(', ')} sind in der Abrechnungsperiode keine Rechnungen
			erfasst. Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto
			zurück. Erfassen Sie zuerst die Rechnungen – oder bestätigen Sie unten, dass es keine gibt.
		</p>
		{#snippet action()}
			<Button href="/invoices/new" icon="invoice">Rechnung erfassen</Button>
		{/snippet}
	</Alert>
{/if}

{#if existing.length}
	<Alert tone="caution" title="Es gibt schon Abrechnungen" testid="existing-statements">
		{#each existing as row (row.buildingId)}
			<p>
				Für {row.name} gibt es in dieser Abrechnungsperiode schon {statements(row.existing)}.
			</p>
		{/each}
		<p>Wenn Sie weitergehen, entstehen zusätzliche Entwürfe. Prüfen Sie zuerst die bestehenden.</p>
		{#snippet action()}
			<Button href="/statements?status=draft" icon="statement"
				>Bestehende Abrechnungen ansehen</Button
			>
		{/snippet}
	</Alert>
{/if}

{#if missing.length || existing.length}
	<Checkbox
		id="confirm-missing"
		label="Die Abrechnungen trotzdem erstellen"
		bind:checked={confirmed}
		{error}
		testid="confirm-missing-invoices"
	/>
{/if}

{#if partial.length}
	<!-- TODO(fachlich prüfen): a hint only; one oil delivery a year can be complete -->
	<Alert tone="caution" title="Rechnungen nur für einen Teil der Periode" testid="partial-invoices">
		<p>
			Für {partial.map((row) => row.name).join(', ')} gibt es am Anfang oder Ende der Abrechnungsperiode
			mehr als drei Monate ohne Rechnung. Prüfen Sie, ob noch Rechnungen fehlen.
		</p>
	</Alert>
{/if}
