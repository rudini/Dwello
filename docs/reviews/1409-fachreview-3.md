# Fach-Review #1409 Jahresbericht, Runde 3 (Wortlaut zu V-13 Option 2; Vorbericht `1409-fachreview-2.md`)

Geschlossen: V-12 (PO: B), V-13 (PO: Option 2).

Entfällt gegenüber Runde 2: `analytics_income_management_fee` (keine Zeile Verwaltungspauschale). Alle anderen Schlüssel der Texttabelle aus Runde 2 bleiben unverändert, auch `analytics_utility_help`, `analytics_utility_notes` und `analytics_utility_outside`. Keiner davon nennt die Verwaltungspauschale.

| key | de | fr | it | en |
|---|---|---|---|---|
| analytics_income_help | Das sind die Beträge, die die Mietverträge für dieses Jahr vereinbaren; angebrochene Monate zählen nach Tagen. Dwello prüft nicht, ob die Mieter sie bezahlt haben: Vergleichen Sie sie mit Ihren Kontoauszügen. Akontobeiträge, Nachzahlungen und Rückerstattungen sind nicht enthalten: Sie decken die Nebenkosten, die die Mieter tragen, und diese zeigt der Bericht nicht. Auch die Verwaltungspauschale ist nicht enthalten: Sie steht in den Nebenkostenabrechnungen, nicht als fester Betrag im Mietvertrag. Haben Sie die Nettomiete, die Zusatzmiete oder die Nebenkostenpauschale geändert, rechnet Dwello für das ganze Jahr mit dem heutigen Betrag. | Ce sont les montants que les contrats de bail prévoient pour cette année ; les mois entamés comptent au prorata des jours. Dwello ne vérifie pas si les locataires les ont payés : comparez-les avec vos relevés de compte. Les acomptes, les montants à payer et les remboursements ne sont pas inclus : ils couvrent les frais accessoires à la charge des locataires, que le rapport ne montre pas. Les frais d’administration ne sont pas inclus non plus : ils figurent dans les décomptes de frais accessoires, et non comme montant fixe dans le contrat de bail. Si vous avez modifié le loyer net, le loyer supplémentaire ou le forfait de frais accessoires, Dwello calcule toute l’année avec le montant actuel. | Sono gli importi che i contratti di locazione pattuiscono per quest’anno; i mesi iniziati contano in proporzione ai giorni. Dwello non verifica se gli inquilini li hanno pagati: li confronti con i suoi estratti conto. Gli acconti, gli importi dovuti e i rimborsi non sono compresi: coprono le spese accessorie a carico degli inquilini, che il rapporto non mostra. Nemmeno le spese amministrative sono comprese: figurano nei conteggi delle spese accessorie, non come importo fisso nel contratto di locazione. Se ha modificato la pigione netta, la pigione supplementare o il forfait per le spese accessorie, Dwello calcola tutto l’anno con l’importo attuale. | These are the amounts the rental contracts agree for this year; part months count by days. Dwello does not check whether the tenants have paid them: compare them with your bank statements. Advance payments, amounts due and refunds are not included: they cover the utility costs the tenants bear, which the report does not show. The management fee is not included either: it is on the utility cost statements, not a fixed amount in the rental contract. If you have changed the net rent, the additional rent or the flat-rate utility charge, Dwello uses today’s amount for the whole year. |
| analytics_utility_none | Für die Abrechnungsperiode {period} gibt es noch keine Abrechnungen. Ihr Anteil an den Nebenkosten ist deshalb nicht enthalten. Erstellen Sie die Abrechnungen und öffnen Sie den Bericht dann erneut. | Il n’y a pas encore de décomptes pour la période de décompte {period}. Votre part des frais accessoires n’est donc pas incluse. Établissez les décomptes, puis ouvrez à nouveau le rapport. | Per il periodo di conteggio {period} non ci sono ancora conteggi. La sua quota delle spese accessorie non è quindi compresa. Allestisca i conteggi e poi apra di nuovo il rapporto. | There are no statements yet for the billing period {period}. Your share of the utility costs is therefore not included. Create the statements, then open the report again. |

## Szenario, Mietertrag (Option 2)

```
      | Position             | Betrag        |
      | Nettomiete           | CHF 29’800.00 |
      | Zusatzmiete          | CHF 0.00      |
      | Nebenkostenpauschale | CHF 475.81    |
      | Total Mietertrag     | CHF 30’275.81 |
```
Nachgerechnet: 29’800.00 + 0.00 + 475.81 = 30’275.81. Die CSV zeigt `Total Mietertrag | 30275.81`, das PDF «Total Mietertrag CHF 30’275.81».

In der Grundlage aus Runde 2 genügt jetzt «Und für "Anna Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025» ohne «mit 3 % Verwaltungspauschale». Mit Pauschale bleiben die Kosten gleich, denn die Kostenabstimmung rechnet ohne Verwaltungspauschale. Dann prüft der Bericht aber zusätzlich, dass die 45.60 nicht im Mietertrag erscheinen. Beides ist fachlich richtig, die Pauschale bleibt als Negativprobe sinnvoll. Die Kostentabelle (Total ohne wertvermehrende Investitionen 1’841.64) ist unverändert.

## Nicht bestätigt

Nichts Neues. Die steuerliche Einordnung von Akontobeiträgen und Verwaltungspauschale bleibt wie in Runde 2 offen (kantonale Wegleitungen nicht abrufbar).
