<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { MONTHS, profileTotal } from '$lib/heating-profile';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
	const total = $derived(profileTotal(profile.monthlyPercentages));
	// Predefined profiles follow common Swiss practice and stay as they are
	const custom = $derived(profile.type === 'custom');
	const deleteError = $derived(form?.error);
	let deleting = $state(false);
	const dialogOpen = $derived(deleting || Boolean(deleteError));
</script>

<svelte:head>
	<title>{profile.name} - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="heating-profile-detail-page">
	<PageTrail
		links={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/heating-profiles', label: 'Heizprofile' }
		]}
		current={profile.name}
	/>

	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
				{profile.name}
				<Badge variant={custom ? 'primary' : 'info'} size="sm"
					>{custom ? 'Eigenes Profil' : 'Vordefiniert'}</Badge
				>
			</h1>
			<p class="text-gray-500 mt-1">{profile.description}</p>
		</div>
		{#if custom}
			<div class="flex gap-2">
				<Button
					href="/config/heating-profiles/{profile.id}/edit"
					variant="secondary"
					testid="heating-profile-edit-button"
				>
					<Icon name="edit" size={18} />
					Bearbeiten
				</Button>
				<Button
					variant="danger"
					onclick={() => (deleting = true)}
					testid="heating-profile-delete-button"
				>
					<Icon name="delete" size={18} />
					Löschen
				</Button>
			</div>
		{/if}
	</div>

	<Card>
		<HeatingProfileChart shares={profile.monthlyPercentages} />
		<dl class="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
			{#each MONTHS as month (month.key)}
				<div class="text-center p-2 bg-gray-50 rounded-lg">
					<dt class="text-xs text-gray-500">{month.label}</dt>
					<dd class="font-semibold text-gray-900" data-testid="heating-profile-share-{month.key}">
						{profile.monthlyPercentages[month.key]} %
					</dd>
				</div>
			{/each}
		</dl>
		<p class="mt-4 pt-4 border-t border-gray-100 flex justify-between">
			<span class="font-medium text-gray-700">Summe</span>
			<span class="font-bold" data-testid="heating-profile-total">{total} %</span>
		</p>
	</Card>
</div>

{#if dialogOpen}
	<ConfirmDeleteDialog
		title="Heizprofil «{profile.name}» löschen?"
		message="Bereits erstellte Abrechnungen behalten ihre Heizkostenverteilung."
		error={deleteError}
		testid="heating-profile-delete-confirm"
		onclose={() => (deleting = false)}
	/>
{/if}
