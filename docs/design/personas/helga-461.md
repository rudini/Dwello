# Persona-Review: Helga, Übersetzungen für Verteilschlüssel und Heizprofil, Suche, Hilfe (#461)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Sprache der Oberfläche: Deutsch (nicht geändert).
Gespeichert habe ich nur einen Verteilschlüssel und ein Heizprofil, beide mit «Helga» im Namen. Screenshots und Skripte liegen in `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-461/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Verteilschlüssel-Liste, Heizprofil-Liste, Heizprofil-Detailansicht | Den gespeicherten französischen Namen sehe ich nur im Formular «Bearbeiten». Die Listen und die Detailansicht des Heizprofils zeigen ihn nicht. Ob er gespeichert ist, sehe ich also erst, wenn ich ein Formular öffne, in dem ich aus Versehen etwas ändern kann. |
| P-2 | Nit | Neuer Verteilschlüssel / Neues Heizprofil, Abschnitt «Übersetzungen» | «Ihn zeigt … Dwello in dieser Sprache» habe ich erst beim zweiten Lesen verstanden. Gemeint ist wohl, dass Dwello selbst auf Französisch eingestellt ist. Wo ein Mieter seine Sprache bekommt, steht dort nicht. Ich habe es im Mieterformular gefunden («Sprache für Abrechnung und Mahnungen»). |

## Beobachtungen

- Wenn ich die Formel `{volume}` teste, zeigt die Tabelle die Beispielwohnungen nur mit m² und Zimmern («50 m², 2 Zimmer 14.49 %»). Ein Volumen steht nicht dabei. Ich kann also nicht prüfen, ob nach Volumen gerechnet wird.
- Einen Verteilschlüssel öffne ich aus der Liste direkt im Formular «bearbeiten». Ein Heizprofil öffne ich erst in einer Ansicht mit «Bearbeiten» und «Löschen». Die beiden verhalten sich verschieden.
- Die Brotkrümel beim Bearbeiten des Heizprofils beginnen mit «Heizprofile», ohne «Einstellungen». Beim Erfassen steht «Einstellungen» davor.
- Bei den Monatsfeldern verschwindet die «0», sobald ich hineinklicke. So wurde aus meiner 16 kein «016». Die Summe darunter («Summe: 100 % – stimmt») hat mir Sicherheit gegeben.
- Nach dem Speichern kam jedes Mal eine Meldung wie «Verteilschlüssel «Nach Raumvolumen Helga» gespeichert». Das hat mich beruhigt.
- In der Hilfe kommen Übersetzungen nicht vor. Nötig war das nicht, denn der Text am Feld hat gereicht.
- Auf dem ganzseitigen Screenshot des Formulars liegt die obere Leiste mitten über dem Feld «Formel». Das kommt vom ganzseitigen Screenshot, beim normalen Scrollen nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten in 12 Schritten: Einstellungen, Verteilschlüssel erfassen, Formel testen, speichern, wieder öffnen, Heizprofil erfassen, speichern, wieder öffnen, zwei Suchen, Hilfe lesen, Mieterformular ansehen (nur angesehen, nicht gespeichert).

## Ablauf

1. **Einstellungen öffnen.** Erwartet: einen Ort für Verteilschlüssel. Gesehen: «Stammdaten» mit «Verteilschlüssel» und «Heizprofile», jeweils mit einem Satz Erklärung. Das war gut.
2. **Verteilschlüssel erfassen.** Erwartet: ein Feld für den Namen und eine Auswahl «nach Volumen». Gesehen: ein Formular mit einer Formel und Knöpfen für die Bausteine. Ich habe die Formel geleert und auf «{volume} Raumvolumen in m³» geklickt. Danach stand `{volume}` im Feld. Das ging, obwohl mir eine Formel zuerst Angst macht.
3. **Formel testen.** Erwartet: Ich sehe, wie verteilt wird. Gesehen: vier Beispielwohnungen mit Prozenten, aber nur mit m² und Zimmern beschrieben (siehe Beobachtungen).
4. **Französischer Name.** Erwartet: irgendwo «Französisch». Gesehen: weiter unten den Abschnitt «Übersetzungen» mit drei Feldern «Französisch (optional)», «Italienisch (optional)» und «Englisch (optional)» nebeneinander und einem Satz Erklärung darüber. Ich habe «Selon le volume» eingetragen.
5. **Speichern.** Erwartet: eine Bestätigung. Gesehen: Ich war zurück in der Liste, mein Schlüssel stand zuoberst («Eigener Verteilschlüssel, 0 Rechnungen») und daneben die Meldung «gespeichert». Den französischen Namen zeigt die Liste nicht (P-1).
6. **Wieder öffnen.** Erwartet: Ich sehe den französischen Namen. Gesehen: ein Klick auf den Namen öffnet «Nach Raumvolumen Helga bearbeiten». Im Feld Französisch steht «Selon le volume». Er ist also gespeichert.
7. **Heizprofil erfassen.** Erwartet: zwölf Monate zum Ausfüllen. Gesehen: zwölf Felder mit 0, eine laufende Summe und ein Balkenbild. Ich habe eingetragen: 16, 14, 12, 9, 5, 2, 1, 1, 3, 9, 13, 15. Die Summe zeigte «100 % – stimmt». Dazu den französischen Namen «Chauffage Helga».
8. **Speichern.** Erwartet: wie beim Schlüssel zurück zur Liste. Gesehen: eine Ansicht «Heizung Helga» mit Balken, «Summe 100 %» und «gespeichert». Den französischen Namen zeigt sie nicht (P-1). Nach «Bearbeiten» stand «Chauffage Helga» im Feld.
9. **Suche «Appartement EG Alpenblick».** Erwartet: Vielleicht findet die deutsche Seite das französische Wort nicht. Gesehen: «1 Wohnung», nämlich Wohnung EG, Alpenblick, EG, 3 Zimmer, 72 m². Das ist richtig.
10. **Suche «Wohnung OG1 Alpenblick».** Erwartet: genau eine Wohnung. Gesehen: «1 Wohnung», nämlich Wohnung OG1, Alpenblick, 1. OG, 4 Zimmer, 98 m². Das ist richtig. Der Text über dem Suchfeld («Mehrere Wörter grenzen die Suche ein …») hat mir gesagt, dass ich Gebäude und Nummer zusammen eingeben darf.
11. **Hilfe, «Kündigungsfrist».** Erwartet: eine einfache Erklärung. Gesehen, unter «Begriffe kurz erklärt»: «Die Zeit zwischen dem Eingang der Kündigung und dem Kündigungstermin. Für Wohnungen sind es mindestens 3 Monate …». Dazu, was gilt, wenn die Kündigung zu spät kommt, und wann der Vertrag früher endet. Das habe ich verstanden. Der Begriff «Kündigungstermin» steht gleich davor erklärt, das hilft.

## Verwirrung

- **«Übersetzungen»:** Ich habe verstanden, dass ich dort den Namen auf Französisch, Italienisch und Englisch eintragen kann. Ein französischsprachiger Mieter sieht ihn dann auf seiner Nebenkostenabrechnung, beim Heizprofil nur, wenn er im Jahr ein- oder auszieht. «(optional)» sagt mir, dass ich die Felder nicht ausfüllen muss. «Fehlt er, steht der deutsche Name» sagt mir, was passiert, wenn ich sie leer lasse: Der Mieter liest dann «Nach Raumvolumen Helga». Das ist klar.
- **«ebenso Dwello in dieser Sprache»:** Hier habe ich gestutzt (P-2). Ich habe Dwello nie auf Französisch umgestellt und musste raten, dass die Sprache oben rechts («Deutsch») gemeint ist.
- **«Mieter mit dieser Sprache»:** Ich wusste nicht, wo ein Mieter eine Sprache hat. Im Mieterformular habe ich «Sprache für Abrechnung und Mahnungen» gefunden. Ein Hinweis darauf beim Abschnitt «Übersetzungen» hätte mir das Suchen erspart.
- **`{volume}`:** Ob Dwello das Volumen meiner Wohnungen kennt, steht nirgends. Beim Testen sehe ich nur m² und Zimmer.

## Fehlerrisiken

- Ich trage den französischen Namen ein, sehe ihn danach in keiner Liste und denke, er sei verloren. Dann öffne ich das Formular erneut und tippe ihn zweimal oder falsch ein (P-1).
- Ein Mieter hat noch «Deutsch» als Sprache. Dann nützt der französische Name nichts, und ich merke es erst an der Abrechnung (P-2).
- Ich lege einen Volumen-Schlüssel an, obwohl bei den Wohnungen kein Volumen erfasst ist. Die Testtabelle warnt mich nicht.

## Vorschläge

- **P-1:** Einstellungen, Verteilschlüssel erfassen, Name und «Französisch (optional)» ausfüllen, speichern. Die Liste zeigt nur den deutschen Namen. Beim Heizprofil ebenso, auch in der Detailansicht nach dem Speichern. Hilfreich wäre es, die Übersetzungen in der Detailansicht des Heizprofils und in der Liste unter dem Namen klein aufzuführen, etwa «Französisch: Selon le volume».
- **P-2:** «Neuer Verteilschlüssel», Abschnitt «Übersetzungen», den Satz lesen. Hilfreich wäre so etwas wie: «Ihn zeigt die Nebenkostenabrechnung eines Mieters, dessen Sprache für Abrechnung und Mahnungen Französisch ist (einstellbar beim Mieter). Auch wenn Sie Dwello oben rechts auf Französisch stellen, sehen Sie ihn.»

## Nicht geprüft

- Wie die Nebenkostenabrechnung eines französischsprachigen Mieters den Namen zeigt: Dafür hätte ich einen Mieter ändern oder eine Abrechnung erstellen müssen, und das sollte ich nicht.
- Dwello auf Französisch umzustellen: Die Sprache gehört zum Konto, das andere Personas gleichzeitig benutzen. Ich habe sie auf Deutsch gelassen.
- 200 % Zoom: geprüft habe ich nur 150 %.
- Eine Summe, die nicht 100 % ergibt, und das Speichern einer Übersetzung mit leerem deutschem Namen: nicht versucht.
