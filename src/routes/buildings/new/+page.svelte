<script lang="ts">
	import BuildingForm from '../BuildingForm.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	const errors = $derived(form?.errors || {});
</script>

<svelte:head>
	<title>Neues Gebäude - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neues Gebäude"
		purpose="Erfassen Sie Adresse und Angaben des Gebäudes. Danach legen Sie seine Wohnungen an."
		trail={[{ href: '/buildings', label: 'Gebäude' }]}
	/>
	<Panel>
		<BuildingForm mode="create" {errors} cancelHref="/buildings" />
	</Panel>
</div>
