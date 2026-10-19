# Helga – Feature-Review #51 (nur eingerichtete E-Mail-Adressen dürfen sich anmelden)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (auch 200 %), Maus. App: http://localhost:3300 (Persona-Stack, ALLOWED_EMAILS=verwalter@example.com). Nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-51/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Anmelden (mit Meldung) | «Mit Google anmelden» schickt mich zu Google ohne Kontoauswahl (Anfrage ohne `prompt=select_account`). Wenn im Browser nur das Google-Konto meines Mannes angemeldet ist, meldet Google vermutlich dieses Konto gleich wieder an, und ich stehe wieder vor derselben Meldung. Die Meldung sagt «Melden Sie sich mit dem Konto an, das für Dwello eingerichtet ist», aber auf der Seite kann ich das andere Konto nicht auswählen. (Den echten Ablauf bei Google konnte ich nicht durchspielen, siehe «Nicht geprüft».) |
| P-2 | Minor | Anmelden (mit Meldung) | Die Meldung nennt nicht, mit welchem Konto ich gerade angemeldet bin (hier fremd@example.com). Ich weiss nicht, ob das Konto meines Mannes oder ein altes Konto gemeint ist, und auch nicht, welches Konto «eingerichtet» ist. |
| P-3 | Minor | Anmelden (mit Meldung) | Wortlaut (vom Product Owner festgelegt): klar und höflich, aber er sagt nicht, an wen ich mich wenden kann, wenn ich nicht weiss, welches Konto eingerichtet ist (z. B. «Fragen Sie die Person, die Dwello für Sie eingerichtet hat»). |

## Beobachtungen

- Übersicht (/dashboard), Abrechnungen (/statements) und Mieter (/tenants) leiten mit dem fremden Konto alle sofort auf `/login?error=not_allowed` um. Daten werden keine angezeigt, und es gibt auch keine kurze Fehlerseite.
- Die Meldung steht in einem roten Kasten mit Ausrufezeichen-Symbol, ist als `alert` ausgezeichnet und steht direkt über dem Knopf «Mit Google anmelden». Die Farbe ist nicht das Einzige, woran man sie erkennt (es gibt Text und Symbol). Für mich wirkt sie nicht bedrohlich, weil kein «Fehler» und kein «verboten» darin steht.
- Bei 200 % (720 px CSS-Breite) bricht alles sauber um, es gibt kein seitliches Scrollen (scrollWidth 720 = innerWidth).
- Ruft man `/login` ohne Parameter auf, erscheint keine Meldung. Ruft ein erlaubtes Konto `/login?error=not_allowed` auf, wird es direkt zur Übersicht weitergeleitet, die Meldung erscheint also nicht fälschlich.
- Das Sitzungs-Cookie `dwello_session` des fremden Kontos bleibt nach der Umleitung im Browser. Für mich ist das unsichtbar, jeder Seitenaufruf führt einfach wieder zur Meldung.
- Wenn ich auf der Anmeldeseite die Sprache wechsle, wird nur die Seite neu geladen (GET `/login?error=not_allowed`). Es wird nichts am Konto gespeichert, und die Meldung bleibt stehen.
- Die Hilfe-Seite sagt nichts zu Konto oder Anmeldung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 12 Schritte (3 Seiten mit fremdem Konto, Zoom 200 %, 3 Sprachwechsel, 4 Seiten mit erlaubtem Konto).

## Ablauf

1. **Übersicht mit fremdem Konto.** Erwartet: ein Hinweis, dass etwas mit dem Konto nicht stimmt. Gesehen: Weiterleitung auf «Anmelden» mit dem roten Kasten «Dieses Konto hat keinen Zugang zu Dwello. Melden Sie sich mit dem Konto an, das für Dwello eingerichtet ist.» und darunter «Mit Google anmelden» (Bild `10-dashboard-z150.png`: Haus-Symbol, Titel «Anmelden», roter Kasten, umrandeter Knopf). Ich verstehe: falsches Konto. Ich weiss aber nicht, welches das richtige ist (P-2).
2. **Abrechnungen und Mieter mit fremdem Konto.** Erwartet: dasselbe. Gesehen: dieselbe Seite und Meldung. Die Seite, die ich eigentlich wollte, wird nirgends erwähnt.
3. **Dasselbe bei 200 %.** Erwartet: grosse Schrift, nichts abgeschnitten. Gesehen: alles lesbar, kein seitliches Scrollen (`20-statements-z200.png`).
4. **Klick auf «Mit Google anmelden» (nur die Weiterleitung geprüft).** Erwartet: dass ich bei Google ein anderes Konto wählen kann. Gesehen: Weiterleitung (302) zu accounts.google.com ohne Aufforderung zur Kontoauswahl (P-1).
5. **Sprache «Français».** Erwartet: alles französisch. Gesehen: «Se connecter», Meldung «Ce compte n’a pas accès à Dwello. Connectez-vous avec le compte configuré pour Dwello.», Knopf «Se connecter avec Google», Fusszeile «Version inconnue», «Aide». Kein Deutsch (`2fr-login-z200.png`).
6. **Sprache «Italiano».** Gesehen: «Accedere», «Questo account non ha accesso a Dwello. Acceda con l’account configurato per Dwello.», «Accedere con Google», «Aiuto», «Versione sconosciuta». Kein Deutsch (`2it-login-z200.png`).
7. **Zusätzlich «English».** Gesehen: «This account has no access to Dwello. Sign in with the account that is set up for Dwello.» Kein Deutsch.
8. **Mit dem erlaubten Konto (Vera Verwalter) anmelden.** Erwartet: alles wie vorher. Gesehen: Übersicht mit «Als Nächstes zu tun», Fristen, Häufige Arbeiten, Gebäude auf einen Blick (`30-dashboard-ok.png`). «Nebenkostenabrechnungen», «Mieter» und «Gebäude» (3 Gebäude) laden normal. Kein roter Kasten, keine Antworten mit Status ≥ 400.

## Verwirrung

- «Dieses Konto»: Welches Konto denn? Auf der Seite steht keine E-Mail-Adresse (P-2).
- «das für Dwello eingerichtet ist»: Das hat mein Neffe gemacht. Ich weiss nicht, ob es meine Gmail-Adresse ist oder eine andere.
- Die Einleitung «Melden Sie sich mit Ihrem bestehenden Konto an» und die Meldung darunter sagen fast dasselbe. Erst der rote Kasten zeigt mir, dass ich etwas anders machen muss.

## Fehlerrisiken

- Kreislauf: Ich klicke «Mit Google anmelden», Google meldet mich still wieder mit dem Konto meines Mannes an, und ich sehe dieselbe Meldung erneut. Dann gebe ich auf oder rufe den Neffen an (P-1).
- Ich könnte meinen, Dwello habe meine Daten gelöscht oder mich gesperrt. Die Meldung beruhigt in diesem Punkt nicht ausdrücklich, ist aber auch nicht alarmierend.

## Vorschläge

- **P-1:** Mit einem Cookie für fremd@example.com /dashboard öffnen und auf «Mit Google anmelden» klicken. Die Weiterleitung zu accounts.google.com enthält kein `prompt=select_account`. Hilfreich wäre: Nach dieser Meldung (oder immer) öffnet Google die Kontoauswahl. Oder die Seite bietet einen Link «Mit einem anderen Google-Konto anmelden», der das fremde Sitzungs-Cookie löscht und die Kontoauswahl erzwingt.
- **P-2:** Gleicher Aufruf. Hilfreich wäre ein Satz wie «Sie sind angemeldet als fremd@example.com.» über oder in der Meldung.
- **P-3:** Gleicher Aufruf. Hilfreich wäre ein zweiter Satz: «Wissen Sie nicht, welches Konto das ist? Fragen Sie die Person, die Dwello für Sie eingerichtet hat.» Ein passender Abschnitt auf der Hilfe-Seite wäre ebenfalls hilfreich. Das ist eine Entscheidung des Product Owners.

## Nicht geprüft

- Der echte Google-Ablauf (Kontoauswahl, stille Wiederanmeldung, Rückkehr über /auth/callback mit einem nicht erlaubten Konto): Ohne echtes Google-Konto ist das im Persona-Stack nicht möglich. P-1 stützt sich nur auf die Weiterleitungsadresse.
- Ob ich nach einer richtigen Anmeldung auf der ursprünglich gewollten Seite (/statements) lande: Dafür bräuchte es den OAuth-Rückweg.
- Mobil (390 px) und Dunkelmodus: nicht Teil von Helgas Profil.
