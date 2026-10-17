<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const operator = $derived(
		data.operator &&
			m.terms_operator({
				operator: [data.operator.name, data.operator.address].filter(Boolean).join(', ')
			}) + (data.operator.contact ? ` ${m.terms_contact({ contact: data.operator.contact })}` : '')
	);

	const sections = [
		{ id: 'purpose', title: m.terms_purpose_title(), paragraphs: [m.terms_purpose_1()] },
		{
			id: 'responsibility',
			title: m.terms_responsibility_title(),
			paragraphs: [m.terms_responsibility_1(), m.terms_responsibility_2()]
		},
		{
			id: 'availability',
			title: m.terms_availability_title(),
			paragraphs: [m.terms_availability_1()]
		}
	];
</script>

<svelte:head>
	<title>{m.terms_title()} - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title={m.terms_title()} purpose={m.terms_purpose()} />

	{#if data.demo}
		<Panel title={m.demo_notice_title()} testid="page-section">
			<p class="text-ink">{m.terms_demo_1()}</p>
		</Panel>
	{/if}

	{#each sections as section (section.id)}
		<Panel title={section.title} testid="page-section">
			{#if section.id === 'availability' && operator}
				<p class="text-ink" data-testid="terms-operator">{operator}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-ink">{paragraph}</p>
			{/each}
		</Panel>
	{/each}
</div>
