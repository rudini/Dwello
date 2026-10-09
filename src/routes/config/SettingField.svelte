<script lang="ts">
	import FieldError from '$lib/components/FieldError.svelte';

	let {
		name,
		label,
		value,
		error,
		hint = '',
		placeholder = '',
		type = 'text',
		class: className = ''
	}: {
		name: string;
		label: string;
		value: string;
		error?: string;
		hint?: string;
		placeholder?: string;
		type?: 'text' | 'number';
		class?: string;
	} = $props();
</script>

<div class={className}>
	<label for={name} class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
	<input
		id={name}
		{name}
		{type}
		{value}
		{placeholder}
		step={type === 'number' ? '0.1' : undefined}
		data-testid="setting-{name}"
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
	/>
	<FieldError message={error} />
	<p class="mt-1 text-xs text-ink-muted">{hint}</p>
</div>
