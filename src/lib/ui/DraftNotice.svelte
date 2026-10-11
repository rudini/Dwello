<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';

	// A wizard reopened with a draft kept in this browser: when it was last changed, and a way to start over
	let {
		savedAt,
		ondiscard,
		children
	}: { savedAt: Date | null; ondiscard: () => void; children?: Snippet } = $props(); // null: no draft, no notice

	const when = (at: Date) => ({
		date: at.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
		time: at.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
	});
</script>

{#if savedAt}
	<Alert title={m.ui_draft_restored()} testid="draft-restored">
		<p>{m.ui_draft_back(when(savedAt))}</p>
		{@render children?.()}
		{#snippet action()}
			<Button variant="secondary" icon="delete" onclick={ondiscard} testid="draft-discard"
				>{m.ui_draft_discard()}</Button
			>
		{/snippet}
	</Alert>
{/if}
