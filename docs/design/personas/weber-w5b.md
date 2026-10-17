# Persona-Review W5b: Dr. Weber, Hinweise zu Kategorien «Von Dwello»

Persona: Dr. Weber, 52, vorsichtig in Rechtsfragen, liest alles. Desktop 1440 × 900, Maus. App: http://localhost:3300 (Demodaten, KI-Ersatz an). Ich habe nichts gespeichert. Den Speichern-Klick habe ich nur mit einer simulierten Serverantwort 500 auf jede Nicht-GET-Anfrage geprüft, also ist nichts in der Datenbank angekommen. Danach habe ich die Sprache wieder auf Deutsch gestellt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f274fd7a-1d44-5308-94cb-2310f5a5f24e/scratchpad/weber-w5b/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Kategorie bearbeiten (Liegenschaftssteuer) | Der Hinweis sagt: «Kosten, die das Gesetz dem Vermieter zuweist, werden nicht umlagefähig, nur weil Sie die Wahl ändern.» Direkt darunter verspricht die Auswahl «Umlagefähig» aber: «Die Kosten fliessen in die Nebenkostenabrechnung.» Ich kann nicht erkennen, ob der Satz rechtlich gemeint ist (der Mieter schuldet sie trotzdem nicht) oder technisch (Dwello rechnet sie trotzdem nicht ab). Wählt man «Umlagefähig», verschwindet ausgerechnet der Gesetzeshinweis zur Kategorie («Steuern auf die Liegenschaft trägt der Vermieter (Art. 256b OR)»). Es kommt keine Warnung und keine Rückfrage. |
| P-2 | Major | Kategorie bearbeiten (Hauswart) | Laut Hinweis lässt sich die Umstellung auf «nicht umlagefähig» nicht rückgängig machen: Die schon erfassten Rechnungen «bleiben nicht umlagefähig». Trotzdem schickt «Änderungen speichern» das Formular ohne Rückfrage ab. Die Seite nennt auch nicht, wie viele Rechnungen betroffen sind (die Liste zeigt 16). Die Folge steht nur in einem Infokasten, den man vor dem Ändern gelesen haben muss. |
| P-3 | Minor | Kategorie bearbeiten | «… fliessen auch ihre schon erfassten Rechnungen nicht mehr in die Nebenkostenabrechnung»: Unklar bleibt, welche Abrechnung gemeint ist. Nur künftige? Bestehende Entwürfe? Auch versendete oder bezahlte? |
| P-4 | Minor | Kategorie bearbeiten (beide) | Der Hinweis ist für beide Kategorien gleich und passt sich dem Zustand nicht an. Bei der Liegenschaftssteuer, die schon nicht umlagefähig ist, steht «Stellen Sie die Kategorie auf nicht umlagefähig … Stellen Sie sie zurück»: Zurück wohin? Beim Hauswart (umlagefähig) betrifft der Satz über Kosten, die das Gesetz dem Vermieter zuweist, die mögliche Änderung gar nicht. |
| P-5 | Minor | Kategorie bearbeiten | «… bleiben diese Rechnungen nicht umlagefähig» setzt voraus, dass eine einzelne Rechnung selbst umlagefähig sein kann. Das ist hier nirgends erklärt, und es steht auch nicht, wo man die Rechnungen wieder umstellen kann. |
| P-6 | Minor | Kategorie bearbeiten | «Dwello hat die Umlagefähigkeit nach dem Gesetz gewählt» klingt wie eine Rechtsauskunft. Das Gesetz ordnet aber nicht Kategorien zu, und der Mieter zahlt nur, was der Mietvertrag nennt; das steht zwar weiter unten, im Hinweis selbst aber nicht. Treffender wäre etwa «nach OR und VMWG voreingestellt». |
| P-7 | Nit | Kategorien (Liste) | «Kategorien «Von Dwello» lassen sich nicht löschen, weil Dwello sie mitliefert.» Das ist eine Begründung im Kreis: Ich erfahre nicht, was beim Löschen kaputtginge (z. B. die KI-Zuordnung). |
| P-8 | Nit | Kategorie bearbeiten (DE) | Der KI-Satz spricht vom «deutschen Namen». Auf Deutsch heisst das Feld aber nur «Name» (FR/IT/EN: «Nom (allemand)», «Nome (tedesco)», «Name (German)»). Wer Deutsch eingestellt hat, verbindet das nicht sicher mit dem Feld. «womöglich» ist zudem vage. |
| P-9 | Nit | Kategorie bearbeiten (FR) | «ne deviennent pas imputables parce que vous modifiez le choix»: Ohne «simplement» fehlt das «nur weil» der deutschen Fassung. Die Aussage wird dadurch unschärfer. |
| P-10 | Nit | Kategorien / Bearbeiten (EN) | Das Englische setzt Schweizer Guillemets («From Dwello», «Heating»). Üblich wären englische Anführungszeichen. |

## Beobachtungen

- Die Badges «Von Dwello» und «Eigene» haben dieselbe graue Form und dasselbe Info-Symbol. Unterscheiden lassen sie sich nur am Text, und das genügt. In der Liste stand eine fremde eigene Kategorie («Helga Fensterreinigung», nicht von mir): Badge «Eigene», Löschen aktiv. Bei allen 21 Kategorien «Von Dwello» ist «Löschen» deaktiviert, nur etwas blasser rot. Die Schaltflächen verweisen per `aria-describedby` auf den Hinweis darüber, der Bildschirmleser liest also den Grund vor (Name z. B. «Kategorie «Heizung» löschen»).
- Übersetzte Badges: FR «De Dwello» / «Personnalisée», IT «Da Dwello» / «Personalizzata», EN «From Dwello» / «Custom». In den geprüften Texten (Hinweis in der Liste, Infokasten, Badges, Löschen-Namen) blieb kein Deutsch stehen. Bewusst deutsch ist das Beispiel «Treppenhausreinigung» beim Feld für den deutschen Namen. Ebenso «Helga Fensterreinigung», denn das sind Benutzerdaten.
- In der englischen Liste steht bei den Kategorie-Erklärungen «Art. 5 VMWG», also die deutsche Abkürzung, beim OR aber «CO». FR schreibt «OBLF», IT «OLAL». Das gehört nicht zu den neuen Texten.
- Feld «Beschreibung»: Die Hilfe sagt «Die Liste zeigt die Beschreibung vordefinierter Kategorien nicht». Die Liste zeigt unter jeder Kategorie aber einen anderen Erklärtext. Beim Hauswart steht in der Beschreibung «Lohn für … ohne Verwaltung, Wohnungsübergaben und Reparaturen», in der Liste «Reinigung, Bedienung der Heizung und kleine Instandhaltung …». Bei der Liegenschaftssteuer lautet die Beschreibung nur «Liegenschaftssteuer». Ich frage mich, welcher Text die KI steuert.
- Hauswart in der Liste: «kleine Instandhaltung» gilt als umlagefähig, «Reparaturen» nicht. Die Grenze ist rechtlich heikel und wird nicht erklärt.
- Die Gesetzesangabe bei der Liegenschaftssteuer stimmt nach meiner Lesart: Art. 256b OR, öffentliche Abgaben trägt der Vermieter.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Skriptläufe: Liste DE, Löschen-Schaltflächen, zwei Bearbeitungsseiten, Umstellen ohne Speichern mit blockierter Anfrage, Sprachmenü, FR/IT/EN, zurück auf DE.

## Ablauf

1. **Einstellungen → Kategorien.** Erwartet: ein klarer Hinweis, was «Von Dwello» bedeutet. Gesehen: zwei Sätze über der Liste (Rechnungen zugeordnet → nicht löschbar; «Von Dwello» → nicht löschbar, «weil Dwello sie mitliefert»), dazu der Satz zu Art. 257a Abs. 2 OR. Jede Zeile trägt die Badges «Von Dwello» und «Umlagefähig» bzw. «Nicht umlagefähig», die Zahl der Rechnungen und ein deaktiviertes «Löschen» (Screenshot `02-kategorien-de.png`, `12-list-de-eigene.png`).
2. **Liegenschaftssteuer bearbeiten.** Erwartet: ein Hinweis, der zur Steuer passt. Gesehen: der blaue Infokasten «Kategorie «Von Dwello»» mit drei Absätzen (nicht löschbar und «nach dem Gesetz gewählt»; Umstellen wirkt auf erfasste Rechnungen und ist nicht umkehrbar; KI und deutscher Name). Unter der Auswahl steht der Satz zu Art. 256b OR (`04-edit-liegenschaftssteuer-de.png`).
3. **Liegenschaftssteuer auf «Umlagefähig» geklickt (nicht gespeichert).** Erwartet: eine Warnung, weil das dem Gesetzeshinweis widerspricht. Gesehen: Der Satz zu Art. 256b OR verschwindet, die Auswahl verspricht «Die Kosten fliessen in die Nebenkostenabrechnung» (`05-liegenschaftssteuer-auf-umlagefaehig.png`). «Änderungen speichern» schickt das Formular sofort ab, ohne Rückfrage. Meine simulierte 500-Antwort hat das Speichern verhindert.
4. **Hauswart bearbeiten.** Erwartet: ein eigener Hinweis. Gesehen: wortgleich derselbe Infokasten wie bei der Steuer. Beim Klick auf «Nicht umlagefähig» verschwindet der Erklärtext der Kategorie. Speichern geht wieder ohne Rückfrage ab, obwohl 16 Rechnungen betroffen wären und der Hinweis die Umstellung als nicht umkehrbar beschreibt.
5. **Sprachmenü** (oben rechts, «Sprache: Deutsch», Optionen Deutsch / Français / Italiano / English). Ich habe FR, IT und EN nacheinander gewählt und jeweils die Liste und beide Bearbeitungsseiten gelesen (`10-list-*.png`, `11-edit-*-*.png`). Inhaltlich sagen die drei Übersetzungen dasselbe wie das Deutsche, also stecken auch dieselben Unklarheiten darin. Dazu kommen die kleinen Abweichungen P-9 und P-10. Danach habe ich auf Deutsch zurückgestellt.

## Verwirrung

- «nach dem Gesetz gewählt» und «werden nicht umlagefähig»: rechtliche oder technische Aussage? (P-1)
- «Stellen Sie sie zurück»: zurück auf welchen Wert? (P-4)
- Dass eine einzelne Rechnung «umlagefähig» sein kann, war mir neu. (P-5)
- «deutscher Name» gegenüber dem Feld «Name». (P-8)
- Beschreibung oder Erklärtext in der Liste: Welcher Text gilt wofür?

## Fehlerrisiken

- Ein Vermieter stellt die Liegenschaftssteuer auf umlagefähig, liest «Die Kosten fliessen in die Nebenkostenabrechnung» und belastet sie dem Mieter. Das ist nach Art. 256b OR unzulässig, und die Rückforderung trifft ihn.
- Ein Vermieter stellt den Hauswart probeweise auf «nicht umlagefähig» und speichert. Zurückstellen holt die 16 Rechnungen laut Hinweis nicht zurück. Er verliert Nebenkosten, ohne es zu bemerken.

## Vorschläge

- **P-1:** Kategorie «Liegenschaftssteuer» → «Umlagefähig» wählen. Hilfreich wäre: den Gesetzeshinweis stehen lassen und eine Warnung zeigen, etwa «Das Gesetz weist diese Kosten dem Vermieter zu (Art. 256b OR). Wenn Sie sie umlagefähig stellen, rechnet Dwello sie ab, der Mieter schuldet sie aber nicht.» Und klar sagen, was Dwello tatsächlich tut.
- **P-2:** Kategorie «Hauswart» → «Nicht umlagefähig» → «Änderungen speichern». Hilfreich wäre eine Bestätigung mit der echten Folge: «16 erfasste Rechnungen fliessen nicht mehr in die Nebenkostenabrechnung. Zurückstellen macht das nicht rückgängig.»
- **P-3:** Im Hinweis nennen, welche Abrechnungen betroffen sind (künftige, Entwürfe, versendete).
- **P-4:** Den Text dem Zustand anpassen: Bei nicht umlagefähigen Kategorien den Weg zu «umlagefähig» beschreiben, bei umlagefähigen den Weg zu «nicht umlagefähig».
- **P-5:** Sagen, wo man die Umlagefähigkeit einer Rechnung wieder ändert, oder auf die Rechnungsliste verlinken.
- **P-6:** «Dwello hat die Umlagefähigkeit nach OR und VMWG voreingestellt. Der Mieter zahlt sie nur, wenn der Mietvertrag sie nennt.»
- **P-7:** Den eigentlichen Grund nennen, z. B. dass die KI und bestehende Abrechnungen sich auf diese Kategorien stützen.
- **P-8:** Auf Deutsch das Feld «Name (Deutsch)» nennen oder im Satz «den Namen» schreiben.
- **P-9:** «… ne deviennent pas imputables simplement parce que vous modifiez le choix.»
- **P-10:** Im Englischen “From Dwello” bzw. 'From Dwello' setzen.

## Nicht geprüft

- Was Dwello nach dem Speichern tatsächlich mit den Rechnungen und Abrechnungen macht (P-1 bis P-3): Ich sollte vordefinierte Kategorien nicht speichern, und ich hatte kein eigenes Gebäude.
- Eine eigene Kategorie selbst anlegen: Ich hatte kein Gebäude zum Speichern. Den Badge «Eigene» habe ich an der fremden Kategorie «Helga Fensterreinigung» gesehen.
- Ob die Bearbeitungsseite einer eigenen Kategorie einen anderen Hinweis zeigt. Die Seite «Kategorie erfassen» zeigt keinen Hinweis «Von Dwello».
- Ob die KI tatsächlich anders vorschlägt, wenn man Name oder Beschreibung ändert: Der KI-Ersatz gibt feste Antworten.
