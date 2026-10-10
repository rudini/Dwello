<script lang="ts">
	import type { FormulaTest } from '$lib/distribution-key';
	import Alert from '$lib/ui/Alert.svelte';
	import Table from '$lib/ui/Table.svelte';

	let { test }: { test: FormulaTest } = $props();
</script>

<div class="flex flex-col gap-4" role="status" data-testid="formula-test-result">
	{#if test.errors.length}
		<Alert tone="critical" title="Die Formel lässt sich nicht rechnen">
			{#each test.errors as message (message)}
				<p data-testid="formula-test-error">{message}</p>
			{/each}
		</Alert>
	{/if}
	{#if test.results.length}
		<Table
			caption="So würden die Kosten auf vier Beispielwohnungen verteilt"
			columns={[{ label: 'Beispielwohnung' }, { label: 'Anteil an den Kosten', numeric: true }]}
		>
			{#each test.results as result (result.apartment)}
				<tr data-testid="formula-test-row">
					<td class="text-ink">{result.apartment}</td>
					<td class="text-right font-semibold text-ink" data-testid="formula-test-share"
						>{result.share}</td
					>
				</tr>
			{/each}
		</Table>
	{/if}
</div>
