<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { navGroups } from './navigation';
	import NavList from '$lib/ui/NavList.svelte';
</script>

<!-- Sidebar from 768 px, so it stays at 150 % zoom on a laptop (#740); below, the same menu opens from the header (MobileNav) -->
<div class="hidden w-80 shrink-0 border-r border-line bg-surface md:block">
	<nav class="sticky top-16 max-h-below-header overflow-y-auto px-4 py-6" aria-label={m.nav_main()}>
		<NavList groups={navGroups} />
	</nav>
</div>
