# Fachreview w4c, Runde 1 (Commit a7f18d2, @wip-Szenarien zu #64, #87, #55)

Gegenstand: `git diff origin/main a7f18d2 -- tests/e2e/features` (dashboard.feature, settings.feature), gelesen im Worktree `review-w4c-fach`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Mahnfrist verzögert auch die Aufgabe für eine überfällige **Rückerstattung** um 14 Tage; dort schuldet der Vermieter, eine Mahnung gibt es nicht |
| V-2 | Verwalter | Minor | Hilfetext Zahlungsfrist: Bezug «bis zu der» falsch, Rückerstattung fehlt, Begriff Zahlungsfrist (ein Datum) nicht sauber verwendet |
| V-3 | Verwalter | Minor | Hilfetext Zahlungsfrist nennt den üblichen Wert (30 Tage) nicht; erlaubt sind 7 Tage, die Anforderungen nennen «mindestens 30 Tage» |
| V-4 | Verwalter | Minor | Hilfetext Mahnfrist: sagt nicht, dass sie nur bis zur ersten Mahnstufe (Zahlungserinnerung) gilt und dass Mahnen schon vorher möglich ist; «Zahlungsfrist» mehrdeutig neben #277 |
| V-5 | Verwalter | Minor | Aufgabe zählt nur Abrechnungen nach der Mahnfrist, der Link `/statements?status=overdue` zeigt alle überfälligen: Zahl und Liste stimmen nicht überein |
| V-6 | Verwalter | Minor | `docs/nebenkostenabrechnung-anforderungen.md` sagt zweimal «nicht auf der Einstellungsseite» und kennt die Mahnfrist nicht |
| V-7 | Verwalter | Minor | Szenario «Keine Mahnung vorgeschlagen …» prüft nicht, dass die Abrechnung am Tag 14 «Überfällig» ist, obwohl der Kommentar das als Regel nennt |
| V-8 | Verwalter | Nit | Zweiter Satz des Hilfetexts Zahlungsfrist («die Übersicht zeigt jede offene Zahlungsfrist innerhalb dieser Tage») ist für Laien unklar |
| V-9 | Verwalter | Nit | Fehlermeldungen in Ordnung; bei Eingabe mit Komma oder leer fehlt eine Aussage (nur Hinweis) |

Bestätigt (ohne Befund): Grenze 14/15 Tage (Frage 2), Geltungsbereich der Mahnfrist nach einer Mahnung (Frage 3), Belegung ohne Prozent (#55), Wortlaut «Überfällig», Fehlermeldungen (Frage 1, Teil 2), Hinweis auf «ab jetzt versendete» Abrechnungen (Frage 4, mit Präzisierung in V-2).

---

## V-1 (Major): Mahnfrist darf eine Rückerstattung nicht verzögern

**Beleg.**
- `src/lib/overview.ts:111-123`: die Aufgabe `overdue` zählt `statementCounts.overdue`, also alle überfälligen Abrechnungen, auch Rückerstattungen; ihr Text (`messages/de.json:233-234`) sagt ausdrücklich: «Bei einer Rückerstattung überweisen Sie den Betrag und markieren die Abrechnung danach als bezahlt.»
- `backend/src/services/statement.service.ts:186-191, 276-282`: «Überfällig» = versendet und Frist vorbei, unabhängig vom Vorzeichen des Saldos.
- `backend/src/services/reminder.service.ts:61`: «Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.»
- Glossar «Zahlungsfrist»: «Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet».
- #64 begründet Option B mit «a Mahnung is customary only after the Mahnfrist».

**Warum falsch.** Wird die Mahnfrist wörtlich auf die ganze Aufgabe angewendet, erfährt der Vermieter erst 15 Tage nach Ablauf seiner eigenen Frist, dass er dem Mieter noch Geld schuldet. Die Mahnfrist ist eine Schonfrist für den Schuldner Mieter; bei der Rückerstattung ist der Vermieter Schuldner, und es gibt nichts zu mahnen. Aus Mietersicht: Der Mieter wartet länger auf sein Guthaben, ohne dass die App den Vermieter darauf hinweist.

**Behebung.** Die Mahnfrist gilt nur für Nachzahlungen (Saldo > 0); eine überfällige Rückerstattung bleibt ab dem Tag nach der Zahlungsfrist Aufgabe. Zusätzliches Szenario, z.B.:
```
Szenario: Überfällige Rückerstattung sofort als Aufgabe
  Angenommen "Anna Keller" hat eine versendete Abrechnung mit Rückerstattung, deren Zahlungsfrist seit 1 Tag abgelaufen ist
  Wenn der Liegenschaftsverwalter die Übersicht öffnet
  Dann nennt die Übersicht die Aufgabe "Überfällige Abrechnungen prüfen"
```
Das ist nach meiner Lesart die Absicht von #64 (es geht um den Vorschlag einer Mahnung). Liest der Aufrufer den Entscheid wörtlich (ganze Aufgabe), braucht es eine Rückfrage beim Product Owner (Kommentar in #64 oder neues Issue `fachlich`, `entscheiden`): «Gilt die Mahnfrist auch für überfällige Rückerstattungen?» Vorschlag: nein.

## V-2 (Minor): Hilfetext Zahlungsfrist, Wortlaut

**Beleg.** settings.feature, Szenario «Fristen sind erklärt»: «Anzahl Tage nach dem Versand, bis zu der der Mieter die Abrechnung bezahlen muss.» Glossar: «Zahlungsfrist: Datum, bis zu dem die Abrechnung bezahlt sein muss. Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet». Code: Frist = Versanddatum + `payment_deadline_days`, nie früher als eine schon gesetzte Frist (`backend/src/services/statement.service.ts:448-453`, `datedToday`).

**Warum falsch.** (a) «bis zu der» bezieht sich grammatisch auf «Anzahl» und ergibt keinen Sinn; gemeint ist das Datum. (b) Die Rückerstattung fehlt, obwohl dieselbe Einstellung sie steuert (Glossar). (c) Die Zahlungsfrist ist im Glossar ein Datum; die Einstellung ist die Anzahl Tage bis zu diesem Datum.

**Behebung (Vorschlag, beantwortet auch Frage 4):**
«Anzahl Tage vom Versand bis zur Zahlungsfrist. Bis dann bezahlt der Mieter eine Nachzahlung, oder Sie überweisen eine Rückerstattung. Üblich sind 30 Tage. Gilt für Abrechnungen, die Sie ab jetzt versenden. Die Frist einer einzelnen Abrechnung ändern Sie dort mit «Frist und Bemerkungen bearbeiten».»

Zu Frage 4: Ja, der Hinweis gehört hinein; er stimmt mit dem Code überein (die Frist wird beim Versand gesetzt, auch ein Entwurf erhält beim Versand die neue Vorgabe; schon versendete Abrechnungen ändern sich nicht). Der Button heisst nicht «Bearbeiten», sondern «Frist und Bemerkungen bearbeiten» (`messages/de.json:1027`, `src/routes/statements/[id]/+page.svelte:186`); der Hilfetext muss diesen Namen verwenden.

## V-3 (Minor): üblicher Wert fehlt, Untergrenze 7 Tage

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:45`: «Zahlungsfrist für Nachzahlung: mindestens 30 Tage (HEV Zürich, mit Verweis auf Bundesgerichtspraxis); Mieterverband: «je nach Usanz etwa 30 Tage»» (dort selbst unsicher-B). `backend/src/services/config.service.ts:74-78`: 7–90.

**Warum.** Ein unerfahrener Vermieter könnte 10 Tage wählen; das widerspricht der in den Anforderungen dokumentierten Praxis und lässt dem Mieter kaum Zeit, Belege einzusehen. Rechtswidrig ist es nicht belegbar (das zitierte Urteil wurde nicht gefunden), deshalb nicht Major.

**Behebung.** Im Hilfetext «Üblich sind 30 Tage.» (in V-2 enthalten). Ob die Untergrenze 7 bleibt, ist Sache des Product Owners; falls gewünscht, Kommentar in #87 statt neues Issue.

## V-4 (Minor): Hilfetext Mahnfrist

**Beleg.** Szenario: «Anzahl Tage nach Ablauf der Zahlungsfrist, bis die Übersicht eine Mahnung vorschlägt. Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist.» Glossar: «Mahnfrist: Anzahl Tage nach Ablauf der Zahlungsfrist bis zur Mahnung.» «Mahnstufe: Zahlungserinnerung (1. Stufe), 2. Mahnung, 3. Mahnung.» #107 (Entscheid): «the Mahnfrist plays no part for the next Mahnstufe». #277 (offen): «Zahlungsfrist» einer Mahnung ist noch nicht im Glossar.

**Warum.** Der Text ist glossarkonform und inhaltlich richtig. Es fehlen aber zwei Dinge, die ein Laie braucht: (a) dass die Frist nur bis zur ersten Mahnung gilt (danach entscheidet die Zahlungsfrist der Mahnung, #107); (b) dass sie keine gesetzliche Wartefrist ist: Nach Art. 102 Abs. 1 OR (Fedlex, SR 220): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Mahnen darf der Vermieter also ab Fälligkeit; der Mahnung-Knopf ist schon ab «Überfällig» aktiv (`reminder.service.ts:60`). Ohne Hinweis könnte der Vermieter meinen, er dürfe erst nach 14 Tagen mahnen. Solange #277 offen ist, sollte «Zahlungsfrist» hier eindeutig die der Abrechnung meinen.

**Behebung (Vorschlag):**
«Anzahl Tage nach der Zahlungsfrist der Abrechnung, bis die Übersicht eine Zahlungserinnerung vorschlägt. Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist; mahnen können Sie ab dann. Die nächste Mahnung schlägt die Übersicht nach der Zahlungsfrist der letzten Mahnung vor.»
(Bei Annahme von V-1 zusätzlich: «Eine Rückerstattung zeigt die Übersicht schon ab dem Tag nach der Zahlungsfrist.») Der letzte Satz verwendet «Zahlungsfrist der Mahnung» wie die App heute (`documents_payment_deadline`); ändert #277 den Begriff, ändert er hier mit.

## V-5 (Minor): Zahl in der Aufgabe und Liste passen nicht zusammen

**Beleg.** Szenario «Aufgabe führt zu den betroffenen Abrechnungen» endet auf «Nebenkostenabrechnungen»; Ziel ist `/statements?status=overdue` (`overview.ts:121`). Die Aufgabe zählt künftig nur Abrechnungen nach der Mahnfrist, der Filter zeigt alle überfälligen. Text: «{count} Nebenkostenabrechnung ist über der Zahlungsfrist» (`messages/de.json:233`).

**Warum.** Hat der Vermieter eine Abrechnung 20 Tage und eine 3 Tage über der Frist, sagt die Aufgabe «1 … über der Zahlungsfrist», die Liste zeigt 2. Dasselbe Muster besteht schon seit #107 (laufende Frist einer Mahnung), wird durch #64 aber häufiger sichtbar.

**Behebung.** Entweder der Text sagt, was gezählt wird («{count} Nebenkostenabrechnung ist seit mehr als {Mahnfrist} Tagen über der Zahlungsfrist» bzw. «… kann gemahnt werden»), oder die Liste markiert, welche Abrechnungen eine Mahnung erwarten. Mindestens die Textanpassung im selben Change, in allen vier Sprachen.

## V-6 (Minor): Anforderungsdokument veraltet

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:45` und `:151`: «`payment_deadline_days` (Vorgabe 30, nicht auf der Einstellungsseite)». Die Mahnfrist fehlt dort ganz.

**Behebung.** Beide Stellen anpassen («auf der Einstellungsseite, 7–90 Tage»), und die Regel aus #64 eintragen: Übersicht schlägt die erste Mahnung ab dem Tag nach Zahlungsfrist + Mahnfrist vor (`reminder_after_days`, 7–60, Vorgabe 14); danach gilt #107.

## V-7 (Minor): Status «Überfällig» während der Mahnfrist nicht geprüft

**Beleg.** dashboard.feature, Kommentar «F-10a (#64): «Überfällig» ab dem Tag nach der Zahlungsfrist, die Mahnung erst nach der Mahnfrist»; das Szenario prüft nur Frist-Text und fehlende Aufgabe.

**Warum.** Der Entscheid hält ausdrücklich fest, dass der Status unverändert bleibt. Eine Umsetzung, die den Status mitverschiebt, würde das Szenario bestehen.

**Behebung.** Schritt ergänzen, z.B. «Und die Abrechnung von "Anna Keller" hat den Status "Überfällig"» (bestehenden Schritt aus `statements*.feature` wiederverwenden), oder auf tieferer Ebene testen.

## V-8 (Nit): «innerhalb dieser Tage»

**Beleg.** «… die Übersicht zeigt jede offene Zahlungsfrist innerhalb dieser Tage.» Code: angezeigt werden Fristen, die in höchstens X Tagen ablaufen, und alle abgelaufenen (`overview.ts:238`, `days <= WINDOW`).

**Warum.** Liest sich, als zeige die Übersicht abgelaufene Fristen nicht. Für den Vermieter ist das Fenster ein Detail.

**Behebung.** Satz weglassen (Vorschlag in V-2) oder «Die Übersicht zeigt jede Zahlungsfrist, die in dieser Zeit abläuft oder schon abgelaufen ist.»

## V-9 (Nit): Fehlermeldungen

«Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.» und «Geben Sie für die Mahnfrist 7 bis 60 Tage ein.»: glossarkonform, Sie-Form, sagen was zu tun ist; Bereiche stimmen mit `config.service.ts:74-83` überein. Hinweis: Für leere Eingabe oder Dezimalzahlen («14.5») passt dieselbe Meldung nur, wenn sie dafür ebenfalls verwendet wird; sonst «Geben Sie eine ganze Zahl von 7 bis 90 ein.» Kein Szenario nötig, Test auf tieferer Ebene.

---

## Bestätigt

**Frage 2, Grenze.** Lesart «ab dem Tag nach Zahlungsfrist + Mahnfrist» ist richtig: Glossar «Anzahl Tage nach Ablauf der Zahlungsfrist bis zur Mahnung»; gleiche Zählweise wie «Überfällig» (ab dem Tag nach der Frist) und wie #107 (nächste Mahnstufe ab dem Tag nach der Frist der Mahnung). Nachgerechnet mit Zahlungsfrist D, Mahnfrist M, Aufgabe genau dann, wenn heute > D + M:
- M = 14, D = 01.10.: 15.10. (seit 14 Tagen) keine Aufgabe, 16.10. (seit 15 Tagen) Aufgabe. Entspricht den Szenarien (Schritt setzt die Frist auf heute − n, `dashboard.steps.ts:35-45`; Anzeige `daysFrom` ergibt «seit n Tagen»).
- M = 7 (Untergrenze): D + 7 keine, D + 8 Aufgabe.
- M = 30, D = 31.01.2027: D + 30 = 02.03.2027 keine, 03.03.2027 Aufgabe (Monatswechsel über Februar).
- Tag der Zahlungsfrist selbst (seit 0 Tagen): weder überfällig noch Aufgabe.
- Saldo 0: hat keine offene Frist (Kommentar `dashboard.steps.ts:34`), nicht betroffen.

**Frage 3, nach einer Mahnung.** Konsistent und bereits entschieden: #107 «the Mahnfrist plays no part for the next Mahnstufe (it decides only when the overview first proposes a Mahnung, #64)». Beispiel: Mahnung am Tag D + 3 (während der Mahnfrist) → Frist der Mahnung D + 13 (`PAYMENT_DAYS = 10`, `reminder.service.ts:29,79`) → nächste Mahnstufe ab D + 14 vorgeschlagen, auch wenn D + M noch nicht erreicht wäre. Die Umsetzung braucht also: ohne Mahnung heute > D + M; mit Mahnung heute ≥ `nextReminderFrom`. Praxisüblich (Mahnstufen im Abstand von rund 10 Tagen). #277 betrifft nur den Begriff für die Frist der Mahnung (Auswirkung auf den Hilfetext, siehe V-4), #278 nur, ob eine noch nicht versendete Mahnung die nächste Stufe sperrt; keines ändert, dass die Mahnfrist nur vor der ersten Mahnung gilt.

**Frage 1, Begriffe.** «Zahlungsfrist», «Mahnfrist», «Überfällig», «Mahnung» werden im Sinn des Glossars verwendet (Zeilen 172, 181-184); Feldnamen «Zahlungsfrist (Tage)», «Mahnfrist (Tage)» passen zu den Code-Spalten `payment_deadline_days`, `reminder_after_days`. Wortlaut-Befunde nur in V-2, V-4, V-8.

**#55, Belegung.** «x/y vermietet» verwendet das Glossarwort «Vermietet» (Mietstatus); kein neuer Begriff, Glossar unverändert, wie entschieden. Szenario prüft «1/2» und das Fehlen eines Prozentanteils; die Erklärung zur leeren Wohnung bleibt.

## Fehlende Begriffe

Keiner zwingend. Falls V-5 mit neuem Text gelöst wird, bleibt es bei Glossarwörtern. Der Begriff «Zahlungsfrist einer Mahnung» ist bereits in #277 offen (kein neues Issue).

## Nicht bestätigt

- **Art. 102 Abs. 2 OR** (Verfalltag): nur über Sekundärquellen gefunden (mmx-Suche; Fedlex-Treffer zeigte nur Abs. 1 im Wortlaut). Ob ein einseitig auf der Abrechnung gesetztes «zahlbar bis» ein «verabredeter Verfalltag» ist (dann Verzug ohne Mahnung): **unsicher**; für die Befunde nicht nötig, weil Art. 102 Abs. 1 das frühe Mahnen schon trägt.
- **Übliche Mahnfrist in der Verwalterpraxis** (10–30 Tage): keine Quelle gesucht/gefunden; Vorgabe 14 und Bereich 7–60 sind Produktentscheid (#64, #87), nicht fachlich belegt.
- **Mindestens 30 Tage Zahlungsfrist:** in den Anforderungen selbst als unsicher-B geführt (BGer-Urteil nicht gefunden); nicht erneut geprüft.
- Ob die Liste «Nebenkostenabrechnungen» oder die Abrechnungsseite während der Mahnfrist einen Mahnungs-Hinweis zeigt (#107 verlangte «overview and statement list do not propose a Mahnung before that date»): nicht im Code der Liste geprüft; #64 regelt nur die Übersicht.
- Französische, italienische und englische Texte: noch keine vorhanden (Workflow-Schritt 1), nicht geprüft.
