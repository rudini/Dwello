<script lang="ts">
	import { untrack } from 'svelte';
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import { profileTotal } from '$lib/heating-profile';
	import { germanName } from '$lib/names';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import DeleteDialog from '../../DeleteDialog.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
	const name = $derived(germanName(profile));
	const total = $derived(profileTotal(profile.monthlyPercentages));
	// Predefined profiles follow common Swiss practice and stay as they are; their descriptions are English
	const custom = $derived(profile.type === 'custom');
	// Without JavaScript the refusal comes with a new page: the question stays open to show it
	let deleting = $state(untrack(() => Boolean(form?.error)));
</script>

<svelte:head>
	<title>{name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="heating-profile-detail-page">
	<PageHeader
		title={name}
		purpose={(custom && profile.description) || undefined}
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/heating-profiles', label: 'Heizprofile' }
		]}
	>
		{#snippet action()}
			{#if custom}
				<Button
					href="/config/heating-profiles/{profile.id}/edit"
					icon="edit"
					testid="heating-profile-edit-button">Bearbeiten</Button
				>
				<Button
					variant="danger-ghost"
					icon="delete"
					onclick={() => (deleting = true)}
					testid="heating-profile-delete-button">Löschen</Button
				>
			{/if}
		{/snippet}
	</PageHeader>

	<Panel title="Monatsanteile">
		<div class="flex flex-wrap items-center gap-4">
			<Badge
				tone={custom ? 'info' : 'neutral'}
				label={custom ? 'Eigenes Heizprofil' : 'Vordefiniert'}
			/>
			{#if !custom}
				<p class="text-ink-muted">Folgt der üblichen Praxis und lässt sich nicht ändern.</p>
			{/if}
		</div>
		<HeatingProfileChart shares={profile.monthlyPercentages} />
		<p class="flex justify-between border-t border-line pt-4 text-lg">
			<span class="font-semibold text-ink">Summe</span>
			<span class="font-bold text-ink tabular-nums" data-testid="heating-profile-total"
				>{total} %</span
			>
		</p>
	</Panel>
</div>

<DeleteDialog
	bind:open={deleting}
	record="Heizprofil"
	{name}
	error={form?.error}
	confirmTestid="heating-profile-delete-confirm"
>
	<p>Bereits erstellte Abrechnungen behalten ihre Heizkostenverteilung.</p>
</DeleteDialog>
