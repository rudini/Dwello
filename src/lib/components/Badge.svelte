<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
	type Size = 'sm' | 'md';

	interface Props {
		variant?: Variant;
		size?: Size;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', size = 'md', class: className = '', children }: Props = $props();

	const variantClasses: Record<Variant, string> = {
		default: 'bg-gray-100 text-gray-700',
		primary: 'bg-primary/10 text-primary',
		success: 'bg-green-100 text-positive',
		warning: 'bg-amber-100 text-caution',
		danger: 'bg-red-100 text-critical',
		info: 'bg-blue-100 text-accent'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm'
	};

	const classes = $derived(
		`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<span class={classes}>
	{#if children}
		{@render children()}
	{/if}
</span>
