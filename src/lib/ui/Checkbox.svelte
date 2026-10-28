<script lang="ts">
	import { sentError } from './sent-error.svelte';

	// Box left, label right; the whole row is the click target (48 px)
	let {
		id,
		label,
		checked = $bindable(false),
		name,
		help,
		error,
		describedby,
		disabled = false,
		testid
	}: {
		id: string;
		label: string;
		checked?: boolean;
		name?: string;
		help?: string;
		error?: string;
		describedby?: string; // texts elsewhere on the page that this choice answers
		disabled?: boolean;
		testid?: string;
	} = $props();

	const sent = sentError(() => error);

	// a checkbox that cannot be ticked looks so (#245, persona Helga of #233)
	const cursor = $derived(disabled ? 'cursor-not-allowed' : 'cursor-pointer');
	const labelLook = $derived(disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer');
</script>

<div class="flex flex-col gap-1" {@attach sent.attach}>
	<label
		for={id}
		class="flex min-h-12 items-center gap-4 font-semibold text-ink {labelLook}"
	>
		<input
			{id}
			{name}
			type="checkbox"
			bind:checked
			{disabled}
			aria-describedby={[sent.shown && `${id}-error`, describedby, help && `${id}-help`]
				.filter(Boolean)
				.join(' ') || undefined}
			aria-invalid={sent.shown ? true : undefined}
			class="size-6 shrink-0 rounded-control border-2 border-line-strong accent-accent {cursor}"
			data-testid={testid}
		/>
		{label}
	</label>
	{#if help}<p id="{id}-help" class="pl-10 text-ink-muted" data-testid={testid && `${testid}-help`}>{help}</p>{/if}
	{#if sent.shown}
		<p id="{id}-error" class="pl-10 font-semibold text-critical" data-testid="form-error">
			{sent.shown}
		</p>
	{/if}
</div>
