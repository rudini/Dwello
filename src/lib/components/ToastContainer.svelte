<script lang="ts">
	import { toasts } from '$lib/stores';
	import Toast from './Toast.svelte';
</script>

{#if $toasts.length > 0}
	<div
		class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
		aria-label="Benachrichtigungen"
	>
		{#each $toasts as toast (toast.id)}
			<div class="pointer-events-auto">
				<Toast {toast} />
			</div>
		{/each}
	</div>
{/if}
