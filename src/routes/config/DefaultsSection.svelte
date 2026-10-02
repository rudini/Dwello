<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { HeatingProfile } from '$lib/types';
	import type { Settings } from '$lib/server/settings';

	let {
		settings,
		heatingProfiles,
		distributionKeys
	}: {
		settings: Settings;
		heatingProfiles: HeatingProfile[];
		distributionKeys: { id: string; name: string }[];
	} = $props();

	const selectClass =
		'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
	// Only profiles summing to 100 % distribute all heating costs
	const profiles = $derived(
		heatingProfiles.map((profile) => {
			const total = Math.round(Object.values(profile.monthlyPercentages).reduce((sum, pct) => sum + pct, 0) * 100) / 100;
			return { id: profile.id, label: `${profile.name} (${total}%)`, selectable: total === 100 };
		})
	);
	const periods = [
		{ value: 'calendar', label: 'Kalenderjahr (Januar – Dezember)' },
		{ value: 'july-june', label: 'Juli – Juni' },
		{ value: 'november-october', label: 'November – Oktober' }
	];
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" data-testid="default-values-section">
		<Icon name="tune" size={20} class="text-gray-400" />
		Standardwerte für Abrechnungen und Rechnungen
	</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="accountingPeriod" class="block text-sm font-medium text-gray-700 mb-1">Abrechnungsperiode</label>
			<select id="accountingPeriod" name="accountingPeriod" value={settings.accountingPeriod} data-testid="setting-accountingPeriod" class={selectClass}>
				{#each periods as period (period.value)}
					<option value={period.value}>{period.label}</option>
				{/each}
			</select>
			<p class="mt-1 text-xs text-gray-500">Vorschlag für die Periode beim Erstellen der Abrechnungen</p>
		</div>
		<div>
			<label for="defaultHeatingProfileId" class="block text-sm font-medium text-gray-700 mb-1">Standard-Heizprofil</label>
			<select
				id="defaultHeatingProfileId"
				name="defaultHeatingProfileId"
				value={settings.defaultHeatingProfileId}
				data-testid="setting-defaultHeatingProfileId"
				class={selectClass}
			>
				<option value="">Kein Standard</option>
				{#each profiles as profile (profile.id)}
					<option value={profile.id} disabled={!profile.selectable}>{profile.label}</option>
				{/each}
			</select>
			<p class="mt-1 text-xs text-gray-500">Nur Profile mit genau 100% Summe sind wählbar.</p>
		</div>
		<div>
			<label for="defaultDistributionKeyId" class="block text-sm font-medium text-gray-700 mb-1">Standard-Verteilschlüssel</label>
			<select
				id="defaultDistributionKeyId"
				name="defaultDistributionKeyId"
				value={settings.defaultDistributionKeyId}
				data-testid="setting-defaultDistributionKeyId"
				class={selectClass}
			>
				<option value="">Kein Standard</option>
				{#each distributionKeys as key (key.id)}
					<option value={key.id}>{key.name}</option>
				{/each}
			</select>
			<p class="mt-1 text-xs text-gray-500">Vorschlag beim Erfassen neuer Rechnungen</p>
		</div>
	</div>
</Card>
