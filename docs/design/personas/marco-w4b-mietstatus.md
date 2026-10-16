# Marco – Mietstatus auf dem Handy (w4b)

Persona: Marco, 38, Handy 390 × 844, Touch. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/marco-w4b-mietstatus/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mieterliste, Filter «Ehemalige Mieter» | Der Filter zeigt «Keine Mieter gefunden», obwohl Sarah Meier nur beendete Mietverträge hat («Keine laufende Miete»). Sie steckt in keinem Filter ausser «Alle Mieter» und hat in der Liste auch kein Abzeichen. |
| P-2 | Minor | Übersicht, «Vermietete Wohnungen pro Gebäude» | Uneinheitlich: Bei Seepark steht «Wohnung B1 leer seit 01.04.2022», bei Musterhaus nur «1 vermietet ab 01.01.2027» ohne Wohnungsnummer und ohne die leere Wohnung 2.02, bei Alpenblick nur «2/3 vermietet» ohne Hinweis auf die leere Wohnung. |
| P-3 | Minor | Übersicht, Kachel «Gebäude und Wohnungen» | Die Kachel heisst wörtlich «Vermietet ab …» mit Auslassungspunkten. Auf dem Handy wirkt das wie abgeschnittener Text; ein Datum oder eine Wohnung steht nirgends. |
| P-4 | Minor | Mietvertrag Sarah Meier (A2), Löschdialog | Titel «Mietvertrag löschen?» mit einem roten, aber deaktivierten Knopf «Mietvertrag löschen», obwohl der Text sagt, dass der Vertrag nicht gelöscht werden kann. Die zwei Abrechnungs-Links sind gut erreichbar (48 px hoch, Bildschirmmitte). |
| P-5 | Minor | Übersicht, Karte «Nachmieter für Wohnung B1 suchen» | «Der Mietvertrag von Sarah Meier endet am 31.03.2022»: Präsens für ein Datum, das schon über vier Jahre zurückliegt. Ich habe zuerst gedacht, das Datum sei falsch. |

## Beobachtungen

- Keine Seite scrollt seitwärts: Übersicht, Gebäude, Wohnungen, Mietvertrag, Dialog und Mieterliste haben alle eine Breite von 390 px.
- Bei den Wohnungszeilen im Gebäude, den Mietvertragskarten auf der Wohnungsseite und den Zeilen der Mieterliste kann ich die ganze Karte antippen (auch die Abzeichen «Vermietet ab 01.01.2027» und «Künftig»). Das ist gut.
- Wohnung 3.02 (Vermietet ab 01.01.2027) bietet trotzdem den Hauptknopf «Mietvertrag erfassen» an. Ich wüsste nicht, ob ich da aus Versehen einen zweiten Vertrag anlege.
- Wohnung 3.02 zeigt «Künftiger Mieter … Lea Frei», aber keine Karte «Monatliche Miete». Die anderen vermieteten Wohnungen haben eine.
- Die Hilfe «Vermietet ab …» sagt nicht, wer die Nebenkosten bis zum Einzug trägt. Bei «Leer seit» steht das («tragen Sie als Vermieter»).
- Die Mieterliste wendet den Filter erst nach «Suchen» an. Ändere ich nur die Auswahl, passiert nichts.
- Die Zeile von Lea Frei in der Mieterliste nennt keine Wohnung («Mietvertrag ab 01.01.2027»); bei allen anderen steht «Wohnung X - Gebäude».
- Auf dem Mietvertrag von Sarah Meier sind Mietername, E-Mail, Telefon und «Wohnung A2» Links mit nur 20 px Höhe. Die kann ich mit dem Daumen schlecht treffen.
- Mietvertrag Sarah Meier: oben «3 Abrechnungen fehlen» für 2021 bis 2023. Im Löschdialog stehen nur 2025 und 2024. Das passt zusammen, aber ich musste zweimal lesen.
- Gebäudeseite Musterhaus: Unter «Angaben zum Gebäude» steht eine graue Fläche mit einem kleinen Quadrat, deren Zweck ich nicht erkenne (wohl ein Kartenplatzhalter).
- Ganz unten auf jeder Seite steht «Version unbekannt».

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten und rund 25 Schritte (Taps, Scrollen, Lesen) für alle vier Teilaufgaben.

## Ablauf

1. **Übersicht, Belegung pro Gebäude.** Erwartet: pro Gebäude, welche Wohnung leer ist und seit wann, und welche ab wann vermietet wird. Gesehen: Kachel mit 9 Vermietet, 1 Vermietet ab …, 3 Leer und 0 Gesperrt; darunter «Musterhaus Zentrum 4/6 vermietet, 1 vermietet ab 01.01.2027 66.7 %», «Seepark Residenz 3/4 vermietet, Wohnung B1 leer seit 01.04.2022 75.0 %», «Alpenblick 2/3 vermietet 66.7 %». Kein seitliches Scrollen, die Gebäudenamen sind 48 px hohe Links. Welche Wohnung im Musterhaus ab 2027 vermietet ist und welche dort und in Alpenblick leer ist, sehe ich erst auf der Gebäudeseite (P-2). Dort ist es klar: «6, davon 4 vermietet, 1 vermietet ab 01.01.2027 und 1 leer», Zeile 2.02 «Leer» und Zeile 3.02 «Vermietet ab 01.01.2027», dazu die Legende «Was bedeutet der Mietstatus?».
2. **Wohnung B1 (Seepark).** Erwartet: Status leer mit Datum und der frühere Vertrag. Gesehen: Abzeichen «Leer seit 01.04.2022», darunter «Es läuft kein Mietvertrag, die Wohnung kann vermietet werden.» und «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» «Aktueller Mieter: Diese Wohnung ist derzeit nicht vermietet.» Unter «Mietverträge der Wohnung» → «Frühere Mietverträge» steht der Mietvertrag von Sarah Meier, 01.01.2018 – 31.03.2022, gekündigt, «Beendet», mit «Bleibt als Historie erhalten: …». Die ganze Karte lässt sich antippen. Gut lesbar.
   **Wohnung 1.01 (Musterhaus).** Gesehen: «Vermietet», «Ein Mietvertrag läuft.», «Aktueller Mieter Hans Müller», Knopf «Mieter Hans Müller öffnen» (48 px), Mietkarte. Unter «Mietverträge der Wohnung» der laufende Vertrag von Hans Müller («Laufend») und unter «Frühere Mietverträge» der von Kevin Fischer (01.06.2018 – 28.02.2021). Ein Tipp auf den Betrag oder den Hilfetext der Karte öffnet den richtigen Vertrag. Gut.
3. **Mietvertrag Sarah Meier, A2, Löschdialog.** Erwartet: Der Dialog sagt, warum nicht gelöscht werden kann, und ich komme zu den Abrechnungen. Gesehen: «Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in:» mit den Links «NK-22222222-2025-0002 (Entwurf)» und «NK-22222222-2024-0002 (bezahlt)», je 48 px hoch und fast so breit wie der Dialog, auf halber Höhe des Bildschirms: mit dem Daumen gut erreichbar. Ein Tipp öffnet die Abrechnung 2025; mit «Zurück» lande ich wieder auf dem Vertrag (der Dialog ist dann zu, das ist in Ordnung). Den roten Knopf «Mietvertrag löschen» kann ich nicht antippen, er ist deaktiviert (P-4). Ich habe nichts bestätigt.
4. **Mieterliste, künftige Mieter.** Erwartet: ein Filter «künftig». Gesehen: Auswahl «Mieter» mit Alle, Aktive, Künftige und Ehemalige Mieter. «Künftige Mieter» wählen und «Suchen» tippen ergibt «1 Mieter: Lea Frei, Mietvertrag ab 01.01.2027, Künftig». Ihre Seite zeigt «Künftige Miete: Wohnung 3.02 Musterhaus Zentrum, Einzug am 01.01.2027». Zur Kontrolle habe ich «Ehemalige Mieter» gewählt: leer, obwohl Sarah Meier nur beendete Verträge hat (P-1).

## Verwirrung

- «Vermietet ab …» als Kachelname: Ab wann? Welche Wohnung? (P-3)
- «Mietstage» (im Löschdialog, auf dem Vertrag und bei den früheren Verträgen): Ich kenne «Miettage». Ist das dasselbe?
- «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.» Bei B1 steht aber ein «leer seit»-Datum, das offenbar aus dem Vertragsende kommt. Setze ich «Leer» jetzt selber oder nicht?
- Der Filter heisst nur «Mieter», nicht «Status» oder «Mietverhältnis».
- «Ehemalige Mieter» ist leer, obwohl Sarah Meier ausgezogen ist (P-1).

## Fehlerrisiken

- Wegen P-1 halte ich Sarah Meier für gelöscht und erfasse sie neu, oder ich finde sie für eine Korrektur der Abrechnung nicht.
- Auf Wohnung 3.02 lege ich mit «Mietvertrag erfassen» einen zweiten Vertrag an, obwohl schon einer ab 2027 abgeschlossen ist.
- Wegen P-5 lese ich das Vertragsende von 2022 als künftiges Datum.

## Vorschläge

- **P-1:** Mieter → Auswahl «Mieter» = «Ehemalige Mieter» → «Suchen» → «Keine Mieter gefunden». Unter «Alle Mieter» steht Sarah Meier mit «Keine laufende Miete». Vorschlag: Mieter ohne laufenden oder künftigen Vertrag als ehemalig zählen und mit dem Abzeichen «Ehemalig» zeigen. Sollte «ehemalig» etwas anderes heissen, eine Hilfe am Filter.
- **P-2:** Übersicht → «Vermietete Wohnungen pro Gebäude». Vorschlag: bei jedem Gebäude dieselbe Form, mit Wohnungsnummer, zum Beispiel «Wohnung 3.02 vermietet ab 01.01.2027; Wohnung 2.02 leer». Bei Alpenblick «Wohnung OG2 leer».
- **P-3:** Übersicht → Kachel «Gebäude und Wohnungen». Vorschlag: «Künftig vermietet» oder «Vermietet ab später», ohne Auslassungspunkte.
- **P-4:** Mietvertrag Sarah Meier → «Löschen». Vorschlag: Titel «Mietvertrag kann nicht gelöscht werden» und statt des deaktivierten roten Knopfs nur «Schliessen».
- **P-5:** Übersicht → Karte «Nachmieter für Wohnung B1 suchen». Vorschlag: «Der Mietvertrag von Sarah Meier endete am 31.03.2022.» (Vergangenheit, wenn das Datum vorbei ist).

## Nicht geprüft

- Ob sich leere oder gesperrte Wohnungen beim Bearbeiten umstellen lassen: Ich sollte nichts speichern.
- Löschen bestätigen: Das war nicht erlaubt; der Knopf war ohnehin deaktiviert.
- Andere Sprachen und Dunkelmodus.
- Ein Gebäude mit einer gesperrten Wohnung: Die Demodaten haben keine (0 Gesperrt).
