<script lang="ts">
	import TextInput from '$lib/ui/TextInput.svelte';

	// One setting as a text field: posted under its name, found by tests as setting-{name}
	let {
		name,
		label,
		value = $bindable(),
		error,
		help,
		example,
		invalidBy,
		optional,
		type = 'text'
	}: {
		name: string;
		label: string;
		value: string;
		error?: string;
		help?: string;
		example?: string;
		invalidBy?: string; // see Field
		optional?: boolean;
		type?: 'text' | 'decimal' | 'number' | 'tel' | 'email'; // decimal: a text field with the decimal keypad, takes a comma; number: whole numbers; tel, email: their keypads (#465)
	} = $props();
</script>

<TextInput
	id={name}
	{name}
	{label}
	type="text"
	inputmode={type === 'text' ? undefined : type === 'number' ? 'numeric' : type}
	bind:value
	{error}
	{help}
	{example}
	{invalidBy}
	{optional}
	testid="setting-{name}"
/>
