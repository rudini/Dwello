# Helga – #664, Runde 2: Mietvertrag beenden und Schlussabrechnung

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Dialog auch bei 200 %), Maus. Persona-App auf :3300 mit Demodaten. Nichts gespeichert: Den Dialog habe ich mit «Abbrechen» geschlossen (kein POST), im Assistenten bin ich nur bis zur Vorschau gegangen (nur die Vorschau-Anfrage `?/preview`, nichts erstellt).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag Hans Müller (Musterhaus Zentrum 1.01) | Die Schaltfläche heisst «Enddatum erfassen», der Dialog dahinter aber «… beenden?» mit der Schaltfläche «Mietvertrag beenden». Ich habe nach «kündigen» oder «beenden» gesucht und musste raten, dass «Enddatum erfassen» das ist. Zwei Namen für dieselbe Handlung. |
| P-2 | Minor | Wohnungen (Liste) und Gebäude Musterhaus Zentrum, Zeile Wohnung 1.01 | «Auszug am 28.02.2021, Schlussabrechnung fällig» steht ohne Namen in der Zeile, direkt neben «Vermietet». Ich dachte zuerst, der jetzige Mieter (Hans Müller) zieht aus. Dass es um den früheren Mieter Kevin Fischer geht, sehe ich erst im Mietvertrag. |
| P-3 | Minor | Listen und Mietvertrag Kevin Fischer | Der Hinweis sagt «Auszug am 28.02.2021», der Mietvertrag sagt «gekündigt auf den 28.02.2021», und der Dialog zum Beenden erklärt mir ausdrücklich, dass der Vertrag bis zum Vertragsende läuft, «auch wenn der Mieter früher auszieht». Auszug und Vertragsende sind also nicht dasselbe, der Hinweis verwendet aber «Auszug» für das Vertragsende. |
| P-4 | Minor | Wohnung 1.01 (Detailseite) | Ich klicke in der Liste auf die Zeile mit «Schlussabrechnung fällig» und lande auf der Wohnung. Dort steht nichts mehr davon: Kevin Fischers Vertrag erscheint unter «Frühere Mietverträge» nur als «Beendet», ohne Hinweis und ohne Schaltfläche. Ich muss noch einmal auf den Vertrag klicken. |
| P-5 | Minor | «Schlussabrechnung erstellen» → Assistent «Abrechnungen erstellen» | Die Schaltfläche verspricht eine Schlussabrechnung für Kevin Fischer. Geöffnet wird der allgemeine Assistent bei Schritt 3 «für ganze Gebäude», Periode 2021; die Wörter Schlussabrechnung und Kevin Fischer kommen nicht vor. Erst in der Vorschau sehe ich 3 Abrechnungen (Hans Müller, Maria Rossi, Kevin Fischer). Ich hatte Angst, aus Versehen auch die anderen zwei Mieter abzurechnen, und hätte hier beinahe abgebrochen. |
| P-6 | Minor | Mietvertrag Kevin Fischer | Der Kasten «Auszug am 28.02.2021, Schlussabrechnung fällig» hat keinen Satz dazu, was eine Schlussabrechnung ist und welche Periode sie abrechnet. Direkt darunter steht «4 Abrechnungen fehlen» (2018–2021) mit «2021 abrechnen», das dieselbe Seite öffnet wie «Schlussabrechnung erstellen». Ich weiss nicht, ob ich mit der Schlussabrechnung fertig bin oder ob 2018–2020 auch noch dazugehören. |

## Beobachtungen

- Der Dialog «Mietvertrag … beenden?» erklärt sehr viel (Vertragsende, Kündigung erhalten am, Formular, Ehegatten, Todesfall). Gut gemeint und für mich nützlich, aber lang: Bei 150 % und bei 200 % sehe ich «Abbrechen» und «Mietvertrag beenden» erst nach dem Scrollen im Dialog (Schaltflächen bei y = 962 px, sichtbare Höhe 600 bzw. 450 px).
- «Abbrechen» schliesst den Dialog sauber; die Seite ist unverändert, der Vertrag weiter «Laufend», es wurde nichts gesendet.
- Auf der Übersicht steht unter «Als Nächstes zu tun» nichts von einer fälligen Schlussabrechnung; nur die allgemeinen fehlenden Jahre.
- In der Liste «Mietverträge» steht bei fast allen Verträgen «Abrechnung fehlt», auch bei laufenden. Die fällige Schlussabrechnung von Kevin Fischer hebt sich dort nicht ab.
- Sarah Meier (Seepark Residenz A2, beendet 30.06.2025) bekommt keinen Hinweis «Schlussabrechnung fällig», nur «3 Abrechnungen fehlen» (2021–2023). Ich nehme an, ihr letztes Jahr ist abgerechnet; das stimmt mit dem Fehlen des Hinweises überein.
- «fällig» bei einem Auszug vor über fünf Jahren: Ich weiss nicht, ob es noch eine Frist gibt oder ob es schon zu spät ist.
- Die Vorschau warnt verständlich, dass für 2021 keine Rechnungen erfasst sind und alle das Akonto zurückbekämen.

## Aufgabe geschafft: ja

Ich habe die Handlung zum Beenden gefunden und abgebrochen, und ich habe den Weg zur Schlussabrechnung gefunden. Ob die richtige Abrechnung entsteht, war mir aber bis zur Vorschau nicht klar.

## Aufwand

Etwa 20 Minuten, rund 14 Schritte (Übersicht, Menü, Mietverträge, Vertrag Hans Müller, Dialog öffnen, Abbrechen, Wohnungen, Gebäude, Musterhaus Zentrum, Wohnung 1.01, Vertrag Kevin Fischer, Vertrag Sarah Meier, Schlussabrechnung erstellen, Weiter zur Vorschau).

## Ablauf

1. Mietvertrag Hans Müller: erwartet eine Schaltfläche «Kündigen» oder «Mietvertrag beenden»; gesehen «Bearbeiten», «Enddatum erfassen», «Löschen». Erst der Dialog heisst «beenden» (P-1).
2. Dialog bei 150 %: erwartet die Schaltflächen unten sichtbar; gesehen nur Text und Felder, die Schaltflächen erst nach Scrollen im Dialog.
3. Liste Wohnungen, Zeile 1.01: erwartet einen Hinweis zum früheren Mieter; gesehen «Auszug am 28.02.2021, Schlussabrechnung fällig» neben «Vermietet», ohne Namen (P-2, P-3).
4. Klick auf Wohnung 1.01: erwartet den Hinweis mit einer Schaltfläche; gesehen nur «Frühere Mietverträge – Beendet» (P-4).
5. Vertrag Kevin Fischer: erwartet eine kurze Erklärung zur Schlussabrechnung; gesehen nur die Überschrift und die Schaltfläche, darunter einen zweiten Kasten mit vier fehlenden Jahren (P-6).
6. «Schlussabrechnung erstellen»: erwartet eine Abrechnung für Kevin Fischer; gesehen «Abrechnungen erstellen … für ganze Gebäude», Schritt 3, ohne seinen Namen; in der Vorschau drei Abrechnungen (P-5).

## Vorschläge

- **P-1:** Mietverträge → Hans Müller öffnen → Schaltfläche «Enddatum erfassen». Helfen würde, wenn sie gleich heisst wie der Dialog: «Mietvertrag beenden».
- **P-2:** Wohnungen oder Gebäude Musterhaus Zentrum → Zeile Wohnung 1.01. Helfen würde der Name: «Kevin Fischer: Vertragsende 28.02.2021, Schlussabrechnung fällig».
- **P-3:** dieselben Stellen und Vertrag Kevin Fischer. Helfen würde dasselbe Wort wie im Vertrag: «Vertragsende» statt «Auszug».
- **P-4:** Wohnungen → Wohnung 1.01 öffnen. Helfen würde derselbe Hinweis mit «Schlussabrechnung erstellen» bei Kevin Fischers Vertrag auf der Wohnungsseite.
- **P-5:** Vertrag Kevin Fischer → «Schlussabrechnung erstellen». Helfen würde ein Satz im Assistenten oder schon beim Hinweis: «Die Schlussabrechnung von Kevin Fischer entsteht mit den Abrechnungen 2021 aller Mieter von Musterhaus Zentrum.»
- **P-6:** Vertrag Kevin Fischer. Helfen würde ein kurzer Text im Kasten: was die Schlussabrechnung ist (die letzte Abrechnung bis zum Vertragsende, Periode 2021) und dass die anderen fehlenden Jahre separat abzurechnen sind; oder die beiden Kästen zusammenlegen.

## Nicht geprüft

- Speichern des Vertragsendes und das Erstellen der Abrechnung: laut Auftrag nichts gespeichert.
- Die Seite «Nebenkostenabrechnungen» des Vertrags habe ich nicht geöffnet.
- Die Wohnungsliste bei 200 % habe ich nicht angesehen, nur den Dialog.
