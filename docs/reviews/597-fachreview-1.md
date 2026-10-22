# Fachreview #597, Runde 1 (Stockwerke unter dem Boden)

Gegenstand: Commit `ffbde89` (rote Tests, neue Zeilen in `docs/design/i18n-begriffe.md`), Issue #597 «Decided (product owner)». Kein Blocker, kein Major.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | In einem Gebäude mit zwei Untergeschossen heisst das obere in der Praxis «1. UG» bzw. «1er sous-sol», und auch das GWR nennt es «1. Untergeschoss» (`src/lib/server/building-register.ts:65`, WSTWK 3401). Dwello zeigt dann «UG» neben «2. UG». Das ist eindeutig, aber nicht einheitlich. Behebung: so lassen, wie entschieden (für die vielen Gebäude mit nur einem UG stimmt «UG»), oder −1 nur dann zählen, wenn das Gebäude Wohnungen unter −1 hat. |
| V-2 | Verwalter | Minor | Das Gegenstück zu 500-1 V-5: Eine von Hand erfasste Wohnungsnummer «1. UG» auf Stockwerk −1 ergibt nach der Änderung «Wohnung 1. UG, UG». Das liegt daran, dass `namedByFloor` (`backend/src/services/pdf.service.ts:669`) nur noch «UG» kennt. Behebung: Für −1 auch die gezählte Form gelten lassen (de «1. UG», fr «1er sous-sol», it «1° piano interrato», en «1st basement») und eine Zeile im Test «Wohnung, die nach ihrem Stockwerk heisst» ergänzen. |

## Fehlende Begriffe

- `UBIQUITOUS_LANGUAGE.md:20` (Stockwerk) nennt nur «UG, EG, 1. OG, 2. OG usw.» und «-1 = UG». Was ab −2 gilt, steht dort nicht. Vorschlag für die Zeile (Issue mit `fachlich`, `entscheiden`): «Lage der Wohnung: UG, EG, 1. OG, 2. OG usw.; Untergeschosse unter dem UG werden gezählt: 2. UG, 3. UG.» Technische Spalte: «`floor` Feld (Zahl: -1 = UG, -2 = 2. UG, 0 = EG)».

## Nicht bestätigt

- Ob «UG» ohne Zahl neben «2. UG» in der Deutschschweiz verbreitet ist: Ich habe keine Norm und keinen Verbandstext gefunden. Gesucht habe ich mit `mmx search` (GWR-Merkmalskatalog, Inserate). Der GWR-Katalog auf housing-stat.ch war nicht erreichbar (DNS-Fehler). Die Codebezeichnung «1. Untergeschoss» stammt aus dem Kommentar im Code und aus dem Suchauszug des Liechtensteiner GWR-Katalogs («das erste Untergeschoss … das zweite Untergeschoss»). In Westschweizer Inseraten und Baubeschrieben steht «1er sous-sol / 2e sous-sol», sobald es zwei Untergeschosse gibt. Für Gebäude mit nur einem Untergeschoss steht «sous-sol» ohne Zahl. Gründe für V-1.
- Italienisch «2° piano interrato» und «pianterreno»: Ich habe keine Tessiner Quelle geprüft. Die Begriffe sind gebräuchlich, aber **unsicher**, was den regionalen Vorzug angeht («piano terreno»).
- Eine rechtliche Vorgabe zur Bezeichnung des Stockwerks (OR 253 ff., VMWG) habe ich nicht gesucht: Die Änderung berührt keinen Rechtsinhalt.

Geprüft: Testerwartungen (de/fr/it im PDF bei −1 und −2, UI de/fr/it, en unverändert in `statement-pdf-render.test.ts:134-135` und `buildings-i18n.test.ts:43`), «Wohnung UG» auf −1 nach der Regel von #500, die vier neuen Zeilen in `i18n-begriffe.md`, vorhandene Texte `apartments_floor_basement`/`apartments_floor_lower` in allen vier Sprachen. Nebenwirkung, die zur Entscheidung passt: Die Auswahlliste und der Nummernvorschlag beim Import (`building-register.ts:81`) unterscheiden −1 und −2 jetzt auch auf de/fr/it.
