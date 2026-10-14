# Dr. Weber – Datenschutzseite (f19a)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und prüft nach. Desktop 1440 × 900, Maus. Nur angeschaut, nichts gespeichert.

Aufgabe: Ich will meine Mieter korrekt informieren und muss wissen, welche fremden Dienste Dwello nutzt und welche Cookies es setzt. Ich lese die Seite «Datenschutz» (Deutsch und Französisch) und vergleiche sie mit dem, was die App tatsächlich tut.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Datenschutz | Die Seite nennt Google, Resend, CARTO und OpenPLZ, sagt aber nicht, in welchem Land diese sitzen bzw. ob Daten ins Ausland gehen, und verlinkt keine ihrer Datenschutzerklärungen. Für die Information meiner Mieter (Resend erhält Name, E-Mail und Nachrichteninhalt) fehlt mir genau das. |
| P-2 | Minor | Datenschutz / Gebäude bearbeiten | Die Seite sagt, die Adresssuche gebe es «beim Erfassen und Bearbeiten eines Gebäudes». Auf «Gebäude bearbeiten» gibt es keine Adresssuche, nur die Felder. Die Seite beschreibt mehr, als die App tut. |
| P-3 | Minor | Datenschutz / Anmeldung | Bei «Mit Google anmelden» fragt Dwello bei Google dauerhaften Zugriff an (in der Adresse an Google: `access_type=offline`, `prompt=consent`). Die Seite sagt nur, Name, E-Mail und Profilbild würden «nur, um die Sitzung zu führen» verwendet. Ob Dwello einen dauerhaften Zugriff bei Google behält, erfahre ich nicht. |
| P-4 | Minor | Datenschutz | Google steht nur unter «Anmeldung», nicht unter «Weitergabe an Dritte». Der Satz «Darüber hinaus gibt Dwello keine Daten an Dritte weiter» liest sich, als bekäme Google nichts; bei der Anmeldung erfährt Google aber, dass ich mich bei dieser Dwello-Installation anmelde. |
| P-5 | Minor | Datenschutz | Wie lange «dwello_session» und «dwello_xsrf» gelten, steht nicht da (bei den anderen Cookies schon: 10 Minuten, 400 Tage). Auch wie lange ein Entwurf im Browser bleibt, wenn ich mich nicht abmelde, steht nicht da. |
| P-6 | Minor | Datenschutz | Wer verantwortlich ist (der «Betreiber», also bei mir wohl ich selbst) und an wen sich Mieter für Auskunft oder Löschung wenden, sagt die Seite nicht. Für die Information meiner Mieter fehlt der Hinweis, dass ich als Vermieter verantwortlich bin. |
| P-7 | Minor | Gebäude (Karte), Neues Gebäude (Adresssuche) | Beim Kartenbild und beim Feld «Adresse suchen» steht kein Wort davon, dass Daten an CARTO bzw. OpenPLZ gehen; die Karte zeigt auch keinen Quellenvermerk. Das steht nur auf der Datenschutzseite. |
| P-8 | Minor | Neues Gebäude | Antwortet die Adresssuche nicht (bei mir getestet mit Fehler 500 von openplzapi.org), zeigt Dwello nichts an: keine Treffer, keine Meldung. Ich weiss nicht, ob es meine Adresse nicht gibt oder ob die Suche gestört ist. |
| P-9 | Nit | Datenschutz | «PARAGLIDE_LOCALE speichert die gewählte Sprache»: Das Cookie wird schon beim ersten Besuch der Anmeldeseite gesetzt, bevor ich eine Sprache gewählt habe. |
| P-10 | Nit | Datenschutz | Das Profilbild wird laut Seite empfangen, die Kopfzeile zeigt aber nur den Namen mit einem Symbol. Wozu das Profilbild dient, bleibt offen. |
| P-11 | Nit | Datenschutz (FR) | Deutsch «Zahlungserinnerungen und Mahnungen», Französisch nur «Les rappels». Die Anführungszeichen sind uneinheitlich: « Saisir un contrat de bail » mit Abständen, «dwello_session» ohne. |
| P-12 | Nit | Gebäude (Karte) | Die Kartenbilder werden mit `?key=undefined` in der Adresse abgerufen. Das ist kein Datenschutzproblem, wirkt aber wie eine fehlende Einstellung. |

**Aufgabe geschafft:** teilweise. Was Dwello tut, stimmt mit der Seite weitgehend überein. Für die Information meiner Mieter fehlen aber Angaben (Ausland, Verantwortlicher, Dauer).

**Aufwand:** etwa 20 Minuten, 11 Schritte (Dashboard, Datenschutz DE, Gebäudeseite mit Karte, Neues Gebäude mit Adresssuche, Gebäude bearbeiten, Einstellungen, abgemeldet die Anmeldeseite, Klick auf «Mit Google anmelden», Vertragsentwurf und Abmelden, Datenschutz FR, Adresssuche mit gestörtem Dienst).

## Ablauf

1. **Dashboard, Link «Datenschutz» suchen.** Erwartet: im Fuss oder im Menü. Gesehen: Im Fuss stehen «Datenschutz» und «Nutzungsbedingungen», auch abgemeldet auf der Anmeldeseite. Gut.
2. **Datenschutz lesen (DE).** Erwartet: Anbieter, Daten, Zweck, Cookies, Verantwortlicher, Rechte. Gesehen: klare Abschnitte «Welche Daten Dwello speichert», «Anmeldung», «Weitergabe an Dritte», «Cookies». Kurz und verständlich, alle vier Dienste werden mit den übermittelten Daten genannt. Es fehlen Land bzw. Ausland, Links zu den Anbietern, Verantwortlicher und Rechte der Betroffenen sowie die Dauer des Sitzungscookies (P-1, P-5, P-6).
3. **Gebäudeseite «Musterhaus Zentrum».** Erwartet laut Seite: Kartenbilder von CARTO. Gesehen: Der Browser ruft Kartenbilder bei `a–d.basemaps.cartocdn.com` ab, der Referer ist nur `http://localhost:3300/` (keine Gebäude-ID, gut), Cookies werden nicht mitgeschickt. Sonst gibt es keine fremden Anfragen. Die Karte blieb in meiner Umgebung grau mit Markierung, weil das Netz gesperrt ist. Ein Hinweis auf CARTO oder ein Quellenvermerk war nicht zu sehen (P-7). In der Adresse der Kartenbilder steht `key=undefined` (P-12).
4. **Neues Gebäude, «Adresse suchen» mit «Bahnhofstrasse Zürich».** Erwartet laut Seite: OpenPLZ erhält IP und Suchbegriff. Gesehen: genau eine Anfrage `GET https://openplzapi.org/ch/FullTextSearch?searchTerm=Bahnhofstrasse+Z%C3%BCrich&pageSize=8`, Referer nur der Ursprung. Das stimmt mit der Seite überein. Das Feld selbst erwähnt OpenPLZ nicht (P-7).
5. **Gebäude bearbeiten.** Erwartet laut Seite: dieselbe Adresssuche. Gesehen: nur Strasse, PLZ, Ort, Kanton, keine Suche (P-2).
6. **Einstellungen und Neue Rechnung.** Erwartet: ein Hinweis auf das Sprachmodell oder den Mailversand. Gesehen: nichts davon. Ob das Sprachmodell wirklich auf dem Server läuft, kann ich als Nutzer nicht prüfen (siehe «Nicht geprüft»).
7. **Abgemeldet die Anmeldeseite.** Gesehen: nur «Mit Google anmelden», dazu «Ein eigenes Passwort für Dwello brauchen Sie nicht». Das passt zu «Die Anmeldung erfolgt über Google». Schon jetzt ist das Cookie `PARAGLIDE_LOCALE=de` gesetzt (400 Tage), ohne dass ich eine Sprache gewählt habe (P-9). Es gibt keine fremden Anfragen.
8. **Klick auf «Mit Google anmelden».** Erwartet: «dwello_oauth_state» und «dwello_login», höchstens 10 Minuten. Gesehen: beide Cookies mit `Max-Age=600; HttpOnly; SameSite=Lax`, das stimmt. Weiterleitung zu Google mit `scope=openid email profile`, das passt zu Name, E-Mail und Profilbild. Zusätzlich stehen `access_type=offline&prompt=consent` in der Adresse, darüber sagt die Seite nichts (P-3). Die Anmeldung selbst scheiterte an Google («OAuth client was not found»), wie in einer Testumgebung erwartet.
9. **Vertragsentwurf, dann abmelden.** Erwartet: Der Entwurf bleibt im Browser und verschwindet beim Abmelden. Gesehen: Nach der Auswahl eines Mieters im Schritt 1 steht ein Eintrag `dwello.draft.v1.contract` im lokalen Speicher. Nach «Abmelden» ist der lokale Speicher leer, «dwello_session» und «dwello_xsrf» sind weg, nur `PARAGLIDE_LOCALE` bleibt. Das stimmt mit der Seite überein.
10. **Datenschutz auf Französisch** (Sprache oben rechts auf «Français»). Gesehen: vollständig übersetzt, gleicher Inhalt, «Protection des données», «Transmission à des tiers». Kleine Abweichung bei «rappels» und uneinheitliche Anführungszeichen (P-11). Das Sprachcookie wechselt auf `fr`.
11. **Adresssuche mit gestörtem Dienst** (openplzapi.org antwortet mit 500). Gesehen: nach 5 Sekunden weder Treffer noch Meldung (P-8).

## Verwirrung

- «Betreiber dieser Dwello-Installation»: Ich musste raten, dass damit bei einer eigenen Installation ich selbst gemeint bin. Für die Mieterinformation entscheidend.
- «Resend»: Der Name sagt mir nichts. Ob das ein Unternehmen im Ausland ist, steht nirgends.
- «eigener SMTP-Server»: ein Fachbegriff, den ein Laie nicht kennt.
- «PARAGLIDE_LOCALE»: Der technische Name ist in Ordnung, weil er mit dem Browser übereinstimmt.
- In der App habe ich keinen Ort gefunden, an dem ich Zahlungserinnerungen per E-Mail auslöse oder den Mailversand sehe. Ich weiss also nicht, ob und wann Mieterdaten an Resend gehen.

## Fehlerrisiken

- Ich übernehme den Satz «Darüber hinaus gibt Dwello keine Daten an Dritte weiter» in meine Mieterinformation und lasse dabei Auslandsbekanntgaben (Resend, CARTO) und Google unerwähnt (P-1, P-4).
- Ich erkläre meinen Mietern, die Adresssuche gebe es auch beim Bearbeiten (P-2). Harmlos, aber ungenau.
- Ich erfasse eine falsche Adresse von Hand, weil die gestörte Suche wie «keine Treffer» aussieht (P-8).

## Vorschläge

- **P-1:** Datenschutz öffnen, Abschnitt «Weitergabe an Dritte». Bei jedem Dienst ergänzen: Sitzland bzw. ob Daten ins Ausland gehen, und ein Link zu seiner Datenschutzerklärung. Für Resend ausdrücklich: Mieterdaten können ins Ausland gehen, wenn der Betreiber Resend eingerichtet hat.
- **P-2:** «Gebäude bearbeiten» öffnen: Es gibt keine Adresssuche. Entweder den Text auf «beim Erfassen eines Gebäudes» kürzen oder die Suche auch beim Bearbeiten anbieten.
- **P-3:** Abgemeldet «Mit Google anmelden» klicken und die Adresse an Google lesen (`access_type=offline&prompt=consent`). Entweder ohne dauerhaften Zugriff anmelden oder auf der Seite erklären, ob und wozu Dwello einen dauerhaften Zugriff bei Google behält.
- **P-4:** Unter «Weitergabe an Dritte» Google als Anmeldedienst aufführen, mit dem, was Google erfährt (die Anmeldung bei dieser Installation).
- **P-5:** Unter «Cookies» die Gültigkeit von «dwello_session» und «dwello_xsrf» nennen (z. B. «bis zum Abmelden, höchstens …»). Beim Entwurf ergänzen, dass er auch nach dem Schliessen des Browsers bleibt.
- **P-6:** Einen Abschnitt «Verantwortlich» ergänzen: Verantwortlich ist der Betreiber, bei einer eigenen Installation der Vermieter selbst; Auskunfts- und Löschbegehren gehen an ihn.
- **P-7:** «Musterhaus Zentrum» und «Neues Gebäude» öffnen. Unter der Karte und beim Feld «Adresse suchen» einen kurzen sichtbaren Hinweis anbringen («Kartenbilder von CARTO», «Die Suche fragt OpenPLZ»), dazu einen Quellenvermerk zur Karte.
- **P-8:** openplzapi.org mit 500 antworten lassen, «Neues Gebäude» öffnen und «Bahnhofstrasse» eintippen. Eine Meldung anzeigen, etwa «Die Adresssuche ist gerade nicht erreichbar. Geben Sie die Adresse unten von Hand ein.»
- **P-9:** Abgemeldet die Anmeldeseite öffnen und das Cookie ansehen. Den Text anpassen («speichert die Sprache, in der Dwello angezeigt wird») oder das Cookie erst bei einer Wahl setzen.
- **P-10:** Das Profilbild weglassen, wenn Dwello es nicht braucht, oder sagen, wofür es dient.
- **P-11:** FR: «les rappels de paiement et les sommations» (Begriff fachlich prüfen lassen); Anführungszeichen einheitlich setzen.
- **P-12:** Gebäudeseite öffnen und die Netzwerkanfragen ansehen. `key=undefined` aus der Adresse der Kartenbilder entfernen.

## Nicht geprüft

- **Ob die Kartenbilder tatsächlich angezeigt werden:** In meiner Umgebung ist das Internet gesperrt (Kartenbilder und openplzapi.org endeten mit `ERR_TUNNEL_CONNECTION_FAILED`). Gesehen habe ich deshalb nur die Anfragen, nicht die Antworten und auch keine Treffer der Adresssuche.
- **Eigenschaften von «dwello_session» und «dwello_xsrf» nach einer echten Anmeldung** (Laut Seite kann JavaScript das Sitzungscookie nicht lesen): Meine Testsitzung war vorab gesetzt, und die Google-Anmeldung funktioniert in dieser Umgebung nicht. Geprüft habe ich nur, dass beide beim Abmelden verschwinden.
- **Ob Rechnungsdaten den Server wirklich nicht verlassen** (Sprachmodell) und ob bzw. wohin E-Mails gehen: Das geschieht auf dem Server und ist für mich als Nutzer nicht sichtbar. In der Oberfläche habe ich keinen E-Mail-Versand gefunden.
- **Woher Dwello die Koordinaten für die Karte nimmt:** Ob dafür auf dem Server ein weiterer Dienst gefragt wird, kann ich von aussen nicht sehen.
- **Italienisch und Englisch:** nicht gelesen, nur Französisch wie verlangt.
