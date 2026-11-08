<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { navigating } from '$app/stores';
	import { dismissToast, toasts, type Toast } from '$lib/stores';
	import IconButton from './IconButton.svelte';
	import Icon from './Icon.svelte';
	import { toneStyle } from './tone';
	import { noteFocus, refocus } from '$lib/focus-after-action';

	// Short confirmations after an action; errors interrupt (alert), the rest is read when there is a pause (status)
	const tones = {
		success: 'positive',
		error: 'critical',
		warning: 'caution',
		info: 'info'
	} as const;

	// A confirmation goes into the status region, which is on the page from the start, once the page it
	// leads to has been announced: inserted at the same moment, it would be drowned out by the title
	let shownUpTo = $state(0);
	// #669 (Sven S-1, WCAG 2.2.1): the reading time stops while the focus or the pointer is in a toast, and starts anew after
	let pointer = false;
	let expired: Toast[] = [];
	const expire = (toast: Toast) =>
		pointer || region?.contains(document.activeElement)
			? expired.push(toast)
			: (delete before[toast.id], dismissToast(toast.id));
	const resume = (into?: EventTarget | null) => {
		if (pointer || region?.contains(into as Node | null)) return;
		for (const toast of expired) setTimeout(() => expire(toast), toast.duration);
		expired = [];
	};
	// the pointer over the toasts, attached: the region is no control of its own
	const hover = (node: HTMLElement) => {
		const off = [
			on(node, 'pointerenter', () => (pointer = true)),
			on(node, 'pointerleave', () => ((pointer = false), resume()))
		];
		return () => off.forEach((remove) => remove());
	};
	$effect(() => {
		const newest = $toasts.filter((toast) => toast.type !== 'error').at(-1)?.id ?? 0;
		if (newest <= shownUpTo || $navigating) return;
		const timer = setTimeout(() => {
			// the action removed the focused control, or the page changed (#1096)
			refocus();
			// the reading time starts now that the confirmation is shown
			for (const toast of $toasts)
				if (toast.type !== 'error' && toast.id > shownUpTo) {
					noteBefore(toast.id);
					if (toast.duration) setTimeout(() => expire(toast), toast.duration);
				}
			shownUpTo = newest;
		}, 500);
		return () => clearTimeout(timer);
	});
	const errors = $derived($toasts.filter((toast) => toast.type === 'error'));
	// #1158 (Sven P-1): «Meldung schliessen» gives the focus back to what had it when the toast appeared,
	// without it to the heading of the step or the page
	const before: Record<number, Element | null> = {}; // no state: read only on closing
	const noteBefore = (id: number) => {
		const part = document.activeElement;
		if (!(id in before))
			before[id] = part === document.body || region?.contains(part) ? null : part;
	};
	$effect(() => errors.forEach((toast) => noteBefore(toast.id)));
	const close = (id: number) => {
		const part = before[id];
		const left =
			document.activeElement === document.body || region?.contains(document.activeElement);
		delete before[id];
		dismissToast(id);
		if (!left) return;
		const back = part?.isConnected
			? part
			: (document.getElementById('step-heading') ?? document.querySelector('h1[tabindex="-1"]'));
		(back as HTMLElement | null)?.focus();
	};
	const confirmations = $derived(
		$toasts.filter((toast) => toast.type !== 'error' && toast.id <= shownUpTo)
	);
	// #1096: the page never moves for a confirmation; when the focused part (#1113: its row) stands where it would stand at the
	// bottom, it stands at the top of the window instead (it may briefly cover what has no focus)
	let region = $state<HTMLElement>();
	let atTop = $state(false);
	let moved = $state(0); // focus, scroll or size changed; the handlers only count: one may run inside another component's effect
	const place = () => {
		const focused = document.activeElement;
		if (!confirmations.length || !region || !focused || focused === document.body)
			return (atTop = false);
		// its own close button keeps it where it is (code review 1096 C-1)
		if (region.contains(focused)) return;
		const own = region.getBoundingClientRect();
		// the confirmation at the bottom: 16 px above the edge, and 16 px of the page clear around it
		const top = innerHeight - 16 - own.height - 16;
		const sameColumn = (part: DOMRect) => part.left < own.right + 16 && part.right > own.left - 16;
		const below = (part: DOMRect) => part.bottom > top && part.top < innerHeight && sameColumn(part);
		const focus = focused.getBoundingClientRect();
		// #1113: the whole row or group the focus is in, so none of its buttons lies under it; a row so tall
		// that the confirmation at the top would cover the focus itself counts by the focused part alone
		const row = focused.closest('li, tr, [data-focus-row]')?.getBoundingClientRect();
		const coveredAtTop = focus.top < own.height + 32 && sameColumn(focus);
		atTop = below(focus) || (!!row && below(row) && !coveredAtTop);
	};
	$effect(() => {
		void moved;
		place();
	});
</script>

<svelte:window
	onfocusin={(event) => {
		noteFocus(event.target as Element);
		untrack(() => moved++);
	}}
	onscroll={() => untrack(() => moved++)}
	onresize={() => untrack(() => moved++)}
/>

{#snippet message(toast: Toast, role?: 'alert')}
	{@const style = toneStyle[tones[toast.type]]}
	<div
		class="flex items-center gap-4 rounded-control border-l-4 bg-surface p-4 text-ink shadow-raised {style.box}"
		{role}
		data-testid="toast-{toast.type}"
	>
		<span class={style.text}><Icon name={style.icon} size={24} /></span>
		<p class="flex-1 font-semibold">{toast.message}</p>
		<IconButton icon="close" label={m.ui_close_message()} onclick={() => close(toast.id)} />
	</div>
{/snippet}

<!-- Above an open dialog or menu (same layer, later on the page; the layout puts the menu before it), which leaves it reachable -->
<div
	class="fixed inset-x-4 z-50 flex flex-col gap-2 sm:left-auto sm:w-96 {atTop
		? 'top-4'
		: 'bottom-4'}"
	data-toast-region
	bind:this={region}
	onfocusout={(event) => resume(event.relatedTarget)}
	{@attach hover}
>
	{#each errors as toast (toast.id)}{@render message(toast, 'alert')}{/each}
	<div role="status" aria-atomic="false" class="flex flex-col gap-2">
		{#each confirmations as toast (toast.id)}{@render message(toast)}{/each}
	</div>
</div>
