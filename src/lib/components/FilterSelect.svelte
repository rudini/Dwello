<script lang="ts">
	import { keepEarlyChoice } from '$lib/early-choice';

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
</script>

<div class="w-full sm:w-48">
	<label for={id} class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
	<select
		use:keepEarlyChoice={onchange}
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
