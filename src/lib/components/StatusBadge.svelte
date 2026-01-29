<script lang="ts">
	type Variant = 'success' | 'gray' | 'info' | 'warning' | 'error';

	interface Props {
		status: string;
		variant?: Variant;
	}

	let { status, variant = 'success' }: Props = $props();

	const variantClasses: Record<Variant, { container: string; text: string; dot: string }> = {
		success: {
			container: 'bg-green-100',
			text: 'text-green-700',
			dot: 'bg-green-500'
		},
		gray: {
			container: 'bg-slate-100',
			text: 'text-slate-600',
			dot: 'bg-slate-400'
		},
		info: {
			container: 'bg-blue-100',
			text: 'text-blue-700',
			dot: 'bg-blue-500'
		},
		warning: {
			container: 'bg-amber-100',
			text: 'text-amber-700',
			dot: 'bg-amber-500'
		},
		error: {
			container: 'bg-red-100',
			text: 'text-red-700',
			dot: 'bg-red-500'
		}
	};

	const classes = $derived(variantClasses[variant] || variantClasses.gray);
</script>

<div class="{classes.container} {classes.text} px-2 py-0.5 rounded inline-flex items-center gap-1.5">
	<span class="{classes.dot} w-1.5 h-1.5 rounded-full"></span>
	<span class="text-xs font-medium">{status}</span>
</div>
