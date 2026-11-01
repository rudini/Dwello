# Sven – Suchen und Blättern in den Listen per Tastatur (#681)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, Zoom 100 %. Beurteilt habe ich, was im Barrierefreiheitsbaum steht, wo der Fokus liegt und was die Live-Regionen melden. Ich habe nur geschaut und nichts gespeichert. Skripte und Bildschirmfotos liegen in `/tmp/sven-681/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen, Wohnungen: Seitenwechsel («Nächste Seite» / «Vorherige Seite») | Nach dem Seitenwechsel steht der Fokus auf der Überschrift «83 Rechnungen» bzw. «13 Wohnungen», also genau auf derselben Überschrift wie vor dem Wechsel. Welche Seite jetzt offen ist («Seite 2 von 5»), höre ich nicht. Ob der Wechsel geklappt hat, merke ich erst, wenn ich die Liste lese oder auf Rechnungen etwa 40 Mal Tab drücke bis zur Seitennavigation. |
| P-2 | Minor | Leeres Suchergebnis (Wohnungen, Rechnungen; gleich bei Mietverträge, Mieter, Gebäude) | Das Angebot heisst «Filter zurücksetzen». Bei Wohnungen sagt der Text darüber aber «… oder zeigen Sie alle Wohnungen». Ich habe nur einen Suchbegriff eingegeben und keinen Filter gesetzt, also ist für mich nicht klar, dass der Link meine Suche löscht. Dazu gibt es auf der Seite zwei Bedienelemente mit demselben Namen (Schaltfläche im Suchformular und Link unter der Meldung). In der Liste der Links und Schaltflächen meines Screenreaders kann ich sie nur an der Rolle unterscheiden. |

## Beobachtungen

- Nach dem Absenden der Suche (Enter im Suchfeld) springt der Fokus sofort auf die Überschrift «Keine Wohnungen gefunden» bzw. «Keine Rechnungen gefunden». Das wird vorgelesen, und der nächste Tab führt direkt zum Angebot «Filter zurücksetzen». Genau so wünsche ich mir das.
- Nach «Filter zurücksetzen» steht der Fokus auf «13 Wohnungen» bzw. «83 Rechnungen». Das Suchfeld ist leer, und der nächste Tab führt zur ersten Wohnung («Wohnung EG»).
- Zurück und Vorwärts im Browser: Bei jedem Schritt landet der Fokus wieder auf der passenden Ergebnis-Überschrift. Beim leeren Ergebnis ist das «Keine Wohnungen gefunden» mit «Xylophon» wieder im Suchfeld, bei der vollen Liste «13 Wohnungen». Ich muss nicht von oben anfangen.
- Die Live-Region für Seitenwechsel (assertive) enthält nach jedem Schritt «Wohnungen - Dwello», also stets denselben Text. Ob ein Screenreader das bei Zurück/Vorwärts nochmals vorliest, ist offen. Weil der Fokus auf der Überschrift landet, war ich trotzdem orientiert. Die Region mit role=status blieb bei allen Schritten leer.
- Die Meldung beim leeren Ergebnis ist je Liste unterschiedlich ausführlich. Bei Wohnungen: «Keine Wohnung passt zu «Xylophon». Gesucht wird in Wohnungsnummer, Gebäudename, Strasse und Ort. Prüfen Sie die Schreibweise …». Bei Rechnungen nur: «Versuchen Sie es mit anderen Filtern.», ohne meinen Suchbegriff und ohne Hinweis, worin gesucht wurde. Wer per Fokus auf der Überschrift landet, hört diesen Absatz ohnehin erst beim Weiterlesen.
- Überschriftenstruktur: Die einzelnen Wohnungen sind Überschriften der Ebene 2 («Wohnung EG» [level=2]) und stehen unter der Überschrift «13 Wohnungen», die ebenfalls Ebene 2 hat. Erwartet hätte ich Ebene 3 für die Einträge, damit die Gliederung stimmt.
- Rechnungen Seite 1: Von «Rechnungen» in der Hauptnavigation bis «Nächste Seite» sind es 66 Tabs, weil jede der 20 Rechnungen eigene Links hat. Über die Landmarke «Seiten» (navigation) komme ich aber schnell hin.
- «Mietverträge» hat in den Demodaten nur 11 Einträge und keine zweite Seite. Ich habe deshalb auf Rechnungen (5 Seiten) und Wohnungen (2 Seiten) geblättert.
- Wenn ich eine Adresse mit leerem Ergebnis direkt aufrufe (z. B. als Lesezeichen), bleibt der Fokus auf dem Seitenanfang. Das ist beim Laden einer Seite normal.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Durchläufe. Aufgabe 1: 19 Tabs bis zum Suchfeld bei Wohnungen, Suchbegriff tippen, Enter, 1 Tab, Enter. Aufgabe 2: je ein Schritt zurück bzw. vorwärts. Aufgabe 3: 66 Tabs bis «Nächste Seite» auf Rechnungen, danach 41 Tabs bis «Vorherige Seite». Aufgabe 4: 20 Tabs bis zum Suchfeld, tippen, Enter, 1 Tab, Enter.

## Ablauf

- Aufgabe 2, Alt+Pfeil links: Ich erwartete, dass die vorige Seite kommt. Im Testbrowser (Chromium ohne Fensterleiste) passierte nichts, die Adresse blieb `/apartments`. Das liegt am Testwerkzeug: Die Tastenkürzel der Browserleiste kommen dort nicht an. Ich habe stattdessen die Zurück- und Vorwärts-Funktion des Browsers direkt ausgelöst. Danach verhielt sich alles wie erwartet (siehe Beobachtungen).
- Aufgabe 3, nach «Nächste Seite» auf Rechnungen: Ich erwartete eine Ansage wie «Seite 2 von 5». Ich hörte «83 Rechnungen, Überschrift Ebene 2», genau wie auf Seite 1 (P-1). Nach «Vorherige Seite» war es genauso.
- Aufgabe 1 und 4, leeres Ergebnis: Ich erwartete ein Angebot wie «Alle Wohnungen zeigen», denn so steht es im Text. Der Link heisst «Filter zurücksetzen» (P-2). Er tut aber das Richtige.

## Vorschläge

- **P-1:** Rechnungen öffnen, mit Tab zu «Nächste Seite» (Landmarke «Seiten») gehen und Enter drücken. Der Fokus steht auf «83 Rechnungen», die Seitenzahl wird nicht angesagt. Hilfreich wäre, die Seitenzahl in die Überschrift zu nehmen, auf der der Fokus landet (z. B. «83 Rechnungen, Seite 2 von 5»), oder sie über die Status-Region anzusagen. Bei Wohnungen genauso.
- **P-2:** Wohnungen öffnen, «Xylophon» suchen, Tab: Der Link heisst «Filter zurücksetzen». Hilfreich wäre ein Name, der sagt, was danach kommt, so wie der Text darüber: «Alle Wohnungen zeigen» bzw. «Alle Rechnungen zeigen». Dann haben auch Schaltfläche und Link nicht mehr denselben Namen.

## Nicht geprüft

- Das echte Tastenkürzel Alt+Pfeil links/rechts: Im Chromium ohne Fensterleiste hat es nicht gewirkt (zweimal versucht, Adresse blieb gleich). Ersatzweise habe ich Zurück/Vorwärts des Browsers direkt ausgelöst.
- Die tatsächliche Sprachausgabe eines Screenreaders (NVDA, VoiceOver): Ich habe den Barrierefreiheitsbaum, den Fokus und die Inhalte der Live-Regionen gelesen. Ob ein Screenreader eine Live-Region mit unverändertem Text erneut vorliest, konnte ich so nicht feststellen.
- Blättern auf Mietverträge: Mit 11 Einträgen gibt es keine zweite Seite.
