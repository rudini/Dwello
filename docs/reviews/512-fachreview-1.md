# Fachreview #512, Runde 1 (Szenarien @wip, Commit 4d12e4b, mit der Korrektur des Koordinators: ganze Periode ab ihrem ersten Tag, «01.07.2023 – 30.06.2024», Klick ab "2023-07-01")

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die geplante Regel nimmt die «letzte Abrechnung eines anderen Typs» als Wechselpunkt. Der Entscheid nennt aber die erste Abrechnung unter der neuen Einstellung. Eine einzelne abweichende Abrechnung (ein Mietvertrag nach seiner eigenen Abrechnungsperiode, wie es der Hinweis #486 rät) oder ein Gebäude, das zur alten Einstellung zurückkehrt, schneidet dann die ganze Vergangenheit des Gebäudes falsch. |
| V-2 | Verwalter | Major | Kein Szenario prüft den entschiedenen Punkt, dass der Hinweis `statements_short_period_help` bei alten Perioden nicht erscheint. Im Szenario 1 steht er einmal unter allen Zeilen, also auch unter der alten Periode. |
| V-3 | Verwalter | Minor | `missingByContract` (`backend/src/services/statement-run.service.ts:117`) bekommt nur die Abrechnungen des eigenen Mietvertrags. Den alten Typ aus diesen zu lesen, liefert in der Übersicht und in der Mietvertragsliste etwas anderes als auf dem Mietvertrag, wenn die Abrechnung einem anderen Mietvertrag gehört. Das Szenario in `dashboard.feature` nutzt Brunos eigene Abrechnung und deckt diesen Fall nicht ab. Lösung: den alten Typ aus den Abrechnungen des Gebäudes bestimmen und dafür einen `*.pg.test.ts` oder eine Szenario-Variante mit der Abrechnung eines anderen Mietvertrags schreiben. |
| V-4 | Verwalter | Minor | Nach zwei Wechseln (z.B. Kalenderjahr, dann November – Oktober, jetzt Juli – Juni) kennt die Regel nur einen alten Typ. Die Lücken vor dem ersten Wechsel schneidet sie nach dem zweiten Typ statt nach dem Kalenderjahr. Lösung: Jede beendete Periode vor einer ganzen Abrechnung folgt dem Typ der nächsten ganzen Abrechnung des Gebäudes danach. Selten; der Verwalter kann die Periode im Assistenten ändern. |

## V-1 (Major): Wechselpunkt nach dem Entscheid statt nach der letzten Abrechnung eines anderen Typs

**Beleg.** Der Entscheid in #512 sagt: «Before the first statement under the new setting, the ended periods follow the periods of the building's existing statements». Der Plan sagt dagegen: «Find the building's latest statement … whose Abrechnungsperiode is a whole period of a type other than the current setting». Die Regel stimmt im Beispiel des Issues (Weber), in Szenario 1 und im Szenario der Übersicht, weil es dort keine Abrechnung nach der aktuellen Einstellung gibt. Sie weicht ab, sobald es eine gibt.

**Fall a, ein Mietvertrag mit eigener Abrechnungsperiode.** Das ist realistisch, denn `statements_short_period_help` (#486) rät genau dazu: «Bis dahin rechnen Sie nach der Abrechnungsperiode im Mietvertrag ab». Ausgangslage:
- Einstellung Kalenderjahr, Gebäude mit den Abrechnungen 2023 und 2024.
- Mietvertrag X steht im Vertrag auf Juli – Juni; abgerechnet sind 01.07.2023 – 30.06.2024 und 01.07.2024 – 30.06.2025.
- Der neue Mieter Y wohnt seit 01.04.2024 und hat noch keine Abrechnung.

Die geplante Regel gibt:
- alter Typ Juli – Juni, Ende 30.06.2025;
- Y bekommt «Abrechnungsperiode 01.07.2023 – 30.06.2024 wählen» und «… 01.07.2024 – 30.06.2025 wählen»;
- danach eine Periode ab 01.07.2025.

Richtig wäre «2024 abrechnen» wie für alle anderen Mietverträge: Der Lauf 2024 nähme Y dazu. Heute (Schnitt nach der Einstellung) ist das so. Die Regel verschlechtert also einen Fall, der heute stimmt.

**Fall b, Rückwechsel.** Ausgangslage:
- Abrechnungen Kalenderjahr 2019–2021, kurze Abrechnungsperiode 01.01.2022 – 30.06.2022, danach Juli – Juni 2022/23 und 2023/24.
- Die Einstellung steht wieder auf Kalenderjahr.

Die Regel schneidet alles bis 30.06.2024 nach Juli – Juni. Ein Mietvertrag mit einer Lücke im Jahr 2020 bekommt deshalb 01.07.2019 – 30.06.2020 und 01.07.2020 – 30.06.2021. Diese Perioden überschneiden die Kalenderjahr-Abrechnungen 2019, 2020 und 2021, obwohl 2020 nach dem Kalenderjahr abgerechnet wurde.

**Lösung (ist der Wortlaut des Entscheids):**
- S = die früheste ganze Abrechnung des Gebäudes nach dem Typ der aktuellen Einstellung (ersetzte eingeschlossen).
- Alt sind nur die ganzen Abrechnungen eines anderen Typs, die vor S beginnen. Gibt es kein S, sind es alle ganzen Abrechnungen eines anderen Typs.
- Der alte Typ ist der Typ der letzten dieser Abrechnungen. Geschnitten wird bis zu ihrem Ende, danach gilt die Einstellung wie geplant.

Ergebnis: In Fall a gibt es keine alte Abrechnung, und Y bekommt 2024. In Fall b gilt durchgehend das Kalenderjahr; die Lücken aus der Zeit von Juli – Juni laufen über die bestehenden Wege («wählen» bzw. kurze Abrechnungsperiode). Szenario 1, Übersicht und Weber bleiben gleich. Fall a gehört als Unit-Test zu `missingWays` dazu.

## V-2 (Major): Der entschiedene Punkt zum Hinweis #486 hat kein Szenario

**Beleg.**
- Entscheid: «The general text … and the hint `statements_short_period_help` (#486) must not appear for old periods as if the change applied to them.»
- `src/routes/contracts/[id]/MissingStatement.svelte:79-82` zeigt den Hinweis einmal unter allen Zeilen, sobald irgendeine Zeile den Weg `short` hat.
- In Szenario 1 (korrigiert) stehen die Zeilen «01.07.2023 – 30.06.2024 abrechnen» (alt) und «Kurze Abrechnungsperiode 01.07.2025 – 31.12.2025 abrechnen» (Wechsel). Der Hinweis erscheint zu Recht wegen der kurzen Periode, steht aber unter beiden Zeilen. Das ist genau das «as if», das der Entscheid ausschliesst.
- Kein Szenario prüft, dass der Hinweis fehlt, wenn nur alte Perioden fehlen. Auf dem Basis-Commit erscheint er dort (bei Anna würden die Tage 01.04.–30.06.2024 heute eine kurze Abrechnungsperiode 01.01.2024 – 30.06.2024), ein solches Szenario wäre also rot.

**Lösung.**
1. Ein neues @wip-Szenario in `contract-detail.feature`. Ein beendeter Mietvertrag mit nur einer alten Lücke, z.B. «Ben Meier» mietete "2.02" von "2022-07-01" bis "2024-06-30", mit der Abrechnung "2023-07-01" bis "2024-06-30". Prüfen: «bietet der Mietvertrag für die Tage ab "2022-07-01" "01.07.2022 – 30.06.2023 abrechnen" an» und ein neuer Schritt «Und rät der Mietvertrag nichts zur Abrechnungsperiode im Mietvertrag» (`contract-missing-statement-short-help` nicht sichtbar).
2. Für Szenario 1 entweder den Hinweis in die Zeile der kurzen Abrechnungsperiode verschieben (je Zeile mit `way.kind === 'short'`) und dies mit einem Schritt prüfen, oder ausdrücklich festhalten, dass der Hinweis unter der Liste genügt. Die Platzierung ist eine UI-Änderung und braucht dann Persona-Lauf und a11y-Zustand.

Der allgemeine Text «mit welcher Periode Sie beginnen, spielt keine Rolle» bleibt mit der Regel wahr. Die Reihenfolge, in der der Verwalter die Abrechnungen erstellt, ändert den Schnitt nicht, denn eine kurze Abrechnungsperiode ist keine ganze Periode und zählt nicht als alt. Er braucht keine Änderung.

## Begriffe (Vorschlag für ein Issue, Labels `domain`, `needs-decision`)

`UBIQUITOUS_LANGUAGE.md`, Zeile «Hinweis auf fehlende Abrechnungen» bzw. «Tage ohne Abrechnung»: Die Zeilen sagen nicht, nach welchen Abrechnungsperioden geschnitten wird. Vorschlag für einen Satz am Ende von «Hinweis auf fehlende Abrechnungen»: «Die beendeten Abrechnungsperioden schneidet er nach der Einstellung «Abrechnungsperiode»; vor einem Wechsel der Einstellung, also bis zum Ende der letzten Abrechnung des Gebäudes nach einer anderen Abrechnungsperiode vor der ersten nach der Einstellung, nach den Abrechnungsperioden der bestehenden Abrechnungen (#512).»

## Nicht bestätigt

- **Zwei Lesarten des Entscheids bei einer Lücke zwischen der letzten alten und der ersten neuen Abrechnung.** Beispiel: Juli – Juni bis 30.06.2023, danach erst Kalenderjahr 2025. Der Plan schneidet ab 01.07.2023 nach der Einstellung (kurze Abrechnungsperiode 01.07.–31.12.2023, dann 2024). «Before the first statement under the new setting» liesse auch Juli – Juni 2023/24 und eine kurze Abrechnungsperiode 01.07.–31.12.2024 zu. Der Satz «after them the current setting applies» stützt den Plan, der Entscheid spricht diesen Fall aber nicht an. Gesucht im Issue #512 (Body), in `UBIQUITOUS_LANGUAGE.md`, `docs/PRD-Dwello.md` (dort nichts zu einem Wechsel der Einstellung) und `docs/nebenkostenabrechnung-anforderungen.md` Z. 32 («Rumpfperiode beim Wechsel», ohne Zeitpunkt).
- **Art. 269d Abs. 3 OR beim Wechsel der Abrechnungsperiode.** Der Wortlaut (Fedlex, Stand 1.10.2026) lautet: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» Er nennt den Wechsel der Abrechnungsperiode nicht; ob dieser stets «zu Lasten des Mieters» geht, ist **unsicher**. Das betrifft den Text #486, der nicht Gegenstand dieser Prüfung ist.

Geprüft:
- Szenario 1 (korrigiert), Szenario 2 und das Szenario der Übersicht, nachgerechnet mit Stichtag 28.10.2026: Anna hat 01.07.2023 – 30.06.2024 ganz, kurze Abrechnungsperiode 01.07.2025 – 31.12.2025, 2026 noch nicht beendet. Bruno hat 01.07.2022 – 30.06.2023; nach dem 30.06.2024 nichts mehr, weil der Mietvertrag endet. Alle drei sind auf dem Basis-Commit rot.
- Bestehende Szenarien bleiben unter der Regel gleich: «Fehlende Tage in der Abrechnungsperiode eines anderen Mietvertrags» (bei Sonderfall «wählen» mit den Tagen des Mietvertrags), «Teilweise abgerechnete Periode» (keine ganze Periode) und «Erinnerung nennt nur die Tage ohne Abrechnung» (01.07.2023 – 31.12.2023).
- Gebäude ohne Abrechnung folgt der Einstellung.
- Die kurze Abrechnungsperiode beim Wechsel ist nie länger als zwölf Monate. Das entspricht Art. 4 Abs. 1 VMWG (Fedlex, Stand 1.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- Der Hinweis #486 ist bei der Periode ab dem Wechsel richtig.
- Nur die drei Typen der Einstellung als alter Typ zu erkennen genügt, weil die Einstellung nie einen anderen Typ hatte.
