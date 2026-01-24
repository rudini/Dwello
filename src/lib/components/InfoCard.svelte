<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		icon: string;
		label: string;
		value: string | number;
	}

	let { icon, label, value }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<div class="flex items-center">
		<Icon name={icon} size={20} class="text-text-secondary" />
	</div>
	<p class="text-xs font-medium text-text-secondary">{label}</p>
	<p class="text-lg font-bold text-text-dark">{value}</p>
</div>
