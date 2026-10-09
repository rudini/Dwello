<script lang="ts">
	import { dismissToast, toasts } from '$lib/stores';
	import IconButton from './IconButton.svelte';
	import Icon from './Icon.svelte';
	import { toneStyle } from './tone';

	// Short confirmations after an action; errors interrupt, the rest is read when there is a pause
	const tones = {
		success: 'positive',
		error: 'critical',
		warning: 'caution',
		info: 'info'
	} as const;
</script>

<div
	aria-live="polite"
	class="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
>
	{#each $toasts as toast (toast.id)}
		{@const style = toneStyle[tones[toast.type]]}
		<div
			class="flex items-center gap-4 rounded-control border-l-4 bg-surface p-4 text-ink shadow-raised {style.box}"
			role={toast.type === 'error' ? 'alert' : 'status'}
			data-testid="toast-{toast.type}"
		>
			<span class={style.text}><Icon name={style.icon} size={24} /></span>
			<p class="flex-1 font-semibold">{toast.message}</p>
			<IconButton icon="close" label="Meldung schliessen" onclick={() => dismissToast(toast.id)} />
		</div>
	{/each}
</div>
