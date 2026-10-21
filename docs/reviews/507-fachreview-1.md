# Fachreview #507, Runde 1 (575416f gegen b871708)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| – | – | – | Keine Blocker, Major oder Minor. |

Geprüft: Die vier Schlüssel `statements_part_{line,no_period,beyond,stock}_profile` in de/fr/it/en. Sie verwenden den Glossarbegriff «Anteil nach Heizprofil» (UBIQUITOUS_LANGUAGE.md:148) und die Übersetzungen aus i18n-begriffe.md:70 (profil de chauffage / profilo di riscaldamento / heating profile). Der Wortlaut stimmt mit `partProfileRun` im PDF überein (pdf.service.ts:108, 227, 346, 465), jeweils ohne den Verweis «(siehe Heiz- und Warmwasserkosten)». In jedem PDF-Zweig steht der Prozentwert als letzter Wert der Zeile (`partProfile`: «Anteil nach Heizprofil: {tenant} % / {period} % = {percent} %»; `partProfileRun`: «{percent} %»), beide mit `toFixed(2)`. Die Seite zeigt dasselbe `part.profile.percent.toFixed(2)`, und genau dieser Wert steht als Faktor in «Ihr Anteil». Ein Verwalter kann also Rechnung für Rechnung mit dem PDF vergleichen. Die Monate erklären den Wert, braucht es zum Vergleich aber nicht, und das Issue verlangt nur den Prozentwert.

Geprüft: Den Rückfall auf Tage. Fallen auf die Tage einer Rechnung im Heizprofil zusammen 0 %, liefert `byProfile` den Teil ohne `profile` (calculation.service.ts:175). Seite und PDF nennen dann beide «Ihre Mietstage». Das deckt sich mit dem Glossar (Zeitanteil, UBIQUITOUS_LANGUAGE.md:187).

Geprüft: Die Werte im Szenario statement-detail.feature (#507). Marc Huber mietet ab Mai. Für die Rechnung Januar bis März liegen keine seiner Monate in ihrem Zeitraum, also 0.00 %. Für die Rechnung ohne Leistungszeitraum gelten 52.00 %. Beide Werte stimmen mit dem bestehenden Szenario #451 (P-1) im selben Datenbestand überein: «2’000.00 × (1’000.00 × 0.00 % + 1’000.00 × 52.00 %) / 2’000.00 = 520.00». Die DOM-Tests decken alle vier Zweige ab: Leistungszeitraum, ohne Leistungszeitraum, Rechnung über die Periode hinaus und Veränderung des Tankbestands. Jeder prüft zusätzlich, dass «Mietstage» nicht mehr vorkommt.

Mietrecht: Die Detailseite ist eine Ansicht für den Verwalter, die Mieterin erhält das PDF. Was die Mieterin erhält, ändert sich nicht. Deshalb gibt es hier keine Pflicht aus OR 257b / VMWG 4 zu prüfen.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Die DOM-Tests und das Szenario habe ich nicht ausgeführt. Das Worktree hat kein `node_modules`, und auf das des Hauptbaums besteht eine Sperrregel. Bewertet habe ich nur, was die Tests prüfen.
- Den Wert 52.00 % aus dem Heizprofil «Winter» habe ich nicht selbst nachgerechnet. Er stammt aus dem bestehenden Szenario #451 (statement-detail.feature, Szenario «Kostenposition rechnet Heizkosten nach Heizprofil …»), das schon vor dieser Änderung grün war.
