<script lang="ts">
	type Status = 'AKTIV' | 'Beendet';
	type Variant = 'success' | 'gray';

	interface Props {
		status: Status;
		variant?: Variant;
	}

	let { status, variant = 'success' }: Props = $props();

	const variantClasses = {
		success: {
			container: 'bg-green-100',
			text: 'text-green-700',
			dot: 'bg-green-500'
		},
		gray: {
			container: 'bg-slate-100',
			text: 'text-slate-600',
			dot: 'bg-slate-400'
		}
	};

	const classes = $derived(variantClasses[variant]);
</script>

<div class="{classes.container} {classes.text} px-2 py-0.5 rounded inline-flex items-center gap-1.5">
	<span class="{classes.dot} w-1.5 h-1.5 rounded-full"></span>
	<span class="text-xs font-medium">{status}</span>
</div>
