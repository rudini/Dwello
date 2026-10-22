# Datenprüfung #597 (Abrechnungs-PDF, Stockwerk -1)

Stand: Basis 562443c gegen 4874c0f (nur `backend/src/services/pdf.service.ts` betrifft das PDF). Datenbank dwello_persona (Demo), Backend :3301 erreichbar.

## Vorgehen
- Eigenes Skript `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/render597-base.ts` und `render597-head.ts` (Kopien: `base597/`, `head597/` per `git archive`, nicht das Repository). Es ruft `generateStatementPdf` für alle 17 Demo-Abrechnungen in de/fr/it/en auf (68 PDFs je Lauf). `db.update` ist durch einen Stub ersetzt: nichts wird gespeichert.
- In den Kopien ist nur `apartmentOf` so geändert, dass die Umgebungsvariable `FLOOR` das Stockwerk im Speicher überschreibt. Läufe: Demo-Stockwerke, -1, -2, -3 je für Basis und Head.
- Vergleich: `pdftotext -layout` jedes PDF plus das Datenobjekt (JSON: QR-Referenz, alle Beträge). Ausgaben: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/out597/{base,head}-{none,-1,-2,-3}/`.

## Ergebnis
| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| - | - | keine Befunde | | |

Geprüft und bestanden:
- Demo-Stockwerke (alle >= 0): Text und JSON aller 68 PDFs Basis = Head, identisch. Kein Betrag, keine QR-Referenz verändert.
- Stockwerk -1: JSON (Beträge, QR-Referenz) identisch. Einziger Textunterschied ist die Wohnungszeile, in 51 von 68 PDFs (de/fr/it), sonst keine Zeile:
  - de `Wohnung 1.01, 1. UG, 75.50 m²` -> `Wohnung 1.01, UG, 75.50 m²`
  - fr `Appartement 1.01, 1er sous-sol, ...` -> `Appartement 1.01, sous-sol, ...`
  - it `Appartamento 1.01, 1° piano interrato, ...` -> `Appartamento 1.01, piano interrato, ...`
  - en: unverändert `basement` (Basis nannte -1 schon so); 0 Unterschiede, wie erwartet.
- Stockwerk -2 und -3: Text und JSON Basis = Head (de `2. UG`/`3. UG`, fr `2e sous-sol`, it `2° piano interrato`, en `2nd basement`), wie bisher gezählt.
- Betragsrechnung nicht neu gerechnet: keine Textabweichung ausserhalb der Wohnungszeile, daher nach Auftrag nicht nötig.

## Nicht bestätigt
- QR-Rechnungen nicht dekodiert (QR-Code, IBAN, Betrag, Referenz): kein Betrag, keine Referenz und kein QR-Datenfeld hat sich geändert (JSON identisch, Text identisch), und die Änderung betrifft nur die Wohnungszeile; ein Dekodieren der Seiten war nicht Teil des Auftrags und wurde nicht gemacht.
- Weboberfläche des Stockwerks (Bildschirmtexte) nicht geprüft; nur das PDF.
- Wohnungsnummern, die selbst mit dem Stockwerksnamen beginnen («UG», «1. UG» bei -1; `namedByFloor`), kommen in den Demodaten nicht vor und wurden nicht gerendert.
