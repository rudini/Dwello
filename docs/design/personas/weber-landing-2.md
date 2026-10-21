# Dr. Weber – Landing Page, Runde 2

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
Geprüft: `http://localhost:3310/index.html` (deutsch), `/impressum.html`, `/datenschutz.html`; Netzwerkanfragen und Browser-Speicher über persona-kit. Nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/weber-landing-2/`.

## Befunde (nur was auf der Landing Page noch geändert werden sollte)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | FAQ «Ist Dwello rechtlich geprüft?» | Die Antwort weicht aus. «… wird mit automatischen Tests gegen diese Regeln geprüft» liest sich wie ein Ja. Dass keine Juristin und kein Verband die Rechenregeln geprüft hat, steht nirgends ausdrücklich. |
| P-2 | Minor | Nebenkostenabrechnung, «Auf 5 Rappen gerundet, zugunsten der Mieter» | Unter derselben Überschrift steht, dass Guthaben unter CHF 5 nicht ausbezahlt, sondern übertragen werden. Ein zurückbehaltenes Guthaben ist nicht «zugunsten der Mieter». Eine Rechtsgrundlage oder ein Hinweis, was gilt, wenn der Mieter die Auszahlung verlangt, fehlt. |
| P-3 | Minor | Open Source, Vergleichstabelle | «Wenn der Anbieter aufhört: Daten weg» und «KI liest Belege: in der Cloud» verallgemeinern über die Mitbewerber, ohne Beleg (vergleichende Werbung, Art. 3 Abs. 1 lit. e UWG). «Wo Ihre Daten liegen: bei Ihnen» stimmt für die eigene Option «Server in der Cloud» nur bedingt. |
| P-4 | Minor | Rechnungen und KI, «Lokale KI mit Ollama, ohne Cloud» | Absolute Aussage «Ihre Belege verlassen den Server nicht». Gleichzeitig empfiehlt der Reiter «Homeserver / NAS» kleinen Geräten eine externe KI. Die Einschränkung steht erst im Satz danach und nicht bei der Behauptung selbst. |
| P-5 | Minor | Alles auf einen Blick, «Barrierefrei nach WCAG 2.2 AA» | Hier wird Konformität behauptet, begründet aber nur mit automatischen axe-Prüfungen. axe deckt nur einen Teil der Kriterien ab. |
| P-6 | Minor | Roadmap | Die Einleitung sagt «zu jedem gibt es ein Issue auf GitHub». «Berichte und Auswertungen» hat aber keine Issue-Nummer. |
| P-7 | Nit | Nebenkostenabrechnung, FAQ, Impressum | Die Rechtsgrundlage heisst jedes Mal anders: «Regeln des Mietrechts», «Regeln des Obligationenrechts», «Obligationenrecht und Verordnung über die Miete». Die Verordnung heisst amtlich VMWG. |
| P-8 | Nit | Verteilschlüssel, Lift-Beispiel | 6 × CHF 281.67 = CHF 1'690.02, also 2 Rappen mehr als die Kosten von CHF 1'690.00. Die Seite sagt nicht, wer die Rundungsdifferenz trägt. |
| P-9 | Nit | Kennzahlen oben / Open Source / FAQ | «50 Wohnungen» oben, «keine Limite pro Wohnung» bei Open Source, «bis zu 50 Wohnungen» in der FAQ. Ist 50 eine harte Grenze oder eine Empfehlung? «Limite pro Wohnung» meint vermutlich «keine Gebühr pro Wohnung». |
| P-10 | Nit | MCP-Beispiel | Das Abzeichen «Entwurf» (für das Muster) steht neben «Abrechnungen im Entwurf» (Status von Abrechnungen). «Entwurf» hat dort also zwei Bedeutungen. |
| P-11 | Nit | Verteilschlüssel und Heizprofile | Die Bildunterschrift «Januar 13.6 %, August 3.6 %» nennt das Profil nicht. Erst der Alternativtext verrät, dass es «Heizung mit Warmwasser» ist. Wer das liest, hält 3.6 % Heizkosten im August für das Mittelland-Profil. |

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Eine kostenlose Open-Source-Software, die ich selbst betreibe und die mir als privatem Vermieter die Nebenkostenabrechnung erstellt, samt QR-Rechnung, mit einer KI, die die Belege liest. (Hero)
2. **Für wen? Angesprochen? 4/5.** «Für private Vermieterinnen und Vermieter» passt genau auf mich. Ein Abzug, weil mich der Hinweis auf eine Person, «die sich mit Computern auskennt», sofort auf Abstand hält: Ich müsste jemandem meinen Server und damit die Daten meiner Mieter anvertrauen.
3. **Was als Nächstes?** «So kommen Sie zu Dwello». Bevor ich eine Demo anschaue, will ich wissen, was ich mir ins Haus hole und wer dafür haftet.
4. **Vertrauenswürdig? 4/5.** Ruhig, sachlich, keine Superlative, Impressum und Datenschutzerklärung im Fuss. Etwas Reklame bleibt («Die nächste Abrechnung machen Sie mit Dwello.»).

### B. Verständlichkeit

5. **Ohne Nachschlagen? 4/5.** Die Fachtexte verstehe ich. «MCP», «Ollama», «OpenAI-kompatibel», «Docker», «SSH», «Caddy» erklärt die Seite nicht. Das ist vertretbar, weil sie diese Teile an die einrichtende Person verweist. «Mietstage» (auch im PDF) wirkt auf mich wie ein Druckfehler für «Miettage».
6. **Verfügbar vs. geplant? 4/5.** Die Abzeichen «Verfügbar» / «Geplant» sind klar und stimmen zwischen Funktionsliste, MCP-Abschnitt, Installationshinweis (#497) und Roadmap überein. Dass der MCP-Abschnitt so ausführlich ist, ein geplantes Merkmal mit Beispiel-Chat, verwischt das wieder etwas. Ausserdem fehlt bei einem Roadmap-Punkt die versprochene Issue-Nummer (P-6).
7. **Bilder zeigen die Arbeit? 5/5.** Upload-Dialog, Abrechnung, PDF, QR-Zahlteil, Verteilschlüssel, Heizprofil, Gebäuderegister: echte Bildschirme. Ich habe das PDF nachgerechnet, siehe «Ablauf».

### C. Nutzen und Bedenken

8. **Welches Problem gelöst, welches nicht?** Gelöst: tagesgenaue Verteilung bei Mieterwechsel, nachvollziehbare Aufstellung pro Kategorie, QR-Zahlteil, Mahnungen. Nicht gelöst: die Haftung. Die Seite sagt zu Recht, dass Dwello keine Rechtsberatung ersetzt. Ich hätte aber erwartet, dass sie sagt, ob die Rechenregeln je von einer Fachperson geprüft wurden (P-1). Mietzinsanpassungen und Kündigungsformulare kommen nicht vor. Dass die Seite sie nicht verspricht, ist korrekt.
9. **Was überzeugt am meisten?** Die Abrechnung, «die jede Zahl erklärt»: Kosten des Gebäudes, Wohnungsanteil, Zeitanteil. Die Beispielzahlen gehen auf, die Rundung auf 5 Rappen zugunsten des Mieters lässt sich am Beispiel nachvollziehen (215.82 → 215.80). Ausserdem der Verweis auf Art. 257a OR.
10. **Bedenken, beantwortet?** Kosten: ja (FAQ, inklusive eigener Server, Strom, Porto, externe KI). Datenschutz: weitgehend ja; der Abschnitt zählt endlich ehrlich auf, was nach aussen geht (Google-Anmeldung, Gebäuderegister, E-Mails, optionale externe KI). Installation: ja, ehrlich mit «rund eine Stunde» und Helferperson. Rechtssicherheit: nur halb (P-1, P-2). Offen bleibt auch, wo die Demo läuft und wer sie hostet: «Unsere Demo läuft in Zürich», laut Impressum hostet Infomaniak aber in Genf.
11. **Datenschutz und «gratis» glaubhaft? 4/5.** Für die Website selbst habe ich es geprüft, es stimmt (siehe «Ablauf»). Für die App kann ich es nicht prüfen. Abzug wegen der absoluten Formulierungen (P-3, P-4) und weil «keine Funktion, die später kostenpflichtig wird» ein Versprechen ist, für das niemand einsteht.

### D. Weg zum Start

12. **Wie anfangen? 4/5.** Demo ansehen, die englische Anleitung an eine Vertrauensperson geben, sie richtet Docker, `.env` und den Google-Schlüssel ein und lädt das KI-Modell (ca. 6 GB). Danach arbeite ich im Browser: Gebäude über die Adresse aus dem Gebäuderegister übernehmen, Rechnungen laufend hochladen, im Frühling abrechnen.
13. **Installation selbst?** Nein. Ich würde meinen Neffen oder den IT-Dienstleister meiner Kanzlei fragen und mit ihm schriftlich festhalten, wer für Updates und Datensicherung zuständig ist. Dass die Anleitung nur auf Englisch vorliegt, ist für mich kein Problem, für viele andere Vermieter schon.
14. **Gefunden? 5/5.** Navigation, Sprachwechsel (oben und im Fuss), Impressum und Datenschutzerklärung im Fuss. Alle Unterseiten antworten (fr/it/en, Impressum, Datenschutz, Markenhandbuch: Status 200).

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? 5/5.** Gut lesbare Schrift, ruhige Kontraste, Fokus nicht geprüft (Maus). Die Tabellen in den App-Bildern sind am Desktop gerade noch lesbar. Die Zahlen habe ich in der Originalgrösse nachgerechnet.
16. **Länge?** Lang, aber für mich passend: Ich habe alles gelesen, auch die FAQ und beide Rechtsseiten. Die Abschnitte «Einfach zu bedienen» (48 px, 7 : 1) und die Funktionsliste wiederholen sich.

### F. Gesamturteil

17. **Ausprobieren? 4/5.** Die Demo ja. Für den Echtbetrieb bräuchte ich eine klare Antwort auf P-1 und eine Person, die den Betrieb übernimmt.
18. **Empfehlen? 3/5.** Einer technisch begleiteten Bekannten ja, einer allein gelassenen nicht. Am Einrichten und an der Datensicherung hängt zu viel Verantwortung.
19. **Die eine Änderung:** Die FAQ «Ist Dwello rechtlich geprüft?» ehrlich beantworten: «Nein, nicht von einer Juristin oder einem Verband. Die Rechenregeln sind … umgesetzt und mit automatischen Tests abgesichert.»

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? 3/5.** Sachlich und hell, eher kühl-technisch. Kühl wirken die Terminal-Box, das dunkelblaue Datenschutz-Band und die Kennzahlen (48 px, 7 : 1, 390 px). Wärme bringen die Demonamen (Hans Müller, Marco Bernasconi) und der «Vermieterjahr»-Abschnitt. Mich stört die Kühle nicht: Seriosität ist mir wichtiger als Wärme.
21. **Bilder?** Die App-Bilder reichen mir; sie belegen die Behauptungen. Ein Foto eines Mehrfamilienhauses würde ich akzeptieren. Stockfotos lächelnder Vermieter würden mein Vertrauen eher senken.
22. **Wo Animation erklärt?** «Verteilschlüssel und Heizprofile»: wie sich die CHF 1'690 auf sechs Wohnungen verteilen und wie sich ein Mieterwechsel im Juni über das Heizprofil auswirkt. Ausserdem «Rechnungen und KI»: die drei Schritte Hineinziehen, Lesen, Bestätigen.
23. **Wo stört Bewegung?** Bei den rechtlichen Aussagen (Nebenkostenabrechnung, Datenschutz, FAQ) und bei der Vergleichstabelle. Dort will ich in Ruhe lesen. Keine automatisch laufenden Karussells.
24. **Drei Ideen für mehr Wärme:** (a) Ein kurzes Beispiel aus dem Vermieteralltag in Ich-Form, ohne erfundenes Testimonial, deutlich als Beispiel gekennzeichnet. (b) Das Lift-Beispiel als kleine, ruhige Grafik von Haus zu Wohnungen statt nur als Text und Knopfreihe. (c) Ein Satz, wer hinter Dwello steht und warum, mit Namen. Das schafft Vertrauen und ist zugleich ehrlich.

## Beobachtungen

- Die Website lädt nur von `localhost:3310`: HTML, eine Schrift (`fonts/inter-latin.woff2`) und die Bilder unter `shots/`. Es gibt keine fremden Server, keine Cookies (nachdem ich die Cookies des Prüfwerkzeugs gelöscht hatte, blieb `document.cookie` leer), und `localStorage` und `sessionStorage` sind leer. Die Aussagen der Datenschutzerklärung («keine Cookies», «nichts von fremden Servern», «speichern nichts in Ihrem Browser») treffen für diese Auslieferung zu. Die zwei Cookies `dwello_session` und `dwello_xsrf` im ersten Lauf setzte das Prüfwerkzeug für `localhost`, nicht die Seite.
- Lizenz einheitlich: AGPL-3.0-or-later auf der Seite, im Fuss, im Impressum, Link auf `LICENSE`. Dass «Link zum Quellcode in der App» erst geplant ist (#498, «wie es die AGPL verlangt»), ist ehrlich. Es zeigt aber, dass eine AGPL-Pflicht für Betreiber veränderter Versionen heute nicht von der App unterstützt wird.
- Datenschutzerklärung: Verantwortlicher, Auftragsbearbeiter (Infomaniak), Auskunft innert 30 Tagen, EDÖB mit Adresse, Stand 21. Oktober 2026. Sie sagt korrekt, dass sie nur für die Website gilt und die App eine eigene mitbringt. Die Formulierung «nie ins Ausland» wird durch den Hinweis zur Antwort-E-Mail sauber eingeschränkt.
- Rechtliche Aussagen, die ich für zutreffend halte: Art. 257a OR (nur vereinbarte Nebenkosten), Leerstand zulasten des Vermieters, Art. 28 DSG für die Datenherausgabe, Heizöl nach Verbrauch.
- «Nach dem Schweizer Datenschutzgesetz gebaut» ist eine Werbeaussage. Wichtig ist der Satz «Verantwortlich für die Daten Ihrer Mieter bleiben Sie»; er steht da.
- Der erste FAQ-Eintrag ist aufgeklappt, die anderen nicht. Die übrigen Antworten habe ich aufgeklappt gelesen.
- Die Dunkel-Varianten der Bilder haben einen leeren Alternativtext. Das ist bei Duplikaten korrekt.

## Aufgabe geschafft: ja

Fragebogen 1–24 beantwortet. Alle Behauptungen gelesen und, wo möglich, nachgerechnet oder technisch geprüft.

## Aufwand

Etwa 30 Minuten, 4 Skriptläufe: Text, Links, Netzwerk, Cookies; Durchscrollen, FAQ, Reiter, Speicher; Bilder in Originalgrösse; Nachrechnen.

## Ablauf

1. **Erster Bildschirm.** Erwartet: was, für wen, was kostet es. Gesehen: «Ihre Nebenkostenabrechnung, einfacher gemacht.», Kennzeile «Open Source · Gratis · Für die Schweiz», zwei Knöpfe, darunter der ehrliche Satz, dass jemand mit Computerkenntnissen einrichten muss (`00-first-screen.png`). Passt.
2. **Kennzahlen «CHF 0.– / 4 / 50 / 0».** Erwartet: belegbare Zahlen. Gesehen: «0 Daten gehen an uns» ist belegbar (siehe Beobachtungen). «50 Wohnungen» ist missverständlich (P-9).
3. **Nebenkostenabrechnung.** Erwartet: Zahlen, die aufgehen. Gesehen: Hans Müller, Wohnung 1.01, Nachzahlung CHF 215.80. Im PDF-Bild (`img-pdf-page-1.png`): Nebenkosten CHF 3'095.82 minus Akonto CHF 2'880.00 = 215.82, auf 5 Rappen abgerundet = 215.80. Das ist zugunsten des Mieters und stimmt. Die Anteile der Seite 1 habe ich nachgerechnet, Fläche 75.50 / 492.50 m² = 15.33 %: Allgemeinstrom 762.80 → 116.94, Kaltwasser 3'840.00 → 588.67, Hauswart 3'680.00 → 564.14, Gartenpflege 935.00 → 143.34, Kaminfeger 335.00 → 51.36, Kehricht 990 / 6 → 165.00, Heizung 6'957.80 × (0.7 × 15.33 % + 0.3 / 6) → 1'094.53. Alles stimmt auf den Rappen. Die Summe der Seite 1 ist 3'005.65; die restlichen 90.17 stehen vermutlich auf Seite 2, die nicht gezeigt wird.
4. **Rundung und Übertrag.** Erwartet: eine klare Regel. Gesehen: Die Rundung ist klar, der Übertrag unter CHF 5 steht unter einer Überschrift, die nicht zu ihm passt (P-2). Positiv ist «Die Schlussabrechnung nach dem Auszug gleicht jeden Betrag aus».
5. **Lift-Beispiel.** CHF 1'690.00 / 6 = 281.666… → 281.67. Das stimmt mit dem App-Bild (`img-statement-light.png`: Pro Einheit, 16.67 %, 365/365 Tage, CHF 281.67) überein. Aber 6 × 281.67 = 1'690.02 (P-8).
6. **Datenschutz-Abschnitt.** Erwartet: eine vollständige Liste der Datenabflüsse. Gesehen: Google-Anmeldung, Gebäuderegister des Bundes, E-Mails an Mieter, optional eine externe KI (`sec-datenschutz.png`). Vollständig, soweit ich es von aussen beurteilen kann. Bei der KI-Karte weiter oben steht die Aussage absolut (P-4).
7. **Installieren, drei Reiter.** Erwartet: ehrliche Voraussetzungen. Gesehen: PC mit 16 GB und Docker Desktop, Hinweis «läuft nur, wenn Ihr PC an ist»; NAS mit Domain und HTTPS wegen Google; Cloud mit Schweizer Rechenzentrum. Ehrlich. «Unsere Demo läuft in Zürich» passt nicht ganz zu Infomaniak in Genf im Impressum. Die Demo konnte ich nicht erreichen (siehe Nicht geprüft).
8. **Open Source und Vergleich.** Lizenz stimmig. Die Tabelle verallgemeinert über die Mitbewerber (P-3).
9. **Roadmap.** Vier von fünf Punkten haben ein Issue (P-6).
10. **FAQ.** Kosten, Grösse und KI-Fehler sauber beantwortet. Rechtlich geprüft: ausweichend (P-1). Demo: «13 Wohnungen, jede Nacht zurückgesetzt».
11. **Impressum.** Betreiber, E-Mail, Hoster, Lizenz, Gewährleistungsausschluss «soweit das Gesetz es zulässt», Hinweis auf erfundene Demodaten, Schrift- und Icon-Lizenzen. Vollständig für meinen Zweck (Postadresse auftragsgemäss nicht beurteilt).
12. **Datenschutzerklärung.** Gegen die Netzwerk- und Speicherbeobachtung geprüft: stimmt.

## Verwirrung

- «Mietstage»: Ich kenne «Miettage».
- «Keine Limite pro Wohnung»: Meint das eine Grenze an Wohnungen oder eine Gebühr pro Wohnung?
- «Entwurf» im MCP-Beispiel: Muster oder Abrechnungsstatus?
- «Verordnung über die Miete»: Gemeint ist wohl die VMWG.
- «OpenAI-kompatible KI», «Model Context Protocol»: für mich nur ungefähr verständlich, aber als «Geplant» bzw. für die Helferperson gekennzeichnet.

## Fehlerrisiken

- Ein Vermieter liest die FAQ als «rechtlich geprüft» und versendet Abrechnungen ungeprüft (P-1).
- Ein Vermieter behält ein Guthaben von CHF 4.95 zurück und hält das für mieterfreundlich. Der Mieter verlangt es und hat vermutlich Anspruch darauf (P-2).
- Wer auf einem kleinen NAS mit externer KI arbeitet, glaubt wegen «Ihre Belege verlassen den Server nicht», es gehe nichts hinaus (P-4).
- Ein Mitbewerber beanstandet die Vergleichstabelle (P-3).

## Vorschläge

- **P-1:** Startseite → «Fragen» → «Ist Dwello rechtlich geprüft?» aufklappen. Vorschlag: «Nein, nicht von einer Juristin oder einem Verband. Dwello setzt die Regeln von Art. 257a–257b OR und der VMWG um und prüft sie mit automatischen Tests. Prüfen Sie jede Abrechnung; bei Fragen helfen …»
- **P-2:** Abschnitt «Nebenkostenabrechnung», dritter Punkt. Rundung und Übertrag trennen. Für den Übertrag sagen, dass er eine Vereinfachung ist und dass der Mieter die Auszahlung verlangen kann, falls Dwello das erlaubt. Sonst die Formulierung «zugunsten der Mieter» auf die Rundung beschränken.
- **P-3:** Abschnitt «Open Source», Tabelle «Dwello im Vergleich». «Daten weg» ersetzen durch «abhängig vom Anbieter»; «in der Cloud» durch «meist beim Anbieter». «bei Ihnen» ergänzen mit «oder bei Ihrem Hoster».
- **P-4:** Abschnitt «Rechnungen und KI», Karte «Lokale KI mit Ollama». Vorschlag: «Mit der lokalen KI verlassen Ihre Belege den Server nicht. Wer eine externe KI einträgt, schickt sie dorthin.»
- **P-5:** Abschnitt «Alles auf einen Blick», Karte «Barrierefrei». Vorschlag: «Auf WCAG 2.2 AA ausgerichtet; jede Ansicht automatisch mit axe geprüft …»
- **P-6:** Abschnitt «Roadmap», «Berichte und Auswertungen»: ein Issue anlegen und verlinken, oder die Einleitung anpassen.
- **P-7:** Nebenkostenabrechnung, FAQ und Impressum mit derselben Nennung: «Obligationenrecht (Art. 257a–257b OR) und Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen (VMWG)».
- **P-8:** Abschnitt «Verteilschlüssel», Satz zum Lift. Einen Halbsatz ergänzen, wie Dwello die Rundungsdifferenz behandelt, oder ein Beispiel ohne Rest wählen.
- **P-9:** Kennzahl «50» beschriften mit «Wohnungen: empfohlen bis 50» (oder «höchstens», wenn es eine Grenze ist); «keine Limite pro Wohnung» ersetzen durch «keine Gebühr pro Wohnung».
- **P-10:** MCP-Beispiel: Abzeichen «Entwurf» ersetzen durch «Beispiel (geplant)».
- **P-11:** Bildunterschrift Heizprofil: «Profil Heizung mit Warmwasser: Januar 13.6 %, August 3.6 %».

## Nicht geprüft

- Die Demo `https://demo.dwello.ch/dashboard` und ihre eigene Datenschutzerklärung: Die Verbindung wurde vom Netz dieser Umgebung abgelehnt.
- Die GitHub-Links (Anleitung, LICENSE, Issues #495–#498): kein Zugriff nach aussen. Insbesondere konnte ich nicht prüfen, ob die Issues zu den Roadmap-Punkten passen.
- Seite 2 des PDF (die restlichen CHF 90.17): nicht auf der Website abgebildet.
- Die fr/it/en-Fassungen: nur geprüft, dass sie antworten (Status 200), nicht inhaltlich.
- Ob die App selbst so wenig nach aussen sendet, wie die Seite sagt: Das ist eine Aussage über die App, nicht über die Website, und lässt sich hier nicht prüfen.
- Tastaturbedienung und Fokus: nicht meine Eingabeart.
