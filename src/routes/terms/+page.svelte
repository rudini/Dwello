<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const operator = $derived(
		data.operator &&
			`Betreiber dieser Dwello-Installation ist ${[data.operator.name, data.operator.address].filter(Boolean).join(', ')}.` +
				(data.operator.contact ? ` Kontakt: ${data.operator.contact}.` : '')
	);

	const sections = [
		{
			title: 'Zweck',
			paragraphs: [
				'Dwello unterstützt Liegenschaftsverwalter bei der Verwaltung von Gebäuden, Mietern und Mietverträgen sowie bei der Erstellung von Nebenkostenabrechnungen nach Schweizer Mietrecht.'
			]
		},
		{
			title: 'Verantwortung für Abrechnungen',
			paragraphs: [
				'Dwello berechnet die Abrechnungen aus den erfassten Rechnungen, Verteilschlüsseln und Mietverträgen. Für die Richtigkeit der erfassten Daten und für die versendeten Abrechnungen bleibt der Liegenschaftsverwalter verantwortlich. Jede Abrechnung sollte vor dem Versand geprüft werden.',
				'Die Verwaltung ist dafür verantwortlich, die Mieter über die Bearbeitung ihrer Daten zu informieren.'
			]
		},
		{
			title: 'Verfügbarkeit',
			paragraphs: [
				'Betrieb, Datensicherung und Verfügbarkeit liegen beim Betreiber dieser Dwello-Installation. Ein Anspruch auf ununterbrochene Verfügbarkeit besteht nicht.'
			]
		}
	];
</script>

<svelte:head>
	<title>Nutzungsbedingungen - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Nutzungsbedingungen"
		purpose="Was Dwello leistet und wofür die Verwaltung verantwortlich ist."
	/>

	{#each sections as section (section.title)}
		<Panel title={section.title} testid="page-section">
			{#if section.title === 'Verfügbarkeit' && operator}
				<p class="text-ink" data-testid="terms-operator">{operator}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-ink">{paragraph}</p>
			{/each}
		</Panel>
	{/each}
</div>
