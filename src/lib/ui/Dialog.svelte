<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { makeInert } from '$lib/inert';

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
		describedby,
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
		describedby?: string; // the ids of the sentences that describe the dialog, instead of its first paragraph
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

	// Focus starts in the first field, so the fields come before the confirm button (#653), else on "Abbrechen";
	// a danger dialog with fields starts on the panel, so Enter in a prefilled field cannot confirm at once and
	// Tab still reaches the field first (code review 653-1 C-3); it stays inside and returns to the opener afterwards
	$effect(() => {
		if (!open || !panel) return;
		const opener = document.activeElement as HTMLElement | null;
		const restore = makeInert(panel);
		const field = panel.querySelector<HTMLElement>(
			'input:not([type="hidden"]):not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])'
		);
		// without scrolling: a long dialog opens at its top, title and warning in sight on a phone
		const cancel = panel.querySelector<HTMLElement>('[data-testid="dialog-cancel"]');
		(field && danger ? panel : (field ?? cancel))?.focus({ preventScroll: true });
		return () => {
			restore();
			opener?.focus();
		};
	});

	// The dialog describes itself with its first paragraph, the consequence, not with warnings and lists (#653)
	let paragraph = $state<string>();
	$effect(() => {
		if (!open || !panel) return;
		const own = panel;
		const describe = () => {
			// a field's help is that field's description (code review 653-1 C-4), a live line a status (Sven 653 P-1)
			const first = [
				...own.querySelectorAll<HTMLElement>(`[id="${id}-body"] p:not([aria-live])`)
			].find((p) => !p.id || !own.querySelector(`[aria-describedby~="${p.id}"]`));
			if (first && !first.id) first.id = `${id}-description`;
			paragraph = first?.id;
			// a control that removed itself (the letter instead of the e-mail) leaves the focus in the dialog
			if (document.activeElement === document.body) own.focus({ preventScroll: true });
		};
		describe();
		// the content can change while the dialog is open (fallback review of #1127)
		const observer = new MutationObserver(describe);
		observer.observe(own, { childList: true, subtree: true });
		return () => observer.disconnect();
	});

	// While busy the confirm button holds the focus and says what is being done (#677)
	$effect(() => {
		if (open && busy) panel?.querySelector<HTMLElement>('[aria-busy]')?.focus();
	});

	function keydown(event: KeyboardEvent) {
		// a dialog opened above this one (e.g. its own confirmation) handles the keys
		if (!open || panel?.closest('[inert]')) return;
		// Escape in a select closes its open list, not the dialog (#268)
		if (event.key === 'Escape' && !(event.target as HTMLElement).matches?.('select')) {
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

	// Tab moves through the dialog's controls only, wrapping at both ends; while busy it stays where it is.
	// From an element that is not a control (a refusal focused by script) it goes on from where that element is
	function trapFocus(event: KeyboardEvent) {
		event.preventDefault();
		if (busy) return;
		const focusable = [
			...(panel?.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], summary, input:not([tabindex="-1"]):not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
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
			aria-describedby={describedby ?? (wide ? undefined : paragraph)}
			tabindex="-1"
			class="flex max-h-full w-full {wide ? 'max-w-4xl' : 'max-w-lg'} flex-col gap-6 overflow-y-auto rounded-panel bg-surface p-6 text-ink shadow-overlay"
		>
			<h2 id="{id}-title" data-testid="dialog-title" class="text-xl font-bold leading-tight">{title}</h2>
			<div id="{id}-body" class="flex flex-col gap-4">{@render children()}</div>
			<!-- a press on a button keeps the focus in the field: leaving it would show its error, grow the dialog
			     and move the button away before the release (R7-F2, #653); the click then leaves the field, so it
			     takes its value (a two-digit year) before the button acts (code review 653-1 C-1) -->
			<div
				class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end"
				role="presentation"
				onmousedown={(event) => event.preventDefault()}
				onclickcapture={(event) => (event.target as HTMLElement).closest('button')?.focus()}
			>
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
