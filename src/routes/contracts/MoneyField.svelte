<script lang="ts">
	import FieldError from '$lib/components/FieldError.svelte';

	// Amount in francs with its error; optional amounts say so next to the label
	let {
		id,
		label,
		value = $bindable(),
		placeholder,
		required = false,
		error,
		testid
	}: {
		id: string;
		label: string;
		value: string;
		placeholder: string;
		required?: boolean;
		error?: string;
		testid?: string;
	} = $props();
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700 mb-1">
		{label} (CHF)
		{#if required}
			<span class="text-red-500">*</span>
		{:else}
			<span class="text-gray-400">(optional)</span>
		{/if}
	</label>
	<div class="relative">
		<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">CHF</span>
		<input
			{id}
			data-testid={testid}
			type="number"
			step="0.01"
			min="0"
			bind:value
			{placeholder}
			class="w-full pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {error
				? 'border-red-500'
				: 'border-gray-300'}"
		/>
	</div>
	<FieldError message={error} />
</div>
