<script lang="ts">
	import Icon from './Icon.svelte';

	type Variant = 'primary' | 'secondary' | 'icon';

	interface Props {
		variant?: Variant;
		icon?: string;
		onclick?: () => void;
		disabled?: boolean;
		class?: string;
	}

	let { variant = 'primary', icon, onclick, disabled = false, class: className = '' }: Props = $props();

	const baseClasses =
		'transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary: 'bg-primary text-white hover:bg-blue-700 py-2.5 px-4 rounded-lg shadow-sm',
		secondary: 'bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 py-2 px-4 rounded-lg',
		icon: 'size-10 bg-slate-100 rounded-lg hover:text-primary hover:bg-primary/10'
	};

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${className}`);
</script>

<button {disabled} onclick={onclick} class={classes}>
	{#if icon}
		<Icon name={icon} size={variant === 'icon' ? 20 : 16} />
	{/if}
	{#if variant !== 'icon'}
		<slot />
	{/if}
</button>
