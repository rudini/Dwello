# Fachreview Landing Page, Runde 1

Gegenstand: `git diff 8d6d26c~1 8d6d26c -- marketing/index.html docs/installation.md` (Worktree `review-landing-fach`, detached bei 8d6d26c).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte (UWG) | Major | Das Repository ist privat: Der Link zur Anleitung, `git clone` und «Der ganze Quellcode ist öffentlich» laufen für Besucher ins Leere bzw. stimmen nicht |
| R-2 | Rechtstexte (UWG) | Major | FR/IT/EN-Seiten behalten die widerlegten Aussagen («100 %», Rundung, «AGPL-3.0») |
| R-3 | Rechtstexte (UWG/DSG) | Major | «Alles andere bleibt lokal» (Homeserver) widerspricht der neuen Aufzählung im Datenschutz-Abschnitt |
| V-1 | Verwalter | Major | «einmal einrichten, danach keine technischen Kenntnisse», obwohl die Anleitung regelmässige Datensicherung und Updates per Befehlszeile verlangt |
| M-1 | Mietrecht | Minor | `index.html:492` «spätestens beim Auszug ausgeglichen»: Ausgeglichen wird erst mit der Schlussabrechnung (Glossar `UBIQUITOUS_LANGUAGE.md:182-183`). Fix: «…sondern auf die nächste Abrechnung übertragen; die Schlussabrechnung nach dem Auszug gleicht jeden Betrag aus.» |
| R-4 | Rechtstexte (DSG) | Minor | `installation.md:50` «the privacy statement Dwello gives the tenants» ist falsch: Die Datenschutzerklärung der App richtet sich an den Vermieter (`messages/de.json:169`, «…sind Sie als Vermieter verantwortlich»); Mieter erhalten von Dwello keine. Fix: «shown in the app's terms of use and privacy statement (both for the landlord; informing the tenants stays the landlord's duty, Art. 19 DSG)». |
| R-5 | Rechtstexte (UWG) | Minor | `index.html:405` «die KI liest Ihre Belege auf Ihrem eigenen Rechner» und Tabelle `:786` «lokal» ohne Einschränkung, obwohl Seite und Anleitung eine externe KI bei weniger als 16 GB empfehlen. Fix: «…und die KI kann Ihre Belege auf Ihrem eigenen Server lesen.»; Tabelle «lokal oder bei einem Anbieter Ihrer Wahl» |
| V-2 | Verwalter | Minor | `installation.md:39,48`: `COOKIE_SECURE=false` steht schon in `.env.example:107` («add this line» falsch); «the others … are ignored» falsch für `PUBLIC_APP_URL`, `COOKIE_DOMAIN`, `COOKIE_SECURE`, `CORS_ORIGIN`, `LLM_*`, die `docker-compose.prod.yml:30,37,38,66-71` liest. Fix: «already `false` in the file; keep it on a PC» und «the others are ignored, except those section 7 changes». |
| R-6 | Rechtstexte (DSG) | Minor | Anleitung nennt keinen Vertrag nach Art. 9 DSG, wenn nicht der Vermieter selbst den Server betreibt (Landing `:663` nennt «Ihr IT-Dienst», Cloud-Variante nennt einen Hoster). Fix in Abschnitt 4 bei `OPERATOR_NAME`: «If someone other than the landlord runs the server (an IT service, a hosting company), the landlord needs a data processing agreement with them (Art. 9 DSG).» |
| R-7 | Rechtstexte (DSG) | Minor | Auch auf dem PC veröffentlicht `docker-compose.prod.yml:60,95,114` Backend, Datenbank und KI an allen Schnittstellen; die Anleitung warnt nur in Abschnitt 7 (Schritt 5). Ollama auf 11434 ist ohne Anmeldung im WLAN erreichbar. Fix: denselben Hinweis in Abschnitt 5 für den PC (oder Ports an `127.0.0.1` binden; nicht-funktional, Zeile in `offene-punkte.md`). |
| V-3 | Verwalter | Minor | Die englische Anleitung schreibt «KI» (z.B. `installation.md:3,13`); der englische Begriff ist «AI» (`docs/design/i18n-begriffe.md:65`). Fix: «AI (shown as «KI» in the German app)» beim ersten Vorkommen, danach «AI». |

## R-1 Repository privat (Major)

Beleg: `gh api repos/rudini/Dwello` liefert `"private": true, "visibility": "private"`; ein Aufruf von `https://github.com/rudini/Dwello` ohne Anmeldung gibt HTTP 404. `deploy/demo/README.md` (Abschnitt 4): «`rudini/Dwello` is private, and GitHub takes no passwords for `git clone`.»

Betroffen: `marketing/index.html:664` und `:857` (Link «Anleitung zum Weitergeben», neu in diesem Diff), `:676`, `:699`, `:721` (`git clone`), `:773` «Der ganze Quellcode ist öffentlich». Die neue Hauptaufgabe der Seite, die Anleitung an eine Hilfsperson weiterzugeben, scheitert damit am ersten Klick und am ersten Befehl der Anleitung (`installation.md:20`).

Warum falsch: Art. 3 Abs. 1 lit. b UWG (Fedlex, SR 241): «Unlauter handelt insbesondere, wer: […] b. über sich, seine Firma, seine Geschäftsbezeichnung, seine Waren, Werke oder Leistungen, deren Preise […] unrichtige oder irreführende Angaben macht […]». «öffentlich» ist heute unrichtig. Ob das UWG auf ein kostenloses Open-Source-Projekt anwendbar ist, ist **unsicher** (siehe «Nicht bestätigt»); die Aussage ist unabhängig davon falsch.

Fix (Produktentscheid): das Repository öffentlich schalten, bevor `deploy-site.yml` die Seite beim Merge auf `main` hochlädt, oder die Seite bis dahin nicht ausrollen. Gehört unter «Blocked on me», falls die Veröffentlichung nicht in diesem Pull Request geschieht.

## R-2 Übersetzte Seiten mit den alten Aussagen (Major)

Beleg: `marketing/fr/index.html:427`, `it/index.html:427`, `en/index.html:427` zeigen weiter «100 %» (Daten bleiben auf dem Server); `it/index.html:485` «CHF 5 non vengono né richiesti né versati», `en/index.html:485` «CHF 5 are neither charged nor paid out»; alle drei `:764`, `:780`, `:853` «AGPL-3.0». Laut `marketing/README.md:9-15` entstehen `fr/`, `it/`, `en/` aus `i18n/build.py` und `i18n/{fr,it,en}.json`; der Commit ändert keine davon.

Warum falsch: Die Korrekturen der Persona-Prüfung (P-1, P-2, P-12, P-13) gelten nur für Deutsch; Westschweizer und Tessiner Vermieter lesen weiter die unrichtigen Angaben (Art. 3 Abs. 1 lit. b UWG, Zitat bei R-1). Der Deploy lädt alle Sprachen zusammen hoch.

Fix: die neuen deutschen Texte in `marketing/i18n/{fr,it,en}.json` eintragen und `python3 marketing/i18n/build.py` laufen lassen, im selben Pull Request. Erledigt sich, falls eine spätere Slice das schon vorsieht.

## R-3 «Alles andere bleibt lokal» (Major)

Beleg: `marketing/index.html:712` (Homeserver-Kasten, unverändert stehen geblieben): «Kleine Geräte nutzen besser eine externe KI. Alles andere bleibt lokal.» Dagegen `:600` (neu): «Nach aussen geht nur, was eine Aufgabe braucht: die Anmeldung bei Google, die Adresssuche im Gebäuderegister des Bundes, Ihre E-Mails an Mieter und, wenn Sie es so einrichten, Rechnungen an eine externe KI.» Im Code: `src/lib/server/oauth.ts` (accounts.google.com, oauth2.googleapis.com), `src/lib/server/building-register.ts` (api3.geo.admin.ch), `backend/src/mail/`.

Warum falsch: Es ist dieselbe Art Aussage wie «100 % Ihrer Daten bleiben auf Ihrem Server», die der Auftrag korrigiert; sie widerspricht jetzt dem Datenschutz-Abschnitt derselben Seite (Art. 3 Abs. 1 lit. b UWG, Zitat bei R-1).

Fix: «Kleine Geräte nutzen besser eine externe KI. Ihre Daten bleiben auf dem Gerät; was nach aussen geht, steht unter Datenschutz.»

## V-1 «Einmal einrichten, dann läuft es» (Major)

Beleg: `marketing/index.html:410` «Einrichten muss Dwello einmal jemand, der sich mit Computern auskennt. Danach brauchen Sie keine technischen Kenntnisse.», `:662` «Einmal einrichten lassen, dann läuft es.», `:663` «Danach arbeiten Sie im Browser, ohne technische Kenntnisse.», `:822` «Nur für die Einrichtung, und nur einmal.» Dagegen `docs/installation.md:61-62`: Update mit `git pull` und `docker compose … up -d --build`; «Back up the database regularly, e.g. `docker exec dwello-postgres pg_dump …`, and keep the copy on another device. Uploaded invoices and PDFs are stored in the database too.» (bestätigt: `backend/src/db/schema.ts:324,476,574`, Base64 in der Datenbank).

Warum falsch: Aus Sicht der Verwaltung ist die Datensicherung keine einmalige Sache: Ohne sie verliert der Vermieter bei einem Defekt alle Abrechnungen, Belege und Zahlungsstände, also das, womit er die Belegeinsicht des Mieters (Art. 257b Abs. 2 OR) und Nachforderungen belegt. Er bleibt zudem als Verantwortlicher für die Datensicherheit zuständig, Art. 8 Abs. 1 DSG (Fedlex, SR 235.1): «Der Verantwortliche und der Auftragsbearbeiter gewährleisten durch geeignete technische und organisatorische Massnahmen eine dem Risiko angemessene Datensicherheit.» Die Seite verspricht einem Laien das Gegenteil dessen, was die Anleitung verlangt (Art. 3 Abs. 1 lit. b UWG, Zitat bei R-1).

Fix (Vorschläge):
- `:410` «Kostenlos und ohne Abo. Einrichten, sichern und aktualisieren muss Dwello jemand, der sich mit Computern auskennt. Für die Arbeit mit Dwello brauchen Sie keine technischen Kenntnisse.»
- `:662` «Einrichten lassen, dann arbeiten Sie im Browser.»
- `:663` zweiter Satz ergänzen: «Diese Person sichert auch regelmässig Ihre Daten und spielt Updates ein; die Anleitung zeigt, wie.»
- `:822` «Für die Einrichtung, die regelmässige Datensicherung und Updates. Bitten Sie jemanden, der sich mit Computern auskennt, und geben Sie dieser Person die Anleitung. Für die Arbeit mit Dwello brauchen Sie keine Vorkenntnisse: Jeder Begriff wird am Feld erklärt.»

## Fehlende Begriffe

Keine: «Übertrag», «Schlussabrechnung», «Mindestbetrag», «Heizprofil», «Gebäuderegister», «Beleg» stehen im Glossar.

## Nicht bestätigt

- **Übertrag einer Rückerstattung unter CHF 5:** Ob der Vermieter eine fällige Rückerstattung ohne Vereinbarung im Mietvertrag bis zur nächsten Abrechnung zurückbehalten darf, finden weder Art. 257a/257b OR noch Art. 4-8 VMWG ausdrücklich; Produktentscheid (Kommentar `statement.service.ts:410-411`, «PO 2026-10-19»). Nicht gegen Fedlex-Wortlaut geprüft, **unsicher**.
- **UWG-Anwendbarkeit:** Ob die Seite eines kostenlosen Open-Source-Projekts «im Wettbewerb» handelt, ist **unsicher** (keine Fedlex-Stelle dazu; Art. 2 UWG nicht geprüft). Die Befunde R-1 bis R-3 und V-1 gelten auch ohne UWG als unrichtige Angaben.
- **Ob die Seite beim Merge live geht:** `.github/workflows/deploy-site.yml:17-20` lädt bei jedem Push auf `main` hoch, sofern `SITE_SFTP_HOST` gesetzt ist; `dwello.ch` und `demo.dwello.ch` waren von hier nicht erreichbar (Proxy lehnte ab).
- **Google:** «In production» mit `openid email profile` ohne Verifizierung (`installation.md:29`) stützt sich nur auf `deploy/demo/README.md:42`; Google-Dokumentation nicht geprüft. Scopes bestätigt (`src/lib/server/oauth.ts:46`).
- **Caddy DNS-Challenge** (`installation.md:105`) braucht einen Caddy-Build mit DNS-Modul des Anbieters; nicht geprüft.
- **Zahlen der Anleitung:** «about an hour», Modell «about 6 GB», «About 10 GB of disk space» nicht gemessen.
- **`marketing/datenschutz.html`** (Daten der Besucher der Seite selbst) gehört nicht zum Diff und ist nicht geprüft.

Geprüft: Rundung `pdf-format.ts:20-23` nachgerechnet (Nachzahlung 12.37 → 12.35, Rückerstattung −12.37 → −12.40, 0.00 → kein Übertrag, 4.99 → übertragen, 5.02 → 5.00 eingefordert, Übertrag +3.40 plus Saldo 10.00 → 13.40; Schlussabrechnung ohne Mindestbetrag, `statement.service.ts:756-757`, `reminder.service.ts:65`), «zugunsten der Mieter» stimmt; vier Heizprofile (`backend/migrations/0002_stammdaten.sql:64-87`, Glossar `:155`); AGPL-3.0-or-later (`package.json:5`); MCP im Futur; Liste der externen Empfänger vollständig gegen die Hosts in `src` und `backend/src` (Google, api3.geo.admin.ch, SMTP/Resend, externe KI), «0 Daten gehen an uns» (kein Host des Projekts im Code); «Verantwortlich … bleiben Sie» entspricht Art. 5 lit. j DSG («Verantwortlicher: private Person […], die […] über den Zweck und die Mittel der Bearbeitung entscheidet»); Art. 19 DSG verpflichtet den Verantwortlichen, also den Vermieter, nicht die Marketingseite, deren Nennung genügt daher; «Gemacht für die Schweiz» ist keine Herkunftsangabe; Anleitung gegen `docker-compose.prod.yml`, `.env.example`, README («Who may sign in», «External LLM provider»), `deploy/demo/README.md` (Zürich, Google-Einstellungen), #497 und #568 offen.
