# Persona-Lauf: Helga, Issue #135, Runde 2 (neue Hinweistexte in Schritt 2 «Gebäude»)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. Nur angesehen, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-135-2/` (`r1.mjs`; Screenshots `z150-*` und `z200-*`).

## Stand der Befunde aus Runde 1

| Runde-1-ID | Stand | Beleg |
|---|---|---|
| P-1 (was soll ich tun?) | behoben | Der Hinweis endet jetzt mit «Sie müssen es nicht wählen.» Damit weiss ich in Schritt 2, dass ich das Gebäude weglassen kann. Rest siehe P-7. |
| P-2 («fällt in» passt nicht zur Zählung) | behoben | Bei 01.10.2024–30.09.2025 steht bei Alpenblick «… eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt.» Das passt jetzt: Die Abrechnung 2024 deckt Oktober bis Dezember 2024 ab. Neue Unklarheit siehe P-6. |
| P-3 («keine neue» ohne Hauptwort) | behoben | «Für dieses Gebäude entsteht keine neue Abrechnung.» |
| P-4 (Hinweis sieht aus wie Rechnungszeile) | behoben | Der Hinweis ist jetzt fett und schwarz statt grau und steht als eigener Absatz unter der Zeile «… Rechnungen in der Abrechnungsperiode». Beim Überfliegen sehe ich ihn sofort (Screenshot `z150-03`). Die Hervorhebung kommt über die fette Schrift, nicht nur über die Farbe. |
| P-5 («Alle 2 Mietverträge», Wohnungen gegenüber Mietverträgen) | behoben | Statt einer Zahl heisst es «Alle Mietverträge dieses Gebäudes». Neben «3 Wohnungen» stolpere ich nicht mehr über verschiedene Zahlen. |

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-6 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Bei einer verschobenen Periode (01.10.2024–30.09.2025) sagt der Hinweis bei Alpenblick «ganz oder teilweise abdeckt … Sie müssen es nicht wählen.» Welcher Teil schon abgedeckt ist, steht nicht da. Ich lese daraus: Alpenblick ist erledigt. Tatsächlich ist für Alpenblick Januar bis September 2025 noch nicht abgerechnet (die Liste zeigt für Alpenblick nur Abrechnungen 01.01.2024–31.12.2024). Der Satz «Sie müssen es nicht wählen» beruhigt mich hier zu sehr. |
| P-7 | Nit | Schritt 2 «Gebäude» | Was ich tun muss, wenn ich eine bestehende Abrechnung neu berechnen will (Entwurf zuerst löschen), steht weiterhin erst in Schritt 4 «Vorschau». Das war der zweite Teil meines Vorschlags zu P-1. |

## Beobachtungen

- Die Hinweise stehen jetzt in drei Zeilen fett untereinander, bei drei Gebäuden mit Hinweis (Periode Oktober–September) ergibt das viel fetten Text (Screenshot `z150-04`). Mich stört es nicht, weil es wichtig ist, aber die Seite wirkt dadurch schwerer.
- Im Zugänglichkeitsbaum gehört der Hinweis nicht zum Namen der Checkbox, sondern steht als eigener Absatz danach. Für mich mit der Maus egal; ob ein Bildschirmleser ihn zum Gebäude ansagt, kann ich nicht beurteilen.
- Bei 200 % Zoom erschien ein Gebäude «Anna Testhaus 2» (0 Wohnungen, «Keine Rechnungen in der Abrechnungsperiode erfasst»), das eine andere Persona angelegt hat. Es zählt hier nicht.
- Ganzseiten-Screenshots zeigen den fixierten Seitenkopf «Dwello» mitten in der Seite. Wie in Runde 1 eine Eigenheit des Screenshots; beim Scrollen keine Überlappung.
- «Entwurf gespeichert, 14:34» (meine Eingaben im Assistenten) neben «Es entstehen Entwürfe» (die Abrechnungen): wie in Runde 1, nicht Teil dieser Änderung.

## Aufgabe geschafft: ja

Beide Perioden in Schritt 2 angesehen, bei 150 % und 200 %.

## Aufwand

Etwa 5 Minuten, 2 Durchgänge (150 % und 200 %), je 6 Schritte: Nebenkostenabrechnungen, «Abrechnungen erstellen», Weiter, Zurück, Periode ändern, Weiter.

## Ablauf

1. **Nebenkostenabrechnungen → «Abrechnungen erstellen».** Erwartet: Der Knopf führt in den Assistenten. Gesehen: Der Knopf oben rechts öffnet Schritt 1 mit 01.01.2025 / 31.12.2025 vorausgefüllt.
2. **Weiter zu Schritt 2 mit 2025.** Erwartet: Alpenblick ist offen, Seepark Residenz und Musterhaus Zentrum haben einen Hinweis. Gesehen (Screenshot `z150-03`): Alpenblick ohne Hinweis. Bei den beiden anderen steht fett: «Alle Mietverträge dieses Gebäudes haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.» Ich verstehe sofort: nur Alpenblick ankreuzen. Gut.
3. **Zurück, Periode 01.10.2024–30.09.2025, Weiter.** Erwartet: Wie in Runde 1 bekommt auch Alpenblick den Hinweis, aber jetzt mit einem Text, der stimmt. Gesehen (Screenshot `z150-04`): Alle drei Gebäude haben den Hinweis. «ganz oder teilweise» erklärt, warum Alpenblick dabei ist. Ich weiss aber nicht, welcher Teil abgedeckt ist und ob noch etwas offen bleibt (P-6).
4. **Dasselbe bei 200 % Zoom** (Screenshots `z200-03`, `z200-04`). Der Hinweis bricht in drei Zeilen um, gut lesbar, kein seitliches Scrollen (Seitenbreite 720 = Fensterbreite).

## Verwirrung

- «ganz oder teilweise abdeckt»: verständlich. Bei «teilweise» frage ich mich aber: Welcher Teil? Ist der Rest dann noch offen?
- «Sie müssen es nicht wählen»: klingt, als wäre Wählen harmlos und Weglassen genüge. Ob ich etwas anderes tun muss (eine andere Periode wählen), sagt der Satz nicht.

## Fehlerrisiken

- Ich verschiebe die Periode (Oktober bis September), sehe bei allen Gebäuden «Sie müssen es nicht wählen» und glaube, alles sei abgerechnet, obwohl für Alpenblick neun Monate fehlen (P-6).
- Ich will eine falsche Abrechnung neu berechnen und erfahre erst in Schritt 4, dass ich den Entwurf zuerst löschen muss (P-7).

## Vorschläge

- **P-6:** Assistent öffnen, Schritt 1 Beginn 01.10.2024, Ende 30.09.2025, Weiter: Alpenblick zeigt «… ganz oder teilweise abdeckt … Sie müssen es nicht wählen.» Hilfreich: den Zeitraum der vorhandenen Abrechnung nennen («… schon eine Abrechnung bis 31.12.2024»), oder bei «teilweise» sagen, dass sich die Perioden überschneiden und eine Periode ohne Überschneidung zu wählen ist.
- **P-7:** Assistent öffnen, Periode 2025, Schritt 2, Musterhaus Zentrum: Der Hinweis sagt nichts zum Neuberechnen. Hilfreich: ein kurzer Zusatz «Um eine Abrechnung neu zu berechnen, löschen Sie zuerst ihren Entwurf.»

## Nicht geprüft

- Die Formen für einen einzelnen Mietvertrag und «X von Y Mietverträgen»: In den Demodaten haben alle Mietverträge eines Gebäudes entweder eine Abrechnung oder keine (in Runde 1 mit zwölf Perioden gesucht, nie gefunden). Ohne zu speichern lässt sich kein solcher Zustand herstellen.
- Schritte 3 bis 5: nicht Teil dieser Runde, nichts gespeichert.
