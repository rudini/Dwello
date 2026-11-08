<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/utils/format';

	// #1284: positions calculated per part before and from the day an apartment no longer exists; the rows are in the PDF
	let { apartments = [] }: { apartments?: { number: string; date: string }[] } = $props();
</script>

{#each apartments as apartment (apartment.number)}
	<p class="mt-4 text-ink-muted" data-testid="statement-discontinued-note">
		{m.statements_detail_discontinued_note({
			number: apartment.number,
			date: formatDate(apartment.date)
		})}
	</p>
{/each}
