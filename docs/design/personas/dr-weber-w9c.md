# Dr. Weber – Datenschutzerklärung und Nutzungsbedingungen (w9c)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus, Deutsch.
Aufgabe: Bevor ich die Daten meiner Mieter in Dwello erfasse, will ich wissen, wer verantwortlich ist, was an wen in welches Land geht, wie lange es aufbewahrt wird, was ich ablehnen kann und was die Nutzungsbedingungen von mir verlangen. Start abgemeldet auf der Anmeldeseite. Nur gelesen, nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/9a715a74-c402-5b4f-900b-828b9cf74722/scratchpad/dr-weber-w9c/` (`01-start.png`, `02-privacy.png`, `03-terms.png`, `04-buildings.png`, `05-building-new.png`, `s1.mjs` bis `s5.mjs`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Datenschutz, «Verantwortlich» / Nutzungsbedingungen | Rollen widersprüchlich: Die Datenschutzerklärung nennt den «Betreiber» als verantwortlich für *alle* Daten der Installation, auch die der Mieter. Die Nutzungsbedingungen legen aber mir als Liegenschaftsverwalter die Pflicht auf, die Mieter zu informieren. Ob ich gegenüber meinen Mietern Verantwortlicher bin und ein Anbieter nur in meinem Auftrag bearbeitet (Auftragsbearbeiter), steht nirgends. |
| P-2 | Major | Datenschutz | Rechte der betroffenen Personen unvollständig: genannt ist nur die Auskunft (Art. 25 DSG). Berichtigung, Löschung, Widerspruch, Herausgabe der Daten und die Beschwerde beim EDÖB fehlen. Auf meine Frage «Was kann ich ablehnen?» antwortet die Seite nur bei den Cookies. |
| P-3 | Major | Nutzungsbedingungen | Zu dünn für etwas, das ich «mit der Anmeldung akzeptiere»: kein Vertragspartner, kein Stand bzw. Datum, nichts zu Haftung, anwendbarem Recht und Gerichtsstand, Änderungen der Bedingungen, Kündigung und Mitnahme meiner Daten (Export). Es sind drei kurze Abschnitte. |
| P-4 | Minor | Datenschutz, «Verantwortlich» | In dieser Installation fehlen Name und Adresse des Verantwortlichen («Er hat seinen Namen und seine Adresse noch nicht hinterlegt»). Ehrlich, aber damit fehlt die erste Angabe, die eine Datenschutzerklärung nennen muss. Ich würde so keine Mieterdaten erfassen. |
| P-5 | Minor | Datenschutz, «Aufbewahrung» | Der Satz «Abrechnungen lassen sich nach dem Versand nicht mehr löschen, Mahnungen gar nicht, ebenso Mieter und Mietverträge, zu denen es Abrechnungen gibt» ist mehrdeutig, und für Daten, die sich nicht löschen lassen, steht kein Ende der Aufbewahrung. Für Protokoll und Datensicherungen ist die Dauer an den Betreiber delegiert, ohne Richtwert. |
| P-6 | Minor | Datenschutz, «Aufbewahrung» | Die 10-Jahres-Pflicht (Art. 958f OR) gilt für «wer zur Buchführung verpflichtet ist, etwa eine Verwaltungsfirma». Ob sie mich als privaten Vermieter betrifft und was ich sonst aufbewahren muss, bleibt offen. |
| P-7 | Minor | Datenschutz, «Welche Daten Dwello speichert» | Wo die Daten liegen, ist nur technisch beschrieben («PostgreSQL-Datenbank des Betreibers»), ohne Land. Für den Mailserver steht ausdrücklich «erfahren Sie beim Betreiber», für die Datenbank fehlt selbst dieser Hinweis. |
| P-8 | Minor | Nutzungsbedingungen | Die Pflicht, die Mieter zu informieren, kommt ohne Hilfe: kein Hinweis, was ich ihnen sagen soll, und kein Verweis auf die Abschnitte der Datenschutzerklärung, die ich weitergeben könnte. |
| P-9 | Nit | Datenschutz, Nutzungsbedingungen | Keine der beiden Seiten hat ein Datum oder einen «Stand». Die Fusszeile zeigt «Version unbekannt», deshalb kann ich nicht festhalten, welcher Fassung ich zugestimmt habe. |
| P-10 | Nit | Datenschutz, «Weitergabe an Dritte» | Bei Google wird erklärt, warum der Datenfluss in die USA zulässig ist (Data Privacy Framework). Bei OpenPLZ (Deutschland) fehlt der entsprechende Satz, obwohl er kurz wäre: Deutschland hat laut Bundesrat einen angemessenen Datenschutz. |

## Beobachtungen

- Beide Seiten finde ich von der Anmeldeseite aus sofort: Der Satz unter «Mit Google anmelden» verlinkt «Nutzungsbedingungen» und «Datenschutzerklärung», die Fusszeile hat «Datenschutz» und «Nutzungsbedingungen». Abgemeldet öffnen sich beide ohne Anmeldung. Gut.
- Der Link heisst «Datenschutzerklärung», die Seite selbst und die Fusszeile «Datenschutz». Das irritiert nicht, ist aber uneinheitlich.
- Der Satz auf der Anmeldeseite spricht von «Ihre Daten». Dass auch die Daten meiner Mieter gemeint sind, merke ich erst auf der Seite.
- Der Abschnitt «Cookies» ist vorbildlich konkret und stimmt mit dem überein, was ich im Browser sehe: Abgemeldet setzt Dwello nur «PARAGLIDE_LOCALE» (400 Tage, für JavaScript lesbar). Nach «Mit Google anmelden» kommen «dwello_oauth_state» und «dwello_login» dazu, beide HttpOnly und 10,0 Minuten gültig. Die 7 Tage von «dwello_session»/«dwello_xsrf» konnte ich nicht prüfen (siehe «Nicht geprüft»).
- Auf der Anmelde-, der Datenschutz- und der Nutzungsbedingungen-Seite lädt der Browser nur von `localhost:3300`, also keine fremden Schriften und keine Tracker. Das stimmt mit «nur technisch notwendige Cookies» überein.
- Die Adresssuche bei «Neues Gebäude» fragt tatsächlich direkt aus dem Browser `https://openplzapi.org/ch/FullTextSearch?searchTerm=…` ab, wie beschrieben (IP und Suchbegriff gehen an OpenPLZ). Die Hilfe am Feld («Adresse suchen (optional)») erwähnt das aber nicht. Wer die Datenschutzerklärung nicht gelesen hat, weiss es beim Tippen nicht.
- «Route planen» in der Gebäudeliste ist ein gewöhnlicher Link auf `https://www.google.com/maps/dir/?api=1&destination=<Adresse>` (neuer Tab, `rel=noopener`). Beim Laden der Liste geht keine Anfrage an Google. Das stimmt mit «erst, wenn Sie den Link wählen» überein.
- «Mit Google anmelden» führte im Sandkasten tatsächlich zu `accounts.google.com` (Fehlerseite wegen der Test-Client-ID). Die Anmeldung läuft also wirklich über Google wie beschrieben.
- Die Aussage «Die KI läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht» ist absolut formuliert. Ob das für jede Installation gilt oder nur für die Standardeinrichtung, kann ich als Nutzer nicht beurteilen.
- Der Hinweis zu den Browser-Entwürfen («bleibt auf dem Gerät, auf dem Sie arbeiten», gelöscht mit «Abmelden», nicht bei Ablauf) ist sehr gut und ehrlich. Das hätte ich sonst nie erfahren.
- Der Hinweis, dass Dwello nach Ende des letzten Mietvertrags alte Dokumente zum Löschen nennt, gefällt mir. Ausweiskopien und Betreibungsauszüge sind heikel.
- Verständlichkeit: Sprache überwiegend klar und kurz, «Sie»-Form, Schweizer Schreibweise. Fachwörter, die ein Vermieter nicht kennt: «PostgreSQL-Datenbank», «Kennung des Kontos beim Anbieter», «Verlängerung der Sitzung», «XSRF» kommt zum Glück nicht vor.

## Aufgabe geschafft: teilweise

Gefunden und gelesen habe ich beide Texte. Meine Fragen sind beantwortet zu: was an wen in welches Land geht (vollständig und nachprüfbar richtig), Cookies und ablehnbare Cookies. Nur teilweise beantwortet: wer verantwortlich ist (in dieser Installation niemand eingetragen, Rolle zu mir unklar), wie lange aufbewahrt wird (ohne Ende bei nicht löschbaren Daten) und was die Bedingungen von mir verlangen (zwei Pflichten, sonst nichts). Was Mieter ablehnen oder verlangen können, steht ausser der Auskunft nicht da.

## Aufwand

Rund 20 Minuten Lesen und Prüfen. 2 Klicks bis zu jedem Text (Anmeldeseite → Link), dazu 5 Skriptläufe zur Prüfung der Aussagen (Cookies, Netzwerkanfragen, Links).

## Ablauf

1. **Startseite abgemeldet öffnen.** Erwartet: Anmeldeseite mit Hinweis auf Datenschutz. Gesehen: Weiterleitung auf `/login?redirectTo=%2F`, Karte «Anmelden» mit «Mit Google anmelden». Darunter «Mit der Anmeldung akzeptieren Sie die Nutzungsbedingungen. Wie Dwello Ihre Daten bearbeitet, steht in der Datenschutzerklärung.», beide verlinkt, die Fusszeile hat beide Links nochmals (Screenshot `01-start.png`).
2. **«Datenschutzerklärung» wählen.** Erwartet: vollständige Erklärung mit Verantwortlichem, Zweck, Empfängern, Ländern, Dauer und Rechten. Gesehen: Seite «Datenschutz» mit sechs Karten: Verantwortlich, Welche Daten Dwello speichert, Aufbewahrung, Anmeldung, Weitergabe an Dritte, Cookies (`02-privacy.png`). Empfänger und Länder sind sehr gut beschrieben. Beim Verantwortlichen steht, dass Name und Adresse fehlen (P-4). Bei den Rechten steht nur die Auskunft (P-2).
3. **«Verantwortlich» lesen.** Erwartet: Name und Adresse, Klärung, wer für Mieterdaten einsteht. Gesehen: «ihr Betreiber», nicht hinterlegt, mit der Erklärung, wer Betreiber ist. Das klärt nicht, ob ich oder der Anbieter gegenüber meinen Mietern verantwortlich bin (P-1).
4. **«Aufbewahrung» lesen.** Erwartet: Fristen. Gesehen: Keine automatische Löschung, manche Daten gar nicht löschbar, 10 Jahre für Buchführungspflichtige. Der Satz zu Mahnungen und Mietern ist mehrdeutig (P-5), ob mich die 10 Jahre betreffen, bleibt offen (P-6).
5. **Links zu den Datenschutzerklärungen der Anbieter öffnen.** Erwartet: Seiten von Google und OpenPLZ. Gesehen: Der Sandkasten blockiert externe Seiten (`ERR_TUNNEL_CONNECTION_FAILED`). Linkziele: «Datenschutzerklärung von Google» → `https://policies.google.com/privacy` (zweimal, bei «Anmeldung» und bei «Route planen»), «Datenschutzerklärung von OpenPLZ» → `https://legal.stueber.de/privacy.php`. Beide öffnen im selben Tab, mit `rel="noopener noreferrer"`. Die Ziele passen zu den genannten Firmen.
6. **Aussagen prüfen (Cookies, Server).** Erwartet: wie beschrieben. Gesehen: wie beschrieben (siehe Beobachtungen). Zusätzlich angemeldet geprüft, ohne zu speichern: Adresssuche → openplzapi.org, «Route planen» → Google-Maps-Link (`04-buildings.png`, `05-building-new.png`).
7. **«Nutzungsbedingungen» wählen.** Erwartet: Vertragspartner, Leistungen, Pflichten, Haftung, Recht, Gerichtsstand, Änderungen, Kündigung. Gesehen: drei Karten, Zweck, Verantwortung für Abrechnungen (ich prüfe vor dem Versand, ich informiere die Mieter) und Verfügbarkeit (beim Betreiber, kein Anspruch) (`03-terms.png`). Der Rest fehlt (P-3, P-8).

## Verwirrung

- «Betreiber» vs. «Anbieter» vs. «Liegenschaftsverwalter»: Drei Rollen, und ich weiss nicht, welche ich bin, wenn ich Dwello bei jemandem nutze. Die Erklärung des Betreibers hilft, aber die rechtliche Folge für mich fehlt (P-1).
- «Ausser in der öffentlichen Demo»: Ist das hier die Demo? Für mich nicht erkennbar, auf welcher Installation ich bin.
- «Mahnungen gar nicht, ebenso Mieter und Mietverträge, zu denen es Abrechnungen gibt»: Sind solche Mieter nie oder erst nach dem Versand nicht mehr löschbar?
- «Kennung des Kontos beim Anbieter»: Hier ist mit «Anbieter» Google gemeint, eine Karte weiter oben aber der Hoster. Das gleiche Wort steht für zwei Dinge.
- «PostgreSQL-Datenbank»: für einen Vermieter ein Fachwort ohne Nutzen. Ein Ort oder Land wäre mir wichtiger.

## Fehlerrisiken

- Ein Vermieter liest «verantwortlich ist ihr Betreiber», hält sich für entlastet und informiert seine Mieter nicht, obwohl die Nutzungsbedingungen genau das von ihm verlangen.
- Ein Mieter verlangt Löschung seiner Daten. Der Vermieter findet weder in der Erklärung noch in den Bedingungen, ob und wie das geht, und Dwello verhindert bei Mahnungen die Löschung ganz.
- Wer die Erklärung nicht liest, tippt Adressen in die Adresssuche, ohne zu wissen, dass sie nach Deutschland gehen. Die Hilfe am Feld sagt es nicht.
- Ohne Datum auf den Texten lässt sich nach einer Änderung nicht belegen, welche Fassung akzeptiert wurde.

## Vorschläge

- **P-1:** Abgemeldet `/login` → «Datenschutzerklärung» → Karte «Verantwortlich»; danach «Nutzungsbedingungen» → «Verantwortung für Abrechnungen». Hilfreich: ein Satz, der die Rollen klärt, z. B. «Für die Daten Ihrer Mieter sind Sie als Vermieter verantwortlich; ein Anbieter, der Dwello für Sie betreibt, bearbeitet sie in Ihrem Auftrag.» (fachlich prüfen lassen).
- **P-2:** `/privacy`, ganze Seite. Hilfreich: ein eigener Abschnitt «Ihre Rechte» mit Auskunft, Berichtigung, Löschung (mit Hinweis auf gesetzliche Aufbewahrung und was Dwello nicht löschen lässt), Widerspruch, Herausgabe, Beschwerde beim EDÖB, und an wen man sich wendet.
- **P-3:** `/terms`. Hilfreich: Vertragspartner (oder Hinweis, dass es der Betreiber ist), Stand, Haftungsbegrenzung, Schweizer Recht und Gerichtsstand, wie Änderungen mitgeteilt werden, Kündigung und Export der Daten.
- **P-4:** `/privacy` → «Verantwortlich». Hilfreich: Der Betreiber muss Name und Adresse hinterlegen, bevor Daten erfasst werden. Mindestens sollte ein angemeldeter Betreiber einen Hinweis bekommen, dass die Angabe fehlt.
- **P-5:** `/privacy` → «Aufbewahrung», erster Absatz. Hilfreich: aufteilen, z. B. «Nach dem Versand lassen sich Abrechnungen nicht mehr löschen. Mahnungen lassen sich nie löschen. Mieter und Mietverträge mit Abrechnungen lassen sich ebenfalls nicht löschen.» Und sagen, wie lange solche Daten höchstens bleiben, oder dass sie bleiben, bis der Betreiber sie entfernt.
- **P-6:** `/privacy` → «Aufbewahrung», zweiter Absatz. Hilfreich: ein Satz für Privatvermieter (z. B. Aufbewahrung von Belegen wegen Steuern und Belegeinsicht der Mieter, fachlich zu prüfen).
- **P-7:** `/privacy` → «Welche Daten Dwello speichert». Hilfreich: «Die Daten liegen auf dem Server des Betreibers. In welchem Land er steht, erfahren Sie beim Betreiber.» statt «PostgreSQL-Datenbank».
- **P-8:** `/terms` → «Verantwortung für Abrechnungen». Hilfreich: Link zur Datenschutzerklärung mit dem Hinweis, welche Abschnitte die Mieter betreffen, oder ein kurzer Mustertext.
- **P-9:** `/privacy` und `/terms` ganz oben bzw. Fusszeile. Hilfreich: «Stand: <Datum>» auf beiden Seiten.
- **P-10:** `/privacy` → «Weitergabe an Dritte», OpenPLZ-Absatz. Hilfreich: ein Satz, dass Deutschland laut Bundesrat einen angemessenen Datenschutz hat.

## Nicht geprüft

- Die Datenschutzerklärungen von Google (`https://policies.google.com/privacy`) und OpenPLZ (`https://legal.stueber.de/privacy.php`): Der Sandkasten blockiert externe Seiten, deshalb habe ich nur die Linkziele notiert.
- Die Gültigkeit von «dwello_session» und «dwello_xsrf» (7 Tage) und die Verlängerung «etwa alle 50 Minuten»: Die Persona-Umgebung meldet mich mit eigenen Cookies an, eine echte Google-Anmeldung war nicht möglich.
- Das Server-Protokoll, die Aussage zur KI auf dem Server des Betreibers und der Mailserver: von aussen als Nutzer nicht prüfbar.
- Ob Dwello nach Ende eines Mietvertrags wirklich die alten Dokumente nennt: Dafür hätte ich Daten ändern müssen; ich sollte nur lesen.
- Andere Sprachen: Auftrag war Deutsch.
