# Dr. Weber – Abrechnungsliste, Runde 2 (list-2)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus, 100 %.
Aufgabe: In der Abrechnungsliste die Abrechnung 2025 ohne PDF finden, von dort zum Erstellen des PDFs gelangen und es erstellen; beurteilen, ob die Liste das fehlende PDF und den nächsten Schritt klar macht; die Zeitangabe in den Zeilen von Sarah Meier und Nina Brunner (Seepark Residenz) beurteilen.
App: http://localhost:3300, Demodaten. Gespeichert habe ich nur eines: das PDF der Abrechnung NK-11111111-2025-0002 (Anna Schmidt), wie vom Auftrag vorgesehen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/2d6e0557-c7a1-50fc-8e2b-2c19ae995e43/scratchpad/dr-weber-list-2/`

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Nebenkostenabrechnungen (Liste) | Der Zeitraum in der Zeile hat keine Beschriftung. Bei Sarah Meier (01.01.2025 – 30.06.2025) und Nina Brunner (01.07.2025 – 31.12.2025) steht dort, wo bei allen anderen Zeilen die Abrechnungsperiode zu stehen scheint, ein Teilzeitraum. Auf der Detailseite steht an derselben Stelle «Abrechnungsperiode 01.01.2025 – 31.12.2025». Ich habe den Listenwert zuerst für die Abrechnungsperiode gehalten. |
| P-2 | Minor | Nebenkostenabrechnungen (Liste) | «PDF noch nicht erstellt» zeigt klar, was fehlt, aber nicht, was zu tun ist. Der Text ist als Link unterstrichen, hat kein Verb und kein Symbol. Dass er zur Detailseite mit «PDF erstellen» führt, merkt man erst nach dem Klick. |

## Beobachtungen

- In der Hauptnavigation gibt es keinen Eintrag «Abrechnungen», sondern «Nebenkostenabrechnungen» (unter «Nebenkosten»). Auf der Übersicht steht ein Link «Abrechnungen erstellen». Mein erster Versuch, «Abrechnungen» anzuklicken, hat mich deshalb in den Assistenten «Abrechnungen erstellen» geführt statt in die Liste.
- Auf der Detailseite von Anna Schmidt ist «PDF erstellen» nur die zweite Schaltfläche (weiss umrandet). Die Hauptschaltfläche (gefüllt) ist «Als versendet markieren», obwohl es noch kein PDF gibt. Ein Hinweis wie «Für diese Abrechnung gibt es noch kein PDF» fehlt. Der fehlende Eintrag «PDF erstellt» im Verlauf ist der einzige weitere Anhaltspunkt.
- Nach dem Klick auf «PDF erstellen» kam keine Bestätigungsmeldung (die Statuszeile blieb leer). Sichtbar war nur, dass die Schaltfläche nun «PDF herunterladen» hiess und im Verlauf «PDF erstellt 16.10.2026, 21:19» erschien. Für mich reicht das, ein Satz «PDF wurde erstellt» wäre aber eindeutiger.
- Die Liste bietet keinen Filter «ohne PDF» und keine Zahl, wie viele Abrechnungen noch kein PDF haben. Bei 17 Abrechnungen auf zwei Seiten musste ich beide Seiten durchlesen, um sicher zu sein, dass es nur eine ist.
- Auf der Detailseite stehen nur «Mietstage in der Abrechnungsperiode: 181» (Sarah Meier) und «184» (Nina Brunner), aber keine Daten für die Mietzeit. Die Zahlen habe ich nachgerechnet: 1.1. bis 30.6.2025 sind 181 Tage, 1.7. bis 31.12.2025 sind 184 Tage. Sie passen also zu den Daten in der Liste. Die Daten der Liste findet man auf der Detailseite aber nirgends wieder.
- Der Zeitraum in der Liste lässt sich nicht genauer erklären: Es gibt keine Hilfe, und beim Überfahren mit der Maus erscheint kein Hinweis, weil der ganze Zeilen-Link darüber liegt. Das ist in Ordnung, die Erklärung gehört als sichtbarer Text in die Zeile (siehe P-1).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 7 Schritte: Übersicht, Fehlgriff in den Assistenten, Liste über die Navigation, Liste lesen, Seite 2 prüfen, Klick auf «PDF noch nicht erstellt», «PDF erstellen». Dazu kamen zwei Detailseiten (Sarah Meier, Nina Brunner), um die Zeitangabe zu prüfen. Das Erstellen des PDFs dauerte rund 3 Sekunden.

## Ablauf

1. **Liste öffnen.** Erwartet: einen Menüpunkt «Abrechnungen». Gesehen: auf der Übersicht ein Link «Abrechnungen erstellen», den ich zuerst erwischt habe; er öffnete den Assistenten «Schritt 1 von 5: Abrechnungsperiode». Mit «Abbrechen» bzw. über «Nebenkostenabrechnungen» in der linken Navigation kam ich dann zur Liste. Screenshot `02-liste.png`: Titel «Nebenkostenabrechnungen», vier Kacheln (7 Entwurf, 1 Versendet, 9 Bezahlt, 0 Überfällig), Suche, Gebäudefilter, «17 Abrechnungen», Seite 1 von 2.
2. **Abrechnung ohne PDF finden.** Erwartet: ein deutlich anderes Element in der PDF-Spalte. Gesehen: In allen Zeilen steht rechts «PDF» mit Download-Symbol, nur bei Anna Schmidt (NK-11111111-2025-0002, Musterhaus Zentrum, Wohnung 1.02, Entwurf, Rückerstattung CHF 6.50) steht «PDF noch nicht erstellt» als unterstrichener Text ohne Symbol. Beim Überfliegen fällt das auf, weil der Text länger ist und das Symbol fehlt. Auf Seite 2 (`10-seite-2.png`, nur Abrechnungen 2024) haben alle ein PDF. Auch mit dem Filter «7 Entwurf» (`06-filter-entwurf.png`) war es nur diese eine Zeile.
3. **Was tun?** Erwartet: einen Hinweis wie «PDF erstellen». Gesehen: nur die Feststellung «PDF noch nicht erstellt». Weil der Text unterstrichen ist, habe ich ihn angeklickt (`07-hover-marker.png`: beim Überfahren wird die ganze Zeile grau hinterlegt). Für den Screenreader heisst der Link «PDF noch nicht erstellt: Abrechnung NK-11111111-2025-0002 von Anna Schmidt öffnen». Das sagt deutlicher als der sichtbare Text, dass man die Abrechnung öffnet.
4. **Detailseite Anna Schmidt** (`08-anna-detail.png`). Erwartet: einen Hinweis, dass das PDF fehlt, und eine Schaltfläche dafür. Gesehen: oben rechts «PDF erstellen» (umrandet) neben «Als versendet markieren» (gefüllt), «Status: Entwurf», im Verlauf nur «Erstellt 16.10.2026, 21:14». Einen Hinweistext gibt es nicht.
5. **PDF erstellen.** Erwartet: eine Bestätigung. Gesehen (`09-nach-pdf-erstellen.png`): Die Schaltfläche heisst jetzt «PDF herunterladen», im Verlauf steht «PDF erstellt 16.10.2026, 21:19», eine Meldung erschien nicht. In der Liste zeigt die Zeile von Anna Schmidt danach wie alle anderen «PDF».
6. **Zeitangabe Sarah Meier und Nina Brunner.** Erwartet: in jeder Zeile die Abrechnungsperiode, wie bei allen anderen 2025er Zeilen (01.01.2025 – 31.12.2025). Gesehen in der Liste: Sarah Meier «Seepark Residenz, Wohnung A2 / 01.01.2025 – 30.06.2025», Nina Brunner «Seepark Residenz, Wohnung A2 / 01.07.2025 – 31.12.2025», beide ohne Beschriftung, grau unter der Wohnung. Mein erster Gedanke war: Für Wohnung A2 wurden zwei Halbjahresperioden abgerechnet. Erst als ich die gleiche Wohnung zweimal sah, kam ich auf einen Mieterwechsel. Auf den Detailseiten (`04-sarah-detail.png`, `05-nina-detail.png`) steht bei beiden «Abrechnungsperiode 01.01.2025 – 31.12.2025» und unter «Mieter und Wohnung» «Mietstage in der Abrechnungsperiode 181» bzw. «184». Die Liste zeigt also offenbar die Mietzeit innerhalb der Periode. Gesagt wird das nirgends.

## Verwirrung

- **Der Zeitraum ohne Beschriftung** (P-1): In 15 von 17 Zeilen ist er gleich der Abrechnungsperiode, in zwei Zeilen nicht. Gerade weil er meist mit der Periode übereinstimmt, liest man ihn als Periode. Die Detailseite setzt an dieselbe Stelle das Wort «Abrechnungsperiode» mit einem anderen Zeitraum. Für mich sind das zwei widersprüchliche Angaben, bis ich sie mit den Mietstagen nachgerechnet habe.
- **«PDF noch nicht erstellt»**: Das ist ein Zustand, keine Handlung. Dass das PDF fehlt, ist klar. Wer erstellt es denn, ich oder das System, und wird es vielleicht noch automatisch erstellt? Das bleibt offen.
- **«Abrechnungen» und «Nebenkostenabrechnungen»**: Die Übersicht spricht von «Abrechnungen erstellen», die Navigation von «Nebenkostenabrechnungen». Ich habe einen Moment gebraucht, bis ich sah, dass die Liste unter dem längeren Namen steht.

## Fehlerrisiken

- Wer den Zeitraum der Liste für die Abrechnungsperiode hält, zweifelt die Abrechnung an oder sucht einen Fehler, wo keiner ist («warum nur ein halbes Jahr?»). Schlimmer: Man übersieht vielleicht eine tatsächlich falsche Periode, weil man sich an Abweichungen in dieser Spalte gewöhnt hat.
- Auf der Detailseite ist «Als versendet markieren» die Hauptaktion, auch solange kein PDF existiert. Ein eiliger Benutzer markiert so vielleicht eine Abrechnung als versendet, die er nie als PDF erstellt und verschickt hat. (Ich habe es nicht ausprobiert, weil ich nur das PDF erstellen durfte.)
- Ohne Filter oder Zähler für fehlende PDFs übersieht man bei mehreren Seiten leicht eine Abrechnung ohne PDF.

## Vorschläge

- **P-1**: Reproduktion: «Nebenkostenabrechnungen» öffnen, Zeilen «Sarah Meier NK-22222222-2025-0002» und «Nina Brunner NK-22222222-2025-0003» mit den anderen 2025er Zeilen vergleichen, dann eine der beiden öffnen und den Untertitel lesen. Hilfreich wäre eine sichtbare Beschriftung in der Zeile, etwa «Mietzeit 01.01.2025 – 30.06.2025» oder «Abrechnungsperiode 2025 · gemietet 01.01. – 30.06.2025». Auf der Detailseite sollte dieselbe Mietzeit neben den Mietstagen stehen, damit die Angabe der Liste dort wiederzufinden ist.
- **P-2**: Reproduktion: Liste öffnen, Zeile «Anna Schmidt NK-11111111-2025-0002» rechts ansehen (Zustand vor dem Erstellen des PDFs). Hilfreich wäre ein Verb, etwa «PDF erstellen» als Link mit Symbol, oder «Noch kein PDF» als Status und darunter «PDF erstellen». Auf der Detailseite zusätzlich ein Satz «Für diese Abrechnung gibt es noch kein PDF. Erstellen Sie es, bevor Sie die Abrechnung versenden.»

## Nicht geprüft

- Den Inhalt des erstellten PDFs habe ich nicht geöffnet. Er war nicht Teil der Aufgabe, und die Beträge prüft der Daten-Prüfer.
- «Als versendet markieren» ohne PDF habe ich nicht ausprobiert, weil ich ausser dem PDF nichts speichern durfte. Ob Dwello das verhindert, bleibt offen.
- Andere Sprachen, Mobilansicht und das dunkle Erscheinungsbild habe ich nicht geprüft, weil die Aufgabe nur Desktop vorsieht.
- Einen Fehler beim Erstellen des PDFs habe ich nicht simuliert, weil der Auftrag keinen solchen Fehlerfall nennt.
