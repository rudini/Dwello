<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// The chosen apartment's contracts could not be loaded (#143): with `onretry` the hint loads them again, the
	// input stays (#151); without it, it points to the hint at the apartment, so a page has one such button
	let { onretry, testid }: { onretry?: () => void; testid: string } = $props();
</script>

{#snippet retry()}
	<Button icon="refresh" onclick={onretry} testid="contracts-retry"
		>{m.contracts_apartment_contracts_retry()}</Button
	>
{/snippet}

<Alert
	tone="caution"
	title={m.contracts_apartment_contracts_unknown()}
	action={onretry ? retry : undefined}
	{testid}
>
	<p>
		{onretry
			? m.contracts_apartment_contracts_unknown_text()
			: m.contracts_apartment_contracts_see_apartment()}
	</p>
</Alert>
