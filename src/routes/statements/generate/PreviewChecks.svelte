<script lang="ts">
	import type { invoiceRows } from '$lib/statement-wizard';
	import CategoryCheck from './CategoryCheck.svelte';
	import TankQuestion from './TankQuestion.svelte';
	import { localToday } from '$lib/contract-status';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// Plausibility checks of the preview: no invoices or existing statements need a confirmation, a gap is a hint
	let {
		rows,
		period,
		confirmed = $bindable(),
		error
	}: {
		rows: ReturnType<typeof invoiceRows>;
		period: { periodStart: string; periodEnd: string };
		confirmed: boolean;
		error?: string;
	} = $props();

	// ISO dates compare as text; repeated from step 1, where it may have been overlooked
	const notOver = $derived(period.periodEnd >= localToday());
	const missing = $derived(rows.filter((row) => row.missing));
	const partial = $derived(rows.filter((row) => row.partial));
	const existing = $derived(rows.filter((row) => row.existing > 0));
	// a building without any invoice has its own warning above, only its Tankbestand hints are listed;
	// the question about a tank is no comparison with the year before and has its own hint
	const shown = (row: (typeof rows)[number]) => ({
		...row,
		findings: row.findings.filter((f) => f.kind !== 'tank' && (!row.missing || f.kind === 'stock'))
	});
	const checked = $derived(rows.map(shown).filter((row) => row.findings.length > 0));
	const tankQuestions = $derived(rows.filter((row) => row.findings.some((f) => f.kind === 'tank')));
	const incomplete = $derived(checked.filter((row) => row.incomplete));
	const comparedWith = $derived(checked.find((row) => row.comparedWith)?.comparedWith);
	// The warnings that need the confirmation, read with its checkbox
	const confirming = $derived(
		[
			missing.length && 'missing-invoices-text',
			incomplete.length && 'category-check-text',
			existing.length && 'existing-statements-text'
		].filter((id): id is string => !!id)
	);
	const statements = (count: number) =>
		count === 1 ? '1 Nebenkostenabrechnung' : `${count} Nebenkostenabrechnungen`;
	// The invoice form returns here after saving and warns about a date outside the period;
	// with one building missing invoices it is preselected
	const toCapture = $derived([...missing, ...incomplete.filter((row) => !row.missing)]);
	const newInvoice = $derived(
		`/invoices/new?${toCapture.length === 1 ? `building=${toCapture[0].buildingId}&` : ''}returnTo=${encodeURIComponent('/statements/generate?schritt=3')}&periodStart=${period.periodStart}&periodEnd=${period.periodEnd}`
	);
</script>

{#if notOver}
	<Alert tone="caution" title="Periode läuft noch" testid="preview-period-warning">
		<p>
			Die Abrechnungsperiode ist noch nicht zu Ende. Das Akonto zählt für alle Monate, auch die noch
			nicht bezahlten, und Rechnungen bis zum Ende der Periode fehlen noch. Erstellen Sie die
			Abrechnungen erst nach dem Ende der Periode.
		</p>
	</Alert>
{/if}

{#if missing.length}
	<Alert tone="caution" title="Rechnungen fehlen" testid="missing-invoices">
		<p id="missing-invoices-text">
			Für {missing.map((row) => row.name).join(', ')} sind in der Abrechnungsperiode keine Rechnungen
			erfasst. Ohne Rechnungen fehlen deren Kosten in den Abrechnungen, und die Mieter erhalten ihr Akonto
			weitgehend zurück. Erfassen Sie zuerst die Rechnungen – oder bestätigen Sie unten, dass es keine
			gibt.
		</p>
		{#snippet action()}
			<Button href={newInvoice} icon="invoice">Rechnung erfassen</Button>
		{/snippet}
	</Alert>
{/if}

{#if checked.length}
	<CategoryCheck {checked} {comparedWith} confirm={incomplete.length > 0} {newInvoice} />
{/if}

{#if tankQuestions.length}<TankQuestion buildings={tankQuestions} />{/if}

{#if existing.length}
	<Alert tone="caution" title="Es gibt schon Abrechnungen" testid="existing-statements">
		<div id="existing-statements-text" class="flex flex-col gap-2">
			{#each existing as row (row.buildingId)}
				<p>
					Für {row.name} gibt es in dieser Abrechnungsperiode schon {statements(row.existing)}.
					<a
						href="/statements?building={row.buildingId}"
						class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
						>Abrechnungen von {row.name} ansehen</a
					>
				</p>
			{/each}
			<p>
				Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue. Um einen Entwurf
				neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut.
			</p>
		</div>
	</Alert>
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

{#if confirming.length}
	<!-- the warnings above are read with the checkbox that confirms them -->
	<Checkbox
		id="confirm-missing"
		label="Die Abrechnungen trotzdem erstellen"
		bind:checked={confirmed}
		{error}
		describedby={confirming.join(' ')}
		testid="confirm-missing-invoices"
	/>
{/if}
