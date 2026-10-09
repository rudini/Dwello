<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		icon: string;
		label: string;
		value: string | number;
		valueClass?: string;
	}

	let { icon, label, value, valueClass = 'text-text-dark' }: Props = $props();
</script>

<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
	<div class="flex items-center gap-3">
		<div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
			<Icon name={icon} size={20} class="text-accent" />
		</div>
		<div>
			<p class="text-sm text-ink-muted">{label}</p>
			<p class="text-xl font-bold {valueClass}">{value}</p>
		</div>
	</div>
</div>
