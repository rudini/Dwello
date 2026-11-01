<script lang="ts">
	import Icon from './Icon.svelte';
	import { sentError } from './sent-error.svelte';

	type Option = { value: string; label: string; description?: string };

	// A question with a few answers, each a large card with its consequence in words
	let {
		name,
		legend,
		options,
		value = $bindable(''),
		help,
		error,
		describedby,
		testid
	}: {
		name: string;
		legend: string;
		options: Option[];
		value?: string;
		help?: string;
		error?: string;
		// the id of further text that explains the question, outside the group (#683)
		describedby?: string;
		testid?: string;
	} = $props();

	const sent = sentError(() => error);

	// An option is named by its label only and described by its explanation (read once, #654) and, on a refusal,
	// the error, so the focus on it reads both
	const describedByOption = (option: Option, id: string) =>
		[sent.shown && `${name}-error`, option.description && `${id}-description`]
			.filter(Boolean)
			.join(' ') || undefined;
	const describedBy = $derived(
		[sent.shown && `${name}-error`, help && `${name}-help`, describedby]
			.filter(Boolean)
			.join(' ') || undefined
	);
</script>

<fieldset
	class="flex flex-col gap-2"
	role="radiogroup"
	aria-labelledby="{name}-legend"
	aria-describedby={describedBy}
	aria-invalid={sent.shown ? true : undefined}
	data-testid={testid}
	{@attach sent.attach}
>
	<legend id="{name}-legend" class="mb-2 font-semibold text-ink">{legend}</legend>
	{#if help}<p id="{name}-help" class="text-ink-muted" data-testid={testid && `${testid}-help`}>
			{help}
		</p>{/if}
	{#each options as option, i (option.value)}
		{@const id = `${name}-${i}`}
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
				aria-labelledby="{id}-label"
				aria-describedby={describedByOption(option, id)}
				data-testid={testid && `${testid}-${option.value}`}
				class="mt-1 size-6 shrink-0 cursor-pointer accent-accent"
			/>
			<span class="flex flex-col gap-1">
				<span id="{id}-label" class="font-semibold text-ink">{option.label}</span>
				{#if option.description}
					<span id="{id}-description" class="text-ink-muted">{option.description}</span>
				{/if}
			</span>
		</label>
	{/each}
	{#if sent.shown}
		<p
			id="{name}-error"
			class="flex items-start gap-2 font-semibold text-critical"
			data-testid="form-error"
		>
			<Icon name="error" />
			{sent.shown}
		</p>
	{/if}
</fieldset>
