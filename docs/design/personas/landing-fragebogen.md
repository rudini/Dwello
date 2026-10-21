# Fragebogen Landing Page

Ein einheitlicher Fragebogen, mit dem jede Persona die öffentliche Website (`marketing/index.html`, Sprachversionen in `marketing/{fr,it,en}/`) beurteilt. Alle Personas beantworten dieselben Fragen, damit die Antworten vergleichbar sind. Die Persona nutzt ihren Viewport und ihre Eingabeart aus `README.md`; die Seite wird statisch ausgeliefert (`python3 -m http.server 3310 --directory marketing`) und mit `persona-kit.mjs` über `page.goto('http://localhost:3310/index.html')` geöffnet.

Antwort pro Frage: eine Note von 1 (trifft gar nicht zu) bis 5 (trifft voll zu), wo eine verlangt ist, und ein bis drei Sätze Begründung in der Stimme der Persona, mit dem Abschnitt der Seite, auf den sie sich bezieht.

## A. Erster Eindruck (nur der erste Bildschirm, ohne zu scrollen, höchstens 10 Sekunden)

1. Was ist Dwello, in einem Satz in Ihren eigenen Worten?
2. Für wen ist es gemacht? Fühlen Sie sich angesprochen? (1–5)
3. Was würden Sie als Nächstes anklicken, und warum?
4. Wirkt die Seite vertrauenswürdig und seriös? (1–5)

## B. Verständlichkeit

5. Verstehen Sie die Texte ohne Nachschlagen? (1–5) Welche Wörter oder Sätze waren unklar (Fachbegriffe, Abkürzungen, Technik wie «MCP», «Docker», «Open Source»)?
6. Verstehen Sie, welche Funktionen es heute schon gibt und welche erst geplant sind? (1–5)
7. Zeigen die Bilder und Screenshots, wie die Arbeit mit Dwello aussieht? (1–5)

## C. Nutzen und Bedenken

8. Welches Problem würde Dwello für Sie lösen? Welches nicht, das Sie erwartet hätten?
9. Was überzeugt Sie am meisten?
10. Welche Bedenken oder offenen Fragen haben Sie nach dem Lesen (Kosten, Datenschutz, Installation, Hilfe, Rechtssicherheit)? Beantwortet die Seite sie (FAQ eingeschlossen)?
11. Glauben Sie die Aussagen zum Datenschutz und zu «gratis»? (1–5)

## D. Weg zum Start

12. Wissen Sie nach dem Lesen, wie Sie mit Dwello anfangen? (1–5) Beschreiben Sie die Schritte, so wie Sie sie verstanden haben.
13. Trauen Sie sich die Installation zu, oder bräuchten Sie Hilfe? Von wem?
14. Haben Sie gefunden, was Sie gesucht haben (Navigation, Sprachwechsel, Impressum, Datenschutz)? (1–5)

## E. Bedienung und Darstellung (mit Ihrem Gerät und Ihrer Eingabeart)

15. Ist alles gut lesbar und bedienbar (Schriftgrösse, Kontrast, Zoom, Tastatur, Screenreader, Touch)? (1–5)
16. Ist die Seite zu lang, zu kurz oder passend? Wo haben Sie aufgehört zu lesen?

## F. Gesamturteil

17. Würden Sie Dwello ausprobieren? (1–5) Warum oder warum nicht?
18. Würden Sie Dwello einer Bekannten in Ihrer Lage empfehlen? (1–5)
19. Die eine Sache, die Sie an der Seite als Erstes ändern würden.

## Bericht

Die Persona schreibt `docs/design/personas/<persona>-landing.md` im Aufbau des Agenten `persona`; der Teil «Fragebogen» enthält die Fragen 1–19 mit Note und Begründung, die Befundtabelle (`P-n`) nur, was auf der Landing Page geändert werden sollte. Die Zusammenfassung über alle Personas steht in `landing-auswertung.md`.

## Zusatz: Wirkung, Bilder und Animationen

Für die Frage, ob die Seite zu kühl wirkt (Rückmeldung eines Kollegen des Product Owners). Gleiche Notenskala.

20. Wie wirkt die Seite auf Sie: warm und einladend oder kühl und technisch? (1 = kühl, 5 = warm) Woran liegt das?
21. Fehlen Ihnen Bilder (Menschen, Häuser, Alltag einer Vermieterin), oder reichen die Bildschirmfotos der App? Welche Bilder würden Ihnen helfen, welche nicht?
22. An welchen Stellen würde eine Animation Ihnen etwas erklären (z. B. wie eine Rechnung hochgeladen wird oder wie sich die Kosten verteilen)? Nennen Sie die Abschnitte.
23. Wo würde Bewegung Sie stören, ablenken oder die Seite langsamer machen?
24. Ihre drei besten Ideen, damit die Seite wärmer wirkt, ohne an Klarheit zu verlieren.
