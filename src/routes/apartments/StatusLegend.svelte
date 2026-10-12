<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { statusHelp, statusLabels, statusIcons, statusTones } from '$lib/apartment';
	import type { ApartmentStatus } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// What the status words of the list mean, in plain words instead of a tooltip
	const statuses = Object.keys(statusLabels) as ApartmentStatus[];
</script>

<Panel title={m.apartments_legend_title()} testid="apartment-status-legend">
	<dl class="grid gap-4 md:grid-cols-2">
		{#each statuses as status (status)}
			<div class="flex flex-col items-start gap-2">
				<dt>
					<Badge
						tone={statusTones[status]}
						icon={statusIcons[status]}
						label={statusLabels[status]}
					/>
				</dt>
				<dd class="text-ink-muted">{statusHelp[status]}</dd>
			</div>
		{/each}
	</dl>
	<p class="text-ink-muted">
		{m.apartments_legend_text()}
	</p>
</Panel>
