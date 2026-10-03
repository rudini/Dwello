<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let {
		isGenerating,
		createdCount,
		count
	}: { isGenerating: boolean; createdCount: number | null; count: number } = $props();

	const badgeClass = 'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4';
</script>

<div class="text-center py-8">
	{#if createdCount !== null}
		<div class="{badgeClass} bg-green-100">
			<Icon name="check_circle" size={32} class="text-green-600" />
		</div>
		<h2 class="text-lg font-semibold text-gray-900 mb-2">Abrechnungen erstellt!</h2>
		<p class="text-gray-500 mb-6" data-testid="generation-result">
			{createdCount} Nebenkostenabrechnungen wurden erfolgreich erstellt.
		</p>
		<div class="flex items-center justify-center gap-4">
			<Button href="/statements" variant="primary" testid="show-statements-button">
				<Icon name="visibility" size={20} />
				Abrechnungen anzeigen
			</Button>
			<Button href="/statements/generate" reload variant="secondary" testid="generate-more-button">
				<Icon name="add" size={20} />
				Weitere erstellen
			</Button>
		</div>
	{:else if isGenerating}
		<div class="{badgeClass} bg-blue-100">
			<Icon name="sync" size={32} class="text-blue-600 animate-spin" />
		</div>
		<h2 class="text-lg font-semibold text-gray-900 mb-2">Abrechnungen werden erstellt...</h2>
		<p class="text-gray-500 mb-6">Bitte warten Sie, bis der Vorgang abgeschlossen ist.</p>
	{:else}
		<div class="{badgeClass} bg-blue-100">
			<Icon name="receipt_long" size={32} class="text-blue-600" />
		</div>
		<h2 class="text-lg font-semibold text-gray-900 mb-2">Bereit zum Erstellen</h2>
		<p class="text-gray-500 mb-6">
			Klicken Sie auf "Abrechnungen erstellen", um {count} Abrechnungen zu generieren.
		</p>
		<Button type="submit" variant="primary" testid="generate-statements-button">
			<Icon name="play_arrow" size={20} />
			Abrechnungen erstellen
		</Button>
	{/if}
</div>
