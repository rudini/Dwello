<script lang="ts">
	import Icon from './Icon.svelte';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		size?: Size;
		text?: string;
		fullPage?: boolean;
		class?: string;
	}

	let { size = 'md', text = '', fullPage = false, class: className = '' }: Props = $props();

	const sizeConfig: Record<Size, { icon: number; text: string }> = {
		sm: { icon: 16, text: 'text-sm' },
		md: { icon: 24, text: 'text-base' },
		lg: { icon: 32, text: 'text-lg' }
	};

	const wrapperClasses = $derived(
		fullPage
			? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'
			: `flex items-center justify-center gap-3 ${className}`
	);
</script>

<div class={wrapperClasses}>
	<div class="flex items-center gap-3">
		<span class="animate-spin text-primary">
			<Icon name="refresh" size={sizeConfig[size].icon} />
		</span>
		{#if text}
			<span class="text-gray-600 {sizeConfig[size].text}">{text}</span>
		{/if}
	</div>
</div>
