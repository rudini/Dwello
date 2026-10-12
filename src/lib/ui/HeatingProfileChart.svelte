<script lang="ts">
	import { MONTHS } from '$lib/heating-profile';
	import { m } from '$lib/paraglide/messages';

	// Monthly shares of the heating costs in percent: bars to see the year at a glance, every value written out
	let { shares }: { shares?: Record<string, number> } = $props();

	// The highest share fills the chart
	const scale = $derived(Math.max(...Object.values(shares ?? {}), 1));
	const percent = (share: number) => `${+Number(share).toFixed(2)} %`;
</script>

{#if shares}
	<figure
		class="flex flex-col gap-4 rounded-panel bg-sunken p-4"
		data-testid="heating-profile-chart"
	>
		<figcaption class="font-semibold text-ink">{m.profiles_chart_caption()}</figcaption>
		<ol
			class="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-12"
			data-testid="heating-profile-bars"
		>
			{#each MONTHS as month (month.key)}
				<li class="flex flex-col items-center gap-1 text-center tabular-nums">
					<div class="flex h-24 w-full items-end" aria-hidden="true">
						<div
							class="w-full rounded-control bg-accent"
							style="height: {(shares[month.key] / scale) * 100}%"
							data-testid="chart-bar-{month.key}"
						></div>
					</div>
					<span class="text-ink-muted" aria-hidden="true">{month.short}</span>
					<span class="sr-only">{month.label}</span>
					<span class="font-semibold text-ink" data-testid="heating-profile-share-{month.key}"
						>{percent(shares[month.key])}</span
					>
				</li>
			{/each}
		</ol>
	</figure>
{/if}
