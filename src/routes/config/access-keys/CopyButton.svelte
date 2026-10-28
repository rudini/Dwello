<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';

	// #817 (personas Helga P-1, Marco P-1): a long key or address is not marked by hand without missing a character
	let { text, label, testid }: { text: string; label: string; testid: string } = $props();

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			addToast('success', m.ai_keys_copied());
		} catch {
			addToast('error', m.ai_keys_copy_failed());
		}
	}
</script>

<Button icon="document" onclick={copy} {testid}>{label}</Button>
