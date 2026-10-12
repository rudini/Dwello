<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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

	// The error belongs to what was sent: editing the field (input, also on selects) takes it away, the next submit
	// checks again. Not «change»: browsers send it after Enter, when a dialog has just checked
	let frame = $state<HTMLElement>();
	let corrected = $state<string>(); // the error the field was changed after
	const shown = $derived(error === corrected ? undefined : error);
	const change = () => (corrected = error);
	// a check that cleared the error starts over: the same error set again is shown again
	$effect(() => {
		if (!error) corrected = undefined;
	});
	$effect(() => {
		const form = frame?.closest('form');
		const check = () => (corrected = undefined);
		form?.addEventListener('submit', check, true);
		return () => form?.removeEventListener('submit', check, true);
	});

	const helpId = $derived(`${id}-help`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived(
		[(help || example) && helpId, shown && errorId].filter(Boolean).join(' ') || undefined
	);
</script>

<div bind:this={frame} class="flex flex-col gap-2" oninput={change}>
	<label for={id} class="font-semibold text-ink">
		{label}
		{#if optional}<span class="font-normal text-ink-muted">{m.ui_optional()}</span>{/if}
	</label>
	{#if help || example}
		<p id={helpId} class="text-ink-muted">
			{help ?? ''}
			{#if example}<span class="whitespace-nowrap">{m.ui_example({ example })}</span>{/if}
		</p>
	{/if}
	{@render children({ id, describedBy, invalid: !!shown })}
	{#if shown}
		<p
			id={errorId}
			class="flex items-start gap-2 font-semibold text-critical"
			data-testid="form-error"
		>
			<Icon name="error" />
			{shown}
		</p>
	{/if}
</div>
