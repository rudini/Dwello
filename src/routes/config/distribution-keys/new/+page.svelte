<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DistributionKeyForm from '../DistributionKeyForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
</script>

<svelte:head>
	<title>{m.keys_new()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.keys_new()}
		purpose={m.keys_new_purpose()}
		trail={[
			{ href: '/config', label: m.nav_settings() },
			{ href: '/config/distribution-keys', label: m.nav_distribution_keys() }
		]}
	/>
	<DistributionKeyForm {errors} {test} submitLabel={m.keys_save()} />
</div>
