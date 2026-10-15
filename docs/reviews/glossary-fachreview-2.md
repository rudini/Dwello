# Fachreview Runde 2 (nur Delta): Glossar nur Definitionen (#188)

Geprüft: `git diff 2562751 94fa1c0` (b327546 Code-Review-Korrekturen, 94fa1c0 Korrekturen zu GF-1..GF-11) im Worktree `review-glossary-fach2`, dazu der Code an den genannten Stellen und die Issues #89 und #191 (über `gh api`). Gesetzeszitate stammen aus Runde 1 (Fedlex, wörtlich); das Delta bringt keine neue Rechtsaussage.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| GF-1 | Verwalter | erledigt | Regel 5 nennt jetzt beide Formeln (ohne und mit Leistungszeitraum). |
| GF-2 | Mietrecht | Major, offen (bestand schon vorher, Entscheid #89) | Regel 9 nennt den Umweg und #89. Der Wortlaut ist bestätigt, mit Nit GF2-3. |
| GF-3 | Verwalter | erledigt | Regel 6 und PRD:450: «in der App gar nicht bearbeitbar, nur über die API der Name». |
| GF-4 | Verwalter | erledigt (Entscheid #191) | PRD 5.10 und Tab 7 beschreiben beide Prüfungen. Der Rest steht in Nit GF2-1. |
| GF-5 | Verwalter | erledigt | Thema 2, Regel 11 und PRD Tab 4 nennen `payment_deadline_days` «nicht auf der Einstellungsseite». |
| GF-6 | Verwalter | erledigt | Regel 10 nennt den Fall «Einkauf statt Verbrauch» und den Hinweis. |
| GF-7 | Verwalter | erledigt | Stichtag: «am Tag vor Beginn der Abrechnungsperiode». |
| GF-8 | Verwalter | erledigt | Vertragsende Regel 3 nennt den allgemeinen Hinweis im Dialog. |
| GF-9 | Verwalter | erledigt | «zusammen 100 % (±0,1 Prozentpunkte)». |
| GF-10 | Verwalter | erledigt | Saldo «gerundet auf 5 Rappen». Folge-Nit GF2-2. |
| GF-11 | – | zur Kenntnis | Unverändert. Regel 4 verweist jetzt auf die Themen 3, 4 und 7 (geprüft: Zeilen 60, 70, 106). |
| GF2-1 | Verwalter | Nit | PRD Tab 7 nennt weiterhin den Hilfetext «Swiss or Liechtenstein account required». Die App zeigt einen anderen Text. |
| GF2-2 | Verwalter | Nit | Glossar «Rundung auf 5 Rappen» ist zirkulär, seit der Saldo als gerundet definiert ist. |
| GF2-3 | Mietrecht | Nit | Regel 9 nennt den Umweg für einen «anderen Satz», aber nicht ausdrücklich für einen Mietvertrag ohne vereinbarte Pauschale. |

Das Delta bringt keinen neuen Blocker und keinen neuen Major.

## Prüfung der Befunde aus Runde 1

### GF-1: erledigt

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:145`: «… ohne Leistungszeitraum Mietstage / Tage der Periode, mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode (Regel 1; …)». Das entspricht `rentalShare` (`calculation.service.ts:312`, «the tenant's days within the days each invoice bills in the period»).

**Nachgerechnet** wie in Runde 1:
- Hauswart 900 CHF für 01.10.–31.12.2024, Marc Huber ab 01.05.: 900 × 92/92 = 900, mit 3 % = 927.00.
- Eva Frei (bis 31.03.): 0/92 = 0.00.
- Ohne Leistungszeitraum: 1000 × 245/366 = 669.40.

Alle drei Werte stimmen mit der Regel und dem Szenario `statement-generate.feature:69-75` überein.

Der neue Zusatz zum Heizprofil («für einen Mietvertrag, der nur einen Teil der Periode läuft») passt zum Code. `handleMidYearMoves` läuft für jede Heizkosten-Gruppe mit Heizprofil (`calculation.service.ts:300-309`). Bei einem Vertrag über die ganze Periode ergibt das Profil 100 %, also dasselbe wie nach Tagen. Siehe dazu «Nicht bestätigt» (Heizrechnung mit Leistungszeitraum).

### GF-2: Wortlaut bestätigt, Befund bleibt offen

**Beleg.** `nebenkostenabrechnung-anforderungen.md:149` (Regel 9): «Die Hilfe am Feld (`statements_fee_help`) verlangt sie nur bei Vereinbarung, sonst 0 %; für einen Mietvertrag mit anderem Satz löscht der Vermieter dessen Entwurf und erstellt ihn mit diesem Satz neu. Ein Feld «vereinbart» am Mietvertrag ist offen (#89; Art. 257a Abs. 2 OR).»

Die Regel gibt `messages/de.json:974` richtig wieder («Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein. Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf …»).

#89 ist offen und hat die Labels `entscheiden` und `produkt`. Seine Option 2 ist genau das Feld «Verwaltungspauschale vereinbart»; der Begriffsvorschlag «Vereinbarte Verwaltungspauschale» aus Runde 1 ist damit abgedeckt.

Der Befund hat schon vor der Änderung bestanden und wartet auf einen Entscheid des Product Owners. Nach Workflow 7 hält er #188 nicht auf, gehört aber unter «Blocked on me».

### GF-3: erledigt

**Beleg.** Regel 6 (`:146`) und `PRD-Dwello.md:450` stimmen mit dem Code überein:
- Die Bearbeitungsseite verweigert die Bearbeitung mit 403 (`edit/+page.server.ts:9`).
- Der Text `profiles_predefined_not_editable` (`de.json:1163`) sagt dasselbe.
- Das Backend lässt eine Namensänderung zu.

Ob Entscheid (c) so gemeint war, bleibt eine Rückfrage an den Product Owner. Ein Befund ist es nicht mehr.

### GF-4: erledigt (Entscheid in #191)

**Beleg.** `PRD-Dwello.md:714` und `:1104` beschreiben beide Prüfungen so, wie der Code sie macht:
- Das Einstellungsformular nimmt nur CH an (`settings.ts:42`, `/^CH\d{19}$/`, Prüfziffer mit 1217).
- Der QR-Rechnungsdienst nimmt CH oder LI an (`qr-bill.service.ts:99`).

#191 ist offen, mit den Labels `bug` und `entscheiden` und den Optionen A und B. Rest: GF2-1.

### GF-5: erledigt

**Beleg.** Thema 2 (`:45`), Regel 11 (`:151`) und PRD Tab 4 (`:1059-1060`) sagen jetzt «nicht auf der Einstellungsseite». Das stimmt mit dem Code überein: `config.service.ts:74`, `statement.service.ts:314, 436`. Die Einstellungsseite (`settings.ts`) kennt den Schlüssel weiterhin nicht.

Auch die neue Formulierung «X days after the statement is sent» passt zum Code, `daysAfter(statementDate, …)` beim Versand. Die alte Formulierung «from statement date» war ungenau.

### GF-6: erledigt

**Beleg.** Regel 10 (`:150`) passt zu `fuel-stock.service.ts:72-74` (`if (!readings?.opening || !readings.closing) return [];`): Ohne die beiden Bestände bleiben nur die Lieferungsrechnungen. Der Hinweis `statements_tank_text` (`de.json:978`) ist richtig genannt. Der Verweis auf Art. 5 Abs. 2 lit. a VMWG («die Brennstoffe und die Energie, die verbraucht wurden») ist wörtlich belegt (Runde 1).

### GF-7: erledigt

**Beleg.** Die Glossardefinition `UBIQUITOUS_LANGUAGE.md:117` lautet jetzt: «Der Tankbestand am Tag vor Beginn der Abrechnungsperiode heisst Anfangsbestand, der an ihrem letzten Tag Endbestand.» Das entspricht `dayBefore(periodStart)` und `on(periodEnd)` (`fuel-stock.service.ts:28, 37`).

### GF-8: erledigt

**Beleg.** `anforderungen-vertragsende.md:33` gibt `contracts_end_notice_hint` (`de.json:1257`) sinngemäss richtig wieder: «mindestens 3 Monaten … gilt sie erst auf den nächsten Kündigungstermin». Das stimmt mit OR Art. 266a Abs. 2 und 266c überein (Wortlaut in Runde 1).

### GF-9: erledigt

**Beleg.** Regel 6: «±0,1 Prozentpunkte». Der Code nennt `tolerance = 0.1`, Grenzen inklusive (`heating-profile.service.ts:142-144`).

### GF-10: erledigt

**Beleg.** `UBIQUITOUS_LANGUAGE.md:135`: «… minus geleistete Akontobeiträge, gerundet auf 5 Rappen». Das passt zu `balance` und Regel 8.

Nachgerechnet (`statement-rounding.feature`):
- 1031.03 − 240 = 791.03, gerundet 791.05.
- 1031.03 − 1080 = −48.97, gerundet −48.95.
- Randfall 0.00: keine Rundungszeile.

Die Regel stimmt in allen drei Fällen.

### Übrige Änderungen im Delta (Code-Review-Korrekturen)

- **Vermieter.** Die Glossardefinition `UBIQUITOUS_LANGUAGE.md:25` verliert «Trägt die Kosten des Leerstands». Das ist eine App-Regel, keine Definition. Sie steht in Regel 4 (`:144`). Keine Regel geht verloren.
- **Vertragsende Regel 1.** «für neue Verträge belegt durch `contract-new.feature` und `contract-overlap.pg.test.ts`»: Die Testdatei gibt es. Sie prüft `CONTRACT_OVERLAP` für POST (Zeilen 39-52). `contract-new.feature:47` zeigt die Sperre in der Oberfläche. Für Änderungen fehlt ein Test; das ist als O-20 in `offene-punkte.md` erfasst. Damit ist der Punkt aus «Nicht bestätigt» der Runde 1 aufgelöst.

## Neue Befunde

### GF2-1 (Nit): PRD Tab 7 nennt einen Hilfetext, den es so nicht gibt

**Beleg.**
- `docs/PRD-Dwello.md:1106`: «Help text: "Swiss or Liechtenstein account required for QR-bill generation"».
- Die App zeigt `settings_iban_help` (`messages/de.json:1039`): «Konto, auf das Ihre Mieter Nachzahlungen überweisen; es steht auf der QR-Rechnung.»
- Die Zeile darüber (`:1104`, im Delta geändert) sagt jetzt «settings form: CH only».

**Warum.** Die beiden Zeilen widersprechen sich innerhalb desselben Abschnitts. Die Zeile 1106 bestand schon vorher.

**Korrektur.** Die Zeile auf den tatsächlichen Hilfetext ändern oder einen Verweis auf #191 setzen.

### GF2-2 (Nit): «Rundung auf 5 Rappen» ist jetzt zirkulär

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:135` definiert den Saldo neu als «gerundet auf 5 Rappen».
- `:136` (unverändert): «Rundung auf 5 Rappen: Betrag, um den der Saldo auf 5 Rappen gerundet wird.»
- Regel 8 (`:148`) trennt sauber zwischen «Saldo vor Rundung», «Rundung» und «Saldo».

**Warum.** Nach der neuen Definition wird ein schon gerundeter Betrag gerundet. Inhaltlich ist es klar, der Wortlaut ist aber unsauber.

**Korrektur.** «Rundung auf 5 Rappen: Differenz zwischen dem Saldo und dem Saldo vor Rundung (höchstens 2 Rappen).» Ob der Begriff «Saldo vor Rundung» ins Glossar gehört, entscheidet der Aufrufer. Ein neuer Begriff ist nicht nötig, Regel 8 verwendet ihn bereits.

### GF2-3 (Nit): Regel 9 nennt den Fall «keine Pauschale vereinbart» nicht ausdrücklich

**Beleg.** `nebenkostenabrechnung-anforderungen.md:149`: «für einen Mietvertrag mit anderem Satz löscht der Vermieter dessen Entwurf …»

**Warum.** Der rechtlich heikle Fall nach Art. 257a Abs. 2 OR («Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.») ist ein Lauf mit 3 %, in dem ein Mietvertrag keine Pauschale vereinbart hat. Der fällt unter «anderer Satz» nur, wenn man 0 % als Satz liest.

**Korrektur.** «… für einen Mietvertrag mit anderem oder ohne vereinbarten Satz (dann 0 %) …»

## Fehlende Begriffe

Keine neuen. «Vereinbarte Verwaltungspauschale» (Runde 1) ist in #89, Option 2, aufgenommen.

## Nicht bestätigt

- **Heizrechnung mit Leistungszeitraum.** Regel 5 nennt die Formel mit Leistungszeitraum allgemein und verteilt Heizkosten danach nach dem Heizprofil. `handleMidYearMoves` (`calculation.service.ts:300-309`) bekommt die Vertragsdaten und die Periode, aber nicht den Leistungszeitraum der Rechnung. Die Rechnung kommt schon gekürzt auf ihren Anteil an der Periode an.
  - Beispiel: Heizrechnung für Oktober bis Dezember, Mieter ab Mai. Er trägt nur den Profilanteil von Mai bis Dezember, nicht 100 %, obwohl er im ganzen Leistungszeitraum gemietet hat.
  - Ob das gewollt ist, habe ich nicht geprüft; es gibt kein Szenario dazu.
  - Die Dokumentation widerspricht dem Code nicht wörtlich, weil der Heizprofil-Satz als Ausnahme folgt. Der Fall bestand schon vorher und gehört nicht zum Delta.
- **QR-Rechnung mit LI-IBAN (SIX).** Nicht im Wortlaut geprüft (wie in Runde 1). Entscheid in #191.
- **Art. 4 Abs. 3 VMWG** im Glossar («Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen»): im Delta unverändert, weiterhin **unsicher** (siehe Runde 1).
