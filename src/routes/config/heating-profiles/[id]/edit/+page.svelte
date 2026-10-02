<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import HeatingProfileForm from '../../HeatingProfileForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
</script>

<svelte:head>
	<title>{profile.name} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail links={[{ href: '/config/heating-profiles', label: 'Heizprofile' }, { href: `/config/heating-profiles/${profile.id}`, label: profile.name }]} current="Bearbeiten" />

	<h1 class="text-2xl font-bold text-gray-900">{profile.name} bearbeiten</h1>

	<Card>
		<HeatingProfileForm
			{profile}
			errors={form?.errors}
			cancelHref="/config/heating-profiles/{profile.id}"
			submitLabel="Änderungen speichern"
		/>
	</Card>
</div>
