<script lang="ts">
	import { dismissToast, toasts } from '$lib/stores';
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
</script>

<div class="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:left-auto sm:w-96">
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
