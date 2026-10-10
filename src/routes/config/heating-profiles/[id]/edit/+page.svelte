<script lang="ts">
	import { germanName } from '$lib/names';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import HeatingProfileForm from '../../HeatingProfileForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
	const name = $derived(germanName(profile));
</script>

<svelte:head>
	<title>{name} bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="{name} bearbeiten"
		trail={[
			{ href: '/config/heating-profiles', label: 'Heizprofile' },
			{ href: `/config/heating-profiles/${profile.id}`, label: name }
		]}
	/>
	<HeatingProfileForm
		{profile}
		errors={form?.errors}
		cancelHref="/config/heating-profiles/{profile.id}"
		submitLabel="Änderungen speichern"
	/>
</div>
