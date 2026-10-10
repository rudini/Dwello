<script lang="ts">
	import type { Snippet } from 'svelte';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';

	// A wizard reopened with a draft kept in this browser: when it was last changed, and a way to start over
	let {
		savedAt,
		ondiscard,
		children
	}: { savedAt: Date | null; ondiscard: () => void; children?: Snippet } = $props(); // null: no draft, no notice

	const when = $derived(
		savedAt &&
			`am ${savedAt.toLocaleDateString('de-CH')} um ${savedAt.toLocaleTimeString('de-CH', {
				hour: '2-digit',
				minute: '2-digit'
			})}`
	);
</script>

{#if savedAt}
	<Alert title="Entwurf wiederhergestellt" testid="draft-restored">
		<p>Ihre Angaben, zuletzt {when} bearbeitet, sind wieder da.</p>
		{@render children?.()}
		{#snippet action()}
			<Button variant="secondary" icon="delete" onclick={ondiscard} testid="draft-discard"
				>Entwurf verwerfen</Button
			>
		{/snippet}
	</Alert>
{/if}
