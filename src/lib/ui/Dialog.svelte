<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	// Confirmation of an action: the title asks, the content names the consequence, the button repeats the verb
	let {
		open = $bindable(false),
		title,
		confirmLabel,
		cancelLabel = 'Abbrechen',
		danger = false,
		busy = false,
		busyLabel,
		onconfirm,
		onclose,
		confirmTestid = 'dialog-confirm',
		children
	}: {
		open?: boolean;
		title: string;
		confirmLabel: string;
		cancelLabel?: string;
		danger?: boolean;
		busy?: boolean;
		busyLabel?: string;
		onconfirm: () => void;
		onclose?: () => void;
		confirmTestid?: string;
		children: Snippet;
	} = $props();

	const id = $props.id();
	let panel = $state<HTMLElement>();

	function close() {
		if (busy) return;
		open = false;
		onclose?.();
	}

	// Focus starts on "Abbrechen", stays inside while open and returns to the opener afterwards
	$effect(() => {
		if (!open || !panel) return;
		const opener = document.activeElement as HTMLElement | null;
		panel.querySelector<HTMLElement>('[data-testid="dialog-cancel"]')?.focus();
		return () => opener?.focus();
	});

	// While busy both buttons are disabled: the panel itself holds the focus
	$effect(() => {
		if (open && busy) panel?.focus();
	});

	function keydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') close();
		if (event.key === 'Tab') trapFocus(event);
	}

	// Tab from the last control wraps to the first and back; while busy nothing inside can take focus
	function trapFocus(event: KeyboardEvent) {
		const focusable = [
			...(panel?.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input, select, textarea'
			) ?? [])
		];
		const [first, last] = [focusable[0], focusable.at(-1)];
		const wrapTo = event.shiftKey
			? document.activeElement === first && last
			: document.activeElement === last && first;
		if (busy || wrapTo) event.preventDefault();
		if (wrapTo) wrapTo.focus();
	}
</script>

<svelte:window onkeydown={keydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-scrim p-4 sm:items-center"
		role="presentation"
	>
		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-labelledby="{id}-title"
			aria-describedby="{id}-body"
			tabindex="-1"
			class="flex w-full max-w-lg flex-col gap-6 rounded-panel bg-surface p-6 text-ink shadow-overlay"
		>
			<h2 id="{id}-title" class="text-xl font-bold leading-tight">{title}</h2>
			<div id="{id}-body" class="flex flex-col gap-4">{@render children()}</div>
			<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
				<Button onclick={close} testid="dialog-cancel" disabled={busy}>{cancelLabel}</Button>
				<Button
					variant={danger ? 'danger' : 'primary'}
					onclick={onconfirm}
					{busy}
					{busyLabel}
					testid={confirmTestid}
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	</div>
{/if}
