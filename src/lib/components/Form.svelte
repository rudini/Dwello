<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';

	interface Props {
		onsubmit?: (_event: SubmitEvent) => void;
		error?: string;
		class?: string;
		children?: Snippet;
	}

	let { onsubmit, error = '', class: className = '', children }: Props = $props();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onsubmit?.(event);
	}
</script>

<Card class={className}>
	<form onsubmit={handleSubmit} class="space-y-6">
		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<p class="text-sm text-red-700">{error}</p>
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</form>
</Card>
