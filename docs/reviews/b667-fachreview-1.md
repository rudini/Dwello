# Fach-Review #667, Schritt 1, Runde 1

Gegenstand: die sechs @wip-Szenarien in 0d2ab21 (`contract-new.feature`, `contract-edit.feature`) und der geplante Entwurf, Punkte 1 bis 7. Worktree `review-b667-fach`, detached bei 0d2ab21. Recht: OR, Fedlex, Fassung vom 1. Oktober 2026 (dateApplicability 2026-10-01).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Plan 7: `contracts_overlap_wizard` bleibt unverändert. Damit bleibt der falsche Rat aus W-04 genau dort stehen, wo er am häufigsten erscheint: bei der Prüfung im Assistenten, wenn die Mietverträge geladen sind. |
| V-2 | Verwalter | Major | Plan 2: Bekommt `backend_contract_overlap` den Platzhalter {period}, zeigt die Seite des Mietvertrags bei «Enddatum erfassen» eine kaputte Ablehnung, denn {period} fehlt in den Params des Backends. |
| M-1 | Mietrecht | Major | Plan 3(a): «Wählen Sie «Befristet» …» ist im Bearbeitungsformular und für einen eingegebenen Zeitraum mit Vertragsende der falsche Rat. Einen gekündigten oder bisher unbefristeten Mietvertrag macht man nicht zu einem befristeten. |
| M-2 | Mietrecht | Minor | Plan 3(c): «Erfassen Sie zuerst … das Vertragsende» lädt dazu ein, ein Ende zu erfassen, das es nicht gibt. Ein unbefristeter Mietvertrag endet nur durch Kündigung (Art. 266a Abs. 1 OR) oder durch Vereinbarung. Fix: als Bedingung formulieren und die Schaltfläche nennen (Wortlaut unten). |
| V-3 | Verwalter | Minor | `backend/src/services/contract.service.ts:241-245`: `.limit(1)` ohne `orderBy`. Überschneidet der Zeitraum zwei Mietverträge, ist zufällig, welcher genannt wird und welcher Rat erscheint. Das kann auch das Szenario instabil machen. Fix: `orderBy(rentalContracts.startDate)`. Dasselbe gilt für die Reihenfolge in `checkDateRangeOverlap`. |
| V-4 | Verwalter | Minor | Gehört der andere Mietvertrag einem anonymisierten Mieter, steht im Satz «… mit dem Mietvertrag von Anonymisierter Mieter (…)». Laut Glossar zeigt Dwello einen anonymisierten Mieter «ohne Namen». Fix: eigener Satz `contracts_overlap_with_anonymised` (Wortlaut unten), gewählt, wenn `anonymisedOn` gesetzt ist. |

## V-1 (Major): Der falsche Rat bleibt bei der Prüfung im Assistenten

**Beleg:** `src/routes/contracts/new/ContractWizard.svelte:74` (`const OVERLAP = m.contracts_overlap_wizard()`) und Zeile 294 (`if (overlap) return { startDate: OVERLAP }`). Das ist die Prüfung im Browser, wenn die Mietverträge der Wohnung geladen sind, also der Normalfall. Text: «… Ändern Sie den Vertragsbeginn oder wählen Sie «Befristet» mit einem früheren Vertragsende.» Dr. Weber, Bericht Zeile 53: «früher als was? Der andere Mietvertrag beginnt 2022. Ein neues Vertragsende vor 2027 löst die Überschneidung nicht.»

**Warum falsch:** W-04 betrifft den Rat, nicht nur den Fall mit nicht geladenen Mietverträgen. Ändert der Plan nur die Ablehnung beim Speichern, ist W-04 im häufigen Fall nicht behoben. Zudem sagen dann dieselbe Ablehnung im Speicherfall und in der Prüfung im Browser Verschiedenes.

**Fix:** Die Prüfung im Browser gibt dasselbe aus wie das Speichern: denselben Satz mit Rat, vom selben Baustein erzeugt. Die Daten dafür liegen schon vor: `checkDateRangeOverlap` (`src/lib/utils/contract-availability.ts:116-133`) findet den Mietvertrag und kennt `tenant_id`, `start_date` und `end_date`, den Namen liefert die Liste `tenants` des Assistenten. Es fehlt nur `terminated`, für «gekündigt» statt «befristet» (`contractsForAvailability`, `src/lib/contract-form.ts:215-220`). Danach entfällt `contracts_overlap_wizard`, und die Erwartung in `src/__tests__/contract-wizard.dom.test.ts:333` («überschneidet sich mit einem anderen Mietvertrag») passt man an. Das ist ein Unit-Test, kein Szenario. Der Kasten «Zeitraum überschneidet sich» in `PeriodStep.svelte:139-143` sagt dann neben dem Feld dasselbe noch einmal, wie bei W-08. Man prüft ihn am besten im selben Zug.

## V-2 (Major): {period} in einem Text des Backends

**Beleg:**
- `backend/src/routes/contracts.ts:274-275`: Ein PUT mit Überschneidung antwortet 400 mit `errorBody`, also mit Code und Params.
- `src/routes/contracts/[id]/+page.server.ts:246-247`: Die Aktion «Enddatum erfassen» zeigt jede 400-Antwort mit `backendMessage({ code, params }, …)`.
- `src/lib/backend-error.ts:41-50`: `backendMessage` füllt nur die Params des Backends ein.
- Eine Überschneidung kommt dort tatsächlich vor: Wird ein Kündigungstermin auf einen Tag nach dem Vertragsbeginn des Nachmieters verschoben, lehnt `checkNewDates` (`contract.service.ts:433-439`) ab.

**Warum falsch:** Die Params lauten {contract, tenant, start, end, terminated}. {period} ist nicht dabei, also steht dann «(undefined)» oder ein leerer Platzhalter in der Ablehnung. Die Regel «backend_<code> wird mit den Params des Backends gezeigt» gilt dann für diesen Code nicht mehr.

**Fix:** `backend_contract_overlap` bleibt wörtlich, wie es ist. Den neuen Satz trägt ein neuer UI-Schlüssel, `contracts_overlap_with`, und nur das Formular und der Assistent setzen ihn zusammen. Damit wird Plan 4 (`contracts_overlap_refused`) überflüssig: «Entwurf löschen und Mietvertrag speichern» nutzt einfach weiter `backend_contract_overlap`. Dass auch die Ablehnung bei «Enddatum erfassen» keinen Rat gibt, besteht schon vor dieser Änderung und gehört nicht zu #667.

## M-1 (Major): «Befristet» als Rat beim Bearbeiten

**Beleg:** Plan 3(a), der Vermerk «in the edit form the entered contract may already be befristet». Laut `src/routes/contracts/new/PeriodStep.svelte:51-73` bietet das Bearbeitungsformular «Befristet» auch bei einem gekündigten Mietvertrag an, neben «Gekündigt per …» und «Kündigung aufheben». `contracts_notice_hint_text` warnt schon heute davor, einen unbefristeten Mietvertrag auf «Befristet» umzustellen: «… mit «Enddatum erfassen» … So bleibt er unbefristet». Fall (a) tritt beim Bearbeiten vor allem auf, wenn bei einem Nachmieter die Kündigung aufgehoben wird oder ein befristeter Mietvertrag auf «Unbefristet» umgestellt wird.

**Recht (OR, Stand 1. Oktober 2026):**
- Art. 255 Abs. 2 OR: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll.»
- Art. 255 Abs. 3 OR: «Die übrigen Mietverhältnisse gelten als unbefristet.»
- Art. 266a Abs. 1 OR: «Die Parteien können das unbefristete Mietverhältnis unter Einhaltung der gesetzlichen Fristen und Termine kündigen, sofern sie keine längere Frist oder keinen anderen Termin vereinbart haben.»

**Warum falsch:** Ob ein Mietverhältnis befristet ist, entscheidet die Vereinbarung, nicht die Eingabe in Dwello. Ein gekündigter, unbefristeter Mietvertrag endet am Kündigungstermin. Wird er als «befristet» erfasst, ist er falsch erfasst, und davon hängen später die Hinweise ab, etwa die Frage nach der stillschweigenden Fortsetzung (Art. 266 Abs. 2 OR). Auch im Assistenten passt «Wählen Sie «Befristet»» nicht, wenn der eingegebene Zeitraum schon befristet ist.

**Fix:** Den Rat (a) in zwei Fassungen führen:
- `contracts_overlap_advice_end_before` («Befristet» mit Vertragsende): nur im Assistenten und nur, wenn «Unbefristet» gewählt ist.
- `contracts_overlap_advice_end_earlier` (neu, ohne Angabe der Vertragsdauer): im Assistenten bei «Befristet» und im Bearbeitungsformular immer.

Wortlaut unten.

## Wortlaut

fr als JSON-Strings, mit ` ` vor bzw. nach « » und vor : ? !.

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_overlap_with (neu, statt Änderung von backend_contract_overlap; {tenant}, {period}) | Der Zeitraum überschneidet sich mit dem Mietvertrag von {tenant} ({period}). | "La période chevauche le contrat de bail de {tenant} ({period})." | Il periodo si sovrappone al contratto di locazione di {tenant} ({period}). | The period overlaps with the rental contract of {tenant} ({period}). |
| contracts_overlap_with_anonymised (neu, V-4; {period}) | Der Zeitraum überschneidet sich mit dem Mietvertrag eines anonymisierten Mieters ({period}). | "La période chevauche le contrat de bail d’un locataire anonymisé ({period})." | Il periodo si sovrappone al contratto di locazione di un inquilino anonimizzato ({period}). | The period overlaps with the rental contract of an anonymised tenant ({period}). |
| contracts_overlap_advice_end_before (neu; nur im Assistenten bei «Unbefristet») | Wählen Sie «Befristet» mit einem Vertragsende vor dem {date}. | "Choisissez « Durée déterminée » avec une fin du contrat antérieure au {date}." | Scelga «A tempo determinato» con una fine del contratto anteriore al {date}. | Choose «Fixed-term» with a contract end before {date}. |
| contracts_overlap_advice_end_earlier (neu, M-1; Assistent bei «Befristet», Bearbeitungsformular immer) | Wählen Sie ein Vertragsende vor dem {date}. | "Choisissez une fin du contrat antérieure au {date}." | Scelga una fine del contratto anteriore al {date}. | Choose a contract end before {date}. |
| contracts_overlap_advice_start_after (neu) | Wählen Sie einen Vertragsbeginn nach dem {date}. | "Choisissez un début du contrat postérieur au {date}." | Scelga un inizio del contratto successivo al {date}. | Choose a contract start after {date}. |
| contracts_overlap_advice_end_other (neu, M-2; {tenant}) | Endet der Mietvertrag von {tenant}, tragen Sie zuerst auf seiner Seite mit «Enddatum erfassen» das Vertragsende ein. | "Si le contrat de bail de {tenant} prend fin, saisissez d’abord la fin du contrat sur sa page avec « Saisir la date de fin »." | Se il contratto di locazione di {tenant} termina, inserisca prima la fine del contratto sulla sua pagina con «Registrare la data di fine». | If the rental contract of {tenant} ends, first enter its contract end on its page with «Enter end date». |
| contracts_confirm_past (geändert, ohne {notice}) | Stimmt der Vertragsbeginn, klicken Sie nochmals auf «Weiter». | "Si le début du contrat est correct, cliquez encore une fois sur « Continuer »." | Se l’inizio del contratto è corretto, clicchi di nuovo su «Avanti». | If the contract start is correct, click «Next» again. |
| backend_contract_overlap (unverändert, V-2) | unverändert (Text auf main) | unverändert | unverändert | unverändert |
| contracts_overlap_refused | entfällt (V-2) | entfällt | entfällt | entfällt |
| contracts_overlap_wizard | entfällt (V-1) | entfällt | entfällt | entfällt |

Regel für die Wahl des Rats ({date} ist immer ein Tag des anderen Mietvertrags):
1. Der andere Mietvertrag beginnt nach dem eingegebenen Vertragsbeginn: (a), mit `end_before` oder `end_earlier` wie unter M-1, {date} = sein Vertragsbeginn.
2. Er beginnt am selben Tag oder früher und hat ein Vertragsende: `start_after`, {date} = sein Vertragsende.
3. Er beginnt am selben Tag oder früher und hat kein Vertragsende: `end_other`.

Die Prüfung des Backends schliesst beide Grenzen ein (`gte`/`lte`, `contract.service.ts:233-239`). Damit ergeben «vor dem» und «nach dem» genau die richtigen Tage. Nachgerechnet:
- B endet am 31.03.2027: Ein Beginn am 01.04.2027 überschneidet nicht.
- B beginnt am 01.04.2027: Ein Ende am 31.03.2027 überschneidet nicht.
- Gleicher Tag (A und B beginnen am 01.04.2027): Fall 2 oder 3, richtig.

## Szenarien: endgültige deutsche Zeilen

Nur die Zeile in «Die Ablehnung nennt den laufenden Mietvertrag ohne Vertragsende» ändert sich (M-2):

```
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (seit 01.04.2024, unbefristet). Endet der Mietvertrag von Bruno Meier, tragen Sie zuerst auf seiner Seite mit «Enddatum erfassen» das Vertragsende ein."
```

Unverändert richtig:
- `contract-new.feature`, «… nach dem früheren Mietvertrag»: «… (01.04.2024 – 31.03.2027, befristet). Wählen Sie einen Vertragsbeginn nach dem 31.03.2027.»
- `contract-new.feature`, «… vor dem späteren Mietvertrag»: «… (ab 01.04.2027, unbefristet). Wählen Sie «Befristet» mit einem Vertragsende vor dem 01.04.2027.» Anna ist dort unbefristet, im Assistenten, also gilt `end_before`.
- `contract-new.feature`, W-08: «Stimmt der Vertragsbeginn, klicken Sie nochmals auf «Weiter».»
- `contract-edit.feature`: «… mit dem Mietvertrag von Bruno Meier (01.01.2022 – 31.03.2024, befristet). Wählen Sie einen Vertragsbeginn nach dem 31.03.2024.» Bruno beginnt vor dem 01.04.2024, Fall 2.

Grep `git grep -nE 'überschneidet sich|Wenn es stimmt|nochmals auf|früheren Vertragsende|Überschneidung' origin/main -- tests/e2e/features tests/a11y tests/e2e/steps tests/e2e/questions`: Keine Szenariozeile ohne @wip auf main zitiert einen geänderten Text. Der einzige Treffer ist ein Kommentar (`contract-edit.feature:74`). Ändern muss man nur den Unit-Test `src/__tests__/contract-wizard.dom.test.ts:333`, und zwar nur, wenn V-1 so umgesetzt wird.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- V-2: Nicht ausgeführt. Dass Paraglide einen fehlenden Platzhalter als «undefined» zeigt, schliesse ich aus dem Code (`backend-error.ts:27-50`, `contracts.ts:274-275`, `contracts/[id]/+page.server.ts:246-247`). Ebenso, dass «Enddatum erfassen» eine Überschneidung auslösen kann.
- Das Issue habe ich mit `gh api repos/rudini/Dwello/issues/667` gelesen, nicht mit mcp__github__issue_read: ToolSearch stand in dieser Sitzung nicht zur Verfügung.
- Ob der Rat (c) zur Seite passt, die #664 mit «Enddatum erfassen» geändert hat, habe ich nur am Text geprüft (`contracts_end_action`, `contracts_notice_hint_text`), nicht auf der Seite.

Geprüft: Plan 1 (Params), 2 (Satz; die Schlüssel für den Zeitraum und `contractPeriod` in `src/lib/contract-status.ts:36-53`), 3(b), 5 (W-03: den Hinweis ausblenden, keinen neuen Text) und 6 (W-08) sowie W-10 (kein Text) stimmen mit Glossar, i18n-begriffe und Art. 255/266/266a OR überein. Die Begriffe Mietvertrag, Vertragsbeginn, Vertragsende, Befristet und Unbefristet sind in allen vier Sprachen wie in `docs/design/i18n-begriffe.md:35-38`.
