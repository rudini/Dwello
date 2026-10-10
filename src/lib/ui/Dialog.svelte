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
		confirmDisabled = false,
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
		confirmDisabled?: boolean; // the action is not possible; the content says why
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

	// Everything around the dialog is inert while it is open, so a screen reader's browse mode stays inside too
	function makeInert(dialog: HTMLElement) {
		const around: Element[] = [];
		for (let node = dialog; node.parentElement && node !== document.body; node = node.parentElement)
			for (const sibling of node.parentElement.children)
				if (sibling !== node && !sibling.hasAttribute('inert')) around.push(sibling);
		around.forEach((element) => element.setAttribute('inert', ''));
		return () => around.forEach((element) => element.removeAttribute('inert'));
	}

	// Focus starts on "Abbrechen", stays inside while open and returns to the opener afterwards
	$effect(() => {
		if (!open || !panel) return;
		const opener = document.activeElement as HTMLElement | null;
		const restore = makeInert(panel);
		panel.querySelector<HTMLElement>('[data-testid="dialog-cancel"]')?.focus();
		return () => {
			restore();
			opener?.focus();
		};
	});

	// While busy both buttons are disabled: the panel itself holds the focus
	$effect(() => {
		if (open && busy) panel?.focus();
	});

	function keydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.stopPropagation();
			close();
		}
		if (event.key === 'Tab') trapFocus(event);
	}

	// Tab moves through the dialog's controls only, wrapping at both ends; while busy it stays on the panel
	function trapFocus(event: KeyboardEvent) {
		event.preventDefault();
		if (busy) return;
		const focusable = [
			...(panel?.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input, select, textarea'
			) ?? [])
		];
		const at = focusable.indexOf(document.activeElement as HTMLElement);
		const step = event.shiftKey ? -1 : 1;
		const target =
			at === -1
				? event.shiftKey
					? focusable.at(-1)
					: focusable[0]
				: focusable.at((at + step) % focusable.length);
		target?.focus();
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
					disabled={confirmDisabled}
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
