<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BuildingForm from '../BuildingForm.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	const errors = $derived(form?.errors || {});
</script>

<svelte:head>
	<title>{m.buildings_new_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.buildings_new_title()}
		purpose={m.buildings_new_purpose()}
		trail={[{ href: '/buildings', label: m.nav_buildings() }]}
	/>
	<Panel>
		<BuildingForm mode="create" {errors} cancelHref="/buildings" />
	</Panel>
</div>
