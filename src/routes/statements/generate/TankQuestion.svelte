<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// Buildings with heating costs that never had a Tankbestand: if they heat with oil, pellets or wood, the purchases
	// would be billed instead of the consumption; a question, no confirmation
	let { buildings }: { buildings: { buildingId: string; name: string }[] } = $props();
</script>

<Alert tone="info" title={m.statements_tank_title()} testid="tank-question">
	<p>{m.statements_tank_text()}</p>
	<ul class="flex flex-col gap-2">
		{#each buildings as building (building.buildingId)}
			<li class="flex flex-col">
				<a
					href="/buildings/{building.buildingId}"
					class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
					>{m.statements_add_stock_for({ name: building.name })}</a
				>
				<!-- recorded on the building, the question stops (#72) -->
				<a
					href="/buildings/{building.buildingId}/edit"
					class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
					data-testid="tank-question-no-tank-{building.buildingId}"
					>{m.statements_no_tank_for({ name: building.name })}</a
				>
			</li>
		{/each}
	</ul>
</Alert>
