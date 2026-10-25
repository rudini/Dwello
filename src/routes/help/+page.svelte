<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Glossary from './Glossary.svelte';

	// the year the date fields use in their examples, as at the Leistungszeitraum of an invoice
	const year = new Date().getFullYear();

	// Area names as in the main navigation (src/lib/ui/navigation.ts), so the help leads to the right place
	const sections = [
		{
			id: 'buildings',
			title: m.help_buildings_title(),
			steps: [m.help_buildings_1(), m.help_buildings_2(), m.help_buildings_3()]
		},
		{
			id: 'tenants',
			title: m.help_tenants_title(),
			steps: [
				m.help_tenants_1(),
				m.help_tenants_2(),
				m.help_tenants_3(),
				m.help_tenants_4(),
				m.help_tenants_5()
			]
		},
		{
			id: 'invoices',
			title: m.help_invoices_title(),
			steps: [
				m.help_invoices_1(),
				m.help_invoices_2(),
				m.help_invoices_3(),
				m.help_invoices_4(),
				m.invoices_service_period_years({ year, end: year + 5 }),
				m.invoices_service_period_boiler()
			]
		},
		{
			id: 'statements',
			title: m.help_statements_title(),
			steps: [
				m.help_statements_1(),
				m.help_statements_2(),
				m.help_statements_3(),
				m.help_statements_4()
			]
		},
		{
			id: 'payments',
			title: m.help_payments_title(),
			steps: [
				m.help_payments_1(),
				m.help_payments_2(),
				m.help_payments_3(),
				m.help_payments_4(),
				m.statements_reminder_257d()
			]
		}
	];
</script>

<svelte:head>
	<title>{m.help_title()} - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title={m.help_title()} purpose={m.help_purpose()} />

	<nav aria-label={m.help_contents()} data-testid="help-contents">
		<ul class="flex flex-col">
			{#each [...sections, { id: 'glossary', title: m.glossary_title() }] as { id, title } (id)}
				<li>
					<a
						href="#{id}"
						class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
						>{title}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	{#each sections as section (section.id)}
		<Panel id={section.id} title={section.title} testid="page-section">
			<ol class="flex list-decimal flex-col gap-2 pl-6 text-ink">
				{#each section.steps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</Panel>
	{/each}

	<Glossary />
</div>
