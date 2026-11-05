<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';

	// Step 5: before creating, what happens; after, how many drafts there are and where to find them
	let {
		summary,
		count,
		createdCount,
		withoutInvoices = [],
		incomplete = [],
		draftsHref,
		zipHref
	}: {
		// what the run bills, said once more before creating (#663)
		summary?: { period: string; buildings: string; heatingProfile?: string; feePercent: number };
		count: number;
		createdCount: number | null;
		draftsHref: string;
		zipHref: string;
		withoutInvoices?: string[];
		incomplete?: string[];
	} = $props();

	const facts = $derived(
		summary
			? [
					[m.glossary_period_term(), summary.period],
					[m.statements_step_buildings(), summary.buildings],
					[m.glossary_profile_term(), summary.heatingProfile],
					[m.glossary_fee_term(), m.statements_fee_of_own({ percent: summary.feePercent })]
				]
			: []
	);
</script>

{#if createdCount === null}
	{#if summary}
		<dl class="grid gap-4 sm:grid-cols-2" data-testid="run-summary">
			{#each facts as [term, value] (term)}
				{#if value}
					<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
						<dt class="text-ink-muted">{term}</dt>
						<dd class="font-semibold text-ink">{value}</dd>
					</div>
				{/if}
			{/each}
		</dl>
	{/if}
	<div class="flex flex-col items-center gap-4 text-center" data-testid="generate-drafts-note">
		<Illustration name="statement" />
		<p class="text-lg text-ink">
			{count === 1 ? m.statements_will_create_one() : m.statements_will_create_many({ count })}
		</p>
		<p class="max-w-prose text-ink-muted">{m.statements_nothing_sent()}</p>
	</div>
	{#if withoutInvoices.length}
		<!-- the confirmed warning once more, right before the final button -->
		<Alert tone="caution" title={m.statements_without_invoices_title()} testid="generate-warning">
			<p>{m.statements_without_invoices_text({ names: withoutInvoices.join(', ') })}</p>
		</Alert>
	{/if}
	{#if incomplete.length}
		<Alert tone="caution" title={m.statements_maybe_missing_title()} testid="generate-incomplete">
			<p>{m.statements_incomplete_text({ names: incomplete.join(', ') })}</p>
		</Alert>
	{/if}
{:else}
	<div class="flex flex-col items-center gap-4 text-center">
		<Illustration name="done" />
		<p class="text-lg font-semibold text-ink" role="status" data-testid="generation-result">
			{createdCount === 1
				? m.statements_created_one()
				: m.statements_created_many({ count: createdCount })}
		</p>
		<p class="max-w-prose text-ink-muted">{m.statements_check_drafts()}</p>
		<div class="flex flex-wrap justify-center gap-4">
			<Button href={draftsHref} variant="primary" icon="statement" testid="show-statements-button"
				>{m.statements_view_drafts()}</Button
			>
			<Button href={zipHref} reload icon="document-download" testid="download-zip-button"
				>{m.statements_download_zip()}</Button
			>
			<Button href="/statements/generate" reload icon="add" testid="generate-more-button"
				>{m.statements_create_more()}</Button
			>
		</div>
	</div>
{/if}
