# Datenprüfung #461, Runde 1

Worktree 8e958ede (detached, nur gelesen). App: Persona-Stack, `dwello_persona`. Skripte (ausserhalb des Repos): `scratchpad/chk/recompute.py` (Neuberechnung aus Rechnungen, Schlüsseln, Akonto, Tankbestand), `scratchpad/chk/qr.py` (zxing-cpp im venv), `scratchpad/chk/ref.py` (IBAN mod 97, QRR-Prüfziffer). Ausgaben: `scratchpad/out/`.

## Ergebnis

Keine Befunde. Blocker 0, Major 0, Minor 0, Nit 0 aus #461. Eine Beobachtung ohne Bezug zu #461 steht unten.

| ID | Schwere | Datensatz | erwartet | tatsächlich |
|---|---|---|---|---|
| (keine) | | | | |

## Geprüft und bestanden

Quelle der PDFs: die in `utility_statements.pdf_blob` gespeicherten Entwurfs-PDFs (Entwürfe werden bei jedem Abruf vom laufenden Backend neu erzeugt; Dubois zuletzt 22:03, die anderen 21:44). Ich habe keine Anfrage an den BFF gestellt (siehe «Nicht bestätigt»).

Neuberechnung (Decimal, Halb-auf je Position, Saldo zugunsten des Mieters auf 5 Rappen) gegen gespeicherte Werte: alle Zeilen, Zwischensumme, Verwaltungspauschale, Total, Akonto, Saldo gleich auf den Rappen.

| Datensatz | Zwischensumme | Pauschale | Nebenkosten | Akonto | Saldo roh -> gerundet | gespeichert |
|---|---|---|---|---|---|---|
| Dubois fr, NK-11111111-2025-0003 | 3'283.86 | 3 % = 98.52 | 3'382.38 | 3'240.00 | 142.38 -> 142.35 | 142.35 |
| Rossi it, NK-11111111-2025-0004 | 4'308.85 | 3 % = 129.27 | 4'438.12 | 4'200.00 | 238.12 -> 238.10 | 238.10 |
| Bernasconi it, NK-22222222-2025-0004 | 3'117.87 | 2.5 % (Vertragssatz) = 77.95 | 3'195.82 | 3'120.00 | 75.82 -> 75.80 | 75.80 |
| Schmidt de, NK-11111111-2025-0002 | 3'488.85 | 3 % = 104.67 | 3'593.52 | 3'600.00 | -6.48 -> -6.50 | -6.50 |

- Positionen: Kosten des Gebäudes (inkl. Leistungszeiträume bei Bernasconi, Q4/2024 zählt 0 Tage, Q4/2025 voll; Heizöl nach Verbrauch 2'650.00 + 6'565.00 - 2'257.20 = 6'957.80), Wohnungsanteil, Zeitanteil 365/365 und Ihr Anteil stimmen mit der Datenbank (`utility_statement_line_items`) und dem PDF Zeile für Zeile überein, in fr, it und de. Reihenfolge der Positionen ist in allen Sprachen gleich (Schmidt de als Vergleich).
- Schlüsselzeilen im PDF: «1 / 6 logements», «85.00 / 492.50 m²», «70 % × 85.00 / 492.50 m² + 30 % × 1 / 6 logements» (fr); «1 / 6 appartamenti», «120.00 / 492.50 m²», «95.00 / 320.00 m²» (it): gleiche Zahlen wie `key_values`.
- Neue Bezeichnungen: fr «Frais d'administration : 3 % du sous-total de CHF 3'283.86»; it «Spese amministrative: 3 % del subtotale di CHF 4'308.85» (Rossi) und «2.5 %» (Bernasconi). Alte «Frais de gestion»/«Spese di gestione» kommen nicht vor.
- Namen der Stammdaten im PDF gleich der Datenbank (nach Migration 0027): fr Conciergerie, Électricité des parties communes, Entretien du jardin, Enlèvement des ordures, Ramonage, Par logement, Par surface (m²), Chauffage (surface 70 % / logement 30 %); it Custode, Cura del giardino, Elettricità parti comuni, Spazzacamino, TV/Cavo, Per unità, Per superficie (m²), Riscaldamento (superficie 70 % / unità 30 %). Das «%» hat in der Datenbank U+00A0 (hex `c2a0`, auch `name_de` des Schlüssels); der Umbruch trennt «70 %» nicht. `name`/`name_de` der Kategorien unverändert (z. B. Caretaker/Hauswart).
- Stockwerke: Dubois (Etage 2) «2e étage», Rossi (3) «3° piano», Bernasconi (1) «1° piano», Schmidt de «1. OG»: stimmt mit `apartments.floor`.
- Kein deutscher Text in den fr/it-PDFs (Suche nach Wohnung, Zwischen, Verwaltung, Rechnung, Heiz, Kosten, Seite, Mieter, Akonto, Nebenk: kein Treffer ausser «Zürich»). Zahlteil und Kopfzeile in der Sprache (Section paiement, Monnaie, Point de dépôt; Sezione pagamento, Valuta, Punto di accettazione; «Page 1 sur 2», «Pagina 1 di 2»).
- Layout (Seiten als PNG gerendert, Seite 1 von Dubois und Rossi angesehen): nichts abgeschnitten, keine Überlappung; lange Namen und der Heizschlüssel brechen innerhalb der Spalte um; «Montant à payer avant arrondi» und «Importo dovuto prima dell'arrotondamento» brechen in der Beschriftungsspalte um (kein Datenverlust). Beträge und Gesamtbetrag vollständig auf Seite 1, Seite 2 mit Hinweisen und Zahlteil.
- QR-Rechnungen (Seite 2 mit `pdftoppm -png -r 200`, Decoder zxing-cpp), alle drei dekodiert:

| | IBAN | Betrag | Referenz (QRR) | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|
| Dubois | CH4431999123000889012 | 142.35 CHF | 009328314844893895246270176 | Décompte des charges NK-11111111-2025-0003 | Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich, CH |
| Rossi | gleiche | 238.10 CHF | 000360945365857627496466599 | Conteggio spese accessorie NK-11111111-2025-0004 | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich, CH |
| Bernasconi | gleiche | 75.80 CHF | 005596721441906840168426892 | Conteggio spese accessorie NK-22222222-2025-0004 | Marco Bernasconi, Seeweg 15, 6003 Luzern, CH |

  IBAN besteht mod 97 und entspricht `configuration.iban`; Gläubiger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich; Betrag = Saldo in der Datenbank; Referenzen 27-stellig, Prüfziffer (Modulo 10 rekursiv) stimmt und gleicht `qr_bill_reference`; Betrag im QR = Betrag im Zahlteil und im Kasten «Montant/Importo». Schmidt (Rückerstattung -6.50) hat korrekt keinen Zahlteil.

## Beobachtung (nicht #461, kein Befund)

Dubois zeigt «Date du décompte 20.10.2026» und Frist 19.11.2026, die anderen Entwürfe 19.10./18.11.2026. Ursache: der Entwurf wurde um 22:03 UTC (00:03 Ortszeit) neu erzeugt, `statement_date` zieht beim Abruf eines Entwurfs nach. Reproduzieren: `select statement_number, statement_date, pdf_generated_at from utility_statements where statement_number like 'NK-11111111-2025-000%'`. Verhalten bestand vor #461.

## Nicht bestätigt

- Webseite (Oberfläche) und BFF-Abruf: Der Stack meldet sich nur über OAuth an; ohne selbst signiertes JWT (vom Koordinator untersagt) bekam ich keine Sitzung (`http://localhost:3300/` antwortet 303). Der Vergleich «Oberfläche = PDF» ist deshalb über die Datenbank (Quelle der Oberfläche: `utility_statements`, `utility_statement_line_items`) geführt, nicht über die gerenderte Seite.
- «Deutsches PDF desselben Laufs» für Dubois/Rossi/Bernasconi: ein Abruf in de würde per `generate-pdf` das PDF speichern und braucht die Anmeldung. Ersatz: Schmidt (de, gleiches Gebäude, gleiche Rechnungen) und meine unabhängige Neuberechnung in der Sprache de/fr/it; Beträge und Reihenfolge stimmen.
- Englische Stockwerke («1st floor», «2nd floor»): kein englischer Entwurf unter den genannten Datensätzen (kein Mieter mit Sprache en, nur die Landessprachen fr/it/de). Nicht geprüft.
- Die PDFs sind die gespeicherten Blobs von 21:44/22:03; dass der Build 6ba20ebc sie erzeugt hat, folgt aus den neuen Bezeichnungen im Text, nicht aus einem Build-Nachweis.
- Benutzerdefinierter Schlüssel «Nach Raumvolumen Helga» (name_it/name_en leer, Persona-Daten) kommt in keinem geprüften Entwurf vor; Rückfall nicht geprüft.
