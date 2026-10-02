<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { rental }: { rental: PageData['rental'] } = $props();
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Aktuelle Miete</h2>
	{#if rental}
		<dl class="space-y-4" data-testid="tenant-rental">
			<div>
				<dt class="text-sm text-gray-500">Wohnung</dt>
				<dd class="text-gray-900" data-testid="tenant-rental-apartment">{rental.apartment}</dd>
				<dd class="text-sm text-gray-500">{rental.building}</dd>
			</div>
			<div>
				<dt class="text-sm text-gray-500">Monatliche Miete (brutto)</dt>
				<dd class="text-lg font-semibold text-primary" data-testid="tenant-rental-rent">{formatCurrency(rental.rent)}</dd>
			</div>
			<div>
				<dt class="text-sm text-gray-500">{rental.upcoming ? 'Einzug am' : 'Mietbeginn'}</dt>
				<dd class="text-gray-900" data-testid="tenant-rental-start">{formatDate(rental.startDate)}</dd>
			</div>
		</dl>
		<div class="mt-4 pt-4 border-t border-gray-100">
			<Button href="/apartments/{rental.apartmentId}" variant="secondary" size="sm" testid="tenant-rental-apartment-link">
				<Icon name="visibility" size={16} />
				Wohnung ansehen
			</Button>
		</div>
	{:else}
		<p class="text-gray-500 text-sm" data-testid="tenant-no-rental">Dieser Mieter hat keinen laufenden Mietvertrag.</p>
	{/if}
</Card>
