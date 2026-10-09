<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { FieldControl } from './field';

	// Label above, visible help with example, the control, then the error: the frame of every form field
	let {
		id,
		label,
		help,
		example,
		error,
		optional = false,
		children
	}: {
		id: string;
		label: string;
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		children: Snippet<[FieldControl]>;
	} = $props();

	const helpId = $derived(`${id}-help`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived(
		[(help || example) && helpId, error && errorId].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="flex flex-col gap-2">
	<label for={id} class="font-semibold text-ink">
		{label}
		{#if optional}<span class="font-normal text-ink-muted">(optional)</span>{/if}
	</label>
	{#if help || example}
		<p id={helpId} class="text-ink-muted">
			{help ?? ''}
			{#if example}<span class="whitespace-nowrap">Beispiel: {example}</span>{/if}
		</p>
	{/if}
	{@render children({ id, describedBy, invalid: !!error })}
	{#if error}
		<p
			id={errorId}
			class="flex items-start gap-2 font-semibold text-critical"
			data-testid="form-error"
		>
			<Icon name="error" />
			{error}
		</p>
	{/if}
</div>
