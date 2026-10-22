# Sven, Slice 489: Dokument beim Mieter hochladen, nur Tastatur und Screenreader (de, fr)

Persona: Sven, 45, blind, Tastatur und Screenreader. Desktop 1440 × 900, beurteilt über den Accessibility-Tree (Name, Beschreibung, Wert, `aria-invalid`, Live-Regionen) des fokussierten Elements.
Mieter: Laura Keller (Alpenblick, Wohnung EG). Gespeichert habe ich dort drei Dokumente: «Ausweiskopie Laura Keller» (de, mit Titel) und zweimal «Mieterausweis-Keller» (de und fr, ohne Titel). Skripte und Screenshots: `<scratchpad>/sven-489/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter-Detail, «Dokument hochladen» | Das Dateifeld heisst für den Screenreader «Datei Datei auswählen, Schaltfläche» (fr: «Fichier Choisir un fichier»). Das Wort «Datei» kommt doppelt, weil das Feld zwei Beschriftungen hat (Feldname «Datei» und Knopftext «Datei auswählen»). Verständlich, aber holprig. |
| P-2 | Minor | Mieter-Detail, nach dem Abschicken einer .docx | Nach dem Abschicken springt der Fokus aufs Dateifeld, und die Fehlermeldung hängt an seiner Beschreibung (gut). Gleichzeitig füllt sich die assertive Live-Region mit dem Seitentitel «Laura Keller - Dwello». Ein Screenreader kann damit das Vorlesen des Feldes samt Fehler unterbrechen: Ich höre dann womöglich zuerst «Laura Keller - Dwello» und denke, die Seite sei einfach neu geladen. |
| P-3 | Nit | Mieter-Detail, Datei gewählt | Wähle ich im Dialog über «Alle Dateien» eine .docx, sagt das Feld nichts, bis ich «Dokument hochladen» drücke. Erst die Antwort vom Server meldet die Ablehnung. Der Dialog filtert zwar auf PDF, JPG und PNG, aber ein Hinweis gleich beim Wählen würde einen Durchgang sparen. |

## Beobachtungen

- Sprachmenü in der Kopfzeile: Nach Enter auf «Sprache: Deutsch» bleibt `aria-expanded=false`, mit Pfeil nach unten komme ich aber trotzdem auf «Deutsch», «Français» … Der Screenreader sagt mir also nicht, dass sich ein Menü geöffnet hat.
- Nach dem Wechsel der Sprache wird die Seite neu geladen, und der Fokus steht nirgends (`document.activeElement` ist leer). Ich beginne wieder oben.
- Haben zwei Dokumente denselben Titel (bei mir zweimal «Mieterausweis-Keller», am selben Tag hochgeladen), heissen auch die Links und Knöpfe gleich: «Datei herunterladen: Mieterausweis-Keller», «Löschen: Mieterausweis-Keller». Ich kann die beiden nur an ihrer Reihenfolge unterscheiden.
- Der Wert des Dateifelds vor der Wahl lautet im Tree «No file chosen». Das ist der eingebaute Text von Chromium (die Testbrowser-Oberfläche ist englisch), nicht der von Dwello. Sichtbar steht daneben korrekt «Keine Datei ausgewählt» bzw. «Aucun fichier choisi».
- Die Anzahl der Tabulatoren bis zum Dateifeld wächst mit jedem Dokument um zwei (24 bis 32 Tabs ab «Daten exportieren» oder ab dem Seitenanfang). Eine Sprungmarke oder Überschriftennavigation hilft: Die Überschrift «Dokument hochladen» (H3) ist vorhanden, mit der Überschriftennavigation des Screenreaders wäre ich schneller dort.

## Aufgabe geschafft: ja

Deutsch und Französisch: Feld gefunden, Ablehnung der .docx gehört, PDF hochgeladen, Erfolgsmeldung gehört.

## Aufwand

Etwa 20 Minuten, 10 Skriptdurchläufe. Pro Upload: rund 26 bis 32 Mal Tab bis zum Dateifeld, Leertaste (oder Enter) öffnet den Dateidialog, Datei wählen, 2 Mal Tab bis «Dokument hochladen» (1 Mal Tab zum Titel), Enter.

## Ablauf

1. **Übersicht → Mieter.** Erwartet: Link «Mieter» in der Hauptnavigation. Gesehen: 8 Mal Tab, «Mieter», Enter. Liste mit 10 Mietern, jeder Name ein Link.
2. **Laura Keller öffnen.** Erwartet: Detailseite mit Dokumentenbereich. Gesehen: H1 «Laura Keller», Einleitung «Kontaktdaten, Miete, Mietverträge und Dokumente dieses Mieters.», weiter unten H2 «Dokumente» mit «Noch keine Dokumente.» und H3 «Dokument hochladen».
3. **Dateifeld finden (vor der Wahl).** Erwartet: Feld mit Name und Hinweis, welche Dateien gehen. Gesehen: nach «Mietvertrag Wohnung EG» kommt direkt das Dateifeld. Angesagt: «Datei Datei auswählen, Schaltfläche», Beschreibung «PDF, JPG oder PNG, höchstens 10 MB. Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.», `aria-invalid=false`. Der Hinweis zu den Formaten ist sauber mit dem Feld verbunden (`aria-describedby`). Nur das doppelte «Datei» stört (P-1).
4. **Dateidialog öffnen.** Leertaste und Enter öffnen beide den Dialog. Er filtert auf `.pdf, .jpg, .jpeg, .png`, eine Datei auf einmal.
5. **.docx wählen.** Erwartet: entweder Ablehnung sofort oder beim Hochladen. Gesehen: Wert des Feldes jetzt «Hausordnung.docx», keine Meldung, keine Live-Region (P-3). Der Dateiname steht auch sichtbar neben dem Knopf.
6. **.docx hochladen.** 2 Mal Tab, «Dokument hochladen», Enter. Gesehen: POST an die Seite, Antwort 200, Fokus springt zurück aufs Dateifeld. Angesagt: «Datei Datei auswählen, Schaltfläche, Hausordnung.docx, ungültig», Beschreibung: Formathinweis und dann «Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.». Sehr gut: sagt, was passiert ist und was ich tun soll. Gleichzeitig schreibt die assertive Live-Region «Laura Keller - Dwello» (P-2). Sichtbar: rote Meldung mit Symbol unter dem Knopf, roter Rahmen um den Knopf (Screenshot 05).
7. **PDF wählen.** Fokus steht schon auf dem Feld, Leertaste, «Mieterausweis-Keller.pdf». Erwartet: Fehler verschwindet. Gesehen: `aria-invalid=false`, die Fehlermeldung ist aus der Beschreibung verschwunden, Wert «Mieterausweis-Keller.pdf».
8. **Titel.** 1 Mal Tab: «Titel (optional), Eingabefeld», Beschreibung «Ohne Titel heisst das Dokument wie die Datei, ohne Endung.». Ich tippe «Ausweiskopie Laura Keller» und drücke Enter im Titelfeld: das schickt das Formular ab.
9. **Nach dem Hochladen.** Erwartet: Bestätigung und das Dokument in der Liste. Gesehen: Statusregion (höflich) «Dokument «Ausweiskopie Laura Keller» hochgeladen». Der Fokus steht wieder auf dem leeren Dateifeld, bereit für das nächste Dokument. In der Liste «Dokumente»: «Ausweiskopie Laura Keller», «Hochgeladen am 22.10.2026», Link «Datei herunterladen: Ausweiskopie Laura Keller», Knopf «Löschen: Ausweiskopie Laura Keller». Der Seitentitel wurde diesmal nicht noch einmal angesagt.
10. **Ohne Datei abschicken** (zusätzlich). Fokus aufs Dateifeld, ungültig, Beschreibung endet mit «Wählen Sie eine Datei aus.». Gut.
11. **Sprache wechseln.** Tab auf «Sprache: Deutsch», Enter, Pfeil nach unten bis «Français», Enter. Seite neu geladen, `lang=fr`, Fokus weg (Beobachtungen).
12. **Französisch, vorher.** Angesagt: «Fichier Choisir un fichier, bouton», Beschreibung «PDF, JPG ou PNG, 10 Mo au maximum. Supprimez les copies de pièces d’identité et les extraits du registre des poursuites dès que vous n’en avez plus besoin.». Kein deutsches Wort im Formular.
13. **Französisch, .docx.** Nach dem Abschicken: ungültig, Beschreibung mit «Dwello n’accepte que les fichiers PDF, JPG et PNG. Enregistrez le fichier en PDF et choisissez-le à nouveau.». Wieder dazu assertiv «Laura Keller - Dwello» (P-2).
14. **Französisch, PDF ohne Titel.** «Téléverser le document», Enter. Statusregion «Document « Mieterausweis-Keller » téléversé» (französische Anführungszeichen mit Leerschlag). In der Liste «Mieterausweis-Keller», «Téléversé le 22.10.2026», «Télécharger le fichier : Mieterausweis-Keller», «Supprimer : Mieterausweis-Keller». Der Titel kommt wie versprochen aus dem Dateinamen ohne Endung.
15. **Zurück auf Deutsch.** «Langue : Français», Enter, Pfeil bis «Deutsch», Enter. `lang=de`.

## Verwirrung

- «Datei Datei auswählen»: Beim ersten Hören dachte ich an einen Stotterer der Sprachausgabe. Gemeint ist: Feld «Datei», Knopf «Datei auswählen».
- Nach der .docx höre ich womöglich zuerst den Seitentitel. Das klingt wie «Seite neu geladen, nichts passiert», bis die Fehlermeldung kommt.
- Begriffe: «Ausweiskopien» und «Betreibungsauszüge» im Hinweis sind klar. Dass der Hinweis zum Löschen schon am Dateifeld steht, finde ich gut, er ist aber lang. Ich höre ihn bei jedem Fokus aufs Feld komplett.

## Fehlerrisiken

- Zwei Dokumente ohne eigenen Titel aus derselben Datei heissen gleich. Löschen per Screenreader ohne genaues Hinhören kann das falsche treffen (beide gleich benannt, gleiches Datum).
- Wer bei der Ablehnung nur «Laura Keller - Dwello» hört und weitergeht, glaubt, das Dokument sei gespeichert. Die Liste sagt dann aber weiter «Noch keine Dokumente.».

## Vorschläge

- **P-1:** Mieter-Detail öffnen, Tab bis zum Dateifeld. Angesagt wird «Datei Datei auswählen». Hilfreich: Das Feld bekommt nur einen Namen, etwa «Datei auswählen» oder «Datei», und der Knopftext wird nicht als zweite Beschriftung gezählt.
- **P-2:** Mieter-Detail, .docx wählen, «Dokument hochladen». Die assertive Region bekommt «Laura Keller - Dwello», während der Fokus aufs fehlerhafte Feld springt. Hilfreich: Bei einem Formular, das auf derselben Seite mit Fehler zurückkommt, keine Ansage des Seitentitels, nur den Fokus samt Fehler (oder die Fehlermeldung als Alert).
- **P-3:** Im Dateidialog «Alle Dateien» wählen, eine .docx nehmen. Das Feld bleibt stumm. Hilfreich: die Formatprüfung schon beim Wählen, mit derselben Meldung am Feld.

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver): beurteilt habe ich den Accessibility-Tree und die Live-Regionen. Ob P-2 wirklich das Vorlesen unterbricht, hängt vom Screenreader ab.
- Der native Dateidialog des Betriebssystems: Im Testbrowser wird er nicht angezeigt, ich habe die Datei über die Dialog-Schnittstelle gesetzt. Ob der Dialog selbst mit der Tastatur gut bedienbar ist, ist Sache des Systems.
- Eine Datei über 10 MB und eine PDF, die keine ist (falsche Endung): nicht versucht, die Aufgabe nannte die .docx.
- Italienisch und Englisch.
- Meine drei hochgeladenen Dokumente habe ich nicht gelöscht, sie bleiben bei Laura Keller.
