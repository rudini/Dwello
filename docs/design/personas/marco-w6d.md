# Marco, Runde w6d: Rückerstattung unter CHF 5 (#94), Handy

Persona: Marco, 38, Handy 390 × 844, Touch, wenig Zeit. App: Persona-Stack auf :3300 (`dwello_persona`, Demodaten; der Aufrufer hat den Entwurf von Anna Schmidt per SQL auf eine Rückerstattung von CHF 2.50 gesetzt). Gespeichert habe ich nur in «Musterhaus Zentrum»: ich habe die Abrechnung NK-11111111-2025-0002 versendet. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/2c72529f-9bca-535a-94c9-4a75e2c3ffa5/scratchpad/persona-marco/`.

Aufgabe: Die Abrechnung 2025 von Anna Schmidt öffnen und verstehen, was mit den CHF 2.50 passiert (muss ich überweisen? bis wann?). Dann versenden und prüfen, was die Abrechnung danach sagt. Ist der Teil zur Zahlung auf 390 px klar und vollständig? Bleibt für mich noch etwas zu tun?

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung bearbeiten (`/statements/<id>/edit`) | Das Feld «Rückerstattung bis» ist mit 16.11.2026 vorbelegt. Die Hilfe darunter sagt: «Bis zu diesem Datum erstatten Sie dem Mieter den Betrag zurück.» Die Detailseite und das PDF sagen dagegen: «Sie zahlen ihn nicht aus.» Der Link dazu («Frist und Bemerkungen bearbeiten») steht auch nach dem Versenden noch unter «Weitere Aktionen». |
| P-2 | Minor | Abrechnungsdetail nach dem Versenden | Nach «Als versendet markieren» steht der Status sofort auf «Bezahlt», und der Verlauf zeigt «Bezahlt 17.10.2026». Die Meldung sagt aber nur «Abrechnung als versendet markiert». Bezahlt hat niemand etwas, und ein Hinweis, warum die Abrechnung als «Bezahlt» gilt, fehlt. |
| P-3 | Minor | Abrechnungsdetail nach dem Versenden | Oben steht als einzige Aktion neben dem PDF der Button «Zahlung zurücksetzen». Der Dialog dazu sagt, die Abrechnung «gilt dann wieder als nicht bezahlt», mit Status «Versendet». Bei einem Betrag, den niemand zahlt, lädt das zum Fehltipp ein, und unklar bleibt, ob danach eine Frist läuft. |
| P-4 | Nit | Liste der Nebenkostenabrechnungen | In der Liste steht nur «Rückerstattung CHF 2.50 · Entwurf» bzw. später «· Bezahlt», ohne Hinweis «wird nicht ausbezahlt». Auf dem Handy sehe ich zuerst die Liste und erwarte dort eine Überweisung. |

## Beobachtungen

- Der Abschnitt «Zahlung» liegt auf der Detailseite ganz unten, nach der langen Kostenaufstellung (8 Kategorien mit allen Rechnungen). Oben steht kein Saldo. Auf dem Handy musste ich etwa sechs Bildschirmhöhen scrollen, bis ich wusste, was mit den CHF 2.50 passiert.
- Der Satz unter «Zahlung» ist kurz und klar: «Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus.» Er steht in einer eigenen Karte, ist nicht abgeschnitten, und die Seite hat 390 px Breite ohne Scrollen zur Seite (das habe ich vor und nach dem Versenden gemessen). Kein Element ragt über 390 px hinaus.
- Die Zeile «Rückerstattung vor Rundung CHF 2.48 / Rundung auf 5 Rappen + CHF 0.02 / Saldo: Rückerstattung CHF 2.50» bricht auf 390 px sauber um. Dass «Geleistete Akontobeiträge» zweizeilig ist, stört nicht.
- Auf der Seite wechselt die Anrede: «Sie zahlen ihn nicht aus» meint mich als Vermieter, «Ihre Nebenkosten» und «Ihr Mietverhältnis in dieser Periode» meinen die Mieterin. Ich habe kurz gestutzt, wer mit «Sie» gemeint ist.
- Im PDF steht der Hinweis gleich auf Seite 1 unter dem Betrag: «Rückerstattung CHF 2.50 – Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus.» Für Anna ist das klar. Am Ende der Seite 2 steht nur «Rückerstattung 2.50», ohne den Hinweis, das genügt aber.
- Der Dialog «Abrechnung als versendet markieren» ist auf dem Handy gut lesbar und sagt klar, dass Dwello nicht selbst verschickt. Zum Betrag sagt er nichts, das brauche ich dort auch nicht.
- Auf der Übersicht erscheint Anna nach dem Versenden nicht unter «Fristen». Das passt dazu, dass ich nichts zahlen muss.

## Aufgabe geschafft: ja

Ich habe verstanden, dass ich nichts überweise, habe die Abrechnung versendet, und sie gilt als erledigt. Bei «bis wann?» wurde ich unsicher: Die Bearbeiten-Seite nennt trotzdem eine Frist zur Rückerstattung (P-1).

## Aufwand

Etwa 4 Minuten, 7 Taps: Übersicht → «Entwürfe ansehen» → Anna Schmidt → nach unten scrollen bis «Zahlung» → «PDF erstellen» → «Als versendet markieren» → im Dialog «Als versendet markieren». Danach habe ich zur Kontrolle «Frist und Bemerkungen bearbeiten» und den Dialog «Zahlung zurücksetzen» geöffnet, ohne zu speichern.

## Ablauf

1. **Übersicht.** Erwartet: einen Hinweis auf offene Abrechnungen. Gesehen: «Abrechnungen prüfen und versenden – 7 Nebenkostenabrechnungen sind noch im Entwurf» mit «Entwürfe ansehen». Passt.
2. **Entwürfe.** Erwartet: Anna Schmidt finden. Gesehen: Eine Zeile «Anna Schmidt NK-11111111-2025-0002 … Rückerstattung CHF 2.50 · Entwurf · PDF noch nicht erstellt». Ich dachte sofort: «Gut, dann muss ich ihr CHF 2.50 überweisen.» Die Liste sagt nichts anderes (P-4).
3. **Abrechnungsdetail, oben** (Screenshot `03b-first-screen.png`). Erwartet: oben den Saldo und was ich tun muss. Gesehen: Titel, Mieterin, Periode, «PDF erstellen», «Als versendet markieren», «Status: Entwurf», dann die Kostenaufstellung. Ein Betrag steht oben nicht.
4. **Nach unten gescrollt** (Screenshot `04-payment.png`). Gesehen: «Saldo: Rückerstattung CHF 2.50» und darunter die Karte «Zahlung»: «Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus.» Danach «Abrechnungsdatum 17.10.2026». Klar: Ich überweise nichts. Eine Frist steht hier keine, was dazu passt. Nichts ist abgeschnitten, kein Scrollen zur Seite.
5. **«PDF erstellen».** Erwartet: ein PDF für Anna. Gesehen: Der Button wird zu «PDF herunterladen». Im PDF steht auf Seite 1 der Hinweis «Wir zahlen ihn nicht aus.» Gut, dann fragt Anna nicht nach.
6. **«Als versendet markieren»** (Screenshot `07-after-tap-send.png`). Gesehen: Ein Dialog sagt, dass Dwello nicht verschickt und dass ich das PDF am selben Tag zustellen soll, mit Empfängerin und E-Mail. Die Buttons sind gross genug, alles passt auf den Bildschirm.
7. **Bestätigt** (Screenshot `08-sent-top.png`). Erwartet: Status «Versendet». Gesehen: Meldung «Abrechnung als versendet markiert», aber Status «Bezahlt», und oben der Button «Zahlung zurücksetzen». Ich habe kurz gezweifelt: Hat Anna etwa bezahlt? Im Verlauf steht «Versendet 17.10.2026» und «Bezahlt 17.10.2026» (P-2, P-3). Die Karte «Zahlung» sagt weiterhin «Sie zahlen ihn nicht aus.» (Screenshot `09-payment.png`).
8. **Kontrolle «Bleibt etwas zu tun?».** Unter «Weitere Aktionen» steht «Frist und Bemerkungen bearbeiten». Ich habe es geöffnet, weil ich wissen wollte, ob doch eine Frist läuft. Gesehen: «Rückerstattung bis 16.11.2026. Bis zu diesem Datum erstatten Sie dem Mieter den Betrag zurück.» Jetzt weiss ich nicht mehr, ob ich bis zum 16.11. die CHF 2.50 überweisen muss (P-1). Ich habe nicht gespeichert.
9. **Liste «Bezahlt» und Übersicht.** In der Liste steht Anna unter «Bezahlt» mit «Rückerstattung CHF 2.50». Auf der Übersicht steht sie nicht unter «Fristen». Für Dwello ist die Abrechnung also erledigt.

## Verwirrung

- **«Bezahlt»** für eine Abrechnung, bei der kein Geld fliesst. Ich würde «Erledigt» oder einen Satz wie «Kein Betrag offen, darum gilt die Abrechnung als bezahlt» verstehen.
- **«Rückerstattung bis»** mit Datum auf der Bearbeiten-Seite, obwohl nichts zurückerstattet wird.
- **«Sie»** auf der Detailseite: einmal ich (Vermieter), einmal die Mieterin («Ihre Nebenkosten», «Ihr Mietverhältnis»).
- **«Zahlung zurücksetzen»**: Was für eine Zahlung? Ich habe keine erfasst.

## Fehlerrisiken

- Wer die Bearbeiten-Seite öffnet (P-1), überweist die CHF 2.50 vielleicht doch bis zum 16.11. Dann stimmen PDF und Zahlung nicht mehr überein, und die Mieterin hat Geld bekommen, das laut PDF nicht kommt.
- Ein Fehltipp auf «Zahlung zurücksetzen» (P-3) setzt die Abrechnung auf «Versendet». Ob sie dann mit der Frist 16.11.2026 unter «Fristen» oder später als «Überfällig» erscheint, habe ich nicht ausprobiert.
- Wer nur die Liste anschaut (P-4), plant eine Überweisung ein.

## Vorschläge

- **P-1:** Abrechnungsdetail von Anna Schmidt (NK-11111111-2025-0002, Saldo Rückerstattung CHF 2.50) → «Frist und Bemerkungen bearbeiten». Das Feld «Rückerstattung bis» erscheint mit 16.11.2026 und der Hilfe «Bis zu diesem Datum erstatten Sie dem Mieter den Betrag zurück». Was helfen würde: Bei einem Saldo unter CHF 5 das Fristfeld weglassen und stattdessen denselben Satz wie unter «Zahlung» zeigen («Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus.»). Nur die Bemerkungen bleiben bearbeitbar; der Link hiesse dann z. B. «Bemerkungen bearbeiten».
- **P-2:** Entwurf mit Saldo unter CHF 5 → «Als versendet markieren» → bestätigen. Der Status wird «Bezahlt», die Meldung sagt nur «versendet». Was helfen würde: Eine Meldung wie «Abrechnung als versendet markiert. Es ist kein Betrag zu zahlen, die Abrechnung ist erledigt.» und unter dem Status ein kurzer Satz, warum sie als bezahlt gilt.
- **P-3:** Nach dem Versenden derselben Abrechnung steht oben «Zahlung zurücksetzen». Was helfen würde: Den Button bei einem Saldo, der nicht gezahlt wird, weglassen oder unter «Weitere Aktionen» verschieben.
- **P-4:** `/statements?status=draft` bzw. `?status=paid`, Zeile Anna Schmidt: «Rückerstattung CHF 2.50». Was helfen würde: Den Zusatz «wird nicht ausbezahlt» in der Zeile, oder oben auf der Detailseite den Saldo samt Satz zur Zahlung, damit man auf dem Handy nicht bis ganz nach unten scrollen muss.

## Nicht geprüft

- Was nach «Zahlung zurücksetzen» passiert (Status, Frist, «Überfällig»): Ich habe den Dialog nur geöffnet und abgebrochen, weil ich die versendete Abrechnung nicht verändern wollte.
- Ob sich die Frist auf der Bearbeiten-Seite speichern lässt und ob sie danach irgendwo als Frist erscheint: nicht gespeichert.
- Eine Nachzahlung unter CHF 5 (Mieter zahlt nicht nach), etwa bei Thomas Weber (CHF 3.40): Die Abrechnung liegt in «Seepark Residenz», dort darf ich nichts ändern.
- Andere Sprachen und der Dunkelmodus: nicht Teil der Aufgabe.
