<script lang="ts">
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import { germanName } from '$lib/names';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import { help } from '../help';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Heizprofile - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="heating-profiles-page">
	<PageHeader
		title="Heizprofile"
		purpose={help.heatingProfile}
		trail={[{ href: '/config', label: 'Einstellungen' }]}
	>
		{#snippet action()}
			<Button
				href="/config/heating-profiles/new"
				variant="primary"
				icon="add"
				testid="heating-profiles-new-button">Heizprofil erfassen</Button
			>
		{/snippet}
	</PageHeader>

	{#if data.profiles.length === 0}
		<EmptyState
			title="Noch keine Heizprofile"
			text="Erfassen Sie ein Heizprofil, damit die Heizkosten bei einem Mieterwechsel nach Monaten verteilt werden."
			actionLabel="Heizprofil erfassen"
			actionHref="/config/heating-profiles/new"
			illustration="meter"
		/>
	{:else}
		<ul class="flex flex-col gap-6">
			{#each data.profiles as profile (profile.id)}
				<!-- The whole card opens the profile; its name is the link -->
				<li
					class="relative flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 hover:border-line-strong"
					data-testid="heating-profile-card"
				>
					<div class="flex flex-wrap items-center justify-between gap-4">
						<h2 class="text-xl font-bold text-ink">
							<a
								href="/config/heating-profiles/{profile.id}"
								class="text-accent underline underline-offset-4 after:absolute after:inset-0"
								>{germanName(profile)}</a
							>
						</h2>
						<Badge
							tone={profile.type === 'custom' ? 'info' : 'neutral'}
							label={profile.type === 'custom' ? 'Eigenes Heizprofil' : 'Vordefiniert'}
						/>
					</div>
					<HeatingProfileChart shares={profile.monthlyPercentages} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
