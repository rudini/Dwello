# Helga – Nutzungsbedingungen und Datenschutz lesen (Runde 458)

Persona: Helga, 68, vermietet zwei Wohnungen, nutzt Dwello ein paarmal im Jahr. Desktop 1440 × 900 bei 150 % Zoom (Gegenprobe 200 %), Maus. Persona-Stack auf http://localhost:3300 (Demodaten, Betreiber «Muster Hosting AG», Server in «Schweiz», Mailserver «Muster Mail AG» in «Schweiz»). Nur gelesen, nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-458/` (`01-login.png`, `02terms.png`, `03privacy.png`, `z200-terms.png`, `z200-privacy.png`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | /terms, /privacy | Ich soll meinen Mietern vier Abschnitte der Datenschutzerklärung «weitergeben», aber nirgends steht wie (Papier, E-Mail, Link?) und wann (bei Vertragsabschluss?). Es gibt keine Druckfassung nur dieser Abschnitte und keinen Link auf einen einzelnen Abschnitt; die Seite enthält dazwischen vieles, das nur mich betrifft. |
| P-2 | Minor | /privacy, «Verantwortlich» und «Welche Daten Dwello speichert» | Die Abschnitte, die an Mieter gehen sollen, sprechen auch über Dinge, die nur den Vermieter angehen (Anmeldung, Protokoll des Servers, Cookies, «Einstellungen», ungespeicherte Angaben im Browser) und verweisen auf «Anmeldung», einen Abschnitt, den der Mieter nicht bekommt. |
| P-3 | Minor | /terms | Untertitel und Text sagen «der Liegenschaftsverwalter ist verantwortlich», die Anmeldeseite und der Datenschutz sagen «Sie» bzw. «Sie als Vermieter». Ich habe erst beim dritten Lesen verstanden, dass «Liegenschaftsverwalter» ich bin. |
| P-4 | Minor | /terms, /privacy | «Anbieter» heisst einmal die Firma, die Dwello für mich betreibt, einmal Google («Kennung des Kontos beim Anbieter», «Anmeldung mit dem gewählten Anbieter»). «Betreiber», «Anbieter» und «Muster Hosting AG» stehen nebeneinander, ohne dass klar ist, dass es hier dieselbe Firma ist. |
| P-5 | Minor | /terms, «Verantwortung für Abrechnungen» | Der Satz verweist auf «die Datenschutzerklärung», aber dort ist kein Link; die verlinkte Seite heisst dann «Datenschutz», in der Fusszeile ebenfalls «Datenschutz». Ich war kurz unsicher, ob es dieselbe Seite ist. |
| P-6 | Nit | /terms, /privacy | Gesetzesstellen ohne Erklärung: «Art. 19 Abs. 2 DSG», «Art. 25 DSG», «EDÖB». «DSG» wird nirgends ausgeschrieben. |

## Beobachtungen

- Die Anmeldeseite sagt vor dem Knopf klar und kurz, wo ich was finde: «Was Dwello leistet und wofür Sie verantwortlich sind, steht in den Nutzungsbedingungen. Wie Dwello Ihre Daten bearbeitet, steht in der Datenschutzerklärung.» Beide Links funktionieren ohne Anmeldung. Das hat mir gefallen.
- Schrift im Fliesstext 18 px, bei 150 % und 200 % gut lesbar, kein seitliches Scrollen (Seitenbreite 720 = Fensterbreite bei 200 %).
- Die Werte der Installation stehen richtig drin: Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich, betrieb@muster-hosting.ch; «Der Server steht in folgendem Land: Schweiz.»; «über den Mailserver von Muster Mail AG (Schweiz)».
- «Der Server steht in folgendem Land: Schweiz.» klingt wie ein ausgefülltes Formular, nicht wie ein Satz («Der Server steht in der Schweiz.»).
- In «Verantwortlich» steht «Betreiber ist … Sie selbst oder ein Anbieter, der Dwello für Sie betreibt», obwohl im Satz davor schon steht, dass Muster Hosting AG Dwello betreibt. Die Variante «Sie selbst» trifft bei mir nicht zu und verunsichert.
- Die Überschriften haben keine Sprungmarke: `/privacy#verantwortlich` bleibt oben stehen.
- Der Abschnitt «Verantwortlich» ist lang (vier Absätze mit fünf Gesetzesartikeln); was ich wirklich tun muss, steht nicht darin, sondern in den Nutzungsbedingungen.

## Aufgabe geschafft: teilweise

Ich habe alles gefunden und gelesen und kann sagen, wofür ich verantwortlich bin. Wie ich meine Mieter konkret informieren soll, kann ich nur raten.

## Aufwand

Etwa 15 Minuten Lesen, 3 Seiten (Anmeldung, Nutzungsbedingungen, Datenschutz), 2 Klicks. Die Datenschutzseite habe ich zweimal gelesen.

## Ablauf

1. **Anmeldeseite (http://localhost:3300/, leitet auf /login).** Erwartet: irgendwo kleingedruckt «AGB». Gesehen: unter «Mit Google anmelden» ein Satz mit zwei Links «Nutzungsbedingungen» und «Datenschutzerklärung», dazu in der Fusszeile «Datenschutz» und «Nutzungsbedingungen». Screenshot `01-login.png`: Karte mit Haus-Symbol, «Anmelden», Google-Knopf, darunter der Hinweistext. Klar.
2. **Nutzungsbedingungen (/terms).** Erwartet: was ich darf und muss. Gesehen: drei Karten «Zweck», «Verantwortung für Abrechnungen», «Verfügbarkeit», Stand 19. Oktober 2026. Ich lese: Ich bin verantwortlich für die Richtigkeit meiner Angaben und für die verschickten Abrechnungen, ich soll jede Abrechnung vor dem Versand prüfen, und ich muss meine Mieter darüber informieren, was mit ihren Daten passiert. Dazu soll ich ihnen vier Abschnitte der Datenschutzerklärung weitergeben, meinen Namen und wie man mich erreicht dazuschreiben und sagen, dass «Sie» dort den Vermieter meint. Wie und wann ich das tun soll, steht nicht da (P-1). Wer «der Liegenschaftsverwalter» ist, war mir zuerst nicht klar (P-3). Einen Link zur Datenschutzerklärung gibt es im Satz nicht (P-5). Screenshot `02terms.png`.
3. **Datenschutz (/privacy), «Verantwortlich».** Erwartet: wer verantwortlich ist. Gesehen: «Für die Daten, die Sie in Dwello erfassen, auch die Ihrer Mieter, sind Sie als Vermieter verantwortlich.» Gut, das ist klar. Danach Betreiber/Anbieter-Erklärung (P-4), dann Rechte der Mieter: Auskunft kostenlos bei mir, Berichtigung, Herausgabe in einem «gängigen elektronischen Format», Löschung bei «widerrechtlicher Bearbeitung», Anzeige beim EDÖB. Das heisst für mich: Wenn ein Mieter fragt, muss ich ihm sagen, was ich über ihn gespeichert habe. Wie ich das in Dwello herausfinde, steht nicht hier (nicht Teil der Aufgabe, aber die Frage kam mir).
4. **Datenschutz, «Welche Daten Dwello speichert».** Erwartet: eine Liste. Gesehen: ein langer erster Satz mit der Liste (Gebäude, Wohnungen, Mieter mit Kontaktdaten und Korrespondenzadresse, Mietverträge, Rechnungen, hochgeladene Dokumente wie Übergabeprotokolle, Ausweiskopien, Betreibungsauszüge, Abrechnungen, Zahlungen, Mahnungen), dann Belege, Serverland, dann ein langer Absatz über das «Protokoll unter Einstellungen» mit Verwaltungspauschale und Umlagefähigkeit, dann ungespeicherte Angaben im Browser. Ab dem dritten Absatz verstehe ich nichts mehr, und meine Mieter erst recht nicht (P-2).

### In meinen Worten

- **Wofür ich verantwortlich bin:** dass stimmt, was ich eintippe, und dass die Nebenkostenabrechnung stimmt, die ich verschicke (ich soll sie vorher prüfen). Für die Daten meiner Mieter in Dwello bin ich verantwortlich, nicht Dwello. Um den Server, die Datensicherung und die Anmeldung kümmert sich die Muster Hosting AG.
- **Was ich meinen Mietern sagen muss:** dass ich ihre Daten in Dwello speichere, welche Daten das sind, wie lange sie bleiben und wer sie bekommt (z. B. die Muster Mail AG beim E-Mail-Versand der Abrechnung). Dazu meinen Namen und wie man mich erreicht, und dass sie bei mir nachfragen und Fehler korrigieren lassen können.
- **Wie:** Laut Text, indem ich die vier Abschnitte «weitergebe». Ich würde die Seite ausdrucken und die Abschnitte anstreichen, oder sie in einen Brief kopieren. Ob das reicht und wann ich das tun muss (beim neuen Mietvertrag? bei den bestehenden Mietern jetzt?), weiss ich nicht.

## Verwirrung (Wörter, die ich nicht verstehe oder unsicher bin)

- **Liegenschaftsverwalter:** Bin das ich? Ich verwalte doch nichts, ich vermiete.
- **Betreiber / Anbieter / Installation / «diese Dwello-Installation»:** Für mich ist Dwello eine Internetseite. Dass es eine Firma dazwischen gibt, die es «betreibt», verstehe ich erst nach mehrmaligem Lesen.
- **DSG, Art. 19 Abs. 2 DSG, EDÖB:** nie ausgeschrieben.
- **Verteilschlüssel, Umlagefähigkeit / umlagefähig, Verwaltungspauschale:** kenne ich als Wörter nicht.
- **Belegeinsicht:** Dürfen die Mieter meine Rechnungen anschauen?
- **Korrespondenzadresse:** vermutlich die Postadresse, wenn der Mieter woanders wohnt.
- **Protokoll des Servers / Protokoll unter «Einstellungen»:** zwei Protokolle, Unterschied unklar.
- **widerrechtliche Bearbeitung, gängiges elektronisches Format, Websitedaten, Datensicherung, KI kategorisiert:** ungefähr verstanden, aber nicht sicher.

## Fehlerrisiken

- Ich gebe meinen Mietern die ganze Seite oder gar nichts, weil ich die vier Abschnitte nicht sauber herauslösen kann; die Mieter lesen dann über Cookies und Browser-Entwürfe und rufen mich an.
- Ich vergesse, meinen Namen und meine Erreichbarkeit dazuzuschreiben, weil das nur in den Nutzungsbedingungen steht und nicht bei den Abschnitten selbst.
- Ein Mieter liest «Dwello wird von Muster Hosting AG betrieben» und wendet sich mit seiner Auskunftsfrage an die Muster Hosting AG statt an mich.
- Ich lese «der Liegenschaftsverwalter ist verantwortlich» und denke, das betreffe eine Verwaltung, nicht mich.

## Vorschläge

- **P-1:** Schritte: abmelden, http://localhost:3300/terms öffnen, Abschnitt «Verantwortung für Abrechnungen», dritter Absatz; dann /privacy öffnen und versuchen, nur die vier Abschnitte zu drucken oder zu verlinken. Hilfreich: ein Satz, wann und wie (z. B. «beim Abschluss des Mietvertrags, schriftlich oder per E-Mail»), und eine druckbare Fassung nur mit diesen Abschnitten, in der Name und Kontakt des Vermieters schon eingesetzt sind; mindestens Sprungmarken an den Überschriften.
- **P-2:** Schritte: /privacy öffnen, «Verantwortlich» Absatz 2 und «Welche Daten Dwello speichert» Absätze 3 und 4 lesen. Hilfreich: was nur den Vermieter betrifft (Protokoll unter «Einstellungen», Browser-Entwürfe, Anmeldung) aus diesen Abschnitten in eigene Abschnitte verschieben, oder den Verweis «siehe «Anmeldung»» in die Liste der weiterzugebenden Abschnitte aufnehmen.
- **P-3:** Schritte: /terms öffnen, Untertitel und Abschnitt «Verantwortung für Abrechnungen» lesen. Hilfreich: ein sichtbarer Hilfesatz unter dem Untertitel, z. B. «Liegenschaftsverwalter: Sie als Vermieter, der Dwello nutzt.» (den Fachbegriff nicht umbenennen, nur erklären).
- **P-4:** Schritte: /privacy öffnen, «Verantwortlich» Absatz 2 und «Welche Daten Dwello speichert» Absatz 3 («mit dem gewählten Anbieter») vergleichen. Hilfreich: für Google nicht «Anbieter» sagen, sondern «Google» bzw. «Anmeldedienst»; wenn ein Betreiber eingetragen ist, die Variante «Sie selbst» weglassen.
- **P-5:** Schritte: /terms öffnen, im dritten Absatz von «Verantwortung für Abrechnungen» das Wort «Datenschutzerklärung» suchen: kein Link. Hilfreich: das Wort verlinken; Seitentitel und Fusszeilenlink gleich benennen wie auf der Anmeldeseite («Datenschutzerklärung»).
- **P-6:** Schritte: /terms und /privacy nach «DSG» und «EDÖB» durchsuchen. Hilfreich: beim ersten Vorkommen ausschreiben («Datenschutzgesetz (DSG)», «Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter» steht schon, nur DSG fehlt) und bei Art. 19 Abs. 2 in einem Halbsatz sagen, was er verlangt.

## Nicht geprüft

- Wie ich in Dwello einem Mieter Auskunft über seine Daten gebe (nicht Teil der Aufgabe).
- Die Anmeldung selbst (Google) und alles nach der Anmeldung: Aufgabe war nur Lesen vor der Anmeldung.
- Andere Sprachen (fr/it/en): Helga liest Deutsch.
- Abschnitte «Aufbewahrung», «Anmeldung», «Weitergabe an Dritte», «Cookies» nur überflogen, nicht beurteilt.
- Ob die Gesetzesverweise rechtlich stimmen: nicht meine Sache (Dr. Weber, fach-reviewer).
