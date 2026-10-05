<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import DistributionKeyForm from '../../DistributionKeyForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
</script>

<svelte:head>
	<title>{data.key.name} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail
		links={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/distribution-keys', label: 'Verteilschlüssel' }
		]}
		current={data.key.name}
	/>

	<h1 class="text-2xl font-bold text-gray-900">Verteilschlüssel bearbeiten</h1>

	<Card>
		<DistributionKeyForm key={data.key} {errors} {test} submitLabel="Speichern" />
	</Card>
</div>
