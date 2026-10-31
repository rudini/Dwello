<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import {
		heatingWholeText,
		sameSettingsNote,
		type invoiceRows,
		type WizardSelection
	} from '$lib/statement-wizard';
	import ChangedStatements from './ChangedStatements.svelte';
	import CategoryCheck from './CategoryCheck.svelte';
	import TankQuestion from './TankQuestion.svelte';
	import InvoiceHint from './InvoiceHint.svelte';
	import SplitKeysHint from '../SplitKeysHint.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// Plausibility checks of the preview: no invoices, missing invoices or statements that leave days of a contract
	// unbilled need a confirmation; statements that cover their contracts are named (#251), as a warning when the list
	// names one outdated or made otherwise (#132), a gap is a hint
	let {
		rows,
		period,
		confirmed = $bindable(),
		error,
		uncategorizedError,
		running
	}: {
		rows: ReturnType<typeof invoiceRows>;
		period: Pick<WizardSelection, 'periodStart' | 'periodEnd'>;
		confirmed: boolean;
		error?: string;
		uncategorizedError?: string; // «Weiter» while an invoice without category holds the run (#382)
		running: boolean; // the backend says the period is not over; repeated from step 1, where it may have been overlooked (#815)
	} = $props();

	const missing = $derived(rows.filter((row) => row.missing));
	const existing = $derived(rows.filter((row) => row.existing > 0));
	// where to choose the existing statements' settings, when they differ in one the run chooses (#132)
	const existingNote = $derived(
		[sameSettingsNote(existing.flatMap((row) => row.changed)), m.statements_existing_note()]
			.filter(Boolean)
			.join(' ')
	);
	// a statement named as outdated or other is a warning (#132, V-6)
	const existingTone = $derived(existing.some((row) => row.changed.length) ? 'caution' : 'info');
	// invoices without Leistungszeitraum that may count in the wrong period: a hint, no confirmation
	const hinted = (list: 'lateInvoices' | 'invoicesWithoutServicePeriod' | 'heatingWithoutServicePeriod' | 'uncategorized') =>
		rows.map((row) => ({ ...row, invoices: row[list] })).filter((row) => row.invoices.length > 0);
	const late = $derived(hinted('lateInvoices'));
	const uncategorized = $derived(hinted('uncategorized'));
	const whole = $derived(hinted('invoicesWithoutServicePeriod'));
	// at a tenant change by the Heizprofil: heating invoices without Leistungszeitraum beside ones with (#339)
	const heating = $derived(hinted('heatingWithoutServicePeriod'));
	// #528: a Kategorie the statements will bill by several Verteilschlüssel; a hint, no confirmation
	const splitKeys = $derived(rows.flatMap((row) => row.splitKeys));
	// a building without any invoice has its own warning above, only its Tankbestand findings are listed;
	// the question about a tank is no comparison with the year before and has its own hint
	const shown = (row: (typeof rows)[number]) => ({
		...row,
		findings: row.findings.filter(
			(f) => f.kind !== 'tank' && (!row.missing || f.kind === 'stock' || f.kind === 'consumption')
		)
	});
	const checked = $derived(rows.map(shown).filter((row) => row.findings.length > 0));
	const tankQuestions = $derived(rows.filter((row) => row.findings.some((f) => f.kind === 'tank')));
	const incomplete = $derived(checked.filter((row) => row.incomplete));
	const comparedWith = $derived(checked.find((row) => row.comparedWith)?.comparedWith);
	// The warnings that need the confirmation, read with its checkbox
	const confirming = $derived(
		[missing.length && 'missing-invoices-text', incomplete.length && 'category-check-text'].filter(
			(id): id is string => !!id
		)
	);
	const statements = (count: number) =>
		count === 1 ? m.statements_utility_one() : m.statements_utility_many({ count });
	// The invoice form returns here after saving and warns about a date outside the period;
	// with one building missing invoices it is preselected
	const toCapture = $derived([...missing, ...incomplete.filter((row) => !row.missing)]);
	const newInvoice = $derived(
		`/invoices/new?${toCapture.length === 1 ? `building=${toCapture[0].buildingId}&` : ''}returnTo=${encodeURIComponent('/statements/generate?schritt=3')}&periodStart=${period.periodStart}&periodEnd=${period.periodEnd}`
	);
</script>

{#if running}
	<Alert tone="caution" title={m.statements_period_running()} testid="preview-period-warning">
		<p>{m.statements_preview_running_text()}</p>
	</Alert>
{/if}

{#if missing.length}
	<Alert tone="caution" title={m.statements_missing_title()} testid="missing-invoices">
		<p id="missing-invoices-text">
			{m.statements_missing_text({ names: missing.map((row) => row.name).join(', ') })}
		</p>
		{#snippet action()}
			<Button href={newInvoice} icon="invoice">{m.dashboard_add_invoice()}</Button>
		{/snippet}
	</Alert>
{/if}

<InvoiceHint
	buildings={uncategorized}
	title={m.statements_uncategorized_title()}
	text={m.statements_uncategorized_text()}
	tone="caution"
	testid="uncategorized-invoices"
/>
{#if uncategorizedError}
	<p class="font-semibold text-critical" role="alert" data-testid="form-error">
		{uncategorizedError}
	</p>
{/if}

{#if checked.length}
	<CategoryCheck {checked} {comparedWith} confirm={incomplete.length > 0} {newInvoice} />
{/if}

{#if tankQuestions.length}<TankQuestion buildings={tankQuestions} />{/if}

<InvoiceHint
	buildings={whole}
	title={m.statements_whole_title()}
	text={m.statements_whole_text()}
	testid="invoices-without-service-period"
/>

<InvoiceHint
	buildings={heating}
	title={m.statements_heating_whole_title()}
	text={heatingWholeText(heating)}
	testid="heating-without-service-period"
/>

<SplitKeysHint
	{splitKeys}
	end={m.statements_split_keys_preview_end()}
	testid="statement-preview-split-keys"
	returnTo="/statements/generate?schritt=3"
/>

<InvoiceHint
	buildings={late}
	title={m.statements_late_title()}
	text={m.statements_late_text()}
	testid="late-invoices"
/>

{#if existing.length}
	<Alert tone={existingTone} title={m.statements_existing_title()} testid="existing-statements">
		<div id="existing-statements-text" class="flex flex-col gap-2">
			{#each existing as row (row.buildingId)}
				<p>
					{m.statements_existing_text({ name: row.name, statements: statements(row.existing) })}
					<a
						href="/statements?building={row.buildingId}"
						class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
						>{m.statements_view_of({ name: row.name })}</a
					>
				</p>
				<ChangedStatements buildingId={row.buildingId} statements={row.changed} />
			{/each}
			<p>{existingNote}</p>
		</div>
	</Alert>
{/if}

{#if confirming.length}
	<!-- the warnings above are read with the checkbox that confirms them -->
	<Checkbox
		id="confirm-missing"
		label={m.statements_confirm_label()}
		bind:checked={confirmed}
		{error}
		describedby={confirming.join(' ')}
		testid="confirm-missing-invoices"
	/>
{/if}
