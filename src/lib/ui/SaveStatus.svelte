<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatTime } from '$lib/utils/format';
	import Icon from './Icon.svelte';

	// Live status of a draft kept in the browser
	let { savedAt }: { savedAt: Date | null } = $props();
	const time = $derived(savedAt ? formatTime(savedAt) : '');
</script>

<p role="status" class="flex items-center gap-2 text-ink-muted" data-testid="save-status">
	{#if savedAt}
		<Icon name="success" />
		{m.ui_draft_saved({ time })}
	{/if}
</p>
