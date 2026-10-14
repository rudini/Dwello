# Dr. Weber – Öffentliche Demo, Runde 3: geänderte Texte (b162)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Öffentliche Demo auf http://localhost:3300 (DEMO=on). Nur angesehen, nichts gespeichert. Geprüft: nur die geänderten Texte (Demo-Hinweis, Datenschutz «Öffentliche Demo», «Anmeldung», dazu die neu gefassten Angaben zu Dritten und Cookies) auf /login und /privacy, ohne Sitzung, Deutsch und Französisch. Frühere Runden: `weber-b162.md`, `weber-b162-2.md`.

## Stand der Befunde aus Runde 2

| Runde-2-ID | Stand |
|---|---|
| P-1 (Verlängerung der Sitzung unklar) | **behoben.** «(etwa alle 50 Minuten, solange Dwello offen ist)» bzw. «(environ toutes les 50 minutes tant que Dwello est ouvert)» sagt mir, dass das automatisch und laufend geschieht. |
| P-3 (Demo-Abschnitt beruhigt zu sehr) | **behoben.** «… nur der Betreiber im Protokoll des Servers (siehe «Anmeldung»)» bzw. «seul l’exploitant les voit dans le journal du serveur (voir « Connexion »)». Wer nur diesen Abschnitt liest, weiss jetzt Bescheid. |
| P-5 (FR, fehlendes «de») | **behoben.** «N’entrez donc que des données inventées, y compris pour les adresses e-mail et les numéros de téléphone.» Korrektes Französisch, inhaltlich deckungsgleich mit DE. |
| P-2, P-4 | nicht Teil dieser Runde, offen in #82. P-4 ist durch «nur erfundene Daten eingeben» milder geworden: meine Google-Adresse gebe ich ja nicht selbst ein. Dass sie protokolliert wird, sagt der Hinweis auf /login weiterhin nicht. |

## Neue Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | /privacy, «Anmeldung» (DE und FR) | Dwello erhält «Name, E-Mail-Adresse und Profilbild», der Satz nennt als Verwendung aber nur Sitzung und Namen in der Kopfzeile. Was mit dem Profilbild geschieht (angezeigt? gespeichert? anderen Demo-Besuchern sichtbar?), bleibt offen; der Demo-Abschnitt nennt nur Name und E-Mail-Adresse. |
| P-2 | Nit | /privacy, «Cookies» (DE und FR) | Bei «dwello_oauth_state», «dwello_login» (10 Minuten) und «PARAGLIDE_LOCALE» (400 Tage) steht eine Dauer, bei «dwello_session» und «dwello_xsrf» nicht. Wie lange ich angemeldet bleibe, erfahre ich nicht; die 50 Minuten aus «Anmeldung» sind die Verlängerung, nicht die Lebensdauer. |

**Aufgabe geschafft:** ja. P-1, P-3 und P-5 aus Runde 2 sind in DE und FR behoben; neu nur zwei Nits.

**Aufwand:** etwa 6 Minuten, 4 Schritte (/login DE, /privacy DE, Sprache auf Français über «Sprache: Deutsch», /login und /privacy FR).

## Ablauf

1. **/login ohne Sitzung, Deutsch.** Erwartet: «nur erfundene Daten … auch bei E-Mail-Adressen und Telefonnummern». Gesehen: gelber Kasten «Öffentliche Demo», wortgleich: «… Geben Sie deshalb nur erfundene Daten ein, auch bei E-Mail-Adressen und Telefonnummern.» Positiv formuliert, verständlich. Darunter «Mit Google anmelden» und der Hinweis auf die Nutzungsbedingungen; Datenschutz nur im Fuss (wie bisher, #82).
2. **/privacy, Deutsch.** Erwartet: Abschnitt «Anmeldung» mit Zeitangabe und nur einem Anbieter, Demo-Abschnitt mit Verweis. Gesehen: «Die Anmeldung erfolgt über Google.» (nur ein Anbieter, passt zum einzigen Knopf auf /login). «Jede Anmeldung und jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten.» Klar. Demo-Abschnitt endet mit «… nur der Betreiber im Protokoll des Servers (siehe «Anmeldung»).» Klar. Die Angaben zu CARTO, OpenPLZ, Google Maps («erst, wenn Sie den Link wählen») und der Schlusssatz «Ausser den hier und unter «Anmeldung» genannten Diensten erhält niemand Daten von Dwello» sind in sich schlüssig; ich finde keinen Widerspruch zum Demo-Abschnitt. Aufgefallen: Profilbild ohne Verwendungszweck (P-1), Cookie-Dauer nur teilweise (P-2).
3. **Sprache auf Français.** Das Menü «Sprache: Deutsch» zeigt Deutsch, Français, Italiano, English; nach «Français» bleibt /login offen und ist französisch. Hinweis: «N’entrez donc que des données inventées, y compris pour les adresses e-mail et les numéros de téléphone.» Korrekt.
4. **/privacy FR.** «Connexion»: «La connexion se fait via Google. … Chaque connexion et chaque prolongation de la session (environ toutes les 50 minutes tant que Dwello est ouvert) sont consignées avec l’adresse e-mail dans le journal du serveur.» «Démo publique»: «Les autres visiteurs ne voient ni votre nom ni votre adresse e-mail ; seul l’exploitant les voit dans le journal du serveur (voir « Connexion »).» Grammatik und Inhalt stimmen mit DE überein. Cookies und Dritte deckungsgleich mit DE.

## Verwirrung

- «Profilbild»: wozu bekommt Dwello es?
- «hält Sie angemeldet»: wie lange?
- «Protokoll des Servers»: Zweck, Dauer, Zugriff fehlen weiterhin (#82, bekannt).

## Fehlerrisiken

- Gering. Wer sein Profilbild für privat hält, kann nicht prüfen, ob es in der Demo sichtbar ist (P-1).

## Vorschläge

- **P-1:** /privacy, «Anmeldung», zweiter Satz lesen. Hilfe: Verwendung des Profilbilds nennen (z. B. «… und zeigt das Profilbild nirgends an» oder wo es erscheint), oder das Profilbild weglassen, wenn Dwello es gar nicht verwendet; im Demo-Abschnitt ggf. «Name, E-Mail-Adresse und Profilbild».
- **P-2:** /privacy, «Cookies», zweiten Absatz lesen. Hilfe: Lebensdauer von «dwello_session» und «dwello_xsrf» ergänzen (z. B. «bis Sie sich abmelden, höchstens …»).

## Nicht geprüft

- /dashboard mit Sitzung, /terms, Italienisch und Englisch (nicht Teil dieser Runde).
- Ob das Profilbild irgendwo angezeigt wird: die Persona-Sitzung hat kein Profilbild, und speichern sollte ich nicht.
- Ob die Sitzung tatsächlich etwa alle 50 Minuten verlängert und protokolliert wird: als Benutzer nicht sichtbar.
- Aufbewahrung, Zweck und Verantwortlicher des Protokolls (#82, ausdrücklich offen).
