# Fachreview A-6 (#115), Runde 2: Umsetzung

Gegenstand: `git diff f562b75 ba02ed9` im Worktree `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/review-a6-fach2`. Geprüft: die neuen Texte in `messages/{de,fr,it,en}.json`, `FixedTermCheck.svelte`, `+page.server.ts` der Detailseite, die Aufgabe in `src/lib/overview.ts` und `src/routes/dashboard/+page.server.ts`, das Backend (`moved_out`, `updateContract`), die Szenarien, `docs/anforderungen-vertragsende.md`, `docs/api-specification.md` und `docs/data-model.md`.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/anforderungen-vertragsende.md`, Issue #308, das OR von Fedlex in der Fassung vom 01.10.2026 (`fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/de/html/...-de-html-1.html`, heute neu geladen).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-3 | Mietrecht | Minor | Die Meldung bei einer versendeten oder bezahlten Abrechnung sagt «darum kann der Mietvertrag hier nicht unbefristet weiterlaufen». Ob er weiterläuft, entscheidet aber das Verhalten der Parteien (Art. 266 Abs. 2 OR), nicht Dwello |
| M-4 | Mietrecht | Minor | Die Hilfe «verlangen Sie die Rückgabe der Wohnung sofort schriftlich» passt nicht, wenn das Vertragsende schon Monate zurückliegt. Das betrifft gerade die alten Verträge, die nach dem Entscheid in #115 die Aufgabe auch erhalten (**unsicher**) |
| V-11 | Verwalter | Nit | In A-6 stehen bei Anforderung 1 noch der alte Fragetext und die Aktionen in der Übersicht. Bei «Problem» steht noch «im Fachreview als unsicher markiert» |
| V-12 | Verwalter | Nit | «Folgevertrag» (nicht im Glossar) steht noch im Kommentar `dashboard.feature:156` und in zwei Testnamen |
| V-13 | Verwalter | Nit | Issue #308 nennt den Schlüssel `dashboard_task_fixed_term_text`. Den gibt es nicht, die Aufgabe verwendet `contracts_fixed_term_question` |
| V-14 | Verwalter | Nit | fr/it/en: In `contracts_continue_locked_rest` steht «les / li / them» (Mehrzahl), obwohl oft nur eine Abrechnung betroffen ist. Das Muster stammt aus dem bestehenden `contracts_billed_locked_rest` |
| V-15 | Verwalter | Nit | Der Toast nach «Unbefristet weiterführen» nennt die Folge nicht (Vorschlag V-10 aus Runde 1: «Er endet erst mit einer Kündigung.») |

Stand der Befunde aus Runde 1:
- **Erledigt:** V-1, V-3, V-6, V-7 (Titel), V-8, V-9 und V-10 (Texte in den Meldungen) sind behoben und am Diff geprüft.
- **M-1:** Der Text nennt jetzt das Einverständnis beider Parteien, die Hilfe zum Widerspruch ist da. Der Wortlaut wartet auf den Entscheid in #308 (Marker in `overview.ts:184` und `FixedTermCheck.svelte:13`). Das ist kein offener Befund mehr, sondern eine Produktentscheidung.
- **V-2:** Es gibt jetzt eine eigene Meldung und ein Szenario dafür. Was danach mit der Aufgabe geschieht, entscheidet der Product Owner in #120. Siehe auch M-3.
- **M-2:** Beide Szenarien sind vorhanden und sinnvoll. Ohne Prüfung von `terminated` würde Annas Vertrag (Ende 31.03.2025, kein späterer Vertrag) das Feld zeigen, die Szenarien würden also rot.
- **Weiter offen (Minor, nicht trivial):** V-4 (Mieter erst später ausgezogen) und V-5 (Hinweis auf die neue Korrespondenzadresse).

---

## M-3 (Minor) «kann der Mietvertrag hier nicht unbefristet weiterlaufen»

**Beleg:** `messages/de.json`, `contracts_continue_locked_rest`: «Dwello ändert sie nicht, darum kann der Mietvertrag hier nicht unbefristet weiterlaufen. Klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.» Die fr/it/en-Texte sagen dasselbe. Ebenso `docs/anforderungen-vertragsende.md:199`: «… sagt sie, dass der Mietvertrag hier nicht weiterlaufen kann».
Fedlex, OR Art. 266 Abs. 2:
> «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»

**Warum falsch:** Ob der Vertrag weiterläuft, folgt aus dem Verhalten der Parteien. Der Verwalter hat das soeben bejaht, sonst hätte er nicht «Unbefristet weiterführen» gewählt. Dwello kann den Vertrag nur nicht so *speichern*. Auf demselben Bildschirm stehen weiter der Status «Beendet» und die Schaltfläche «Mieter ist ausgezogen». Ein Laie liest daraus leicht, dass der Vertrag wegen der versendeten Abrechnung beendet bleibt. Dann setzt er das vereinbarte Ende durch, obwohl der Vertrag rechtlich weiterläuft. Oder er wählt «Mieter ist ausgezogen», nur damit die Aufgabe verschwindet, und das ist eine falsche Angabe.
**Korrektur (Vorschlag, alle vier Sprachen):** «Dwello ändert sie nicht, darum kann Dwello das Vertragsende nicht entfernen. Für Sie und den Mieter läuft der Mietvertrag trotzdem unbefristet weiter. Klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.» Die Stelle in A-6 entsprechend anpassen: «… sagt sie, dass Dwello das Vertragsende nicht entfernen kann». Der Text ändert sich, also braucht es zuerst einen roten Test. Die Szenariozeile `meldet der Mietvertrag "Klären Sie die Korrektur …"` bleibt gültig.

## M-4 (Minor) «sofort» bei einem lange abgelaufenen Vertrag

**Beleg:** `contracts_fixed_term_objection`: «Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und lassen Sie sich beraten.» `docs/anforderungen-vertragsende.md:50` (A-1 Punkt 5): Ohne Stichtag fragt die Übersicht auch nach alten befristeten Verträgen (Entscheid #115).
**Warum:** Der Text stammt aus meinem Vorschlag in Runde 1. Dort ging es um einen Vertrag, der gerade abgelaufen ist. Nach dem Entscheid erscheint das Feld aber auch bei einem Vertrag, der vor ein oder zwei Jahren endete. Hat der Vermieter seither den Mietzins angenommen, ist der Vertrag nach Lehre und Rechtsprechung wohl längst stillschweigend fortgesetzt. Dann verlangt der Laie jetzt die Rückgabe, obwohl es eine Kündigung braucht (Art. 266a ff. OR). Ab wann die Fortsetzung eintritt, sagt der Gesetzestext nicht: **unsicher**.
**Korrektur (Vorschlag, in #308 aufnehmen):** Nach dem bestehenden Satz ergänzen: «Haben Sie den Mietzins nach dem Vertragsende längere Zeit angenommen, läuft der Mietvertrag meist schon unbefristet weiter und endet nur mit einer Kündigung.» Oder die Hilfe nur zeigen, wenn das Ende höchstens wenige Wochen zurückliegt. Das entscheidet der Product Owner in #308; bis dahin ist der Marker gesetzt.

## V-11 (Nit) A-6 im Anforderungsdokument

**Beleg:** `docs/anforderungen-vertragsende.md:206`. Anforderung 1 enthält noch den alten Fragetext ohne Einverständnis des Vermieters, und die Aktionen stehen bei der Aufgabe in der Übersicht. Zeile 202: «(Art. 266 Abs. 2 OR; im Fachreview als unsicher markiert)».
**Warum:** Der Absatz «Umgesetzt» beschreibt die Abweichung zwar, doch die Anforderung selbst widerspricht ihm. Art. 266 Abs. 2 OR ist inzwischen mit dem Fedlex-Wortlaut belegt (Runde 1 und oben). Unsicher ist nur die Frage des Widerspruchs.
**Korrektur:** In Anforderung 1 den Text durch einen Verweis auf den aktuellen Wortlaut ersetzen («Wortlaut: `contracts_fixed_term_question`, offen in #308») und «Aktionen auf der Detailseite» schreiben. In Zeile 202 «im Fachreview als unsicher markiert» streichen.

## V-12 (Nit) «Folgevertrag»

**Beleg:** `tests/e2e/features/dashboard.feature:156` («ohne Folgevertrag»), `src/__tests__/contract-actions.test.ts:495,499`.
**Korrektur:** «ohne späteren Mietvertrag der Wohnung» oder «ohne Nachmieter», wie die Szenariotitel.

## V-13 (Nit) Schlüssel in #308

**Beleg:** Issue #308, «Where»: `dashboard_task_fixed_term_text`. Den Schlüssel gibt es in `messages/*.json` nicht. `overview.ts` verwendet `contracts_fixed_term_question` auch als Text der Aufgabe.
**Korrektur:** Das Issue berichtigen, damit der Entscheid beide Stellen trifft (Aufgabe und Detailseite).

## V-14 (Nit) Mehrzahl in fr/it/en

**Beleg:** `contracts_continue_locked_rest` fr «Dwello ne les modifie pas», it «Dwello non li modifica», en «Dwello does not change them». Davor steht oft `contracts_billed_locked_one` in der Einzahl («Le décompte … a été calculé»). Im Deutschen passt «sie» für beide Zahlen.
**Korrektur:** Einen neutralen Satz wählen, etwa fr «Dwello ne modifie pas les décomptes envoyés ou payés», it «Dwello non modifica i conteggi inviati o pagati», en «Dwello does not change sent or paid statements». Das Muster kommt aus `contracts_billed_locked_rest` und gilt dort schon im Basis-Commit.

## V-15 (Nit) Folge im Toast

**Beleg:** `contracts_continued_toast`: «Der Mietvertrag von {name} läuft unbefristet weiter».
**Korrektur (optional):** «… läuft unbefristet weiter. Er endet erst mit einer Kündigung.» Das entspricht dem Glossar «Unbefristet: Der Vertrag läuft, bis er gekündigt wird» (`UBIQUITOUS_LANGUAGE.md:38`).

---

## Bestätigt

- **Rechtsgrundlage:** OR Art. 266 Abs. 1 und 2, Wortlaut heute erneut von Fedlex geladen (Fassung 01.10.2026):
  > «¹ Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer. ² Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»

  Der Fragetext nennt jetzt beide Parteien (Mieter wohnt noch dort, Vermieter ist einverstanden). Das entspricht Abs. 2.
- **Regel der Aufgabe** (`dashboard/+page.server.ts` `expired`, Detailseite `fixedTermCheckDue`): Vertragsende vor heute nach Schweizer Datum (`localToday`), nicht gekündigt, ohne Bestätigung `movedOut`, ohne späteren Mietvertrag derselben Wohnung (auch nach einer Lücke). Das entspricht dem Entscheid #115, A-6 Anforderung 2 und V-6 aus Runde 1. Ein Ende heute ist noch nicht abgelaufen und ergibt keine Aufgabe, richtig nach dem Glossar «Vertragsende: letzter Tag des Mietverhältnisses».
  - Grenzfall Nachmieter: Ende 31.12.2025, Nachmieter ab 01.01.2026 oder erst ab 01.03.2026 ergibt in beiden Fällen keine Aufgabe.
  - Grenzfall zwei befristete Verträge nacheinander: Nur der letzte erhält die Aufgabe.
  - Liest die Detailseite die Verträge der Wohnung nicht, fragt sie nicht. Lieber kein Hinweis als ein falscher.
- **Bestätigung «ausgezogen»:**
  - Jede Änderung des Vertragsendes löscht sie (`contract.service.ts:383`, `...data` danach; pg-Test). Das löst V-3.
  - Wird `movedOut` mitgesendet, gilt der gesendete Wert. Das steht so in `api-specification.md`.
  - `data-model.md` und die Migration `0010` sind passend dokumentiert.
- **Weiterführen mit Abrechnungen, nachgerechnet:**
  - Ende 30.06.2025, Entwurf 2025: bisher 181 Mietstage (31+28+31+30+31+30), ohne Vertragsende 365. Das ändert die Mietstage, also lehnt Dwello ab. Szenario «nach einem Entwurf» und «Entwurf löschen …»: Der Entwurf wird in derselben Transaktion gelöscht, danach folgt der Assistent für 2025.
  - Ende 31.12.2025, Abrechnung 2025: `rental_end` 31.12.2025 entspricht `coalesce(null, 31.12.2025)`, also ändert sich nichts, und Dwello lehnt nicht ab (Szenario «Befristeten Mietvertrag unbefristet weiterführen», Status danach «Laufend»).
  - Grenzfall Periode 01.07.2025–30.06.2026 bei Ende 31.12.2025: 184 statt 365 Mietstage, also lehnt Dwello zu Recht ab.
  - Grenzfall null Mietstage: Für eine Periode nach dem Ende gibt es keine Abrechnung des Vertrags, also auch keine Ablehnung.
  - Versendete Abrechnung: eigene Meldung ohne «das Datum» (V-2 aus Runde 1), Szenario vorhanden.
- **Gekündigt:** Weder die Übersicht noch die Detailseite fragen (beide prüfen `terminated`). Belegt durch `dashboard.feature` «Abgelaufener gekündigter Mietvertrag» und die neue Zeile in «Mietvertrag auf ein vergangenes Datum beenden».
- **Begriffe (de):** Die folgenden Begriffe stehen im Glossar oder stimmen mit #115 und A-6 überein:
  - «Mietvertrag», «Mieter», «befristet/unbefristet», «Vertragsende», «Entwurf», «Nebenkostenabrechnung», «Nachmieter» (Szenariotitel);
  - «Mietzins» (Glossar «Nettomiete … Auch: Mietzins»);
  - «Befristeten Mietvertrag prüfen», «Unbefristet weiterführen», «Mieter ist ausgezogen».
  
  Die Begriffe im Code stimmen mit dem Glossar überein. Den Begriff für die gespeicherte Bestätigung schlägt #308 vor.
- **Begriffe (fr/it/en)** nach `docs/design/i18n-begriffe.md`:
  - «contrat de bail / contratto di locazione / rental contract»;
  - «durée (in)déterminée / a tempo (in)determinato / fixed-term, open-ended»;
  - «locataire / inquilino / tenant»;
  - «loyer / pigione / rent»;
  - «brouillon / bozza / draft»;
  - «décompte des charges / conteggio spese accessorie / utility cost statement».

  Die Schaltflächen in fr und it stehen im Infinitiv. Die Ausnahme «Le locataire a déménagé / L’inquilino ha traslocato» folgt dem entschiedenen deutschen Wortlaut «Mieter ist ausgezogen».
- **Toasts:** Die Texte stehen in den Meldungen (V-10). «Entwurf {number} gelöscht … Erstellen Sie jetzt die Nebenkostenabrechnung neu.» passt zur Weiterleitung in den Assistenten.

## Nicht bestätigt

- **Zeitpunkt der stillschweigenden Fortsetzung und Widerspruch des Vermieters** (M-4, M-1): Das steht nicht im Gesetzestext. Auf Fedlex nur Art. 266, 266a und 267 OR gelesen. `mmx search` fand nur Lehre und Praxis: mietrecht.ch MP 3/03, «Stillschweigende Fortsetzung des Mietverhältnisses», sowie HEV Zürich 2006. **Unsicher.**
- **Später Auszug** (V-4 aus Runde 1): unverändert **unsicher**, nicht weiter untersucht.
- **Darstellung am Bildschirm:** Panel, Toasts und die fr/it/en-Texte im Browser habe ich nicht gesehen. Geprüft habe ich nur die Texte und den Code; Personas und Screenshots fehlen.
- **Mietstage im Code:** Den Vergleich mit `coalesce(endDate, periodEnd)` im Backend habe ich in Runde 1 gelesen und in dieser Runde nicht erneut geprüft. Der Diff ändert `checkNewDates` nicht.
