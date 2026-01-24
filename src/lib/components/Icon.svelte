<script lang="ts">
	interface Props {
		name: string;
		size?: number;
		class?: string;
	}

	let { name, size = 24, class: className = '' }: Props = $props();
</script>

<span
	class="material-symbols-outlined {className}"
	style="font-size: {size}px; line-height: {size}px; width: {size}px; height: {size}px;"
>
	{name}
</span>

<style>
	:global(.material-symbols-outlined) {
		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
	}
</style>
