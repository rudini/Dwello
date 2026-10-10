<script lang="ts">
	import Icon from './Icon.svelte';

	// Live status of a draft kept in the browser
	let { savedAt }: { savedAt: Date | null } = $props();
	const time = $derived(
		savedAt?.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) ?? ''
	);
</script>

<p role="status" class="flex items-center gap-2 text-ink-muted" data-testid="save-status">
	{#if savedAt}
		<Icon name="success" />
		Entwurf gespeichert, {time}
	{/if}
</p>
