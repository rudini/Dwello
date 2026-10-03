<script lang="ts">
	import { onMount } from 'svelte';

	let {
		id,
		label,
		allLabel,
		options,
		value,
		testid,
		onchange
	}: {
		id: string;
		label: string;
		allLabel: string;
		options: { value: string; label: string }[];
		value: string;
		testid: string;
		onchange: (value: string) => void;
	} = $props();

	// Svelte resets a <select value> to the server value when it hydrates, so the choice is rendered as
	// selected options instead, and a choice made before hydration is handed on once the component is live
	let select: HTMLSelectElement;

	onMount(() => {
		if (select.value !== value) onchange(select.value);
	});
</script>

<div class="w-full sm:w-48">
	<label for={id} class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
	<select
		bind:this={select}
		{id}
		data-testid={testid}
		onchange={(e) => onchange(e.currentTarget.value)}
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
	>
		<option value="" selected={value === ''}>{allLabel}</option>
		{#each options as option (option.value)}
			<option value={option.value} selected={option.value === value}>{option.label}</option>
		{/each}
	</select>
</div>
