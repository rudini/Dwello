<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DistributionKeyForm from '../DistributionKeyForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
</script>

<svelte:head>
	<title>Neuer Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neuer Verteilschlüssel"
		purpose="Eine eigene Formel, nach der Kosten auf die Wohnungen eines Gebäudes verteilt werden."
		trail={[
			{ href: '/config', label: 'Einstellungen' },
			{ href: '/config/distribution-keys', label: 'Verteilschlüssel' }
		]}
	/>
	<DistributionKeyForm {errors} {test} submitLabel="Verteilschlüssel speichern" />
</div>
