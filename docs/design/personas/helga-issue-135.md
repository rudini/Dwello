# Persona-Lauf: Helga, Issue #135 (Hinweis auf vorhandene Abrechnungen in Schritt 2 «Gebäude»)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. Nur angesehen, nichts gespeichert (Schritt 5 «Erstellen» nicht ausgelöst).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-135/`.

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | «Für dieses Gebäude entsteht keine neue.» sagt nicht, was ich jetzt tun soll. Das Gebäude lässt sich trotzdem ankreuzen, und mit «Weiter» komme ich bis zur Vorschau mit «Anzahl Abrechnungen 0». Erst dort steht, dass ich einen Entwurf löschen muss, wenn ich neu rechnen will. |
| P-2 | Minor | Schritt 2 «Gebäude» | «die in diese Abrechnungsperiode fällt» passt nicht zu dem, was gezählt wird. Bei der Periode 01.10.2024–30.09.2025 heisst es bei Alpenblick «Alle 2 Mietverträge haben schon eine Abrechnung …», obwohl Alpenblick für 2025 keine hat (das Dashboard sagt «Noch nicht abgerechnet: Alpenblick»). Gezählt wird also offenbar schon eine Abrechnung 2024, die nur teilweise hineinreicht. Ich lese «fällt in» als «liegt ganz darin». |
| P-3 | Nit | Schritt 2 «Gebäude» | «keine neue» ohne Hauptwort: Ich musste zurücklesen, um zu merken, dass «keine neue Abrechnung» gemeint ist. |
| P-4 | Nit | Schritt 2 «Gebäude» | Der Hinweis ist in derselben grauen Schrift wie die Zeile «… Rechnungen in der Abrechnungsperiode» darüber, ohne Symbol und ohne Hervorhebung. Er wirkt wie eine weitere Zahlenzeile. Dass dieses Gebäude bei diesem Lauf «nichts bringt», sticht nicht heraus. |
| P-5 | Nit | Schritt 2 «Gebäude» | «Alle 2 Mietverträge» klingt holprig («Beide Mietverträge …»). Daneben steht «3 Wohnungen»: Zuerst dachte ich, eine Wohnung sei vergessen gegangen. Erst später kam mir in den Sinn, dass eine Wohnung leer stehen kann. |

## Beobachtungen

- Ganzseiten-Screenshots (Schritt 2) zeigen den Seitenkopf mit «Dwello» mitten in der Seite, über der Gebäudekarte. Das sieht nach einer Eigenheit des Screenshots mit fixiertem Kopf aus; beim normalen Scrollen habe ich keine Überlappung gesehen.
- In Schritt 2 erschien zeitweise ein Gebäude «Anna Testhaus» (0 Wohnungen), das eine andere Persona angelegt hat. Es zählt hier nicht.
- Der Assistent merkt sich die Eingaben («Entwurf gespeichert, 14:19», nach dem Neuladen «Entwurf wiederhergestellt»). Das ist beruhigend, aber «Entwurf» bedeutet hier etwas anderes als die Abrechnungs-Entwürfe, die der Lauf erstellt. Das hat mich kurz verwirrt.
- Der Hilfetext in Schritt 3 «Heizprofil» ist sehr lang (ein Absatz mit drei Fällen). Das gehört nicht zu dieser Änderung.
- Bei 200 % Zoom bricht der Hinweis sauber um, ohne seitliches Scrollen (Seitenbreite 720 = Fensterbreite).

## Aufgabe geschafft: teilweise

2025 und 2024 habe ich geprüft. Eine Periode, in der nur ein Teil der Mietverträge eine Abrechnung hat (Text «… von … Mietverträgen hat/haben …»), habe ich trotz zehn verschiedener Perioden nicht gefunden.

## Aufwand

Etwa 20 Minuten, 5 Durchgänge. Ich habe 12 verschiedene Abrechnungsperioden eingegeben und einmal ein Gebäude gewählt, um bis zur Vorschau (Schritt 4) zu gehen.

## Ablauf

1. **Dashboard → «Abrechnungen erstellen».** Erwartet: Ich finde den Weg. Gesehen: Der Kasten «Nächster Schritt» nennt die Periode 01.01.2025–31.12.2025 und «Noch nicht abgerechnet: Alpenblick». Der Knopf führt direkt zu Schritt 1 mit 01.01.2025 / 31.12.2025 vorausgefüllt. Gut.
2. **Schritt 2 mit 2025.** Erwartet: Alpenblick ist offen, die anderen beiden sind schon erledigt. Gesehen (Screenshot 03): Alpenblick zeigt nur «6 Rechnungen in der Abrechnungsperiode». Bei Seepark Residenz und Musterhaus Zentrum steht unter der Rechnungszeile «Alle 4 Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt. Für dieses Gebäude entsteht keine neue.» Das passt zum Dashboard. Ich verstehe: Nur Alpenblick ankreuzen. Die Schrift ist aber gleich grau wie die Rechnungszeile, und ich musste genau lesen (P-4).
3. **Zurück, Periode 2024.** Erwartet: Alles ist abgerechnet. Gesehen (Screenshot 04): Alle drei Gebäude sagen «Alle … Mietverträge haben schon eine Abrechnung …» (Alpenblick 2, Seepark 3, Musterhaus 4). Klar: Für 2024 muss ich nichts tun. «Alle 2» stolpert (P-5).
4. **Gebäude mit Hinweis trotzdem gewählt (2025, nur Musterhaus Zentrum).** Erwartet: Dwello hält mich auf oder sagt, dass das nichts bringt. Gesehen: Ankreuzen geht. «Weiter» führt zu Schritt 3, nochmals «Weiter» zur Vorschau mit «Anzahl Abrechnungen 0», «Kosten aller Abrechnungen CHF 0.00» und dem Satz «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …». Diese Erklärung hätte ich schon in Schritt 2 gebraucht (P-1).
5. **Suche nach einer Periode mit «teilweise».** Ich habe 01.07.2024–30.06.2025, 2023, erstes und zweites Halbjahr 2025, erstes Halbjahr 2026, 01.10.2024–30.09.2025, 01.07.2025–30.06.2026, 01.12.2025–30.11.2026, 2022–2024 und 2024–2025 eingegeben. Gesehen: Es heisst immer entweder «Alle …» oder gar nichts. Bei 2023 und dem ersten Halbjahr 2026 steht «Keine Rechnungen in der Abrechnungsperiode erfasst» und kein Hinweis zu Mietverträgen, was stimmig ist. Bei 01.10.2024–30.09.2025 heisst es auch bei Alpenblick «Alle 2 …», obwohl Alpenblick für 2025 noch offen ist (P-2).
6. **200 % Zoom, Schritt 2 mit 2025** (Screenshot 09). Der Hinweis ist gut lesbar und bricht in drei Zeilen um. Die Wohnungszahl rechts bleibt daneben.

## Verwirrung

- «keine neue»: neue was? Ich musste das Wort «Abrechnung» aus dem Satz davor ergänzen.
- «fällt in diese Abrechnungsperiode»: Ich verstehe das als «liegt in diesem Zeitraum». Dass auch eine Abrechnung vom Vorjahr zählt, die nur ein Stück hineinreicht, habe ich erst gemerkt, als Alpenblick plötzlich als «Alle 2 …» erschien.
- Mietverträge und Wohnungen auf derselben Karte («Alle 2 Mietverträge» und «3 Wohnungen»): Ich musste überlegen, wieso die Zahlen verschieden sind.
- «Entwurf gespeichert» (meine Eingaben im Assistenten) gegenüber «Es entstehen Entwürfe» (die Abrechnungen).

## Fehlerrisiken

- Ich kreuze «Alle Gebäude» an, ohne die grauen Zeilen zu lesen, und wundere mich in der Vorschau über 0 Abrechnungen oder über weniger, als ich erwartet habe.
- Ich verschiebe die Periode (z. B. Oktober bis September) und glaube wegen «Alle … haben schon eine Abrechnung», dass alles erledigt ist, obwohl für 2025 noch nichts abgerechnet ist.
- Ich will eine falsche Abrechnung neu berechnen, kreuze das Gebäude an und verstehe erst in Schritt 4, dass ich zuerst den Entwurf löschen muss.

## Vorschläge

- **P-1:** Assistent öffnen, Periode 2025, Schritt 2, «Musterhaus Zentrum» ankreuzen und zweimal «Weiter»: Die Vorschau zeigt «Anzahl Abrechnungen 0». Hilfreich wäre, wenn der Hinweis in Schritt 2 gleich sagt, was zu tun ist, etwa: «Sie müssen dieses Gebäude nicht wählen. Um eine Abrechnung neu zu berechnen, löschen Sie zuerst ihren Entwurf.» Alternativ könnte ein Hinweis erscheinen, sobald ich so ein Gebäude ankreuze.
- **P-2:** Periode 01.10.2024–30.09.2025 eingeben, Schritt 2: Alpenblick zeigt «Alle 2 Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt.» Hilfreich: eine Formulierung, die zur Zählung passt, z. B. «… eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt». Noch besser wäre es, den Zeitraum der vorhandenen Abrechnung zu nennen.
- **P-3:** Periode 2025, Schritt 2, Seepark Residenz. Hilfreich: «Für dieses Gebäude entsteht keine neue Abrechnung.»
- **P-4:** Periode 2025, Schritt 2: Der Hinweis sieht aus wie die Rechnungszeile. Hilfreich: ein Info-Symbol mit Text oder eine eigene, deutlich abgesetzte Zeile (nicht nur über die Farbe), damit man den Hinweis beim Überfliegen bemerkt.
- **P-5:** Periode 2024, Schritt 2, Alpenblick. Hilfreich: «Beide Mietverträge …» bei zwei. Ein kurzer Zusatz, warum es weniger Mietverträge als Wohnungen sein können, wäre schön, ist aber nicht nötig.

## Nicht geprüft

- Den Text für «teilweise» («… von … Mietverträgen hat/haben schon eine Abrechnung …»): In keiner der zwölf ausprobierten Perioden kam er vor. In den Demodaten haben offenbar alle Mietverträge eines Gebäudes entweder eine Abrechnung oder keine. Einzahl und Mehrzahl («hat/haben») konnte ich deshalb nicht sehen.
- Schritt 5 «Erstellen»: Laut Auftrag nichts speichern.
- Andere Sprachen und dunkle Darstellung: nicht Teil von Helgas Aufgabe.
