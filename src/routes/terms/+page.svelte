<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import LegalHeader from '../LegalHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const operator = $derived(
		data.operator &&
			m.terms_operator({
				operator: [data.operator.name, data.operator.address].filter(Boolean).join(', ')
			}) + (data.operator.contact ? ` ${m.terms_contact({ contact: data.operator.contact })}` : '')
	);

	// The sections of the privacy statement the landlord passes on to his tenants (terms_responsibility_3, #458)
	const forTenants = [
		{ id: 'controller', title: m.privacy_controller_title() },
		{ id: 'stored', title: m.privacy_stored_title() },
		{ id: 'retention', title: m.privacy_retention_title() },
		{ id: 'third', title: m.privacy_third_title() }
	];

	const sections: { id: string; title: string; paragraphs: string[]; after?: string[] }[] = [
		{
			id: 'purpose',
			title: m.terms_purpose_title(),
			paragraphs: [m.terms_purpose_1(), m.terms_no_contract(), m.terms_processor()]
		},
		{
			id: 'responsibility',
			title: m.terms_responsibility_title(),
			paragraphs: [
				m.terms_responsibility_1(),
				m.terms_responsibility_2(),
				m.terms_responsibility_3()
			],
			after: [m.terms_responsibility_4(), m.terms_responsibility_5()]
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
	<LegalHeader title={m.terms_title()} purpose={m.terms_purpose()} />

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
			{#if section.after}
				<ul class="flex flex-col">
					{#each forTenants as link (link.id)}
						<li>
							<a
								href="/privacy#{link.id}"
								class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
								data-testid="terms-privacy-section-link">{link.title}</a
							>
						</li>
					{/each}
				</ul>
				{#each section.after as paragraph (paragraph)}
					<p class="text-ink">{paragraph}</p>
				{/each}
			{/if}
		</Panel>
	{/each}
</div>
