<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	// Which statements the list shows, with the way to all of them and back to the contract it is filtered by (#673)
	let { scope, contract }: { scope: string; contract: string } = $props();
</script>

<p class="text-ink" data-testid="statements-scope">
	{scope}
	<a
		href="/statements"
		class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
		>{m.statements_scope_all()}</a
	>
	{#if contract}
		<a
			href="/contracts/{encodeURIComponent(contract)}"
			class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
			data-testid="statements-scope-contract-link">{m.statements_scope_contract_link()}</a
		>
	{/if}
</p>
