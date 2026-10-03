<script lang="ts">
	import FieldError from '$lib/components/FieldError.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { fieldBorder } from '$lib/contract-form';

	// Start and end of a contract; an unlimited contract has no end
	let {
		startDate = $bindable(),
		endDate = $bindable(),
		isUnlimited = $bindable(),
		min,
		errors,
		overlap
	}: {
		startDate: string;
		endDate: string;
		isUnlimited: boolean;
		min?: string;
		errors: Record<string, string>;
		overlap: string | null;
	} = $props();
</script>

<div class="border-t border-gray-200 pt-6">
	<h3 class="text-sm font-medium text-gray-700 mb-4">Vertragszeitraum</h3>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
		<div>
			<label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
				Vertragsbeginn <span class="text-red-500">*</span>
			</label>
			<input
				id="startDate"
				type="date"
				bind:value={startDate}
				{min}
				data-testid="start-date-input"
				class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {fieldBorder(errors.startDate)}"
			/>
			<FieldError message={errors.startDate} />
		</div>
		<div>
			<label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
				Vertragsende {#if !isUnlimited}<span class="text-red-500">*</span>{/if}
			</label>
			<input
				id="endDate"
				type="date"
				bind:value={endDate}
				disabled={isUnlimited}
				class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {fieldBorder(errors.endDate)}"
				class:bg-gray-50={isUnlimited}
				class:text-gray-400={isUnlimited}
			/>
			<FieldError message={errors.endDate} />
		</div>
	</div>

	<label class="flex items-center gap-2 cursor-pointer">
		<input
			type="checkbox"
			bind:checked={isUnlimited}
			class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
		/>
		<span class="text-sm text-gray-700">Unbefristeter Vertrag</span>
	</label>

	{#if overlap}
		<div
			class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
			data-testid="overlap-warning"
		>
			<Icon name="warning" size={18} class="text-amber-600 mt-0.5" />
			<span class="text-sm text-amber-700">{overlap}</span>
		</div>
	{/if}
</div>
