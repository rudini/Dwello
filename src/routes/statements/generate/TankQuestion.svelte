<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';

	// Buildings with heating costs that never had a Tankbestand: if they heat with oil, pellets or wood, the purchases
	// would be billed instead of the consumption; a question, no confirmation
	let { buildings }: { buildings: { buildingId: string; name: string }[] } = $props();
</script>

<!-- TODO(fachlich prüfen): "Tankbestand" is not in the glossary -->
<Alert tone="info" title="Heizen Sie mit Öl, Pellets oder Holz?" testid="tank-question">
	<p>
		Dann erfassen Sie den Tankbestand am Anfang und am Ende der Periode, sonst rechnet Dwello den
		Einkauf ab statt den Verbrauch. Bei Fernwärme, Gas oder Wärmepumpe ist nichts zu tun.
	</p>
	<ul class="flex flex-col gap-2">
		{#each buildings as building (building.buildingId)}
			<li>
				<a
					href="/buildings/{building.buildingId}"
					class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
					>Tankbestand erfassen: {building.name}</a
				>
			</li>
		{/each}
	</ul>
</Alert>
