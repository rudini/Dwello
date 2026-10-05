<script lang="ts">
	import PageTrail from '$lib/components/PageTrail.svelte';
	import Card from '$lib/components/Card.svelte';
	import HeatingProfileForm from '../HeatingProfileForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Neues Heizprofil - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail
		links={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/heating-profiles', label: 'Heizprofile' }
		]}
		current="Neues Heizprofil"
	/>

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neues Heizprofil</h1>
		<p class="text-gray-500 mt-1">
			Wie sich die Heizkosten eines Jahres auf die Monate verteilen, z.B. für ein Gebäude in den
			Bergen.
		</p>
	</div>

	<Card>
		<HeatingProfileForm
			errors={form?.errors}
			cancelHref="/config/heating-profiles"
			submitLabel="Heizprofil erstellen"
		/>
	</Card>
</div>
