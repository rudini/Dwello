<script lang="ts">
	const sections = [
		{
			title: 'Gebäude und Wohnungen erfassen',
			steps: [
				'Unter «Gebäude» ein neues Gebäude mit Adresse, PLZ, Ort und Baujahr erfassen.',
				'In der Detailansicht des Gebäudes die Wohnungen mit Wohnungsnummer, Geschoss, Wohnfläche und Zimmeranzahl hinzufügen.',
				'Die Wohnfläche ist die Grundlage für flächenbasierte Verteilschlüssel und sollte deshalb genau sein.'
			]
		},
		{
			title: 'Mieter und Mietverträge verwalten',
			steps: [
				'Unter «Mieter» die Mieter mit Kontaktdaten erfassen und festlegen, ob sie Korrespondenz per E-Mail oder per Brief erhalten.',
				'Unter «Verträge» einen Mietvertrag mit Wohnung, Vertragsbeginn, Mietzins und Akontobeitrag erfassen.',
				'Endet ein Mietverhältnis, im Mietvertrag das Vertragsende eintragen. Die Wohnung gilt danach wieder als leer.'
			]
		},
		{
			title: 'Rechnungen erfassen',
			steps: [
				'Unter «Rechnungen» jede Rechnung eines Dienstleisters mit Rechnungssteller, Datum, Betrag und Gebäude erfassen.',
				'Jede Rechnung einer Nebenkostenkategorie zuordnen. Nur Rechnungen umlagefähiger Kategorien fliessen in die Abrechnungen ein.',
				'Kategorien, Verteilschlüssel und Heizprofile werden unter «Konfiguration» gepflegt.'
			]
		},
		{
			title: 'Nebenkostenabrechnungen erstellen',
			steps: [
				'Unter «Abrechnungen» → «Abrechnungen erstellen» Gebäude und Abrechnungsperiode wählen.',
				'Die Vorschau prüfen: Dwello verteilt die Kosten nach Verteilschlüssel und rechnet bei Mieterwechseln und Leerstand anteilig ab.',
				'Die erstellten Abrechnungen liegen als Entwurf vor. Vor dem Versand prüfen; Zahlungsfrist und Bemerkung lassen sich anpassen, falsche Kosten werden durch Neuerstellen korrigiert.'
			]
		},
		{
			title: 'Zahlungen und Mahnungen',
			steps: [
				'Nach dem Versand den Zahlungseingang in der Abrechnung festhalten.',
				'Für überfällige Abrechnungen eine Zahlungserinnerung oder Mahnung auslösen. Sie geht je nach Einstellung des Mieters per E-Mail oder als Brief.',
				'Briefe erscheinen unter «Dokumente» und werden dort nach dem Versand als versendet markiert.'
			]
		}
	];
</script>

<svelte:head>
	<title>Hilfe - Dwello</title>
</svelte:head>

<div class="space-y-6 max-w-3xl">
	<div>
		<h1 class="text-2xl font-bold text-gray-900" data-testid="page-title">Hilfe</h1>
		<p class="text-gray-500 mt-1">Die wichtigsten Abläufe in Dwello Schritt für Schritt</p>
	</div>

	{#each sections as section (section.title)}
		<section
			data-testid="page-section"
			class="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
		>
			<h2 class="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
			<ol class="list-decimal pl-5 space-y-2 text-gray-700">
				{#each section.steps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>
