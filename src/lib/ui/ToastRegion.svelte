<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { navigating } from '$app/stores';
	import { dismissToast, toasts, type Toast } from '$lib/stores';
	import IconButton from './IconButton.svelte';
	import Icon from './Icon.svelte';
	import { toneStyle } from './tone';

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
	$effect(() => {
		const newest = $toasts.filter((toast) => toast.type !== 'error').at(-1)?.id ?? 0;
		if (newest <= shownUpTo || $navigating) return;
		const timer = setTimeout(() => {
			// the action removed the focused button, or the page changed: go on from the page title
			if (document.activeElement === document.body)
				document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus();
			// the reading time starts now that the confirmation is shown
			for (const toast of $toasts)
				if (toast.type !== 'error' && toast.id > shownUpTo && toast.duration)
					setTimeout(() => dismissToast(toast.id), toast.duration);
			shownUpTo = newest;
		}, 500);
		return () => clearTimeout(timer);
	});
	const errors = $derived($toasts.filter((toast) => toast.type === 'error'));
	const confirmations = $derived(
		$toasts.filter((toast) => toast.type !== 'error' && toast.id <= shownUpTo)
	);
</script>

{#snippet message(toast: Toast, role?: 'alert')}
	{@const style = toneStyle[tones[toast.type]]}
	<div
		class="flex items-center gap-4 rounded-control border-l-4 bg-surface p-4 text-ink shadow-raised {style.box}"
		{role}
		data-testid="toast-{toast.type}"
	>
		<span class={style.text}><Icon name={style.icon} size={24} /></span>
		<p class="flex-1 font-semibold">{toast.message}</p>
		<IconButton icon="close" label={m.ui_close_message()} onclick={() => dismissToast(toast.id)} />
	</div>
{/snippet}

<!-- Above an open dialog (same layer, later on the page), which leaves it reachable -->
<div
	class="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:left-auto sm:w-96"
	data-toast-region
>
	{#each errors as toast (toast.id)}{@render message(toast, 'alert')}{/each}
	<div role="status" aria-atomic="false" class="flex flex-col gap-2">
		{#each confirmations as toast (toast.id)}{@render message(toast)}{/each}
	</div>
</div>
