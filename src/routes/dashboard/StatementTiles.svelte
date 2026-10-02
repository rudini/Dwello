<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { DashboardData } from './+page.server';

	let { counts }: { counts: DashboardData['statements'] } = $props();

	// Each tile opens the statement list with its status filter
	const tiles = [
		{ status: 'draft', label: 'Entwürfe', icon: 'edit_note', tone: 'bg-gray-100 text-gray-600' },
		{ status: 'sent', label: 'Versendet', icon: 'send', tone: 'bg-blue-100 text-blue-600' },
		{ status: 'paid', label: 'Bezahlt', icon: 'check_circle', tone: 'bg-green-100 text-green-600' },
		{ status: 'overdue', label: 'Überfällig', icon: 'warning', tone: 'bg-red-100 text-red-600' }
	] as const;
</script>

<div data-testid="statements-status-section">
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungen</h2>
	<div class="grid gap-4 sm:grid-cols-4">
		{#each tiles as tile (tile.status)}
			<a
				href="/statements?status={tile.status}"
				data-testid="statements-{tile.status}"
				class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg {tile.tone}">
						<Icon name={tile.icon} size={24} />
					</div>
					<div>
						<p class="text-2xl font-bold text-gray-900" data-testid="statements-{tile.status}-count">{counts[tile.status]}</p>
						<p class="text-sm text-gray-500">{tile.label}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
