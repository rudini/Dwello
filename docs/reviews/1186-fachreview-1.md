# Fach-Review #1186, Runde 1 (Schritt 1, vor der Umsetzung)

Worktree: `review-1186-fach`, Commit 16e3160 (`docs(tests): scenarios for the chosen status`).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | «Keine Abrechnung hat den Status «{status}».» ist falsch, sobald Suche, Gebäude, Mietvertrag oder Periode gesetzt sind, und genau diesen Fall pinnt das zweite Szenario (Gebäude «Ahornhof») |
| V-2 | Verwalter | Minor | Der Satz unter den Statusfeldern muss die Gesamtzahl der Liste (`data.total`) nennen, nicht `statusCounts[status]`: `?status=replaced` hat kein Statusfeld und keine Zählung (`+page.server.ts:112-118`). Fix: Zahl aus `total` nehmen |
| V-3 | Verwalter | Minor | Wenn das Laden scheitert, liefert `+page.server.ts:120-135` eine leere Liste mit Zählungen 0. Mit einem gewählten Status hiesse es dann «… zeigt keine Abrechnung mit dem Status …», obwohl nur das Laden scheiterte. Das gab es schon vorher («Keine Abrechnungen gefunden»), der neue Satz behauptet aber mehr. Fix: Im Fehlerfall den Satz weglassen (oder ein eigenes Issue) |

## V-1 (Major)

**Beleg:** `tests/e2e/features/statements.feature:193-197`. Dort wählt der Liegenschaftsverwalter «Überfällig» im Gebäude «Ahornhof», und erwartet wird «Keine Abrechnung hat den Status «Überfällig».» Laut `src/routes/statements/+page.server.ts:82-84` zählen die Statusfelder mit denselben Filtern wie die Liste («all but the status itself»). Die 0 gilt also nur für die aktuelle Auswahl.

**Warum falsch:** Hat ein anderes Gebäude überfällige Abrechnungen, behauptet der Satz etwas Falsches: Es gibt durchaus überfällige Abrechnungen, nur nicht in diesem Gebäude. Ein Vermieter mit wenig Erfahrung kann daraus schliessen, dass keine Zahlung mehr offen ist, und mahnt nicht. Dasselbe gilt mit Suche, Mietvertrag oder Abrechnungsperiode.

**Fix:** Ein Text, der in jedem Fall stimmt, weil er von der Liste spricht und nicht von allen Abrechnungen. Unter den Statusfeldern: «Die Liste unten zeigt keine Abrechnung mit dem Status «{status}».» Er ist gleich gebaut wie _one/_many. In der leeren Liste: «Die Liste enthält keine Abrechnung mit dem Status «{status}».» Dazu kommt, was zu tun ist, mit den Wörtern des Buttons «Filter zurücksetzen» (Tabelle unten). Eine eigene Variante je nach Filter braucht es damit nicht.

Szenario anpassen (es ist neu und `@wip`, also ohne Freigabe änderbar):
- Z. 189: `# #1186: ein Status ohne Abrechnungen in der Liste sagt das unter den Statusfiltern und in der leeren Liste, nicht «Filter anpassen»`
- Z. 191: `Szenariogrundriss: Bei einem Status ohne Abrechnungen sagt die Liste, dass sie keine mit diesem Status zeigt`
- Z. 194: `Dann steht unter den Statusfiltern "Die Liste unten zeigt keine Abrechnung mit dem Status «Überfällig»."`
- Z. 197: `Und sagt die leere Abrechnungsliste "Die Liste enthält keine Abrechnung mit dem Status «Überfällig»."`

## Texte

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_status_shown_one | Die Liste unten zeigt 1 Abrechnung mit dem Status «{status}». | La liste ci-dessous affiche 1 décompte au statut « {status} ». | La lista qui sotto mostra 1 conteggio con lo stato «{status}». | The list below shows 1 statement with the status «{status}». |
| statements_status_shown_many | Die Liste unten zeigt {count} Abrechnungen mit dem Status «{status}». | La liste ci-dessous affiche {count} décomptes au statut « {status} ». | La lista qui sotto mostra {count} conteggi con lo stato «{status}». | The list below shows {count} statements with the status «{status}». |
| statements_status_shown_none | Die Liste unten zeigt keine Abrechnung mit dem Status «{status}». | La liste ci-dessous n’affiche aucun décompte au statut « {status} ». | La lista qui sotto non mostra alcun conteggio con lo stato «{status}». | The list below shows no statements with the status «{status}». |
| statements_count_status_one | 1 Abrechnung mit dem Status «{status}» | 1 décompte au statut « {status} » | 1 conteggio con lo stato «{status}» | 1 statement with the status «{status}» |
| statements_count_status_many | {count} Abrechnungen mit dem Status «{status}» | {count} décomptes au statut « {status} » | {count} conteggi con lo stato «{status}» | {count} statements with the status «{status}» |
| statements_count_status_page_one | Abrechnung {from} von {total} mit dem Status «{status}», Seite {page} von {pages} | Décompte {from} sur {total} au statut « {status} », page {page} sur {pages} | Conteggio {from} di {total} con lo stato «{status}», pagina {page} di {pages} | Statement {from} of {total} with the status «{status}», page {page} of {pages} |
| statements_count_status_page_many | Abrechnungen {from}–{to} von {total} mit dem Status «{status}», Seite {page} von {pages} | Décomptes {from}–{to} sur {total} au statut « {status} », page {page} sur {pages} | Conteggi {from}–{to} di {total} con lo stato «{status}», pagina {page} di {pages} | Statements {from}–{to} of {total} with the status «{status}», page {page} of {pages} |
| statements_none_with_status | Die Liste enthält keine Abrechnung mit dem Status «{status}». Wählen Sie einen anderen Status oder setzen Sie die Filter zurück. | La liste ne contient aucun décompte au statut « {status} ». Choisissez un autre statut ou réinitialisez les filtres. | La lista non contiene alcun conteggio con lo stato «{status}». Scelga un altro stato o reimposti i filtri. | The list contains no statements with the status «{status}». Choose another status or reset the filters. |

Im Französischen steht innerhalb der Guillemets ein geschütztes Leerzeichen U+00A0, wie in `statements_scope_status` (fr.json, geprüft mit `od -c`). In Italienisch, Deutsch und Englisch stehen «» ohne Leerzeichen, wie im bestehenden en.json. `{status}` sind die Bezeichnungen aus `statusLabels` (fr: Brouillon/Envoyé/Payé/Clôturé/En retard/Remplacé, männlich passend zu «décompte»; it: Bozza/Inviato/…, als Bezeichnung in Guillemets, passend zu «conteggio»). Die Verben am Schluss von `statements_none_with_status` nehmen den Button `buildings_reset_filters` auf (Filter zurücksetzen / Réinitialiser les filtres / Reimpostare i filtri / Reset filters).

## Nicht bestätigt

- Keine Gesetzesnorm betroffen: Liste und Filter regeln OR/VMWG nicht, daher kein Fedlex-Zitat.
- Ob die neuen Texte neben dem bestehenden Satz `statements_scope_status` (bei Mietvertrag oder Periode) ohne Widerspruch stehen: In den Texten widersprechen sie sich nicht. Gesehen habe ich sie auf keinem Bildschirm. Gelesen: `StatusFilter.svelte`, `+page.svelte:150-205`.

Geprüft: Abrechnungsstatus und Bezeichnungen (UBIQUITOUS_LANGUAGE.md «Abrechnungsstatus», «Versendet» ohne Überfällige laut `statement.service.ts:107-117`), fr/it/en-Begriffe (i18n-begriffe.md Z. 5, 80-81, 96, 107), die Zahlen in Liste und Statusfeldern (`+page.server.ts:82-84`), die Schritte des ersten Szenarios (lesen sich gut, Text stimmt) und die Schritte des zweiten Szenarios ausser den Texten von V-1.
