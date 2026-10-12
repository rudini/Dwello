// Plain-language explanations of the settings' domain terms, from UBIQUITOUS_LANGUAGE.md (docs/design/01-plan.md §7)
export const help = {
	heatingProfile:
		'Verteilt die Heizkosten in Prozent auf die 12 Monate. Zieht ein Mieter während der Abrechnungsperiode ein oder aus, werden seine Heizkosten so nach Monaten statt nach Tagen berechnet – im Winter wird mehr geheizt als im Sommer.',
	distributionKey:
		'Bestimmt, wie die Kosten eines Gebäudes auf die einzelnen Wohnungen aufgeteilt werden, zum Beispiel nach Fläche, nach Zimmern oder zu gleichen Teilen. Jede Rechnung hat einen Verteilschlüssel.',
	// TODO(fachlich prüfen): the glossary still says of the building's costs (offene-punkte.md)
	managementFee:
		'Abgeltung Ihres Aufwands für die Nebenkosten: ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Üblich sind bis 3 %.',
	accountingPeriod:
		'Zeitraum, für den Sie die Nebenkosten abrechnen, z. B. Kalenderjahr (01.01.–31.12.), Juli–Juni oder November–Oktober.'
};
