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
		note,
		helpTestid,
		testid,
		children
	}: {
		id: string;
		label: string;
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		note?: { text: string; testid: string }; // a caution about the value, e.g. that the KI read it without being sure
		helpTestid?: string;
		testid?: string; // the whole field, label to error: a test finds the error of this field (#499)
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
	const noteId = $derived(`${id}-note`);
	// a caution about the value first: it is missed at the end of a long help (persona Sven)
	const describedBy = $derived(
		[note && noteId, (help || example) && helpId, shown && errorId].filter(Boolean).join(' ') || undefined
	);
</script>

<div bind:this={frame} class="flex flex-col gap-2" oninput={change} data-testid={testid}>
	<label for={id} class="font-semibold text-ink">
		{label}
		{#if optional}<span class="font-normal text-ink-muted">{m.ui_optional()}</span>{/if}
	</label>
	{#if help || example}
		<p id={helpId} class="text-ink-muted" data-testid={helpTestid}>
			{help ?? ''}
			{#if example}<span class="whitespace-nowrap">{m.ui_example({ example })}</span>{/if}
		</p>
	{/if}
	{@render children({ id, describedBy, invalid: !!shown })}
	{#if note}
		<p id={noteId} class="flex items-start gap-2 font-semibold text-caution" data-testid={note.testid}>
			<Icon name="warning" />
			{note.text}
		</p>
	{/if}
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
