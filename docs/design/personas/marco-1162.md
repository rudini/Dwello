# Marco – Statuskacheln und Filter in «Nebenkostenabrechnungen» (#1162)

Handy 390 × 844, Touch, Demo-Daten, nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-1162/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nebenkostenabrechnungen, Statuskachel getippt | Nach dem Tipp auf eine Kachel bleibt die Seite stehen. Die Kachel wird markiert, die gefilterte Liste beginnt aber erst bei etwa 1000 px, also unterhalb des Bildschirms. Ich sehe nicht, dass sich unten etwas geändert hat, und muss selbst scrollen. Bei «Suchen» springt die Seite dagegen zur Liste. Die beiden Filter verhalten sich also verschieden. |
| P-2 | Minor | Nebenkostenabrechnungen, gefilterte Liste | Über der Liste steht nur «7 Abrechnungen» oder «9 Abrechnungen», nicht welcher Status gezeigt wird. Sobald ich zur Liste scrolle, ist die markierte Kachel weg. Dann sagen nur noch die kleinen Badges an den Einträgen, dass gefiltert ist. |

## Beobachtungen

- Die markierte Kachel ist gut zu erkennen: heller Hintergrund, dunkler Rand, ein Häkchen und «Filter aufheben». Ein zweiter Tipp auf dieselbe Kachel zeigt wieder alle 17. Das hat jedes Mal geklappt (Entwurf, Überfällig, Erledigt, Bezahlt).
- Tippe ich eine Kachel an, wenn ich schon etwas nach unten gescrollt bin, bleibt die Seite an derselben Stelle (vorher und nachher 300 px). Die Kachel springt mir also nicht weg. Das ist gut.
- Kacheln mit 0 lassen sich auch antippen, zum Beispiel «0 Erledigt». Das Ergebnis «Keine Abrechnungen gefunden» erscheint dann weit unten, bei etwa 1270 px, und ist ohne Scrollen nicht zu sehen.
- Nach «Suchen» landet die Seite auf der Überschrift der Liste («2 Abrechnungen»), mit sichtbarem Fokusrahmen. Das finde ich gut. Dafür sind die Kacheln dann oben ausserhalb des Bildschirms. Bei Gebäude «Alpenblick» plus Suche «Müller» war auch das Suchfeld mit «Müller» weg. Ich sah nur «Alpenblick» und «Keine Abrechnungen gefunden», aber nicht, wonach gesucht worden war.
- Mit aktiver Suche zählen die Kacheln nur noch die Treffer (alle 0 bei «Müller» in Alpenblick). Das ist logisch, aber auf den ersten Blick sieht es so aus, als wären die Abrechnungen verschwunden.
- Nah beieinander stehen zwei Wörter für fast dasselbe: «Filter aufheben» auf der Kachel und «Filter zurücksetzen» unter dem Suchknopf.
- Aufheben eines Filters führt auf die Adresse `/statements?` (mit leerem Fragezeichen). Mir fällt das nicht auf, nur der Vollständigkeit halber.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, rund 15 Tipps: Menü, Nebenkostenabrechnungen, Entwurf an und aus, Überfällig an und aus, Erledigt an und aus, Bezahlt an und aus, Gebäude wählen und «Suchen», Suche «Müller», «Bezahlt» bei aktiver Suche.

## Ablauf

- Tipp auf «7 Entwurf» von oben auf der Seite. Erwartet: Ich sehe die Entwürfe oder einen Hinweis, dass die Liste darunter jetzt gefiltert ist. Gesehen: Nur die Kachel wird markiert. Der Bildschirm zeigt bis zum Suchfeld nichts Neues, «7 Abrechnungen» steht bei 1088 px. Gleich bei «1 Überfällig» («1 Abrechnung» bei 1088 px).
- Zur Liste gescrollt, Filter «Bezahlt». Erwartet: Über der Liste steht etwa «9 Abrechnungen mit Status Bezahlt». Gesehen: nur «9 Abrechnungen». Die Kachel ist oben nur noch zur Hälfte zu sehen.
- «0 Erledigt» angetippt. Erwartet: Die Kachel lässt sich nicht antippen, oder das Leer-Ergebnis erscheint direkt. Gesehen: Die Kachel ist markiert, «Keine Abrechnungen gefunden» erscheint erst weit unten.
- Gebäude «Alpenblick» und «Suchen». Erwartet: Die Seite bleibt stehen wie bei den Kacheln. Gesehen: Sie springt zu «2 Abrechnungen», die Liste ist sofort da. Das ist besser als bei den Kacheln, aber anders.
- Suche «Müller» in Alpenblick. Erwartet: Ich sehe meinen Suchbegriff beim Ergebnis. Gesehen: Das Suchfeld ist oben aus dem Bild, sichtbar sind nur «Alpenblick» und das Leer-Ergebnis.

## Vorschläge

- **P-1:** Öffnen Sie `/statements` auf 390 × 844 und tippen Sie, ohne zu scrollen, auf «7 Entwurf». Die Liste («7 Abrechnungen») liegt unter dem Bildschirmrand. Was helfen würde: wie bei «Suchen» zur Überschrift der Liste springen, oder direkt unter den Kacheln ein kurzer Satz wie «7 Abrechnungen im Status Entwurf, siehe unten». Jedenfalls sollten sich Kacheln und Suche gleich verhalten.
- **P-2:** Filtern Sie mit «9 Bezahlt» und scrollen Sie zur Liste. Die Überschrift lautet nur «9 Abrechnungen». Was helfen würde: den aktiven Status (und die Suche oder das Gebäude) in die Überschrift oder in einen Satz darüber schreiben, etwa «9 Abrechnungen · Status: Bezahlt».

## Nicht geprüft

- Seite 2 der ungefilterten Liste mit einem Statusfilter kombiniert: Mit Filter gab es nie mehr als eine Seite.
- Dunkelmodus und andere Sprachen: nicht Teil der Aufgabe.
- Echtes Wischen mit dem Finger: Gescrollt habe ich per Mausrad oder Skript, getippt per Touch. Die Lage auf der Seite habe ich über die Scrollposition und Screenshots in Bildschirmgrösse beurteilt.
