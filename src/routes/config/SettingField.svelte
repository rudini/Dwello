<script lang="ts">
	import TextInput from '$lib/ui/TextInput.svelte';

	// One setting as a text field: posted under its name, found by tests as setting-{name}
	let {
		name,
		label,
		value,
		error,
		help,
		example,
		type = 'text'
	}: {
		name: string;
		label: string;
		value: string;
		error?: string;
		help?: string;
		example?: string;
		type?: 'text' | 'decimal' | 'number'; // decimal: a text field with the decimal keypad, takes a comma; number: whole numbers
	} = $props();
</script>

<TextInput
	id={name}
	{name}
	{label}
	type="text"
	inputmode={type === 'text' ? undefined : type === 'decimal' ? 'decimal' : 'numeric'}
	{value}
	{error}
	{help}
	{example}
	testid="setting-{name}"
/>
