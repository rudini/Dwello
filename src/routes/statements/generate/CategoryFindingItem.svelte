<script lang="ts">
	import { findingText, type CategoryFinding } from '$lib/statement-wizard';

	// One finding of the check per category; a Tankbestand finding leads to the building
	let { finding, buildingId }: { finding: CategoryFinding; buildingId: string } = $props();

	const tank = $derived(finding.kind === 'stock' || finding.kind === 'tank');
	// a missing reading or none at all is captured, a negative consumption checked
	const capture = $derived(finding.kind === 'tank' || finding.missingParts.length > 0);
</script>

<li data-testid="category-finding">
	<span class="font-semibold">{finding.categoryName}:</span>
	{findingText(finding)}
	{#if tank}
		<a
			href="/buildings/{buildingId}"
			class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
			data-testid="category-finding-stock-link"
			>{capture ? 'Tankbestand erfassen' : 'Tankbestände prüfen'}</a
		>
	{/if}
</li>
