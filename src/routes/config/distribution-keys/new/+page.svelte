<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import DistributionKeyForm from '../DistributionKeyForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
</script>

<svelte:head>
	<title>Neuer Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail
		links={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/distribution-keys', label: 'Verteilschlüssel' }
		]}
		current="Neuer Verteilschlüssel"
	/>

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neuer Verteilschlüssel</h1>
		<p class="text-gray-500 mt-1">
			Formel, nach der Kosten auf die Wohnungen eines Gebäudes verteilt werden.
		</p>
	</div>

	<Card>
		<DistributionKeyForm {errors} {test} submitLabel="Verteilschlüssel erstellen" />
	</Card>
</div>
