# Fachreview #664, Schritt 1, Runde 1 (Punkte 1, 2, 4)

Gegenstand: `git diff 7c56711 a19a8b7 -- tests/e2e/features` (Worktree `review-664-1-fach`, a19a8b7) und `w664-proposed-texts.md`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht / Verwalter | Major | Der Auszugshinweis erscheint auch bei einem abgelaufenen befristeten Mietvertrag, dessen Auszug nicht bestätigt ist. Dwello fragt dort gleichzeitig, ob der Mieter noch in der Wohnung wohnt (Art. 266 Abs. 2 OR), und bietet trotzdem schon «Schlussabrechnung fällig» mit dem Link «Schlussabrechnung erstellen» an. |
| V-1 | Verwalter | Minor | «Auszug am {date}» zeigt das Vertragsende, nicht den Tag, an dem der Mieter tatsächlich ausgezogen ist oder die Wohnung zurückgegeben hat. «Auszug» als Datum fehlt im Glossar (es kennt nur «Auszug bestätigt», Z. 42). Fix: Den Begriff im Glossar festhalten (Vorschlag unten). |
| V-2 | Verwalter | Minor | Kann die Abrechnungsperiode nur ausserhalb von Dwello abgerechnet werden (`outside`, `statement-run.service.ts:129`), zeigt die Wohnungsliste «Schlussabrechnung fällig» ohne Link und ohne Hinweis darauf. Das liest sich so, als ob Dwello die Abrechnung erstellen könnte. Fix: eigener Text für diesen Fall (Tabelle unten). |
| V-3 | Verwalter | Minor | Punkt 4 benennt den abgelehnten Entwurf nach Mieter und Periode, aber `contracts_billed_draft_covered` und `contracts_delete_draft_covered_consequence` (`messages/de.json:1937-1938`) nennen ihn weiterhin nur mit `{number}`. Damit benennen zwei Ablehnungen desselben Entwurfs ihn unterschiedlich. Fix: In beiden Texten «Der Entwurf für {name}, {period}» schreiben, in fr/it/en entsprechend. |
| V-4 | Verwalter | Minor | Die Szenarien prüfen nur Gebäude mit Kalenderjahr. Kein Beispiel deckt die Periode Juli bis Juni ab (Vertragsende 30.06.2026 ergibt «nach dem 30.06.2026»), und keines den Fall «Abgerechnet bis», in dem kein Hinweis erscheint. Fix: je eine Examples-Zeile oder ein Szenario. |

## M-1

**Beleg:** Laut der Regel in `w664-proposed-texts.md` §2 erscheint der Hinweis beim «latest contract whose Vertragsende is today or earlier». Eine Ausnahme für den ungeklärten befristeten Vertrag gibt es nicht. `backend/src/services/contract.service.ts:285-293` (`fixedTermCheck`) liefert genau für diesen Fall `true`: nicht gekündigt, nicht `movedOut`, Vertragsende vergangen, kein späterer Vertrag. Die Vertragsseite zeigt dann `FixedTermCheck` (`src/routes/contracts/[id]/+page.svelte:151`) mit «Der befristete Mietvertrag von {name} ist am {date} abgelaufen. Wohnt {name} noch in der Wohnung …» (`messages/de.json:2010`). Nach der vorgeschlagenen Regel stünde direkt darunter «Auszug am …, Schlussabrechnung fällig» mit dem Link in den Assistenten.

OR Art. 266 Abs. 2 (Fedlex, Stand 01.10.2026): «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.» Das Glossar übernimmt das unter «Befristet / Unbefristet» und «Auszug bestätigt».

**Warum falsch:** Ob der Mieter ausgezogen ist, ist in diesem Fall offen, und Dwello stellt die Frage selbst. Der Hinweis behauptet einen Auszug und schickt den Vermieter zur Schlussabrechnung. Wohnt der Mieter noch dort, ist der Vertrag unbefristet und die erstellte Schlussabrechnung falsch: Sie rechnet nur bis zum Vertragsende ab. Danach sperrt sie das Weiterführen (`contracts_continue_locked_rest`, `messages/de.json:2019`), bis sie berichtigt ist.

**Fix:** Die Regel nennt den Auszug nur, wenn `fixedTermCheck` nicht zutrifft, also erst nach «Auszug bestätigt», nach einer Kündigung oder mit einem Nachmieter. Das gilt in der Wohnungsliste und auf der Vertragsseite. Dazu ein `@wip`-Szenario, zum Beispiel:

```gherkin
Szenario: Der abgelaufene befristete Mietvertrag nennt den Auszug erst nach der Bestätigung
  Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
  Und der Mieter "Sarah Meier" existiert
  Und "Sarah Meier" mietete die Wohnung "2.02" befristet von "2021-08-01" bis "2025-06-30" für "1200" Franken
  Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Sarah Meier"
  Dann nennt der Mietvertrag keinen Auszug
  Wenn der Liegenschaftsverwalter den Auszug bestätigt
  Dann nennt der Mietvertrag den Auszug "Auszug am 30.06.2025, Schlussabrechnung fällig"
```

(Ob die bestehende Vorbedingung «mietete … von … bis» befristet oder gekündigt anlegt, habe ich nicht geprüft; siehe «Nicht bestätigt».)

## Texte

| key | de | fr | it | en |
|-----|----|----|----|----|
| apartments_move_out_due_outside | Auszug am {date}, Schlussabrechnung ausserhalb von Dwello fällig | Départ le {date}, décompte final à établir en dehors de Dwello | Trasloco il {date}, conteggio finale da allestire al di fuori di Dwello | Move-out on {date}, final statement due outside Dwello |
| contracts_billed_draft_covered | Der Entwurf für {name}, {period} rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen. Löschen Sie den Entwurf. Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung. | Le brouillon pour {name}, {period} décompte des jours que vous indiquez maintenant comme décomptés en dehors de Dwello. Supprimez le brouillon. Pour ce contrat de bail, Dwello n’établit pas de décompte pour cette période de décompte. | La bozza per {name}, {period} conteggia giorni che ora indica come conteggiati al di fuori di Dwello. Elimini la bozza. Per questo contratto di locazione Dwello non allestisce alcun conteggio per questo periodo di conteggio. | The draft for {name}, {period} bills days that you now enter as billed outside Dwello. Delete the draft. Dwello creates no statement for this rental contract in this billing period. |
| contracts_delete_draft_covered_consequence | Der Entwurf für {name}, {period} wird gelöscht. Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung. | Le brouillon pour {name}, {period} sera supprimé. Pour ce contrat de bail, Dwello n’établit pas de décompte pour cette période de décompte. | La bozza per {name}, {period} viene eliminata. Per questo contratto di locazione Dwello non allestisce alcun conteggio per questo periodo di conteggio. | The draft for {name}, {period} will be deleted. Dwello creates no statement for this rental contract in this billing period. |

## Fehlender Begriff (Issue, Labels `domain`, `needs-decision`)

**Auszug (Hinweis):** Das Vertragsende eines beendeten Mietvertrags, solange seine Schlussabrechnung aussteht. Bis zum Ende der Abrechnungsperiode des Vertragsendes lautet der Hinweis «Auszug am {Vertragsende}, Schlussabrechnung nach dem {Periodenende}», danach, solange die Schlussabrechnung fehlt, «Auszug am {Vertragsende}, Schlussabrechnung fällig». Bei einem abgelaufenen befristeten Mietvertrag erscheint er erst nach «Auszug bestätigt». Der tatsächliche Auszug oder die Rückgabe der Wohnung kann von diesem Tag abweichen. fr «départ», it «trasloco», en «move-out».

## Nicht bestätigt

- Ob die Vorbedingung «"…" mietete die Wohnung … von … bis …» einen gekündigten oder einen befristeten Vertrag anlegt. Bei einem befristeten Vertrag ohne «Auszug bestätigt» würden die Szenarien «fällig» und «Vom Auszug zur Schlussabrechnung» gerade den Fall aus M-1 festschreiben. Die Step-Definition in `tests/e2e/steps/contracts.steps.ts` habe ich nicht gelesen.
- Ob `MissingStatement.svelte` den Fall `outside` auf der Vertragsseite schon mit einem eigenen Text erklärt (bezieht sich auf V-2; nicht gelesen).
- «fällig» unmittelbar nach dem Ende der Periode: Das Gesetz kennt keine Frist innerhalb des Jahres. VMWG Art. 4 Abs. 1 (Fedlex, Stand 01.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Der Product Owner hat «fällig» entschieden; ich melde es deshalb nicht als Befund.

Geprüft: Die Regel deckt sich mit dem Glossar zu «Schlussabrechnung» (Z. 193, Periode, die das Vertragsende einschliesst), «Hinweis auf fehlende Abrechnungen» und «Abgerechnet bis» (Z. 50-51) sowie mit `missingPeriods` (`accounting-period.ts:44`): Ein Entwurf zählt, eine ersetzte Abrechnung nicht. Nachgerechnet: Vertragsende 30.06.2026 im Kalenderjahr ergibt «nach dem 31.12.2026» bis zum 31.12., ab dem 01.01.2027 ohne Abrechnung «fällig». Vertragsende 31.12.2025, heute 05.11.2026, ergibt «fällig». Vertragsende 01.07.2026 bei Juli bis Juni ergibt die Periode 01.07.2026–30.06.2027. Weiter geprüft: {period} wie `periodName` («2025», sonst zwei Daten), «Enddatum erfassen» in allen vier Sprachen samt den fünf zitierenden Texten, die Begriffe décompte final / conteggio finale / final statement und brouillon / bozza / draft laut `i18n-begriffe.md` Z. 109 und 113, «Leer seit 01.07.2025» nach dem Vertragsende 30.06.2025, «Vermietet» mit Nachmieter ab morgen.
