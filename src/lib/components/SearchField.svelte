<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		value = $bindable(),
		placeholder,
		testid
	}: { value: string; placeholder: string; testid: string } = $props();
</script>

<div class="flex-1">
	<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Suche</label>
	<div class="relative">
		<Icon name="search" size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
		<input
			id="search"
			data-testid={testid}
			type="text"
			bind:value
			{placeholder}
			class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
		/>
	</div>
</div>
