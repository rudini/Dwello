<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';

	// Whose statement for which apartment, each a way to its own page
	let { statement }: { statement: StatementWithDetails } = $props();

	const link =
		'inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4';
</script>

<Panel title="Mieter und Wohnung">
	<dl class="flex flex-col gap-4">
		<div class="flex flex-col">
			<dt class="text-ink-muted">Mieter</dt>
			<dd>
				<a href="/tenants/{statement.tenantId}" class={link} data-testid="statement-tenant-link"
					>{statement.tenantName}</a
				>
				{#if statement.tenantEmail}<p class="min-w-0 break-all text-ink-muted">
						{statement.tenantEmail}
					</p>{/if}
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-ink-muted">Wohnung</dt>
			<dd>
				<a
					href="/apartments/{statement.apartmentId}"
					class={link}
					data-testid="statement-apartment-link">Wohnung {statement.apartmentUnit}</a
				>
				<p class="text-ink">{statement.buildingName}</p>
				<p class="text-ink-muted">{statement.buildingAddress}</p>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-ink-muted">Mietstage in der Abrechnungsperiode</dt>
			<dd class="text-ink">{statement.rentalDays} Mietstage</dd>
		</div>
	</dl>
</Panel>
