<script lang="ts">
	import Field from './Field.svelte';
	import { controlClass } from './field';

	let {
		id,
		label,
		value = $bindable(''),
		name,
		type = 'text',
		help,
		example,
		error,
		optional = false,
		placeholder,
		autocomplete,
		inputmode,
		min,
		max,
		disabled = false,
		onblur,
		note,
		testid
	}: {
		id: string;
		label: string;
		value?: string;
		name?: string;
		type?: 'text' | 'email' | 'tel' | 'number' | 'url'; // dates: DateInput
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		placeholder?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		inputmode?: 'decimal' | 'numeric';
		min?: string;
		max?: string;
		disabled?: boolean;
		onblur?: () => void;
		testid?: string;
		note?: { text: string; testid: string }; // see Field
	} = $props();
</script>

<Field {id} {note} {label} {help} {example} {error} {optional}>
	{#snippet children(control)}
		<input
			id={control.id}
			{name}
			{type}
			bind:value
			{placeholder}
			{autocomplete}
			{inputmode}
			{min}
			{max}
			{disabled}
			{onblur}
			aria-required={!optional}
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid={testid}
		/>
	{/snippet}
</Field>
