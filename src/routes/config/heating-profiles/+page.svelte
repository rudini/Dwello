<script lang="ts">
	import type { HeatingProfile } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	interface PageData {
		profiles: HeatingProfile[];
		total: number;
	}

	let { data }: { data: PageData } = $props();

	const months = [
		{ key: 'january', label: 'Jan' },
		{ key: 'february', label: 'Feb' },
		{ key: 'march', label: 'Mär' },
		{ key: 'april', label: 'Apr' },
		{ key: 'may', label: 'Mai' },
		{ key: 'june', label: 'Jun' },
		{ key: 'july', label: 'Jul' },
		{ key: 'august', label: 'Aug' },
		{ key: 'september', label: 'Sep' },
		{ key: 'october', label: 'Okt' },
		{ key: 'november', label: 'Nov' },
		{ key: 'december', label: 'Dez' }
	] as const;

	function getTotal(profile: HeatingProfile): number {
		return Object.values(profile.monthlyPercentages).reduce((sum, val) => sum + val, 0);
	}

	function getMaxPercentage(profile: HeatingProfile): number {
		return Math.max(...Object.values(profile.monthlyPercentages));
	}

	function getBarHeight(value: number, maxValue: number): number {
		if (maxValue === 0) return 0;
		return (value / maxValue) * 100;
	}
</script>

<svelte:head>
	<title>Heizprofile - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="heating-profiles-page">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a
				href="/config"
				class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
				data-testid="back-to-config-link"
			>
				<Icon name="arrow_back" size={20} />
			</a>
			<div>
				<h1 class="text-2xl font-bold text-gray-900" data-testid="page-title">Heizprofile</h1>
				<p class="text-gray-500 mt-1" data-testid="profile-count">{data.total} Profile verfügbar</p>
			</div>
		</div>
		<Button href="/config/heating-profiles/new" variant="primary">
			<Icon name="add" size={20} />
			Neues Profil
		</Button>
	</div>

	<!-- Info Card -->
	<Card>
		<div class="flex items-start gap-3">
			<Icon name="info" size={24} class="text-blue-500 flex-shrink-0" />
			<div>
				<h3 class="font-medium text-gray-900 mb-1">Heizprofile für Nebenkostenabrechnung</h3>
				<p class="text-sm text-gray-600">
					Heizprofile definieren, wie Heizkosten auf die einzelnen Monate verteilt werden.
					Dies ist wichtig für die Berechnung bei Mieterwechseln während der Heizperiode.
					Die Summe aller Monatsanteile sollte nahe bei 100% liegen.
				</p>
			</div>
		</div>
	</Card>

	<!-- Profiles Grid -->
	<div class="grid gap-6 lg:grid-cols-2" data-testid="profiles-grid">
		{#each data.profiles as profile}
			{@const total = getTotal(profile)}
			{@const maxPct = getMaxPercentage(profile)}
			<Card>
				<div class="flex items-start justify-between mb-4" data-testid="profile-card-{profile.id}">
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-lg font-semibold text-gray-900" data-testid="profile-name-{profile.id}">{profile.name}</h3>
							{#if profile.type === 'predefined'}
								<Badge variant="info" size="sm">Vordefiniert</Badge>
							{:else}
								<Badge variant="primary" size="sm">Benutzerdefiniert</Badge>
							{/if}
						</div>
						{#if profile.description}
							<p class="text-sm text-gray-500 mt-1">{profile.description}</p>
						{/if}
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold {total === 100 ? 'text-green-600' : 'text-red-600'}" data-testid="profile-total-{profile.id}">
							{total}%
						</p>
						<p class="text-xs text-gray-500">Summe</p>
					</div>
				</div>

				<!-- Monthly Chart -->
				<div class="h-36 flex items-end gap-1 mb-1 bg-gray-50 rounded-lg p-2 pt-4">
					{#each months as month}
						{@const value = profile.monthlyPercentages[month.key]}
						<div class="flex-1 flex flex-col items-center justify-end h-full">
							<div
								class="w-full rounded-t transition-all duration-300 {value > 0 ? 'bg-primary hover:bg-primary/80' : 'bg-gray-200'}"
								style="height: {value > 0 ? Math.max((value / 20) * 100, 8) : 4}%"
								title="{month.label}: {value}%"
							></div>
						</div>
					{/each}
				</div>

				<!-- Month Labels -->
				<div class="flex gap-1 text-xs text-gray-500 mb-3">
					{#each months as month}
						<div class="flex-1 text-center">{month.label}</div>
					{/each}
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-between pt-4 border-t border-gray-100">
					<div class="flex gap-2">
						{#each months as month}
							{@const value = profile.monthlyPercentages[month.key]}
							{#if value > 0}
								<span class="text-xs text-gray-400">{month.label}: {value}%</span>
							{/if}
						{/each}
					</div>
					<div class="flex items-center gap-2">
						{#if profile.type === 'custom'}
							<a
								href="/config/heating-profiles/{profile.id}/edit"
								class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								title="Bearbeiten"
							>
								<Icon name="edit" size={18} />
							</a>
						{/if}
						<a
							href="/config/heating-profiles/{profile.id}"
							class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
							title="Details anzeigen"
							data-testid="view-profile-{profile.id}"
						>
							<Icon name="visibility" size={18} />
						</a>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</div>
