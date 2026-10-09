<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let { currentStep }: { currentStep: number } = $props();

	const steps = ['Periode', 'Gebäude', 'Vorschau', 'Erstellen'];

	const circleClass = (num: number) =>
		currentStep > num
			? 'bg-green-500 text-white'
			: currentStep === num
				? 'bg-blue-600 text-white'
				: 'bg-gray-200 text-ink-muted';
</script>

<div class="flex items-center justify-between max-w-3xl mx-auto">
	{#each steps as label, i}
		{@const num = i + 1}
		<div class="flex items-center">
			<div
				class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors {circleClass(
					num
				)}"
			>
				{#if currentStep > num}
					<Icon name="check" size={20} />
				{:else}
					{num}
				{/if}
			</div>
			<span
				class="ml-2 text-sm font-medium"
				class:text-gray-900={currentStep >= num}
				class:text-ink-muted={currentStep < num}
			>
				{label}
			</span>
		</div>
		{#if num < steps.length}
			<div
				class="flex-1 h-1 mx-4 rounded"
				class:bg-green-500={currentStep > num}
				class:bg-gray-200={currentStep <= num}
			></div>
		{/if}
	{/each}
</div>
