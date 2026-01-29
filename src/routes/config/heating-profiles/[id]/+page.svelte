<script lang="ts">
	import type { HeatingProfileDetailData } from './+page.server';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data }: { data: HeatingProfileDetailData } = $props();

	const profile = $derived(data.profile);

	// Month names in German
	const months = [
		{ key: 'january', label: 'Januar' },
		{ key: 'february', label: 'Februar' },
		{ key: 'march', label: 'März' },
		{ key: 'april', label: 'April' },
		{ key: 'may', label: 'Mai' },
		{ key: 'june', label: 'Juni' },
		{ key: 'july', label: 'Juli' },
		{ key: 'august', label: 'August' },
		{ key: 'september', label: 'September' },
		{ key: 'october', label: 'Oktober' },
		{ key: 'november', label: 'November' },
		{ key: 'december', label: 'Dezember' }
	] as const;

	// Calculate total percentage
	const totalPercentage = $derived(
		Object.values(profile.monthlyPercentages).reduce((sum, val) => sum + val, 0)
	);

	// Calculate heating period
	const heatingMonths = $derived(
		months.filter(m => profile.monthlyPercentages[m.key] > 0)
	);
	const heatingPeriod = $derived(
		heatingMonths.length > 0
			? `${heatingMonths[0].label} - ${heatingMonths[heatingMonths.length - 1].label}`
			: 'Keine Heizperiode definiert'
	);
</script>

<svelte:head>
	<title>{profile.name} - Heizprofil - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/config" class="hover:text-primary transition-colors">Einstellungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/config/heating-profiles" class="hover:text-primary transition-colors">Heizprofile</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">{profile.name}</span>
	</nav>

	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold text-gray-900">{profile.name}</h1>
				{#if profile.type === 'predefined'}
					<StatusBadge status="System" variant="info" />
				{:else}
					<StatusBadge status="Benutzerdefiniert" variant="success" />
				{/if}
			</div>
			<p class="text-gray-500 mt-1">{profile.description}</p>
		</div>
		<div class="flex gap-2">
			<Button href="/config/heating-profiles" variant="secondary">
				<Icon name="arrow_back" size={18} />
				Zurück
			</Button>
			{#if profile.type === 'custom'}
				<Button href="/config/heating-profiles/{profile.id}/edit" variant="primary">
					<Icon name="edit" size={18} />
					Bearbeiten
				</Button>
			{/if}
		</div>
	</div>

	<!-- Profile Details -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Monthly Distribution Chart -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Monatliche Verteilung</h2>
			<div class="space-y-3">
				{#each months as month}
					{@const percentage = profile.monthlyPercentages[month.key]}
					<div class="flex items-center gap-3">
						<span class="w-24 text-sm text-gray-600">{month.label}</span>
						<div class="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
							<div
								class="h-full bg-primary rounded-full transition-all duration-300 flex items-center justify-end pr-2"
								style="width: {Math.max(percentage * 5, percentage > 0 ? 10 : 0)}%"
							>
								{#if percentage > 0}
									<span class="text-xs font-medium text-white">{percentage}%</span>
								{/if}
							</div>
						</div>
						<span class="w-12 text-right text-sm font-medium text-gray-900">{percentage}%</span>
					</div>
				{/each}
			</div>
			<div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
				<span class="text-sm text-gray-600">Gesamt</span>
				<span class="text-lg font-bold {totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}">
					{totalPercentage}%
				</span>
			</div>
			{#if totalPercentage !== 100}
				<p class="mt-2 text-sm text-red-600">
					<Icon name="warning" size={16} class="inline mr-1" />
					Die Summe sollte 100% betragen
				</p>
			{/if}
		</Card>

		<!-- Profile Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Profil-Informationen</h2>
			<dl class="space-y-4">
				<div>
					<dt class="text-sm text-gray-500">Name</dt>
					<dd class="text-gray-900 font-medium">{profile.name}</dd>
				</div>
				<div>
					<dt class="text-sm text-gray-500">Typ</dt>
					<dd class="text-gray-900">
						{profile.type === 'predefined' ? 'Vordefiniert (System)' : 'Benutzerdefiniert'}
					</dd>
				</div>
				<div>
					<dt class="text-sm text-gray-500">Beschreibung</dt>
					<dd class="text-gray-900">{profile.description}</dd>
				</div>
				<div>
					<dt class="text-sm text-gray-500">Status</dt>
					<dd>
						{#if profile.isActive}
							<StatusBadge status="Aktiv" variant="success" />
						{:else}
							<StatusBadge status="Inaktiv" variant="warning" />
						{/if}
					</dd>
				</div>
				<div>
					<dt class="text-sm text-gray-500">Heizperiode</dt>
					<dd class="text-gray-900">{heatingPeriod}</dd>
				</div>
			</dl>

			{#if profile.type === 'predefined'}
				<div class="mt-6 p-4 bg-blue-50 rounded-lg">
					<div class="flex items-start gap-3">
						<Icon name="info" size={20} class="text-blue-600 mt-0.5" />
						<div>
							<p class="text-sm text-blue-800 font-medium">Systemdefiniertes Profil</p>
							<p class="text-sm text-blue-600 mt-1">
								Dieses Profil ist vordefiniert und kann nicht bearbeitet werden.
								Sie können es jedoch als Vorlage für ein eigenes Profil verwenden.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</Card>
	</div>
</div>
