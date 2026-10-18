# Dr. Weber – Slice 292: Erklärungen der Umlagefähigkeit

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, prüft Quellen. Desktop 1440 × 900, Maus, Zoom 100 %. App: http://localhost:3300 (Demodaten, Deutsch). Nur angesehen, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/885a1125-b6db-5975-8e5c-ec01f947f577/scratchpad/weber-292/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen (Liste), Rechnungsdetail, Rechnung bearbeiten | «Nicht umlagefähig» steht bei der korrekt eingeordneten Boiler-Reparatur in Gelb mit Warndreieck da, im Bearbeiten-Formular sogar als gelber Warnkasten. Das ist eine Warnung, obwohl nichts falsch ist. Wer vorsichtig ist, will den «Fehler» beheben und setzt das Häkchen «Umlagefähig» womöglich doch. |
| P-2 | Minor | Lift bearbeiten | Beschreibung und Erklärung sagen zum Servicevertrag nicht dasselbe: Die Beschreibung schliesst «Serviceabos mit Reparaturen» ganz aus, die Erklärung will den Wartungsanteil eines «Vollservicevertrags» unter «Lift» erfasst haben. Zwei verschiedene Begriffe, zwei verschiedene Anweisungen. |
| P-3 | Minor | Rechnung bearbeiten (Sanitär Keller AG) | Der Warnkasten sagt allgemein «Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden», ohne Gesetzesartikel. Das Rechnungsdetail zeigt dagegen die Erklärung der Kategorie mit Art. 256 Abs. 1 OR. Bei den umstrittenen Kategorien (Schädlingsbekämpfung, Feuerlöscher-Wartung) wäre «können nicht» zudem zu absolut. |
| P-4 | Minor | Kategorien, Verwaltung | «Verwaltungspauschale» ist nicht der Wortlaut des Gesetzes: Art. 4 Abs. 3 VMWG erlaubt die Verwaltungskosten «nach Aufwand oder im Rahmen der üblichen Ansätze». Ausserdem sagt der Text nicht, wo ich diese Pauschale in Dwello erfasse. |
| P-5 | Minor | Rechnungsdetail (Sanitär Keller AG) | Bei einer nicht umlagefähigen Rechnung steht «Verteilschlüssel: Keiner – die Kosten werden gleichmässig pro Wohnung verteilt». Das liest sich so, als würden die Kosten doch auf die Wohnungen verteilt. Das widerspricht der Erklärung direkt darunter. |
| P-6 | Nit | Kategorien, Lift | Für «Reparaturen und Ersatzteile trägt der Vermieter» steht kein Artikel (Art. 256 OR würde passen). Der Schlusssatz wiederholt nur den ersten Satz. Es fehlt auch, wohin der Reparaturanteil eines Vollservicevertrags gehört (vermutlich «Reparaturen»). |

## Beobachtungen

- Der Hinweis zum Mietvertrag («Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt (Art. 257a Absatz 2 Obligationenrecht, OR)») ist richtig und verständlich. Er steht in der Liste und im Hilfetext des Formulars. Gut.
- Gebäudeversicherung: Art. 256b OR (Lasten der Sache trägt der Vermieter) und Art. 5 Abs. 2 Bst. h VMWG (Versicherungsprämien nur für die Heizungsanlage) stimmen. Die Folge «also nicht umlagefähig» ist klar.
- Verwaltung: Der Verweis auf Art. 5 Abs. 2 Bst. i VMWG (Verwaltungsarbeit für den Heizbetrieb) stimmt, ebenso der Hinweis, dass der Mietvertrag die Kosten nennen muss.
- Schädlingsbekämpfung und Feuerlöscher-Wartung: Beide nennen Art. 257a Abs. 1 OR, sagen offen «umstritten» und ziehen eine klare Folge («Dwello folgt dem Merkblatt: … nicht umlagefähig»). Den Titel des Merkblatts habe ich per Websuche gefunden: «Zulässige und unzulässige Nebenkosten» ist der richtige Titel eines Merkblatts des Mieterinnen- und Mieterverbands, derzeit in einer Fassung 2026. Mir fällt auf: Die Quelle ist ein Interessenverband und keine Behörde, und die Gegenposition nennt Dwello nicht. Weil das Ergebnis aber die vorsichtige Seite ist (der Vermieter trägt), kann ich damit leben. Eine Fassung oder ein Jahr des Merkblatts fände ich als Quellenangabe sauberer.
- Kehricht (nicht Teil der Aufgabe): «Kehrichtgebühren nach Gebrauch (z. B. Grundgebühr pro Wohnung …)». Eine feste Gebühr pro Wohnung ist keine Gebühr nach Gebrauch. Der Satz ist in sich schief.
- Die Kategorie-Liste zeigt bei jeder Dwello-Kategorie einen ausgegrauten Button «Löschen». Der Grund steht oben im Text, der Button wirkt trotzdem überflüssig.
- KI-Prüfung «Bewachung»: Die Antwort «Kein Vorschlag der KI – Die KI ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind; die Regeln stehen im Hilfetext oben. Im Zweifel: nicht umlagefähig.» sagt klar, was zu tun ist. Gelber Kasten mit Warndreieck, hier passend, weil tatsächlich etwas offen ist. Die Antwort stammt vom Stand-in der KI.
- Lift AG «Wartungsabonnement Lift 2025»: Grünes Abzeichen «Umlagefähig» mit Häkchen, darunter die volle Lift-Erklärung. Ob dieses Abonnement auch Reparaturen deckt, kann Dwello nicht wissen. Der Satz «Erfassen Sie unter «Lift» nur diesen Anteil» ist hier ein sinnvoller Prüfhinweis.
- Das Bearbeiten-Formular der Lift-Rechnung warnt richtig «Rechnung schon abgerechnet» und erklärt die Folgen einer Änderung. Gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Skriptläufe. Etwa 20 Schritte: Übersicht, Kategorien, Lift bearbeiten, Neue Kategorie mit Name und KI-Prüfung, Rechnungen mit zwei Suchen, zwei Rechnungsdetails, zwei Bearbeiten-Formulare. Dazu eine Websuche nach dem Merkblatt.

## Ablauf

1. **Einstellungen › Kategorien** (Screenshot 02-kategorien.png). Erwartet: zu jeder Kategorie eine kurze Begründung mit Artikel und Folge. Gesehen: Jede Kategorie hat einen Absatz mit Gesetzesartikel und einem Schluss «… ist also (nicht) umlagefähig». Oben stehen die Erklärung zum Löschen und der Hinweis zum Mietvertrag mit Art. 257a Abs. 2 OR.
   - Feuerlöscher-Wartung: «umstritten», Merkblatt des Mieterverbands, Begründung «Brandschutz, der auch bei leerem Gebäude nötig ist». Folge klar. Ob das Merkblatt das so begründet, konnte ich nicht nachlesen.
   - Schädlingsbekämpfung: gleiches Muster, Folge klar.
   - Lift: Artikel richtig. Der Hinweis zum Vollservicevertrag ist verständlich, die Reparaturen sind aber nicht belegt (P-6).
   - Gebäudeversicherung: richtig und verständlich.
   - Verwaltung: weitgehend richtig, mit dem Begriff «Verwaltungspauschale» (P-4).
2. **Lift bearbeiten** (03-lift-edit.png). Erwartet: Beschreibung und Erklärung sagen dasselbe. Gesehen: Beschreibung «Strom, Notruftelefon und reine Wartung des Lifts; ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen». Erklärung: «Deckt ein Vollservicevertrag auch Reparaturen, ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil.» Inhaltlich verwandt, aber nicht gleich formuliert und nicht gleich gemeint (P-2). Darüber erklärt das Formular gut, was das Umstellen der Umlagefähigkeit bewirkt.
3. **Neue Kategorie «Bewachung», KI prüfen** (04-neu-leer.png, 06-ki-bewachung.png). Erwartet: ein Rat für den Zweifelsfall. Gesehen: «Im Zweifel: nicht umlagefähig.» Erfüllt. Nichts gespeichert, mit dem Skript verlassen.
4. **Rechnungen**, Suche «Keller» (08-suche-keller.png). Erwartet: ein neutrales Merkmal «Nicht umlagefähig». Gesehen: gelbes Abzeichen mit Warndreieck (P-1).
   - Detail Sanitär Keller AG (09-detail-keller.png): Kategorie Reparaturen, gelbes Abzeichen «Nicht umlagefähig» mit Dreieck, darunter die Erklärung mit Art. 256 Abs. 1 OR. Das Warum ist klar beantwortet, die Darstellung warnt aber unnötig. Dazu kommt die Verteilschlüssel-Zeile (P-5).
   - Bearbeiten Sanitär Keller AG (10-edit-keller.png): Häkchen «Umlagefähig» leer, «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.», darunter ein gelber Warnkasten «Nicht umlagefähige Kategorie» mit allgemeinem Text (P-1, P-3).
   - Suche «Lift AG», Detail «Wartungsabonnement Lift 2025» (09-detail-lift.png): grünes Abzeichen «Umlagefähig» mit Häkchen und Lift-Erklärung. Warum es dabei ist, ist klar beantwortet, keine falsche Warnung.

## Verwirrung

- «Serviceabo» (Beschreibung) und «Vollservicevertrag» (Erklärung): Ist das dasselbe? Und ist ein «Wartungsabonnement» (Lift AG) ein solches Abo?
- «Verwaltungspauschale»: Wo gibt es die in Dwello? In den Kategorien finde ich keine.
- «Anrechenbar» (VMWG-Sprache, bei Heizung) neben «umlagefähig»: Für mich klar, für Laien zwei Wörter für eine Sache.
- Gelb mit Dreieck bedeutet in Dwello sonst «hier stimmt etwas nicht» (so beim KI-Hinweis). Bei «Nicht umlagefähig» bedeutet es nur «trägt der Vermieter».

## Fehlerrisiken

- P-1: Ein Vermieter hält die Warnung für einen Fehler und setzt die Reparatur auf «Umlagefähig». Dann stellt er dem Mieter unzulässige Kosten in Rechnung.
- P-2: Wer der Beschreibung folgt, legt eine ganze Vollservice-Rechnung unter «Reparaturen» ab und verliert den umlagefähigen Wartungsanteil. Wer der Erklärung folgt, muss die Rechnung selbst aufteilen. Wie, sagt niemand.
- P-5: Man könnte glauben, die Reparatur werde trotzdem auf die Wohnungen verteilt.

## Vorschläge

- **P-1:** Rechnungen › Suche «Keller» › Rechnung «Sanitär Keller AG» öffnen, dann «Rechnung bearbeiten». «Nicht umlagefähig» neutral darstellen (graues Abzeichen, kein Warndreieck), im Formular als Hinweis statt Warnung. Warnen nur, wenn die Rechnung von der Umlagefähigkeit ihrer Kategorie abweicht.
- **P-2:** Einstellungen › Kategorien › Lift. Einen Begriff wählen und die Beschreibung an die Erklärung angleichen, etwa: «Strom, Notruftelefon und Wartung des Lifts; bei Vollserviceverträgen nur der Wartungsanteil; ohne Reparaturen und Ersatzteile».
- **P-3:** Rechnung «Sanitär Keller AG» bearbeiten. Im Kasten die Erklärung der gewählten Kategorie zeigen, wie im Rechnungsdetail, statt des allgemeinen Satzes.
- **P-4:** Einstellungen › Kategorien › Verwaltung. «Verwaltungspauschale» durch den Wortlaut ersetzen («nach Aufwand oder im Rahmen der üblichen Ansätze») und sagen, wo Dwello das erfasst, oder dass Dwello es nicht kann.
- **P-5:** Rechnungsdetail «Sanitär Keller AG». Bei nicht umlagefähigen Rechnungen die Zeile «Verteilschlüssel» weglassen oder «wird nicht verteilt» zeigen.
- **P-6:** Lift-Erklärung: «(Art. 256 Absatz 1 OR)» ergänzen, den letzten Satz streichen und sagen: «Den Anteil für Reparaturen erfassen Sie unter «Reparaturen».»

## Nicht geprüft

- Den Inhalt des Merkblatts «Zulässige und unzulässige Nebenkosten» habe ich nicht gelesen, nur den Titel per Websuche bestätigt. Ob es Feuerlöscher-Wartung und Schädlingsbekämpfung ausdrücklich als unzulässig nennt und mit «auch bei leerem Gebäude nötig» begründet, bleibt offen.
- Speichern (neue Kategorie, Änderungen), weil der Auftrag nur Ansehen erlaubt.
- Andere Sprachen als Deutsch, Mobilansicht, dunkles Design.
- Die Antwort der KI stammt vom Stand-in der Persona-Umgebung, nicht von einem echten Modell.
