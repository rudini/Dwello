<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { floorLabel, roomsLabel, statusText, statusIcons, statusTones } from '$lib/apartment';
	import type { Apartment } from '$lib/types';
	import { normalizeDecimal } from '$lib/utils/format';
	import Badge from '$lib/ui/Badge.svelte';

	// The building's apartments, floor by floor from the bottom; a whole row opens its apartment
	let { apartments }: { apartments: Apartment[] } = $props();

	const floors = $derived([...new Set(apartments.map((a) => a.floor))].sort((a, b) => a - b));
</script>

<div class="flex flex-col gap-6">
	{#each floors as floor (floor)}
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold text-ink" data-testid="apartment-floor">
				{floorLabel(floor)}
			</h3>
			<ul class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
				{#each apartments.filter((a) => a.floor === floor) as apartment (apartment.id)}
					<li
						class="relative flex min-h-12 flex-wrap items-center justify-between gap-4 p-4 hover:bg-sunken"
						data-testid="apartment-row-{apartment.id}"
					>
						<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
							<a
								href="/apartments/{apartment.id}"
								class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
								>{m.buildings_apartment_number({ number: apartment.number })}</a
							>
							<span class="text-ink-muted"
								>{roomsLabel(normalizeDecimal(String(apartment.rooms)))}</span
							>
							<span class="text-ink-muted">{normalizeDecimal(String(apartment.area))} m²</span>
						</div>
						<Badge
							tone={statusTones[apartment.status]}
							icon={statusIcons[apartment.status]}
							label={statusText(apartment)}
						/>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
