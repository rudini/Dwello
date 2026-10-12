<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { floorLabel, statusText, statusIcons, statusTones } from '$lib/apartment';
	import type { ApartmentWithBuilding } from '$lib/types';
	import { normalizeDecimal } from '$lib/utils/format';
	import Badge from '$lib/ui/Badge.svelte';
	import Icon from '$lib/ui/Icon.svelte';

	// The whole card opens the apartment; its number is the link text
	let { apartment }: { apartment: ApartmentWithBuilding } = $props();

	const facts = $derived([
		{ icon: 'floor', text: floorLabel(apartment.floor) },
		{
			icon: 'rooms',
			text: m.buildings_rooms({ rooms: normalizeDecimal(String(apartment.rooms)) })
		},
		{ icon: 'ruler', text: `${normalizeDecimal(String(apartment.area))} m²` }
	] as const);
</script>

<li
	class="relative flex min-w-0 flex-col gap-4 rounded-panel border border-line bg-surface p-6 hover:border-line-strong"
	data-testid="apartment-card-{apartment.id}"
>
	<div class="flex flex-wrap items-start justify-between gap-2">
		<h2 class="break-words text-lg font-semibold text-ink">
			<a
				href="/apartments/{apartment.id}"
				class="text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
				>{m.buildings_apartment_number({ number: apartment.number })}</a
			>
		</h2>
		<Badge
			tone={statusTones[apartment.status]}
			icon={statusIcons[apartment.status]}
			label={statusText(apartment)}
			testid="apartment-status"
		/>
	</div>
	<p class="flex min-w-0 items-center gap-2 break-words text-ink-muted">
		<Icon name="building" /><span class="min-w-0">{apartment.buildingName}</span>
	</p>
	<ul class="flex flex-wrap gap-x-6 gap-y-2 text-ink">
		{#each facts as fact (fact.icon)}
			<li class="flex items-center gap-2">
				<span class="text-ink-muted"><Icon name={fact.icon} /></span>{fact.text}
			</li>
		{/each}
	</ul>
</li>
