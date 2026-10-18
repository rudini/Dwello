<script lang="ts">
	import Field from './Field.svelte';
	import { controlClass } from './field';

	// Amount in francs: CHF in front, decimal keyboard on phones, figures aligned
	let {
		id,
		label,
		value = $bindable(''),
		name,
		help,
		example,
		error,
		optional = false,
		onblur,
		note,
		testid
	}: {
		id: string;
		label: string;
		value?: string;
		name?: string;
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		onblur?: () => void;
		testid?: string;
		note?: { text: string; testid: string }; // see Field
	} = $props();
</script>

<Field {id} {note} {label} {help} {example} {error} {optional} helpTestid="{testid}-help">
	{#snippet children(control)}
		<div class="relative">
			<span
				class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-muted"
				aria-hidden="true">CHF</span
			>
			<input
				id={control.id}
				{name}
				type="text"
				inputmode="decimal"
				bind:value
				{onblur}
				aria-required={!optional}
				aria-describedby={control.describedBy}
				aria-invalid={control.invalid || undefined}
				class="{controlClass(control.invalid)} pl-16 text-right tabular-nums"
				data-testid={testid}
			/>
		</div>
	{/snippet}
</Field>
