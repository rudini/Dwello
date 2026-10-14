<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Who receives invoice data for the KI categorization (DSG Art. 19: recipient and country)
	const llmNotice = $derived(
		data.recipient ? m.privacy_llm_external(data.recipient) : m.privacy_llm_local()
	);

	const sections = [
		{
			id: 'stored',
			title: m.privacy_stored_title(),
			paragraphs: [m.privacy_stored_1(), m.privacy_stored_2()]
		},
		{ id: 'login', title: m.privacy_login_title(), paragraphs: [m.privacy_login_1()] },
		{
			id: 'third',
			title: m.privacy_third_title(),
			paragraphs: [m.privacy_third_1(), m.privacy_third_2(), m.privacy_third_3()]
		},
		{ id: 'cookies', title: m.privacy_cookies_title(), paragraphs: [m.privacy_cookies_1()] }
	];

	// TODO(fachlich prüfen, #82): legal wording of the draft notice
	const draftNotice = m.privacy_draft_notice();
</script>

<svelte:head>
	<title>{m.privacy_title()} - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title={m.privacy_title()} purpose={m.privacy_purpose()} />

	{#if data.demo}
		<Panel title={m.demo_notice_title()} testid="page-section">
			<p class="text-ink">{m.privacy_demo_1()}</p>
			<p class="text-ink">{m.privacy_demo_2()}</p>
		</Panel>
	{/if}

	{#each sections as section (section.id)}
		<Panel title={section.title} testid="page-section">
			{#if section.id === 'third'}
				<p class="text-ink" data-testid="llm-recipient">{llmNotice}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-ink">{paragraph}</p>
			{/each}
			{#if section.id === 'stored'}
				<p class="text-ink" data-testid="draft-notice">{draftNotice}</p>
			{/if}
		</Panel>
	{/each}
</div>
