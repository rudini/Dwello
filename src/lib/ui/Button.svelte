<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';

	let {
		children,
		variant = 'secondary',
		href,
		reload = false,
		type = 'button',
		formaction,
		onclick,
		disabled = false,
		busy = false,
		busyLabel = 'Bitte warten …',
		icon,
		full = false,
		ariaLabel,
		testid
	}: {
		children: Snippet;
		variant?: Variant;
		href?: string;
		reload?: boolean; // follows href with a full page load
		type?: 'button' | 'submit';
		formaction?: string;
		onclick?: (event: MouseEvent) => void;
		disabled?: boolean;
		busy?: boolean; // while saving: shows busyLabel and cannot be pressed again
		busyLabel?: string;
		icon?: IconName;
		full?: boolean;
		ariaLabel?: string;
		testid?: string;
	} = $props();

	const variants: Record<Variant, string> = {
		primary:
			'bg-accent text-on-accent border-accent hover:bg-accent-strong hover:border-accent-strong',
		secondary: 'bg-surface text-accent border-line-strong hover:bg-accent-soft',
		ghost: 'bg-transparent text-accent border-transparent hover:bg-accent-soft',
		danger: 'bg-critical text-on-accent border-critical hover:opacity-90',
		'danger-ghost': 'bg-transparent text-critical border-transparent hover:bg-critical-soft'
	};
	const classes = $derived(
		`inline-flex min-h-12 items-center justify-center gap-2 rounded-control border-2 px-6 py-2 text-base font-semibold transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${full ? 'w-full' : ''}`
	);
</script>

{#snippet content()}
	{#if busy}
		{busyLabel}
	{:else}
		{#if icon}<Icon name={icon} />{/if}
		{@render children()}
	{/if}
{/snippet}

{#if href && !disabled && !busy}
	<a
		{href}
		class={classes}
		aria-label={ariaLabel}
		data-testid={testid}
		data-sveltekit-reload={reload || undefined}
	>
		{@render content()}
	</a>
{:else}
	<button
		{type}
		{formaction}
		{onclick}
		disabled={disabled || busy}
		aria-busy={busy || undefined}
		aria-label={ariaLabel}
		class={classes}
		data-testid={testid}
	>
		{@render content()}
	</button>
{/if}
