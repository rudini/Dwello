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

	const id = `dialog-${Math.random().toString(36).slice(2, 8)}`;
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

	function keydown(event: KeyboardEvent) {
		if (event.key === 'Escape') return close();
		if (event.key !== 'Tab' || !panel) return;
		const focusable = [
			...panel.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input, select, textarea'
			)
		];
		const [first, last] = [focusable[0], focusable[focusable.length - 1]];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

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
			onkeydown={keydown}
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
