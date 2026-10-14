# Dr. Weber – Öffentliche Demo: Hinweis, Datenschutz, Nutzungsbedingungen (b162)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Öffentliche Demo auf http://localhost:3300 (DEMO=on). Nur angesehen, nichts gespeichert. Sprachen: Deutsch und Französisch.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | /privacy, Abschnitt «Anmeldung» | Widerspruch: «Anmeldung» sagt, Name, E-Mail-Adresse und Profilbild würden «nur» für die Sitzung und die Kopfzeile verwendet; «Öffentliche Demo» sagt, jede Anmeldung werde mit der E-Mail-Adresse im Serverprotokoll festgehalten. Beides kann nicht gleichzeitig stimmen. FR genauso («ne les utilise que pour …»). |
| P-2 | Major | /privacy, «Öffentliche Demo» | Protokollierung unvollständig beschrieben: kein Zweck (wozu wird die E-Mail-Adresse festgehalten?), keine Aufbewahrungsdauer («laufend überschrieben» sagt nicht, nach wie langer Zeit oder nach wie vielen Einträgen), nicht gesagt, wer Zugriff hat. |
| P-3 | Major | /privacy (ganze Seite) | Kein Verantwortlicher genannt: Es ist immer nur vom «Betreiber dieser Dwello-Installation» die Rede, ohne Namen, Adresse oder Kontakt für Auskunftsbegehren. Bei einer öffentlichen Demo, in der ich mich mit meinem echten Google-Konto anmelde, weiss ich nicht, an wen ich mich wenden kann. |
| P-4 | Minor | /login, Demo-Hinweis | Der Hinweis vor der Anmeldung warnt vor echten Daten, sagt aber nicht, dass die Anmeldung selbst meine echte E-Mail-Adresse im Serverprotokoll festhält. Das erfahre ich nur, wenn ich von mir aus den Datenschutz öffne; neben dem Anmeldeknopf ist nur die Nutzungsbedingung verlinkt, nicht der Datenschutz. |
| P-5 | Minor | /terms | Die Nutzungsbedingungen, die ich «mit der Anmeldung akzeptiere», erwähnen die Demo mit keinem Wort (geteilte Daten, nächtliches Löschen, Verbot echter Daten, kein Anspruch auf Erhalt der Eingaben). Die Regel steht nur im gelben Hinweis, nicht im Text, dem ich zustimme. |
| P-6 | Minor | /privacy, «Weitergabe an Dritte» | Die Seite sagt, Schriften und Symbole würden von Google Fonts geladen und Google erhalte die IP-Adresse. Beim Laden von Anmeldung, Datenschutz, Nutzungsbedingungen und Übersicht ging keine einzige Anfrage an einen anderen Server als localhost:3300. Die Aussage stimmt offenbar nicht (zu viel statt zu wenig gesagt, aber ungenau). |
| P-7 | Minor | /privacy «Anmeldung» vs. /login | Datenschutz nennt «Google oder Microsoft»; die Anmeldeseite bietet nur «Mit Google anmelden». |
| P-8 | Minor | /login und App, Demo-Hinweis | «Geben Sie keine echten Namen, Adressen oder Beträge ein» – E-Mail-Adressen und Telefonnummern fehlen in der Aufzählung. Gerade E-Mail-Adressen sind heikel, weil die Datenschutzerklärung von Zahlungserinnerungen und Mahnungen per E-Mail spricht: Ob die Demo solche E-Mails tatsächlich verschickt, steht nirgends. |
| P-9 | Nit | /privacy, «Öffentliche Demo» | «Jede Nacht»: ohne Uhrzeit und Zeitzone. Für einen Besucher, der abends etwas ausprobiert, ist unklar, wann die Daten weg sind. |
| P-10 | Nit | /privacy FR | DE «Zahlungserinnerungen und Mahnungen» wird in FR zu nur «rappels»; im Abschnitt «Welche Daten» wird DE «Mahnungen» ebenfalls «rappels». Zwei Begriffe fallen in FR zu einem zusammen. |
| P-11 | Nit | /terms DE und FR | Im selben Abschnitt wechselt «Liegenschaftsverwalter» mit «die Verwaltung» (FR «gérant d’immeubles» / «la gérance»). Für einen juristischen Leser ist offen, ob dieselbe Partei gemeint ist. |

**Aufgabe geschafft:** ja. Hinweis vor und nach der Anmeldung, Datenschutz und Nutzungsbedingungen gelesen, beides auch auf Französisch.

**Aufwand:** etwa 15 Minuten, 9 Schritte (Anmeldeseite, Sprachwahl, Datenschutz, Nutzungsbedingungen, Anmeldung, Übersicht, jeweils DE und FR).

## Ablauf

1. **Anmeldeseite ohne Sitzung öffnen (/ leitet auf /login).** Erwartet: ein deutlicher Hinweis, bevor ich irgendetwas eingebe. Gesehen: oben über die ganze Breite ein gelber Kasten mit Warnsymbol und fetter Überschrift «Öffentliche Demo»: «Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht und die Beispieldaten neu geladen. Geben Sie keine echten Namen, Adressen oder Beträge ein.» Darunter die Karte «Anmelden» mit «Mit Google anmelden» und «Mit der Anmeldung akzeptieren Sie die Nutzungsbedingungen.» Die drei Kernaussagen (geteilte Daten, nächtliches Löschen, keine echten Daten) sind klar und stehen vor dem Anmeldeknopf. Gut. Was fehlt: dass die Anmeldung meine E-Mail-Adresse protokolliert (P-4), und E-Mail-Adressen fehlen in der Aufzählung (P-8).
2. **Datenschutz ohne Sitzung (/privacy).** Erwartet: ein Abschnitt zur Demo, der mit dem Rest übereinstimmt. Gesehen: derselbe gelbe Hinweis oben, dann als erste Karte «Öffentliche Demo»: geteilte Daten, nächtliches Löschen, «Jede Anmeldung wird mit der E-Mail-Adresse des Kontos im Protokoll des Servers festgehalten. Ältere Einträge werden laufend überschrieben.» Das ist ehrlich und gut platziert. Weiter unten die Karte «Anmeldung»: Dwello verwende Name, E-Mail und Profilbild «nur, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen». Das widerspricht der Protokollierung (P-1). Zweck und Dauer der Protokollierung fehlen (P-2), ein Verantwortlicher ist nirgends genannt (P-3). Google Fonts wird erwähnt (P-6), Microsoft auch (P-7).
3. **Nutzungsbedingungen (/terms).** Erwartet: da ich ihnen «mit der Anmeldung» zustimme, ein Satz zur Demo. Gesehen: gelber Hinweis oben, dann nur «Zweck», «Verantwortung für Abrechnungen», «Verfügbarkeit». Kein Wort zur Demo im Text selbst (P-5).
4. **Anmelden (Sitzungs-Cookie gesetzt) und Übersicht öffnen.** Erwartet: der Hinweis bleibt in der App sichtbar. Gesehen: derselbe gelbe Kasten mit demselben Text über der Überschrift «Übersicht», neben der Navigation. Sichtbar und gleichlautend. Gut.
5. **Sprache auf Français umstellen (Knopf «Sprache: Deutsch» oben rechts, «Français»).** Erwartet: alles übersetzt, Inhalt gleich. Gesehen: Anmeldeseite «Démo publique – Tous les visiteurs voient et modifient les mêmes données. Chaque nuit, toutes les modifications sont supprimées et les données d’exemple sont rechargées. N’entrez pas de vrais noms, adresses ou montants.» Inhaltlich deckungsgleich.
6. **Datenschutz FR.** «Chaque connexion est consignée avec l’adresse e-mail du compte dans le journal du serveur. Les entrées plus anciennes sont écrasées au fur et à mesure.» Übersetzung korrekt, gleiche Lücken und gleicher Widerspruch zu «Connexion» (P-1). Zahlungserinnerungen und Mahnungen werden zu «rappels» zusammengezogen (P-10).
7. **Nutzungsbedingungen FR.** Inhalt deckungsgleich, keine Demo-Klausel (P-5), «gérant d’immeubles»/«gérance» (P-11).
8. **Übersicht FR.** Hinweis «Démo publique» sichtbar, Text wie auf der Anmeldeseite.
9. **Netzwerk beobachtet** während Schritt 5 bis 8: alle Anfragen nur an localhost:3300 (P-6).

## Verwirrung

- «Protokoll des Servers»: Was steht dort ausser der E-Mail-Adresse (IP-Adresse, Zeitpunkt)? Wer liest es?
- «laufend überschrieben»: nach Tagen, Wochen, oder nach einer Grösse? Für mich keine Aufbewahrungsangabe.
- «Betreiber dieser Dwello-Installation»: wer ist das bei der öffentlichen Demo?
- «nur, um die Sitzung zu führen» neben «wird festgehalten»: welche Aussage gilt?
- «Liegenschaftsverwalter» und «die Verwaltung» in den Nutzungsbedingungen: dieselbe Person?

## Fehlerrisiken

- Ein Besucher meldet sich mit seinem echten Google-Konto an, ohne zu wissen, dass seine Adresse protokolliert wird (der Hinweis vor der Anmeldung schweigt dazu).
- Ein Besucher tippt eine echte E-Mail-Adresse eines Mieters ein, weil nur «Namen, Adressen oder Beträge» verboten sind; wenn die Demo Mahnungen verschickt, erhält eine fremde Person Post.
- Wer sich auf den Abschnitt «Anmeldung» verlässt, hält die Protokollierung für ausgeschlossen.

## Vorschläge

- **P-1:** /privacy öffnen, Abschnitte «Öffentliche Demo» und «Anmeldung» vergleichen (FR: «Démo publique» und «Connexion»). Hilfe: in «Anmeldung» das «nur» ergänzen, etwa «… und, in der öffentlichen Demo, um jede Anmeldung im Protokoll des Servers festzuhalten (siehe oben).»
- **P-2:** /privacy, «Öffentliche Demo», zweiter Absatz. Hilfe: Zweck nennen (z. B. Missbrauch erkennen), Dauer konkret («spätestens nach X Tagen überschrieben»), wer Zugriff hat (nur der Betreiber).
- **P-3:** /privacy ganz lesen: kein Name, keine Kontaktadresse. Hilfe: einen Abschnitt «Verantwortlich» mit Name und Kontakt des Betreibers der Demo, an den Auskunfts- und Löschbegehren gehen.
- **P-4:** /login ohne Sitzung öffnen, Hinweis lesen. Hilfe: einen Satz anfügen: «Ihre Anmeldung wird mit Ihrer E-Mail-Adresse protokolliert; mehr im Datenschutz.» mit Link, oder unter dem Anmeldeknopf neben den Nutzungsbedingungen auch den Datenschutz verlinken.
- **P-5:** /terms öffnen. Hilfe: einen Abschnitt «Öffentliche Demo» in die Nutzungsbedingungen: geteilte Daten, nächtliches Löschen, keine echten Personendaten, kein Anspruch auf Erhalt der Eingaben.
- **P-6:** /login, /privacy, /terms, /dashboard laden und die Anfragen im Netzwerk beobachten: nur localhost:3300. Hilfe: den Satz zu Google Fonts streichen oder an die tatsächliche Auslieferung anpassen.
- **P-7:** /privacy «Anmeldung» lesen, dann /login: nur Google. Hilfe: die Datenschutzerklärung nennt nur die Anbieter, die diese Installation anbietet, oder sagt «je nach Installation Google oder Microsoft».
- **P-8:** Hinweis auf /login lesen. Hilfe: «Geben Sie keine echten Namen, Adressen, E-Mail-Adressen, Telefonnummern oder Beträge ein.» und im Datenschutz sagen, ob die Demo E-Mails verschickt.
- **P-9:** /privacy «Öffentliche Demo». Hilfe: «jede Nacht um ca. 03:00 Uhr (Schweizer Zeit)».
- **P-10:** /privacy auf Français, «Transmission à des tiers»: «Les rappels par e-mail …». Hilfe: Zahlungserinnerung und Mahnung im Französischen getrennt benennen, wie im Deutschen.
- **P-11:** /terms, «Verantwortung für Abrechnungen». Hilfe: durchgehend eine Bezeichnung für dieselbe Partei.

## Nicht geprüft

- Italienisch und Englisch (nicht Teil der Aufgabe).
- Die echte Google-Anmeldung (der Knopf führt zu Google; ich habe mich wie vorgesehen über das Sitzungs-Cookie angemeldet). Ob die Protokollierung tatsächlich stattfindet und wie lange Einträge bleiben, kann ich als Benutzer nicht sehen.
- Ob die Demo nachts wirklich löscht und ob sie E-Mails an eingegebene Adressen verschickt: Ich sollte nichts speichern.
- Mobile Ansicht des Hinweises.
