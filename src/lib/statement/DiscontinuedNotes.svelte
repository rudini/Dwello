<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/utils/format';

	// #1284: positions calculated per part before and from the day an apartment no longer exists; the rows are in the PDF
	// #1301: and the apartments with other values from a day
	type Dated = { number: string; date: string };
	let { apartments = [], sizeChanges = [] }: { apartments?: Dated[]; sizeChanges?: Dated[] } = $props();
</script>

{#each apartments as apartment (apartment.number)}
	<p class="mt-4 text-ink-muted" data-testid="statement-discontinued-note">
		{m.statements_detail_discontinued_note({
			number: apartment.number,
			date: formatDate(apartment.date)
		})}
	</p>
{/each}

{#each sizeChanges as apartment (`${apartment.number} ${apartment.date}`)}
	<p class="mt-4 text-ink-muted" data-testid="statement-size-change-note">
		{m.statements_detail_size_change_note({
			number: apartment.number,
			date: formatDate(apartment.date)
		})}
	</p>
{/each}
