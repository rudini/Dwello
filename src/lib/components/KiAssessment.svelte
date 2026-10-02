<script lang="ts">
	import Icon from './Icon.svelte';

	// How sure the KI is about a category (0 to 1), and why it chose it
	let { confidence, reasoning }: { confidence: number; reasoning?: string } = $props();

	const percent = $derived(Math.round(confidence * 100));
</script>

<div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
	<span>Konfidenz:</span>
	<div class="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
		<div class="bg-blue-500 h-2 rounded-full" style="width: {percent}%"></div>
	</div>
	<span class="font-medium">{percent}%</span>
</div>
<p class="text-sm text-gray-500" hidden={!reasoning}>
	<Icon name="lightbulb" size={16} class="inline mr-1" />
	{reasoning}
</p>
