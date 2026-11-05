<script lang="ts">
	// #1126: a note whose «{statements}» are the tenants' names, each linked to its statement
	let {
		text,
		statements,
		testid
	}: {
		text: (statements: string) => string;
		statements: { id: string; tenantName: string }[];
		testid?: string;
	} = $props();
	const parts = $derived(text('\u0000').split('\u0000'));
</script>

<li data-testid="cost-reconciliation-note">
	{parts[0]}<span data-testid={testid}
		>{#each statements as statement, i (statement.id)}{i ? ', ' : ''}<a
				class="font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
				href="/statements/{statement.id}">{statement.tenantName}</a
			>{/each}</span
	>{parts[1]}
</li>
