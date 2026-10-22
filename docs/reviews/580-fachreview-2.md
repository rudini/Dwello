# Fachreview #580 «KI in den Einstellungen», Runde 2

Gegenstand: Delta `git diff 857b838 5a7f10b -- tests/e2e/features/ki-einstellungen.feature` (Worktree `review-580-fach2`, Commit 5a7f10b), die geplanten Texte aus dem Auftrag, #580 «Decided», dazu `tests/e2e/steps/ki-settings.steps.ts`, `backend/src/__tests__/ki-settings.pg.test.ts`, `playwright.config.ts`, `backend/src/services/ki-model.service.ts`. Vorbericht: `docs/reviews/580-fachreview-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status | Begründung |
|----|--------|------------|
| F-1 | geschlossen | Die drei Punkte, «Das ist eine Checkliste, keine Rechtsberatung.» und die Checkbox «… für diesen Anbieter geprüft.» stehen wörtlich im Auftrag. Punkt 2 deckt sich mit DSV Anhang 1, Ziff. 44 (Stand 15.9.2024): «Vereinigte Staaten*** Für Personendaten, die von Organisationen bearbeitet werden, die gemäss den Grundsätzen des Datenschutzrahmens zwischen der Schweiz und den USA zertifiziert sind, gilt ein angemessenes Schutzniveau als gewährleistet». Die Markierung **unsicher** aus Runde 1 entfällt. |
| F-2 | geschlossen | Regel in #580 («empty on every opening and asked on every save»), Szenario «Ein geänderter Anbieter braucht die Bestätigung erneut» (Feature:80–86). Es prüft auch, dass die Datenschutzerklärung beim alten Anbieter bleibt. |
| F-3 | geschlossen, Rest als F-18 | Regel in #580 und im Kommentar über dem Grundriss «Die Verbindung zur KI prüfen». Der Test auf tieferer Ebene pinnt die Regel noch nicht (F-18). |
| F-4 | geschlossen | Szenario «Der Wechsel der KI steht im Protokoll», geplante Einträge für alle drei Arten und Ergänzung von `audit_privacy`. Die Einträge bleiben, bis der Liegenschaftsverwalter sie löscht (UBIQUITOUS_LANGUAGE.md:265). Das passt, weil er Verantwortlicher ist und die Auskunft nach Art. 25 DSG gibt. |
| F-5 | offen (Major, eingeengt) | Fortschritt (Feature:49–53) und der gescheiterte Download (neues Szenario) sind abgedeckt. Es fehlen weiterhin zwei Szenarien: ein Klick auf «KI-Modell herunterladen» startet den Download und zeigt den Fortschritt, und der Zustand «Die lokale KI antwortet nicht». Begründung unten. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-16 | Rechtstexte | Major | «Verbindung prüfen» mit leerem Schlüsselfeld verwendet den gespeicherten Schlüssel (`ki-settings.pg.test.ts:273–276`). Für eine geänderte Adresse fehlt die Regel aus #580 (F-13), also ginge der Schlüssel bei der Prüfung an den neuen Host |
| F-17 | Rechtstexte | Minor | Der neue Text `privacy_third_ollama` nennt als Anlässe nur «beim Start und wenn Sie es … herunterladen». `loadModel` lädt nur im lokalen Modus (`ki-model.service.ts:18`). Im Anbieter- oder Keine-KI-Modus stimmt «beim Start» also nicht, und offen ist, ob die Wahl von «Lokale KI» den Download sofort startet. Fix: «Ist die lokale KI gewählt und fehlt ihr KI-Modell, lädt Dwello es … herunter: beim Start, [wenn Sie die lokale KI wählen,] und wenn Sie es … herunterladen.», passend zum gebauten Ablauf |
| F-18 | Rechtstexte | Minor | Der Test «schickt dem Modell ein Bild» (`ki-settings.pg.test.ts:278–283`) zählt nur die Bilder. Dass die Prüfung keine erfassten Daten sendet (F-3), pinnt kein Test. Fix: in der Datenbank eine Rechnung und eine Kategorie mit Namen anlegen und prüfen, dass die Anfrage der Prüfung keinen davon enthält (oder Bild und Text gleich den festen Konstanten sind) |
| F-19 | Verwalter | Minor | Neu nennt die Datenschutzerklärung den Anbieter «auch wenn die Adresse im eigenen Netz liegt» (Feature:10). Wer seine eigene KI auf einem anderen Rechner betreibt, muss dann Punkt 1 («Sie haben mit dem Anbieter einen Vertrag …») bestätigen, obwohl er keinen Vertrag haben kann. Fix: Punkt 1 ergänzen mit «Betreiben Sie die KI selbst, nennen Sie sich als Anbieter; dieser Punkt entfällt dann.» oder einen Hinweis bei «Name des Anbieters» |
| F-20 | Verwalter | Minor | Die Fehlermeldung beim Download (Feature:57) verlangt «Prüfen Sie, ob der Server das Internet erreicht und rund 6 GB Speicherplatz frei hat». Läuft Dwello bei einem Betreiber, kann der Liegenschaftsverwalter das nicht prüfen. Fix wie im Text «antwortet nicht»: «… Betreibt jemand anderes Dwello, wenden Sie sich an den Betreiber.» |

## F-5 (offen) Herunterladen des KI-Modells

Belege: Die Anforderung in #580 lautet «The local model can be downloaded from there, with progress». Unter «Decided» steht: «The page «KI» shows the local model's state and offers «KI-Modell herunterladen» when it is missing or failed». Der Schritt «kann der Liegenschaftsverwalter das KI-Modell erneut herunterladen» (`ki-settings.steps.ts:123–125`) prüft nur, ob die Schaltfläche da ist (`modelDownloadOffered`), und klickt sie nicht. Für den geplanten Text «Die lokale KI antwortet nicht. …» gibt es kein Szenario. Heute setzt `loadModel` in diesem Fall nur `unknown` und meldet nichts (`ki-model.service.ts:34–35`).

Warum: Auf einer Installation nach `docs/installation.md` Abschnitt 6 läuft kein lokaler KI-Dienst. Das ist der häufigste Fall, in dem «Lokale KI» nicht geht. Ohne Szenario zeigt die Seite dort womöglich weiter nichts, und der Liegenschaftsverwalter wartet. Ebenso kann die Schaltfläche, die nach dem Fehler angeboten wird, ohne Wirkung bleiben, ohne dass ein Test das bemerkt. Der Stack kann beide Zustände erzeugen: `LLM_LOCAL_URL` auf einen geschlossenen Port für «antwortet nicht», und die Attrappe auf 2532 (`playwright.config.ts`) bzw. die Attrappe der frischen Installation für den Klick.

Fix: Ein Szenario «Das KI-Modell herunterladen»: Klick auf «KI-Modell herunterladen», danach sagt die Seite «Das KI-Modell wird geladen: … %» (oder bei der Fehlerattrappe erneut die Fehlermeldung, nachdem eine Anfrage an `/api/pull` einging). Dazu ein Szenario «Die lokale KI antwortet nicht» mit dem geplanten Text und der Schaltfläche.

## F-16 Gespeicherter Schlüssel bei der Prüfung einer neuen Adresse

Belege: #580 «Decided»: «A stored key is never sent to a changed address: a new address needs the key again (F-13).» Das Szenario «Eine neue Adresse braucht den API-Schlüssel erneut» (Feature:88–93) deckt nur das Speichern ab. `ki-settings.pg.test.ts:273–276` verlangt, dass die Prüfung mit leerem Feld den gespeicherten Schlüssel nimmt. Für eine geänderte `baseUrl` gibt es keinen Test.

Warum: Der Liegenschaftsverwalter trägt die neue Adresse ein und klickt zuerst «Verbindung prüfen», vor dem Speichern. Gerade auf diesem Weg ginge der Schlüssel des bisherigen Anbieters an einen Host, den weder die Datenschutzerklärung noch die Bestätigung kennt. Damit wäre die entschiedene Regel umgangen.

Fix: Die Prüfung verwendet den gespeicherten Schlüssel nur, wenn die Adresse unverändert ist. Sonst antwortet sie mit derselben Meldung wie beim Speichern («Geben Sie den API-Schlüssel erneut ein. …»). Dazu ein Test in `ki-settings.pg.test.ts`: gespeicherter Anbieter, Prüfung mit anderer `baseUrl` und leerem Schlüssel, die Attrappe erhält keine Anfrage mit `Bearer richtig`. Dazu eine Zeile im Grundriss «Die Verbindung zur KI prüfen» oder ein eigenes Szenario.

## Fehlende Begriffe

Keine neuen. Die Glossarzeilen aus Runde 1 sind in #580 entschieden.

## Nicht bestätigt

- DSV Anhang 1 nur in der Fassung «Stand am 15. September 2024» gelesen (Fedlex-Filestore `eli/cc/2022/568/20240915/de/html`). Spätere Fassungen gaben nur die Hülle der Seite zurück. Dass die USA-Ziffer noch unverändert gilt, ist nicht bestätigt.
- Ob die Wahl von «Lokale KI» ohne Neustart den Download sofort startet (betrifft F-17), legen weder #580 noch das Feature fest. Gesucht in #580, im Feature und in `ki-model.service.ts`.
- Ob bei einer vom Betreiber festgelegten KI eine Änderung der Umgebungsvariablen ins Protokoll kommt: in #580 nicht geregelt. Das ist Sache des Betreibers und liegt ausserhalb des Gegenstands.

Geprüft: die neuen Fehlerzeilen «Adresse» und «Modell», die Sperrregel und -meldung (F-10, F-11), «Seite "KI"» in den Schritten (F-15), Hilfetexte und Optionen (F-7, F-8, F-9), die Einträge im Protokoll und `audit_privacy`. Mietrechtlich (OR, VMWG) ist nichts betroffen.
