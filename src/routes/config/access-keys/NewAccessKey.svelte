<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import CopyButton from './CopyButton.svelte';

	// #817: a new Zugangsschlüssel, shown this once, with how to keep it (Fachprüfung 817-1 R-3) and the address that
	// goes into the AI program with it (personas Helga P-3, Weber P-3)
	let { key, url, onclose }: { key: string; url: string; onclose: () => void } = $props();
</script>

<Panel title={m.ai_keys_created_title()} testid="access-key-new">
	<code
		class="break-all rounded-control border border-line-strong bg-surface-sunken p-4 text-ink"
		data-testid="access-key-new-value">{key}</code
	>
	<p class="font-semibold text-ink" data-testid="access-key-new-hint">{m.ai_keys_created_hint()}</p>
	<p class="text-ink" data-testid="access-key-new-secret">{m.ai_keys_created_secret()}</p>
	<p class="break-all text-ink">{m.ai_keys_address({ url })}</p>
	<div class="flex flex-wrap gap-4">
		<CopyButton text={key} label={m.ai_keys_copy()} testid="access-key-new-copy" />
		<Button onclick={onclose} testid="access-key-new-close">{m.ai_keys_close()}</Button>
	</div>
</Panel>
