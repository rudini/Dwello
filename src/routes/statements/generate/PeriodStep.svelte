<script lang="ts">
	import type { HeatingProfile } from '$lib/types';
	import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';

	let {
		heatingProfiles,
		periodStart = $bindable(),
		periodEnd = $bindable(),
		heatingProfileId = $bindable()
	}: {
		heatingProfiles: HeatingProfile[];
		periodStart: string;
		periodEnd: string;
		heatingProfileId: string;
	} = $props();

	// Helper to calculate sum of monthly percentages
	function getProfileSum(profile: HeatingProfile): number {
		return Object.values(profile.monthlyPercentages).reduce((sum, val) => sum + Number(val), 0);
	}

	// Check if profile is valid (sums to 100%)
	function isProfileValid(profile: HeatingProfile): boolean {
		return Math.abs(getProfileSum(profile) - 100) < 0.01;
	}

	// Preselect the first valid profile
	$effect(() => {
		if (!heatingProfileId) heatingProfileId = heatingProfiles.find(isProfileValid)?.id ?? '';
	});

	// "Name (95%) - nicht wählbar" for profiles that do not sum to 100%
	const profileOptions = $derived(
		heatingProfiles.map((profile) => {
			const sum = getProfileSum(profile);
			const valid = isProfileValid(profile);
			const suffix = valid ? '' : ' - nicht wählbar';
			return { id: profile.id, valid, label: `${profile.name} (${+sum.toFixed(1)}%)${suffix}` };
		})
	);

	const selectedHeatingProfile = $derived(heatingProfiles.find((p) => p.id === heatingProfileId));
	const heatingShares = $derived(selectedHeatingProfile?.monthlyPercentages);
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsperiode wählen</h2>
		<p class="text-gray-500 mb-6">
			Wählen Sie den Zeitraum für die Nebenkostenabrechnung und das Heizungsprofil.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<div>
			<label for="periodStart" class="block text-sm font-medium text-gray-700 mb-2">
				Periode Start
			</label>
			<input
				id="periodStart"
				data-testid="period-start-input"
				type="date"
				bind:value={periodStart}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
		<div>
			<label for="periodEnd" class="block text-sm font-medium text-gray-700 mb-2">
				Periode Ende
			</label>
			<input
				id="periodEnd"
				data-testid="period-end-input"
				type="date"
				bind:value={periodEnd}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
	</div>

	<div>
		<label for="heatingProfile" class="block text-sm font-medium text-gray-700 mb-2">
			Heizungsprofil
		</label>
		<select
			id="heatingProfile"
			data-testid="heating-profile-select"
			bind:value={heatingProfileId}
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
		>
			{#each profileOptions as option (option.id)}
				<option
					value={option.id}
					disabled={!option.valid}
					class:text-gray-400={!option.valid}
					data-testid="heating-profile-option-{option.id}"
				>
					{option.label}
				</option>
			{/each}
		</select>
		{#if selectedHeatingProfile?.description}
			<p class="text-sm text-gray-500 mt-2">{selectedHeatingProfile.description}</p>
		{/if}
	</div>

	<HeatingProfileChart shares={heatingShares} />
</div>
