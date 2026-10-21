# Dr. Weber – Landing Page (öffentliche Website)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus.
Aufgabe: die öffentliche Website (http://localhost:3310/index.html, dazu `/impressum.html` und `/datenschutz.html`) mit dem Fragebogen `landing-fragebogen.md` beurteilen; jede Aussage zu Datenschutz, «gratis», Open Source/AGPL, QR-Rechnung, Rechtmässigkeit der Nebenkostenabrechnung und «Geplant» gegen «Verfügbar» prüfen. Nichts gespeichert.
Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/weber-landing/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Startseite, «Nebenkostenabrechnung» | «Auf 5 Rappen gerundet, zugunsten der Mieter» mit dem Satz «Kleinstbeträge unter CHF 5 werden weder gefordert noch ausbezahlt». Ein Guthaben von CHF 4.95 nicht auszubezahlen ist nicht «zugunsten der Mieter»; für das Zurückbehalten von Akonto-Überschüssen kenne ich keine Grundlage im OR oder in der VMWG. |
| P-2 | Major | Startseite, Kennzahlen und «Datenschutz» | «100 % Ihrer Daten bleiben auf Ihrem Server» und «Sie bleiben auf Ihrem Gerät» stimmen nicht mit der eigenen Seite überein: Anmeldung über Google, Adresssuche im Gebäuderegister, Versand per E-Mail, wahlweise externe KI und (geplant) Claude/ChatGPT über MCP. |
| P-3 | Major | Startseite, Hero, «Datenschutz», FAQ | Dass heute ein Google-Konto und ein selbst eingerichteter OAuth-Schlüssel nötig sind, steht nur in einem Kasten im Reiter «Eigener PC» unter «Installieren». Der Hero sagt «ohne Konto bei uns», und weder der Abschnitt Datenschutz noch die FAQ erwähnen Google. |
| P-4 | Major | Impressum, Datenschutzerklärung | Als Betreiber und Verantwortlicher steht nur «Roger Rudin, Schweiz» mit einer E-Mail-Adresse. Es fehlt eine Postadresse (Kontaktadresse nach UWG Art. 3 Abs. 1 lit. s, Kontaktdaten des Verantwortlichen nach DSG Art. 19 Abs. 2 lit. a). |
| P-5 | Major | Startseite, «Nebenkostenabrechnung» und FAQ «Ist Dwello rechtlich geprüft?» | «Dwello rechnet so, wie es das Mietrecht verlangt» steht ohne Einschränkung da. Die FAQ antwortet auf «rechtlich geprüft?» mit automatischen Tests, sagt also nicht offen, dass niemand vom Fach es geprüft hat. Der klare Hinweis «Prüfen Sie Ihre Abrechnungen, bevor Sie sie versenden» steht nur im Impressum. |
| P-6 | Minor | Startseite, Kennzahlen und «Barrierefrei nach WCAG 2.2 AA» | «0 Verstösse gegen WCAG 2.2 AA» stützt sich laut eigenem Text auf axe. Ein automatischer Test findet nur einen Teil der Verstösse; die Aussage verspricht mehr, als sie belegt. |
| P-7 | Minor | Startseite, «Geplant · MCP» | Das Etikett heisst «Geplant», aber die Punkte darunter stehen in der Gegenwart: «Läuft auf Ihrem Server. Der MCP-Server ist Teil der Installation.», «Er liest nur, was Sie freigeben». |
| P-8 | Minor | Startseite, Tabelle «Dwello im Vergleich zu typischen Verwaltungs-Abos» | «Wenn der Anbieter aufhört: Daten weg» und «Quellcode prüfbar: nein» verallgemeinern über Mitbewerber, die nicht genannt werden. Das kann ein herabsetzender oder irreführender Vergleich sein (UWG Art. 3 Abs. 1 lit. e). |
| P-9 | Minor | Startseite, Hero und «Installieren» | Der Befehl im Hero (`docker compose … up -d`) läuft allein nicht: Vorher braucht es `git clone` und `.env`, danach den Download des Modells und den Google-OAuth-Schlüssel. «Ein Docker-Befehl» und «Rund 15 Minuten» stellen das zu einfach dar. |
| P-10 | Minor | Startseite, «Datenschutz» | Die Überschrift «Nach dem Schweizer Datenschutzgesetz gebaut» liest sich wie ein Versprechen, dass ich als Vermieter damit gesetzeskonform bin. Dass ich als Verantwortlicher selbst haften muss, steht nur im Impressum und in der Datenschutzerklärung. |
| P-11 | Minor | Startseite, Kennzahl «CHF 0.– für immer» und FAQ «Kostet Dwello wirklich nichts?» | Mit «für immer» und «keine Funktion, die später kostenpflichtig wird» gibt eine Einzelperson ein Versprechen ab, das sie nicht absichern kann (gesichert ist nur, dass der heutige Code unter der AGPL frei bleibt). Die FAQ nennt nicht alle Folgekosten: Briefporto, Hardware mit 16 GB Arbeitsspeicher. |
| P-12 | Nit | Startseite, «Verteilschlüssel und Heizprofile» | «Für Mittelland, Bergregion und Tessin ist je ein Profil dabei», die Kachel «Heizkosten mit Heizprofil» nennt vier Profile («… oder Heizung mit Warmwasser»), und der Screenshot zeigt das Profil mit Warmwasser. |
| P-13 | Nit | Fusszeile, Impressum | Die Lizenz heisst einmal «AGPL-3.0» (Fusszeile, Vergleichstabelle) und einmal «AGPL-3.0-or-later» (Impressum). |
| P-14 | Nit | Fusszeile, Spalte «Wissen» | «Nebenkosten abrechnen», «Verteilschlüssel» und «QR-Rechnung» sehen wie Fachartikel aus, führen aber alle nur zum Anker `#funktionen`. |

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Eine kostenlose Open-Source-Software, die ich selbst auf meinem Rechner betreibe und mit der ich die Nebenkostenabrechnung für meine Mietwohnungen erstelle und mit QR-Rechnung versende. (Hero)
2. **Für wen? (4/5)** Gemeint sind private Vermieterinnen und Vermieter mit bis zu 50 Wohnungen; mit meinen Liegenschaften fühle ich mich angesprochen. Einen Punkt ziehe ich ab, weil auf dem ersten Bildschirm ein Terminal-Befehl steht: Das richtet sich an Techniker, nicht an mich. (Hero)
3. **Was als Nächstes?** «Demo ansehen». Ich installiere nichts, bevor ich gesehen habe, wie eine Abrechnung aussieht und ob sie stimmt. Danach würde ich «Datenschutz» und «Fragen» lesen. (Hero)
4. **Vertrauenswürdig? (3/5)** Die Seite ist ruhig und sachlich gestaltet, ohne Werbegetöse. Die Zeile «Open Source · Gratis · Für die Schweiz» und «100 % Ihrer Daten» machen mich aber eher misstrauisch, und hinter dem Angebot steht laut Fusszeile eine einzelne Person ohne Adresse. (Hero, Fusszeile)

### B. Verständlichkeit

5. **Texte verständlich? (4/5)** Die Sprache ist klar, und die Sätze sind kurz. Ohne Nachschlagen verstehe ich nicht: «Docker», «Ollama», «OpenAI-kompatible KI», «MCP / Model Context Protocol», «OAuth-Schlüssel», `.env`, «axe», «WCAG 2.2 AA», die Formelschreibweise `{area_total}`. «Mietstage» und «Heizprofil» kann ich mir herleiten. (Rechnungen und KI, Verteilschlüssel, Installieren)
6. **Verfügbar oder geplant? (3/5)** Die Kacheln mit «Verfügbar» und «Geplant» und die Roadmap mit Issue-Nummern sind vorbildlich. Der MCP-Abschnitt beschreibt aber in der Gegenwart, was erst geplant ist (P-7). Mahnwesen und Versand stehen im Fliesstext als vorhanden, in der Übersicht «Alles auf einen Blick» fehlt das Mahnwesen jedoch ganz, sodass ich es nicht abgleichen kann. (Alles auf einen Blick, Geplant · MCP, Roadmap)
7. **Zeigen die Bilder die Arbeit? (4/5)** Ja, und ich habe nachgerechnet: Beim Lift ergeben CHF 1'690.00 «Pro Einheit» mit 16.67 % genau CHF 281.67, also 1/6. Der QR-Zahlteil und die erste Seite des PDFs sind zu klein, um sie zu lesen. Im Upload-Bild steht englisch «Choose Files / No file chosen». (Nebenkostenabrechnung, Swiss QR-Rechnung)

### C. Nutzen und Bedenken

8. **Welches Problem gelöst, welches nicht?** Gelöst würden die Verteilung nach Schlüssel, die tagesgenaue Abgrenzung bei Mieterwechsel, Heizkosten nach Profil, PDF mit QR-Zahlteil und das Mahnwesen. Nicht gelöst sind ein Export meines Bestands (nur geplant), Auswertungen für die Steuererklärung (geplant) und eine fachliche Prüfung der Rechtslage.
9. **Was überzeugt am meisten?** Der Hinweis auf Art. 257a OR (nur vereinbarte Nebenkosten) ist korrekt, ebenso der Satz, dass die Nebenkosten leerer Wohnungen der Vermieter trägt. Dazu kommt, dass jede Zahl in der Abrechnung erklärt wird. Und die Website lädt tatsächlich nichts von fremden Servern (siehe Beobachtungen).
10. **Bedenken, beantwortet?** Eine Rechtssicherheit gibt es nicht, und die FAQ weicht der Frage aus (P-5). Wohin meine Daten und die Daten meiner Mieter gehen (Google, Gebäuderegister, E-Mail), beantwortet die Seite widersprüchlich (P-2, P-3). Wer haftet, steht nur im Impressum. Die Rundung «unter CHF 5» halte ich für rechtlich heikel (P-1). Für die Installation bräuchte ich Hilfe; das sagt die FAQ immerhin offen.
11. **Datenschutz und «gratis» glaubwürdig? (3/5)** «Gratis» glaube ich wegen der AGPL, nicht aber «für immer» (P-11). Beim Datenschutz glaube ich, dass der Anbieter nichts erfährt; «100 % bleiben auf Ihrem Server» ist aber nachweislich zu absolut (P-2).

### D. Weg zum Start

12. **Wie anfangen? (3/5)** So habe ich es verstanden: 1. Docker Desktop installieren, 2. `git clone`, 3. `.env` kopieren und «Ihre E-Mail, Schlüssel» eintragen (welche Schlüssel, steht nicht da), 4. `docker compose … up -d`, 5. Modell laden (6 GB), 6. bei Google einen OAuth-Schlüssel einrichten (wie, steht nicht da), 7. http://localhost:3000 öffnen. Der Hero-Befehl allein genügt nicht (P-9).
13. **Installation selbst?** Nein. Ich bräuchte meinen Neffen oder einen IT-Dienstleister, vor allem für den Google-OAuth-Schlüssel und für den Fall, dass ich vom Handy aus zugreifen will (Homeserver).
14. **Gefunden, was gesucht? (4/5)** Die Navigation, der Sprachwechsel DE/FR/IT/EN, das Impressum und die Datenschutzerklärung sind schnell gefunden. Im Impressum fehlt aber die Postadresse (P-4), und die Links unter «Wissen» führen ins Leere (P-14).

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? (4/5)** Am Desktop ist alles gut lesbar, mit grosser Schrift und gutem Kontrast. Die eingebetteten Bilder der App (Abrechnung, PDF, QR-Teil) sind für mich zu klein, um die Zahlen ohne Zoom zu prüfen.
16. **Länge?** Eher zu lang. Gründlich gelesen habe ich alles, weil ich das immer tue; die Abschnitte «Einfach zu bedienen» (48 px, 7 : 1) und die Kennzahl «609 Prüf-Szenarien» sagen mir als Vermieter nichts und könnten wegfallen.

### F. Gesamturteil

17. **Ausprobieren? (3/5)** Die Demo ja, eine Installation erst, wenn jemand sie mir einrichtet und ich eine Musterabrechnung von Hand nachgerechnet habe.
18. **Empfehlen? (2/5)** Einer Bekannten, die keine Technik hat, nicht ohne Begleitung. Wegen der Google-Pflicht und der unklaren Rundungsregel würde ich ausdrücklich warnen.
19. **Als Erstes ändern:** Die Aussagen zum Datenschutz ehrlich machen: «100 %» streichen und an einer Stelle aufzählen, welche Daten Ihren Server verlassen (Google-Anmeldung, Gebäuderegister, E-Mail, externe KI).

## Beobachtungen

- Netzwerk: Beim Aufruf von Startseite, Impressum und Datenschutzerklärung gingen nur Anfragen an `localhost:3310` (HTML, WebP-Bilder, die eigene Schrift `fonts/inter-latin.woff2`). Es gab keine externe Anfrage, die Aussage «lädt nichts von fremden Servern» stimmt also. Die Seite setzt kein Cookie und schreibt nichts in den localStorage; die einzigen Cookies im Browser stammen vom Test-Werkzeug (Domain `localhost`) und gehören nicht zur Seite.
- «Art. 28 DSG» für die Datenherausgabe ist richtig zitiert (Recht auf Datenherausgabe und -übertragung). Die Antwortfrist von 30 Tagen in der Datenschutzerklärung stimmt mit der DSV überein, und die Adresse des EDÖB (Feldeggweg 1, 3003 Bern) ist korrekt.
- Die Datenschutzerklärung trennt sauber zwischen Website und selbst betriebener App und verweist für die Mieterdaten auf die Verantwortung des Vermieters. Das ist gut gemacht, auf der Startseite kommt diese Abgrenzung aber zu kurz (P-10).
- «Kosten, die Sie nicht auf die Mieter umlegen dürfen, kommen nicht in die Abrechnung»: Unklar bleibt, wer das entscheidet, die KI oder ich. Die Seite sagt an anderer Stelle «Sie entscheiden», hier nicht.
- Im MCP-Beispiel tauchen Claude und ChatGPT auf, also Anbieter mit Sitz im Ausland. Zur Bekanntgabe von Mieterdaten ins Ausland sagt die Seite nichts; da die Funktion geplant ist, notiere ich es nur.
- Die Roadmap «Link zum Quellcode in der App … wie es die AGPL verlangt» (#498) zeigt, dass diese Pflicht heute noch nicht in der App umgesetzt ist. Für mich als Nutzer einer unveränderten Fassung ist das unkritisch, aber ehrlich offengelegt.
- «Für Liegenschaften bis 50 Wohnungen» (Hero) und «keine Limite pro Wohnung» (Open Source) lesen sich auf den ersten Blick widersprüchlich; gemeint sind Eignung und Preis.
- Das Datum der Datenschutzerklärung ist der 21. Oktober 2026, also heute.
- Bei den dunklen Varianten der App-Bilder ist der Alternativtext leer. Das ist vermutlich Absicht (Doppel der hellen Bilder); geprüft habe ich es nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten Lesezeit, 3 Skripte (Seiten laden und Text auslesen, Netzwerk und Cookies prüfen, Abschnitte fotografieren), 9 Bildschirmfotos.

## Ablauf

1. **Startseite öffnen.** Erwartet: eine Aussage, was es kostet und wer dahintersteht. Gesehen: «Ihre Liegenschaft. Ihre Daten. Ihr Server.», zwei Schaltflächen und darunter ein Terminal-Befehl; die Kosten stehen klein darunter (Bild `01-hero.png`).
2. **Kennzahlen.** Erwartet: Fakten. Gesehen: «CHF 0.– für immer», «0 Verstösse gegen WCAG», «100 % Ihrer Daten». Zwei davon halte ich für nicht belegt (P-2, P-6).
3. **Rechnungen und KI.** Erwartet: wer was entscheidet. Gesehen: «Erst wenn Sie bestätigen, wird die Rechnung erstellt», klar und gut. Im Bild steht englisch «Choose Files».
4. **Nebenkostenabrechnung.** Erwartet: korrekte Rechtsgrundlagen. Gesehen: Art. 257a OR und die Regel zum Leerstand stimmen; bei der Rundung fand ich den Widerspruch P-1. Die Lift-Position im Bild habe ich nachgerechnet, sie stimmt (Bild `10-section.png`).
5. **Verteilschlüssel und Heizprofile.** Erwartet: nachvollziehbare Monatsanteile. Gesehen: Profil von Januar 13.6 % bis August 3.6 %, Summe 100 %. Die Zahl der Profile widerspricht sich (P-12) (Bild `11-section.png`).
6. **QR-Rechnung und Mahnwesen.** Erwartet: lesbarer Zahlteil. Gesehen: PDF und QR-Teil zu klein zum Prüfen.
7. **Alles auf einen Blick.** Erwartet: eine vollständige Liste. Gesehen: 13 «Verfügbar» und 2 «Geplant», das Mahnwesen fehlt in der Liste.
8. **Datenschutz.** Erwartet: wohin die Daten gehen. Gesehen: «Sie bleiben auf Ihrem Gerät, nichts geht an uns». Google, Gebäuderegister und E-Mail werden nicht erwähnt (P-2, P-3) (Bild `13-section.png`).
9. **Geplant · MCP.** Erwartet: klar als Zukunft beschrieben. Gesehen: Etikett «Geplant», Text in der Gegenwart (P-7).
10. **Installieren.** Erwartet: was ich brauche. Gesehen: vier Befehle, 16 GB Arbeitsspeicher, 15 Minuten und erst im Kasten unten die Google-Anmeldung.
11. **Open Source und Vergleich.** Erwartet: was die AGPL für mich heisst. Gesehen: knapp und im Kern richtig erklärt; die Vergleichstabelle verallgemeinert über Mitbewerber (P-8).
12. **FAQ.** Erwartet: ein ehrliches «Nein» auf die Frage nach der rechtlichen Prüfung. Gesehen: Verweis auf automatische Tests (P-5).
13. **Impressum.** Erwartet: Name und Postadresse. Gesehen: «Roger Rudin, Schweiz» und eine E-Mail-Adresse (P-4). Der Haftungshinweis ist gut formuliert.
14. **Datenschutzerklärung.** Erwartet: Verantwortlicher, Zwecke, Empfänger, Rechte. Gesehen: alles vorhanden und sauber, ausser der Postadresse.
15. **Netzwerk und Cookies geprüft.** Siehe Beobachtungen; die Aussagen der Datenschutzerklärung zur Website stimmen.

## Verwirrung

- «Ohne Konto bei uns» (Hero) gegen «Heute noch mit Google-Anmeldung» (Installieren): Brauche ich nun ein Konto oder nicht?
- «Ein Docker-Befehl» gegen vier Befehle und die Einrichtung eines OAuth-Schlüssels.
- «Einstellungen übernehmen (Ihre E-Mail, Schlüssel)»: Welche Schlüssel?
- «Auf 5 Rappen gerundet» und «unter CHF 5» sind zwei verschiedene Regeln unter einer Überschrift.
- «Umlagefähig»: Wer bestimmt das, die KI oder ich?
- «MCP», «Ollama», «OpenAI-kompatibel», «axe», «WCAG»: ohne Erklärung.
- «Wissen» in der Fusszeile verspricht Erklärartikel, die es nicht gibt.

## Fehlerrisiken

- Ein Vermieter verlässt sich auf «rechnet so, wie es das Mietrecht verlangt» und prüft nicht mehr selbst; im Streitfall bei der Schlichtungsbehörde trägt er das Risiko.
- Ein Mieter hat ein Guthaben unter CHF 5, das nicht ausbezahlt wird; das kann eine Beanstandung oder Streit auslösen.
- Ein Vermieter erklärt seinen Mietern in seiner eigenen Datenschutzerklärung, alle Daten blieben bei ihm, obwohl die Anmeldung über Google läuft und E-Mails über einen Anbieter gehen.
- Ein Leser kopiert den Hero-Befehl, und er schlägt fehl, weil Repository und `.env` fehlen.

## Vorschläge

- **P-1:** Startseite, Abschnitt «Nebenkostenabrechnung», dritter Punkt lesen. Hilfreich wäre, die zwei Regeln zu trennen und ehrlich zu benennen: «Auf 5 Rappen gerundet» und, falls es die Regel wirklich gibt, «Beträge unter CHF 5 werden nicht eingefordert»; ein Guthaben des Mieters sollte immer ausbezahlt oder verrechnet werden. Die Regel bitte fachlich prüfen lassen und «zugunsten der Mieter» nur stehen lassen, wo es stimmt.
- **P-2:** Kennzahl «100 % Ihrer Daten bleiben auf Ihrem Server» und den Einleitungssatz im Abschnitt Datenschutz lesen. Hilfreich wäre, die Kennzahl zu streichen oder zu ersetzen (etwa «0 Daten an uns») und im Abschnitt Datenschutz einen Punkt «Was Ihren Server verlässt» zu ergänzen: Google-Anmeldung, Adressabfrage im Gebäuderegister, Versand per E-Mail über Ihren Anbieter, externe KI nur auf Wunsch.
- **P-3:** Hero lesen («ohne Konto bei uns»), dann unter «Installieren» den Kasten «Heute noch mit Google-Anmeldung» suchen. Hilfreich wäre eine FAQ «Brauche ich ein Google-Konto?» und ein Hinweis im Abschnitt Datenschutz.
- **P-4:** `/impressum.html` und `/datenschutz.html` öffnen, Abschnitt «Betreiber» bzw. «Verantwortlich». Hilfreich wäre eine vollständige Postadresse (Strasse, PLZ, Ort).
- **P-5:** Startseite, «Eine Abrechnung, die jede Zahl erklärt», dann die FAQ «Ist Dwello rechtlich geprüft?». Hilfreich wäre eine Einschränkung im Haupttext («Dwello rechnet nach den Regeln von OR und VMWG; prüfen Sie jede Abrechnung vor dem Versand») und in der FAQ als erstes Wort ein klares «Nein, nicht von einer Fachperson».
- **P-6:** Kennzahl «0 Verstösse gegen WCAG 2.2 AA». Hilfreich wäre: «0 Befunde der automatischen Prüfung (axe) nach WCAG 2.2 AA».
- **P-7:** Abschnitt «Geplant · MCP», die Punkte unter dem Text. Hilfreich wäre die Zukunftsform («wird Teil der Installation», «soll nur lesen, was Sie freigeben»).
- **P-8:** Vergleichstabelle unter «Open Source». Hilfreich wäre, die Zeilen «Wenn der Anbieter aufhört» und «Quellcode prüfbar» vorsichtiger zu formulieren («hängt vom Anbieter ab») oder die Tabelle auf Dwellos eigene Merkmale zu beschränken.
- **P-9:** Hero, Befehl kopieren. Hilfreich wäre, den Befehl im Hero wegzulassen oder durch «Anleitung in 4 Schritten» zu ersetzen und unter «Zeitaufwand» die Google-Einrichtung mitzuzählen.
- **P-10:** Überschrift im Abschnitt Datenschutz. Hilfreich wäre ein Satz direkt darunter: «Verantwortlich für die Daten Ihrer Mieter sind Sie; Dwello hilft Ihnen dabei.»
- **P-11:** Kennzahl «CHF 0.– für immer» und die FAQ zu den Kosten. Hilfreich wäre, «für immer» durch «unter der AGPL frei, auch künftig» zu ersetzen und in der FAQ Porto für Briefe und die Hardware zu nennen.
- **P-12:** Abschnitt «Verteilschlüssel und Heizprofile» und die Kachel «Heizkosten mit Heizprofil» vergleichen. Hilfreich wäre, an beiden Stellen dieselben vier Profile zu nennen.
- **P-13:** Fusszeile und Impressum vergleichen. Hilfreich wäre, überall «AGPL-3.0-or-later» zu schreiben.
- **P-14:** Fusszeile «Wissen» anklicken. Hilfreich wäre, die Links auf die passenden Abschnitte zu richten oder die Spalte zu entfernen, bis es Artikel gibt.

## Nicht geprüft

- Die Demo unter demo.dwello.ch und GitHub: Die Seite verlinkt sie, sie liegen aber ausserhalb der lokal ausgelieferten Website, und die Aufgabe beschränkte sich auf die Landing Page.
- Die Sprachversionen FR, IT und EN: nicht gelesen, die Aufgabe galt der deutschen Seite.
- Das Hosting bei Infomaniak, das Impressum und Datenschutzerklärung nennen: Lokal ausgeliefert lässt sich das nicht nachprüfen.
- Ob die App die Rundungsregel (P-1) tatsächlich so anwendet und ob das Mahnwesen verfügbar ist: Die App war nicht Teil dieser Aufgabe.
- Ob die dunklen Bildvarianten bewusst einen leeren Alternativtext haben.
