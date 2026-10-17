# Persona-Review: Marco, Runde w2e – versendete Abrechnung berichtigen (Handy)

Persona: Marco, 38, berufstätig, fast nur am Smartphone, wenig Zeit. Gerät: 390 × 844, Touch, Zoom 100 %.
Aufgabe: Bei der versendeten Abrechnung 2025 von Hans Müller (Musterhaus Zentrum) herausfinden, ob und wie man sie korrigiert und was dabei passiert; Bestätigung öffnen, lesen, abbrechen. Nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/marco-w2e/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung NK-11111111-2025-0001 (Detail) | «Abrechnung berichtigen» steht ganz unten unter «Weitere Aktionen», nach rund 7 Bildschirmhöhen Kostenaufstellung. Oben beim Status «Versendet» deutet nichts darauf hin, dass man korrigieren kann. |
| P-2 | Minor | Dialog «Abrechnung berichtigen» | Der Knopf heisst «Abrechnung berichtigen», die Bestätigung «Abrechnung ersetzen». Der Text sagt «wird ersetzt», die berichtigte Abrechnung erstelle ich aber erst «danach». Mir ist nicht klar, wodurch sie ersetzt wird, solange es noch keine neue gibt. |
| P-3 | Minor | Dialog «Abrechnung berichtigen» | Unklar, was mit Geld passiert: Die Zahlungsfrist läuft noch (28.10.2026). Was gilt, wenn Hans Müller nach dem Ersetzen die alte Nachzahlung CHF 215.80 überweist? Ob die neue Abrechnung das verrechnet, steht nirgends. |
| P-4 | Minor | Dialog «Abrechnung berichtigen», kürzerer Bildschirm | Bei 390 × 664 (Handy mit eingeblendeten Browserleisten) öffnet der Dialog schon nach unten gescrollt, weil der Fokus auf «Abbrechen» liegt. Titel und erste Zeile («Die Abrechnung … wird ersetzt») sind zuerst nicht zu sehen. |
| P-5 | Nit | Dialog «Abrechnung berichtigen» | «Senden Sie sie dem Mieter.»: Ich weiss nicht, ob Dwello die Abrechnung per E-Mail schickt oder ob ich das PDF selbst verschicken muss. |

## Beobachtungen

- Bei 390 × 844 passt der Dialog ganz auf den Bildschirm (16 px Rand oben und unten). Schrift 16 px, gut lesbar. Beide Knöpfe sind 48 px hoch und volle Breite. Keine Seitwärts-Scrollbalken (scrollWidth 390) auf Liste, Detail und Dialog.
- «Abrechnung ersetzen» ist rot und steht über «Abbrechen». Der Fokus liegt beim Öffnen auf «Abbrechen» und geht nach dem Abbrechen zurück auf «Abrechnung berichtigen». Gut.
- Tippen auf den abgedunkelten Hintergrund schliesst den Dialog nicht, nur «Abbrechen» tut das. Für eine Aktion, die sich nicht rückgängig machen lässt, finde ich das in Ordnung.
- Nach dem Abbrechen und Neuladen steht weiterhin «Status: Versendet». Der Browser hat während des ganzen Ablaufs keine Anfrage ausser GET gesendet.
- Der Satz «Das lässt sich nicht rückgängig machen.» ist fett, das sehe ich sofort. Den Absatz zur Verjährung (Art. 128 Ziff. 1 OR) habe ich als Laie nur überflogen. Er ist korrekt vorsichtig formuliert, hilft mir bei der Entscheidung aber kaum.
- Auf der Listenseite bricht der Titel «Nebenkostenabrechnungen» ohne Trennstrich mitten im Wort um («Nebenkostenabrechnun / gen»).
- Auf der Detailseite steht unter «Mieter und Wohnung» «Ihr Mietverhältnis in dieser Periode». Als Vermieter fühle ich mich da falsch angesprochen.
- Im «Verlauf» steht «Erstellt 17.10.2026», aber «Versendet 28.09.2026», also versendet vor dem Erstellen. Das kommt vermutlich aus den Demodaten.

## Aufgabe geschafft: ja

Ich habe herausgefunden, dass die Korrektur über «Abrechnung berichtigen» läuft und was sie bewirkt. Ich habe die Bestätigung gelesen und abgebrochen. Was danach mit einer Zahlung geschieht, bleibt offen (P-3).

## Aufwand

Etwa 3 Minuten, 5 Schritte: Übersicht → «1 Versendet» → Hans Müller → ganz nach unten scrollen (ca. 7 Bildschirmhöhen) → «Abrechnung berichtigen» → lesen → «Abbrechen».

## Ablauf

1. **Übersicht.** Erwartet: ein Weg zu den versendeten Abrechnungen. Gesehen: Kachel «Nebenkostenabrechnungen» mit «1 Versendet» und unter «Fristen» «28.10.2026 Zahlungsfrist · Hans Müller». Beides hätte funktioniert.
2. **«1 Versendet» angetippt.** Erwartet: die Abrechnung von Hans Müller. Gesehen: gefilterte Liste mit genau einer Karte «Hans Müller, NK-11111111-2025-0001, Musterhaus Zentrum, Wohnung 1.01, Nachzahlung CHF 215.80, Versendet» mit den Knöpfen «PDF» und «Als bezahlt markieren». Kein Hinweis auf eine Korrektur.
3. **Namen angetippt.** Erwartet: oben eine Aktion «Korrigieren» oder «Bearbeiten». Gesehen: oben nur «PDF herunterladen», «Als bezahlt markieren» und «Status: Versendet», danach eine sehr lange Kostenaufstellung (8 Kategorien mit Rechnungen) (P-1).
4. **Nach unten gescrollt.** Nach Zahlung und Mieter kommt «Weitere Aktionen» mit «Frist und Bemerkungen bearbeiten» und «Abrechnung berichtigen». Das ist der gesuchte Knopf, aber erst nach langem Scrollen.
5. **«Abrechnung berichtigen» angetippt.** Erwartet: ein Formular oder eine Warnung. Gesehen: Dialog «Abrechnung berichtigen» mit vier Absätzen. Die alte Abrechnung wird ersetzt, bleibt unverändert erhalten, wird nicht mehr gemahnt und lässt sich nicht mehr als bezahlt markieren. Hat der Mieter schon bezahlt, soll ich sie zuerst als bezahlt markieren. Danach kann ich Vertragsdaten und Rechnungen korrigieren, die berichtigte Abrechnung erstellen und sie dem Mieter senden. Dazu ein Hinweis zur Verjährung (fünf Jahre, Art. 128 Ziff. 1 OR) und fett «Das lässt sich nicht rückgängig machen.». Knöpfe: «Abrechnung ersetzen» (rot) und «Abbrechen». Den Text verstehe ich weitgehend, offen bleiben P-2, P-3 und P-5.
6. **«Abbrechen» angetippt.** Erwartet: Dialog zu, nichts geändert. Gesehen: genau das. Der Status bleibt «Versendet», auch nach dem Neuladen.
7. **Zusatz: kürzerer Bildschirm (390 × 664).** Der Dialog wird scrollbar und bleibt bedienbar, öffnet aber schon nach unten gescrollt (P-4).

## Verwirrung

- «berichtigen» und «ersetzen» sind zwei Wörter für dieselbe Aktion (P-2).
- «wird ersetzt»: Wodurch, wenn die neue Abrechnung noch nicht existiert?
- «wird nicht mehr gemahnt»: Mahnt Dwello überhaupt selbst? Das wusste ich bisher nicht.
- «Senden Sie sie dem Mieter»: per Dwello oder selbst (P-5)?
- «Vertragsdaten und Rechnungen korrigieren»: Wo genau? Der Dialog sagt nicht, wohin ich danach komme.

## Fehlerrisiken

- Ich ersetze die Abrechnung, und Hans Müller zahlt am selben Tag die alte Nachzahlung. Die alte lässt sich dann nicht mehr als bezahlt markieren, und ich verliere den Überblick über sein Geld (P-3).
- Unterwegs übersehe ich den Satz «Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt», weil er mitten im ersten Absatz steht, und ersetze eine schon bezahlte Abrechnung.
- Auf einem kleinen Handy sehe ich den Titel des Dialogs nicht und tippe den roten Knopf, ohne den Anfang gelesen zu haben (P-4).

## Vorschläge

- **P-1:** Übersicht → «1 Versendet» → «Hans Müller» antippen, dann nach unten scrollen bis «Weitere Aktionen». Hilfreich wäre ein kurzer Hinweis oder Link neben «Status: Versendet», etwa «Fehler entdeckt? Abrechnung berichtigen», der zum Abschnitt springt. Oder «Weitere Aktionen» weiter oben auf dem Handy.
- **P-2:** Dialog öffnen wie oben. Hilfreich wären ein Wort für Knopf, Titel und Bestätigung, oder ein Satz, der erklärt: «Die bisherige Abrechnung wird als ersetzt markiert. Die berichtigte erstellen Sie anschliessend.»
- **P-3:** Dialog öffnen. Hilfreich wäre ein Satz dazu, was mit einer Zahlung auf die alte Abrechnung geschieht und ob die neue Abrechnung sie berücksichtigt.
- **P-4:** Detailseite mit Bildschirm 390 × 664 öffnen, «Abrechnung berichtigen» antippen: Titel und erste Zeile sind abgeschnitten. Hilfreich wäre, wenn der Dialog oben beginnt, auch wenn der Fokus auf «Abbrechen» liegt, oder die Knöpfe unten fest stehen und der Text oben beginnt.
- **P-5:** Dialog öffnen, zweiter Absatz. Hilfreich wäre: «Laden Sie das PDF herunter und senden Sie es dem Mieter», falls Dwello nicht selbst verschickt.

## Nicht geprüft

- «Abrechnung ersetzen» bestätigen und die Schritte danach (Korrektur, neue Abrechnung erstellen): Die Aufgabe verlangte nur Lesen und Abbrechen.
- Fehlerzustände (z. B. ein fehlschlagender Server beim Ersetzen): keine fehlschlagende Anfrage vorgegeben.
- Dunkelmodus, andere Sprachen und vergrösserte Schrift: nicht Teil der Aufgabe.
- Echte Browserleisten eines Handys: nur durch eine kleinere Bildschirmhöhe (664 px) nachgestellt.
