# Fachreview A-6 (#115), Runde 1: @wip-Szenarien vor der Umsetzung

Gegenstand: Commit `1a57ad7` im Worktree `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/review-a6-fach` (Szenarien am Ende von `tests/e2e/features/dashboard.feature` und `tests/e2e/features/contract-detail.feature`, dazu die geplanten Texte und Regeln aus dem Auftrag).
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md` (A-1, A-4, A-6, A-10), Issue #115 («Decided (product owner)»), OR in der Fassung vom 01.10.2026 von Fedlex (`fedlex.data.admin.ch/filestore/.../eli/cc/27/317_321_377/20261001/de/html/...`), Code im Worktree (`backend/src/services/contract.service.ts`, `src/routes/dashboard/+page.server.ts`, `messages/de.json`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Blocker | Das bestehende grüne Szenario «Entwurf löschen und Mietvertrag beenden» wurde versehentlich geändert: Es prüft jetzt «Bruno Meier», den es dort nicht gibt, und prüft das Löschen von Annas Entwurf nicht mehr |
| M-1 | Mietrecht | Major | Der Fragetext macht aus «wohnt noch da» schon «läuft unbefristet weiter». Art. 266 Abs. 2 OR verlangt aber, dass *beide Parteien* den Vertrag stillschweigend fortsetzen |
| V-2 | Verwalter | Major | Ist eine versendete oder bezahlte Abrechnung betroffen, bleibt der Verwalter stecken: «Unbefristet weiterführen» wird abgelehnt, die Meldung spricht von «dem Datum», und die Aufgabe bleibt für immer. Dafür gibt es kein Szenario |
| M-2 | Mietrecht | Major | Es gibt keinen Test für die entschiedene Regel «gekündigte Mietverträge erhalten die Aufgabe nie», weder für die Übersicht noch für die Detailseite |
| V-3 | Verwalter | Minor | Die Bestätigung «ausgezogen» wird nur beim Entfernen des Vertragsendes gelöscht, nicht wenn sich das Vertragsende ändert. Rückgängig machen geht nur auf Umwegen |
| V-4 | Verwalter | Minor | Ein Mieter, der erst später ausgezogen ist, findet keinen Weg: «Mieter ist ausgezogen» lässt das ursprüngliche Ende stehen |
| V-5 | Verwalter | Minor | Nach «Mieter ist ausgezogen» fehlt der Hinweis auf die neue Korrespondenzadresse (Glossar, A-5) |
| V-6 | Verwalter | Minor | Das Szenario für «Mieter ist ausgezogen» prüft nicht, ob die Bestätigung gespeichert wird. Grenzfälle (Ende heute, Nachmieter nach einer Lücke) sind nicht festgelegt |
| V-7 | Verwalter | Minor | Fehlender Glossarbegriff für die gespeicherte Bestätigung. «Folgevertrag» steht nicht im Glossar, «Nachmieter» schon |
| V-8 | Verwalter | Minor | A-6 im Anforderungsdokument verlangt die Aktionen bei der Aufgabe in der Übersicht, A-1 Punkt 5 einen Stichtag: Beides weicht von Entscheid und Plan ab und muss im Dokument stehen |
| V-9 | Verwalter | Nit | Szenario-Kommentar «als Leerstand abrechnen»: «Leerstand» steht nicht im Glossar |
| V-10 | Verwalter | Nit | Die Meldungstexte (Toast) wurden nicht vorgelegt. Vorschlag siehe unten |

---

## V-1 (Blocker) Bestehendes Szenario versehentlich geändert

**Beleg:** `tests/e2e/features/contract-detail.feature:200-208` (Szenario «Entwurf löschen und Mietvertrag beenden», ohne `@wip`). Diff:

```
-    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"
+    Und ist der Mietvertrag von "Bruno Meier" unbefristet
+    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Bruno Meier"
```

**Warum falsch:** In diesem Szenario gibt es weder die Wohnung 2.02 noch den Mieter «Bruno Meier». Der neue Schritt `ist der Mietvertrag von {string} unbefristet` ruft `seed.idOf("Mietvertrag Bruno Meier")` auf, das Ergebnis ist `undefined`, und das Szenario wird rot. Ausserdem fällt der Nachweis für A-10 Anforderung 2 weg: dass der Entwurf 2025 von Anna gelöscht ist. Die zwei Zeilen gehören offensichtlich ans Ende des neuen Szenarios «Entwurf löschen und Mietvertrag unbefristet weiterführen», und dort stehen sie auch schon.
**Korrektur:** Die alte Zeile `Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"` wiederherstellen und die zwei Bruno-Zeilen dort entfernen.

## M-1 (Major) Fragetext verkürzt Art. 266 Abs. 2 OR

**Beleg:** Geplanter Text (aus A-6, `docs/anforderungen-vertragsende.md:203`): «Der befristete Mietvertrag von {Name} ist am {TT.MM.JJJJ} abgelaufen. Wohnt {Name} noch in der Wohnung? Dann läuft der Mietvertrag unbefristet weiter.» Er steht im Panel und in der Aufgabe.
Fedlex, OR Art. 266:
> «¹ Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer.
> ² Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»

Das Glossar sagt es auch so («bleibt der Mieter danach mit Wissen des Vermieters, gilt er als unbefristet», `UBIQUITOUS_LANGUAGE.md:38`).

**Warum falsch:** Das Gesetz knüpft die Folge an ein Verhalten *beider* Parteien. Der Text knüpft sie allein daran, dass der Mieter noch dort wohnt. Bleibt der Mieter gegen den Willen des Vermieters (der Vermieter verlangt die Rückgabe oder hat ein Ausweisungsverfahren eingeleitet), sagt Dwello dem Laien, der Vertrag sei unbefristet. Er klickt dann womöglich «Unbefristet weiterführen» und gibt seine Position auf. Für diesen Fall passt auch keine der zwei Schaltflächen. Dass ein sofortiger Widerspruch des Vermieters (oder die Weigerung, den Mietzins anzunehmen) die stillschweigende Fortsetzung ausschliesst, ist Lehre und Rechtsprechung, kein Gesetzestext: **unsicher**.
**Korrektur (Vorschlag):** «Der befristete Mietvertrag von {Name} ist am {TT.MM.JJJJ} abgelaufen. Wohnt {Name} noch in der Wohnung und sind Sie damit einverstanden, zum Beispiel weil Sie den Mietzins weiter annehmen? Dann läuft der Mietvertrag unbefristet weiter.» Dazu eine sichtbare Hilfe unter den Schaltflächen: «Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und holen Sie Rat ein.» Den Text auch in A-6 nachführen. Die Wortwahl muss der Product Owner bestätigen (Issue, Labels `fachlich`, `entscheiden`).

## V-2 (Major) Versendete oder bezahlte Abrechnung: Sackgasse ohne Szenario

**Beleg:** `backend/src/services/contract.service.ts:337-357`: `checkNewDates` lehnt jede Änderung ab, die die abgerechneten Mietstage einer gespeicherten Abrechnung ändert, egal in welchem Status. Nur einen einzelnen Entwurf kann es löschen (`onlyDraft`). Der Auftrag beschreibt nur den Fall mit Entwurf. Für versendet oder bezahlt zeigt das Frontend heute `contracts_billed_locked_one` und `contracts_billed_locked_rest` (`messages/de.json:1369-1371`): «… Dwello ändert sie nicht, darum lässt sich das Datum nicht speichern. Prüfen Sie das Datum. Stimmt es, klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.»
**Warum falsch:** Weil auch alte Verträge die Aufgabe erhalten (Entscheid #115), ist genau dieser Fall wahrscheinlich: Der Vermieter hat die Abrechnung für die Zeit nach dem Ende (Mietstage nur bis zum Vertragsende) längst versendet, genau der Fehler, den A-6 beheben soll. Dann:
1. «Unbefristet weiterführen» wird abgelehnt.
2. Die Meldung spricht von «dem Datum», das der Verwalter im Panel gar nicht eingegeben hat.
3. «Mieter ist ausgezogen» wäre eine falsche Angabe.
4. Die Aufgabe bleibt deshalb auf Dauer in der Übersicht.

Dafür gibt es kein Szenario. Das widerspricht der Regel, dass auch ein Zustand, den nur eine abgelehnte Anfrage erreicht, ein Szenario braucht (`tests/e2e/CLAUDE.md`, «Rules»).
**Korrektur:** Ein Szenario «Unbefristet weiterführen nach einer versendeten Abrechnung» (Abrechnung 2025 als versendet markiert). Das Panel zeigt eine eigene Meldung ohne «das Datum», etwa: «Die Nebenkostenabrechnung {numbers} wurde mit dem bisherigen Vertragsende berechnet und ist versendet. Dwello ändert sie nicht, darum läuft der Mietvertrag hier noch nicht unbefristet weiter. Klären Sie die Korrektur der Abrechnung direkt mit dem Mieter.» Was danach mit der Aufgabe geschieht (bleibt, bis A-11/#120 umgesetzt ist, oder lässt sich zurückstellen), muss der Product Owner entscheiden: Issue (`fachlich`, `entscheiden`) mit Verweis auf #120.

## M-2 (Major) Regel «gekündigt: nie die Aufgabe» ohne Nachweis

**Beleg:** Issue #115, «Decided»: «gekündigte contracts never get the task». A-6 Anforderung 2. Keines der acht neuen Szenarien hat einen gekündigten Mietvertrag.
**Warum falsch:** Fehlt die Unterscheidung (z. B. weil nur `endDate < heute` geprüft wird), bietet Dwello bei einem gekündigten Vertrag «Unbefristet weiterführen» an. Das wirkt wie «Kündigung aufheben», aber ohne die Hilfe, dass eine Kündigung nach dem Eingang nicht einseitig zurückgenommen werden kann (Glossar «Kündigung aufheben», `UBIQUITOUS_LANGUAGE.md:40`).
**Korrektur:** In `dashboard.feature` ein Szenario «Abgelaufener gekündigter Mietvertrag»: Der Mietvertrag ist auf ein vergangenes Datum gekündigt (`seed` mit `terminated: true`, vorhanden in `fixtures/backend.ts:237`). Dann nennt die Übersicht «Nachmieter für Wohnung 1.02 suchen», aber nicht «Befristeten Mietvertrag prüfen». Für die Detailseite genügt eine Zeile im bestehenden Szenario «Mietvertrag auf ein vergangenes Datum beenden» (`contract-detail.feature:31-35`): `Und fragt der Mietvertrag nicht, ob der Mieter noch in der Wohnung wohnt`.

## V-3 (Minor) Bestätigung «ausgezogen» bei geändertem Vertragsende

**Beleg:** Auftrag: «Removing the end … also clears the ‹ausgezogen› confirmation». Plan: «removing the end clears it» (`implementation_plan.md`, Session W7c).
**Warum:** Die Bestätigung gilt für ein bestimmtes Vertragsende. Verschiebt der Verwalter das Ende unter «Bearbeiten» (z. B. auf ein künftiges Datum, weil der Vertrag doch verlängert wurde), bleibt `moved_out = true`. Läuft das neue Ende ab, fragt Dwello nicht mehr. Wer «Mieter ist ausgezogen» aus Versehen gewählt hat, kann das nur über «Vertragsende entfernen und neu eintragen» rückgängig machen.
**Korrektur:** Jede Änderung des Vertragsendes löscht die Bestätigung, nicht nur das Entfernen. Mit Unit- oder `*.pg.test.ts` abdecken.

## V-4 (Minor) Mieter erst nach dem Ende ausgezogen

**Beleg:** Fragetext «Wohnt {Name} noch in der Wohnung?» und die zwei Schaltflächen.
**Warum:** Häufiger Praxisfall: Der Mieter blieb noch einige Wochen und ist inzwischen weg. «Noch» trifft dann nicht zu, also wählt der Verwalter «Mieter ist ausgezogen», und das Ende bleibt auf dem vereinbarten Tag. Die Nebenkosten der Zwischenzeit trägt dann der Vermieter (`contracts_end_confirm_help`, `messages/de.json`). Wie diese Zeit rechtlich einzuordnen ist (fortgesetzter Vertrag mit Kündigung oder Entschädigung für die Weiternutzung), ist ohne Fedlex-Wortlaut **unsicher**.
**Korrektur:** Sichtbare Hilfe am Panel: «Ist {Name} erst später ausgezogen, tragen Sie unter «Bearbeiten» den letzten Tag ein, bis zu dem {Name} die Wohnung genutzt hat.» Die rechtliche Einordnung geht ins selbe Issue wie M-1.

## V-5 (Minor) Neue Adresse nach dem Auszug

**Beleg:** Glossar «Korrespondenzadresse»: «Nach dem Auszug trägt der Vermieter die neue Adresse ein» (`UBIQUITOUS_LANGUAGE.md:24`). A-4 zeigt nach dem Beenden die «Nächsten Schritte» mit «Neue Adresse eintragen».
**Warum:** «Mieter ist ausgezogen» ist genau der Moment, in dem die Schlussabrechnung sonst an die verlassene Wohnung geht (A-5).
**Korrektur:** Die Meldung (oder ein Link im Panel) nennt den Schritt: «Tragen Sie die neue Adresse von {Name} ein. Dorthin geht die Nebenkostenabrechnung.» Mit Link zum Mieter, gleich wie «Neue Adresse eintragen» in A-4.

## V-6 (Minor) Lücken in den Szenarien und Grenzfällen

- `contract-detail.feature`, «Mieter ist nach dem befristeten Mietvertrag ausgezogen»: `fragt der Mietvertrag nicht mehr …` kann schon aus dem Zustand im Browser grün werden. Nachweis, dass gespeichert wurde: danach die Seite neu öffnen oder `Und nennt die Übersicht keine Aufgabe für den Mietvertrag von "Bruno Meier"`. Optional `Und hat der Mietvertrag den Status "Beendet"`.
- «Abgelaufen» heisst: Vertragsende vor heute, Tag in der Schweiz (`localToday()`). Ein Vertragsende, das heute ist, ist noch nicht abgelaufen (letzter Tag des Mietverhältnisses, Glossar «Vertragsende»). Im Unit-Test für `overview.ts` festhalten: Ende gestern gibt die Aufgabe, Ende heute nicht.
- «Ohne Folgevertrag» wie in `noticed()` (`src/routes/dashboard/+page.server.ts:86-90`) bestimmen: irgendein Mietvertrag derselben Wohnung, der nach dem Vertragsende beginnt, auch nach einer Lücke. Das ist fachlich richtig: Ein Nachmieter schliesst die Fortsetzung praktisch aus, und «Unbefristet weiterführen» scheiterte ohnehin an `CONTRACT_OVERLAP`. A-4 Anforderung 1 sagt dagegen «ab dem Tag danach». Für A-6 die weite Fassung im Unit-Test festhalten.

## V-7 (Minor) Fehlende Begriffe

- Die gespeicherte Bestätigung (`moved_out`) hat keinen Glossarbegriff. **Vorschlag** (Issue, Labels `fachlich`, `entscheiden`): **Auszug bestätigt**: «Der Vermieter hat bestätigt, dass der Mieter nach dem vereinbarten Vertragsende eines befristeten Mietvertrags ausgezogen ist. Dwello fragt dann nicht mehr, ob der Mietvertrag unbefristet weiterläuft. Ändert sich das Vertragsende, fällt die Bestätigung weg.» Bis zum Entscheid: `TODO(fachlich prüfen, #<issue>)` am Code.
- Der Szenariotitel `Abgelaufener befristeter Mietvertrag mit Folgevertrag` (`dashboard.feature`) verwendet «Folgevertrag», das nicht im Glossar steht. Das Glossar kennt **Nachmieter** («Mieter, dessen Mietvertrag für dieselbe Wohnung nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags beginnt», `UBIQUITOUS_LANGUAGE.md:43`). Titel: «Abgelaufener befristeter Mietvertrag mit Nachmieter», passend zum Titel «… ohne Nachmieter» davor. «Nachmieter» hat schon den Marker `TODO(fachlich prüfen, #140)` (`src/lib/overview.ts:168`). Ein neuer Text mit dem Wort verweist auf #140.

## V-8 (Minor) Anforderungsdokument nachführen

**Beleg:** `docs/anforderungen-vertragsende.md:53` (A-1 Punkt 5: «gilt nur für Verträge, deren vereinbartes Ende nach der Einführung von A-1 liegt») und `:219` (A-6 Hinweis: «braucht einen festen Stichtag oder ein Datum am Vertrag»). Beides widerspricht dem Entscheid (Option 2, alte Verträge eingeschlossen). In A-6 Anforderung 1 stehen die Aktionen in der Aufgabe der Übersicht, der Plan setzt sie auf die Detailseite und lässt der Aufgabe nur einen Link.
**Korrektur:** Bei «umgesetzt» in A-6 die Abweichung nennen (Aktionen auf der Detailseite, weil Aufgaben der Übersicht nur Links sind) und den Entscheid #115 eintragen. A-1 Punkt 5 und den Hinweis in A-6 auf den Entscheid umschreiben. Der Plan sieht das vor; hier zur Kontrolle.

## V-9 (Nit) «Leerstand» im Szenario-Kommentar

**Beleg:** `contract-detail.feature`, Kommentar «Die Abrechnung 2025 rechnet die Zeit nach dem Vertragsende als Leerstand ab». «Leerstand» steht nicht im Glossar (nur der Mietstatus «Leer»).
**Korrektur:** «Die Abrechnung 2025 rechnet die Mietstage nur bis zum Vertragsende ab.»

## V-10 (Nit) Meldungstexte

Die Texte der Meldungen wurden nicht vorgelegt. Vorschlag:
- «Unbefristet weiterführen»: «Der Mietvertrag von {Name} läuft unbefristet weiter. Er endet erst mit einer Kündigung.»
- «Mieter ist ausgezogen»: «Der Mietvertrag von {Name} endete am {TT.MM.JJJJ}. Tragen Sie die neue Adresse von {Name} ein.» (siehe V-5)

---

## Bestätigt

- **Rechtsgrundlage:** Art. 266 Abs. 1 und 2 OR (Fedlex-Wortlaut oben). Nach Ablauf endet der befristete Vertrag ohne Kündigung. Setzen ihn die Parteien stillschweigend fort, gilt er als unbefristet. Dass «Unbefristet weiterführen» das Vertragsende entfernt und `terminated` falsch bleibt, passt zum Glossar («Vertragsende … leer bei einem unbefristeten, ungekündigten Vertrag»).
- **Status nach den Aktionen:** «Unbefristet» und Status «Laufend» nach «Unbefristet weiterführen» stimmen mit dem Glossar überein («Vertragsstatus: Laufend, künftig oder beendet, abgeleitet aus Vertragsbeginn und -ende»). Ebenso «Befristet bis 31.12.2025» nach «Mieter ist ausgezogen» (A-1 Anforderung 3).
- **Begriffe:** «Befristeten Mietvertrag prüfen», «Unbefristet weiterführen» und «Mieter ist ausgezogen» stimmen wörtlich mit A-6 und #115 überein. «Mietvertrag», «Mieter», «befristet/unbefristet», «Vertragsende», «Entwurf» und «Nebenkostenabrechnung» stehen im Glossar.
- **Szenarien:** Die Szenarien der Übersicht (ohne Nachmieter, Link zur Detailseite, mit Nachmieter, Auszug bestätigt) decken A-6 Anforderung 1 und die Bedingungen des Entscheids ab, ausser «gekündigt» (M-2). Die Akzeptanzkriterien aus A-6 sind enthalten.
- **Ablehnung mit Entwurf:** Die Szenarien entsprechen der bestehenden Regel. `statementsChanged` vergleicht mit `coalesce(endDate, periodEnd)`; ohne Vertragsende ändern sich die Mietstage der Abrechnung 2025 (Ende 30.06.2025) also und werden abgelehnt (`contract.service.ts:307-327`). Der zitierte Text entspricht `contracts_billed_draft_one`. Das Löschen nur eines einzelnen Entwurfs (`onlyDraft`) und der Weg in den Assistenten entsprechen A-10.
- **Rechenbeispiele (Mietstage 2025, Periode 01.01.–31.12.2025):**
  - Ende 30.06.2025: 181 Tage. Ohne Ende: 365 Tage, also Ablehnung.
  - Ende 31.12.2025 ohne Abrechnung 2025: keine Abrechnung ändert sich, also keine Ablehnung (Szenario 1).
  - Randfall Abrechnung 2026 bei Ende 31.12.2025: Der Vertrag hat 0 Mietstage, eine Abrechnung 2026 für ihn kann es nicht geben, also keine Ablehnung.
- **Keine Doppelnennung:** Die Frist «Vertragsende» (`endingContracts`) betrifft nur künftige Enden. Die Aufgabe «Nachmieter suchen» betrifft nur gekündigte Verträge (`noticed()`).

## Nicht bestätigt

- **Widerspruch des Vermieters:** Dass ein sofortiger Widerspruch des Vermieters oder die Weigerung, den Mietzins anzunehmen, die stillschweigende Fortsetzung ausschliesst, ist Lehre und Rechtsprechung, nicht Gesetzestext. Gesucht mit `mmx search` (Treffer: HEV Zürich und mietrecht.ch, MP 3/03, keine Fedlex-Quelle). **Unsicher** (M-1).
- **Später Auszug:** Wie die Zeit zwischen vereinbartem Ende und einem späteren Auszug einzuordnen ist (fortgesetzter unbefristeter Vertrag, der eine Kündigung braucht, oder Entschädigung für die Weiternutzung), steht nicht im Gesetzestext. Auf Fedlex nur Art. 266 und 267 OR gelesen. **Unsicher** (V-4).
- **Verlängerungsklausel:** Befristete Verträge mit Verlängerungsklausel («verlängert sich stillschweigend um ein Jahr») sind rechtlich anders zu behandeln. Dwello unterscheidet sie nicht. Das gehört nicht zu #115 und wurde nicht weiter geprüft.
- **Texte in fr/it/en:** Folgen später, nicht geprüft.
- **Toast und Panel-Layout:** Die Texte der Meldungen und die genauen Schaltflächen im Panel lagen nicht vor (V-10).
