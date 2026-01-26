<script lang="ts">
	interface Props {
		id: string;
		label: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		hint?: string;
		rows?: number;
		maxlength?: number;
		class?: string;
		onchange?: (_value: string) => void;
		oninput?: (_value: string) => void;
	}

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		hint = '',
		rows = 4,
		maxlength,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;
		oninput?.(target.value);
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		onchange?.(target.value);
	}

	const textareaClasses = $derived(
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y ${
			error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''} ${className}`
	);

	const charCount = $derived(value?.length || 0);
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

	<textarea
		{id}
		{value}
		{placeholder}
		{disabled}
		{rows}
		{maxlength}
		oninput={handleInput}
		onchange={handleChange}
		class={textareaClasses}
	></textarea>

	<div class="flex justify-between items-center">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{:else}
			<span></span>
		{/if}

		{#if maxlength}
			<p class="text-xs text-gray-400">
				{charCount}/{maxlength}
			</p>
		{/if}
	</div>
</div>
