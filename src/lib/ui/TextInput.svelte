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
		min,
		max,
		disabled = false,
		onblur,
		testid
	}: {
		id: string;
		label: string;
		value?: string;
		name?: string;
		type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'url';
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		placeholder?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		min?: string;
		max?: string;
		disabled?: boolean;
		onblur?: () => void;
		testid?: string;
	} = $props();
</script>

<Field {id} {label} {help} {example} {error} {optional}>
	{#snippet children(control)}
		<input
			id={control.id}
			{name}
			{type}
			bind:value
			{placeholder}
			{autocomplete}
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
