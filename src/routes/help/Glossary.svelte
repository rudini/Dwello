<script lang="ts">
	import Panel from '$lib/ui/Panel.svelte';

	// Plain-language explanations derived from the definitions in UBIQUITOUS_LANGUAGE.md
	const terms = [
		{
			term: 'Abrechnungsperiode',
			text: 'Das Jahr, über das Sie die Nebenkosten abrechnen, zum Beispiel das Kalenderjahr oder Juli bis Juni. Das Rechnungsdatum bestimmt, in welche Abrechnungsperiode eine Rechnung fällt.'
		},
		{
			term: 'Akonto',
			text: 'Der monatliche Vorschuss des Mieters für die Nebenkosten. Die Nebenkostenabrechnung verrechnet ihn mit den tatsächlichen Kosten.'
		},
		{
			term: 'Nettomiete',
			text: 'Die monatliche Grundmiete ohne Nebenkosten, auch Mietzins genannt.'
		},
		{
			term: 'Zusatzmiete',
			text: 'Zusätzliche monatliche Miete, zum Beispiel für Garage, Parkplatz oder Keller.'
		},
		{
			term: 'Verteilschlüssel',
			text: 'Die Regel, nach der die Kosten eines Gebäudes auf die Wohnungen aufgeteilt werden, zum Beispiel nach Fläche, nach Zimmern oder gleich viel pro Wohnung.'
		},
		{
			term: 'Heizprofil',
			text: 'Verteilt die Heizkosten in Prozent auf die zwölf Monate. Wechselt der Mieter während der Abrechnungsperiode, teilt Dwello die Heizkosten so nach Monaten statt nach Tagen auf.'
		},
		{
			term: 'Verwaltungspauschale',
			// TODO(fachlich prüfen): the glossary still says of the building's costs, shared by a key (offene-punkte.md)
			text: 'Die Abgeltung Ihres Verwaltungsaufwands: ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Üblich sind bis 3 %. Den Satz wählen Sie beim Erstellen der Abrechnungen.'
		},
		{
			term: 'Mietstage',
			text: 'Die Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft. Zieht ein Mieter während des Jahres ein oder aus, bezahlt er nur den Anteil seiner Mietstage; Leerstand trägt der Vermieter.'
		},
		{
			term: 'Umlagefähig',
			text: 'Eine umlagefähige Rechnung fliesst in die Nebenkostenabrechnung ein, zum Beispiel Heizung, Wasser, Hauswart oder Kehricht. Ob eine Rechnung umlagefähig ist, folgt ihrer Kategorie und lässt sich pro Rechnung anpassen.'
		},
		{
			term: 'Saldo',
			text: 'Der Kostenanteil des Mieters samt Verwaltungspauschale minus seine geleisteten Akontobeiträge. Ist der Saldo positiv, zahlt der Mieter nach (Nachzahlung); ist er negativ, erhält er Geld zurück (Rückerstattung).'
		},
		{
			term: 'Zahlungsfrist',
			text: 'Das Datum, bis zu dem der Mieter die Abrechnung bezahlt haben muss.'
		},
		{
			term: 'Mahnung',
			text: 'Eine Zahlungsaufforderung, die Sie zu einer versendeten Abrechnung auslösen: zuerst eine Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung.'
		},
		{
			term: 'Korrespondenzkanal',
			text: 'Wie ein Mieter Post von Ihnen erhält: per Brief (Standard) oder per E-Mail. Für E-Mail braucht es eine E-Mail-Adresse.'
		},
		{
			term: 'Mietstatus',
			text: 'Zeigt, ob eine Wohnung vermietet ist: Vermietet (ein Mietvertrag läuft), Wiedervermietet (ein künftiger Mietvertrag ist abgeschlossen), Leer oder Gesperrt. Vermietet und Wiedervermietet ergeben sich aus den Mietverträgen; Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.'
		}
	];
</script>

<Panel title="Begriffe kurz erklärt" testid="page-section">
	<dl class="flex flex-col gap-4">
		{#each terms as { term, text } (term)}
			<div class="flex flex-col gap-1">
				<dt class="font-semibold text-ink">{term}</dt>
				<dd class="text-ink">{text}</dd>
			</div>
		{/each}
	</dl>
</Panel>
