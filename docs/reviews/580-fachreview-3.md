# Fachreview #580, Runde 3 (letzte): KI in den Einstellungen

Gegenstand: `git diff 5a7f10b 12fe190` im Worktree `review-580-fach3` (Commit 12fe190). Vorheriger Bericht: `docs/reviews/580-fachreview-2.md`.

## Status der offenen IDs

| ID | Status | Begründung |
|----|--------|------------|
| F-5 | geschlossen | Das Szenario «Das KI-Modell erneut herunterladen» (Feature:62–67) klickt die Schaltfläche (`tasks/ki-settings.ts:75`, `downloadModelAgain`). Die Attrappe beendet den laufenden Download mit einem Fehler (`llm-stub.ts`, `/stub/ollama` «failed»), und erst ein neuer `/api/pull` meldet 40 %. `loadModel` versucht nach einem Fehler nicht von sich aus erneut (`ki-model.service.ts:34–38`). Die 40 % erscheinen also nur, wenn der Klick wirkt. Der pg-Test «lädt das KI-Modell auf Wunsch erneut herunter» prüft den Endpunkt (202, Pull mit dem Modellnamen, Zustand `ready`). Der Test «lädt kein KI-Modell, solange ein Anbieter gewählt ist» (409 `KI_NOT_LOCAL`) hält die Zusage aus 577 R-2 ein: Ollama erfährt nur im lokalen Modus etwas. «Die lokale KI antwortet nicht» hat jetzt ein Szenario mit dem geplanten Text (Feature:70–74). Zur Treue der Attrappe siehe F-21. |
| F-16 | geschlossen | Der pg-Test «verlangt den API-Schlüssel erneut, um eine neue Adresse zu prüfen» verlangt 422 `KI_KEY_FOR_NEW_ADDRESS`, wenn die Prüfung bei gespeichertem Anbieter eine andere `baseUrl` und ein leeres Schlüsselfeld erhält. Die neue Adresse `127.0.0.1:9` antwortet nicht. Eine Umsetzung, die den Schlüssel trotzdem dorthin schickt, bekäme «unerreichbar» statt 422, und der Test würde rot. Die Regel aus #580 («A stored key is never sent to a changed address») ist damit auch für die Prüfung festgehalten. Eine Zeile im Szenario fehlt noch, siehe F-22. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-21 | Verwalter | Minor | «Die lokale KI antwortet nicht» erzeugt die Attrappe mit HTTP 503 auf `/api/tags` (`llm-stub.ts`, `down()`). Das ist eine Antwort. Im Fall aus `docs/installation.md` Abschnitt 6 läuft gar kein Dienst, und die Verbindung wird abgewiesen oder der Name nicht aufgelöst. Eine Umsetzung, die nur einen Status ungleich 2xx erkennt, macht das Szenario grün, sagt aber im echten Fall weiter nichts (`ki-model.service.ts:35`). Fix: ein pg-Test «meldet, wenn die lokale KI nicht antwortet» mit `baseUrl` auf einem geschlossenen Port (wie `127.0.0.1:9` im Test zu F-16). Oder die Attrappe schliesst im Zustand «offline» die Verbindung ohne Antwort. |
| F-22 | Verwalter | Minor | Für die Ablehnung der Prüfung (F-16) zeigt kein Szenario, was der Liegenschaftsverwalter sieht. Die Prüfung zeigt ihr Ergebnis an anderer Stelle als das Speichern («sagt die Prüfung der Verbindung», Feature:112, gegenüber «sieht … den Fehler», Feature:106). Ob dort die Meldung `backend_KI_KEY_FOR_NEW_ADDRESS` erscheint, prüft also nichts. Fix: im Grundriss «Die Verbindung zur KI prüfen» die Zeile `| neuer Adresse ohne Schlüssel | Geben Sie den API-Schlüssel erneut ein. Dwello schickt den gespeicherten Schlüssel nicht an eine andere Adresse. |` mit einem Schritt, der zuerst einen Anbieter speichert. |

Zu den geplanten Texten der Minors aus Runde 2:
- F-17: Der geplante Text erscheint nur, solange die lokale KI gewählt ist, und die Wahl von «Lokale KI» startet den Download sofort. Damit stimmen die drei genannten Anlässe mit dem Ablauf überein, den `ki-model.service.ts` und der Test zu `KI_NOT_LOCAL` festhalten. Erledigt, sobald der Text so umgesetzt ist.
- F-18: Der Test legt eine Kategorie mit Namen an und prüft, dass ihr Name nicht mitgeht. Text und Bild sind bei zwei Prüfungen gleich. Erledigt.
- F-19: Der geplante Satz «Läuft die KI auf einem Server, den Sie selbst betreiben, entfällt dieser Punkt.» passt. Erledigt, sobald er umgesetzt ist.
- F-20: Der Satz steht in Feature:58. Erledigt.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Ob «Dwello ist eingerichtet» im Szenario «Das KI-Modell erneut herunterladen» schon einen laufenden Pull hat, den `/stub/ollama` «failed» beenden kann. Ohne laufenden Pull bliebe der Zustand «loading», die Schaltfläche erschiene nicht, und das Szenario würde rot, nicht fälschlich grün. Das hängt am Zeitablauf im Stack (`playwright.config.ts:203–221`), den ich nicht ausgeführt habe. Für den fachlichen Inhalt spielt es keine Rolle.
- Neue Rechtsaussagen enthält die Änderung nicht. Darum habe ich keine Fedlex-Stelle neu zitiert.

Geprüft: der Zustand der Attrappe wird zurückgesetzt (`cleanUp` setzt «online»); die Protokolltests zu F-4 (Anbieter und Land pro Wechsel, kein Eintrag bei einer Ablehnung).
