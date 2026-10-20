# Dr. Weber – Rechtstexte: Verantwortung, Rechte der Mieter, Betreiber (Runde 458)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-Stack auf http://localhost:3300 (Demo-Daten), Installation mit Betreiber «Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich», Kontakt «betrieb@muster-hosting.ch», Server in der Schweiz, Mailserver «Muster Mail AG (Schweiz)» per SMTP.
Nur angesehen, nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/dr-weber-458/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | /privacy («Verantwortlich», «Aufbewahrung») | Die Erklärung sagt meinen Mietern, sie könnten Löschung verlangen, «was aufbewahrt werden muss, bleibt bis zum Ende der Aufbewahrung». Gleichzeitig lassen sich versendete Abrechnungen, alle Mahnungen und Mieter mit Abrechnungen nie löschen. Die 10-jährige Pflicht nach Art. 958f OR gilt laut Text nur für Buchführungspflichtige, also nicht für mich als privaten Vermieter. Nach Ablauf einer Aufbewahrungsfrist kann ich einen berechtigten Löschantrag deshalb nicht erfüllen. Wie es dann weitergeht, steht nirgends. |
| P-2 | Minor | /terms («Verantwortung für Abrechnungen») | Laut Hilfe soll ich den Mietern vier Abschnitte weitergeben. Diese Abschnitte verweisen aber auf Abschnitte, die nicht dazugehören («siehe «Anmeldung»», «unter «Anmeldung» genannten Diensten», «Protokoll unter «Einstellungen»»). Sie enthalten auch Sätze, die nur mich betreffen (Entwürfe im Browser, «öffentliche Demo», «Sie selbst beim Betreiber»). Ein fertiger Text für Mieter fehlt, und die Abschnittsnamen sind nicht verlinkt. |
| P-3 | Minor | /privacy («Verantwortlich») | Die Rechte der Mieter (Auskunft, Herausgabe, Berichtigung, Löschung) sind aufgezählt. Der nächste Schritt für mich fehlt aber: Die Erklärung erwähnt «Daten exportieren» auf der Mieterseite nicht, und für Rechnungssteller, die ebenfalls genannt sind, gibt es keinen Export. |
| P-4 | Minor | /terms («Zweck») | Die Überschrift lautet «Nutzungsbedingungen», der Text sagt aber «Diese Hinweise ersetzen keinen Vertrag. Betreibt ein Anbieter Dwello für Sie, gelten die Vereinbarungen mit ihm.» Der Betreiber ist auf derselben Seite namentlich genannt (Muster Hosting AG). Trotzdem bleibt offen, ob ich mit ihm einen Vertrag habe oder brauche. |
| P-5 | Minor | /privacy («Verantwortlich», «Weitergabe an Dritte») | Die Erklärung behauptet, ein Anbieter bearbeite meine Daten «nur in Ihrem Auftrag». Dass ich dafür eine Vereinbarung über die Auftragsbearbeitung (Art. 9 DSG) mit der Muster Hosting AG brauche, sagt sie nicht. Offen ist auch, in wessen Auftrag die Muster Mail AG handelt. Die Definition «Betreiber ist … Sie selbst oder ein Anbieter» bleibt allgemein, obwohl der Betreiber feststeht. |
| P-6 | Minor | /privacy und /terms | Wer verantwortlich ist, heisst auf /privacy «Sie als Vermieter», auf /terms «der Liegenschaftsverwalter» (dritte Person) und kurz darauf wieder «Sie». Für eine Verwaltungsfirma, die /privacy selbst als Beispiel nennt, stimmt «Vermieter» nicht. Wer dann verantwortlich ist, bleibt offen. |
| P-7 | Nit | /privacy | «Anbieter» meint einmal den Anmeldedienst («Kennung des Kontos beim Anbieter», «mit dem gewählten Anbieter») und einmal die Firma, die Dwello betreibt. |
| P-8 | Nit | /login | «Melden Sie sich mit Ihrem bestehenden Konto an.» sagt nicht, welches Konto gemeint ist. Erst der Knopf nennt Google. |
| P-9 | Nit | /login, /terms, /privacy | Der Name wechselt: Überschrift «Datenschutz», Link «Datenschutzerklärung», Fusszeile «Datenschutz». Ausserdem klingt «Der Server steht in folgendem Land: Schweiz.» wie ein ausgefülltes Formular. |

## Beobachtungen

- **Stand:** Beide Seiten zeigen «Stand: 19. Oktober 2026», also das heutige Datum. Ob das der Tag der letzten Änderung ist oder einfach das Datum der Anzeige, kann ich von aussen nicht unterscheiden (siehe «Nicht geprüft»). Ein «Stand», der jeden Tag neu wäre, hätte keinen Wert.
- **Betreiber:** /privacy und /terms nennen ihn gleich (Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich, betrieb@muster-hosting.ch). Das stimmt mit der Konfiguration überein.
- **Server und Mail:** Server «Schweiz», Mailserver «Muster Mail AG (Schweiz)». Die Liste, was der Mailanbieter erhält (Name, E-Mail, PDF mit Adresse, Beträgen, IBAN, Referenz), ist vorbildlich genau.
- **KI:** «läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht». Klar formuliert.
- **Abgemeldet** auf /login, /privacy und /terms ruft der Browser nur localhost:3300 auf und setzt nur das Cookie «PARAGLIDE_LOCALE» (400 Tage, für JavaScript lesbar). Das stimmt mit dem Abschnitt «Cookies» überein.
- **Anmeldeseite:** Sie verlangt nichts von mir, kein Häkchen und keine Zustimmung. Sie verweist nur auf die Nutzungsbedingungen und die Datenschutzerklärung. Das passt dazu, dass /terms sich nicht als Vertrag versteht. Dass Google bei jeder Anmeldung meine IP-Adresse erfährt und Daten in die USA gelangen können, steht nur auf /privacy, nicht neben dem Knopf.
- **Google und OpenPLZ:** Bei Google wird die Angemessenheit (Swiss-U.S. DPF) begründet, bei OpenPLZ (Deutschland) nicht. Rechtlich ist das in Ordnung, als Leser vermisse ich trotzdem einen halben Satz.
- **Artikelangaben:** Art. 25, 28, 32 Abs. 1 und 2, 49 DSG, Art. 19 Abs. 2 DSG und Art. 958f OR sind passend zitiert.
- **Mieterseite (angemeldet, nur angesehen):** Die Seite von Sarah Meier hat «Daten des Mieters» mit «Daten exportieren» und einem guten Hilfetext (Art. 28 DSG, 30 Tage, Daten Dritter prüfen). Den Hinweis darauf vermisse ich in der Datenschutzerklärung (P-3).
- **/help:** Kein Abschnitt zu Datenschutz oder zur Information der Mieter. Es gibt nur den Hinweis, Ausweiskopien und Betreibungsauszüge zu löschen.

## Aufgabe geschafft: teilweise

Wer wofür verantwortlich ist, wo Server und Mailserver stehen und was die Anmeldeseite verlangt, konnte ich klären. Was ich meinen Mietern konkret geben soll und wie ich einen Löschantrag erfülle, bleibt unklar.

## Aufwand

Etwa 25 Minuten Lesen. 3 Seiten abgemeldet (Anmeldung, Datenschutz, Nutzungsbedingungen), danach zur Gegenprobe /help, die Mieterliste und eine Mieterseite angemeldet, rund 8 Schritte.

## Ablauf

1. **http://localhost:3300/ abgemeldet öffnen.** Erwartet: Anmeldeseite. Gesehen: Weiterleitung auf `/login?redirectTo=%2F`, Karte mit Haus-Symbol, «Anmelden», «Melden Sie sich mit Ihrem bestehenden Konto an. Ein eigenes Passwort für Dwello brauchen Sie nicht.», Knopf «Mit Google anmelden», darunter Links auf Nutzungsbedingungen und Datenschutzerklärung. Kein Häkchen, keine Zustimmung (Screenshot 01-login.png).
2. **«Datenschutzerklärung» wählen.** Erwartet: wer verantwortlich ist, Rechte, Speicherort. Gesehen: Überschrift «Datenschutz», «Stand: 19. Oktober 2026», Abschnitte Verantwortlich, Welche Daten Dwello speichert, Aufbewahrung, Anmeldung, Weitergabe an Dritte, Cookies (02-privacy.png). Die Verantwortung ist aufgeteilt: Ich bin verantwortlich für die erfassten Daten, der Betreiber für Anmeldung, Server-Protokoll und Cookies. Das ist gut gelöst.
3. **Rechte der Mieter lesen.** Erwartet: was Mieter verlangen können und was ich dann tue. Gesehen: Die Rechte sind vollständig und mit Artikeln angegeben, eine Handlungsanweisung für mich fehlt (P-3). Der Löschanspruch widerspricht dem Abschnitt «Aufbewahrung» (P-1).
4. **Server und Mailserver.** Erwartet: Land und Firma. Gesehen: «Schweiz» und «Muster Mail AG (Schweiz)». Erfüllt.
5. **«Nutzungsbedingungen» wählen.** Erwartet: Vertragsbedingungen mit Parteien, Haftung und Recht. Gesehen: drei Karten Zweck, Verantwortung für Abrechnungen, Verfügbarkeit, «Stand: 19. Oktober 2026», und ausdrücklich «Diese Hinweise ersetzen keinen Vertrag» (03-terms.png). Das liest sich nicht als Vertrag, sondern als Hinweisblatt mit irreführendem Titel (P-4).
6. **Hilfe zur Information der Mieter.** Erwartet: ein Text, den ich weitergeben kann. Gesehen: der Rat, vier Abschnitte der Datenschutzerklärung weiterzugeben, mit Name und Kontakt, und zu erklären, dass «Sie» dort den Vermieter meint. Beim Zusammenstellen stiess ich auf fremde Verweise und Sätze, die nur mich betreffen (P-2).
7. **Gegenprobe angemeldet:** /help hat nichts zum Datenschutz. Die Mieterseite hat «Daten exportieren» (06-tenant.png).

## Verwirrung

- «Anbieter» für zwei verschiedene Dinge (P-7).
- «Betreiber … Sie selbst oder ein Anbieter», obwohl er namentlich bekannt ist (P-5).
- «Vermieter» und «Liegenschaftsverwalter» (P-6).
- «Nutzungsbedingungen», die «Hinweise» sein wollen (P-4).
- «Sie selbst beim Betreiber (Art. 25 DSG)»: Der elliptische Satz ist schon für mich holprig, für einen Mieter, der ihn liest, unverständlich.
- «bestehenden Konto» auf der Anmeldeseite (P-8).

## Fehlerrisiken

- Ich verspreche Mietern Löschung, die die Software nicht leisten kann (P-1).
- Ich leite Mietern einen Text weiter, der sie auf Abschnitte verweist, die sie nicht haben, oder der Dinge über «Sie» sagt, die nur für mich gelten (P-2).
- Ich verlasse mich auf «nur in Ihrem Auftrag» und schliesse keine Vereinbarung über die Auftragsbearbeitung ab (P-5).
- Ich halte /terms für einen Vertrag mit dem Betreiber, obwohl dort nichts geregelt ist (P-4).

## Vorschläge

- **P-1:** /privacy abgemeldet öffnen und im Abschnitt «Verantwortlich» den Satz zu Art. 32 Abs. 2 lesen, dann im Abschnitt «Aufbewahrung» «Nicht löschen lassen sich versendete Abrechnungen, alle Mahnungen …». Hilfreich wäre: Sagen, was ich tun soll, wenn keine Aufbewahrungspflicht (mehr) besteht, etwa den Betreiber um Löschung bitten oder einen Weg in der App. Oder den Satz so einschränken, dass er nur verspricht, was Dwello leisten kann.
- **P-2:** /terms öffnen, Abschnitt «Verantwortung für Abrechnungen» lesen, dann die genannten vier Abschnitte auf /privacy zusammensuchen. Sie enthalten «siehe «Anmeldung»», «unter «Anmeldung» genannten Diensten», «Protokoll unter «Einstellungen»», «öffentliche Demo» und «Sie selbst beim Betreiber». Hilfreich wäre eine eigene Mieterinformation zum Kopieren oder Drucken, in der Ich-Form des Vermieters, mit Platzhaltern für Name und Kontakt. Mindestens sollten die Abschnittsnamen verlinkt sein.
- **P-3:** /privacy, «Verantwortlich», Absätze zu den Rechten lesen. Hilfreich wäre ein Satz wie «Die Daten eines Mieters laden Sie auf seiner Seite mit «Daten exportieren» herunter». Für Rechnungssteller sollte die Erklärung sagen, wo deren Daten stehen (Rechnungen).
- **P-4:** /terms, «Zweck», zweiter Absatz. Hilfreich wäre: Den Titel ehrlich wählen («Hinweise zur Nutzung») oder sagen, dass die Vereinbarung mit der Muster Hosting AG gilt und wo ich sie bekomme.
- **P-5:** /privacy, «Verantwortlich», zweiter Absatz, und «Weitergabe an Dritte», Mail-Absatz. Hilfreich wäre der Hinweis «Schliessen Sie mit dem Betreiber eine Vereinbarung über die Auftragsbearbeitung ab (Art. 9 DSG)». Ausserdem sollte die Erklärung sagen, ob die Muster Mail AG im Auftrag des Betreibers handelt. Und: Ist der Betreiber konfiguriert, nur ihn nennen statt der allgemeinen Definition.
- **P-6:** /privacy («Sie als Vermieter») und /terms («der Liegenschaftsverwalter ist dafür verantwortlich») vergleichen. Hilfreich wäre ein einheitlicher Begriff und ein Satz für Verwaltungsfirmen: Verantwortlich ist der Eigentümer, die Firma bearbeitet in seinem Auftrag.
- **P-7:** /privacy, «Anmeldung» und «Verantwortlich». Hilfreich wäre: beim Anmeldedienst von «Google» oder «Anmeldedienst» sprechen.
- **P-8:** / abgemeldet öffnen. Hilfreich wäre «Melden Sie sich mit Ihrem Google-Konto an.»
- **P-9:** Anmeldeseite, Überschrift auf /privacy und Fusszeile vergleichen, auf /privacy «Welche Daten Dwello speichert», zweiter Absatz. Hilfreich wäre: überall «Datenschutzerklärung» und «Der Server steht in der Schweiz.»

## Nicht geprüft

- Ob «Stand: 19. Oktober 2026» das Datum der letzten Änderung ist oder das Datum der Anzeige. Heute ist der 19. Oktober 2026, und einen anderen Tag kann ich als Benutzerin nicht einstellen. Die Antwort des Servers trägt kein Änderungsdatum.
- Andere Sprachen als Deutsch (die Sprache gehört zum Konto, und ich lief nicht allein).
- Die Anmeldung über Google selbst (im Persona-Stack nicht echt erreichbar).
- Ob eine E-Mail tatsächlich über die Muster Mail AG geht: Versand ist Speichern, und das war nicht Teil der Aufgabe.
- Der Inhalt der ZIP-Datei von «Daten exportieren»: Ich habe nur angesehen und nicht heruntergeladen.
