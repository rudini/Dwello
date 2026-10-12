<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Glossary from './Glossary.svelte';

	// Area names as in the main navigation (src/lib/navigation.ts), so the help leads to the right place
	const sections = [
		{
			title: 'Gebäude und Wohnungen erfassen',
			steps: [
				'Unter «Gebäude» erfassen Sie ein Gebäude mit Adresse, PLZ, Ort und Baujahr.',
				'Unter «Wohnungen» oder in der Detailansicht des Gebäudes fügen Sie die Wohnungen mit Wohnungsnummer, Stockwerk, Fläche und Zimmeranzahl hinzu.',
				'Die Fläche ist die Grundlage für Verteilschlüssel nach Fläche. Erfassen Sie sie deshalb genau.'
			]
		},
		{
			title: 'Mieter und Mietverträge verwalten',
			steps: [
				'Unter «Mieter» erfassen Sie die Mieter mit Kontaktdaten und Korrespondenzkanal (Brief oder E-Mail).',
				'Unter «Mietverträge» führt Sie «Mietvertrag erfassen» in fünf Schritten durch den Vertrag: Mieter, Wohnung, Vertragsdauer, Miete und Prüfen. Mit «Zurück» und «Weiter» wechseln Sie die Schritte, ohne Eingaben zu verlieren.',
				'Erst «Mietvertrag speichern» im letzten Schritt legt den Mietvertrag an. Bis dahin bleiben Ihre Eingaben als Entwurf in diesem Browser, bis Sie speichern, den Entwurf verwerfen oder sich abmelden.',
				'Endet ein Mietverhältnis, tragen Sie im Mietvertrag das Vertragsende ein. Danach gilt die Wohnung wieder als leer.'
			]
		},
		{
			title: 'Rechnungen erfassen',
			steps: [
				'Unter «Rechnungen» erfassen Sie jede Rechnung eines Rechnungsstellers mit Datum, Betrag und Gebäude.',
				'Jede Rechnung gehört zu einer Kategorie. Nur Rechnungen umlagefähiger Kategorien fliessen in die Nebenkostenabrechnungen ein.',
				'Kategorien, Verteilschlüssel und Heizprofile pflegen Sie unter «Kategorien», «Verteilschlüssel» und «Heizprofile», Vorgaben wie die Abrechnungsperiode unter «Einstellungen».'
			]
		},
		{
			title: 'Nebenkostenabrechnungen erstellen',
			steps: [
				'Unter «Nebenkostenabrechnungen» führt Sie «Abrechnungen erstellen» in fünf Schritten: Abrechnungsperiode, Gebäude, Heizprofil und Verwaltungspauschale, Vorschau und Erstellen.',
				'In der Vorschau prüfen Sie die Kosten: Dwello verteilt sie nach Verteilschlüssel und rechnet bei Mieterwechsel und Leerstand nach Mietstagen ab. Erst «Entwürfe erstellen» legt die Abrechnungen an.',
				'Die Abrechnungen liegen danach als Entwurf vor. Zahlungsfrist und Bemerkung können Sie anpassen; falsche Kosten korrigieren Sie, indem Sie die Abrechnungen neu erstellen.',
				'Dwello verschickt die Abrechnungen nicht selbst. Stellen Sie dem Mieter das PDF per Brief oder E-Mail zu und wählen Sie danach «Als versendet markieren». Ab diesem Tag läuft die Zahlungsfrist.'
			]
		},
		{
			title: 'Zahlungen und Mahnungen',
			steps: [
				'Überfällige Abrechnungen und anstehende Fristen zeigt Ihnen die «Übersicht».',
				'Geht eine Zahlung ein, wählen Sie in der Abrechnung «Als bezahlt markieren».',
				'Ist die Zahlungsfrist überschritten, lösen Sie mit «Mahnung senden» eine Zahlungserinnerung oder Mahnung aus. Sie geht je nach Korrespondenzkanal des Mieters per E-Mail oder als Brief.',
				'Briefe erscheinen unter «Dokumente». Dort markieren Sie sie nach dem Versand als versendet.'
			]
		}
	];
</script>

<svelte:head>
	<title>Hilfe - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title="Hilfe" purpose="Die wichtigsten Abläufe in Dwello Schritt für Schritt." />

	{#each sections as section (section.title)}
		<Panel title={section.title} testid="page-section">
			<ol class="flex list-decimal flex-col gap-2 pl-6 text-ink">
				{#each section.steps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</Panel>
	{/each}

	<Glossary />
</div>
