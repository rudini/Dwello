<script lang="ts">
	let { value, max, label }: { value: number; max: number; label: string } = $props();
</script>

<div
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-label={label}
	class="h-2 w-full overflow-hidden rounded-control bg-sunken"
>
	<div
		class="h-full bg-accent transition-all duration-fast"
		style:width="{(value / max) * 100}%"
	></div>
</div>
