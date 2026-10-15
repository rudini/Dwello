# Review #142, Runde 3 – Delta e9c6d53..45f3e87

Geprüft: `git diff e9c6d53..45f3e87` im Worktree `review-142-code3` (detached auf 45f3e87). Gelesen habe ich alle 13 geänderten Dateien:
- die drei Persona-Berichte der Runde 2 (`anna-`, `helga-`, `marco-issue-142-2.md`)
- `docs/reviews/issue-142-review-2.md` und `docs/reviews/workflow-rules-review-issue-142.md`
- `implementation_plan.md`
- die vier `messages/*.json`
- `src/routes/contracts/[id]/MissingStatement.svelte` und `src/__tests__/contract-detail-page.dom.test.ts`
- `tests/e2e/tasks/accessibility.ts`

Dazu habe ich gelesen: `src/lib/ui/Button.svelte`, `src/lib/ui/Alert.svelte` (Layout), `docs/design/i18n-begriffe.md` (Zeilen 51–54, 91) und `UBIQUITOUS_LANGUAGE.md` (Abschnitt Nebenkostenabrechnung).

Kein Blocker, kein Major.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-13 | Minor | `implementation_plan.md:20-25` | Der Fix bringt Texte, die keine Persona gesehen hat: die Knöpfe «2025 abrechnen» und den neuen Text für eine einzelne Periode (`contracts_statement_missing_text`). Die Persona-Berichte der Runde 2 zeigen noch die Knöpfe «2023» und den alten Satz. Helga und Marco schreiben unter «Nicht geprüft», dass sie die Einzahl nie gesehen haben. Workflow 6 verlangt einen weiteren Lauf, wenn ein Fix einen Text bringt, den die Persona nicht gesehen hat; im Plan steht dafür kein Punkt. Das betrifft auch das Layout: Bei Marco (390 px) waren die Knöpfe nur mit der Jahreszahl 117–121 px breit und standen zu zweit. Mit «abrechnen» passt vermutlich nur noch einer pro Zeile, und die Warnung wird wieder höher (Marco P-1). Eine Periode über den Jahreswechsel («01.07.2024 – 30.06.2025 abrechnen») bricht wahrscheinlich im Knopf um. Genau das war Marcos P-2 aus Runde 1. Beides habe ich nicht gemessen. |
| C-14 | Nit | `messages/fr.json:1292`, `messages/it.json:1292` | «Établir 2025» und «Allestire 2025» haben kein Objekt. Im Glossar steht «Établir les décomptes» bzw. «Allestire i conteggi» (`i18n-begriffe.md:91`). «Établir 2025» heisst wörtlich «2025 erstellen». Kurz und mit Objekt wäre z. B. «Décompter {period}» oder «Établir le décompte {period}». de («2025 abrechnen») und en («Bill 2025») sind klar. |

## Blocker/Major

Keine.

## Status der Befunde aus Runde 2

- **C-8, behoben.** Mehrere Perioden: Der sichtbare Text ist jetzt `contracts_statement_create` («{period} abrechnen», fr «Établir {period}», it «Allestire {period}», en «Bill {period}»). Das `ariaLabel` ist aus `MissingStatement.svelte` entfernt, also ist der sichtbare Text der zugängliche Name. `Button.svelte` setzt `aria-label` nur, wenn `ariaLabel` gesetzt ist. «abrechnen» als Verb kommt in `messages/de.json` auch sonst vor (z. B. `config_help_accounting_period`). Der DOM-Test prüft `['2025 abrechnen', '2023 abrechnen']` und die `href`. Die Prüfung auf `aria-label` ist entfernt, sie wird nicht mehr gebraucht. Bei nur einer Periode steht weiterhin «Abrechnungen erstellen». Zur Formulierung in fr/it siehe C-14.
- **C-9, behoben.** de: «… ; mit welcher Periode Sie beginnen, spielt keine Rolle.» fr: «vous pouvez commencer par n’importe quelle période», it: «può cominciare da qualsiasi periodo», en: «you can start with any period». Damit ist überall klar, dass die Perioden gemeint sind, und die Anrede bleibt formell. Ausserdem steht «Jede Schaltfläche öffnet … in dieser Periode» statt «Jede Periode öffnet» (Anna P-7, Helga P-6). Der DOM-Test prüft den ganzen deutschen Satz.
- **C-10, behoben.** `contracts_statement_missing_text` sagt jetzt in allen vier Sprachen, dass der Assistent die Abrechnungen für alle Mietverträge des Gebäudes erstellt und dass zuerst die Rechnungen der Periode erfasst werden. Der DOM-Test «meldet die fehlende Abrechnung …» prüft den neuen Satz.
- **C-11, behoben (Test red).** Der Plan nennt in der Zeile der Runde 2 die DOM-Tests «meldet die fehlende Abrechnung …» und «nennt mehrere fehlende Abrechnungen …». Beide waren mit den alten Texten und Knöpfen rot. Das stimmt aus dem Code: Die Tests prüfen mit `toContain` bzw. `toEqual` genau die neuen Texte, die es in e9c6d53 nicht gab. Den Teil von C-11 zur Persona-Runde haben die Läufe der Runde 2 erledigt. Für die Texte aus diesem Fix fehlt ein solcher Lauf noch, siehe C-13.
- **C-12, behoben.** Der Kommentar «the 2025 draft already bills …» steht in `tests/e2e/tasks/accessibility.ts:153` wieder direkt über `'end-dialog-refused'`, und `'missing-statements'` hat seinen eigenen Kommentar.

## Bestätigt

- **Vier Sprachen:** Alle drei geänderten Schlüssel sind in de/fr/it/en geändert. Fachbegriffe wie im Glossar: Nebenkostenabrechnung / décompte des charges / conteggio spese accessorie, Abrechnungsperiode / période de décompte / periodo di conteggio. In fr/it/en steht kein Deutsch.
- **Nichts Fremdes im Diff:** Der Code-Teil betrifft nur die Warnung. Die Doku-Dateien sind Berichte dieser Aufgabe.
- **Nichts Unbenutztes:** `contracts_statement_create` hat nur noch eine Verwendung, und die sichtbare Stelle nutzt sie. Die Prop `ariaLabel` von `Button` wird anderswo weiter gebraucht und war schon vorher da.
- **Kein seitliches Scrollen durch lange Knöpfe:** `Button` hat kein `whitespace-nowrap`, und der Inhalt der Warnung hat `min-w-0` (`Alert.svelte:30`). Ein langer Knopftext bricht also um, statt über den Rand zu laufen. Ob das gut aussieht, siehe C-13.
- **Formatierung:** Prettier meldet auf `MissingStatement.svelte`, dem DOM-Test und `tests/e2e/tasks/accessibility.ts` keine Abweichung.
- **Selbst wiederholt:** `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts` ergibt 37 passed.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** lint 0, check 0, `deepcheck:audit` still, fallow sauber, `test:coverage` 2434 passed, E2E contract-detail chromium + api 28 passed, axe- und Sprachzeilen von contract-detail 14 passed.
- **Rot der Tests aus C-11:** Nur aus dem Code geschlossen (neue Texte gegen die alten Nachrichten). Ich habe es nicht ausgeführt, weil ich keine Datei ändern darf.
- **Layout der Knöpfe mit Verb bei 390 px:** Ob ein Knopf pro Zeile steht, wie hoch die Warnung wird und wie eine Periode über den Jahreswechsel umbricht, habe ich nicht gesehen. Ein Build oder E2E-Lauf war nicht erlaubt. Die axe-Läufe decken nur Kalenderjahre ab (C-13).
- **Einzahl-Zustand in axe:** Wie in Runde 2 besucht kein a11y-Eintrag die Warnung mit nur einer fehlenden Periode. Ihr Text hat sich geändert, ihr Markup nicht.
