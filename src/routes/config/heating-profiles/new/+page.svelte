<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import HeatingProfileForm from '../HeatingProfileForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>{m.profiles_new()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.profiles_new()}
		purpose={m.profiles_new_purpose()}
		trail={[
			{ href: '/config', label: m.nav_settings() },
			{ href: '/config/heating-profiles', label: m.nav_heating_profiles() }
		]}
	/>
	<HeatingProfileForm
		errors={form?.errors}
		cancelHref="/config/heating-profiles"
		submitLabel={m.profiles_save()}
	/>
</div>
