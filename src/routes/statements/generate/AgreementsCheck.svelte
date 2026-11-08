<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// Step 3 (#91): the check whether the contracts agree the period's Nebenkosten, after it failed
	let {
		status,
		attempt,
		error,
		onretry
	}: {
		status: 'loading' | 'loaded' | 'failed';
		attempt: number; // how often «Erneut versuchen» was chosen
		error?: string; // «Weiter» was chosen
		onretry: () => void;
	} = $props();

	// #688: a retry keeps the alert, its button busy with the focus; the text says once a retry failed too
	const shown = $derived(status === 'failed' || (attempt > 0 && status === 'loading'));
	const failedAgain = $derived(attempt > 1 || (attempt > 0 && status === 'failed'));
	// after a successful retry the button is gone: the focus goes to the line that says so (#688)
	let checked = $state<HTMLElement>();
	$effect(() => checked?.focus());
</script>

<!-- while it loads, the wizard says so at the top of the step (#470) -->
{#if shown}
	<Alert tone="critical" title={m.statements_agreements_failed_title()} testid="agreements-failed">
		<p data-testid={failedAgain ? 'agreements-retry-failed' : undefined}>
			{failedAgain ? m.statements_agreements_retry_failed() : m.statements_agreements_failed_text()}
		</p>
		{#snippet action()}
			<Button
				variant="secondary"
				busy={status === 'loading'}
				onclick={onretry}
				testid="agreements-retry">{m.statements_agreements_retry()}</Button
			>
		{/snippet}
	</Alert>
{:else if attempt > 0 && status === 'loaded'}
	<p
		bind:this={checked}
		role="status"
		tabindex="-1"
		class="font-semibold text-ink"
		data-testid="agreements-checked"
	>
		{m.statements_agreements_checked()}
	</p>
{/if}
{#if error && status !== 'loaded'}
	<!-- «Weiter» before the check is done: no question to show the error at; the wizard goes on once it is (#439) -->
	<p role="alert" class="font-semibold text-ink" data-testid="agreements-wait">
		<!-- #1197: after a failed retry the alert alone gives the advice -->
		{status !== 'failed'
			? m.statements_agreements_wait()
			: failedAgain
				? m.statements_agreements_wait_retry_failed()
				: m.statements_agreements_wait_failed()}
	</p>
{/if}
