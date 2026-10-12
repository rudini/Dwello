<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// «Befristet» chosen for an open-ended contract is often a notice: that is entered with «Beenden»,
	// so the contract stays open-ended and the page names the next steps (persona Sven K1)
	let { shown, href }: { shown: boolean; href: string } = $props();
	const link =
		'inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
</script>

<!-- the region is there before the hint, so the hint is announced when «Befristet» is chosen (persona Sven K2) -->
<!-- empty, it takes no gap in the form -->
<div aria-live="polite" class={shown ? '' : 'sr-only'} data-testid="contract-notice-region">
	{#if shown}
		<Alert tone="info" title={m.contracts_notice_hint_title()} testid="contract-notice-hint">
			<p>{m.contracts_notice_hint_text()}</p>
			<a {href} class={link}>{m.contracts_notice_hint_link()}</a>
		</Alert>
	{/if}
</div>
