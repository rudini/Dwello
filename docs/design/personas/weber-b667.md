# Persona-Lauf: Dr. Weber, b667 (Überschneidung von Mietverträgen, Hinweise im Assistenten)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest jedes Wort. Desktop 1440 × 900, Maus. App: http://localhost:3300 (Persona-Stack, Demodaten).
Simulierter Fehler: Die Browser-Anfrage `GET /api/contracts?apartmentId=<id>` antwortet mit 500, nur für die jeweils genannte Wohnung (EG Alpenblick, A2 Seepark Residenz, OG2 Alpenblick).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-b667/`.

Gespeichert habe ich nur einen Mietvertrag: Thomas Weber, Wohnung OG2 · Alpenblick, ab 01.04.2027, unbefristet, Nettomiete 1400. Danach zeigte die Liste 12 statt 11 Mietverträge; alle anderen Versuche wurden abgelehnt oder nicht gespeichert.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 3 «Vertragsdauer» (ohne Fehler, OG2) | Nach «Weiter» steht die Überschneidung zweimal da, mit verschiedenem Wortlaut und in verschiedenen Farben: Rot am Feld mit Name und Rat («… mit dem Mietvertrag von Thomas Weber (ab 01.04.2027, unbefristet). Wählen Sie …»), dazu ein gelber Kasten «Zeitraum überschneidet sich: Überschneidung mit bestehendem Vertrag: ab 01.04.2027 (unbefristet). Pro Wohnung darf sich kein Mietvertrag mit einem anderen überschneiden.» Der gelbe Kasten sagt «Vertrag» statt «Mietvertrag», nennt keinen Namen und sieht nach einer Warnung aus, obwohl «Weiter» gesperrt ist. Ist das jetzt ein Fehler oder nur ein Hinweis? |
| P-2 | Minor | Neuer Mietvertrag, Schritt 3, befristet bis 30.06.2027 (ohne Fehler, OG2) | Der Rat lautet «Wählen Sie ein Vertragsende vor dem 01.04.2027», aber rot markiert und als ungültig gekennzeichnet ist das Feld **Vertragsbeginn**. Das Feld Vertragsende bleibt unmarkiert. Man ändert leicht das falsche Datum. |
| P-3 | Minor | Neuer Mietvertrag, Prüfen, Ablehnung (Fehler auf EG) | Die Ablehnung nennt jetzt den anderen Mietvertrag (Laura Keller, seit 01.11.2022, unbefristet), gut. Der Rat deckt aber nur einen Fall ab: «Endet der Mietvertrag von Laura Keller, tragen Sie zuerst auf seiner Seite mit «Enddatum erfassen» das Vertragsende ein.» Was zu tun ist, wenn er **nicht** endet (andere Wohnung wählen), steht nicht da. Einen Link zu «seiner Seite» gibt es nicht, anders als im Hinweis zu Nina Brunner in Schritt 2. |
| P-4 | Minor | Mietvertrag bearbeiten, Ablehnung (Fehler auf A2) | «Der Zeitraum überschneidet sich mit dem Mietvertrag von Sarah Meier (01.08.2021 – 30.06.2025, gekündigt). Wählen Sie einen Vertragsbeginn nach dem 30.06.2025.» Das ist richtig gerechnet, sagt aber nur, wie man das eigene Datum verschiebt. Juristisch muss der Vertragsbeginn mit dem unterschriebenen Mietvertrag übereinstimmen. Ist der 01.06.2025 richtig, dann stimmt das Vertragsende von Sarah Meier nicht (zum Beispiel nach einem vorzeitigen Auszug), und dann wäre dort zu korrigieren. Der Rat kann dazu führen, dass man ein Datum einträgt, das nicht im Mietvertrag steht. |
| P-5 | Minor | Gelber Hinweis bei Ladefehler (Assistent Schritt 2, 3, 5; Bearbeiten bei Wohnung und Vertragsbeginn) | «Dwello prüft beim Speichern, ob die Wohnung frei ist.» Geprüft wird aber, ob sich der **Zeitraum** mit einem anderen Mietvertrag überschneidet; so sagt es die Ablehnung danach. Beim Bearbeiten des Mietvertrags von Nina Brunner ist die Wohnung A2 gerade an sie vermietet, also nicht «frei». Und OG2 ist bis 31.03.2027 frei, ab dann nicht: «frei» beantwortet die Frage nicht. |
| P-6 | Minor | Neuer Mietvertrag, Schritt 2 «Wohnung» gegenüber Ablehnung und Schritt 3 (OG2) | Widerspruch: Ohne Fehler steht OG2 in der Liste als «(nicht verfügbar)» und lässt sich laut Hilfetext «nicht wählen». Die Ablehnung und Schritt 3 raten aber: «Wählen Sie «Befristet» mit einem Vertragsende vor dem 01.04.2027.» Das geht, aber nur wenn ich über die Seite der Wohnung «Mietvertrag erfassen» wähle. Dann ist OG2 vorausgewählt, obwohl die Option weiterhin «(nicht verfügbar)» heisst. Ein befristeter Mietvertrag bis 31.03.2027 wird angenommen (bis Schritt 4 geprüft). Wer der Liste glaubt, hält eine Vermietung vor dem 01.04.2027 für unmöglich. |

## Beobachtungen

- W-03 ist behoben: Nach der Ablehnung im Assistenten und beim Bearbeiten ist der gelbe Kasten zum Ladefehler weg; es steht nur noch die rote Ablehnung da.
- W-04 ist behoben: Die Ablehnung nennt Mieter und Zeitraum des anderen Mietvertrags. Der Rat passt sich an: unbefristet → «Wählen Sie «Befristet» mit einem Vertragsende vor dem 01.04.2027»; befristet bis 30.06.2027 → «Wählen Sie ein Vertragsende vor dem 01.04.2027». Beides ist richtig gerechnet; «vor dem 01.04.2027» heisst spätestens 31.03.2027, und so wird es auch angenommen.
- W-06 ist behoben: Beim Vertragsbeginn im Bearbeitungsformular steht «Dwello prüft beim Speichern, ob die Wohnung frei ist. «Erneut versuchen» steht oben bei der Wohnung.» (zu «frei» siehe P-5).
- W-07 ist behoben: Die Ablehnung beim Bearbeiten sagt jetzt, was zu tun ist (siehe P-4 zum Inhalt).
- W-08 ist behoben: Bei Vertragsbeginn 01.06.2025 steht die Warnung «liegt in der Vergangenheit. Stimmt das Datum?» einmal, im gelben Kasten «Vertragsbeginn prüfen», mit dem Zusatz zu «Abgerechnet bis». Am Feld steht rot nur, was zu tun ist: «Stimmt der Vertragsbeginn, klicken Sie nochmals auf «Weiter».» Das ist klar; ein zweites «Weiter» führt zu Schritt 4. Das Feld wird dabei rot und als ungültig markiert, obwohl das Datum gültig sein kann; das wirkt strenger als gemeint.
- W-10 ist behoben: Bei 1440 × 900 sind alle fünf Schrittnamen ganz lesbar: «Mieter», «Wohnung», «Vertragsdauer», «Miete», «Prüfen» (Screenshot `s00-new.png`), auch mit Häkchen in Schritt 5 (`t1-b.png`).
- Schritt 2 mit Fehler auf EG: Die Option heisst jetzt «Wohnung EG - Alpenblick, 3 Zimmer, 72 m² (nicht geprüft)», steht aber weiter zuoberst bei den freien Wohnungen. Der Hilfetext darüber erklärt nur «nicht verfügbar», nicht «nicht geprüft» (Rest von W-01, nicht Teil dieser Aufgabe).
- Zwei Wörter für dasselbe: «Enddatum erfassen» (Schaltfläche) und «Vertragsende» (Feld, Rat).
- Der Hinweis «Laufender Mietvertrag» im Bearbeitungsformular ist jetzt juristisch sauber (amtliches Formular, Begründung, Frist, Nichtigkeit); W-09 erledigt.
- Ganzseiten-Screenshots zeigen die feste Kopfzeile mitten im Bild; das ist eine Folge der Aufnahme, nicht der App.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 12 Durchläufe (davon 3 nur zum Anpassen meiner Skripte). Ein Durchlauf durch den Assistenten: 5 Schritte, rund 10 Eingaben und Klicks.

## Ablauf

1. **Aufgabe 2, ohne Fehler, Neuer Mietvertrag über «Mietverträge → Mietvertrag erfassen», Anna Schmidt, Schritt 2.** Erwartet: OG2 wählbar, damit ich in Schritt 3 die Meldung zur Überschneidung sehe. Gesehen: «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m² (nicht verfügbar)», ausgegraut, nicht wählbar (P-6). Weg gefunden über die Seite der Wohnung OG2 → «Mietvertrag erfassen»: OG2 ist dort vorausgewählt, trotz «(nicht verfügbar)».
2. **Aufgabe 2, ohne Fehler, Schritt 3, 01.01.2027 unbefristet, «Weiter».** Erwartet: eine Meldung mit Name und Rat. Gesehen: die rote Meldung am Vertragsbeginn mit Name und Rat, dazu ein zweiter, gelber Kasten mit anderem Wortlaut ohne Namen (P-1; Screenshot `t2pu-s3.png`).
3. **Aufgabe 2, ohne Fehler, befristet bis 30.06.2027, «Weiter».** Erwartet: Markierung am Vertragsende. Gesehen: Rat «Wählen Sie ein Vertragsende vor dem 01.04.2027» rot unter dem **Vertragsbeginn**, dieses Feld ist als ungültig markiert (P-2).
4. **Aufgabe 1, Ablehnung.** Erwartet: auch ein Weg für den Fall, dass Laura Keller bleibt. Gesehen: nur der Weg «Vertragsende bei Laura Keller eintragen», ohne Link (P-3; Screenshot `t1-b.png`).
5. **Aufgabe 3, Ablehnung beim Bearbeiten.** Erwartet: Hinweis, dass entweder das eigene Datum oder das Vertragsende von Sarah Meier falsch ist. Gesehen: nur «Wählen Sie einen Vertragsbeginn nach dem 30.06.2025» (P-4).

## Vorschläge

- **P-1:** Seite der Wohnung OG2 (mit künftigem Mietvertrag Thomas Weber ab 01.04.2027) → «Mietvertrag erfassen», Mieter Anna Schmidt, «Weiter», «Weiter», Vertragsbeginn 01.01.2027, unbefristet, «Weiter». Hilfreich: eine einzige Meldung; den gelben Kasten weglassen oder auf denselben Wortlaut («Mietvertrag von Thomas Weber …») bringen und als Fehler zeigen, wenn «Weiter» gesperrt ist.
- **P-2:** Wie P-1, aber «Befristet», Vertragsende 30.06.2027. Hilfreich: Meldung und Markierung am Feld Vertragsende, wenn der Rat das Vertragsende betrifft.
- **P-3:** Fehler auf EG, Neuer Mietvertrag, Nina Brunner, EG Alpenblick, 01.01.2027, unbefristet, 1400, «Mietvertrag speichern». Hilfreich: Link «Zum Mietvertrag von Laura Keller» und ein zweiter Satz: «Bleibt der Mietvertrag bestehen, wählen Sie eine andere Wohnung.» Den ersten Satz vorsichtig halten: «Ist der Mietvertrag von Laura Keller gekündigt …», damit niemand ein Vertragsende ohne Kündigung einträgt.
- **P-4:** Fehler auf A2, /contracts/b0000002-0002-0002-0002-000000000003/edit, Vertragsbeginn 01.06.2025, «Änderungen speichern». Hilfreich: «Prüfen Sie den Vertragsbeginn im unterschriebenen Mietvertrag. Ist er richtig, korrigieren Sie zuerst das Vertragsende des Mietvertrags von Sarah Meier», mit Link.
- **P-5:** Fehler auf A2, Bearbeiten Nina Brunner: Hinweis bei Wohnung und Vertragsbeginn. Hilfreich: «Dwello prüft beim Speichern, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.» (wie die Ablehnung).
- **P-6:** Ohne Fehler, Neuer Mietvertrag über die Liste, Schritt 2: OG2 «(nicht verfügbar)». Hilfreich: Eine Wohnung mit nur künftigem Mietvertrag wählbar machen und markieren, etwa «(vermietet ab 01.04.2027)», und den Hilfetext entsprechend anpassen; sonst passt der Rat der Ablehnung nicht zur Liste.

## Nicht geprüft

- «Erneut versuchen» mit erfolgreichem zweiten Laden (Fehler mitten im Lauf aufheben): nicht versucht, gehörte nicht zur Aufgabe.
- Speichern eines befristeten Mietvertrags bis 31.03.2027 auf OG2: nur bis Schritt 4 geprüft, nicht gespeichert, weil ich nur einen Mietvertrag speichern durfte.
- Andere Sprachen als Deutsch.
