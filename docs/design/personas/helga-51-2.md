# Helga – Feature-Review #51, zweiter Durchgang (Kontoauswahl bei Google)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (auch 200 %), Maus. App: http://localhost:3300 (Persona-Stack, ALLOWED_EMAILS=verwalter@example.com). Sitzung für das nicht erlaubte Konto fremd@example.com (JWT wie im Persona-Kit, gleiches Geheimnis). Nichts gespeichert.
Skript und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-51-2/`

## Stand der Befunde aus dem ersten Durchgang

| ID | Schwere | Bildschirm | Befund | Stand |
|---|---|---|---|---|
| P-1 | Major | Anmelden (mit Meldung) | «Mit Google anmelden» bot keine Kontoauswahl bei Google. | **Behoben.** Die Weiterleitung zu Google enthält jetzt `prompt=select_account`, aber weder `access_type=offline` noch `prompt=consent`. |
| P-2 | Minor | Anmelden (mit Meldung) | Die Meldung nennt das angemeldete Konto nicht. | Offen, unverändert (nicht Teil dieser Änderung). |
| P-3 | Minor | Anmelden (mit Meldung) | Die Meldung sagt nicht, an wen ich mich wenden kann. | Offen, unverändert (Wortlaut vom Product Owner, nicht Teil dieser Änderung). |

Neue Befunde: keine.

## Beobachtungen

- Die Seite selbst sieht aus wie beim ersten Durchgang: Titel «Anmelden», roter Kasten (als `alert` ausgezeichnet) «Dieses Konto hat keinen Zugang zu Dwello. Melden Sie sich mit dem Konto an, das für Dwello eingerichtet ist.», darunter der Link «Mit Google anmelden» (`/auth/login?provider=google`). Bei 150 % und 200 % gibt es kein seitliches Scrollen (scrollWidth 960 = innerWidth 960, bzw. 720 = 720). Bilder `10-login-z150.png` und `10-login-z200.png`.
- Die vollständige Weiterleitung (302) von `/auth/login?provider=google`:
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=x&redirect_uri=http%3A%2F%2Flocalhost%3A3300%2Fauth%2Fcallback&response_type=code&scope=openid+email+profile&state=…&prompt=select_account`
  Dwello verlangt also nur `openid email profile` (Name und E-Mail-Adresse), keinen Zugriff auf Dauer (kein `access_type=offline`) und keine erneute Einwilligung (kein `prompt=consent`). Dieselbe Adresse kommt mit und ohne Sitzung zurück (mit curl ohne Cookie geprüft).
- Dwello setzt dabei zwei Cookies für 10 Minuten (`dwello_oauth_state`, `dwello_login` mit `redirectTo=/dashboard`), beide HttpOnly und SameSite=Lax. Das Sitzungs-Cookie des fremden Kontos bleibt bis zur Rückkehr von Google bestehen; für mich unsichtbar.
- Mein Versuch, die Google-Seite im Browser durch eine Attrappe zu ersetzen, griff bei der Weiterleitung nicht. Der Browser landete deshalb auf der echten Google-Fehlerseite «invalid_client» (Client-ID im Persona-Stack ist nur «x»). Das liegt am Prüfaufbau, nicht an Dwello, und ist kein Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 4 Schritte (Übersicht mit fremdem Konto bei 150 %, dasselbe bei 200 %, Klick auf «Mit Google anmelden», Weiterleitung zusätzlich ohne Browser abgefragt).

## Ablauf

1. **/dashboard mit dem Konto fremd@example.com öffnen.** Erwartet: wie beim ersten Mal die Meldung auf «Anmelden». Gesehen: Umleitung (303) auf `/login?error=not_allowed` mit dem roten Kasten und dem Knopf «Mit Google anmelden». Die Meldung lese ich so: falsches Konto, ich soll mich mit dem richtigen anmelden.
2. **Dasselbe bei 200 %.** Erwartet: alles gross und lesbar. Gesehen: sauber umgebrochen, kein seitliches Scrollen.
3. **Klick auf «Mit Google anmelden».** Erwartet: diesmal soll Google mich fragen, welches Konto ich nehmen will. Gesehen: Dwello leitet (302) zu Google weiter und bittet dabei ausdrücklich um die Kontoauswahl (`prompt=select_account`). Bei einem echten Google-Konto würde mir Google also die Liste der Konten zeigen (das meines Mannes und meines) und «Anderes Konto verwenden» anbieten, statt still das Konto meines Mannes zu nehmen. Den Kreislauf aus P-1 gibt es damit nicht mehr.
4. **Nachgeprüft, was Dwello von Google verlangt.** Erwartet: nur das Nötige. Gesehen: nur Name und E-Mail (`openid email profile`), kein dauernder Zugriff, keine erzwungene neue Einwilligung. Ich müsste also bei Google nicht jedes Mal etwas Neues erlauben.

## Verwirrung

- Neu nichts. Die Unklarheiten aus dem ersten Durchgang bleiben: «Dieses Konto» nennt keine Adresse (P-2), und ich weiss nicht, wen ich fragen soll (P-3).
- Dass ich jetzt bei jeder Anmeldung die Kontoauswahl von Google sehe (auch mit dem richtigen Konto), ist ein Klick mehr. Für mich ist das eher beruhigend, weil ich sehe, mit welchem Konto ich hineingehe.

## Fehlerrisiken

- In der Google-Kontoauswahl könnte ich aus Versehen wieder das Konto meines Mannes anklicken. Dann sehe ich dieselbe Meldung, kann es aber erneut versuchen, weil Google wieder fragt. Ohne Angabe des Kontos in der Meldung (P-2) merke ich allerdings nicht sofort, dass ich das falsche gewählt habe.

## Vorschläge

- **P-1:** Behoben, nichts mehr nötig.
- **P-2, P-3:** Unverändert wie im ersten Bericht (`docs/design/personas/helga-51.md`). P-2 würde jetzt noch mehr helfen: Wenn die Meldung «Sie sind angemeldet als fremd@example.com» sagt, sehe ich nach einem falschen Klick in der Google-Kontoauswahl sofort, was schiefging.

## Nicht geprüft

- Den echten Ablauf bei Google (Kontoauswahl sehen, anderes Konto wählen, Rückkehr über /auth/callback): Im Persona-Stack ist die Client-ID nur «x», Google antwortet mit «invalid_client». Ob P-1 behoben ist, beurteile ich deshalb nur nach der Anfrage an Google (`prompt=select_account` ist der dafür vorgesehene Parameter).
- Ob nach der Rückkehr das alte Sitzungs-Cookie des fremden Kontos ersetzt wird und ich auf der gewollten Seite lande: braucht den OAuth-Rückweg.
- Mobil und Dunkelmodus: nicht Teil von Helgas Profil.
