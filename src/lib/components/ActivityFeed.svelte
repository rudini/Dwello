<script lang="ts">
	import Icon from './Icon.svelte';

	interface Activity {
		id: string;
		type: 'statement_created' | 'invoice_added' | 'payment_received' | 'reminder_sent';
		title: string;
		description: string;
		timestamp: string;
	}

	interface Props {
		activities: Activity[];
		maxItems?: number;
		class?: string;
	}

	let { activities, maxItems = 5, class: className = '' }: Props = $props();

	const displayedActivities = $derived(activities.slice(0, maxItems));

	function getActivityIcon(type: Activity['type']): {
		icon: string;
		color: string;
		bgColor: string;
	} {
		switch (type) {
			case 'statement_created':
				return { icon: 'receipt_long', color: 'text-accent', bgColor: 'bg-blue-100' };
			case 'invoice_added':
				return { icon: 'description', color: 'text-purple-600', bgColor: 'bg-purple-100' };
			case 'payment_received':
				return { icon: 'paid', color: 'text-positive', bgColor: 'bg-green-100' };
			case 'reminder_sent':
				return {
					icon: 'notification_important',
					color: 'text-caution',
					bgColor: 'bg-orange-100'
				};
			default:
				return { icon: 'info', color: 'text-gray-600', bgColor: 'bg-gray-100' };
		}
	}

	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 60) {
			return `vor ${diffMins} Min.`;
		} else if (diffHours < 24) {
			return `vor ${diffHours} Std.`;
		} else if (diffDays < 7) {
			return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
		} else {
			return date.toLocaleDateString('de-CH');
		}
	}
</script>

<div class="bg-white border border-gray-200 rounded-xl {className}">
	<div class="px-6 py-4 border-b border-gray-200">
		<h3 class="text-lg font-semibold text-gray-900">Letzte Aktivitäten</h3>
	</div>

	{#if displayedActivities.length === 0}
		<div class="p-6 text-center text-ink-muted">
			<Icon name="history" size={32} class="mx-auto text-gray-300 mb-2" />
			<p>Keine Aktivitäten vorhanden</p>
		</div>
	{:else}
		<div class="divide-y divide-gray-100">
			{#each displayedActivities as activity}
				{@const iconConfig = getActivityIcon(activity.type)}
				<div class="px-6 py-4 hover:bg-gray-50 transition-colors">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div class="p-2 rounded-lg {iconConfig.bgColor}">
								<Icon name={iconConfig.icon} size={20} class={iconConfig.color} />
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-medium text-gray-900">{activity.title}</p>
							<p class="text-sm text-ink-muted mt-0.5">{activity.description}</p>
						</div>
						<div class="flex-shrink-0">
							<span class="text-xs text-ink-muted">{formatTimestamp(activity.timestamp)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if activities.length > maxItems}
			<div class="px-6 py-3 border-t border-gray-200 text-center">
				<a href="/activity" class="text-sm font-medium text-accent hover:text-accent">
					Alle Aktivitäten anzeigen
				</a>
			</div>
		{/if}
	{/if}
</div>
