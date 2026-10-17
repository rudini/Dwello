# Persona-Review: Anna, fehlende Nebenkostenabrechnungen (Runde 211)

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück. Desktop 1440 × 900, Mietvertragsliste und Mietvertrag zusätzlich auf Mobile 390 × 844. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/anna-211/`

Aufgabe: herausfinden, für welche Gebäude und Jahre Nebenkostenabrechnungen fehlen (Übersicht), welche Mieter betroffen sind (Mietvertragsliste) und welche Rechnungen ich bei einem Mietvertrag zuerst ansehen muss (Mietvertragsseite).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Thomas Weber | Die Seite sagt «für 01.10.2025 – 31.12.2025 gibt es noch keine Abrechnung», obwohl Thomas Webers eigene Abrechnung 01.01.2025 – 31.12.2025 (365 Mietstage, Entwurf) schon besteht. Bei Marco Bernasconi im gleichen Gebäude, ebenfalls mit Abrechnung für ganz 2025, steht dieser Hinweis nicht. Für mich widersprechen sich die beiden Seiten, und ich weiss nicht, wen die Lücke betrifft. |
| P-2 | Major | Mietvertrag Thomas Weber | Für die Lücke 01.10.2025 – 31.12.2025 gibt es nur «Rechnungen 2025 ansehen», keinen Knopf zum Abrechnen. Die Überschrift zählt sie aber als eine von «3 Abrechnungen fehlen». Ich weiss nicht, wie ich diese Lücke schliessen soll. |
| P-3 | Minor | Mietvertragsliste | Das Etikett «Abrechnung fehlt» sagt nicht, welche Jahre oder wie viele. 10 von 11 Mietverträgen haben es. Es gibt keinen Filter «Abrechnung fehlt». Ich muss jeden Vertrag einzeln öffnen, um die Jahre aus der Übersicht wiederzufinden. |
| P-4 | Minor | Übersicht | In der Karte «Nebenkostenabrechnungen erstellen» fehlen Jahre aus sechs Jahrgängen und drei Gebäuden. Der einzige Rechnungs-Link heisst aber «Rechnungen 2025 ansehen» und zeigt alle Gebäude, obwohl Musterhaus Zentrum 2025 gar nicht fehlt. Ich weiss nicht, warum ausgerechnet 2025 und wo ich mit den anderen Jahren anfange. |
| P-5 | Minor | Mietvertrag (Kasten «… fehlen») | Die Knöpfe stehen bunt gemischt im Fluss: «Rechnungen 2025 ansehen» allein, dann «2023 abrechnen», «Rechnungen 2023 ansehen», in der nächsten Zeile «2022 abrechnen» … Welcher Link zu welchem Jahr gehört, erkenne ich nur durch genaues Lesen. |

## Beobachtungen

- Die Übersicht kommt sofort zur Sache: «Als Nächstes zu tun», «Nächster Schritt – Nebenkostenabrechnungen erstellen», und eine Liste nach Gebäude und Jahr. Das hat mir gefallen.
- Die Übersicht zählt Entwürfe offenbar als «abgerechnet» (Musterhaus Zentrum 2025 fehlt in der Liste, dort gibt es 2025 nur Entwürfe). Gleich darunter steht aber «7 Nebenkostenabrechnungen sind noch im Entwurf». Das passt zusammen, aber erst, wenn man beide Karten liest.
- Seepark Residenz steht in der Übersicht mit «01.10.2025 – 31.12.2025». Alle vier Seepark-Mietverträge, die ich geöffnet habe (Weber, Brunner, Meier, Bernasconi), haben ihre Abrechnung für 2025 vollständig (Meier bis 30.06., Brunner ab 01.07.). Vielleicht geht es um die leere Wohnung B1, aber die App sagt das nirgends.
- Nina Brunner hat in der Liste kein Etikett und auf ihrer Seite keinen Kasten. Das passt zu ihrer Abrechnung 01.07. – 31.12.2025, steht aber im Widerspruch zum Seepark-Hinweis bei Thomas Weber.
- Der Kasten auf dem Mietvertrag erklärt gut: Der Assistent rechnet für alle Mietverträge des Gebäudes ab, zuerst Rechnungen erfassen, die Reihenfolge der Perioden spielt keine Rolle. Ausserdem: «Abgerechnet bis» beim Bearbeiten, falls ausserhalb von Dwello abgerechnet. Das hilft. Bei Thomas Weber fehlt der Satz zu «Abgerechnet bis»; dort steht stattdessen der Satz zur Teil-Lücke.
- Bei Marco Bernasconi (nur 2023 fehlt) heisst der Knopf «Abrechnungen erstellen», bei mehreren Jahren «2023 abrechnen». Das verstehe ich beides.
- Die Rechnungsliste «Rechnungen 2025 ansehen» (Seepark) filtert nach «Jahr des Rechnungsdatums». Darin steht auch «Fernwärme Q4 2024» mit Datum 20.01.2025. Für Seepark 2025 gibt es Fernwärme Q1–Q3, aber keine Fernwärme Q4 2025. Die App weist nicht darauf hin; ich hätte es nur durch Zählen gemerkt.
- Mobile 390 px: Die Mietvertragsliste und der Mietvertrag lassen sich nicht seitlich scrollen (scrollWidth 390). Die Etiketten «Laufend» und «Abrechnung fehlt» stehen gut lesbar untereinander.

## Aufgabe geschafft: teilweise

Gebäude und Jahre (Schritt 1) und die betroffenen Mieter (Schritt 2) habe ich gefunden. Bei Schritt 3 weiss ich bei Laura Keller, was zu tun ist. Bei Thomas Weber widerspricht die Seite seiner eigenen Abrechnung, und für die Lücke 2025 gibt es keinen Weg zum Abrechnen.

## Aufwand

Etwa 10 Minuten, rund 14 Seitenaufrufe: Übersicht, Mietvertragsliste, Mietverträge Weber, Brunner, Keller, Bernasconi, Meier und Fischer (Musterhaus), deren Abrechnungslisten, die Entwurfsliste, die Rechnungen Seepark 2025 und die Mobile-Ansichten.

## Ablauf

1. **Übersicht öffnen** (`/` → `/dashboard`). Erwartet: ein Hinweis, was offen ist. Gesehen: Karte «Nächster Schritt – Nebenkostenabrechnungen erstellen» mit «Noch nicht abgerechnet: Alpenblick (2025, 2023, 2022, 2021), Musterhaus Zentrum (2023, 2022, 2021, 2020, 2019, 2018), Seepark Residenz (01.10.2025 – 31.12.2025, 2023, 2022, 2021)». Dazu der Hauptknopf «Abrechnungen erstellen» und der Link «Rechnungen 2025 ansehen». Gut lesbar. Unklar war mir, warum Seepark ein Teilzeitraum ist und warum der Link nur 2025 nennt.
2. **Mietverträge** (Navigation). Erwartet: die betroffenen Mieter markiert, am liebsten mit Jahr. Gesehen: 11 Mietverträge, 10 davon mit dem Etikett «Abrechnung fehlt» (alle ausser Nina Brunner), aber ohne Jahre. Kein Filter dafür. Mit «Vertragsbeginn» hätte ich mir die Jahre selbst zusammenreimen müssen.
3. **Mietvertrag Thomas Weber** (Seepark). Erwartet: dieselben Seepark-Lücken wie in der Übersicht. Gesehen: Kasten «3 Abrechnungen fehlen» mit Lücke 01.10.2025 – 31.12.2025, 2023 und 2022. Für 2025 nur «Rechnungen 2025 ansehen», für 2023 und 2022 je «… abrechnen» und «Rechnungen … ansehen». Das passt zur Übersicht (Seepark 2021 fehlt bei ihm, weil er erst 2022 eingezogen ist).
4. **Seine Abrechnungen** («Dazu gehört» → Nebenkostenabrechnungen). Erwartet: 2025 fehlt teilweise. Gesehen: «NK-22222222-2025-0001, 01.01.2025 – 31.12.2025, 365 Mietstage, Entwurf». Das widerspricht dem Kasten (P-1).
5. **Mietvertrag Marco Bernasconi** (gleiches Gebäude). Gesehen: nur «Abrechnung 2023 fehlt», kein Wort zu 01.10. – 31.12.2025, obwohl die Übersicht das für das ganze Gebäude meldet.
6. **Mietvertrag Nina Brunner.** Gesehen: kein Kasten. Ihre Abrechnung läuft 01.07. – 31.12.2025 (Entwurf). Für sie stimmig.
7. **Mietvertrag Laura Keller** (Alpenblick). Gesehen: «3 Abrechnungen fehlen», 2025, 2023, 2022, je mit «abrechnen» und «Rechnungen ansehen». Ihre einzige Abrechnung ist 2024 (bezahlt). Stimmig mit der Übersicht. Hier weiss ich, was zu tun ist: «Rechnungen 2025 ansehen», ergänzen, dann «2025 abrechnen».
8. **«Rechnungen 2025 ansehen» bei Thomas Weber.** Erwartet: die Rechnungen von Seepark 2025, am liebsten die fehlenden. Gesehen: 15 Rechnungen, gefiltert nach Gebäude und Rechnungsjahr, darunter eine Q4-2024-Rechnung. Was fehlt, sagt mir niemand.
9. **Mobile** (Übersicht, Liste, Thomas Weber). Alles untereinander, kein seitliches Scrollen.

**Sagen alle drei dasselbe?** Für Alpenblick und Musterhaus Zentrum ja: Die Jahre der Übersicht finde ich auf den Mietverträgen wieder, und die Liste markiert die richtigen Mieter (nur ohne Jahre). Für Seepark Residenz nein: Die Übersicht und die Seite von Thomas Weber melden eine Lücke 01.10. – 31.12.2025, Marco Bernasconi und Nina Brunner nicht, und Webers eigene Abrechnung deckt das ganze Jahr ab.

**Weiss ich, was als Nächstes zu tun ist?** Bei Alpenblick und Musterhaus ja: Rechnungen des Jahres ansehen und ergänzen, dann «… abrechnen». Bei der Seepark-Lücke 2025 nein.

## Verwirrung

- «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab»: Welche Abrechnung? Die von Thomas Weber deckt das ganze Jahr ab.
- «Abrechnungsperiode» und «Periode»: Ein Jahr ist für mich klar, «01.10.2025 – 31.12.2025» als Periode in einer Jahresliste nicht.
- «Mietstage»: aus dem Zusammenhang verständlich.
- «Abgerechnet bis»: Die Erklärung steht da, gut. Ich hätte es aber nicht gewagt, das Feld ohne genauere Hilfe zu setzen.
- «Noch nicht abgerechnet» in der Übersicht und «Abrechnung fehlt» in der Liste: dasselbe? Ich nehme es an. Dass ein Entwurf als «abgerechnet» zählt, wird nicht gesagt.

## Fehlerrisiken

- Ich könnte bei Thomas Weber den Assistenten für 2025 suchen und dabei eine zweite Abrechnung über eine bestehende erzeugen. Oder ich ignoriere den Hinweis, und die echte Lücke (wahrscheinlich die leere Wohnung B1) bleibt offen.
- Der Rechnungsfilter nach Rechnungsdatum mischt eine Q4-2024-Rechnung in «2025». Eine Anfängerin rechnet sie leicht im falschen Jahr ab oder sucht 2025-Rechnungen, die Anfang 2026 datiert sind, im falschen Jahr.
- Die Lücke «Fernwärme Q4 2025» ist nicht markiert. Ich würde Seepark 2025 womöglich ohne Heizkosten Q4 abrechnen.
- Weil 10 von 11 Verträgen das gleiche Etikett tragen, sehe ich es irgendwann nicht mehr.

## Vorschläge

- **P-1:** Übersicht → Mietverträge → «Thomas Weber» → Kasten lesen → «Dazu gehört» → «Nebenkostenabrechnungen»: Dort ist 01.01. – 31.12.2025 vorhanden. Hilfreich: Den Teil-Hinweis nur auf den Mietverträgen zeigen, deren Mietstage wirklich nicht abgerechnet sind. Oder sagen, wen er betrifft (z. B. «die leere Wohnung B1» oder «Wohnung …»). Übersicht und Mietvertrag sollten dieselbe Aussage machen.
- **P-2:** Gleicher Weg. Hilfreich: auch für die Teil-Lücke einen Knopf «01.10.2025 – 31.12.2025 abrechnen» (oder eine Erklärung, wie man sie schliesst), sonst die Lücke nicht als «fehlende Abrechnung» mitzählen.
- **P-3:** Mietverträge öffnen. Hilfreich: im Etikett die Jahre oder die Anzahl («Abrechnung 2022, 2023 fehlt» bzw. «3 Abrechnungen fehlen»), dazu ein Filter «Abrechnung fehlt» bei «Vertragsstatus».
- **P-4:** Übersicht, Karte «Nächster Schritt». Hilfreich: pro Gebäude und Jahr ein eigener Link zu den Rechnungen (wie auf dem Mietvertrag) oder ein Satz, mit welchem Jahr man beginnt. «Rechnungen 2025 ansehen» sollte mindestens auf die Gebäude gefiltert sein, bei denen 2025 fehlt.
- **P-5:** Mietvertrag Thomas Weber oder Laura Keller, Kasten. Hilfreich: eine Zeile pro Jahr («2023: abrechnen · Rechnungen ansehen»), sodass Jahr und Knöpfe zusammenstehen.

## Nicht geprüft

- Den Assistenten «Abrechnungen erstellen» habe ich nur als Link gesehen, nicht geöffnet. Ich sollte nichts speichern, und der Auftrag endet beim Erkennen der Rechnungen.
- «Abgerechnet bis» im Bearbeiten-Formular nicht ausprobiert (speichern nicht erlaubt).
- Die Mietverträge von Kevin Fischer (Alpenblick), Pierre Dubois, Anna Schmidt, Hans Müller und Maria Rossi nicht einzeln geöffnet; nur das Etikett in der Liste gesehen.
- Wohnung B1 (Seepark, leer) nicht geprüft. Ob die Lücke 01.10. – 31.12.2025 von dort kommt, ist nur meine Vermutung.
- Andere Sprachen und Zoomstufen nicht geprüft.
