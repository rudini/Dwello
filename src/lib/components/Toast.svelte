<script lang="ts">
	import Icon from './Icon.svelte';
	import { dismissToast, type Toast } from '$lib/stores';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();

	const iconMap: Record<Toast['type'], string> = {
		success: 'check_circle',
		error: 'error',
		warning: 'warning',
		info: 'info'
	};

	const variantClasses: Record<Toast['type'], { container: string; icon: string }> = {
		success: {
			container: 'bg-green-50 border-green-200 text-green-800',
			icon: 'text-green-500'
		},
		error: {
			container: 'bg-red-50 border-red-200 text-red-800',
			icon: 'text-red-500'
		},
		warning: {
			container: 'bg-amber-50 border-amber-200 text-amber-800',
			icon: 'text-amber-500'
		},
		info: {
			container: 'bg-blue-50 border-blue-200 text-blue-800',
			icon: 'text-blue-500'
		}
	};

	const classes = $derived(variantClasses[toast.type]);
</script>

<div
	class="flex items-start gap-3 p-4 border rounded-lg shadow-lg {classes.container} animate-in slide-in-from-right duration-300"
	role="alert"
	aria-live="polite"
	data-testid="toast-{toast.type}"
>
	<Icon name={iconMap[toast.type]} size={20} class={classes.icon} />
	<p class="flex-1 text-sm font-medium">{toast.message}</p>
	<button
		type="button"
		onclick={() => dismissToast(toast.id)}
		class="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
		aria-label="Schliessen"
	>
		<Icon name="close" size={16} class="text-current opacity-60" />
	</button>
</div>
