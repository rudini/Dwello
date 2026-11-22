# Datenprüfung 1464-1, Runde 1

Stand: Commit 64c589d (Worktree `/tmp/claude-0/-home-user-Dwello/a56e1b23-12aa-57fa-8ed1-b0248793da10/scratchpad/review-1464-1-daten`, nur gelesen). App: Persona-Stack (Frontend :3300, Backend :3301, DB `dwello_persona`), nichts geschrieben, nichts neu gestartet.

## Ergebnis

Keine Findings. Alle fünf Anforderungen sind bestätigt, ohne Differenz auf den Rappen.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | – | – | – | – |

## Wie geprüft

Eigenes Skript `/tmp/claude-0/-home-user-Dwello/a56e1b23-12aa-57fa-8ed1-b0248793da10/scratchpad/recompute.py`. Es liest `invoices`, `fuel_stocks` und `categories` per `psql` aus `dwello_persona` und importiert keinen Dwello-Code. Die Regeln stammen aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1, 5, 10) und `UBIQUITOUS_LANGUAGE.md` (Tankbestand, Stichtag, Verbrauch Heizmaterial):

- Eine Rechnung ohne Leistungszeitraum zählt in der Periode ihres Rechnungsdatums.
- Eine Rechnung mit Leistungszeitraum zählt mit Betrag × Tage in der Periode / Tage des Leistungszeitraums, je Rechnung auf den Rappen gerundet.
- Liegen Anfangsbestand (Tag vor Periodenbeginn) und Endbestand (letzter Periodentag) vor, zählt eine Lieferung ganz in der Periode ihres Lieferdatums (Ende des Leistungszeitraums, sonst Rechnungsdatum).
- Position = Anfangsbestand + Lieferungen − Endbestand.
- Nicht umlagefähig ist `is_valid_utility_cost = false`, gezählt wie eine umlagefähige Rechnung.

Die API-Antworten holte ich mit dem Persona-Token (`tok.mjs`, wie `docs/design/tools/persona-kit.mjs`). Quellen: `GET /api/v1/reports/reconciliation` für alle 5 Perioden und 6 Gebäude/Jahr-Kombinationen, `GET /api/v1/statements/run-reconciliation` für 4 davon. Die Antworten liegen in `.../scratchpad/api/`.

Anforderungen:

1. **Zeilen ergeben «Kosten des Gebäudes».** Für Musterhaus Zentrum 2024 und 2025, Seepark Residenz 2024 und 2025 und Alpenblick 2024 stimmt bei jeder Position (8 + 9 + 6 + 6 + 5) die Summe der Zeilen mit `buildingCosts` überein, bei Tankpositionen mit Anfangsbestand und minus Endbestand. Die nicht umlagefähigen Zeilen ergeben `nonAllocable`. Es gibt keine Position, die aus einem anderen Grund als Rundung nicht aufgeht, also keinen Blocker nach dem «Stop and ask». Zusätzlich geprüft: Alpenblick 2025 (nicht in «Berichte» gelistet, aber über die API und die Vorschau erreichbar), ebenfalls ohne Differenz.
2. **Jede Zeile gegen die Tabelle `invoices`.** Rechnungssteller, Rechnungsdatum, Rechnungsbetrag und `inPeriod` stimmen. Bei Rechnungen über die Periode hinaus stimmen auch `beyond.start`, `end`, `days` und `ofDays`: Kalk-Ex 365 von 1461 Tagen, CHF 199.86; Grünwerk (Seepark) 184 von 365 Tagen, CHF 368.00 in 2024 und 181 von 365 Tagen, CHF 362.00 in 2025. Keine Rechnung fehlt, keine steht doppelt, keine unter der falschen Position. Das gilt auch für die Seepark-Heizrechnungen, deren Rechnungsdatum in einem anderen Jahr als der Leistungszeitraum liegt (20.01.2025 zählt 2024, 20.01.2026 zählt 2025).
3. **Anfangs- und Endbestand gegen `fuel_stocks`.** Stichtag und Betrag stimmen bei Musterhaus Zentrum (31.12.2023: 2120.00, 31.12.2024: 2650.00, 31.12.2025: 2257.20) und Alpenblick (1536.00, 1792.00, 1494.00). Seepark hat keinen Tank und keine Tankzeilen.
4. **Summen unverändert.** Mein unabhängig gerechnetes `buildingCosts` entspricht dem der API bei allen Positionen und allen 6 Totalzeilen. «davon Mieter» entspricht der Summe der gespeicherten `utility_statement_line_items.tenant_share` (nicht ersetzte Abrechnungen) je Position und Total. «davon tragen Sie» = Kosten − Mieter, auf den Rappen gerundet. Der Diff `origin/main..64c589d` am Service ändert die Berechnung von `buildingCosts` nicht: `cents(group.totalAmount)` bleibt. `nonAllocable` ist jetzt die Summe der gerundeten Zeilen und entspricht dem alten Wert in allen Perioden (Musterhaus 2024: 2350.00, 2025: 480.00, sonst 0). Ich konnte `origin/main` nicht gegen die laufende App rechnen, weil ich sie nicht neu starten darf. Der Vergleich beruht deshalb auf meiner Neuberechnung und den gespeicherten Abrechnungen.
5. **Bildschirm gegen API.** Mit Playwright (Persona-Cookie, nichts gespeichert) habe ich auf «Berichte» alle Positionen aufgeklappt, in 5 Perioden und 5 Aufklappblöcken je Position plus «Nicht umlagefähige Rechnungen». Jede Zeile (Name, Datum, Detailtext, Betrag) stimmt Zeichen für Zeichen mit der aus der API gebildeten Erwartung überein (`cmp_ui.py`, 0 Differenzen). Das gilt auch für «365 von 1461 Tagen» und die Heiz-Tankzeilen. Das Schweizer Apostroph und die zwei Nachkommastellen stimmen. Der Tabellenkopf der Seite (Position, «Kosten des Gebäudes», «davon Mieter», «davon tragen Sie», Total, Verwaltungspauschale, nicht umlagefähig) stimmt in allen 5 Perioden mit der API überein. Die Vorschau des Abrechnungslaufs (`/statements/generate?building=…&start=…&end=…`, bis zum Schritt «Vorschau», ohne zu erstellen) habe ich für Musterhaus Zentrum 2025 und Alpenblick 2025 aufgeklappt: Zeilen wie in `run-reconciliation`, bei Musterhaus identisch mit «Berichte», bei Alpenblick Heizung 1792.00 + 4880.00 − 1494.00 = 5178.00. Für Musterhaus 2024, Musterhaus 2025, Seepark 2025 und Alpenblick 2025 sind `rows` und `nonAllocableRows` des Laufs gleich denen des Berichts (Alpenblick 2025: Mieter 4884.61 im Lauf, weil er die Abrechnungen erst erstellen würde, dagegen 0 im Bericht).
   Sprachen: Musterhaus 2025 in fr, it und en (Browser-Locale, ohne das Konto zu ändern). Beträge, Daten, Tage und Stichtage sind identisch mit Deutsch. Die Texte «entièrement dans cette période», «365 sur 1461 jours», «Stock initial / moins stock final», «interamente in questo periodo», «365 su 1461 giorni», «Scorta iniziale / meno scorta finale», «entirely in this period», «365 of 1461 days», «Opening stock / less closing stock» erscheinen ohne deutsche Reste.

Von mir festgestellt, aber kein Finding: Der Betrag ist von «CHF» durch ein geschütztes Leerzeichen getrennt. Das ist das bestehende Format von `formatCurrency` und ändert keinen Wert.

Geprüft: Berichte Musterhaus Zentrum 2024 und 2025, Seepark Residenz 2024 und 2025, Alpenblick 2024 (alle Positionen, Total, Verwaltungspauschale, nicht umlagefähige Zeilen, Tankzeilen); `run-reconciliation` Musterhaus 2024 und 2025, Seepark 2025, Alpenblick 2025 (API) und Vorschau Musterhaus 2025 und Alpenblick 2025 (Oberfläche); Rechnungen Kalk-Ex GmbH und Sanitär Keller AG (2024 und 2025); Fr/It/En-Ansicht Musterhaus 2025.

## Nicht bestätigt

- **QR-Rechnungen und PDF:** Diese Änderung berührt weder PDF noch QR-Rechnung (Kostenabstimmung erscheint in keinem PDF). Es gibt hier keinen QR-Code zu dekodieren und kein PDF zu vergleichen. Ich habe `pdftoppm` und einen Decoder nicht eingesetzt.
- **Fehlerfälle, die die Demodaten nicht enthalten:** Position ohne Rechnung («Für diese Position gibt es keine Rechnung mehr», Text `reconciliation_no_invoice`), Tank mit Anfangs- und Endbestand 0, Lieferung in eine Tankkategorie mit Leistungszeitraum über die Periode hinaus, mehrere Rechnungen über die Periode hinaus in einer Position (Rundung der Summe) und eine Kategorie mit mehreren Verteilschlüsseln. Ich darf keine Datensätze anlegen. Gesucht habe ich in `invoices` und `fuel_stocks` von `dwello_persona`. Diese Fälle deckt nur `backend/src/__tests__/cost-reconciliation-rows.pg.test.ts` ab, das ich nicht gelesen oder ausgeführt habe.
- **Vergleich mit dem Stand von `origin/main`:** nicht gegen eine laufende Instanz von `origin/main` gerechnet (siehe Anforderung 4).
- **Ansicht auf dem Telefon (390 px) und Dark Mode:** nicht geprüft, das gehört nicht zur Datenprüfung (es geht um Beträge und Texte).
