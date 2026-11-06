# Marco: Nebenkostenabrechnungen eines Mietvertrags filtern (#673)

Build des Branches w-673, Persona-Stack mit Demo-Daten, http://localhost:3300. Ich habe nur angeschaut und nichts gespeichert. Handy 390 × 844 (Touch), danach Desktop 1440 × 900. Mietvertrag: Hans Müller, Wohnung 1.01, Musterhaus Zentrum (2 Abrechnungen: 2025 «Überfällig», 2024 «Bezahlt»).

## Frühere Befunde (#673)

- **P-3 (Brotkrümel auf der Abrechnung führt zur ungefilterten Liste): behoben.** Von der Abrechnung NK-11111111-2024-0001 führt «Nebenkostenabrechnungen» in der Brotkrümelnavigation zurück zu `?contract=…&search=2024&status=paid`. Der Satz zum Mietvertrag, «Bezahlt» mit Haken und der Suchtext «2024» sind wieder da. Das gilt auf Handy und Desktop. (Auf dem Desktop führt der Eintrag «Nebenkostenabrechnungen» in der Seitenleiste zur ganzen Liste, wie zu erwarten.)
- **P-4 («Filter zurücksetzen» entfernt den Mietvertrag): behoben.** «Filter zurücksetzen» führt zu `?contract=…`. Suchtext und Status sind weg, der Mietvertrag bleibt. Der Link erscheint nur, wenn ein Suchtext oder ein Status gesetzt ist. «Alle Abrechnungen anzeigen» führt zu `/statements` mit allen 17 Abrechnungen (10 auf Seite 1).
- **P-5 (Feld «Gebäude» bei Mietvertragsfilter): behoben.** Wenn ein Mietvertrag gewählt ist, gibt es nur das Feld «Suche (optional)». Nach «Alle Abrechnungen anzeigen» erscheint «Gebäude (optional)» wieder.
- **P-6 (Titel bricht ohne Trennstrich): behoben.** Auf 390 px steht «Nebenkostenabrech-» / «nungen» mit Trennstrich. Die Seite scrollt nicht seitwärts (scrollWidth 390).
- **P-7 (gewählte Status-Kachel nur durch Farbe, zweiter Tipp ohne Hinweis): behoben.** Die gewählte Kachel zeigt einen Haken und die Zeile «Filter aufheben» (für Screenreader auch `aria-current`). Der Satz oben sagt «Es werden nur Abrechnungen mit dem Status «Bezahlt» gezeigt.» Ein zweiter Tipp hebt nur den Status auf. Suchtext und Mietvertrag bleiben.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| M-1 | Minor | Abrechnungsliste mit Mietvertrag, Status und Suchtext | «Filter aufheben» (auf der Kachel) und «Filter zurücksetzen» klingen fast gleich, tun aber Verschiedenes. «Filter aufheben» entfernt nur den Status, der Suchtext bleibt. «Filter zurücksetzen» entfernt Status und Suchtext. Ich wusste nicht, welchen ich nehmen soll. |
| M-2 | Minor | Abrechnungsliste, Handy | Nach dem Tipp auf eine Status-Kachel springt die Seite zur Liste (scrollY 0 → 784). Die gewählte Kachel mit Haken und «Filter aufheben» und der Satz zum Status sind dann nicht mehr zu sehen. Im Bild sehe ich nur «Filter zurücksetzen» und «1 Abrechnung», aber nicht, welcher Status gewählt ist. |
| M-3 | Minor | Abrechnungsliste mit Mietvertrag, Handy | «Alle Abrechnungen anzeigen» und «Zum Mietvertrag» stehen direkt nebeneinander auf einer Zeile, nur durch ein Leerzeichen getrennt (Lücke etwa 4 px). Beide sind unterstrichen und sehen aus wie ein einziger Link. Wer daneben tippt, verliert den Mietvertragsfilter statt zum Mietvertrag zu kommen. |

## Beobachtungen

- N-1: Die Zahlen auf den Kacheln richten sich nach dem Suchtext. Mit «2025» zeigt «Bezahlt» 0. Das ist richtig, hat mich aber kurz verwundert, weil der Satz oben den Suchtext nicht nennt (nur Mietvertrag und Status).
- N-2: Auf dem Desktop haben der Satz zum Mietvertrag und die zwei Links grossen Zeilenabstand, weil die 48 px hohen Links in der Textzeile stehen. Das sieht etwas unruhig aus, stört aber nicht.
- N-3: Ohne Mietvertragsfilter listet das Feld «Gebäude» die Gebäude als Alpenblick, Seepark Residenz, Musterhaus Zentrum, also nicht alphabetisch. Im Wohnungsfilter ist die Reihenfolge alphabetisch (siehe marco-670).
- N-4: Die Seite des Mietvertrags hat unter «Dazu gehört» den Link «Nebenkostenabrechnungen». Er war schnell zu finden.
- N-5: Wenn ich aus der Liste eine Abrechnung öffne, merkt sich der Link «PDF herunterladen» auf der Abrechnung die Liste (`?list=…`).

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten pro Gerät. Vom Mietvertrag bis zur gefilterten Liste brauchte es 2 Tipps (Mietverträge → Hans Müller → «Nebenkostenabrechnungen»). Danach Suchen, Kachel, «Filter zurücksetzen», Kachel zweimal, Abrechnung öffnen, Brotkrümel zurück, «Alle Abrechnungen anzeigen»: rund 10 Schritte.

## Ablauf

- Handy, Status-Kachel «Bezahlt» antippen. Erwartet: Ich sehe die Kachel mit Haken. Gesehen: Die Seite springt zur Ergebnisliste, Kachel und Statussatz sind oben ausserhalb des Bildes (M-2).
- Mit Suchtext «2025» und Status «Überfällig». Erwartet: «Filter aufheben» entfernt alle Filter, wie «Filter zurücksetzen». Gesehen: Es entfernt nur den Status, «2025» bleibt (M-1).
- Handy, Zeile unter dem Satz zum Mietvertrag. Erwartet: zwei klar getrennte Knöpfe. Gesehen: zwei Links ohne sichtbare Trennung auf einer Zeile (M-3).

## Vorschläge

- **M-1:** Mietvertrag Hans Müller → «Nebenkostenabrechnungen» → Suche «2025» → «Suchen» → Kachel «Überfällig». Jetzt sind «Filter aufheben» und «Filter zurücksetzen» beide sichtbar. Hilfreich wäre ein Text auf der Kachel, der sagt, was entfernt wird, zum Beispiel «Status aufheben». Dann klingen die zwei Links nicht gleich.
- **M-2:** Handy 390 px, `/statements?contract=b0000001-0001-0001-0001-000000000001`, Kachel «Bezahlt» antippen. Die Seite steht danach bei scrollY 784. Hilfreich wäre es, die Scrollposition zu behalten, wie auf dem Desktop (scrollY bleibt 0). Oder über der Liste den gewählten Status nennen (zum Beispiel «1 Abrechnung mit Status Bezahlt»).
- **M-3:** Handy 390 px, dieselbe Seite, Zeile «Alle Abrechnungen anzeigen Zum Mietvertrag». Hilfreich wären die Links untereinander oder mit sichtbarem Abstand (8 px Raster). Oder «Zum Mietvertrag» als Knopf, weil man damit auf der Stelle zurückgeht.

## Nicht geprüft

- Speichern (zum Beispiel «Als bezahlt markieren»): Der Auftrag lautete nur anschauen.
- Den Statussatz für «Versendet» und «Erledigt» mit Mietvertragsfilter: Hans Müller hat dort 0 Abrechnungen. Ich habe nur «Bezahlt» und «Überfällig» angetippt.
- Die Kacheln mit Zahl 0 habe ich nicht gewählt. Das Ergebnis wäre eine leere Liste, und ich habe ihren Leertext nicht angeschaut.

Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-673/`.
