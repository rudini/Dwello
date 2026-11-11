# Helga – Abmelden abgelehnt (logout-refused, #1434)

Persona: Helga, 68, Desktop 1440 × 900, Zoom 150 % (Gegenprobe 200 %), Maus. Persona-App http://localhost:3300 mit Demodaten, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c91e0497-acb8-583b-83bc-d296ce95f298/scratchpad/helga-logout-refused/`.

Ablauf der Simulation: `/dashboard` öffnen, danach im Browser nur das Cookie «dwello_xsrf» löschen («dwello_session» bleibt), Benutzermenü oben rechts öffnen, «Abmelden» wählen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht, Meldung im Kopfbereich | Die Meldung verlangt «Laden Sie die Seite neu», bietet dafür aber keine Schaltfläche. Ich weiss nicht sicher, wie man eine Seite neu lädt (F5? der runde Pfeil oben im Browser?). Ein Knopf direkt in der Meldung hätte mir das Suchen erspart. |

## Beobachtungen

- Die Meldung ist gross, rot umrandet, mit Ausrufezeichen-Symbol und Text, direkt unter dem Kopf über der ganzen Breite (Screenshot `z150-07-refused.png`, `03-after-logout-viewport.png`). Bei 200 % bricht sie sauber auf zwei Zeilen um, nichts wird abgeschnitten (`z200-07-refused.png`). Ich habe sie sofort gesehen.
- Text: «Dwello konnte Sie nicht abmelden. Laden Sie die Seite neu und melden Sie sich noch einmal ab.» Kurz, in «Sie», ohne Fachwörter. Was passiert ist, verstehe ich: das Abmelden hat nicht geklappt. Warum, sagt sie nicht – brauche ich aber auch nicht.
- Ob ich noch angemeldet bin, lese ich aus «konnte Sie nicht abmelden» heraus, und die Seite zeigt weiter meinen Namen «Vera Verwalter» oben rechts und alle Menüpunkte. Ausdrücklich steht «Sie sind noch angemeldet» aber nicht da; für eine ängstliche Nutzerin am fremden Computer wäre dieser eine Satz beruhigend.
- Das Benutzermenü schliesst sich nach dem Klick, der Fokus liegt wieder auf dem Knopf «Vera Verwalter». Die Meldung hat die Rolle «alert» und ist als Überschrift Ebene 2 im Kopfbereich (banner) ausgezeichnet.
- Nach dem Neuladen ist die Meldung weg, und das zweite «Abmelden» bringt mich auf «Anmelden» (`z150-09-login.png`). Danach führt `/dashboard` wieder zur Anmeldeseite (Weiterleitung `/login?redirectTo=%2Fdashboard`), von den Cookies bleibt nur die Spracheinstellung. Ich bin also wirklich abgemeldet.
- Wer die Anweisung nicht befolgt und ohne Neuladen gleich nochmals auf «Abmelden» klickt, wird ebenfalls abgemeldet und landet auf «Anmelden» (Netzwerk: erster `POST /auth/logout` 403, die Antwort setzt ein neues «dwello_xsrf», der zweite `POST /auth/logout` 200). Das Neuladen ist also gar nicht nötig; ein Knopf «Erneut abmelden» in der Meldung würde genügen.
- Netzwerk: die Seite ruft nur `localhost:3300` auf (`/dashboard`, `/auth/logout`, `/login/__data.json`).

## Aufgabe geschafft: ja

## Aufwand

Etwa 2 Minuten in Helgas Tempo; 6 Schritte (Menü öffnen, Abmelden, Meldung lesen, Seite neu laden, Menü öffnen, Abmelden).

## Ablauf

- Klick auf «Abmelden» – erwartet: Anmeldeseite. Gesehen: ich bleibe auf der Übersicht, oben erscheint die rote Meldung (das war durch das gelöschte Cookie so gewollt).
- Meldung befolgen – erwartet: ein Knopf «Seite neu laden» oder ähnlich. Gesehen: nur Text; ich musste den Neuladen-Knopf des Browsers selbst finden.

## Vorschläge

- **P-1:** Übersicht öffnen, Cookie «dwello_xsrf» löschen, Benutzermenü → «Abmelden». Die Meldung erscheint ohne Schaltfläche. Hilfreich wäre ein Knopf in der Meldung, z. B. «Erneut abmelden» (funktioniert laut Netzwerk ja bereits ohne Neuladen) oder «Seite neu laden», und der Satz «Sie sind noch angemeldet.»

## Nicht geprüft

- Dunkelmodus, Tablet und Mobil: nicht Teil des Auftrags.
- Andere Sprachen (fr/it/en): die Sprache gilt fürs Konto, ein Umschalten hätte andere Personas gestört.
- Wie die Meldung aussieht, wenn das Session-Cookie selbst fehlt: nicht Teil des Auftrags.
