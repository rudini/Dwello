<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	// This page redirects to /dashboard via +page.server.ts
	// This component is only shown briefly during client-side navigation
</script>

<div class="flex items-center justify-center py-24">
	<p class="text-ink-muted">{m.home_redirecting()}</p>
</div>
