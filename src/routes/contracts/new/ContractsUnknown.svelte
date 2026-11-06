<script module lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast, dismissToast } from '$lib/stores';

	let failed = 0; // the error of the last attempt: the next result replaces it (#669, Sven P-1)

	/** After «Erneut versuchen»: says how it went; on success the button is gone, so the focus goes to `next` */
	export function retried(stillUnknown: boolean, next: HTMLElement | null | undefined) {
		dismissToast(failed);
		if (stillUnknown) {
			failed = addToast('error', m.contracts_apartment_contracts_retry_failed());
			return;
		}
		addToast('success', m.contracts_apartment_contracts_loaded());
		next?.focus();
	}
</script>

<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// The apartment's contracts could not be loaded (#143): with `onretry` the hint loads them again, the
	// input stays (#151); without it, it points to the hint at the apartment, so a page has one such button;
	// its title and text describe the field it is about (`{testid}-title {testid}-text`, #665)
	let { onretry, testid }: { onretry?: () => void; testid: string } = $props();
</script>

{#snippet retry()}
	<Button icon="refresh" onclick={onretry} testid="contracts-retry"
		>{m.contracts_apartment_contracts_retry()}</Button
	>
{/snippet}

<!-- the title says what matters most: saving checks it (#666); TODO(fachlich prüfen, #1142): «frei (Wohnung)» -->
<Alert
	tone="caution"
	title={m.contracts_apartment_contracts_unknown()}
	titleId="{testid}-title"
	action={onretry ? retry : undefined}
	{testid}
>
	<p id="{testid}-text">
		{onretry
			? m.contracts_apartment_contracts_unknown_text()
			: m.contracts_apartment_contracts_see_apartment()}
	</p>
</Alert>
