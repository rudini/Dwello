# Dr. Weber – Datenschutz, zweiter Durchgang (f19a-2)

Persona: Dr. Weber, 52, liest alles und prüft nach. Desktop 1440 × 900, Maus. Nur angeschaut, nichts gespeichert.
Geprüft: Abschnitte «Weitergabe an Dritte» und «Cookies» auf `/privacy` (Deutsch und Italienisch), verglichen mit dem, was die App tatsächlich tut. Ich habe dabei die Netzwerkanfragen des Browsers und die gesetzten Cookies mitgeschrieben.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | Datenschutz, «Cookies» (de, it) | «PARAGLIDE_LOCALE speichert die Sprache der Oberfläche» klingt nach einer Wahl. Tatsächlich wird das Cookie schon beim ersten Aufruf der Anmeldeseite gesetzt (Wert `de`), bevor jemand angemeldet ist oder eine Sprache gewählt hat. Die Aussage ist nicht falsch, verrät aber nicht, wann das Cookie gesetzt wird. |
| P-2 | Nit | Datenschutz, «Weitergabe an Dritte», «Route planen» (de, it) | Die Aussage stimmt: Google erhält die Adresse erst beim Klick. Beim Klick sendet der Browser aber auch die Herkunft (`Referer: http://localhost:3300/`, also die Adresse dieser Dwello-Installation) und natürlich die IP-Adresse mit. Bei CARTO und OpenPLZ nennt der Text die IP-Adresse, bei Google nicht. |
| P-3 | Nit | Datenschutz, it | Im italienischen Text heisst es «durante l’inserimento di un immobile», der Knopf in der App heisst aber «Registrare un immobile». Auf Deutsch passt es («beim Erfassen eines Gebäudes» / «Gebäude erfassen»). Ich habe trotzdem verstanden, was gemeint ist. |

Ich habe keine Blocker, Major oder Minor gefunden. Alle geprüften Sachaussagen stimmen mit dem überein, was die App macht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, 12 Durchläufe: Datenschutzseite auf Deutsch und Italienisch, Gebäudeliste auf de/it, Klick auf «Route planen», Gebäudeseite, «Neues Gebäude» auf de/it mit Adresssuche, Bearbeitungsformular eines Gebäudes auf de/it, frischer Browser (de-CH und it-CH) mit Cookie-Prüfung und Start der Anmeldung.

## Ablauf

1. **Datenschutz auf Deutsch lesen.** Erwartet: klare Aussagen zu Adresssuche, Route und Sprach-Cookie. Gesehen: «Die Adresssuche beim Erfassen eines Gebäudes fragt OpenPLZ (openplzapi.org) nach passenden Adressen. Dabei erhält OpenPLZ die IP-Adresse des Browsers und den eingegebenen Suchbegriff.» – «‹Route planen› in der Gebäudeliste öffnet Google Maps mit der Adresse des Gebäudes. Google erhält die Adresse erst, wenn Sie den Link wählen.» – «‹PARAGLIDE_LOCALE› speichert die Sprache der Oberfläche für 400 Tage; JavaScript kann es lesen.» Dazu CARTO für die Karte, Sprachmodell auf dem Server, Mailversand, Cookies `dwello_session`, `dwello_xsrf`, `dwello_oauth_state`, `dwello_login` (höchstens 10 Minuten).
2. **Auf Italienisch umstellen** (Knopf «Sprache: Deutsch» oben, «Italiano»). Erwartet: gleiche Aussagen. Gesehen: «Trasmissione a terzi» und «Cookie» sagen inhaltlich dasselbe: OpenPLZ mit IP und Suchbegriff, «Pianificare il percorso» öffnet Google Maps erst beim Klick, «PARAGLIDE_LOCALE» 400 giorni, JavaScript può leggerlo. Einzig die Wortwahl «inserimento» weicht vom Knopf ab (P-3).
3. **Gebäudeliste, «Route planen».** Erwartet: ein gewöhnlicher Link, beim Laden der Liste keine Anfrage an Google. Gesehen: pro Gebäude ein Link «Route planen zu Alpenblick (öffnet in neuem Tab)», Ziel `https://www.google.com/maps/dir/?api=1&destination=Bergstrasse%208%2C%203800%20Interlaken%2C%20Switzerland`, neuer Tab. Beim Laden der Liste: keine einzige Anfrage an einen fremden Server. Erst beim Klick ging genau eine Anfrage an google.com, mit der Adresse in der URL und dem Referer der Dwello-Installation (P-2). Auf Italienisch heisst der Link «Pianificare il percorso verso …», wie im Datenschutztext. Auf der Gebäudeseite selbst gibt es keinen Route-Link, also stimmt «in der Gebäudeliste».
4. **Gebäudeseite (Alpenblick).** Nur zur Kontrolle der Aussage «niemand sonst»: Es luden nur Kartenbilder von `a–d.basemaps.cartocdn.com`, wie im Text zu CARTO beschrieben.
5. **«Neues Gebäude», Adresssuche.** Erwartet: Anfrage an OpenPLZ direkt aus dem Browser, erst nach dem Tippen. Gesehen: Beim Öffnen des Formulars keine fremde Anfrage. Nach dem Tippen von «Bahnhofstrasse Zürich» ging genau eine Anfrage direkt vom Browser an `https://openplzapi.org/ch/FullTextSearch?searchTerm=Bahnhofstrasse+Z%C3%BCrich&pageSize=8`. Also bekommt OpenPLZ tatsächlich die IP des Browsers und den Suchbegriff, sonst nichts. Das Ausfüllen von Strasse, PLZ und Ort von Hand löste keine Anfrage aus. Auf Italienisch dasselbe («Cercare un indirizzo (facoltativo)», Anfrage mit «Via Nassa Lugano»).
6. **Bearbeitungsformular eines bestehenden Gebäudes** (Alpenblick, «Bearbeiten»). Erwartet: falls es eine Adresssuche gibt, müsste der Text sie auch nennen. Gesehen: Es gibt hier keine Adresssuche, nur die Felder Strasse und Hausnummer, PLZ, Ort, Kanton. Beim Öffnen keine fremde Anfrage, weder auf Deutsch noch auf Italienisch. Die Einschränkung «beim Erfassen eines Gebäudes» stimmt also.
7. **Frischer Browser ohne Anmeldung (de-CH).** Erwartet: höchstens das Sprach-Cookie. Gesehen: Nach dem Aufruf von `/` (Weiterleitung auf die Anmeldeseite) liegt genau ein Cookie vor: `PARAGLIDE_LOCALE=de`, Ablauf in 34 560 000 Sekunden = 400 Tage, nicht HttpOnly (für JavaScript lesbar), SameSite=Lax. Es kam ohne Set-Cookie-Kopfzeile, also setzt es die Seite selbst, ohne dass ich eine Sprache gewählt hatte (P-1). Auch die Datenschutzseite ist ohne Anmeldung erreichbar, mit Sprachwahl.
8. **Anmeldung starten** («Mit Google anmelden»). Gesehen: Dwello setzt `dwello_oauth_state` und `dwello_login`, beide `Max-Age=600` (10 Minuten), HttpOnly. Das stimmt mit dem Text überein. Der Rest der Anmeldung liess sich nicht durchspielen (siehe «Nicht geprüft»).
9. **Sprache wechseln (angemeldet).** Nach der Wahl «Italiano» stand `PARAGLIDE_LOCALE=it`, wieder 400 Tage, für JavaScript lesbar.

## Verwirrung

- «PARAGLIDE_LOCALE» ist ein technischer Name ohne Bezug zu Dwello; als Juristin akzeptiere ich ihn, weil der Text erklärt, was er tut.
- Italienisch: «inserimento» statt «registrare» (P-3), kleine Unstimmigkeit gegenüber dem Knopf.

## Fehlerrisiken

- Gering. Wer den Text wörtlich nimmt, könnte meinen, das Sprach-Cookie entstehe erst durch eine Sprachwahl (P-1). Wer prüft, ob Google ausser der Adresse noch etwas erfährt, findet im Text nichts zum Referer (P-2).

## Vorschläge

- **P-1:** Frischen Browser öffnen, `http://localhost:3300/` aufrufen, Cookies ansehen: `PARAGLIDE_LOCALE=de` ist schon gesetzt. Hilfreich wäre ein Satz wie: «‹PARAGLIDE_LOCALE› wird beim ersten Besuch gesetzt und speichert die Sprache der Oberfläche für 400 Tage; JavaScript kann es lesen.» Die Übersetzungen entsprechend anpassen.
- **P-2:** Gebäudeliste öffnen, «Route planen zu Alpenblick» klicken: Die Anfrage an google.com trägt `Referer: <Adresse der Installation>`. Entweder den Text ergänzen («Google erhält dabei auch die IP-Adresse des Browsers»), wie bei CARTO und OpenPLZ, oder den Link mit `rel="noreferrer"` versehen, damit die Adresse der Installation nicht mitgeht.
- **P-3:** Datenschutz auf Italienisch: «durante l’inserimento di un immobile» an den Knopf «Registrare un immobile» angleichen, z. B. «durante la registrazione di un immobile».

## Nicht geprüft

- Die echten Eigenschaften von `dwello_session` und `dwello_xsrf` nach einer echten Anmeldung: Im Prüfbrowser setzt das Persona-Werkzeug diese Cookies selbst (darum war `dwello_session` dort für JavaScript lesbar); eine echte Google-Anmeldung war nicht möglich (Google meldet `invalid_client`). Die Aussage «JavaScript kann es nicht lesen» konnte ich deshalb nicht bestätigen.
- Die Treffer der Adresssuche: In dieser Umgebung kam von OpenPLZ keine Trefferliste an; geprüft habe ich nur, wohin die Anfrage geht und was sie enthält.
- Französisch und Englisch waren nicht Teil der Aufgabe.
- Andere Abschnitte der Datenschutzseite (gespeicherte Daten, Anmeldung, Mailversand, Sprachmodell) waren nicht Teil der Aufgabe.
