<script lang="ts">
	import Field from './Field.svelte';
	import { controlClass } from './field';

	type Option = { value: string; label: string; disabled?: boolean };

	let {
		id,
		label,
		options,
		value = $bindable(''),
		name,
		placeholder,
		help,
		example,
		error,
		optional = false,
		disabled = false,
		onchange,
		testid
	}: {
		id: string;
		label: string;
		options: Option[];
		value?: string;
		name?: string;
		placeholder?: string; // first, empty choice
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		disabled?: boolean;
		onchange?: (value: string) => void;
		testid?: string;
	} = $props();
</script>

<Field {id} {label} {help} {example} {error} {optional}>
	{#snippet children(control)}
		<select
			id={control.id}
			{name}
			bind:value
			{disabled}
			aria-required={!optional}
			onchange={() => onchange?.(value)}
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid={testid}
		>
			{#if placeholder}<option value="">{placeholder}</option>{/if}
			{#each options as option (option.value)}
				<option value={option.value} disabled={option.disabled}>{option.label}</option>
			{/each}
		</select>
	{/snippet}
</Field>
