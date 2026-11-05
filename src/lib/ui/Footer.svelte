<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { appVersion } from '$lib/app-version';
	import { page } from '$app/stores';

	// the legal page that is open is marked, like the area in the main navigation (#656)
	const current = (path: string) => ($page.url.pathname === path ? 'page' : undefined);
</script>

<footer class="border-t border-line bg-surface">
	<div
		class="flex flex-col gap-2 px-4 py-6 text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-6"
	>
		<p>
			© {new Date().getFullYear()} Dwello <span aria-hidden="true">·</span>
			<span data-testid="footer-version" class="whitespace-nowrap"
				>{appVersion ? m.footer_version({ version: appVersion }) : m.footer_version_unknown()}</span
			>
		</p>
		<nav aria-label={m.footer_legal()} class="flex gap-6">
			<a
				href="/privacy"
				aria-current={current('/privacy')}
				class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
				data-testid="footer-link">{m.footer_privacy()}</a
			>
			<a
				href="/terms"
				aria-current={current('/terms')}
				class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
				data-testid="footer-link">{m.footer_terms()}</a
			>
		</nav>
	</div>
</footer>
