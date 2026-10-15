<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	// Confirmation of an action: the title asks, the content names the consequence, the button repeats the verb
	let {
		open = $bindable(false),
		title,
		confirmLabel,
		cancelLabel = m.ui_cancel(),
		danger = false,
		busy = false,
		busyLabel,
		confirmDisabled = false,
		onconfirm,
		onclose,
		confirmTestid = 'dialog-confirm',
		wide = false,
		onrequestclose,
		enterConfirms = true,
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
		wide?: boolean; // room for a list of records, e.g. the files of «Rechnungen hochladen»
		onrequestclose?: () => void; // asks before closing (cancel, Escape) instead of closing at once
		enterConfirms?: boolean; // false where a form in the dialog holds many records
		children: Snippet;
	} = $props();

	const id = $props.id();
	let panel = $state<HTMLElement>();

	function close() {
		if (busy) return;
		if (onrequestclose) return onrequestclose();
		open = false;
		onclose?.();
	}

	// Everything around the dialog is inert while it is open, so a screen reader's browse mode stays inside too;
	// only the toasts stay reachable, so one raised meanwhile is still read out and can be closed
	function makeInert(dialog: HTMLElement) {
		const around: Element[] = [];
		for (let node = dialog; node.parentElement && node !== document.body; node = node.parentElement)
			for (const sibling of node.parentElement.children)
				if (sibling !== node && !sibling.matches('[inert], [data-toast-region]'))
					around.push(sibling);
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
		// a dialog opened above this one (e.g. its own confirmation) handles the keys
		if (!open || panel?.closest('[inert]')) return;
		if (event.key === 'Escape') {
			event.stopPropagation();
			close();
		}
		if (event.key === 'Tab') trapFocus(event);
		if (event.key === 'Enter' && enterConfirms) confirmFromField(event);
	}

	// Enter in a field of the dialog confirms, as in a form
	function confirmFromField(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if (!target.matches?.('input') || !panel?.contains(target)) return;
		event.preventDefault();
		if (!busy && !confirmDisabled) onconfirm();
	}

	// Tab moves through the dialog's controls only, wrapping at both ends; while busy it stays on the panel.
	// From an element that is not a control (a refusal focused by script) it goes on from where that element is
	function trapFocus(event: KeyboardEvent) {
		event.preventDefault();
		if (busy) return;
		const focusable = [
			...(panel?.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input:not([tabindex="-1"]):not([type="hidden"]), select, textarea'
			) ?? [])
		];
		const active = document.activeElement as HTMLElement;
		const after = (control: HTMLElement) =>
			!!(active.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING);
		const ahead = panel?.contains(active) ? focusable.filter(after) : focusable;
		const behind = focusable.filter((control) => !ahead.includes(control) && control !== active);
		const target = event.shiftKey
			? (behind.at(-1) ?? focusable.at(-1))
			: (ahead.find((control) => control !== active) ?? focusable[0]);
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
			class="flex max-h-full w-full {wide ? 'max-w-4xl' : 'max-w-lg'} flex-col gap-6 overflow-y-auto rounded-panel bg-surface p-6 text-ink shadow-overlay"
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
