<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';

	// #817 (personas Helga P-1, Marco P-1): a long key or address is not marked by hand without missing a character
	// `done` says what was copied: two buttons on one page give two different confirmations (persona Helga 817-2 P-3)
	let { text, label, done, testid }: { text: string; label: string; done: string; testid: string } =
		$props();

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			addToast('success', done);
		} catch {
			addToast('error', m.ai_keys_copy_failed());
		}
	}
</script>

<Button icon="document" onclick={copy} {testid}>{label}</Button>
