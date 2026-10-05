<script lang="ts">
	import NavLinks from './NavLinks.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<nav
	class="w-60 shrink-0 bg-white border-r border-gray-200 p-3 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto {className}"
	aria-label="Hauptnavigation"
>
	<NavLinks />
</nav>
