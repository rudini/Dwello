<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DistributionKeyForm from '../../DistributionKeyForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const errors = $derived(form && 'errors' in form ? form.errors : undefined);
	const test = $derived(form && 'test' in form ? form.test : undefined);
	const title = $derived(m.tenants_edit_page_title({ name: localName(data.key) }));
</script>

<svelte:head>
	<title>{title} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		{title}
		trail={[
			{ href: '/config', label: m.nav_settings() },
			{ href: '/config/distribution-keys', label: m.nav_distribution_keys() }
		]}
	/>
	<DistributionKeyForm key={data.key} {errors} {test} submitLabel={m.buildings_save_changes()} />
</div>
