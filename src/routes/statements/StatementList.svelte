<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import StatementRow from './StatementRow.svelte';

	// The statements of the page, each a row with its actions
	let {
		statements,
		onmarkpaid
	}: { statements: StatementWithDetails[]; onmarkpaid: (statement: StatementWithDetails) => void } =
		$props();
</script>

<ul class="divide-y divide-line rounded-panel border border-line bg-surface">
	{#each statements as statement (statement.id)}
		<StatementRow {statement} {onmarkpaid} />
	{/each}
</ul>
