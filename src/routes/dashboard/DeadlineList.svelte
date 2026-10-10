<script lang="ts">
	import Badge from '$lib/ui/Badge.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { Deadline } from '$lib/overview';

	// Dates ahead, earliest first; passed ones in red, those within a week in amber
	let { deadlines }: { deadlines: Deadline[] } = $props();
	const tone = (days: number) => (days < 0 ? 'critical' : days <= 7 ? 'caution' : 'neutral');
</script>

<section aria-labelledby="deadlines-heading" class="flex flex-col gap-4">
	<h2 id="deadlines-heading" class="text-2xl font-bold text-ink">Fristen</h2>
	{#if deadlines.length}
		<ul class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
			{#each deadlines as deadline (deadline.kind + deadline.id)}
				<li data-testid="overview-deadline">
					<a
						href={deadline.href}
						class="flex min-h-12 flex-col gap-2 px-6 py-4 hover:bg-sunken sm:flex-row sm:items-center sm:gap-6"
					>
						<span class="w-28 shrink-0 font-semibold tabular-nums text-ink"
							>{formatDate(deadline.date)}</span
						>
						<span class="flex-1 text-ink">
							<span class="font-semibold">{deadline.kind}</span>
							<span class="text-ink-muted">· {deadline.name}</span>
						</span>
						<span class="self-start sm:self-auto"
							><Badge tone={tone(deadline.days)} label={deadline.when} /></span
						>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-ink-muted">In den nächsten Wochen stehen keine Fristen an.</p>
	{/if}
</section>
