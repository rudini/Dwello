<script lang="ts">
	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		id: string;
		label: string;
		options: Option[];
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		class?: string;
		onchange?: (_value: string) => void;
	}

	let {
		id,
		label,
		options,
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		hint = '',
		class: className = '',
		onchange
	}: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		value = target.value;
		onchange?.(target.value);
	}

	const selectClasses = $derived(
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-colors ${
			error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''} ${className}`
	);
</script>

<div class="space-y-1">
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{:else if hint}
			<span class="text-gray-400 font-normal">({hint})</span>
		{/if}
	</label>

	<select {id} {value} {disabled} onchange={handleChange} class={selectClasses}>
		{#if placeholder}
			<option value="">{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
