<script lang="ts">
	import { keepEarlyChoice } from '$lib/early-choice';
	import Field from './Field.svelte';
	import { controlClass } from './field';

	// A select that keeps a choice made before the page was live (see keepEarlyChoice)
	let {
		id,
		label,
		options,
		value = '',
		name,
		placeholder,
		help,
		error,
		optional = false,
		testid,
		onchange = () => {}
	}: {
		id: string;
		label: string;
		options: { value: string; label: string }[];
		value?: string;
		name?: string;
		placeholder?: string; // first, empty choice
		help?: string;
		error?: string;
		optional?: boolean;
		testid: string;
		onchange?: (value: string) => void;
	} = $props();
</script>

<Field {id} {label} {help} {error} {optional}>
	{#snippet children(control)}
		<select
			id={control.id}
			{name}
			use:keepEarlyChoice={onchange}
			onchange={(e) => onchange(e.currentTarget.value)}
			aria-required={!optional}
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid={testid}
		>
			{#if placeholder !== undefined}
				<option value="" selected={value === ''}>{placeholder}</option>
			{/if}
			{#each options as option (option.value)}
				<option value={option.value} selected={option.value === value}>{option.label}</option>
			{/each}
		</select>
	{/snippet}
</Field>
