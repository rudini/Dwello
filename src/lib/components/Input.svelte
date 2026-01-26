<script lang="ts">
	type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'url' | 'search';

	interface Props {
		id: string;
		label: string;
		type?: InputType;
		value?: string | number;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		prefix?: string;
		suffix?: string;
		min?: string | number;
		max?: string | number;
		step?: string | number;
		maxlength?: number;
		class?: string;
		onchange?: (_value: string) => void;
		oninput?: (_value: string) => void;
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		hint = '',
		prefix = '',
		suffix = '',
		min,
		max,
		step,
		maxlength,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange?.(target.value);
	}

	const inputClasses = $derived(
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
			error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''} ${prefix ? 'pl-14' : ''} ${suffix ? 'pr-12' : ''} ${className}`
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

	<div class="relative">
		{#if prefix}
			<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>
		{/if}

		<input
			{id}
			{type}
			{value}
			{placeholder}
			{disabled}
			{min}
			{max}
			{step}
			{maxlength}
			oninput={handleInput}
			onchange={handleChange}
			class={inputClasses}
		/>

		{#if suffix}
			<span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{suffix}</span>
		{/if}
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
