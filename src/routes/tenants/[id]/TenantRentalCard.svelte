<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { PageData } from './$types';

	// The running contract, otherwise the next one the tenant moves in with
	let { rental }: { rental: PageData['rental'] } = $props();
</script>

<Panel title={rental?.upcoming ? m.tenants_rent_upcoming() : m.tenants_rent_current()}>
	{#if rental}
		<dl class="flex flex-col gap-4 tabular-nums" data-testid="tenant-rental">
			<div>
				<dt class="text-ink-muted">{m.tenants_apartment()}</dt>
				<dd data-testid="tenant-rental-apartment">
					<a
						href="/apartments/{rental.apartmentId}"
						class="font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
						data-testid="tenant-rental-apartment-link">{rental.apartment}</a
					>
				</dd>
				<dd class="text-ink-muted">{rental.building}</dd>
			</div>
			<div>
				<!-- TODO(fachlich prüfen): no glossary term for the monthly total, as in the contract wizard -->
				<dt class="text-ink-muted">{m.common_monthly_total()}</dt>
				<dd class="text-lg font-semibold text-ink" data-testid="tenant-rental-rent">
					{formatCurrency(rental.rent)}
				</dd>
			</div>
			<div>
				<dt class="text-ink-muted">
					{rental.upcoming ? m.tenants_move_in() : m.tenants_contract_start()}
				</dt>
				<dd class="text-ink" data-testid="tenant-rental-start">{formatDate(rental.startDate)}</dd>
			</div>
		</dl>
	{:else}
		<p class="text-ink-muted" data-testid="tenant-no-rental">
			{m.tenants_no_rental()}
		</p>
	{/if}
</Panel>
