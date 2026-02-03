<script lang="ts">
	interface Props {
		text?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { text = 'Wird geladen...', size = 'md' }: Props = $props();

	const sizeClasses: Record<typeof size, { spinner: string; text: string }> = {
		sm: { spinner: 'w-6 h-6', text: 'text-sm' },
		md: { spinner: 'w-10 h-10', text: 'text-base' },
		lg: { spinner: 'w-14 h-14', text: 'text-lg' }
	};

	const classes = $derived(sizeClasses[size]);
</script>

<div
	class="flex flex-col items-center justify-center py-12"
	role="status"
	aria-live="polite"
	aria-busy="true"
>
	<svg
		class="{classes.spinner} animate-spin text-primary"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle>
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
	{#if text}
		<p class="{classes.text} text-gray-500 mt-4">{text}</p>
	{/if}
</div>
