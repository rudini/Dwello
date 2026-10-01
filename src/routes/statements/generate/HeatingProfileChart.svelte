<script lang="ts">
	import type { HeatingProfile } from '$lib/types';

	let { profile }: { profile?: HeatingProfile } = $props();
</script>

{#if profile}
	<div class="bg-gray-50 rounded-lg p-4" data-testid="heating-profile-chart">
		<h3 class="text-sm font-medium text-gray-700 mb-6">Monatliche Verteilung</h3>
		<div class="flex items-end gap-1 h-24" data-testid="heating-profile-bars">
			{#each Object.entries(profile.monthlyPercentages) as [month, value]}
				<div class="flex-1 flex flex-col items-center h-full">
					<div class="w-full flex-1 relative">
						<div
							class="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t transition-all"
							style="height: {(value / 16) * 100}%"
							data-testid="chart-bar-{month}"
						></div>
					</div>
					<span class="text-xs text-gray-500 mt-1 flex-shrink-0" data-testid="chart-label-{month}"
						>{month.slice(0, 1).toUpperCase()}</span
					>
				</div>
			{/each}
		</div>
	</div>
{/if}
