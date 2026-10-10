<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';

	// Step 5: before creating, what happens; after, how many drafts there are and where to find them
	let { count, createdCount }: { count: number; createdCount: number | null } = $props();
</script>

{#if createdCount === null}
	<div class="flex flex-col items-center gap-4 text-center" data-testid="generate-drafts-note">
		<Illustration name="statement" />
		<p class="text-lg text-ink">
			{count === 1
				? 'Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.'
				: `Es werden ${count} Nebenkostenabrechnungen als Entwurf erstellt.`}
		</p>
		<p class="max-w-prose text-ink-muted">
			Es wird nichts verschickt. Sie prüfen danach jede Abrechnung und versenden sie einzeln.
		</p>
	</div>
{:else}
	<div class="flex flex-col items-center gap-4 text-center">
		<Illustration name="done" />
		<p class="text-lg font-semibold text-ink" role="status" data-testid="generation-result">
			{createdCount === 1
				? '1 Nebenkostenabrechnung ist als Entwurf erstellt.'
				: `${createdCount} Nebenkostenabrechnungen sind als Entwurf erstellt.`}
		</p>
		<p class="max-w-prose text-ink-muted">Prüfen Sie die Entwürfe und versenden Sie sie dann.</p>
		<div class="flex flex-wrap justify-center gap-4">
			<Button
				href="/statements?status=draft"
				variant="primary"
				icon="statement"
				testid="show-statements-button">Entwürfe ansehen</Button
			>
			<Button href="/statements/generate" reload icon="add" testid="generate-more-button"
				>Weitere Abrechnungen erstellen</Button
			>
		</div>
	</div>
{/if}
