<script lang="ts">
	import Icon from './Icon.svelte';

	type Option = { value: string; label: string; description?: string };

	// A question with a few answers, each a large card with its consequence in words
	let {
		name,
		legend,
		options,
		value = $bindable(''),
		help,
		error,
		testid
	}: {
		name: string;
		legend: string;
		options: Option[];
		value?: string;
		help?: string;
		error?: string;
		testid?: string;
	} = $props();

	const describedBy = $derived(
		[help && `${name}-help`, error && `${name}-error`].filter(Boolean).join(' ') || undefined
	);
</script>

<fieldset class="flex flex-col gap-2" aria-describedby={describedBy} data-testid={testid}>
	<legend class="mb-2 font-semibold text-ink">{legend}</legend>
	{#if help}<p id="{name}-help" class="text-ink-muted">{help}</p>{/if}
	{#each options as option (option.value)}
		{@const id = `${name}-${option.value}`}
		<label
			for={id}
			class="flex min-h-12 cursor-pointer items-start gap-4 rounded-control border-2 bg-surface p-4 {value ===
			option.value
				? 'border-accent bg-accent-soft'
				: 'border-line-strong'}"
		>
			<input
				{id}
				{name}
				type="radio"
				value={option.value}
				bind:group={value}
				aria-describedby={option.description ? `${id}-description` : undefined}
				class="mt-1 size-6 shrink-0 cursor-pointer accent-accent"
			/>
			<span class="flex flex-col gap-1">
				<span class="font-semibold text-ink">{option.label}</span>
				{#if option.description}
					<span id="{id}-description" class="text-ink-muted">{option.description}</span>
				{/if}
			</span>
		</label>
	{/each}
	{#if error}
		<p
			id="{name}-error"
			class="flex items-start gap-2 font-semibold text-critical"
			data-testid="form-error"
		>
			<Icon name="error" />
			{error}
		</p>
	{/if}
</fieldset>
