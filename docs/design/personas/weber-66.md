# Dr. Weber – Runde 66: Hinweise vor einer Mietzinsänderung im laufenden Mietvertrag

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Deutsch). Gespeichert nur im Gebäude Alpenblick (Mietvertrag Laura Keller, Wohnung EG).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/persona-weber/weber-66/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» (beide Varianten) | Der erste Satz «Änderungen an einem laufenden Mietvertrag gelten sofort.» widerspricht dem zweiten (Erhöhung frühestens auf den Kündigungstermin) und lässt offen, ob «gelten» rechtlich oder nur in Dwello gemeint ist und ob Dwello den neuen Betrag auch für zurückliegende Abrechnungsperioden verwendet. Ein Verwalter, der die neue Miete heute einträgt, weiss nicht, ab wann Dwello damit rechnet. |
| P-2 | Major | Mietvertrag bearbeiten, Hinweis bei befristetem Mietvertrag | «…ausser der Mietvertrag sieht sie vor.» verschweigt, dass auch eine vertraglich vorgesehene Erhöhung (Index- oder Staffelmiete) mit dem amtlichen Formular mitgeteilt werden muss (Art. 269d OR, Art. 19 VMWG) und sonst nichtig ist. Die Formvorschriften aus der unbefristeten Variante fehlen hier ganz. |
| P-3 | Major | Mietvertrag bearbeiten, Hilfe «Akonto pro Monat» | Die Hilfe sagt nicht, dass eine Erhöhung der Akontozahlung im laufenden Mietvertrag eine einseitige Vertragsänderung ist (Art. 269d Abs. 3 OR): amtliches Formular, nächstmöglicher Kündigungstermin. Bei Verwaltungspauschale und vereinbarten Nebenkosten steht das, beim Akonto nicht; ein Laie hält Akonto nicht für «Mietzins» und erhöht es nach einer Nachzahlung einfach. |
| P-4 | Minor | Hinweis «Laufender Mietvertrag» (unbefristet) | Unvollständig: Nichtigkeit auch bei Kündigungsandrohung (Art. 269d Abs. 2 lit. c OR) fehlt, ebenso das Anfechtungsrecht des Mieters innert 30 Tagen (Art. 270b OR). «nächsten Kündigungstermin» statt «nächstmöglichen» (Wortlaut Art. 269d Abs. 1) ist missverständlich. Keine Gesetzesangabe, obwohl die Verwaltungspauschale eine nennt. |
| P-5 | Minor | Hinweis bei befristetem Mietvertrag | «erst nach dem Vertragsende möglich» ist schief: Nach dem Vertragsende besteht kein Mietvertrag mehr. Gemeint ist ein neuer oder verlängerter Mietvertrag bzw. die stillschweigende Fortsetzung, die ihn unbefristet macht (Art. 266 Abs. 2 OR), ab dann gilt die Regel der unbefristeten Variante. Dass Indexmiete nur bei mindestens 5 Jahren Dauer und Staffelmiete nur bei mindestens 3 Jahren gilt (Art. 269b, 269c OR), fehlt. |
| P-6 | Nit | Mietvertrag bearbeiten | Der Hinweis oben wechselt erst nach dem Speichern: Wähle ich im Formular «Befristet», steht oben weiter der Text für den unbefristeten Mietvertrag. |

## Beobachtungen

- Die Umwandlung eines seit 2022 laufenden unbefristeten Mietvertrags in einen bis 31.12.2099 befristeten speichert Dwello ohne Rückfrage und ohne Hinweis, dass dafür eine schriftliche Vereinbarung mit der Mieterin nötig ist (einseitig nicht möglich). Ich erwartete wenigstens eine Frage «Steht das so im unterschriebenen Mietvertrag?».
- Nach dem Speichern fehlt auf der Seite des Mietvertrags die Schaltfläche «Beenden» (nur noch «Bearbeiten» und «Löschen»). Eine ausserordentliche Kündigung (z.B. Zahlungsverzug, Art. 257d OR) ist bei einem befristeten Mietvertrag aber möglich; der Text im Bearbeiten-Formular verweist dafür auf das Ändern des Vertragsendes.
- Die Erfolgsmeldung «Mietvertrag von Laura Keller gespeichert» liegt über der Überschrift «Miete pro Monat» und verdeckt sie halb (Screenshot 07).
- Neuer Text nach der Befristung: «Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.01.2100.» Logisch korrekt, liest sich bei einer Testbefristung aber seltsam.
- «3 Abrechnungen fehlen» nennt 2025, 2023 und 2022, nicht 2024 (vermutlich gibt es 2024 schon); nicht weiter geprüft, nicht Teil der Aufgabe.

## Aufgabe geschafft: ja

## Aufwand

Rund 10 Minuten, 8 Schritte (Übersicht, Mietverträge, Mietvertrag Laura Keller, Bearbeiten, Befristet wählen, Vertragsende eintragen, Speichern, erneut Bearbeiten).

## Ablauf

1. Mietverträge geöffnet. Erwartet: Liste mit Laura Keller. Gesehen: «Laura Keller, Wohnung EG · Alpenblick, Laufend, seit 01.11.2022, unbefristet», Nettomiete CHF 1’350.00, total CHF 1’590.00.
2. Mietvertrag geöffnet, «Bearbeiten» geklickt. Erwartet: ein Hinweis, dass ich die Miete nicht einfach ändern darf. Gesehen: gelber Kasten «Laufender Mietvertrag»: «Änderungen an einem laufenden Mietvertrag gelten sofort. Eine Mietzinserhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig.» (Screenshot 04). Inhaltlich im Kern richtig, aber der erste Satz verunsichert mich: Gilt meine Eingabe sofort, obwohl die Erhöhung erst später gilt?
3. Hilfe bei «Akonto pro Monat» gelesen: «Monatlicher Vorschuss des Mieters für die im Mietvertrag vereinbarten Nebenkosten (zum Beispiel Heizung, Wasser). Wird mit der Nebenkostenabrechnung verrechnet. Beispiel: 180.00». Richtig als Begriffserklärung (Art. 257a/257b OR, Art. 4 VMWG), aber nichts zur Änderung im laufenden Mietvertrag. Erwartet hatte ich denselben Hinweis wie bei der Verwaltungspauschale («amtliches Formular … Art. 269d OR»).
4. «Befristet» gewählt. Erwartet: Feld Vertragsende, eventuell ein Warnhinweis zur Umwandlung. Gesehen: Feld «Vertragsende» mit Hilfe «Letzter Tag des Mietverhältnisses», dazu der Kasten «Hat der Mieter gekündigt? … mit «Beenden» eintragen». Keine Warnung zur Umwandlung. Der Hinweis oben blieb der unbefristete (Screenshot 06).
5. 31.12.2099 eingetragen, Dwello zeigt «Donnerstag, 31. Dezember 2099». «Änderungen speichern». Erwartet: Rückfrage oder Bestätigung. Gesehen: direkt gespeichert, Meldung «Mietvertrag von Laura Keller gespeichert», Vertragsende «Befristet bis 31.12.2099», Status weiter «Laufend» (Screenshot 07).
6. Erneut «Bearbeiten». Gesehen: «Laufender Mietvertrag – Änderungen an einem laufenden Mietvertrag gelten sofort. Bei einem befristeten Mietvertrag ist eine Mietzinserhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor.» (Screenshot 08). Der Grundsatz ist richtig (keine einseitige Erhöhung während fester Dauer ohne Vorbehalt), aber Formular, Fristen und Nichtigkeit fehlen jetzt ganz.

## Verwirrung

- «gelten sofort»: Für wen? Rechtlich falsch (eine Erhöhung gilt nie sofort), für Dwello unklar, ab welchem Tag und ob rückwirkend für Akontoverrechnung in offenen Abrechnungsperioden. Ein Feld «gültig ab» gibt es nicht.
- «nächsten Kündigungstermin»: der nächste im Kalender oder der nächste, bei dem Frist und 10 Tage eingehalten sind?
- «ausser der Mietvertrag sieht sie vor»: Was genau? Indexklausel, Staffel, ein allgemeiner Vorbehalt? Und brauche ich dann kein Formular?
- «nach dem Vertragsende»: Nach dem Ende gibt es keine Miete mehr, die man erhöhen könnte.
- Dass Akonto zur Mietzinsgestaltung zählt und dieselben Regeln gelten, sagt nirgends etwas.

## Fehlerrisiken

- Der Verwalter trägt die erhöhte Nettomiete oder das erhöhte Akonto heute ein, weil «Änderungen gelten sofort», und Dwello verrechnet möglicherweise ab sofort oder rückwirkend; der Mieter schuldet aber den alten Betrag bis zum gültigen Termin (P-1).
- Ein Verwalter mit Indexklausel im befristeten Vertrag erhöht ohne Formular; die Erhöhung ist nichtig, der Mieter kann zu viel Bezahltes zurückfordern (P-2).
- Erhöhung des Akontos nach einer Nachzahlung per einfachem Brief statt Formular (P-3).
- Erhöhung mit Kündigungsandrohung im Begleitbrief, weil nur Formular und Begründung als Nichtigkeitsgründe genannt sind (P-4).
- Unbefristet zu befristet ohne Vereinbarung mit dem Mieter: Dwello zeigt danach ein Vertragsende, das rechtlich nicht gilt (Beobachtung).

## Vorschläge

- **P-1** Reproduktion: Mietverträge > Laura Keller > Bearbeiten, Kasten oben lesen. Hilfe: ersten Satz ersetzen durch etwas wie «Dwello rechnet ab dem Speichern mit den neuen Beträgen. Tragen Sie eine Mietzinserhöhung deshalb erst ein, wenn sie gilt.» und klar sagen, ob vergangene Abrechnungsperioden betroffen sind (oder ein Feld «gilt ab» anbieten).
- **P-2** Reproduktion: Mietvertrag befristen, speichern, wieder Bearbeiten. Hilfe: ergänzen «Auch eine im Mietvertrag vorgesehene Erhöhung (Index- oder Staffelmiete) teilen Sie mit dem amtlichen Formular mit; ohne Formular ist sie nichtig (Art. 269d OR, Art. 19 VMWG).»
- **P-3** Reproduktion: Bearbeiten, Hilfe unter «Akonto pro Monat». Hilfe: «Eine höhere Akontozahlung im laufenden Mietvertrag teilen Sie wie eine Mietzinserhöhung mit dem amtlichen Formular mit, frühestens auf den nächstmöglichen Kündigungstermin (Art. 269d OR). Eine Senkung ist jederzeit möglich.»
- **P-4** Reproduktion: wie P-1. Hilfe: «nächstmöglichen» statt «nächsten»; «Ohne Formular, ohne Begründung oder mit Kündigungsandrohung ist sie nichtig (Art. 269d OR). Der Mieter kann sie innert 30 Tagen anfechten.» Eventuell ein Beispiel mit 3 Monaten Kündigungsfrist.
- **P-5** Reproduktion: wie P-2. Hilfe: «Während der festen Dauer ist eine Mietzinserhöhung nur möglich, wenn der Mietvertrag sie vorsieht (Indexmiete ab 5 Jahren Dauer, Staffelmiete ab 3 Jahren). Läuft der Mietvertrag nach dem Vertragsende stillschweigend weiter, gilt er als unbefristet.»
- **P-6** Reproduktion: Bearbeiten eines unbefristeten Mietvertrags, «Befristet» wählen, Kasten oben bleibt. Hilfe: Kasten an die Auswahl im Formular koppeln, oder sagen «gilt für den gespeicherten Mietvertrag».

## Nicht geprüft

- Ob «gelten sofort» in Dwello rückwirkend wirkt (z.B. Akonto in einer laufenden Abrechnungsperiode): Dafür hätte ich Beträge ändern und eine Abrechnung erstellen müssen; die Aufgabe verlangte nur die Befristung.
- Rücksetzen auf «Unbefristet» und ob dann der unbefristete Hinweis wieder erscheint: nicht Teil der Aufgabe; der Mietvertrag von Laura Keller bleibt befristet bis 31.12.2099.
- Andere Sprachen, Mobile-Ansicht.
- Rechtliche Würdigung ohne Konsultation von Kommentaren; die Einordnung der Akontoerhöhung unter Art. 269d OR folgt der verbreiteten Praxis, nicht einem geprüften Entscheid.

## Runde 2

Nur angesehen, nichts gespeichert. Mietvertrag Hans Müller (Wohnung 1.01, Musterhaus Zentrum, unbefristet seit 01.03.2021), «Bearbeiten», Hinweis «Laufender Mietvertrag» gelesen. Skript `r2a.mjs`, Screenshots `r2-01-contracts.png` bis `r2-03-edit.png` im Scratchpad-Ordner oben.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – (behoben) | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | Der Widerspruch ist weg: «sofort» bezieht sich jetzt ausdrücklich auf Dwello, nicht auf das Recht, und der letzte Satz sagt, wann ich eintrage. |
| P-7 | Major | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | Erster und letzter Satz zusammen führen im Normalfall zu falschen Abrechnungen: Dwello übernimmt die Änderung «auch für die Zeit, die noch nicht abgerechnet ist», und ich soll die Erhöhung eintragen, «wenn sie gilt». Gilt eine höhere Akontozahlung ab 01.10., ist Januar bis September meist noch nicht abgerechnet; trage ich sie am 01.10. ein, rechnet Dwello nach dem ersten Satz auch für diese Monate mit dem höheren Akonto. Bei Hans Müller fehlen sogar die Abrechnungen 2021 bis 2023. Der Hinweis sagt nicht, was ich stattdessen tun soll (zuerst die offenen Perioden abrechnen? warten?). |
| P-8 | Minor | wie P-7 | «Mietzinserhöhung» im letzten Satz: Ein Laie weiss nicht, ob das auch Akonto, Zusatzmiete und Verwaltungspauschale meint (hängt mit P-3 zusammen, das unverändert ist). Für Senkungen und Korrekturen eines Tippfehlers sagt der Hinweis nichts; ein Tippfehler soll ja gerade rückwirkend gelten. |
| P-9 | Nit | wie P-7 | «Dwello übernimmt Änderungen sofort» ist etwas unbestimmt; «Dwello rechnet ab dem Speichern mit den neuen Beträgen» sagte genauer, was passiert. |

### Beobachtungen (Runde 2)

- Wortlaut jetzt: «Dwello übernimmt Änderungen sofort, auch für die Zeit, die noch nicht abgerechnet ist. Eine Mietzinserhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig. Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.» (Screenshot `r2-03-edit.png`, gelber Kasten mit Warndreieck oben im Formular.)
- Rechtlich sind die neuen Sätze korrekt: Der erste ist eine Aussage über Dwello, nicht über das Recht; der letzte gibt eine richtige Handlungsanweisung (eintragen ab dem Termin, ab dem die Erhöhung nach Art. 269d OR wirksam ist). Ficht der Mieter an (Art. 270b OR), gilt die Erhöhung erst nach dem Entscheid; «wenn sie gilt» deckt das sinngemäss ab, nennt es aber nicht.
- Der mittlere Teil ist unverändert: «nächsten» statt «nächstmöglichen» Kündigungstermin, Kündigungsandrohung als Nichtigkeitsgrund fehlt (P-4 bleibt offen).
- Die Seite des Mietvertrags zeigt bei Hans Müller «3 Abrechnungen fehlen» (2023, 2022, 2021); gerade hier wäre die Rückwirkung des ersten Satzes gross.

### Aufgabe geschafft (Runde 2): ja

### Aufwand (Runde 2)

Rund 3 Minuten, 3 Schritte (Mietverträge, Mietvertrag Hans Müller, Bearbeiten).

### Ablauf (Runde 2)

1. Mietverträge, «Hans Müller» geöffnet. Erwartet: Mietvertrag Wohnung 1.01. Gesehen: «Mietvertrag von Hans Müller, Wohnung 1.01 · Musterhaus Zentrum», Laufend seit 01.03.2021, unbefristet, Nettomiete CHF 1’450.00, Akonto CHF 240.00, Zusatzmiete CHF 100.00, dazu «3 Abrechnungen fehlen».
2. «Bearbeiten». Erwartet: ein Hinweis, der sagt, ab wann Dwello mit einer neuen Miete rechnet und wann ich sie eintrage. Gesehen: neuer erster Satz klärt «sofort» als Verhalten von Dwello und sagt, dass auch nicht abgerechnete Zeit betroffen ist; neuer letzter Satz «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.» P-1 ist damit beantwortet.
3. Nachgerechnet am Beispiel Erhöhung des Akontos ab 01.10., Abrechnungsperiode Kalenderjahr: Die Anweisung des letzten Satzes und die Rückwirkung des ersten vertragen sich nicht (P-7). Selbst geprüft habe ich das nicht (nur ansehen erlaubt), ich stütze mich auf den Wortlaut des ersten Satzes.

### Verwirrung (Runde 2)

- «auch für die Zeit, die noch nicht abgerechnet ist»: Heisst das, die ganze laufende Abrechnungsperiode wird mit dem neuen Betrag gerechnet, auch Monate vor dem Eintrag? So lese ich es, und dann ist der letzte Satz keine sichere Anweisung.
- «Mietzinserhöhung»: nur Nettomiete, oder alles im Abschnitt «Miete»?

### Fehlerrisiken (Runde 2)

- Akonto-Erhöhung mitten in der Periode korrekt am Wirksamkeitstag eingetragen; Dwello rechnet für die ganze offene Periode mit dem höheren Akonto, schreibt dem Mieter nie bezahlte Akontozahlungen gut, und die Nachzahlung fällt zu tief aus (bzw. ein Guthaben zu hoch). Das ist der Normalfall, nicht ein Sonderfall (P-7).

### Vorschläge (Runde 2)

- **P-7** Reproduktion: Mietverträge > Hans Müller > Bearbeiten, Kasten oben lesen. Hilfe: entweder ein Feld «gilt ab» für neue Beträge, oder den letzten Satz ergänzen: «Erstellen Sie vorher die Nebenkostenabrechnung für die Zeit davor, sonst rechnet Dwello auch diese Zeit mit dem neuen Betrag.» Falls Dwello intern doch nur ab dem Speichertag rechnet, den ersten Satz entsprechend berichtigen.
- **P-8** Reproduktion: wie P-7. Hilfe: «Eine Erhöhung von Nettomiete, Akonto, Zusatzmiete oder Verwaltungspauschale …»; ein Satz zu Korrekturen: «Einen Tippfehler korrigieren Sie jederzeit; er gilt für die ganze nicht abgerechnete Zeit.»
- **P-9** Reproduktion: wie P-7. Hilfe: «Dwello rechnet ab dem Speichern mit den neuen Beträgen, auch für …».

### Nicht geprüft (Runde 2)

- Ob Dwello eine geänderte Akontozahlung tatsächlich rückwirkend in der offenen Periode verrechnet: Dafür hätte ich speichern und eine Abrechnung erstellen müssen; diese Runde war nur zum Ansehen.
- Die Variante des Hinweises bei einem befristeten Mietvertrag (P-2, P-5): In den frischen Demodaten habe ich keinen befristeten laufenden Mietvertrag geöffnet; die Aufgabe nannte nur Hans Müller.
- Andere Sprachen, Mobile-Ansicht.
