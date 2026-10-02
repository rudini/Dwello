<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	let { filtered, onclear, testid }: { filtered: boolean; onclear: () => void; testid: string } = $props();
</script>

<div class="flex gap-2">
	<Button type="submit" variant="primary" size="sm" {testid}>
		<Icon name="search" size={16} />
		Suchen
	</Button>
	{#if filtered}
		<Button type="button" variant="secondary" size="sm" onclick={onclear}>
			<Icon name="close" size={16} />
			Filter löschen
		</Button>
	{/if}
</div>
