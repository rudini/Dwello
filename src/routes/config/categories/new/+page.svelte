<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CategoryForm from '../CategoryForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>{m.categories_new()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.categories_new()}
		purpose={m.categories_new_purpose()}
		trail={[
			{ href: '/config', label: m.nav_settings() },
			{ href: '/config/categories', label: m.nav_categories() }
		]}
	/>
	<CategoryForm
		action="?/save"
		ki={data.kiEnabled}
		errors={form && 'errors' in form ? form.errors : undefined}
		proposal={form && 'proposal' in form ? form.proposal : undefined}
		submitLabel={m.categories_save()}
	/>
</div>
