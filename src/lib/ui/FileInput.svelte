<script lang="ts">
	import Icon from './Icon.svelte';
	import type { FieldControl } from './field';

	// A file field whose button speaks the language of the interface: the browser's own one speaks the browser's
	// («Choose Files / No file chosen», #268). The input stays the control, visually hidden; the button is a second
	// label, so the name holds what it shows (WCAG 2.5.3)
	let {
		input = $bindable(),
		control,
		choose,
		chosen,
		multiple = false,
		disabled = false,
		onchange,
		testid
	}: {
		input?: HTMLInputElement;
		control: FieldControl;
		choose: string; // the button's text
		chosen?: string; // the file chosen, or that none is: shown beside the button
		multiple?: boolean;
		disabled?: boolean;
		onchange?: (event: Event) => void;
		testid: string; // of the input `<testid>-input`, the button `<testid>-choose`, the file chosen `<testid>-chosen`
	} = $props();
</script>

<div class="flex flex-wrap items-center gap-4">
	<input
		bind:this={input}
		id={control.id}
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
		class="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-control border-2 bg-surface px-6 py-2 font-semibold text-accent hover:bg-accent-soft peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-disabled:cursor-not-allowed peer-disabled:opacity-60 {control.invalid
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
