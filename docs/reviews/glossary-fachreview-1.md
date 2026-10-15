# Fachreview Runde 1: Glossar nur Definitionen (#188, Entscheid #187 Option A)

Geprüft: `git diff 18be333 2562751` im Worktree `review-glossary-fach` (Commit 2562751), Issues #187, #188 und der Entscheid-Kommentar auf #188. Gesetzestexte von Fedlex (Filestore, VMWG Stand 1.10.2025, OR Stand 1.10.2026), wörtlich zitiert.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| GF-1 | Verwalter | Major | Regel 5 «Ihr Anteil» gibt die Formel «Mietstage / Tage der Periode» an; bei einer Rechnung mit Leistungszeitraum rechnet der Code anders. Die Regel widerspricht dem Szenario `statement-generate.feature:71`. |
| GF-2 | Mietrecht | Major (Entscheid Product Owner) | Die Verwaltungspauschale gilt für jeden Mietvertrag des Laufs, ohne Prüfung der Vereinbarung (Entscheid b). Das Risiko nach Art. 257a Abs. 2 OR ist nur über einen Hilfetext abgefedert. |
| GF-3 | Verwalter | Minor | Vordefinierte Heizprofile: «ihr Name lässt sich ändern» gilt nur über die API. Formular und Szenario lassen keine Bearbeitung zu. |
| GF-4 | Verwalter | Minor (entscheiden) | IBAN: PRD:714 nennt «CH oder LI», das Einstellungsformular nimmt nur CH an. Die verschobene Glossarregel stützt sich auf eine Stelle, die dem Code widerspricht. |
| GF-5 | Verwalter | Minor | Zahlungsfrist: «in den Einstellungen gewählte Anzahl Tage». Die Einstellungsseite bietet `payment_deadline_days` gar nicht an. |
| GF-6 | Verwalter | Minor | Regel 10 «Tankbestand und Stichtag» lässt weg, dass ohne beide Bestände der Einkauf statt des Verbrauchs abgerechnet wird. |
| GF-7 | Verwalter | Minor | Die Glossardefinition «Stichtag» («zu Beginn der Abrechnungsperiode») ändert die Bedeutung. Der Code nimmt den Bestand vom Vortag, ein Bestand vom 1.1. zählt nicht. |
| GF-8 | Verwalter | Nit | Regel 3 «Kündigungsfrist» lässt den heute schon gezeigten allgemeinen Hinweis weg (Glossar alt: «weist darauf hin»). |
| GF-9 | Verwalter | Nit | Regel 6 sagt «zusammen genau 100 %», der Code lässt ±0,1 % zu. |
| GF-10 | Verwalter | Nit | Die Glossardefinition «Saldo» sagt nicht mehr, dass er gerundet ist. Der Code (`balance`) und Regel 8 meinen den gerundeten Betrag. |
| GF-11 | Mietrecht / Verwalter | Nit (zur Kenntnis Product Owner) | Leerstand ohne die Ausnahme nach Art. 7 Abs. 2 VMWG ist rechtlich unbedenklich (zugunsten der Mieter), kostet den Vermieter aber Geld. |

## Befunde

### GF-1 (Major): Regel 5 nennt eine falsche Formel für Rechnungen mit Leistungszeitraum

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:145`: «Der Mieter trägt vom Wohnungsanteil den Teil seiner Mietstage (Mietstage / Tage der Periode).»
Der Code in `backend/src/services/calculation.service.ts:127-136` (`rentalShare`) rechnet je Rechnung mit `days(Mietbeginn∩Rechnungszeitraum) / days(Rechnungszeitraum in der Periode)`. Der Zeitraum kommt aus `inPeriod` (`invoice.service.ts:420-430`): ohne Leistungszeitraum die ganze Periode, mit Leistungszeitraum nur dessen Tage in der Periode.
Szenario `tests/e2e/features/statement-generate.feature:69-75`: Hauswart 900 Franken für 01.10.–31.12.2024, Marc Huber ab 01.05.2024. Erwartet werden «CHF 927.00» für Marc Huber und «CHF 0.00» für Eva Frei.

**Nachgerechnet** (eine Wohnung im Gebäude, Wohnungsanteil = 900, Periode 2024 = 366 Tage):
- Code bzw. Szenario: Marc trägt 900 × 92/92 = 900.00, mit 3 % Verwaltungspauschale 927.00 (stimmt). Eva (bis 31.03.) trägt 0.
- Formel aus Regel 5: Marc trägt 900 × 245/366 = 602.46, mit 3 % = 620.53. Eva trägt 900 × 91/366 = 223.77. Beides widerspricht dem Szenario.
- Gegenprobe ohne Leistungszeitraum: Rechnung 1000 Franken vom 15.06.2024. Code und Regel 5 ergeben beide 1000 × 245/366 = 669.40. Die Regel stimmt also nur ohne Leistungszeitraum.

**Warum falsch.** Die alte Glossarregel war unbestimmt («den Teil seiner Mietstage»). Die neue Regel macht daraus eine Formel, die dem Code und dem Szenario widerspricht. Wer nach der Regel nachrechnet (`daten-pruefer`, Verwalter), hält richtige Abrechnungen für falsch.

**Korrektur.** Vorschlag für Regel 5: «Der Mieter trägt vom Wohnungsanteil den Teil der Tage, die die Rechnung in der Periode abrechnet und in denen er gemietet hat: ohne Leistungszeitraum Mietstage / Tage der Periode, mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode (Regel 1; Szenario `statement-generate.feature`, «Eine Rechnung gilt für ihren Leistungszeitraum»).»

### GF-2 (Major, Entscheid Product Owner): Verwaltungspauschale ohne Prüfung der Vereinbarung

**Beleg.**
- `docs/nebenkostenabrechnung-anforderungen.md:149` (Regel 9), `:59` und `docs/PRD-Dwello.md:476` beschreiben den Code richtig.
- `calculation.service.ts:338-339` wendet den Satz des Laufs auf jeden Mietvertrag an.
- Szenario `statement-generate.feature:46` («Erhöhte Verwaltungspauschale gilt für alle Mieter der Liegenschaft»), nachgerechnet: Eva 43 % × 1000 = 430 × 1.045 = 449.35, Marc 52 % × 1000 = 520 × 1.045 = 543.40 (stimmt).
- Die Glossardefinition `UBIQUITOUS_LANGUAGE.md:133` sagt weiterhin «Nur zulässig, wenn im Mietvertrag vereinbart».

Fedlex, OR Art. 257a Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
VMWG Art. 4 Abs. 3: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»

**Warum ein Befund.** Die Dokumentation beschreibt den Code richtig, wie auf #188 entschieden. Rechtlich bleibt das Risiko: Hat ein Mietvertrag keine Verwaltungspauschale vereinbart, stellt Dwello mit dem Vorschlag von 3 % eine Forderung, die der Mieter nicht schuldet. Abgefedert ist das nur über den Hilfetext `statements_fee_help` («Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein. Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf …»). Das Problem bestand schon vor dieser Änderung. Es ist deshalb kein Blocker für #188, aber offene Arbeit mit Entscheid.

**Korrektur.**
- In Regel 9 den Umweg nennen: «Gilt für einen Mietvertrag ein anderer Satz oder keiner, löscht der Verwalter dessen Entwurf und erstellt ihn mit diesem Satz neu.»
- Für den Product Owner: ein Issue (`fachlich`, `entscheiden`) «Verwaltungspauschale pro Mietvertrag vereinbaren». Vorgeschlagener Begriff: **Vereinbarte Verwaltungspauschale**, der im Mietvertrag vereinbarte Satz (oder keiner), den der Abrechnungslauf je Mietvertrag übernimmt.

### GF-3 (Minor): Name vordefinierter Heizprofile «lässt sich ändern»

**Beleg.**
- `docs/nebenkostenabrechnung-anforderungen.md:146` und `docs/PRD-Dwello.md:450`: «their name can».
- Das Backend erlaubt es (`heating-profile.service.ts:212-221`, gesperrt sind nur die Monatsanteile und das Löschen, `:257`).
- Das Formular sperrt die ganze Bearbeitung: `src/routes/config/heating-profiles/[id]/edit/+page.server.ts:9` (`if (profile.type === 'predefined') throw error(403, m.profiles_predefined_not_editable())`).
- Szenario `heating-profiles.feature:52-55`: «Dann kann der Liegenschaftsverwalter das Heizprofil weder bearbeiten noch löschen».
- Hilfetext `messages/de.json:1163`: «Vordefinierte Heizprofile können nicht bearbeitet werden».

**Warum falsch.** Für den Nutzer stimmt der Satz nicht. Entscheid (c) deckt das Verhalten des Backends, nicht das der App.

**Korrektur.** So formulieren wie bei Entscheid (d): «Die App bietet für vordefinierte Heizprofile keine Bearbeitung an; die API nimmt eine Namensänderung an, keine Änderung der Monatsanteile und kein Löschen.» Den Product Owner fragen, ob Entscheid (c) so gemeint war.

### GF-4 (Minor, entscheiden): IBAN «CH oder LI»

**Beleg.**
- Die Glossarregel «beginnt mit CH oder LI» wurde entfernt. Als ihr Ort gilt `docs/PRD-Dwello.md:714` («Validation that the IBAN is Swiss or Liechtenstein (starts with CH or LI)»).
- Das Backend nimmt LI an (`qr-bill.service.ts:99`).
- Das Einstellungsformular weist LI ab: `src/lib/server/settings.ts:42` (`/^CH\d{19}$/`, Prüfziffer nur mit Ländercode CH = 1217, `:24-25`).

**Warum ein Befund.** #188 «Stop and ask»: Widerspricht eine Glossarregel dem Code, wird gefragt. Hier steht die Regel nun an einer Stelle, die der App widerspricht. Ein Vermieter mit Liechtensteiner Konto kann seine IBAN nicht speichern. Der Widerspruch bestand schon vorher.

**Korrektur.** Entweder PRD:714 ergänzen («das Formular nimmt nur CH an») oder ein Issue (`bug` oder `fachlich`, `entscheiden`) für LI im Formular eröffnen. Fachlich ist LI für QR-Rechnungen zulässig (SIX, hier nicht im Wortlaut geprüft).

### GF-5 (Minor): Zahlungsfrist «in den Einstellungen gewählt»

**Beleg.**
- `docs/nebenkostenabrechnung-anforderungen.md:44` und `:151` (Regel 11) sowie `docs/PRD-Dwello.md:515` («setting, default 30 days»).
- Die Einstellungsseite kennt den Schlüssel nicht: `src/lib/server/settings.ts:8-18` (KEYS ohne `payment_deadline_days` und ohne `reminder_after_days`). Szenarien in `settings.feature` gibt es dazu keine.
- Code: `statement.service.ts:314, 338, 434-437`, Vorgabe 30, nie kürzer als eine schon gesetzte Frist (stimmt).
- `PRD-Dwello.md:1059-1061` («Tab 4: Payment Settings») beschreibt eine Seite, die es nicht gibt.

**Korrektur.** «Versanddatum plus 30 Tage (Konfiguration `payment_deadline_days`, nur über die API änderbar, 7–90)», ebenso für `reminder_after_days` in PRD:516 und :1061.

### GF-6 (Minor): Regel 10 lässt den Fall ohne Bestände weg

**Beleg.**
- `docs/nebenkostenabrechnung-anforderungen.md:52` und `:150`.
- Code `fuel-stock.service.ts:72-74`: Fehlt der Bestand am Vortag oder am letzten Tag, gibt es keine Bestandesänderung. Dann zählen die Lieferungsrechnungen als Kosten der Periode, also der Einkauf.
- `periodReadings` (`:35-42`) verlangt einen Bestand genau an diesen zwei Tagen und meldet die fehlenden.
- Hilfetext `statements_tank_text` (`messages/de.json:978`) sagt es: «sonst rechnet Dwello den Einkauf ab statt den Verbrauch».

Fedlex, VMWG Art. 5 Abs. 2 lit. a: «die Brennstoffe und die Energie, die verbraucht wurden».

**Warum ein Befund.** Es ist eine Rechenregel mit direkter Wirkung auf den Betrag. Ohne die Bestände rechnet Dwello den Einkauf ab statt des Verbrauchs, was Art. 5 Abs. 2 lit. a VMWG nicht entspricht. Die Vorschau warnt davor, die Regel muss es nennen.

**Korrektur.** An Regel 10 anhängen: «Fehlt einer der beiden Bestände, rechnet Dwello die Lieferungen der Periode ab (Einkauf statt Verbrauch); die Vorschau meldet den fehlenden Bestand.»

### GF-7 (Minor): Glossardefinition «Stichtag» ändert die Bedeutung

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:117` neu: «Der Tankbestand zu Beginn der Abrechnungsperiode heisst Anfangsbestand, der an ihrem Ende Endbestand.»
- Alt: «Der Bestand am letzten Tag der Vorperiode ist der Anfangsbestand».
- Code `fuel-stock.service.ts:28, 38`: `dayBefore(periodStart)`. Ein Bestand mit Datum 01.01. wird für die Periode 2024 nicht genommen.
- Hilfetext `buildings_fuel_intro`: «Erfassen Sie dafür am letzten Tag jeder Abrechnungsperiode, zum Beispiel am 31.12.».

**Warum ein Befund.** «Zu Beginn» lädt dazu ein, den 1.1. zu erfassen. Die alte Definition war genauer, und dieser Teil ist Definition, keine App-Regel.

**Korrektur.** «Anfangsbestand: der Tankbestand am letzten Tag der Vorperiode (Ende des Tages vor Periodenbeginn); Endbestand: der am letzten Tag der Periode.»

### GF-8 (Nit): Regel 3 «Kündigungsfrist» unvollständig

**Beleg.**
- `docs/anforderungen-vertragsende.md:33`: «Dwello prüft die Kündigungsfrist nicht; geplant ist ein Hinweis ohne Sperre (A-3, #112).»
- Heute zeigt die App schon den allgemeinen Hinweis `contracts_end_notice_hint` (`messages/de.json:1257`), siehe auch A-3, «Heute steht nur ein allgemeiner Satz im Dialog».
- Das Glossar sagte «weist darauf hin».

**Korrektur.** «… prüft die Frist nicht; der Dialog «Mietvertrag beenden» nennt sie allgemein (3 Monate, sonst nächster Termin); ein Hinweis aus dem Eingangsdatum ist geplant (A-3, #112).»

Die Rechtsaussagen stimmen mit Fedlex:
- OR Art. 266a Abs. 2: «Halten die Parteien die Frist oder den Termin nicht ein, so gilt die Kündigung für den nächstmöglichen Termin.»
- OR Art. 266c: «Bei der Miete von Wohnungen können die Parteien mit einer Frist von drei Monaten auf einen ortsüblichen Termin oder, wenn es keinen Ortsgebrauch gibt, auf Ende einer dreimonatigen Mietdauer kündigen.»

### GF-9 (Nit): «zusammen genau 100 %»

**Beleg.** `nebenkostenabrechnung-anforderungen.md:146`. Code `heating-profile.service.ts:142-144` (Toleranz 0,1).

**Korrektur.** «zusammen 100 % (Toleranz ±0,1 %)» oder «genau» streichen.

### GF-10 (Nit): Ist der «Saldo» gerundet oder nicht?

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:135`: Saldo = «Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge» (ungerundet).
- Code-Spalte `balance` ist gerundet (`calculation.service.ts:222-223`).
- Regel 8 (`:148`) nennt den gerundeten Betrag «Saldo» und den anderen «Saldo vor Rundung».

**Korrektur.** Zum Beispiel «… minus geleistete Akontobeiträge, auf 5 Rappen gerundet (siehe Rundung auf 5 Rappen)». Das ist Teil der Definition, keine App-Regel. Die Regel, wie gerundet wird, bleibt in Regel 8.

Nachgerechnet (`statement-rounding.feature:16-25`):
- 1001.00 + 3 % = 1031.03.
- Akonto 12 × 20: 1031.03 − 240 = 791.03, gerundet 791.05 (+0.02).
- Akonto 12 × 90: 1031.03 − 1080 = −48.97, gerundet −48.95.
- Randfall Saldo 0.00: keine Rundungszeile.
- Die Rundung beträgt höchstens 2 Rappen. Das stimmt mit Regel 8 und `pdf-format.ts:19-20` überein.

### GF-11 (Nit, zur Kenntnis): Leerstand ohne die Ausnahme von Art. 7 Abs. 2 VMWG

**Beleg.** `nebenkostenabrechnung-anforderungen.md:60, 144`, `PRD-Dwello.md:613`. Fedlex, VMWG Art. 7:
- Abs. 1: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.»
- Abs. 2: «Sind keine Geräte zur Erfassung des Wärmeverbrauchs der einzelnen Verbraucher installiert und wurden nicht vermietete Wohn- und Geschäftsräume nachweisbar nur soweit geheizt, als dies zur Verhinderung von Frostschäden notwendig ist, muss der Vermieter nur einen Teil der Heizungskosten übernehmen, die nach dem normalen Verteilungsschlüssel auf Wohn- und Geschäftsräume entfallen.»

Code: Teiler sind alle Wohnungen (`calculation.service.ts:148-153`, `statement.service.ts` `keyValuesOf`), Leertage trägt niemand ausser dem Vermieter. Szenario `statement-generate.feature:46`: April 5 % bleibt beim Vermieter.

**Bewertung.** Abs. 2 ist eine Entlastung des Vermieters («muss … nur einen Teil»), keine Pflicht. Sie nicht anzuwenden, belastet die Mieter nicht. Mietrechtlich gibt es kein Risiko. Aus Sicht des Verwalters trägt der Vermieter bei längerem Leerstand in kleinen Häusern ohne Zähler bis zu 1/3 bis 2/3 mehr Heizkosten der leeren Wohnung als nötig. Die Dokumentation sagt es richtig. Nichts zu ändern, nur zur Kenntnis für den Product Owner.

## Prüfung (1): keine Regel der Gruppen 1 und 2 verloren

Alle Regeln aus #187 sind auffindbar:

| Regel | Neuer Ort |
|---|---|
| Mietstatus | PRD:210 |
| Korrespondenzkanal | PRD:956-958 |
| Überschneidung | Vertragsende Regel 1 |
| Kündigungstermin | Vertragsende Regel 2 |
| Kündigungsfrist | Vertragsende Regel 3 (GF-8) |
| Umlagefähige Rechnung | NK Regel 2, PRD:765 |
| Grund der Änderung | PRD:382, :1019 |
| Vordefinierte Heizprofile | NK Regel 6, PRD:450 (GF-3) |
| Mahnstufe, Mahnung | PRD:633-635 |
| IBAN | PRD:714, vorher schon vorhanden (GF-4) |
| Zahlungsfrist | NK Regel 11, PRD:515 (GF-5) |
| Mahnfrist | PRD:516, :634 |
| Rechnungsdatum, Leistungszeitraum | NK Regel 1. Die Rechtsgrundlage Art. 257b OR steht in Thema 1, `:28, :30` |
| Heizkosten | NK Regel 5 |
| Verteilschlüssel, Gleichmässig, Verwaltungspauschale ohne Schlüssel | NK Regel 3, PRD:394 |
| Wohnungsanteil, Proration, Leerstand | NK Regeln 4 und 5 (GF-1) |
| Heizprofil | NK Regel 6, PRD:459 |
| Tankbestand, Stichtag | NK `:52`, Regel 10 (GF-6) |
| Eine Abrechnung pro Mietvertrag | NK Regel 7, `:33`, PRD:543 |
| Saldo, Rundung | NK Regel 8, `:94` |
| Satz pro Lauf | NK Regel 9, PRD:475 |

Gruppe 3 ist gelöscht (Kategorisierung, Kategorie, Überfällig). Gruppe 5 ist inhaltlich unverändert; aus der Kündigungsfrist wurde nur der App-Satz entfernt, der zu Gruppe 1 gehört.

## Prüfung (3): Entscheide (a) bis (e) gegen Code und Szenarien

| Entscheid | Ergebnis |
|---|---|
| (a) Mahnfrist | Bestätigt. Mahnen geht bei Status `overdue` (`reminder.service.ts:50`). `overdue` heisst versendet und `payment_deadline < heute` (`statement.service.ts:75-76, 176-180`). `reminder_after_days` liest der Code nicht (nur `config.service.ts:79`). Höchstens 3 Stufen (`reminder.service.ts:20, 53`). Kanal gemäss Korrespondenzkanal (`:106-112`). Szenarien `statement-reminder.feature:19-44`. |
| (b) Verwaltungspauschale | Bestätigt (GF-2). |
| (c) Heizprofile | Backend bestätigt, App weicht ab (GF-3). |
| (d) Grund der Änderung | Bestätigt. Pflicht im Formular `invoices/[id]/edit/+page.svelte:57, 65`, nur wenn die KI-Kategorie geändert wird. Die API nimmt ihn optional an (`routes/invoices.ts:49`). |
| (e) Stichtag | Bestätigt. Für jeden Tag erfassbar, Vortag und letzter Tag (`fuel-stock.service.ts:28-42`). Nachgerechnet (`statement-generate.feature:77-86`): 600 + 1000 − 100 = 1500. Marc 1500 × 53.5 % = 802.50 × 1.03 = 826.58, Eva 1500 × 37.2 % = 558 × 1.03 = 574.74 (stimmt). |
| FIFO | Stimmt mit dem Hilfetext `buildings_fuel_intro` überein: Rest zum Preis der letzten Lieferung, darüber hinaus zum Preis der Lieferung davor. |

## Hilfetexte (`messages/de.json`), die den Dokumenten jetzt widersprechen

- `profiles_predefined_not_editable` (:1163) und das Szenario widersprechen der Regel zum Namen (GF-3). Der Hilfetext passt zur App; die Dokumentation soll angepasst werden, nicht der Text.
- `help_statements_2` (:75), «rechnet bei Mieterwechsel und Leerstand nach Mietstagen ab», lässt das Heizprofil weg. Das bestand schon vorher, Nit, keine Änderung im Rahmen von #188.
- Stimmig sind `statements_fee_help`, `settings_fee_suggestion`, `buildings_fuel_intro`, `statements_tank_text`, `contracts_end_notice_hint`, `glossary_days_text`.

## Fehlende Begriffe

- **Vereinbarte Verwaltungspauschale** (GF-2), Vorschlag: «Im Mietvertrag vereinbarter Satz der Verwaltungspauschale (oder keiner); Grundlage, ob und mit welchem Satz der Abrechnungslauf sie für diesen Mietvertrag berechnet.» Für ein Issue mit den Labels `fachlich` und `entscheiden`.

## Nicht bestätigt

- **Art. 4 Abs. 3 VMWG im Glossar** (`UBIQUITOUS_LANGUAGE.md:133`, Gruppe 5, unverändert): «Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen». Der Wortlaut lautet «nach Aufwand oder im Rahmen der üblichen Ansätze». Die Folgerung ist vertretbar, steht aber nicht im Text. Nicht Teil dieser Änderung, **unsicher**.
- **Sofortiges Mahnen am Tag nach der Zahlungsfrist** (Entscheid a): rechtlich zulässig, sofern die Zahlungsfrist ein Verfalltag ist (Art. 102 Abs. 2 OR). Nicht auf Fedlex nachgelesen, **unsicher**. In der Praxis warten Verwalter oft 10 bis 30 Tage; kein Befund, weil entschieden.
- **Heizprofil mit Leistungszeitraum**: `handleMidYearMoves` (`calculation.service.ts:301-311`) verteilt Heizkosten nach den Monaten der Mietdauer, ohne den Leistungszeitraum der Heizrechnung zu berücksichtigen. Die Dokumentation schweigt dazu. Nicht vertieft geprüft, nur gelesen.
- **Bruchteile von Monaten** beim Heizprofil (Einzug Mitte Monat): `prorating.service.ts` nicht geprüft. Regel 5 sagt nur «auf die Monate verteilt».
- **Überschneidungsregel**: `CONTRACT_OVERLAP` im Code bestätigt (`contract.service.ts:290, 338`). Ein Szenario, das die Ablehnung zeigt, fand ich in `contract-new.feature` und `contract-edit.feature` nicht; nur «Vermietete Wohnung ist nicht verfügbar» (`contract-new.feature:47`) und der Hinweis «Überschneidung noch nicht geprüft». Die Angabe «Szenarien in …» in Vertragsende Regel 1 ist deshalb nur teilweise belegt. Backend-Tests nicht durchsucht.
- **QR-Rechnung mit LI-IBAN** (GF-4): SIX-Implementierungsrichtlinien nicht im Wortlaut geprüft.
- **Mietstatus «Gesperrt»**: Nach dem Ende eines Vertrags erscheint ein früher gesetztes «Gesperrt» wieder (`apartment.service.ts:41-50`, gespeicherter Status bleibt). Das ist mit PRD:210 vereinbar, dort aber nicht ausdrücklich gesagt. Nicht als Befund geführt.
