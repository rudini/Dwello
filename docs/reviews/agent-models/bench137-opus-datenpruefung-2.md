# Datenprüfung #137, Runde 2 (daten-pruefer, Opus)

Geprüfter Commit: `cbbaafa` (Worktree `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/review-bench137-opus`), Änderung `git diff 25ce827 cbbaafa`.
Skripte und Ausgaben: `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dp-opus/` (`out-*.txt`; Runde 1 liegt in `round1/`).

## Prüfgrundlage (D-1 aus Runde 1: behoben)

- Der Prozess auf :3301 läuft in `…/scratchpad/bench-cbbaafa/backend`. `git rev-parse --short HEAD` ergibt dort `cbbaafa`.
- Einzige lokale Änderung im Worktree ist `docs/design/tools/persona-stack.sh` (`cd "$(dirname "$0")/../../.."` statt `cd /home/user/Dwello`). Die App selbst ist davon nicht betroffen.
- Frontend: `node /tmp/persona-app`; `diff -rq build /tmp/persona-app` zeigt nur `node_modules` und `package.json`.
- Schema: `heating_share` und `position_rental_days` gibt es nicht (0 Spalten).
- Die Testdaten «DP-Opus …» habe ich mit `setup.py` und `generate.py` über die API neu angelegt (gleiche Fälle wie in Runde 1, IDs unten). Dazu kommt ein Vergleichsfall «Olga» ohne Heizprofil.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-3 | Major | Lea `868194dc-e2b0-48f8-b4d5-ff2907936f63`, Position Heizung 596.74 (Leistungszeitraum 01.05.–31.07.2025, Schlüssel 70/30) | Zeitanteil 17/61, Ihr Anteil **57.38**; Zwischensumme 640.02, Pauschale 3.5 % 22.40, Ihre Nebenkosten 662.42, Nachzahlung vor Rundung 430.16, Rundung −0.01, **Nachzahlung 430.15** | Zeitanteil 0.5217 (PDF «48/92 Tage»), Ihr Anteil **107.42**; 690.06 / 24.15 / 714.21, **Nachzahlung 481.95** (DB, Webseite, PDF de/fr/it/en, QR-Betrag) |
| D-3 | Major | Marc `1d25d8a2-7b6e-4cb3-a49b-392a77f81d4f`, gleiche Position | 50/61, Ihr Anteil **202.99**; Ihre Nebenkosten 967.80, vor Rundung 770.38, +0.02, **Nachzahlung 770.40** | 0.5435 (PDF «50/92 jours/Tage/…»), **134.59**; 899.40, 701.98, +0.02, **Nachzahlung 702.00** (DB, Webseite, PDF 4 Sprachen, QR) |
| D-2 | Minor | Detailseite Lea, Marc, Giulia, Tom, Ivo, Nora | nach Regel 5 (neu) «keinen Heizprofil-Hinweis» | Webseite zeigt «Heizprofil: Heizung Mittelland / Heizung Tessin» (`data-testid="statement-heating-profile"`) |
| D-4 | Minor | Nora `625a0c3f-c6cb-45a1-9130-141ee0d7a120` (Periode 01.06.–02.07.2025, 1 Mietstag) | Zeitanteil «1/32 days» (Thema 6: Zeitanteil als Bruch der Mietstage), wie die neue Anforderung «Zeitanteil in Tagen» verlangt | PDF in allen 4 Sprachen «3.13 %» bei beiden Positionen. Beträge richtig (3.13, 2.35) |
| D-5 | Minor (vorbestehend, nicht durch die Änderung) | Olga `45722229-ebc6-43e2-92df-7963866aea28` (ohne Heizprofil), Position Heizung 596.74 | Zeitanteil als Bruch «30/61 Tage» (Thema 6) | PDF «49.18 %». Betrag richtig (70.44) |

### D-3: Sommerperiode ignoriert den Leistungszeitraum einer Heizkosten-Rechnung

Regel 5 in der neuen Fassung sagt: Heizkosten werden «ohne Heizprofil … nach Tagen [verteilt], ebenso wenn die Monate der Periode im Heizprofil zusammen 0 % haben». «Nach Tagen» heisst im ersten Satz derselben Regel: «mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode». Der Leistungszeitraum fällt mit 01.06.–31.07. in die Periode, das sind 61 Tage. Lea hat davon 17 Mietstage (15.–31.07.), Marc 50 (01.06.–20.07.).

`cbbaafa` rechnet im Zweig `period.percentage <= 0` von `handleMidYearMoves` (`backend/src/services/prorating.service.ts:236-239`) mit Mietstagen der Periode / Tagen der Periode (48/92 bzw. 50/92) und lässt den Leistungszeitraum weg. Dieselbe Rechnung ohne Heizprofil (Fall Olga, gleiche Liegenschaft und Periode) rechnet die App dagegen mit dem Leistungszeitraum (0.4918 = 30/61). Die beiden Fälle, die Regel 5 gleichsetzt, rechnen also verschieden.

Nachweis (`recompute.py`, `out-recompute.txt`):

```
== Lea 2025-06-01..2025-08-31 Mietstage 48/92 (2025-07-15..2025-08-31)
  DIFF Heizung     days(0%)  total   596.74 apt 205.88/205.88 share 0.278689/0.5217 tenant 57.38/107.42
  DIFF fee: expected 22.40 stored 24.15
  DIFF total: expected 662.42 stored 714.21
  DIFF balance: expected 430.15 stored 481.95
== Marc 2025-06-01..2025-08-31 Mietstage 50/92 (2025-06-01..2025-07-20)
  DIFF Heizung     days(0%)  total   596.74 apt 247.65/247.65 share 0.819672/0.5435 tenant 202.99/134.59
  DIFF total: expected 967.80 stored 899.40
  DIFF balance: expected 770.4 stored 702.00
checks ok 73 diff 7
```

```sql
select t.first_name, li.total_amount, li.apartment_share, li.period_share, li.tenant_share
from utility_statement_line_items li join utility_statements s on s.id=li.statement_id join tenants t on t.id=s.tenant_id
where t.last_name like 'DP-Opus%' and li.total_amount=596.74;
-- Olga 596.74 143.22 0.4918 70.44   (ohne Heizprofil: mit Leistungszeitraum)
-- Lea  596.74 205.88 0.5217 107.42  (Sommer, Mittelland: ohne Leistungszeitraum)
-- Marc 596.74 247.65 0.5435 134.59
```

PDF Lea-de (`pdf/Lea-de.txt`):

```
Heizung   Heizung (Fläche 70% /   596.74   205.88   48/92 Tage   107.42
```

QR (`out-qr.txt`): `Lea-*: amount 481.95 CHF vs 430.15` und `Marc-*: amount 702.00 CHF vs 770.40`. IBAN, Referenz, Mitteilung und Debitor sind korrekt.

Gilt das als vorbestehend? Der Rechenzweig steht unverändert schon in `25ce827`. Dort bekam die Zeile im PDF aber die Prozentangabe und den Heizprofil-Hinweis (`byProfile` war bei jedem Heizprofil wahr). Mit `cbbaafa` behauptet das PDF «48/92 Tage». Gleichzeitig verlangt die neu formulierte Regel 5 die Verteilung nach Tagen, bei der die Zeile 17/61 wäre. Die Änderung macht die Abweichung damit sichtbar und widersprüchlich. Ein Mieter mit Taschenrechner kommt mit 205.88 × 48/92 zwar auf 107.42, aber nicht auf die Regel.

Reproduktion:

1. `setup.py` und `generate.py` anlegen lassen: Gebäude «DP-Opus Sommer», Wohnungen 70/90/40 m². Heizung 900.00 mit Leistungszeitraum 01.05.–31.07.2025, Schlüssel «Heating (Area 70% / Unit 30%)». Mietvertrag ab 15.07.2025, Periode 01.06.–31.08.2025, Profil «Heating Mittelland».
2. `recompute.py` ausführen.

### D-2: Detailseite nennt das Heizprofil (unverändert aus Runde 1)

`web.py` (`out-web.txt`): bei Lea, Marc, Giulia, Tom, Ivo und Nora `heizprofil-on-page=[…, 'Heizprofil', 'Heizung Mittelland' | 'Heizung Tessin']`, bei Sven und Olga (ohne Profil) `None`. Quelle: `src/routes/statements/[id]/CostTable.svelte:73-76`, gleich in `25ce827`. Die Beträge auf der Seite entsprechen den gespeicherten Werten, bei Lea und Marc also den falschen aus D-3.

### D-4: Grenzfall 1/32 als Prozent statt Tage

`out-pdf.txt`: `Nora-de: ['label 3.13 % vs share 0.03125', …]`, ebenso fr, it und en. Ursache: `period_share` ist auf 4 Stellen gespeichert (0.0313), und `timeShare` (`backend/src/services/pdf.service.ts`) verlangt `Math.abs(0.0313 - 1/32) < 0.00005`. Der Wert ist aber `0.00005000000000000143` (mit `node -e` ausgewertet). Dieselbe Logik steht schon in `25ce827`. Für die Sommerfälle, die nun «nach Tagen» drucken sollen, ist der Fall aber neu erreichbar. Die Beträge stimmen.

Reproduktion: Mietvertrag ab 02.07.2025 auf Wohnung 1.03, Periode 01.06.–02.07.2025, Profil Mittelland. Dann PDF erzeugen.

### D-5: Ohne Heizprofil, Position mit Leistungszeitraum als Prozent (vorbestehend)

`out-pdf.txt`: `Olga-de: ['label 49.18 % vs share 0.4918…']`. Der Betrag stimmt. Die Änderung berührt diesen Fall nicht. Ich nenne ihn nur, weil er neben D-3 zeigt, wie dieselbe Position nach Tagen im PDF erscheint.

## Geprüft und bestanden (Stand `cbbaafa`)

Nachrechnung (`recompute.py`) mit denselben Regeln und Lesarten wie in Runde 1. Bestanden sind alle Werte ausser den D-3-Zeilen, also 73 von 80 Prüfungen:

| Abrechnung | Fall | Ergebnis |
|---|---|---|
| Lea | übrige 4 Positionen (48/92), Akonto 232.26, Mietstage 48 | OK |
| Marc | übrige 4 Positionen (50/92), Akonto 197.42, Pauschale 0.00 | OK |
| Giulia `bbc78e07…` | Tessin, ganze Periode 153/153, Saldo 585.70 | OK (DB, Web, PDF 4 Sprachen, QR 4) |
| Tom `72d11780…` | Tessin 113/153, Pauschale 2 % 12.03, Rückerstattung −866.55 | OK (DB, Web, PDF 4, kein QR) |
| Pia `7352212f…` | Periode mit Mai 3.5 %: nach Profil, 0.00 %, Saldo 52.05 | OK (DB, Web, PDF 4, QR 4); PDF mit Profilklausel und Heizprofil-Abschnitt |
| Ruth `e87a72ac…` | angebrochener Mai 1.35 %: nach Profil, Rückerstattung −32.05 | OK (DB, Web, PDF 4, kein QR); Profilklausel vorhanden |
| Sven `bc61e7a0…` | ohne Heizprofil 48/123, Saldo 210.95 | OK (DB, Web, PDF 4, QR 4); kein Profiltext, Hinweis Art. 8 Abs. 1 vorhanden |
| Ivo `8b3d9238…` | Tank, Verbrauch 5000 + 1500 − 4200 = 2300, 48/92, Saldo 290.30 | OK (DB, Web, PDF 4, QR 4); Tank-Abschnitt, Art. 8 Abs. 1 und 2, kein Profiltext |
| Nora | Beträge 3.13 / 2.35, Saldo 3.85 | OK (DB, Web, QR 4); Anzeige siehe D-4 |
| Olga `45722229…` | Vergleichsfall ohne Profil, alle Positionen, Saldo 292.50 | OK (DB, Web, PDF 4 Beträge, QR 4) |

Weitere Ergebnisse:

- PDF-Texte (alle 40 PDFs):
  - In allen Sommerfällen (Lea, Marc, Giulia, Tom, Ivo, Nora) gibt es in keiner Sprache «Heizprofil / profil de chauffage / profilo di riscaldamento / heating profile» und keinen Heizprofil-Abschnitt.
  - Die Fussnote endet ohne Heizklausel («… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.»).
  - Der Hinweis auf Art. 8 Abs. 1 VMWG (fr «art. 8 al. 1 OBLF», it «art. 8 cpv. 1 OLAL») steht in allen 40 PDFs.
  - Das Szenario-Ergebnis «48/92 Tage» erscheint bei Lea, Ivo, …; bei Lea aber auch auf der D-3-Zeile, wo es falsch ist.
- QR-Rechnungen (`qr.py`, zxing-cpp auf `pdftoppm -png -r 200` der letzten Seite):
  - 32 QR-Codes (8 Nachzahlungen × 4 Sprachen) dekodiert.
  - Bei allen sind Header, IBAN `CH4431999123000889012` (mod 97 gültig), Kreditor, QRR-Referenz (27 Stellen, Modulo-10-Prüfziffer gültig, gleich `qr_bill_reference`), Mitteilung mit Abrechnungsnummer in der PDF-Sprache und Debitor korrekt.
  - Der Betrag stimmt bei 24 QR-Codes. Bei den 8 von Lea und Marc ist er falsch, siehe D-3.
  - Tom und Ruth haben keinen QR-Code.

## Nicht bestätigt

- Romanisch (`rm`) als PDF-Sprache habe ich nicht geprüft, weil der Auftrag de/fr/it/en nennt.
- Schlüssel «Pro Zimmer» und eigene Formeln habe ich nicht angelegt; die Änderung betrifft sie nicht.
- Die Daten «DP-Sonnet …» und die Demo-Daten habe ich bewusst weder geprüft noch verändert.
