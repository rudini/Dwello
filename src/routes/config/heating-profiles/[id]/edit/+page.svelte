<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import HeatingProfileForm from '../../HeatingProfileForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
	const name = $derived(localName(profile));
	const title = $derived(m.tenants_edit_page_title({ name }));
</script>

<svelte:head>
	<title>{title} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		{title}
		trail={[
			{ href: '/config/heating-profiles', label: m.nav_heating_profiles() },
			{ href: `/config/heating-profiles/${profile.id}`, label: name }
		]}
	/>
	<HeatingProfileForm
		{profile}
		errors={form?.errors}
		cancelHref="/config/heating-profiles/{profile.id}"
		submitLabel={m.buildings_save_changes()}
	/>
</div>
