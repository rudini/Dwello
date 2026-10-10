<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import HeatingProfileForm from '../HeatingProfileForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Neues Heizprofil - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neues Heizprofil"
		purpose="Legen Sie fest, wie sich die Heizkosten eines Jahres auf die Monate verteilen, z. B. für ein Gebäude in den Bergen mit langer Heizperiode."
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/heating-profiles', label: 'Heizprofile' }
		]}
	/>
	<HeatingProfileForm
		errors={form?.errors}
		cancelHref="/config/heating-profiles"
		submitLabel="Heizprofil speichern"
	/>
</div>
