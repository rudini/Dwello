# Fachreview 1: Assistent «Abrechnungen erstellen», #251, #201, #252

Gegenstand: `git diff a7088d0~1 a7088d0 -- tests/e2e/features/statement-generate.feature` (Szenarien mit `@wip`), Schritte, Targets und Tasks desselben Commits, dazu die geplanten Texte aus dem Auftrag. Worktree: `/tmp/claude-0/-home-user-Dwello/987bcc32-5bc2-548b-b1db-07cf87dd37fd/scratchpad/review-wizard-fach` (a7088d0).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Ohne Bestätigung (#251) und mit dem Auslassen bei «Alle Gebäude» (#201) verschwindet die letzte Hürde vor der Lücke aus #199: Eine Abrechnung, die die Periode nur teilweise abdeckt, gilt als «abgerechnet». Die nicht abgedeckten Tage werden nie abgerechnet (Art. 4 Abs. 1 VMWG). |
| V-1 | Verwalter | Minor | Der Hinweis zu «Alle Gebäude» verspricht mehr, als die Regel tut: Ein Gebäude ohne Mietvertrag in der Periode (im Szenario «Ahornhof») wird gewählt, obwohl auch dafür keine neue Abrechnung entsteht. |
| V-2 | Verwalter | Minor | «Entwurf» in zwei Bedeutungen auf demselben Bildschirm: Schritt 2 sagt neu «löschen Sie ihn» (Abrechnungsstatus), die Rückfrage hat den Titel «Angaben verwerfen?», aber den Knopf «Entwurf verwerfen» (Eingaben im Browser). |
| V-3 | Verwalter | Minor | Der Satz zum Neuberechnen in Schritt 2 sagt nicht, dass das nur für Entwürfe geht und wo man löscht. `statements_all_billed` sagt das schon («Versendete Abrechnungen lassen sich nicht neu berechnen.»). |
| V-4 | Verwalter | Minor | Das #251-Szenario prüft nicht, dass der Hinweis «Es gibt schon Abrechnungen» als Information bleibt. Dabei verlangt der Auftrag genau das. |
| V-5 | Verwalter | Minor | #201 c: Das Szenario prüft den Schritt nur indirekt. Für die Grenze «höchstens Schritt 3, die Vorschau wird neu berechnet» gibt es weder ein Szenario noch einen geplanten Test. |
| V-6 | Verwalter | Minor | #252: `DraftNotice` zeigt auch das Datum («zuletzt am {date} um {time}»). Rund um Mitternacht verschiebt sich das Datum in UTC ebenso. Der Fix muss Datum und Zeit abdecken. |
| V-7 | Verwalter | Nit | Die Rückfrage «Ihre Angaben werden gelöscht.» (vom Product Owner entschieden) sagt nicht, dass erstellte Abrechnungen bleiben. Das wäre die tatsächliche Folge. |
| V-8 | Verwalter | Nit | Die Zeile `Dann sieht der Liegenschaftsverwalter, dass sein Entwurf wiederhergestellt ist` (unverändert) nennt die Browser-Eingaben «Entwurf». Laut #57 heissen sie «Angaben». |

## M-1 (Mietrecht, Major): Teilweise abgedeckte Perioden verschwinden ohne Rückfrage

**Beleg.**
- `src/lib/server/statement-generation.ts:46-64`: Ein Mietvertrag gilt als abgerechnet, sobald irgendeine seiner Abrechnungen die Periode überlappt (`s.periodStart <= periodEnd && s.periodEnd >= periodStart`). Er erhält dann keine neue Abrechnung (`contractsInPeriod`, Z. 69-73). Der Code verweist selbst auf `TODO(fachlich prüfen, #199)`.
- #199, «Decided (product owner)»: Option 3. Wo die bestehenden Abrechnungen die Periode nicht ganz abdecken, nennt Dwello die nicht abgedeckten Tage und bietet eine kurze Abrechnungsperiode dafür an. Ein Umsetzungs-Issue dazu gibt es noch nicht (offene Issues durchsucht: nur #199 und #211 nennen das Thema). Heute fehlt dieser Hinweis also.
- Kommentar in #199 (Helga P-6): Bei der Periode 01.10.2024–30.09.2025 meldet Schritt 2 für Alpenblick «Alle Mietverträge … ganz oder teilweise abdeckt … Sie müssen es nicht wählen.» Januar bis September 2025 wird nirgends abgerechnet.
- Neu: `statement-generate.feature`, Szenario «Alle Gebäude lässt schon abgerechnete Gebäude aus»: Ein solches Gebäude wird bei «Alle Gebäude» gar nicht mehr gewählt. Szenario «Bestehende Abrechnungen allein verlangen keine Bestätigung»: Schritt 4 verlangt für bestehende Abrechnungen keine Bestätigung mehr (`PreviewChecks.svelte:40-45`, `existing-statements-text` fällt aus `confirming` weg; `needsConfirmation` in `src/lib/statement-wizard.ts:225-226`).
- Fedlex, VMWG Art. 4 Abs. 1 (SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»

**Warum falsch.** Bisher war die Bestätigung in Schritt 4 die einzige Stelle, an der die Lücke auffallen konnte, wenn auch nur ungenau. Nach #251 und #201 läuft der Abrechnungslauf ohne jede Rückfrage durch. Ausserdem wählt «Alle Gebäude» das Gebäude gar nicht erst, und der neue Hinweis nennt nur eine Zahl. Die Lücke aus #199 wird damit unsichtbarer. Für die nicht abgedeckten Monate entsteht nie eine Abrechnung, und die geleisteten Akontobeiträge dieser Monate werden nie abgerechnet. Das widerspricht Art. 4 Abs. 1 VMWG. Ob der Mieter daraus einen Anspruch auf Rückzahlung der Akontobeiträge hat, habe ich nicht auf Fedlex belegt: **unsicher**.

Nachgerechnet, zweimal und mit dem Randfall:
- Szenario-Fall (vollständig abgedeckt): Eva Frei, Vertrag 01.01.–31.03.2024, Abrechnung 01.01.–31.12.2024. Ihre 91 Miettage in der Periode sind ganz abgedeckt, 0 Tage fehlen. Auslassen und Verzicht auf die Bestätigung sind hier richtig.
- Mieterwechsel: Marc Huber, Vertrag ab 01.05.2024, Abrechnung 01.01.–31.12.2024. Seine 245 Miettage 2024 sind ganz abgedeckt, 0 Tage fehlen. Auch richtig.
- Randfall (Wechsel der Periode): offener Vertrag, Abrechnung 01.01.–31.12.2024, Lauf 01.10.2024–30.09.2025. Überlappt sind 92 Tage (Okt.–Dez.). Nicht abgedeckt sind 31+28+31+30+31+30+31+31+30 = 273 von 365 Tagen. Heute heisst das: «abgerechnet», keine neue Abrechnung, und nach der Änderung keine Bestätigung und keine Wahl über «Alle Gebäude».

**Lösung (kein Widerspruch zu #251/#201).** Beide Änderungen gelten nur für Mietverträge, deren Miettage in der Periode von ihren bestehenden Abrechnungen ganz abgedeckt sind:
- Schritt 4: Eine bestehende Abrechnung, die die Miettage des Vertrags in der Periode nur teilweise abdeckt, bleibt ein echter Befund mit Bestätigung. Bis #199 umgesetzt ist, genügt die Bestätigung. Danach nennt der Befund die Tage, wie in #199 entschieden.
- «Alle Gebäude» lässt nur Gebäude aus, deren Mietverträge alle ganz abgedeckt sind.
- Je ein Szenario mit einer Abrechnung, die die Periode nur teilweise abdeckt: Schritt 4 verlangt die Bestätigung, «Alle Gebäude» wählt das Gebäude.
- Alternativ zuerst das Umsetzungs-Issue zu #199 anlegen und umsetzen. Bleibt es bei der heutigen Planung, gehört M-1 unter «Blocked on me»: Es entsteht durch diese Änderung, bestand also nicht schon vorher.

## V-1 (Verwalter, Minor): Der Hinweis «Alle Gebäude» passt nicht zum Gebäude ohne Mietvertrag

**Beleg.** Im Szenario «Alle Gebäude lässt schon abgerechnete Gebäude aus» hat «Ahornhof» keine Wohnung und keinen Mietvertrag. Trotzdem gilt `Dann ist für die Abrechnungen das Gebäude "Ahornhof" gewählt`, und danach `sagt die Wahl … «Alle Gebäude» die Gebäude auslässt, für die keine neue Abrechnung entsteht`. `BuildingChoice.svelte:32-33` zeigt bei `billed.billed == 0` keinen Hinweis. Ein Gebäude ohne Mietvertrag in der Periode gilt also nicht als «ganz abgerechnet».

**Warum falsch.** Laut Text lässt «Alle Gebäude» die Gebäude aus, «für die keine neue Abrechnung entsteht». Wer das liest, nimmt an, dass für jedes gewählte Gebäude eine Abrechnung entsteht. Für Ahornhof entsteht keine. Fachlich schadet das nicht, denn ohne Mieter gibt es niemanden abzurechnen. Der Satz ist aber ungenau. Der Product Owner hat entschieden: Ausgelassen werden Gebäude, «whose Mietverträge all have a statement».

**Lösung.** Den Satz auf die entschiedene Regel eingrenzen:
- ««Alle Gebäude» lässt 1 Gebäude aus, dessen Mietverträge in dieser Abrechnungsperiode alle schon eine Abrechnung haben.»
- ««Alle Gebäude» lässt {count} Gebäude aus, deren Mietverträge in dieser Abrechnungsperiode alle schon eine Abrechnung haben.»

Ein Szenario-Gebäude mit Mietvertrag ohne Abrechnung wäre ein deutlicheres Gegenbeispiel. Ob ein Gebäude ohne Mietvertrag auch ausgelassen werden soll, entscheidet der Product Owner. Vorschlag für ein Issue (`fachlich`, `entscheiden`): «Soll «Alle Gebäude» auch Gebäude ohne Mietvertrag in der Abrechnungsperiode auslassen?»

## V-2 (Verwalter, Minor): «Entwurf» meint auf demselben Bildschirm zwei Dinge

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:169`: «**Entwurf** | Abrechnung erstellt, noch nicht versendet. (`draft`)».
- #57, «Decided»: «Entwurf» bezeichnet nur den Abrechnungsstatus. Die Eingaben im Browser heissen «Ihre Angaben».
- Neu in Schritt 2: «Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut.» (Feature Z. 201, 210).
- Auf demselben Bildschirm: «Entwurf wiederhergestellt» und der Knopf «Entwurf verwerfen» (`messages/de.json:38,40`). Neu ist die Rückfrage «Angaben verwerfen?» mit dem Knopf «Entwurf verwerfen».

**Warum falsch.** Schritt 2 sagt jetzt «löschen Sie [den Entwurf]», und darüber steht der Knopf «Entwurf verwerfen». Wer wenig Übung hat, hält den Knopf leicht für den Weg zum Neuberechnen. Er verliert dann seine Angaben, und der neue Lauf erstellt trotzdem nichts, weil die Abrechnung im Status Entwurf noch da ist. Titel und Knopf derselben Rückfrage brauchen zudem zwei verschiedene Wörter.

**Lösung.** Im neuen Dialog den Knopf «Angaben verwerfen» nennen. Das Wort hat #57 schon entschieden, es braucht also keine neue Entscheidung, und der auslösende Knopf darf bis #57 bleiben. Oder Schritt 2 eindeutig formulieren: «Um eine Abrechnung im Status «Entwurf» neu zu berechnen, löschen Sie sie unter «Abrechnungen» und erstellen Sie die Abrechnungen erneut.» Das Gleiche gilt dann für `statements_existing_note`.

## V-3 (Verwalter, Minor): Der Satz zum Neuberechnen ist unvollständig

**Beleg.**
- Feature Z. 201 und 210: Der Satz steht immer da, auch wenn die bestehende Abrechnung versendet oder bezahlt ist.
- `messages/de.json:1092` (`statements_all_billed`): «… Versendete Abrechnungen lassen sich nicht neu berechnen.»
- Der Lösch-Schritt in Schritt 2 hat keinen Link. Die Vorschau hat einen (`statements_view_of`, `PreviewChecks.svelte:82-86`).

**Warum falsch.** Ist die Abrechnung versendet, liest der Liegenschaftsverwalter eine Anleitung, die für ihn nicht gilt. Korrigieren muss er dann ausserhalb von Dwello (`invoices_edit_billed_text`) bzw. später mit einer berichtigten Abrechnung (#120). Ausserdem erfährt er nicht, wo er löscht.

**Lösung.** Den Nachsatz aus `statements_all_billed` übernehmen («Versendete Abrechnungen lassen sich nicht neu berechnen.») und, wie in der Vorschau, auf «Abrechnungen von {name} ansehen» verlinken. Kommt «Neu berechnen» (#132), ändert sich der Satz. Den Text am besten mit einem Kommentar mit Verweis auf #132 versehen.

## V-4 (Verwalter, Minor): Der Hinweis «Es gibt schon Abrechnungen» ist nicht abgesichert

**Beleg.** Das Szenario «Bestehende Abrechnungen allein verlangen keine Bestätigung» prüft nur das Weitergehen. Kein Szenario prüft `existing-statements` (Suche nach `existing-statements|schon Abrechnungen` in `tests/e2e`: nur `invoice-edit.feature:20`, und das ist ein anderer Hinweis).

**Warum falsch.** Fällt die Bestätigung weg, ist der Hinweis die einzige Information, dass Mietverträge keine neue Abrechnung erhalten. Verschwindet er bei der Umsetzung mit, bleibt kein Test rot.

**Lösung.** Im selben Szenario vor dem Weitergehen eine Zeile ergänzen, z. B. `Dann nennt die Vorschau, dass es für "Lindenhof" in dieser Abrechnungsperiode schon 1 Nebenkostenabrechnung gibt`. Weil keine Bestätigung mehr verlangt wird, eher als Hinweis (`info`) statt `caution` zeigen. Mit M-1 bleibt der teilweise abgedeckte Fall `caution`.

## V-5 (Verwalter, Minor): #201 c ist nur indirekt geprüft

**Beleg.** Das Szenario «Angefangene Abrechnungen später fortsetzen» hat die Zeile `Wenn der Liegenschaftsverwalter weitergeht` verloren. Es prüft den Schritt nur darüber, dass die Checkbox in Schritt 2 sichtbar und angehakt ist. Für «höchstens Schritt 3» sind weder Szenario noch Test geplant (`implementation_plan.md:13`).

**Warum wichtig.** Fachlich zählt, dass ein wiederhergestellter Assistent nie in Schritt 4 oder 5 mit alter Vorschau öffnet. Inzwischen erfasste Rechnungen oder neue Abrechnungen würden sonst nicht berücksichtigt. Ausserdem überspringt ein Assistent, der in Schritt 3 öffnet, den aktuellen Hinweis «schon abgerechnet» aus Schritt 2. Umso wichtiger ist es, dass Schritt 4 den Hinweis zeigt (V-4).

**Lösung.**
- Ausdrücklich prüfen: `Dann ist der Assistent im Schritt «Gebäude»`.
- Einen Test auf tieferer Ebene oder ein Szenario ergänzen: Wer in Schritt 4 aufhört, landet in Schritt 3, und die Vorschau wird neu berechnet.

## V-6 (Verwalter, Minor): #252 betrifft auch das Datum

**Beleg.**
- `src/lib/ui/DraftNotice.svelte:21-24`: `toLocaleDateString('de-CH', …)` und `toLocaleTimeString('de-CH', …)` ohne `timeZone`. Ebenso `src/lib/ui/SaveStatus.svelte:7-9`.
- `ui_draft_back`: «zuletzt am {date} um {time} bearbeitet».
- Der Rest der App rechnet mit `Europe/Zurich` (`src/lib/utils/format.ts:50,62`).

**Warum.** Um 00:30 Schweizer Zeit (Sommerzeit) ist es 22:30 UTC am Vortag. Gezeigt würden dann das falsche Datum und die falsche Zeit.

**Lösung.** Datum und Zeit über die Formatierung in `format.ts` mit `Europe/Zurich` ausgeben. Der DOM-Test prüft einen Zeitpunkt kurz nach Mitternacht.

## V-7 (Verwalter, Nit): Die Rückfrage nennt die Folge nur zur Hälfte

**Beleg.** Design-Regeln in `CLAUDE.md`: «Irreversible actions confirm with their real consequence.» Text der Rückfrage: «Ihre Angaben werden gelöscht.»

**Warum.** Auf diesem Bildschirm geht es auch um gespeicherte Abrechnungen (V-2). Der Satz sagt nicht, dass erstellte Abrechnungen erhalten bleiben. Der Text ist entschieden, eine Änderung entscheidet der Product Owner.

**Vorschlag.** «Ihre Angaben in diesem Assistenten werden gelöscht. Erstellte Abrechnungen bleiben erhalten.» Er wäre als Kommentar in #201 oder #57 anzubringen.

## V-8 (Verwalter, Nit): Die Szenario-Zeile nennt die Angaben «Entwurf»

**Beleg.** `statement-generate.feature`, Szenario «Angefangene Abrechnungen später fortsetzen»: `Dann sieht der Liegenschaftsverwalter, dass sein Entwurf wiederhergestellt ist` (unverändert). Dagegen steht #57.

**Lösung.** Mit #57 umbenennen, z. B. in «… dass seine Angaben wiederhergestellt sind». Das muss nicht in diesem Auftrag passieren. Die neuen Zeilen verwenden «Angaben» schon richtig.

## Bestätigt

- #251, Regel: Schritt 4 verlangt die Bestätigung weiter bei fehlenden Rechnungen (`count === 0`), bei fehlenden Rechnungen einer Kategorie (`missing`, `gap`) und beim fehlenden Tankbestand (`stock`) (`statement-wizard.ts:221-222`). Die Szenarien «Warnung, wenn für ein Gebäude keine Rechnungen erfasst sind», «Hinweis auf fehlende Rechnungen einer Kategorie» und «Eine Bestätigung gilt nur für ihre Vorschau» decken «ein echter Befund fragt weiter» ab. Die Ausgangslage des neuen Szenarios entspricht der des Szenarios «Vor dem Erstellen ist klar, dass nichts verschickt wird», das ohne Bestätigung durchgeht. Der Gegensatz ist also sauber. Für ganz abgedeckte Mietverträge ist der Verzicht auf die Bestätigung fachlich richtig: Es entsteht keine doppelte Abrechnung, und die bestehende deckt die Miettage ab (siehe die Rechnung unter M-1).
- #201 a, Grammatik: «lässt 1 Gebäude aus, für das …» und «lässt {count} Gebäude aus, für die …» sind richtig, mit Schweizer Anführungszeichen. Zum Inhalt siehe V-1.
- #201 b: Der Satz «Wenn Sie es wählen, wird dafür nichts erstellt.» stimmt mit dem Code überein (`contractsInPeriod` überspringt abgerechnete Mietverträge). Der Satz zum Neuberechnen stimmt mit dem heutigen Weg überein (Löschen nur im Status Entwurf, `statement.service.ts:494`). Siehe V-2 und V-3.
- Begriffe in den neuen Zeilen: Liegenschaftsverwalter, Abrechnungsperiode, Mietvertrag, Nebenkostenabrechnung, Abrechnung, Gebäude und Entwurf (als Status) stehen in `UBIQUITOUS_LANGUAGE.md`. «Angaben» ist laut #57 bewusst kein Begriff des Glossars. «Hinweis» und «Assistent» sind gewöhnliche Wörter der Oberfläche, kein Fachbegriff.
- #252: Schweizer Zeit entspricht dem Rest der App (`format.ts`). Der Grund für «No scenario» im Plan ist nachvollziehbar.
- `docs/PRD-Dwello.md` und `docs/nebenkostenabrechnung-anforderungen.md` enthalten keine Regel zu Bestätigung, «Alle Gebäude» oder Wiederherstellen, die den Szenarien widerspricht (Suche nach trotzdem, bestätig, Alle Gebäude, wiederhergestellt, verwerfen, schon eine Abrechnung).

## Fehlende Begriffe

Keiner neu nötig. Vorschlag für ein Issue (`fachlich`, `entscheiden`) aus V-1: ob «Alle Gebäude» auch Gebäude ohne Mietvertrag in der Periode auslässt. Zu M-1 fehlt ein Umsetzungs-Issue für die Entscheidung in #199 (Done means von #199: «An implementation issue … is created»).

## Nicht bestätigt

- Die Rechtsfolge einer nie erstellten Abrechnung für Teile der Periode (Rückforderung der Akontobeiträge durch den Mieter, Verjährung): Ich habe keinen Wortlaut auf Fedlex gesucht. Belegt ist nur Art. 4 Abs. 1 VMWG (Snippet von fedlex.admin.ch über `mmx search`). **unsicher**.
- Ob das Häkchen «Alle Gebäude» angehakt angezeigt wird, wenn Gebäude ausgelassen werden. `allSelected` in `BuildingStep.svelte` verlangt heute `selected === buildings.length`, und der Task `chooseAllBuildings` verwendet `Check.the`. Das ist eine Frage der Oberfläche, nicht der Fachlichkeit. Ich habe es nur gelesen, nicht ausgeführt.
- Ob es neben #199 und #211 schon ein Umsetzungs-Issue zu #199 gibt: Ich habe nur die ersten 100 offenen Issues durchsucht (`gh api repos/rudini/Dwello/issues?state=open&per_page=100`, Suche im Text nach «#199»).
- Szenarien oder Schritte habe ich nicht ausgeführt. Die Prüfung beruht auf dem Lesen von Diff, Code und Issues.
