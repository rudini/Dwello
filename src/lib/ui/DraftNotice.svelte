<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import { formatDate, formatTime } from '$lib/utils/format';
	import Alert from './Alert.svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';

	// A wizard reopened with a draft kept in this browser: when it was last changed, what of it is gone meanwhile
	// (notes), a way to start over after asking (#201) and one to close the notice and keep the input
	let {
		savedAt,
		ondiscard,
		notes = [],
		children
	}: {
		savedAt: Date | null; // null: no draft, no notice
		ondiscard: () => void;
		notes?: string[];
		children?: Snippet;
	} = $props();

	let asking = $state(false);
	let closed = $state(false);
	const when = (at: Date) => ({ date: formatDate(at.toISOString()), time: formatTime(at) });

	// the focus goes back to the step's heading, not to the page (persona Anna, review of #201)
	function close() {
		closed = true;
		document.querySelector<HTMLElement>('h2[tabindex="-1"]')?.focus();
	}

	function discard() {
		asking = false;
		ondiscard();
	}
</script>

{#if savedAt && !closed}
	<Alert title={m.ui_draft_restored()} testid="draft-restored">
		<p>{m.ui_draft_back(when(savedAt))}</p>
		{#each notes as note (note)}
			<p data-testid="draft-note">{note}</p>
		{/each}
		{@render children?.()}
		{#snippet action()}
			<div class="flex flex-wrap gap-4">
				<Button
					variant="secondary"
					icon="delete"
					onclick={() => (asking = true)}
					testid="draft-discard">{m.ui_draft_discard()}</Button
				>
				<Button
					variant="secondary"
					icon="close"
					onclick={close}
					testid="draft-close">{m.ui_close_message()}</Button
				>
			</div>
		{/snippet}
	</Alert>
{/if}

<Dialog
	bind:open={asking}
	title={m.ui_draft_discard_title()}
	confirmLabel={m.ui_draft_discard()}
	danger
	onconfirm={discard}
	confirmTestid="draft-discard-confirm"
>
	<p data-testid="draft-discard-message">{m.ui_draft_discard_text()}</p>
</Dialog>
