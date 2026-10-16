# Dr. Weber – Datenschutzerklärung gegen Netzwerkverkehr (Gebäudeseite, Gebäudeliste)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack, http://localhost:3300, Demodaten. Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/012cff12-39ac-5ff5-abe7-180db4ea5c25/scratchpad/weber-map129/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. Die Datenschutzerklärung nennt für Gebäudeliste und Gebäudeseite genau die Dienste, die der Browser kontaktiert (keinen), und nichts darüber hinaus. Die Adresse steht auf der Gebäudeseite klar sichtbar. |

## Beobachtungen

- Die Gebäudeseite «Musterhaus Zentrum» lädt beim Öffnen, nach 5 Sekunden Warten und beim Scrollen bis ans Ende ausschliesslich von `localhost:3300` (24 Anfragen: Seitendaten und Skripte). Kein Kartenbild, kein iframe, kein Bild von fremden Servern, kein externer Link auf der Seite.
- Die Gebäudeliste lädt ebenfalls nur von `localhost:3300`. Die drei Links «Route planen zu … (öffnet in neuem Tab)» zeigen auf `https://www.google.com/maps/dir/?api=1&destination=<Strasse>, <PLZ> <Ort>, Switzerland`. Auch wenn ich mit der Maus über einen dieser Links fahre, geht keine Anfrage an Google hinaus. Das stimmt mit dem Satz «Google erhält die Adresse und die IP-Adresse des Browsers erst, wenn Sie den Link wählen» überein.
- Die Links haben `rel="noopener"`, aber kein `noreferrer`, und die Seite sendet keinen `Referrer-Policy`-Header. Mit der Standardeinstellung des Browsers erfährt Google beim Klick also auch, von welcher Adresse die Dwello-Installation aufgerufen wird (nur die Herkunft, ohne Pfad). Die Erklärung nennt nur «die Adresse und die IP-Adresse des Browsers». Für meine Mieter ist das unerheblich, ich halte es aber für erwähnenswert. Bei einer eigenen Domain wie `dwello.weber-immobilien.ch` würde Google den Namen des Vermieters erfahren.
- Nebenbei geprüft (Behauptung im selben Abschnitt): Bei «Gebäude erfassen» ruft der Browser beim Tippen in die Adresssuche direkt `https://openplzapi.org/ch/FullTextSearch?searchTerm=…` auf (eine einzige Anfrage nach dem Tippen von «Bahnhofstrasse 42 Zürich»). Das deckt sich mit dem Text: OpenPLZ erhält IP-Adresse und Suchbegriff. Nichts gespeichert.
- Cookies nach dem Rundgang: `dwello_session`, `dwello_xsrf`, `PARAGLIDE_LOCALE`, alle für `localhost`. Sie sind alle in der Erklärung beschrieben.
- Auf der Gebäudeseite gibt es kein «Route planen», nur in der Liste. Die Erklärung sagt korrekt «in der Gebäudeliste».
- Der Link übergibt «Switzerland» auf Englisch und lässt den Kanton weg. Für Google Maps funktioniert das, es fällt nur beim Lesen der Adresse im Link auf.
- In der Gebäudeliste steht im Feld «Ort (optional)» grau «Zürich». Erst auf den zweiten Blick erkennt man, dass das ein Beispiel ist und kein gesetzter Filter.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 3 Durchgänge (Datenschutz lesen → Liste → Gebäudeseite; Hover- und Scrolltest; Adresssuche bei «Gebäude erfassen»).

## Ablauf

1. **/privacy, Abschnitt «Weitergabe an Dritte».** Erwartet: eine Liste der externen Dienste. Gesehen: KI (läuft auf dem Server des Betreibers), Mailversand (SMTP oder Resend), OpenPLZ für die Adresssuche beim Erfassen, Google Maps über «Route planen» in der Gebäudeliste (erst beim Klick), und der Schlusssatz «Ausser den hier und unter ‹Anmeldung› genannten Diensten erhält niemand Daten von Dwello.» Die Sätze sind klar und kurz. Eine Karte auf der Gebäudeseite wird nicht erwähnt.
2. **Gebäudeliste (/buildings).** Erwartet: höchstens Google beim Klick auf «Route planen». Gesehen: 3 Karten mit Name, Adresse samt Kanton, Typ, Baujahr und Wohnungszahlen. Netzwerk: nur `localhost:3300`. Beim Überfahren von «Route planen» geht keine Anfrage hinaus. Stimmt.
3. **Klick auf «Musterhaus Zentrum».** Erwartet laut Erklärung: kein externer Dienst. Gesehen: Brotkrumen «Gebäude › Musterhaus Zentrum», Titel, Karte «Angaben zum Gebäude» mit «Adresse: Bahnhofstrasse 42, 8001 Zürich (ZH)» fett und gut lesbar an erster Stelle, daneben Gebäudetyp, Baujahr und Wohnungen. Darunter die Wohnungen nach Geschoss, die Erklärung zum Mietstatus und «Brennstoff im Tank oder Lager». Keine Karte. Netzwerk: nur `localhost:3300`, auch nach Warten und Scrollen. Stimmt.
4. **Gegenprobe Adresssuche (/buildings/new).** Erwartet: Anfrage an openplzapi.org. Gesehen: genau diese, direkt aus dem Browser. Stimmt.

## Verwirrung

- Keine bei den Begriffen. «Betreiber dieser Dwello-Installation» ist für mich als Vermieter, der Dwello selbst betreibt, etwas abstrakt: Bin das ich oder mein Hoster? Für die Mieterinformation muss ich das selbst übersetzen.

## Fehlerrisiken

- Gering. Wer die Erklärung an Mieter weitergibt, muss wissen, dass der Mailversand (SMTP oder Resend) vom eigenen Setup abhängt. Die Erklärung lässt offen, welcher von beiden eingerichtet ist.

## Vorschläge

Keine Tabellen-IDs. Optional zur Beobachtung Referrer: den Google-Maps-Links `rel="noopener noreferrer"` geben oder im Satz zu «Route planen» ergänzen, dass Google auch die Adresse der Dwello-Installation sieht.

## Nicht geprüft

- Anmeldung über Google: Das Persona-Werkzeug meldet direkt mit einem Sitzungscookie an, der Google-Login lief also nicht.
- KI und Mailversand: Beides läuft auf dem Server, aus dem Browser nicht beobachtbar. Die Behauptung «die Daten verlassen den Server nicht» konnte ich nicht nachprüfen.
- Ob die Anfrage an openplzapi.org im Stack eine Antwort bekam: Ich habe nur gesehen, dass der Browser sie abschickt.
- Andere Bildschirme als Gebäudeliste, Gebäudeseite, Datenschutz und Gebäude erfassen.
