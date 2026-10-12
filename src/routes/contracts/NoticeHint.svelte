<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// «Befristet» chosen for an open-ended contract is often a notice: that is entered with «Mietvertrag beenden»,
	// so the contract stays open-ended and the page names the next steps (persona Sven K1)
	let { shown, href }: { shown: boolean; href: string } = $props();
	const link = 'font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
</script>

{#if shown}
	<Alert tone="info" title={m.contracts_notice_hint_title()} testid="contract-notice-hint">
		<p>
			{m.contracts_notice_hint_text()}
			<a {href} class={link}>{m.contracts_notice_hint_link()}</a>
		</p>
	</Alert>
{/if}
