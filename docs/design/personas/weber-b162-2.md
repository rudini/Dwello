# Dr. Weber – Öffentliche Demo, Runde 2: geänderte Texte (b162)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Öffentliche Demo auf http://localhost:3300 (DEMO=on). Nur angesehen, nichts gespeichert. Geprüft: nur die geänderten Texte (Demo-Hinweis, Datenschutz «Öffentliche Demo» und «Anmeldung») auf /login, /dashboard und /privacy, Deutsch und Französisch. Runde 1: `weber-b162.md`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | /privacy, «Anmeldung» (DE und FR) | «jede Verlängerung der Sitzung» bzw. «chaque prolongation de la session»: Für mich als Laien unklar, wann das geschieht (automatisch? bei jedem Klick? wie oft?). Der Satz sagt damit eigentlich, dass meine Nutzung laufend mit E-Mail-Adresse protokolliert wird, aber so verstehe ich ihn nur, wenn ich weiss, was eine Sitzungsverlängerung ist. |
| P-2 | Minor | /privacy, «Anmeldung» | Die Angabe zur Aufbewahrung ist ganz weggefallen. In Runde 1 stand wenigstens «Ältere Einträge werden laufend überschrieben» (dort als zu vage bemängelt, alt P-2, jetzt #82). Jetzt steht nur noch, dass festgehalten wird, nicht wie lange und wozu. Das gehört zu #82, sollte dort aber vermerkt werden, damit die Lücke nicht als «gelöst» gilt. |
| P-3 | Minor | /privacy, «Öffentliche Demo» | «Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht.» stimmt wörtlich, wirkt in diesem Abschnitt aber beruhigender, als es ist: dass der Betreiber beides im Serverprotokoll hat, steht erst zwei Abschnitte weiter unten unter «Anmeldung». Wer nur den Demo-Abschnitt liest, schliesst «niemand sieht meine Adresse». |
| P-4 | Minor | /login, Demo-Hinweis (DE und FR) | «Geben Sie deshalb keine echten Daten ein» ist jetzt absolut formuliert, die Anmeldung verlangt aber ein echtes Google-Konto, dessen Adresse protokolliert wird. Ein vorsichtiger Besucher fragt sich, ob er sich mit seinem echten Konto überhaupt anmelden darf. Verschärft alt P-4 (#82), der Hinweis schweigt weiterhin zur Protokollierung. |
| P-5 | Nit | Demo-Hinweis FR, alle drei Seiten | «N’entrez donc pas de vraies données, ni adresses e-mail ni numéros de téléphone.» Nach der Verneinung fehlt das «de/d’»: üblich wäre «… ni d’adresses e-mail ni de numéros de téléphone» oder «N’entrez donc aucune donnée réelle, ni adresse e-mail ni numéro de téléphone.» |

**Aufgabe geschafft:** ja. Der Widerspruch aus Runde 1 (alt P-1) ist behoben, in DE und FR.

**Aufwand:** etwa 8 Minuten, 6 Schritte (/login, /privacy ohne Sitzung, /dashboard mit Sitzung, Sprache auf Français, /dashboard und /privacy FR, /login FR ohne Sitzung).

## Ablauf

1. **/login ohne Sitzung, Deutsch.** Erwartet: neuer Hinweistext mit E-Mail-Adressen und Telefonnummern. Gesehen: gelber Kasten «Öffentliche Demo»: «Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht und die erfundenen Beispieldaten neu geladen. Geben Sie deshalb keine echten Daten ein, auch keine E-Mail-Adressen oder Telefonnummern.» Klar und gut lesbar; alt P-8 (E-Mail, Telefon fehlen) ist damit erledigt. «erfundenen Beispieldaten» ist ehrlich und verständlich. Neu irritiert mich nur das absolute «keine echten Daten» neben dem Knopf «Mit Google anmelden» (P-4). Datenschutz ist nur im Fuss verlinkt, nicht beim Anmeldeknopf (wie Runde 1, #82).
2. **/privacy ohne Sitzung, Deutsch.** Erwartet: «Anmeldung» und «Öffentliche Demo» widersprechen sich nicht mehr. Gesehen: «Anmeldung»: «… verwendet sie, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen. Jede Anmeldung und jede Verlängerung der Sitzung wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten.» Das «nur» ist weg, die Protokollierung steht im selben Abschnitt: **Widerspruch behoben.** Der Satz gilt ohne Einschränkung, also für jede Installation, wie angekündigt. «Verlängerung der Sitzung» verstehe ich nicht genau (P-1). Eine Aufbewahrungsangabe gibt es nicht mehr (P-2). «Öffentliche Demo»: geteilte Daten, nächtliches Löschen, erfundene Beispieldaten, «Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht.» Kein eigener Protokollsatz mehr, also keine Doppelung. Der Satz zu anderen Besuchern ist korrekt, aber ohne Verweis auf das Protokoll (P-3).
3. **/dashboard mit Sitzung, Deutsch.** Erwartet: derselbe Hinweis wie auf /login. Gesehen: wortgleich, über der Überschrift «Übersicht».
4. **Sprache auf Français, /dashboard.** Gesehen: «Démo publique – Tous les visiteurs voient et modifient les mêmes données. Chaque nuit, toutes les modifications sont supprimées et les données d’exemple fictives sont rechargées. N’entrez donc pas de vraies données, ni adresses e-mail ni numéros de téléphone.» Inhaltlich deckungsgleich, sprachlich holprig (P-5).
5. **/privacy FR.** «Connexion»: «… et les utilise pour gérer la session et afficher le nom dans l’en-tête. Chaque connexion et chaque prolongation de la session sont consignées avec l’adresse e-mail dans le journal du serveur.» Kein «ne … que» mehr: Widerspruch auch auf Französisch behoben. «Démo publique»: «Les autres visiteurs ne voient ni votre nom ni votre adresse e-mail.» Korrekt, deckungsgleich mit DE.
6. **/login FR ohne Sitzung.** Hinweis wie in Schritt 4. Alle Anfragen während des Rundgangs gingen nur an localhost:3300 (der Google-Fonts-Satz, alt P-6, steht weiterhin da; #82).

## Verwirrung

- «Verlängerung der Sitzung» / «prolongation de la session»: was löst sie aus, wie oft?
- «Protokoll des Servers»: weiterhin ohne Zweck, Dauer, Zugriff (#82).
- «keine echten Daten» gegenüber der Pflicht, sich mit einem echten Konto anzumelden.

## Fehlerrisiken

- Wer nur den Abschnitt «Öffentliche Demo» liest, hält seine E-Mail-Adresse für nirgends sichtbar (P-3).
- Ein Prüfer sieht in #82 «Aufbewahrung zu vage» und übersieht, dass die Angabe inzwischen ganz fehlt (P-2).

## Vorschläge

- **P-1:** /privacy, «Anmeldung», vierter Satz. Hilfe: in einfachen Worten, z. B. «Jede Anmeldung wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten, ebenso jede automatische Verlängerung der Sitzung, solange Sie Dwello benutzen (etwa alle X Minuten).»
- **P-2:** /privacy, «Anmeldung» lesen: keine Aufbewahrungsangabe. Hilfe: in #82 festhalten, dass die Angabe jetzt fehlt; dort Dauer und Zweck nachtragen.
- **P-3:** /privacy, «Öffentliche Demo», letzter Satz. Hilfe: ergänzen «… Der Betreiber sieht sie im Protokoll des Servers (siehe «Anmeldung»).»
- **P-4:** /login ohne Sitzung, Hinweis lesen, dann den Anmeldeknopf. Hilfe: «Geben Sie in der Demo keine echten Daten ein …» und ein Satz zur Anmeldung, z. B. «Für die Anmeldung brauchen Sie Ihr Google-Konto; die E-Mail-Adresse wird protokolliert (Datenschutz).» Gehört zu #82 (alt P-4).
- **P-5:** /login auf Français. Hilfe: «N’entrez donc aucune donnée réelle, ni adresse e-mail ni numéro de téléphone.»

## Nicht geprüft

- /terms, Italienisch und Englisch, mobile Ansicht (nicht Teil dieser Runde).
- Ob andere Besucher meinen Namen wirklich nirgends sehen (etwa als «geändert von» an einem Datensatz): dazu müsste ich speichern, was ich nicht sollte.
- Ob und wie oft die Sitzung verlängert und protokolliert wird: als Benutzer nicht sichtbar.
- Unveränderte Punkte aus Runde 1 (alt P-9 bis P-11, z. B. FR «rappels» für Zahlungserinnerung und Mahnung) habe ich nur gesehen, nicht neu bewertet; sie stehen unverändert.
