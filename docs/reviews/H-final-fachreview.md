# Fachreview H (final): Verwaltungspauschale auf die eigenen Nebenkosten, Saldo auf 5 Rappen

Geprüft wurde PR rudini/Dwello#43, Branch `claude/relaxed-ride-tciycq` (`git diff origin/main...HEAD`, Stand b0ecf5e). Der PR setzt zwei Regeln um:

- Die Verwaltungspauschale ist immer ein Prozentsatz der eigenen Nebenkosten des Mieters, also der Zwischensumme. Die Wahl eines Verteilschlüssels und ihre Spalte sind entfernt.
- Der Saldo (Nachzahlung und Rückerstattung) wird kaufmännisch auf 5 Rappen gerundet. Die Zeile «Rundung auf 5 Rappen» steht zwischen Akonto und Saldo. Positionen, Zwischensumme, Pauschale und «Ihre Nebenkosten» bleiben auf den Rappen genau.

Grundlagen:
- MV-Merkblatt «Zulässige und unzulässige Nebenkosten» 2026, gelesen mit `pdftotext`
- `docs/nebenkostenabrechnung-anforderungen.md`
- `docs/design/offene-punkte.md`, Abschnitte «Session 12»
- die Reviews `F-fachreview-1.md` und `G-review-1.md`

**Nicht auf Fedlex gelesen:** Art. 257a/257b OR und Art. 4, 5 und 8 VMWG kenne ich nur aus dem Merkblatt und dem Anforderungsdokument. Jede rechtliche Aussage unten ist deshalb **unsicher**, solange der Wortlaut auf Fedlex nicht bestätigt ist.

## Übersicht

| Nr. | Rolle | Stufe | Kurz |
|---|---|---|---|
| – | alle | – | **Keine kritischen und keine hohen Findings** |
| V-1 | Verwalter | mittel | Saldo 0 nach Rundung: Abrechnungen ohne Zahlbetrag werden nach Ablauf der Frist «Überfällig», und die Übersicht fordert zur Prüfung des Geldeingangs auf |
| V-2 | Verwalter | niedrig | Kleinstbeträge: Nachzahlung CHF 0.05 mit QR-Zahlteil, Rückerstattung CHF 0.05 mit Bitte um IBAN |
| V-3 | Verwalter | niedrig | Saldo 0 aus einem kleinen Guthaben: Der Text sagt nur «müssen nichts bezahlen» |
| V-4 | Verwalter | niedrig | Vorzeichen der Rundungszeile bei Rückerstattung ist für Laien gegenläufig |
| V-5 | Verwalter | niedrig | Begriffe und Doku: «Gesamtkosten» (Web) und «Ihre Nebenkosten» (PDF); veralteter Satz in `offene-punkte.md` |
| M-1 | Mietrecht | niedrig (unsicher) | Rundung bis 2 Rappen zulasten des Mieters gegenüber den «tatsächlichen Aufwendungen» (Art. 257b Abs. 1 OR) |
| M-2 | Mietrecht | niedrig (bestehend) | Heizungsverwaltung (Art. 5 VMWG) und Pauschale (Art. 4 Abs. 3 VMWG) überschneiden sich möglicherweise; anderer Satz oder andere Grundlage pro Vertrag nicht abbildbar |
| – | Datenprüfer | – | **Keine Findings:** 17 von 17 Abrechnungen stimmen, 13 PDFs stimmen, QR-Betrag = Saldo |

---

## Rolle 1: Verwalter

**Gesamturteil:** Mit beiden Regeln sind die Abrechnungen klar und praxistauglich. Die Pauschale steht als «Verwaltungspauschale: 3 % der Zwischensumme von CHF 3'283.86» direkt unter der Zwischensumme, die sie verwendet. Der Mieter kann sie mit dem Taschenrechner nachrechnen. Die Rundungszeile lässt die Rechnung im PDF (de/fr/it/en), auf der Detailseite und im Kasten oben aufgehen. Die mittleren Befunde aus Review G sind behoben:
- G-1: Bei Saldo 0 nach Rundung steht neu der Text «Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen.»
- G-2: Italienisch heisst die Zeile nur «Arrotondamento» und bricht nicht mehr um. Die Platzreserve rechnet mit 5 Zeilen.
- G-3: Der Assistent zeigt «Ausgeglichen» statt «Nachzahlung CHF 0.00».
- G-4: Glossar-Hilfe und `offene-punkte.md` sind nachgeführt.
- G-5: Der Kasten oben schreibt neu «+ Rundung auf 5 Rappen CHF 0.02».

### Geprüft, ohne Befund

- **PDF, vier Sprachen** (NK-11111111-2025-0002/-0003 in de/fr/it/en): Die Bezeichnungen sind einzeilig, die Pauschale lautet in allen vier Sprachen «x % der Zwischensumme / du sous-total / del subtotale / of the subtotal von CHF y». Die Rundung steht mit Vorzeichen in der Tabelle und im Kasten.
- **Nachzahlung:** Der QR-Zahlteil zeigt den gerundeten Saldo. Text, Zahlteil und QR-Code nennen denselben Betrag (decodiert, siehe Rolle 3).
- **Rückerstattung:** Es gibt keinen Zahlteil. Der Text bittet um die IBAN. Bei bezahlten Abrechnungen steht «Überwiesen am …», ebenfalls ohne Zahlteil.
- **Mieterwechsel im Jahr** (Wohnung im Gebäude 22222222, 181 + 184 Tage): Jede Abrechnung wird für sich gerundet. Die Zeitanteile (181/365, 184/365; Heizprofil 55.80 % + 44.20 %) ergeben zusammen genau die Wohnungsanteile. Die Pauschale beider Mieter (42.47 + 39.21 = 81.68) weicht um 1 Rappen von 3 % der Summe (81.67) ab. Das ist bei getrennter Rappenrundung unvermeidlich und für den einzelnen Mieter ohne Belang.
- **Assistent:**
  - Schritt 3 nimmt «2,5» und «2.5» an. Über 3 % erscheint ein Hinweis, der angesagt wird.
  - Die Hilfe sagt «Prozentsatz der eigenen Nebenkosten jedes Mieters».
  - Die Vorschau nennt Heizprofil und Satz.
  - Ein anderer Satz für einen einzelnen Vertrag geht so: Entwurf löschen und den Lauf wiederholen. Der Lauf überspringt bereits abgerechnete Verträge (`contractsInPeriod`), das funktioniert also.
- **Detailseite:** Die Rundungszeile erscheint nur bei einer echten Rundung. Sie verwendet dieselbe Regel wie das PDF (Differenz auf Rappen, < 0.05), G-6 ist damit behoben.

### V-1 (mittel): Saldo 0 wird «Überfällig» und erzeugt eine Zahlungs-Aufgabe

- **Fall:** Kosten 1000.50, Akonto 1000.48 ergeben Saldo 0, «Ausgeglichen». Der Verwalter versendet die Abrechnung. Ihr Status bleibt `sent`, die Zahlungsfrist läuft weiter. Nach der Frist gilt sie als überfällig: `statusCondition('overdue')` in `backend/src/services/statement.service.ts` prüft nur Status und Frist, nicht den Betrag. Die Übersicht (`src/lib/overview.ts:87-92`) schreibt dann «… über der Zahlungsfrist. Prüfen Sie, ob das Geld eingegangen ist …». Für eine Abrechnung ohne Zahlbetrag ist das falsch.
- **Bezug zum PR:** Das Verhalten bestand schon vorher. Bisher trat es aber nur bei genau gleichen Beträgen auf. Neu reicht jede Differenz von −0.02 bis +0.02, also kommt der Fall etwa fünfmal so oft vor.
- **Fix:** Einen Saldo 0 beim Versand gleich als erledigt führen, also mit `paid` und dem Versanddatum. Alternativ `overdue`/`open` auf `balance <> 0` einschränken. Test: eine versandte Abrechnung mit Saldo 0 und abgelaufener Frist erscheint nicht unter «Überfällig».

### V-2 (niedrig): Kleinstbeträge

- **Fall:**
  - Kosten 1000.50, Akonto 1000.47: Rundung +0.02, Nachzahlung CHF 0.05 mit QR-Zahlteil über 0.05 (gerendert und decodiert).
  - Kosten 1000.50, Akonto 1000.53: Rückerstattung CHF 0.05 mit der Bitte «Teilen Sie uns dafür Ihre IBAN mit».
- **Beurteilung:** Für Mieter und Verwalter ist beides unverhältnismässig. Später folgen eine Mahnung und der Status «Überfällig». Der Fall bestand schon vorher bei 0.01 bis 0.04. Die Rundung macht ihn nicht häufiger, nur die Beträge glatter.
- **Fix (Produktentscheid, kein Fehler):** eine Bagatellgrenze, z.B. Beträge unter CHF 5 weder einfordern noch überweisen. Sie müsste im PDF offen genannt sein und als Punkt in `offene-punkte.md` stehen. Ohne Entscheid genügt ein Hinweis in der Vorschau des Assistenten bei |Saldo| < CHF 5.

### V-3 (niedrig): Saldo 0 aus einem kleinen Guthaben

- **Fall:** Kosten 1000.50, Akonto 1000.52 ergeben ohne Rundung ein Guthaben von 0.02. Das PDF zeigt «Rundung auf 5 Rappen + 0.02 / Ausgeglichen 0.00» und dazu den Text «Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen.» Der Mieter musste aber nie etwas bezahlen. Er verliert 2 Rappen Guthaben, und der Satz erwähnt das nicht.
- **Fix:** Einen Text für beide Richtungen verwenden, z.B. «Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen und erhalten nichts zurück.» Für fr/it/en entsprechend. Test: Render mit Akonto 1000.52.

### V-4 (niedrig): Vorzeichen der Rundungszeile bei Rückerstattungen

- **Fall:**
  - NK-22222222-2025-0003: «Ihre Nebenkosten 1'346.13 – Akonto 1'440.00 + Rundung 0.02 = Rückerstattung 93.85». Der Mieter erhält 2 Rappen weniger, liest aber «+».
  - NK-11111111-2025-0002: «– Rundung 0.02 = Rückerstattung 6.50». Der Mieter erhält mehr, liest aber «–».
- **Beurteilung:** Rechnerisch ist das richtig, denn das Vorzeichen folgt der Rechnung Kosten − Akonto. Es passt zur bisherigen Darstellung, in der eine negative Differenz «Rückerstattung» heisst. Ein Laie liest «+» aber als «mehr für mich».
- **Fix (optional):** So lassen und in den Erläuterungen unter der Tabelle einen Satz ergänzen: «Rundung: der Saldo ist auf 5 Rappen gerundet; + erhöht Ihre Nebenkosten, – senkt sie.» Ein Umdrehen des Vorzeichens bei Rückerstattungen würde die Rechnung zerstören und wird nicht empfohlen.

### V-5 (niedrig): Begriffe und Dokumentation

- Die Detailseite (`src/routes/statements/[id]/CostTable.svelte`) nennt die Summe «Gesamtkosten», das PDF «Ihre Nebenkosten». Mit der neuen Rundungszeile direkt darunter fällt der Unterschied mehr auf. Das bestand schon vorher. Fix: «Ihre Nebenkosten» wie im PDF, oder einen Glossarvorschlag in `offene-punkte.md` aufnehmen.
- `docs/design/offene-punkte.md:193` sagt weiterhin «contracts with different rates need separate runs (help text)». Die Hilfe sagt jetzt «Entwurf löschen und neu erstellen» (`SettingsStep.svelte`). Fix: den Satz an die Hilfe anpassen.
- Die Assistenten-Vorschau nennt «Kosten 1'031.03» und daneben «Nachzahlung 791.05», ohne Akonto und ohne Rundung. Das ist G-10 und als niedrig vermerkt. Kein weiterer Fix nötig.

---

## Rolle 2: Mietrecht

Alle Aussagen in diesem Abschnitt sind **unsicher**: Den Wortlaut auf Fedlex habe ich nicht gelesen.

### Geprüft, ohne Befund

- **Pauschale auf die eigenen Nebenkosten (Art. 4 Abs. 3 VMWG):**
  - Nach Merkblatt (S. 4) dürfen Verwaltungskosten «entweder nach Aufwand oder nach ortsüblichen Sätzen» verrechnet werden. «Weit verbreitet ist ein fester Prozentsatz der Nebenkosten». Mehr als 2 bis 3 % müssen Mieter nicht akzeptieren; laut kantonalen Entscheiden und BWO 32 Nr. 12 sind höchstens 3 % üblich.
  - Ein Prozentsatz der eigenen Nebenkosten des Mieters erfüllt das. Er ist für den Mieter auf seiner eigenen Abrechnung überprüfbar, was zum Auskunftsrecht nach Art. 257b Abs. 2 OR passt.
  - Voreinstellung 3 %, ein Hinweis über 3 %, keine Sperre: Das deckt sich mit Merkblatt und Anforderungsdokument. Die Hilfe sagt «Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist», das passt zu Art. 257a Abs. 2 OR.
  - Die Grundlage enthält keine unzulässigen Kosten. Die Kategorie «Verwaltung» ist nicht umlagefähig (`0002_stammdaten.sql`, `is_allowed_utility_cost = false`). Den Leerstandsanteil trägt der Vermieter, er fliesst also nicht in die Pauschale des Mieters ein.
- **Nur der Saldo wird gerundet:** Positionen, Zwischensumme, Pauschale und «Ihre Nebenkosten» bleiben exakt. Die Abrechnung weist die tatsächlichen Kosten also auf den Rappen genau aus. Die Rundung ist als eigene Zeile offengelegt. Damit bleibt die Abrechnung nachvollziehbar und belegbar (Art. 257b OR).
- **Symmetrie:** Gerundet wird «half away from zero», bei Nachzahlung und Rückerstattung gleich. In den Demodaten heben sich die Rundungen auf (netto −0.01 über 17 Abrechnungen, siehe Rolle 3).
- **Art. 8 VMWG:** Die Hinweise auf die detaillierte Heizkostenabrechnung und auf Anfangs- und Endbestand stehen im PDF, unverändert durch den PR.

### M-1 (niedrig, unsicher): Rundung zulasten des Mieters

- **Fall:** NK-11111111-2025-0003: Kosten − Akonto = 142.38, verlangt werden 142.40. NK-22222222-2025-0003: Guthaben 93.87, überwiesen werden 93.85. Der Mieter bezahlt also bis 2 Rappen mehr, als die tatsächlichen Aufwendungen ergeben (Art. 257b Abs. 1 OR, Wortlaut nicht geprüft).
- **Beurteilung:** Wirtschaftlich ist das bedeutungslos: höchstens 2 Rappen, symmetrisch und offengelegt. Eine Rechtsprechung oder Lehrmeinung dazu habe ich nicht gefunden. Das Anforderungsdokument hält fest: «Rundung auf 5 Rappen ist für Rechnungen nicht vorgeschrieben». Der Punkt steht bereits in `offene-punkte.md` (Session 12, «TODO(fachlich prüfen), unsicher»).
- **Fix (nur falls die Fachprüfung es verlangt):** stets zugunsten des Mieters runden, also eine Nachzahlung abrunden und eine Rückerstattung aufrunden. Dafür reicht eine Änderung in `roundTo5Rappen`/`calculateBalance`, die Rundungszeile bleibt gleich. Kosten: im Mittel etwa 2 Rappen pro Abrechnung. Bis zur Klärung ist die jetzige Lösung vertretbar.

### M-2 (niedrig, bestehend): Grundlage pro Vertrag und Heizungsverwaltung

- Ein Vertrag mit einer anderen Grundlage lässt sich nicht abbilden, etwa «3 % der Heizkosten» oder eine Pauschale nach Aufwand. Ebenso wenig eine separat vereinbarte Heizungsverwaltung (Art. 5 Abs. 2 lit. i VMWG). Laut Merkblatt dürfen beim Heizbetrieb «sämtliche Verwaltungskosten» verrechnet werden, bei den übrigen Nebenkosten nur die Erstellung der Abrechnung. Ob ein einheitlicher Satz auf alle eigenen Nebenkosten diese Unterscheidung abdeckt oder ob die Heizungsverwaltung doppelt verrechnet wird, bleibt offen.
- Diese Punkte stehen bereits in `offene-punkte.md` (Session 12, aus Review F V-2/M-2). Neu ist nichts. Ich führe sie auf, damit dieser Review vollständig ist.
- **Fix:** Satz und Grundlage als Felder des Mietvertrags führen, mit dem Feld «Pauschale vereinbart ja/nein». Ausserdem Rechnungen der Heizungsverwaltung nicht in die Grundlage der Pauschale nehmen, solange die Doppelverrechnung ungeklärt ist. TODO(fachlich prüfen).

---

## Rolle 3: Datenprüfer

**Keine Findings.**

### Vorgehen

- Scratch-Datenbank `dwello_final_fach` auf localhost:5432 angelegt. Die Migrationen `0001_schema.sql` und `0002_stammdaten.sql` hat der Migrationsrunner beim Laden der Demodaten in dieser Reihenfolge angewendet (`schema_migrations` enthält beide). Danach `DATABASE_URL=…/dwello_final_fach bun scripts/demo-data.ts`.
  - Ein erster Versuch mit `psql -f` scheiterte: Der Runner lehnt eine Datenbank ohne `schema_migrations` ab. Ich habe die Datenbank darum leer neu angelegt.
- Ein eigenes Python-Skript mit `decimal` liest alle Abrechnungen und Positionen und rechnet nach. Die Spalte `subtotal` gibt es nicht; die Zwischensumme ist die Summe der `tenant_share`. Geprüft wurden:
  - Zwischensumme = Σ `tenant_share` = `total_costs − management_fee`
  - `management_fee` = round(Zwischensumme × `management_fee_percent` / 100, 2), halb nach oben
  - `total_costs` = Zwischensumme + Pauschale
  - `balance` = (`total_costs − total_advance_payments`), kaufmännisch auf 0.05 gerundet, mit Vorzeichen (symmetrisch)
- PDFs mit `generateStatementPdf` (Backend) gerendert, mit `pdftotext -layout` gelesen und die QR-Codes mit OpenCV decodiert (Zeile «Amount» der Swiss-QR-Nutzlast). Zusätzlich synthetische Fälle direkt mit `generateStatementPDFBase64` und `calculateBalance`, ohne Datenbank.
- Die Datenbank ist danach gelöscht. `dwello`, `dwello_test`, `dwello_e2e` und `dwello_persona` habe ich nicht berührt. Im Repository habe ich ausser dieser Datei nichts geändert.

### Ergebnis Demodaten: 17 Abrechnungen, 0 Abweichungen

| Nr. | Tage | Zwischensumme | Pauschale 3 % | Ihre NK | Akonto | Kosten − Akonto | Saldo | Rundung |
|---|---|---|---|---|---|---|---|---|
| NK-11111111-2024-0001 | 366 | 2866.58 | 86.00 | 2952.58 | 2880.00 | 72.58 | 72.60 | +0.02 |
| NK-11111111-2024-0002 | 366 | 3328.48 | 99.85 | 3428.33 | 3600.00 | −171.67 | −171.65 | +0.02 |
| NK-11111111-2024-0003 | 366 | 3132.52 | 93.98 | 3226.50 | 3240.00 | −13.50 | −13.50 | 0 |
| NK-11111111-2024-0004 | 366 | 4112.32 | 123.37 | 4235.69 | 4200.00 | 35.69 | 35.70 | +0.01 |
| NK-22222222-2024-0001 | 366 | 2261.90 | 67.86 | 2329.76 | 2400.00 | −70.24 | −70.25 | −0.01 |
| NK-22222222-2024-0002 | 366 | 2680.65 | 80.42 | 2761.07 | 2640.00 | 121.07 | 121.05 | −0.02 |
| NK-22222222-2024-0003 | 366 | 3069.48 | 92.08 | 3161.56 | 3120.00 | 41.56 | 41.55 | −0.01 |
| NK-33333333-2024-0001 | 366 | 2182.19 | 65.47 | 2247.66 | 2280.00 | −32.34 | −32.35 | −0.01 |
| NK-33333333-2024-0002 | 366 | 2970.20 | 89.11 | 3059.31 | 3000.00 | 59.31 | 59.30 | −0.01 |
| NK-11111111-2025-0001 | 365 | 3005.65 | 90.17 | 3095.82 | 2880.00 | 215.82 | 215.80 | −0.02 |
| NK-11111111-2025-0002 | 365 | 3488.85 | 104.67 | 3593.52 | 3600.00 | −6.48 | −6.50 | −0.02 |
| NK-11111111-2025-0003 | 365 | 3283.86 | 98.52 | 3382.38 | 3240.00 | 142.38 | 142.40 | +0.02 |
| NK-11111111-2025-0004 | 365 | 4308.85 | 129.27 | 4438.12 | 4200.00 | 238.12 | 238.10 | −0.02 |
| NK-22222222-2025-0001 | 365 | 2296.54 | 68.90 | 2365.44 | 2400.00 | −34.56 | −34.55 | +0.01 |
| NK-22222222-2025-0002 | 181 | 1415.51 | 42.47 | 1457.98 | 1320.00 | 137.98 | 138.00 | +0.02 |
| NK-22222222-2025-0003 | 184 | 1306.92 | 39.21 | 1346.13 | 1440.00 | −93.87 | −93.85 | +0.02 |
| NK-22222222-2025-0004 | 365 | 3117.87 | 93.54 | 3211.41 | 3120.00 | 91.41 | 91.40 | −0.01 |

«Rundung» = Saldo − (Kosten − Akonto); positiv heisst zugunsten des Vermieters.

- 10 Nachzahlungen, 7 Rückerstattungen, keine mit Saldo 0.
- Die Rundung liegt immer zwischen −0.02 und +0.02. Netto über alle 17 Abrechnungen: −0.01.

### PDFs: Zeilen ergeben den Saldo, QR-Betrag = Saldo

| PDF | Art | Σ Positionen = Zwischensumme | NK − Akonto ± Rundung = Saldo | QR-Betrag |
|---|---|---|---|---|
| NK-11111111-2025-0003 de/fr/it/en | Nachzahlung | 3'283.86 ✓ | 3'382.38 − 3'240.00 + 0.02 = 142.40 ✓ | 142.40 (alle vier) ✓ |
| NK-11111111-2025-0002 de/fr/it/en | Rückerstattung | 3'488.85 ✓ | 3'593.52 − 3'600.00 − 0.02 = −6.50 ✓ | kein Zahlteil ✓ |
| NK-11111111-2025-0001 de (versandt) | Nachzahlung | – | 3'095.82 − 2'880.00 − 0.02 = 215.80 ✓ | 215.80 ✓ |
| NK-22222222-2025-0002 de (Auszug, 181 T.) | Nachzahlung | 1'415.51 ✓ | 1'457.98 − 1'320.00 + 0.02 = 138.00 ✓ | 138.00 ✓ |
| NK-22222222-2025-0003 de (Einzug, 184 T.) | Rückerstattung | 1'306.92 ✓ | 1'346.13 − 1'440.00 + 0.02 = −93.85 ✓ | kein Zahlteil ✓ |
| NK-11111111-2024-0001 de (bezahlt) | Nachzahlung | – | 2'952.58 − 2'880.00 + 0.02 = 72.60 ✓ | kein Zahlteil (bezahlt) ✓ |
| NK-11111111-2024-0002 de (überwiesen) | Rückerstattung | – | 3'428.33 − 3'600.00 + 0.02 = −171.65 ✓ | kein Zahlteil ✓ |

Weitere Prüfungen an den PDFs:
- In jeder Position gilt «Ihr Anteil = Wohnungsanteil × Zeitanteil», z.B. 784.13 × 184/365 = 395.29.
- Beim Mieterwechsel ergeben die beiden Anteile zusammen genau den Wohnungsanteil (113.06 + 114.94 = 228.00; 588.39 + 466.08 = 1'054.47).
- Der Kasten oben nennt dieselbe Herleitung wie die Tabelle.

Synthetische Fälle (ohne Datenbank, de und fr):

| Kosten − Akonto | Saldo | PDF | QR |
|---|---|---|---|
| +0.02 | 0 | «Ausgeglichen», «Rundung – 0.02», Text «Nach der Rundung … nichts bezahlen» | kein Zahlteil ✓ |
| −0.02 | 0 | wie oben mit «+ 0.02» (siehe V-3) | kein Zahlteil ✓ |
| +0.03 | 0.05 | «Nachzahlung 0.05» (siehe V-2) | 0.05 ✓ |
| −0.03 | −0.05 | «Rückerstattung 0.05» mit Bitte um IBAN (V-2) | kein Zahlteil ✓ |
| −99.50, bezahlt | −99.50 | keine Rundungszeile, «Überwiesen am» | kein Zahlteil ✓ |

Eine Randbeobachtung, kein Finding: Bei NK-11111111-2025-0002 (de) steht der Summenblock geschlossen auf Seite 2, die Positionen auf Seite 1. Ursache ist der zweizeilige Rückerstattungstext im Kasten oben. Der Block wird wie beabsichtigt nicht zerrissen.

---

## Fazit

- Beide Regeln sind fachlich vertretbar und richtig umgesetzt.
- Die Datenprüfung findet keine Abweichung: Zwischensumme, Pauschale, Total, Saldo, PDF-Zeilen und QR-Betrag stimmen in allen geprüften Fällen.
- Für den Merge offen bleibt kein kritischer oder hoher Punkt.
- Empfohlen sind V-1 (Saldo 0 nicht als überfällig führen) und die kleinen Textkorrekturen V-3 und V-5.
- M-1 (Rundungsrichtung) und M-2 (Grundlage pro Vertrag) sind dokumentierte Fachfragen. Sie bleiben «unsicher», bis der Wortlaut von Art. 257a/257b OR und Art. 4/5 VMWG auf Fedlex geprüft ist.
