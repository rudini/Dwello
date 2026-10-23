<script lang="ts">
	import AgreedCosts from './AgreedCosts.svelte';
	import FeeNotAgreed from './FeeNotAgreed.svelte';

	// Step 3's checks loaded after it opens, in a place below «Weiter» that they cannot move (#470)
	let {
		step,
		buildingIds,
		period,
		blocking = $bindable(false),
		loading = $bindable(false),
		error
	}: {
		step: number; // only step 3 has them
		buildingIds: string[];
		period: { start: string; end: string };
		blocking?: boolean; // the agreed Nebenkosten are not checked or not answered yet (#91)
		loading?: boolean; // until both checks are loaded (#468)
		error?: string;
	} = $props();

	let feeLoading = $state(false);
	let agreementsLoading = $state(false);
	$effect(() => {
		loading = feeLoading || agreementsLoading;
	});
</script>

{#if step === 3}
	<div class="flex flex-col gap-6">
		<FeeNotAgreed {buildingIds} {period} bind:loading={feeLoading} />
		<AgreedCosts {buildingIds} {period} bind:blocking bind:loading={agreementsLoading} {error} />
	</div>
{/if}
