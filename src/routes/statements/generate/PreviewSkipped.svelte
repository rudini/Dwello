<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { SkippedContract } from '$lib/statement-wizard';
	import { formatDate } from '$lib/utils/format';

	// #453 (#327): the contracts «Abgerechnet bis» covers in the whole period, and the buildings left without any
	let {
		rows
	}: {
		rows: { buildingId: string; name: string; skipped: SkippedContract[]; allSkipped: boolean }[];
	} = $props();

	const skipped = $derived(rows.flatMap((row) => row.skipped));
	// the tenant's name is the link to the contract, wherever the language puts it
	const parts = (date: string) =>
		m.statements_preview_skipped({ name: '\u0000', date: formatDate(date) }).split('\u0000');
</script>

{#each rows.filter((row) => row.allSkipped) as row (row.buildingId)}
	<p class="text-ink" data-testid="preview-all-skipped-{row.buildingId}">
		{m.statements_preview_all_skipped({ building: row.name })}
	</p>
{/each}
{#if skipped.length}
	<ul class="flex flex-col gap-2">
		{#each skipped as contract (contract.id)}
			{@const [before, after] = parts(contract.billedUntil)}
			<li class="text-ink" data-testid="preview-skipped-{contract.id}">
				{before}<a
					href="/contracts/{contract.id}"
					class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
					>{contract.tenantName}</a
				>{after}
			</li>
		{/each}
	</ul>
{/if}
