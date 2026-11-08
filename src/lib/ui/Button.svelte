<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';

	let {
		children,
		variant = 'secondary',
		href,
		reload = false,
		download = false,
		target,
		type = 'button',
		formaction,
		onclick,
		disabled = false,
		busy = false,
		busyLabel = m.ui_please_wait(),
		icon,
		full = false,
		ariaLabel,
		describedby,
		expanded,
		unavailable = false,
		testid
	}: {
		children: Snippet;
		variant?: Variant;
		href?: string;
		reload?: boolean; // follows href with a full page load
		download?: boolean; // saves the file the link answers, also an image a browser would show (WebKit, #424)
		target?: '_blank'; // a link that opens in a new tab, e.g. a PDF to look at
		type?: 'button' | 'submit';
		formaction?: string;
		onclick?: (event: MouseEvent) => void;
		disabled?: boolean;
		busy?: boolean; // while saving: shows busyLabel and cannot be pressed again
		busyLabel?: string;
		icon?: IconName;
		full?: boolean;
		ariaLabel?: string;
		describedby?: string; // id of a text that says what the button does, e.g. its consequence
		expanded?: boolean; // the button shows or hides a part of the page
		unavailable?: boolean; // looks as always, but a screen reader hears it unavailable; its onclick decides (#1261)
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
	// #1182 (persona Helga P-11): the grey of a disabled field, not opacity, which left «Bitte warten …» hard to read at
	// 150 % zoom; no hover, so it does not look pressable
	const busyLook = 'bg-sunken text-ink-muted border-line-strong cursor-progress';
	const classes = $derived(
		`inline-flex min-h-12 items-center justify-center gap-2 rounded-control border-2 px-6 py-2 text-base font-semibold transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-60 ${busy ? busyLook : variants[variant]} ${full ? 'w-full' : ''}`
	);

	// visible, as text right after the label so both wrap as one: a new tab can look as if Dwello had gone (personas
	// Helga, Marco)
	const newTab = $derived(target ? ` ${m.ui_opens_new_tab()}` : '');

	// A link only while it can be followed; disabled or busy it is a button that cannot be pressed
	const isLink = $derived(!!href && !disabled && !busy);

	// Busy keeps the focus on the button (aria-disabled, not disabled: persona Sven, #677); a click then does nothing,
	// also no second submit of its form
	function press(event: MouseEvent) {
		if (busy) event.preventDefault();
		else onclick?.(event);
	}
</script>

{#snippet content()}
	{#if busy}
		<!-- #1209 (persona Helga P-1): moves, so the button looks at work at first sight; the status speaks -->
		<span class="motion-safe:animate-spin" data-testid={testid && `${testid}-busy-indicator`}
			><Icon name="loading" /></span
		>
		{busyLabel}
	{:else}
		{#if icon}<Icon name={icon} />{/if}
		{@render children()}{newTab}
	{/if}
{/snippet}

{#if isLink}
	<a
		{href}
		class={classes}
		aria-label={ariaLabel}
		aria-describedby={describedby}
		data-testid={testid}
		data-sveltekit-reload={reload || undefined}
		download={download || undefined}
		{target}
		rel={target ? 'noopener noreferrer' : undefined}
		{onclick}
	>
		{@render content()}
	</a>
{:else}
	<button
		{type}
		{formaction}
		onclick={press}
		{disabled}
		aria-disabled={busy || unavailable || undefined}
		aria-busy={busy || undefined}
		aria-label={ariaLabel}
		aria-describedby={describedby}
		aria-expanded={expanded}
		class={classes}
		data-testid={testid}
	>
		{@render content()}
	</button>
	<!-- there before busy, so the change is announced: a focused button's new name often is not -->
	<span role="status" class="sr-only" data-testid={testid && `${testid}-busy-status`}
		>{busy ? busyLabel : ''}</span
	>
{/if}
