<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	// Square 48 px button with a universally known icon; the label is read out instead of shown
	let {
		icon,
		label,
		onclick,
		expanded,
		testid
	}: { icon: IconName; label: string; onclick: () => void; expanded?: boolean; testid?: string } =
		$props();
</script>

<button
	type="button"
	{onclick}
	aria-label={label}
	aria-expanded={expanded}
	class="inline-flex size-12 shrink-0 items-center justify-center rounded-control text-ink hover:bg-sunken"
	data-testid={testid}
>
	<Icon name={icon} size={24} />
</button>
