<script lang="ts">
	import { statusHelp, statusLabels, statusIcons, statusTones } from '$lib/apartment';
	import type { ApartmentStatus } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// What the status words of the list mean, in plain words instead of a tooltip
	const statuses = Object.keys(statusLabels) as ApartmentStatus[];
</script>

<Panel title="Was bedeutet der Mietstatus?" testid="apartment-status-legend">
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
		Vermietet und Wiedervermietet ergeben sich aus den Mietverträgen. Leer und Gesperrt setzen Sie
		beim Bearbeiten der Wohnung.
	</p>
</Panel>
