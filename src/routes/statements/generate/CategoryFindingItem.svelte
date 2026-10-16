<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { findingText, type CategoryFinding } from '$lib/statement-wizard';

	// One finding of the check per category; a Tankbestand finding leads to the building
	let { finding, buildingId }: { finding: CategoryFinding; buildingId: string } = $props();

	const tank = $derived(finding.kind === 'stock' || finding.kind === 'consumption');
	// a missing reading is captured, a negative consumption or one far from the year before checked
	const capture = $derived(finding.missingParts.length > 0);
</script>

<li data-testid="category-finding">
	<span class="font-semibold">{m.statements_finding_category({ name: finding.categoryName })}</span>
	{findingText(finding)}
	{#if tank}
		<a
			href="/buildings/{buildingId}"
			class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
			data-testid="category-finding-stock-link"
			>{capture ? m.statements_add_stock() : m.statements_check_stocks()}</a
		>
	{/if}
</li>
