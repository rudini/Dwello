# Datenprüfung 1403-1: Warnung im Mahndialog bei fälliger Berichtigung

Stand: Commit d595acdf (Worktree review-1403-daten), Persona-Stack mit dwello_persona, 9.11.2026.

## Ergebnis

Keine Befunde (kein Blocker, kein Major, kein Minor). `recalculated.open` und der Dialogtext stimmen in allen geprüften Fällen auf den Rappen mit meiner unabhängigen Rechnung und mit der echten berichtigten Abrechnung überein.

| ID | Schwere | Datensatz | erwartet | tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | – |

## Was ich gerechnet habe

Skripte im Scratchpad (`/tmp/claude-0/-home-user-Dwello/7c0f8a1f-bdcc-5a7c-9aa7-059ba61bf2c7/scratchpad/`):
- `d1403_recompute.py`: liest Rechnungen, Verteilschlüssel (Pro Fläche, Pro Einheit, Heizung 70/30), Wohnflächen, vereinbarte Kategorien, Tankbestände und Akonto aus der Datenbank und rechnet die Abrechnung neu. Kein Dwello-Code. Regeln aus nebenkostenabrechnung-anforderungen.md und UBIQUITOUS_LANGUAGE.md (Saldo, Mindestbetrag, Übertrag, Schlussabrechnung, Rundung auf 5 Rappen zugunsten des Mieters).
- `d1403_scen.py`, `d1403_real.py`, `d1403_ui.mjs`, `d1403_api.py`: Vergleich mit API, echter berichtigter Abrechnung und Seite.

### 1. Hans Müller, NK-11111111-2025-0001 (Datensatz der Persona-DB, unverändert)

Gespeicherter Stand ohne die Nachzügler-Rechnung, von mir nachgerechnet:

| Position | Kosten Gebäude | Anteil Hans Müller |
|----------|----------------|--------------------|
| Lift (1/6) | 1690.00 | 281.67 |
| Hauswart (75.5/492.5) | 3680.00 | 564.14 |
| Kaltwasser | 3840.00 | 588.67 |
| Allgemeinstrom | 762.80 | 116.94 |
| Gartenpflege | 935.00 | 143.34 |
| Kehricht (1/6) | 990.00 | 165.00 |
| Heizung (2650.00 + 6565.00 − 2257.20 = 6957.80; 0.7·75.5/492.5 + 0.3/6) | 6957.80 | 1094.53 |
| Kaminfeger | 335.00 | 51.36 |

Zwischensumme 3005.65, Pauschale 3 % = 90.17, Total 3095.82, Akonto 12 × 240 = 2880.00, Saldo roh 215.82, gerundet **215.80**. Entspricht den gespeicherten Werten (total_costs 3095.82, management_fee 90.17, balance 215.80).

Mit der Rechnung c0000001-2025-4000-8000-000000001403 (600.00, Hauswart, Pro Fläche, ohne Leistungszeitraum, Rechnungsdatum 15.12.2025 liegt in der Periode):
- Hauswart 4280.00, Anteil 4280 × 75.5/492.5 = 656.12
- Zwischensumme 3097.63, Pauschale 92.93, Total 3190.56
- Saldo roh 310.56, gerundet (abgerundet) **310.55**
- Differenz zu vorher: 310.55 − 215.80 = 94.75

API und Seite (Persona-Stack :3301/:3300):
`recalculated: {balance: "310.55", difference: "94.75", declineCosts: "94.75", open: "310.55"}`. Die Seite zeigt im Hinweis «Neu berechnet ergibt sich für Hans Müller eine Nachzahlung von CHF 310.55 statt CHF 215.80.» Der Dialog zeigt «… ein offener Betrag von CHF 310.55 statt CHF 215.80.» und darunter «Hans Müller schuldet noch CHF 215.80.». Alle drei stimmen mit meinem Wert überein.

### 2. Dialogtexte in allen vier Sprachen (gerendert im Browser, Cookie PARAGLIDE_LOCALE)

Alle vier Texte stimmen wörtlich mit der Tabelle in docs/reviews/1403-fachreview-1.md überein, die Beträge sind 310.55 und 215.80, die Knopfnamen stimmen mit `statements_correct` überein:
- de: «Abrechnung berichtigen» / fr: «Rectifier le décompte» / it: «Rettificare il conteggio» / en: «Correct statement»
- fr hat das geschützte Leerzeichen (U+00A0) vor «:» und in « ».
- Der Satz «schuldet noch» bleibt 215.80 (fr «doit encore», it «deve ancora», en «still owes»).

### 3. Teilzahlung in der Persona-DB (wiederhergestellt)

paid_amount von Hans Müllers Abrechnung auf 100.01 gesetzt, danach wieder auf NULL (Kontrolle: status sent, balance 215.80, paid_amount NULL, prior_payments 0.00). Dialog: «offener Betrag von CHF 210.55 statt CHF 115.79». Meine Rechnung: 310.56 − 100.01 = 210.55 (abgerundet); davor 215.80 − 100.01 = 115.79. API: `open: "210.55"`. Stimmt.

### 4. Varianten und echte berichtigte Abrechnung (Kopie der Datenbank, nicht die Persona-DB)

Ich habe dwello_persona in eine eigene Datenbank kopiert (`d1403_scratch`) und den Backend-Code des Commits d595acdf auf Port 3391 dagegen laufen lassen. Beides ist wieder gelöscht (Datenbank gedroppt, Prozess beendet). Der Persona-Stack und seine Daten blieben unberührt, ausser dem Teilzahlungs-Versuch in Abschnitt 3.

a) `recalculated.open` gegen meine Rechnung, 34 Fälle, 0 Abweichungen. Bezahlt (paid_amount + prior_payments): 0, 100, 100.01, 0.01, 0.02, 100.04, 50 + 50, 30.03 + 70.02, 305.52, 305.56, 305.57, 306.56, 307.56, 310.55, 310.56, 400, −10; jeweils als normale Abrechnung und als Schlussabrechnung (Vertragsende 31.12.2025). Gleiche Läufe mit einem Übertrag von 3.00 aus 2024 (Status settled, von der Abrechnung 2025 gezählt): 34 von 34 gleich.
- Normale Abrechnung: Rest 3.00, 4.00, 4.95 ergeben «0.00» (unter CHF 5, wird übertragen); Rest 5.00 ergibt «5.00»; Rückerstattung ergibt «0.00».
- Schlussabrechnung: Rest 3.00, 4.00, 4.95 werden eingefordert («3.00», «4.00», «4.95»); Rest 0.00 und Rückerstattung ergeben «0.00».
- Rundungsfall wie V-1 des Fachreviews: bezahlt 100.01 ergibt 210.55 (Rest roh 210.55). Bezahlt 0.02 ergibt 310.50 (roh 310.54, abgerundet).

b) `open` gegen die Saldi einer echten berichtigten Abrechnung (POST /:id/replace mit paidAmount, danach POST /:id/correction, Entwurf gelesen, danach zurückgesetzt): 16 Fälle (8 Zahlungen × normal/Schlussabrechnung) ohne Übertrag und 16 mit Übertrag 3.00, 0 Abweichungen. Der Saldo des Entwurfs ist gleich `open`, wenn er eingefordert wird. Er ist bei Rest unter CHF 5 (normal) oder Rückerstattung kleiner und `open` ist dann «0.00». Beispiele: bezahlt 100.01 ergibt Entwurf 210.55 und `open` 210.55. Bezahlt 307.56 (normal) ergibt Entwurf 3.00 und `open` 0.00. Bezahlt 307.56 (Schluss) ergibt Entwurf 3.00 und `open` 3.00. Bezahlt 400 ergibt Entwurf −89.45 (aufgerundet zugunsten des Mieters) und `open` 0.00.

Geprüft: Hans Müller NK-11111111-2025-0001 (c2edd2cd-dd73-4c2c-98de-38f0c001ce2d), Rechnung c0000001-2025-4000-8000-000000001403, Dialog in de/fr/it/en, Teilzahlung, Schlussabrechnung, Rest unter CHF 5, Rückerstattung, Rundung, Übertrag, berichtigte Abrechnung.

## Nicht bestätigt

- **Varianten «nothing_due» und «unquantified» im Browser:** Ich habe sie nur über die API-Werte (`open` = 0.00, bzw. gleicher Betrag) geprüft, nicht als Text im Dialog gerendert. Der Dialog von Hans Müller zeigt nur die Variante «due»; ein Fall «nothing_due» auf der Seite braucht eine überfällige Nachzahlung mit offenem Rest bei neuem Betrag 0 und war in der Persona-DB nicht ohne grössere Änderungen herzustellen. Die Texte selbst habe ich in messages/*.json wörtlich gegen die Fachreview-Tabelle gelesen. Dort stimmen sie.
- **QR-Rechnung und PDF:** Diese Änderung verändert weder PDF noch QR-Rechnung. Es wurde keine QR-Rechnung dekodiert, weil der Mahndialog keine erzeugt (die Mahnung entsteht erst beim Senden, das ich nicht ausgelöst habe).
- **Beobachtung ausserhalb dieses Commits (vorbestehend, kein Befund):** Ist ein Übertrag der Vorperiode offen (Abrechnung 2025 gesendet, ohne `carried_from_id`, 2024 danach auf «settled» mit Saldo 3.00 gesetzt), rechnet `changed-invoices` (balance und open) ohne diesen Übertrag (310.55). Die echte berichtigte Abrechnung zählt ihn, sobald die alte ersetzt ist (313.55). Der Unterschied betrifft `recalculated.balance` schon auf main. Der Zustand ist nur durch nachträgliche Änderung der Vorperiode erreichbar (von mir künstlich hergestellt). Er ist ein Fall für die Fachseite, nicht für diesen Commit.
- Die Seite `/statements/:id` habe ich als Browser-Rendering (persona-kit) gelesen. Ein Screenshot liegt unter dialog-de.png/dialog-fr.png/dialog-it.png/dialog-en.png im Scratchpad.
