<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CategoryForm from '../CategoryForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
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
	<CategoryForm errors={form?.errors} submitLabel={m.categories_save()} />
</div>
