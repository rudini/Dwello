<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		class?: string;
		oninput?: (_value: string) => void;
		onsubmit?: (_value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Suchen...',
		class: className = '',
		oninput,
		onsubmit
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onsubmit?.(value);
		}
	}

	function handleClear() {
		value = '';
		oninput?.('');
	}
</script>

<div class="relative {className}">
	<Icon name="search" size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
	<input
		type="search"
		{value}
		{placeholder}
		oninput={handleInput}
		onkeydown={handleKeydown}
		class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
	/>
	{#if value}
		<button
			type="button"
			onclick={handleClear}
			class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
			aria-label="Suche löschen"
		>
			<Icon name="close" size={18} />
		</button>
	{/if}
</div>
