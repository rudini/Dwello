<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// Step 3 (#91): the check whether the contracts agree the period's Nebenkosten, while it loads or after it failed
	let {
		status,
		error,
		onretry
	}: {
		status: 'loading' | 'loaded' | 'failed';
		error?: string; // «Weiter» was chosen
		onretry: () => void;
	} = $props();
</script>

{#if status === 'loading'}
	<p role="status" class="text-ink-muted" data-testid="agreements-loading">
		{m.statements_agreements_loading()}
	</p>
{:else if status === 'failed'}
	<Alert tone="critical" title={m.statements_agreements_failed_title()} testid="agreements-failed">
		<p>{m.statements_agreements_failed_text()}</p>
		{#snippet action()}
			<Button variant="secondary" onclick={onretry} testid="agreements-retry"
				>{m.statements_agreements_retry()}</Button
			>
		{/snippet}
	</Alert>
{/if}
{#if error && status !== 'loaded'}
	<!-- «Weiter» before the check is done: no question to show the error at; the wizard goes on once it is (#439) -->
	<p role="alert" class="font-semibold text-ink" data-testid="agreements-wait">
		{status === 'failed' ? m.statements_agreements_wait_failed() : m.statements_agreements_wait()}
	</p>
{/if}
