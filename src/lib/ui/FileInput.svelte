<script lang="ts">
	import Icon from './Icon.svelte';
	import type { FieldControl } from './field';

	// A file field whose button speaks the language of the interface: the browser's own one speaks the browser's
	// («Choose Files / No file chosen», #268). The input stays the control, visually hidden; the button is a second
	// label, so the name holds what it shows (WCAG 2.5.3). Disabled it greys like a disabled field, not by opacity, which
	// left the text hard to read (#1182, #1262)
	let {
		input = $bindable(),
		control,
		name,
		choose,
		chosen,
		multiple = false,
		disabled = false,
		onchange,
		testid
	}: {
		input?: HTMLInputElement;
		control: FieldControl;
		name?: string; // sent with a form
		choose: string; // the button's text
		chosen?: string; // the file chosen, or that none is: shown beside the button
		multiple?: boolean;
		disabled?: boolean;
		onchange?: (event: Event) => void;
		testid: string; // of the input `<testid>-input`, the button `<testid>-button`, its text `<testid>-choose`, the file chosen `<testid>-chosen`
	} = $props();
</script>

<div class="flex flex-wrap items-center gap-4">
	<input
		bind:this={input}
		id={control.id}
		{name}
		type="file"
		{multiple}
		accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
		{disabled}
		aria-describedby={control.describedBy}
		aria-invalid={control.invalid || undefined}
		class="peer sr-only"
		{onchange}
		data-testid="{testid}-input"
	/>
	<label
		for={control.id}
		data-testid="{testid}-button"
		class="inline-flex min-h-12 items-center gap-2 rounded-control border-2 px-6 py-2 font-semibold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus {disabled
			? 'cursor-not-allowed bg-sunken text-ink-muted'
			: 'cursor-pointer bg-surface text-accent hover:bg-accent-soft'} {control.invalid
			? 'border-critical'
			: 'border-line-strong'}"
	>
		<Icon name="document" />
		<span data-testid="{testid}-choose">{choose}</span>
	</label>
	{#if chosen !== undefined}
		<span class="break-all text-ink-muted" data-testid="{testid}-chosen">{chosen}</span>
	{/if}
</div>
