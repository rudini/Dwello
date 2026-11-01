<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { periodDays } from '$lib/accounting-period';
	import { wizardLink, type Billed } from '$lib/statement-wizard';
	import Button from '$lib/ui/Button.svelte';

	// Step 2, a building the period overlaps (#199, #408 point 2): the ways out, each into the wizard with this building
	// and its period: an existing period of the building, or a short period for the days no statement covers
	let { buildingId, overlap }: { buildingId: string; overlap: NonNullable<Billed['overlap']> } =
		$props();

	// one way per first day: periods made before #408 point 2 may share it (code review 199-1 C-2)
	const ways = $derived(
		[
			...overlap.choose.map((p) => ({
				...p,
				label: m.statements_period_choose({ period: periodDays(p) })
			})),
			...overlap.short.map((p) => ({
				...p,
				label: m.statements_period_short({ period: periodDays(p) })
			}))
		].filter((way, i, all) => all.findIndex((other) => other.start === way.start) === i)
	);
</script>

{#if ways.length}
	<div class="flex flex-wrap gap-2">
		{#each ways as way (way.start)}
			<!-- a full load: the wizard starts anew with this building and period -->
			<Button
				href={wizardLink(buildingId, way.start, way.end)}
				reload
				variant="ghost"
				icon="calculate"
				testid="generate-building-period-{buildingId}-{way.start}">{way.label}</Button
			>
		{/each}
		<!-- #486: the Abrechnungsperiode may be part of the Mietvertrag -->
		{#if overlap.short.length}
			<p class="basis-full text-ink-muted" data-testid="generate-building-short-help-{buildingId}">
				{m.statements_short_period_help()}
			</p>
		{/if}
		<!-- #521 (Fachreview 521-1 V-2): the letter for each tenant's consent; TODO(fachlich prüfen, #1035) -->
		{#each overlap.consent as contract (contract.id)}
			<Button
				href="/contracts/{contract.id}/consent-letter"
				variant="ghost"
				icon="document-download"
				testid="generate-building-consent-letter-{buildingId}-{contract.id}"
				>{m.statements_consent_letter_download_of({
					tenant: contract.tenantName,
					apartment: contract.apartmentNumber
				})}</Button
			>
		{/each}
	</div>
{/if}
