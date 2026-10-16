# Anna – Mietstatus nach Monaten (w4b)

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück. Desktop 1440 × 900, Maus; Übersicht und Mieterliste zusätzlich auf Mobile 390 × 844. Nur angeschaut, nichts gespeichert (beim Löschen-Dialog von Kevin Fischer habe ich «Mietvertrag löschen» ohne Haken nur geklickt, während alle schreibenden Anfragen im Browser blockiert waren; es ging keine Anfrage raus).

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/anna-w4b-mietstatus/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Übersicht, «Vermietete Wohnungen pro Gebäude» | Die Kachel sagt «3 Leer», aber nur bei Seepark Residenz steht, welche Wohnung leer ist («Wohnung B1 leer seit 01.04.2022»). Bei Musterhaus Zentrum steht «4/6 vermietet, 1 vermietet ab 01.01.2027»: Die sechste Wohnung (2.02, leer) fehlt ganz. Bei Alpenblick steht nur «2/3 vermietet». Welche drei Wohnungen leer sind, kann ich auf der Übersicht nicht herausfinden. |
| P-2 | Minor | Gebäudeliste, Gebäudeseite «Angaben zum Gebäude» | In der Liste steht bei Seepark nur «1 leer», ebenso in der Zusammenfassung («4, davon 3 vermietet und 1 leer»). Auf der Übersicht und in der Wohnungszeile derselben Gebäudeseite steht dagegen «leer seit 01.04.2022». Dieselbe Sache, aber nicht gleich beschrieben. |
| P-3 | Minor | Wohnung 2.02, Wohnung 3.02 | Der Hinweis «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» steht bei B1, aber nicht bei 2.02 (auch leer) und nicht bei 3.02 («Vermietet ab 01.01.2027 … auch wenn sie bis dahin leer ist»). Wer bei 3.02 bis Ende 2026 die Nebenkosten bezahlt, steht dort nicht. |
| P-4 | Minor | Übersicht, Kachel «Gebäude und Wohnungen» | Die Kachel heisst «Vermietet ab …» mit drei Punkten. Für mich sieht das abgeschnitten aus, als fehle das Datum. |
| P-5 | Minor | Mieterliste | Bei Lea Frei steht «Mietvertrag ab 01.01.2027 · Künftig», aber anders als bei allen anderen nicht, welche Wohnung. Bei Sarah Meier steht «Keine laufende Miete» ohne Abzeichen, obwohl der Filter von «Ehemalige Mieter» spricht und die anderen «Aktiv» oder «Künftig» tragen. |
| P-6 | Minor | Mietvertrag Sarah Meier (A2), Löschen-Dialog | Der Dialog sagt klar, dass das Löschen nicht geht, und verlinkt die Abrechnungen. Aber: (a) Er listet auch einen Entwurf auf, erklärt aber nur «Eine versendete oder bezahlte Abrechnung bleibt». Ob der Entwurf auch ein Grund ist, bleibt offen. (b) Die Links heissen nur «NK-22222222-2025-0002 (Entwurf)»: Das Jahr muss ich aus der Nummer herauslesen. (c) Der rote Knopf «Mietvertrag löschen» bleibt (blass, deaktiviert) stehen, obwohl Löschen gar nicht geht. |
| P-7 | Minor | Gebäudeseite, «Was bedeutet der Mietstatus?» | Dort steht «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.» B1 wurde aber leer, weil der Mietvertrag endete, nicht, weil ich etwas eingestellt habe. Ich verstehe dann nicht, ob ich bei B1 noch «Leer» einstellen muss. |

## Beobachtungen

- Wohnung 1.01: Die Trennung zwischen «Mietverträge der Wohnung» (Hans Müller, «Laufend») und «Frühere Mietverträge» (Kevin Fischer, «Beendet») ist sehr klar. Der Satz «Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage.» beantwortet meine Frage, wozu der alte Vertrag da ist.
- Löschen-Dialog von Kevin Fischer: Er sagt zuerst, wann man löschen darf (nur wenn irrtümlich erfasst), dann «Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.» und «Für diesen Mietvertrag fehlen noch Nebenkostenabrechnungen. Nach dem Löschen erinnert Dwello nicht mehr daran.» Ohne Haken bei «Dieser Mietvertrag wurde irrtümlich erfasst.» kommt «Bitte bestätigen Sie, …», und es wird nichts gelöscht. Ich würde ihn nicht löschen.
- Der Mietvertrag Kevin Fischer zeigt oben «4 Abrechnungen fehlen» mit Knöpfen «2018 abrechnen» bis «2021 abrechnen», Sarah Meier (A2) «3 Abrechnungen fehlen» (2021–2023). Nach Monaten erschrickt mich das: Muss ich wirklich noch 2018 abrechnen? Ob das so spät noch geht oder sinnvoll ist, sagt die Seite nicht.
- Übersicht, Aufgabe «Nachmieter für Wohnung B1 suchen»: «Der Mietvertrag von Sarah Meier endet am 31.03.2022.» Präsens für ein Datum vor mehr als vier Jahren; «endete» oder «Die Wohnung ist seit 01.04.2022 leer» wäre für mich klarer.
- Wort «Mietstage»: Ich kenne «Miettage». Unklar, ob das ein Fachwort ist oder ein Tippfehler.
- Wohnung 3.02 ist gut erklärt: «Künftiger Mieter – Ab 01.01.2027 vermietet an Lea Frei. Bis dahin läuft kein Mietvertrag.» Der Mietvertrag steht unter «Mietverträge der Wohnung» mit «Künftig».
- Der Filter «Künftige Mieter» in der Mieterliste zeigt genau Lea Frei; ihre Seite sagt «Künftige Miete … Wohnung 3.02, Musterhaus Zentrum, Einzug am 01.01.2027».
- Kevin Fischer steht in der Mieterliste als «Aktiv» in «Wohnung OG1 - Alpenblick», obwohl sein Vertrag in 1.01 beendet ist. Das ist richtig (er ist umgezogen), hat mich aber kurz verwirrt.
- Mobile 390 px: Übersicht und Mieterliste ohne seitliches Scrollen; in «Vermietete Wohnungen pro Gebäude» bricht Alpenblick anders um als die beiden anderen Zeilen (alles in einer Zeile).

## Aufgabe geschafft: teilweise

Schritte 2–5 ja. Schritt 1 nur teilweise: Auf der Übersicht erfahre ich die Zahlen (9 vermietet, 1 vermietet ab, 3 leer) und dass ich die Nebenkosten leerer Wohnungen trage, aber nur eine der drei leeren Wohnungen mit Namen und Datum (P-1). Die anderen fand ich erst über die Gebäude.

## Aufwand

Etwa 15 Minuten, rund 25 Schritte (Seiten öffnen, Klicks, Dialoge).

## Ablauf

1. **Übersicht.** Erwartet: eine Liste, welche Wohnung vermietet, leer (seit wann) oder künftig vermietet ist. Gesehen: Kacheln «9 Vermietet», «1 Vermietet ab …», «3 Leer», «0 Gesperrt» und pro Gebäude: «Musterhaus Zentrum 4/6 vermietet, 1 vermietet ab 01.01.2027», «Seepark Residenz 3/4 vermietet, Wohnung B1 leer seit 01.04.2022», «Alpenblick 2/3 vermietet». Darunter: «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» Die Frage nach den Nebenkosten ist damit beantwortet; welche Wohnungen sonst leer sind und seit wann, nicht.
2. **Gebäude > Musterhaus Zentrum > Wohnung 1.01.** Erwartet: sehen, welcher Vertrag gilt. Gesehen: «Aktueller Mieter Hans Müller, Mietvertrag seit 01.03.2021»; rechts Hans Müller «Laufend», darunter «Frühere Mietverträge» Kevin Fischer «01.06.2018 – 28.02.2021, gekündigt, Beendet» mit Historie-Hinweis. Klar.
3. **Mietvertrag Kevin Fischer > Löschen.** Erwartet: Warnung. Gesehen: Dialog wie unter «Beobachtungen»; er sagt, es gibt keine Abrechnung zu diesem Vertrag, es fehlen aber welche, und nach dem Löschen erinnert Dwello nicht mehr daran. Mit Abbrechen geschlossen.
4. **Seepark Residenz > Wohnung A2 > Mietvertrag von Sarah Meier > Löschen.** Erwartet: dieselbe Warnung. Gesehen: «Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in:» mit zwei Links (2025 Entwurf, 2024 bezahlt) und «Klären Sie eine Korrektur direkt mit dem Mieter.» Der Link zu 2024 öffnet die Abrechnung «Sarah Meier, Seepark Residenz, Wohnung A2 · Abrechnungsperiode 01.01.2024 – 31.12.2024, Bezahlt». Ich komme also hin (P-6 zu Details).
5. **Gebäudeliste, Seepark Residenz, Wohnung B1.** Erwartet: gleiche Wörter wie auf der Übersicht. Gesehen: Liste «1 leer» ohne Datum; Gebäudeseite Zeile B1 «Leer seit 01.04.2022», Zusammenfassung ohne Datum (P-2). B1 selbst: «Leer seit 01.04.2022 – Es läuft kein Mietvertrag … Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» Musterhaus: 3.02 «Vermietet ab 01.01.2027» wie auf der Übersicht, 2.02 nur «Leer» (P-3). Weitgehend gleich, aber nicht überall.
6. **Mieter.** Erwartet: wer jetzt wohnt, wer später kommt. Gesehen: «Aktiv» bei neun Mietern mit Wohnung, Lea Frei «Mietvertrag ab 01.01.2027 · Künftig» ohne Wohnung, Sarah Meier «Keine laufende Miete». Der Filter «Künftige Mieter» zeigt nur Lea Frei. Geschafft.

## Verwirrung

- «Vermietet ab …» als Kachelname (P-4).
- «Mietstage».
- «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung» gegenüber «Leer seit 01.04.2022» nach Vertragsende (P-7).
- «Aktiv» in der Mieterliste und «Vermietet» bei den Wohnungen: zwei Wörter für fast dasselbe.
- Abrechnungsnummer «NK-22222222-2024-0002» als einziger Name im Dialog.

## Fehlerrisiken

- Ich könnte meinen, Musterhaus Zentrum habe keine leere Wohnung, weil die Zeile nur Vermietetes nennt (P-1), und die Nebenkosten für 2.02 vergessen.
- Bei 3.02 könnte ich annehmen, Lea Frei zahle schon die Nebenkosten (P-3).
- Wegen P-7 könnte ich eine Wohnung von Hand auf «Leer» stellen, obwohl das gar nicht nötig ist.

## Vorschläge

- **P-1:** Übersicht öffnen, «Vermietete Wohnungen pro Gebäude» lesen. Hilfreich: in jeder Zeile auch die leeren Wohnungen nennen, z. B. «4/6 vermietet, 1 vermietet ab 01.01.2027, Wohnung 2.02 leer» und bei Alpenblick «Wohnung … leer seit …» (ohne Datum, wenn sie nie vermietet war).
- **P-2:** Gebäude öffnen, Seepark Residenz in der Liste und «Angaben zum Gebäude» lesen. Hilfreich: «1 leer seit 01.04.2022» wie auf der Übersicht.
- **P-3:** Musterhaus Zentrum > Wohnung 2.02 bzw. 3.02 öffnen. Hilfreich: der Nebenkosten-Hinweis bei jeder leeren Wohnung, bei 3.02 als «Bis 31.12.2026 tragen Sie die Nebenkosten.»
- **P-4:** Übersicht, Kachel «Gebäude und Wohnungen». Hilfreich: «Künftig vermietet» oder «Vermietet ab später» ohne Auslassungspunkte.
- **P-5:** Mieter öffnen. Hilfreich: bei Lea Frei «Wohnung 3.02 - Musterhaus Zentrum, ab 01.01.2027»; bei Sarah Meier ein Abzeichen «Ehemalig».
- **P-6:** Seepark Residenz > A2 > Mietvertrag von Sarah Meier > Löschen. Hilfreich: Links mit Jahr und Status in Worten («Abrechnung 2024, bezahlt»), ein Satz zum Entwurf (bleibt er auch ein Hindernis?), und nur «Schliessen» statt eines deaktivierten Löschknopfs.
- **P-7:** Gebäudeseite, «Was bedeutet der Mietstatus?». Hilfreich: «Leer ergibt sich, wenn kein Mietvertrag läuft; Gesperrt setzen Sie beim Bearbeiten der Wohnung.»

## Nicht geprüft

- Löschen bestätigen, einen Mietvertrag erfassen oder eine Wohnung bearbeiten: Ich sollte nur anschauen.
- Alpenblick im Detail (welche Wohnung leer ist), weil die Aufgabe Seepark und Musterhaus nannte.
- Andere Sprachen und Dark Mode.

## Nachprüfung

Kurzer zweiter Durchgang, Desktop 1440 × 900, Maus, nur angeschaut. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/anna-w4b-mietstatus/nach/`

### Was ich gefunden habe

1. **Übersicht, «Vermietete Wohnungen pro Gebäude».** Erwartet: jede leere Wohnung mit Namen. Gesehen (Screenshot `01-uebersicht.png`):
   - «Musterhaus Zentrum 4/6 vermietet, 1 vermietet ab 01.01.2027, Wohnung 2.02 leer»
   - «Seepark Residenz 3/4 vermietet, Wohnung B1 leer seit 01.04.2022»
   - «Alpenblick 2/3 vermietet, Wohnung OG2 leer»
   - darunter «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.»

   Die Kachel sagt «3 Leer», und genau drei leere Wohnungen stehen da: 2.02, B1, OG2. Bei B1 steht seit wann, bei 2.02 und OG2 kein Datum. Das passt, weil beide nie vermietet waren (siehe Punkt 2). **Alle leeren Wohnungen finde ich jetzt allein auf der Übersicht. P-1 ist erledigt.**
2. **Wohnung OG2 (Alpenblick), leer und nie vermietet.** Erwartet: wer die Nebenkosten zahlt. Gesehen (`og2.png`): «Mietstatus Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden. Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.»; «Diese Wohnung ist derzeit nicht vermietet.»; «Mietverträge der Wohnung: Noch keine Mietverträge.» **Ja, es steht da.** Bei 2.02 ist es gleich (`w202.png`). Damit ist P-3 für 2.02 erledigt.
3. **Wohnung 3.02 (künftig vermietet), zum Vergleich.** Gesehen (`w302.png`): «Vermietet ab 01.01.2027 – … auch wenn sie bis dahin leer ist.», «Ab 01.01.2027 vermietet an Lea Frei. Bis dahin läuft kein Mietvertrag.» Ein Satz zu den Nebenkosten bis Ende 2026 fehlt weiterhin. Damit ist P-3 für 3.02 noch offen.

### Befunde der Nachprüfung

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | erledigt | Übersicht | Alle drei leeren Wohnungen stehen mit Namen da, B1 mit «leer seit». |
| P-3 | Minor (teilweise offen) | Wohnung 3.02 | Bei 2.02 und OG2 steht jetzt, dass ich die Nebenkosten trage. Bei 3.02 steht nicht, wer sie bis 31.12.2026 zahlt, obwohl die Seite selbst sagt, dass die Wohnung bis dahin leer ist. |
| P-8 | Minor | Übersicht, Musterhaus Zentrum | «1 vermietet ab 01.01.2027» nennt die Wohnung nicht. Die leeren Wohnungen tragen jetzt ihren Namen, die künftig vermietete nicht. Dass 3.02 bis Ende 2026 auch leer steht, sehe ich auf der Übersicht nicht. |

Keine Blocker, kein Major.

### Weiterhin offen (aus dem ersten Durchgang)

- P-7: Die Gebäudeseite sagt immer noch «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.» Dabei steht direkt darüber «Leer: Es läuft kein Mietvertrag». OG2 war nie vermietet, und ich habe sie nie von Hand auf «Leer» gestellt.
- P-4: Die Kachel heisst weiterhin «Vermietet ab …».
- Die Nachprüfung galt nur der Übersicht und den leeren Wohnungen. P-2, P-5 und P-6 habe ich nicht erneut geprüft.

### Aufgabe geschafft: ja

Aufwand: etwa 3 Minuten, 4 Seiten (Übersicht, Alpenblick, OG2, 2.02, dazu 3.02 zum Vergleich).

### Vorschläge

- **P-3:** Musterhaus Zentrum > Wohnung 3.02 öffnen. Hilfreich wäre: «Bis 31.12.2026 tragen Sie die Nebenkosten.»
- **P-8:** Übersicht, Zeile Musterhaus Zentrum. Hilfreich wäre: «Wohnung 3.02 vermietet ab 01.01.2027».
