<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Heizprofile - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="heating-profiles-page">
	<PageTrail links={[{ href: '/config', label: 'Einstellungen' }]} current="Heizprofile" />

	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Heizprofile</h1>
			<p class="text-gray-500 mt-1">
				Wie sich die Heizkosten eines Jahres auf die Monate verteilen. Bei einem Mieterwechsel trägt
				jeder Mieter die Monate seiner Mietdauer.
			</p>
		</div>
		<Button
			href="/config/heating-profiles/new"
			variant="primary"
			testid="heating-profiles-new-button"
		>
			<Icon name="add" size={20} />
			Neues Heizprofil
		</Button>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		{#each data.profiles as profile (profile.id)}
			<a
				href="/config/heating-profiles/{profile.id}"
				class="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-5 space-y-4"
				data-testid="heating-profile-card"
			>
				<div class="flex items-center justify-between gap-2">
					<h3 class="text-lg font-semibold text-gray-900">{profile.name}</h3>
					<Badge variant={profile.type === 'custom' ? 'primary' : 'info'} size="sm">
						{profile.type === 'custom' ? 'Eigenes Profil' : 'Vordefiniert'}
					</Badge>
				</div>
				<HeatingProfileChart shares={profile.monthlyPercentages} />
			</a>
		{/each}
	</div>
</div>
