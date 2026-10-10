<script lang="ts">
	import { floorLabel, statusHelp, statusText, statusIcons, statusTones } from '$lib/apartment';
	import type { ApartmentStatus } from '$lib/types';
	import { normalizeDecimal } from '$lib/utils/format';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// The apartment's Mietstatus, explained, and its size and floor
	let {
		apartment
	}: {
		apartment: {
			status: ApartmentStatus;
			nextContractStart: string | null;
			rooms: string;
			floor: number;
			area: string;
		};
	} = $props();

	const facts = $derived([
		{ key: 'rooms', label: 'Zimmeranzahl', value: normalizeDecimal(apartment.rooms) },
		{ key: 'floor', label: 'Stockwerk', value: floorLabel(apartment.floor) },
		{ key: 'area', label: 'Fläche', value: `${normalizeDecimal(apartment.area)} m²` }
	]);
</script>

<Panel title="Angaben zur Wohnung">
	<dl class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class="flex flex-col items-start gap-2 sm:col-span-2" data-testid="apartment-info-status">
			<dt class="text-ink-muted">Mietstatus</dt>
			<dd class="flex flex-col items-start gap-2">
				<Badge
					tone={statusTones[apartment.status]}
					icon={statusIcons[apartment.status]}
					label={statusText(apartment)}
				/>
				<span class="text-ink-muted">{statusHelp[apartment.status]}</span>
			</dd>
		</div>
		{#each facts as fact (fact.key)}
			<div class="flex flex-col gap-2" data-testid="apartment-info-{fact.key}">
				<dt class="text-ink-muted">{fact.label}</dt>
				<dd class="text-xl font-semibold tabular-nums text-ink">{fact.value}</dd>
			</div>
		{/each}
	</dl>
</Panel>
