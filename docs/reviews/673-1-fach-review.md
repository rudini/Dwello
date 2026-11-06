# Fach-Review #673, Runde 1 (Szenarien und Texte vor der Umsetzung)

Gegenstand: `@wip`-Szenarien in b89b921 (Branch `w-673`), Textvorschläge aus `w673-handback1.md`, Entscheid «Decided (product owner)» vom 2026-11-06 in #673.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der leere Zustand der Liste bietet «Filter zurücksetzen» weiter mit `href="/statements"` an und entfernt damit Mietvertrag und Periode; das widerspricht dem Entscheid zu Marco P-4. `statement-pages.dom.test.ts:155` hält das alte Verhalten fest. |
| V-2 | Verwalter | Minor | Szenarien decken zwei entschiedene Regeln nicht: der Statussatz bei einem Mietvertragsfilter (nur «Entwurf» mit Periode ist geprüft, also auch ein fest verdrahtetes «Entwurf» wäre grün) und «Periode bleibt beim Zurücksetzen / kein Zurücksetzen nur mit Periode». Fix: ein Szenario «Abrechnungen eines Mietvertrags mit Status Erledigt» (Satz nennt «Erledigt») und eines nach «Entwürfe ansehen» + Suche + Zurücksetzen (Satz nennt weiter die Abrechnungsperiode), oder je ein Test in `statement-pages.dom.test.ts` / `+page.server.ts`. |
| V-3 | Verwalter | Minor | `statements_scope_status` darf nur einen bekannten Status nennen: eine von Hand gebaute Adresse (`?status=xyz&periodStart=…`) ergäbe «undefined» im Satz. Fix: wie `isDate` nur Werte aus `statusLabels` benennen, sonst kein Statussatz. |

## V-1

- **Beleg:** `src/routes/statements/+page.svelte:176-183` (EmptyState mit `actionLabel={m.buildings_reset_filters()}`, `actionHref="/statements"`, gezeigt bei `filtered`, das Mietvertrag und Periode einschliesst: `StatementSearch.svelte:28-30` dieselbe Logik). DOM-Test `src/__tests__/statement-pages.dom.test.ts:155-164` («bietet bei einem Mietvertrag ohne Abrechnungen «Filter zurücksetzen» an», erwartet `/statements`).
- **Warum falsch:** Der Entscheid lautet ohne Ausnahme: «Filter zurücksetzen removes only search, building and status; the contract and the billing period stay. It shows only while search, building or status is set.» Dieselbe Beschriftung täte sonst auf derselben Seite zweierlei (Marco P-4 ist genau dieser Doppelsinn). Die Nebenfrage im Handback («leerer Zustand gleich lassen») widerspricht dem Entscheid.
- **Fix:** Der leere Zustand nimmt dieselbe Zurücksetzen-Adresse wie das Suchformular (nur `contract`, `periodStart`, `periodEnd` behalten) und dieselbe Bedingung. Ist nur Mietvertrag oder Periode gesetzt, zeigt er statt «Filter zurücksetzen» `statements_scope_all` («Alle Abrechnungen anzeigen», `/statements`) oder keine Aktion, weil der Satz darüber den Link schon hat. Den DOM-Test 155 entsprechend umschreiben (zuerst rot), dazu ein `@wip`-Szenario: Mietvertrag + Suche ohne Treffer, «Filter zurücksetzen» im leeren Zustand, der Satz nennt weiter den Mietvertrag. Hält der Implementer am alten Verhalten fest, ist das eine Produktentscheidung (`needs-decision` in #673).

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_scope_period_building | Sie sehen die Abrechnungen der Abrechnungsperiode {start} – {end} im Gebäude {building}. | Vous voyez les décomptes de la période de décompte {start} – {end} de l’immeuble {building}. | Vede i conteggi del periodo di conteggio {start} – {end} dell’immobile {building}. | You are seeing the statements of the billing period {start} – {end} in the building {building}. |
| statements_scope_status | Es werden nur Abrechnungen mit dem Status «{status}» gezeigt. | Seuls les décomptes au statut « {status} » sont affichés. | Sono mostrati solo i conteggi con lo stato «{status}». | Only statements with the status «{status}» are shown. |
| statements_scope_contract_link | Zum Mietvertrag | Vers le contrat de bail | Al contratto di locazione | Go to the rental contract |
| statements_filter_clear | Filter aufheben | Retirer le filtre | Rimuovere il filtro | Remove filter |

## Nicht bestätigt

- Ob die Schrittanzeige nach dem Verkleinern auf 960 px ohne neues Laden umbricht (Helga P-6): nur aus dem Szenario gelesen, nicht ausgeführt.
- `marco-b2.md` fehlt in der Git-Historie (wie im Handback); die Marco-Befunde habe ich aus dem Issue-Text und dem Handback genommen.

Geprüft: alle sieben Szenarien gegen den Entscheid (P-2, P-3, P-4, P-5, P-6, P-7) und gegen `UBIQUITOUS_LANGUAGE.md` (Liegenschaftsverwalter, Mietvertrag, Abrechnungsperiode, Gebäude, Entwurf, Abrechnungsstatus), Schweizer Schreibweise; Texte gegen `statements_scope_*`, `statusLabels` (`src/lib/statement.ts:10`), `contracts_overlap_link`/`contracts_open_contract_link` und `i18n-begriffe.md` (immeuble/immobile, période de décompte/periodo di conteggio, contrat de bail/contratto di locazione); die `toContain`-Prüfungen `statements.steps.ts:174,185,193` («Mietvertrags von X, Wohnung Y», «Abrechnungsperiode …») halten mit den neuen Sätzen. Hinweis: `statement-pages.dom.test.ts:106` nimmt den ersten Link im Satz; «Zum Mietvertrag» gehört deshalb nach «Alle Abrechnungen anzeigen» oder der Test wählt per testid. Mietrecht und Rechtstexte sind nicht berührt.
