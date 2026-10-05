<script lang="ts">
	import FieldError from './FieldError.svelte';

	// Labelled text input of a form action form, with the action's error for this field
	let {
		label,
		name,
		value = '',
		required = false,
		placeholder,
		error,
		testid
	}: {
		label: string;
		name: string;
		value?: string;
		required?: boolean;
		placeholder?: string;
		error?: string;
		testid?: string;
	} = $props();
</script>

<div>
	<label for={name} class="block text-sm font-medium text-gray-700 mb-1">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</label>
	<input
		id={name}
		{name}
		{value}
		{placeholder}
		data-testid={testid}
		class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
	/>
	<FieldError message={error} />
</div>
