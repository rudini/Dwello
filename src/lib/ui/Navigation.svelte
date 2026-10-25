<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { navGroups } from './navigation';
	import NavList from '$lib/ui/NavList.svelte';
</script>

<!-- Sidebar from 1024 px; below, the same menu opens from the header (MobileNav) -->
<div class="hidden w-80 shrink-0 border-r border-line bg-surface lg:block">
	<nav class="sticky top-16 max-h-below-header overflow-y-auto px-4 py-6" aria-label={m.nav_main()}>
		<NavList groups={navGroups} />
	</nav>
</div>
