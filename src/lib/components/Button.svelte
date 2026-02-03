<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'danger' | 'icon';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		disabled?: boolean;
		class?: string;
		ariaLabel?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		onclick,
		disabled = false,
		class: className = '',
		ariaLabel,
		children
	}: Props = $props();

	const baseClasses =
		'transition-colors duration-200 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

	const variantClasses: Record<Variant, string> = {
		primary: 'bg-primary text-white hover:bg-blue-700 rounded-lg shadow-sm',
		secondary:
			'bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 rounded-lg',
		danger: 'bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm focus:ring-red-500',
		icon: 'bg-slate-100 rounded-lg hover:text-primary hover:bg-primary/10'
	};

	const sizeClassesButton: Record<Size, string> = {
		sm: 'py-1.5 px-3 text-sm',
		md: 'py-2 px-4',
		lg: 'py-2.5 px-5 text-lg'
	};

	const sizeClassesIcon: Record<Size, string> = {
		sm: 'size-8',
		md: 'size-10',
		lg: 'size-12'
	};

	const sizeClass = $derived(variant === 'icon' ? sizeClassesIcon[size] : sizeClassesButton[size]);
	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClass} ${className}`);
</script>

{#if href && !disabled}
	<a {href} class={classes} aria-label={ariaLabel}>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button {type} {disabled} onclick={onclick} class={classes} aria-label={ariaLabel}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
