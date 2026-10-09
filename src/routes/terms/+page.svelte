<script lang="ts">
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

<div class="space-y-6 max-w-3xl">
	<div>
		<h1 class="text-2xl font-bold text-gray-900" data-testid="page-title">Nutzungsbedingungen</h1>
		<p class="text-ink-muted mt-1">Was Dwello leistet und wofür die Verwaltung verantwortlich ist</p>
	</div>

	{#each sections as section (section.title)}
		<section
			data-testid="page-section"
			class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-3"
		>
			<h2 class="text-lg font-semibold text-gray-900">{section.title}</h2>
			{#if section.title === 'Verfügbarkeit' && operator}
				<p class="text-gray-700" data-testid="terms-operator">{operator}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-gray-700">{paragraph}</p>
			{/each}
		</section>
	{/each}
</div>
