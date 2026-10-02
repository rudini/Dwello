<script lang="ts">
	import { MONTHS } from '$lib/heating-profile';

	// Monthly shares of the heating costs in percent
	let { shares }: { shares?: Record<string, number> } = $props();

	// The highest share fills the chart
	const scale = $derived(Math.max(...Object.values(shares ?? {}), 1));
</script>

{#if shares}
	<div class="bg-gray-50 rounded-lg p-4" data-testid="heating-profile-chart">
		<h3 class="text-sm font-medium text-gray-700 mb-6">Monatliche Verteilung</h3>
		<div class="flex items-end gap-1 h-24" data-testid="heating-profile-bars">
			{#each MONTHS as month (month.key)}
				<div class="flex-1 flex flex-col items-center h-full" title="{month.label}: {shares[month.key]} %">
					<div class="w-full flex-1 relative">
						<div
							class="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t transition-all"
							style="height: {(shares[month.key] / scale) * 100}%"
							data-testid="chart-bar-{month.key}"
						></div>
					</div>
					<span class="text-xs text-gray-500 mt-1 flex-shrink-0" data-testid="chart-label-{month.key}"
						>{month.label.slice(0, 1)}</span
					>
				</div>
			{/each}
		</div>
	</div>
{/if}
