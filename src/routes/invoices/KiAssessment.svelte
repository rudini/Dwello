<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon from '$lib/ui/Icon.svelte';
	import ProgressBar from '$lib/ui/ProgressBar.svelte';

	// How sure the KI is about a category (0 to 1), and why it chose it
	let { confidence, reasoning }: { confidence: number; reasoning?: string } = $props();

	const percent = $derived(Math.round(confidence * 100));
</script>

<div class="flex flex-col gap-2">
	<p class="flex items-center justify-between gap-4 text-ink">
		<span>{m.invoices_ki_confidence()}</span>
		<span class="font-semibold tabular-nums">{percent} %</span>
	</p>
	<ProgressBar value={percent} max={100} label={m.invoices_ki_confidence()} />
	{#if reasoning}
		<p class="flex items-start gap-2 text-ink-muted">
			<Icon name="hint" />
			{reasoning}
		</p>
	{/if}
</div>
