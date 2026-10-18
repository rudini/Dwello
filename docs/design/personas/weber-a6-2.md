# Dr. Weber – Runde a6-2: Abgelaufener befristeter Mietvertrag (Jonas Graf, Seepark Residenz), Nachprüfung

Desktop 1440 × 900, Maus. Persona-App auf http://localhost:3300 mit frischen Daten. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/weber-a6-2/`. Gespeichert habe ich nur in Seepark Residenz, und nur beim Mietvertrag Jonas Graf und seiner Abrechnung 2025.

Geprüft habe ich, was sich seit meinem Bericht `weber-a6.md` geändert hat: den neuen Satz zu den Nebenkosten, die Rückfrage bei «Mieter ist ausgezogen» und die Schaltfläche «Unbefristet weiterführen», wenn schon ein Entwurf 2025 besteht.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag Jonas Graf: neuer Satz und Rückfrage «Auszug von Jonas Graf bestätigen» | Beide Texte setzen voraus, dass Jonas Graf genau am 30.06.2025 ausgezogen ist («gilt die Wohnung seither als leer, und die Nebenkosten dieser Zeit tragen Sie»). Ist er später ausgezogen, etwa Ende August, ohne dass ich einverstanden war, trage ich nach Dwello auch diese zwei Monate. Ein Auszugsdatum kann ich nicht angeben, und kein Satz weist darauf hin. |
| P-2 | Nit | Rückfrage «Auszug von Jonas Graf bestätigen» | Die Rückfrage nennt die Folge richtig. Sie sagt aber nicht, wie man einen Irrtum später korrigiert (über «Bearbeiten» → «Vertragsdauer»). Diesen Teil meines früheren Vorschlags zu P-1 hat Dwello nicht übernommen. |
| P-3 | Nit | Mietvertrag nach «Unbefristet weiterführen», roter Kasten | Die Überschrift «Der Mietvertrag wurde nicht gespeichert» klingt wie ein Fehler, dabei habe ich nur eine Frage beantwortet. «Mit den bisherigen Vertragsdaten berechnet» ist richtig, aber abstrakt. Konkret wäre: «Der Entwurf rechnet nur bis 30.06.2025 mit Jonas Graf ab.» |

Die früheren Befunde P-1 (sofortiges Speichern ohne Rückfrage), P-2 (keine Aussage zu den Nebenkosten auf dem Mietvertrag) und P-3 (Meldung verschweigt das Löschen) sind behoben.

## Beobachtungen

- **Neuer Satz auf dem Mietvertrag:** «Läuft der Mietvertrag weiter, rechnet Dwello die Nebenkosten nach dem 30.06.2025 mit Jonas Graf ab. Ist Jonas Graf ausgezogen, gilt die Wohnung seither als leer, und die Nebenkosten dieser Zeit tragen Sie.» Der Satz ist kurz und stimmt in beiden Fällen. Er steht vor den Schaltflächen, also bevor ich etwas entscheide. Das hatte ich verlangt. Dass Dwello die Zahlen wirklich so rechnet, bestätigen die Abrechnungen (siehe Ablauf 4 und 7).
- **Rückfrage bei «Mieter ist ausgezogen»:** Ein echter Dialog mit Überschrift «Auszug von Jonas Graf bestätigen». Er nennt das Datum, die Folge für die Nebenkosten und dass die Frage danach verschwindet, dazu «Abbrechen» und «Auszug bestätigen». Nach «Abbrechen» ist nichts gespeichert: Auch nach einem Neuladen sind beide Schaltflächen und der Kasten noch da. Die Rückfrage ist korrekt, und die Folge steht vor dem Speichern.
- **«Unbefristet weiterführen» mit bestehendem Entwurf:** Dwello speichert nicht still. Es sagt, dass der Entwurf NK-22222222-2025-0005 mit den alten Daten berechnet wurde. Es verlinkt ihn, nennt vor dem Klick die Folge («Der Entwurf … wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.») und bietet die rote Schaltfläche «Entwurf löschen und unbefristet weiterführen» an. Die Folge steht also vor dem Löschen. Eine zusätzliche Rückfrage gibt es nicht. Weil Schaltfläche und Satz die Folge beim Namen nennen, halte ich das für vertretbar.
- **Meldung nach dem Löschen:** «Entwurf NK-22222222-2025-0005 gelöscht. Der Mietvertrag von Jonas Graf läuft unbefristet weiter. Erstellen Sie jetzt die Nebenkostenabrechnung neu.» Sie ist vollständig und nennt den nächsten Schritt. Der Assistent ist dabei schon bei Schritt 3 für Seepark Residenz 2025 geöffnet.
- Die Übersicht sagt in der Aufgabe «Befristeten Mietvertrag prüfen» weiterhin nichts zu den Nebenkosten. Auf dem Mietvertrag, wo ich entscheide, genügt mir das. Die Übersicht ist hier nicht geändert worden.
- Die Karte «Vertragsdauer» zeigt weiterhin «Beendet», während Dwello noch fragt (früher P-4, nicht geändert).
- Auch diesmal hat die neue Abrechnung die Nummer 0006, weil der gelöschte Entwurf 0005 war. Für Entwürfe ist das unkritisch.
- «Mietstage» statt «Miettage» steht weiterhin im Hinweis und in der Abrechnungsliste.
- Mit dem Vorschlag, beide Antworten auf dem Mietvertrag mit ihrer Folge zu erklären, hätte ich schon vor dem Klick gern gewusst, dass mein Entwurf 2025 gelöscht werden muss. Die Sperre kommt erst nach dem Klick. Weil vorher nichts gespeichert wird, ist das kein Befund.
- In der Übersicht ist am Ende auch die Aufgabe zu Lea Huber (Musterhaus Zentrum) verschwunden. Dort habe ich nichts geändert, vermutlich war es eine andere Persona. Das ist kein Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 14 Schritte: Übersicht, Mietvertrag, Rückfrage öffnen, lesen und abbrechen, Neuladen zur Kontrolle, «2025 abrechnen», Assistent (Weiter, ankreuzen, Weiter, Entwürfe erstellen), zurück zum Vertrag, «Unbefristet weiterführen», «Entwurf löschen und unbefristet weiterführen», Assistent erneut (4 Klicks), Kontrolle von Vertrag, Abrechnungsliste und Übersicht.

## Ablauf

1. **Übersicht → «Mietvertrag öffnen» (Jonas Graf).** Erwartet: derselbe Hinweis wie letztes Mal. Gesehen: unverändert, «Der befristete Mietvertrag von Jonas Graf ist am 30.06.2025 abgelaufen …», ohne Satz zu den Nebenkosten.
2. **Mietvertrag.** Erwartet: die Folge jeder Antwort vor den Schaltflächen. Gesehen: der neue Absatz «Läuft der Mietvertrag weiter, rechnet Dwello die Nebenkosten nach dem 30.06.2025 mit Jonas Graf ab. Ist Jonas Graf ausgezogen, gilt die Wohnung seither als leer, und die Nebenkosten dieser Zeit tragen Sie.» Darunter der Satz zur schriftlichen Rückgabe, dann die beiden Schaltflächen und der gelbe Hinweis «2 Abrechnungen fehlen». Das ist inhaltlich richtig, mit der Einschränkung zum Auszugsdatum (P-1).
3. **«Mieter ist ausgezogen».** Erwartet: eine Rückfrage. Gesehen: der Dialog «Auszug von Jonas Graf bestätigen»: «Der Mietvertrag endete am 30.06.2025. Seither gilt die Wohnung als leer, und die Nebenkosten dieser Zeit tragen Sie. Dwello fragt danach nicht mehr, ob der Mietvertrag weiterläuft.» Der Screenshot zeigt einen weissen Dialog über der abgedunkelten Seite mit «Abbrechen» (umrandet) und «Auszug bestätigen» (dunkel gefüllt). «Abbrechen» geklickt: Der Dialog schliesst, die Seite ist unverändert, auch nach dem Neuladen.
4. **«2025 abrechnen».** Der Assistent öffnet bei Schritt 3, Seepark Residenz, 01.01.–31.12.2025. Vorschau: 1 Abrechnung, Jonas Graf, Kosten CHF 1’343.45, Nachzahlung CHF 143.45. Den Hinweis «Es gibt schon Abrechnungen» (4 in Seepark Residenz) bestätigt mit «Die Abrechnungen trotzdem erstellen», dann «Entwürfe erstellen». Ergebnis: «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Die Zahlen sind dieselben wie in Runde a6 (Abrechnung bis 30.06.2025).
5. **Zurück zum Mietvertrag.** Gesehen: Der Kasten fragt weiter, und nur noch «Abrechnung 2024 fehlt» steht da. Ein Hinweis auf den neuen Entwurf 2025 fehlt, obwohl er an der Antwort hängt (siehe Beobachtungen).
6. **«Unbefristet weiterführen».** Erwartet: Dwello sagt, dass der Entwurf 2025 dann nicht mehr stimmt, und bietet einen Weg an. Gesehen: ein roter Kasten direkt unter den Schaltflächen, «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-22222222-2025-0005 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.» Dazu der Link auf den Entwurf, der Satz «Der Entwurf NK-22222222-2025-0005 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und die rote Schaltfläche «Entwurf löschen und unbefristet weiterführen». Das ist klar, die Folge steht vor der Tat. Nur die Überschrift wirkt wie ein Fehler (P-3).
7. **«Entwurf löschen und unbefristet weiterführen».** Erwartet: eine Meldung, die Löschen und Speichern nennt, und den nächsten Schritt. Gesehen: Der Assistent öffnet bei Schritt 3 (Seepark Residenz, 2025), dazu die Meldung «Entwurf NK-22222222-2025-0005 gelöscht. Der Mietvertrag von Jonas Graf läuft unbefristet weiter. Erstellen Sie jetzt die Nebenkostenabrechnung neu.» Weiter → Vorschau: Jonas Graf, Kosten CHF 2’584.75, Nachzahlung CHF 184.75. Ankreuzen, «Entwürfe erstellen»: «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
8. **Kontrolle.** Mietvertrag: Der Kasten ist weg, «Laufend», Vertragsende «Unbefristet», neu die Schaltfläche «Beenden», weiterhin «Abrechnung 2024 fehlt». Abrechnungen des Vertrags: nur NK-22222222-2025-0006, 01.01.2025 – 31.12.2025, 365 Mietstage, Nachzahlung CHF 184.75, Entwurf. Übersicht: Seepark Residenz fehlt bei «Noch nicht abgerechnet», 8 Entwürfe. Nachgerechnet: Akonto 12 × 200 = 2’400, Kosten 2’584.75, Nachzahlung 184.75. Das stimmt. Der neue Satz aus Schritt 2 trifft damit zu: Jetzt zahlt Jonas Graf auch ab dem 01.07.2025.

## Verwirrung

- «seither» in Satz und Rückfrage: Gemeint ist der 30.06.2025. Für einen späteren Auszug gibt es kein Feld und keinen Hinweis (P-1).
- «Der Mietvertrag wurde nicht gespeichert», obwohl ich den Vertrag nicht bearbeitet, sondern eine Frage beantwortet habe (P-3).
- «Mietstage» (unverändert).

## Fehlerrisiken

- Ein Mieter zieht nach dem Ablauf, aber später als am Vertragsende aus. Der Vermieter wählt «Mieter ist ausgezogen» und trägt nach Dwello die Nebenkosten der Monate, in denen der Mieter noch wohnte. Den Weg über «Bearbeiten» → anderes Vertragsende kennt er nicht (P-1, P-2).
- Wer den Assistenten nach «Entwurf löschen und unbefristet weiterführen» schliesst, hat für 2025 bei diesem Mietvertrag keine Abrechnung. Die Meldung sagt aber deutlich «Erstellen Sie jetzt die Nebenkostenabrechnung neu». Das Risiko ist damit klein.

## Vorschläge

- **P-1:** Mietvertrag Jonas Graf öffnen, den Absatz über den Schaltflächen lesen, «Mieter ist ausgezogen» klicken und die Rückfrage lesen. Hilfreich wäre ein Satz in der Rückfrage, etwa: «Ist Jonas Graf später ausgezogen, wählen Sie Abbrechen und tragen Sie unter Bearbeiten das tatsächliche Vertragsende ein.» Ob die Zeit zwischen Ablauf und späterem Auszug dem Mieter belastet werden darf (Entschädigung), sollte fachlich geprüft werden.
- **P-2:** Gleiche Rückfrage: ein Satz, wie man einen Irrtum korrigiert («Ein Irrtum lässt sich unter Bearbeiten → Vertragsdauer korrigieren.»).
- **P-3:** Mietvertrag Jonas Graf mit Entwurf 2025 (bis 30.06.2025), «Unbefristet weiterführen» klicken. Besser wäre eine Überschrift wie «Zuerst den Entwurf 2025 löschen» und der Satz «Der Entwurf NK-… rechnet nur bis 30.06.2025 mit Jonas Graf ab.»

## Nicht geprüft

- «Auszug bestätigen» habe ich bewusst nicht geklickt, weil die Aufgabe den unbefristeten Weg verlangte. Was die Rückfrage bei einem bestehenden Entwurf 2025 sagt oder ob sie dann auch sperrt, bleibt offen.
- Den Weg «Mieter ist ausgezogen» mit einer schon versendeten Abrechnung habe ich nicht geprüft, weil es keine solche Abrechnung für Jonas Graf gab.
- Abrechnung 2024 und das PDF des neuen Entwurfs: nicht Teil der Aufgabe.
- Den zweiten abgelaufenen Mietvertrag (Lea Huber, Musterhaus Zentrum) habe ich nicht angefasst, wie verlangt.
