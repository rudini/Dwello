<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';

	// A-5 (#114): a draft would go to the apartment the tenant left; sending stays possible
	let { statement, testid }: { statement: StatementWithDetails; testid: string } = $props();
</script>

{#if statement.status === 'draft' && statement.oldAddress}
	<Alert tone="caution" title={m.statements_old_address({ name: statement.tenantName })} {testid}>
		<a
			href="/tenants/{statement.tenantId}/edit"
			class="text-accent underline underline-offset-4 hover:text-accent-strong"
			>{m.contracts_next_address()}</a
		>
	</Alert>
{/if}
