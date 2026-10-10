<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DistributionKeyForm from '../../DistributionKeyForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
</script>

<svelte:head>
	<title>{data.key.name} bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="{data.key.name} bearbeiten"
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/distribution-keys', label: 'Verteilschlüssel' }
		]}
	/>
	<DistributionKeyForm key={data.key} {errors} {test} submitLabel="Änderungen speichern" />
</div>
