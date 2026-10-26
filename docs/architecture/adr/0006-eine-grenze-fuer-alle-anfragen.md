# ADR 0006: Eine Grösse für alle Anfragen an die Web-App

- **Status:** angenommen (Product Owner, 26.10.2026, #732)
- **Szenario:** Hochladen von Dokumenten und Rechnungen bis 10 MB in einer selbst betriebenen Installation

## Kontext

Dokumente und Rechnungen dürfen bis 10 MB gross sein (#174). Damit der Node-Server der Web-App sie annimmt, steht `BODY_SIZE_LIMIT=11M` im `Dockerfile` (ebenso in `playwright.config.ts` und `docs/design/tools/persona-stack.sh`). Die Grenze gilt für jede Anfrage, die die Web-App liest, auch für `/auth` und Anfragen ohne Sitzung.

Ist eine Datei grösser, prüft Dwello sie mit JavaScript im Browser und zeigt die Meldung «grösser als 10 MB». Ohne JavaScript erreicht die Anfrage den Server. SvelteKit bricht das Lesen der Formulardaten mit dem Status 413 ab, und Dwello zeigt seine Fehlerseite statt einer Meldung im Formular; der eingegebene Titel geht verloren. Die Überschrift ist dort SvelteKits englisches «Payload Too Large» (#847).

Ein Reverse Proxy vor der Web-App hat eigene Grenzen: nginx nimmt ohne Einstellung höchstens 1 MB an, Caddy hat keine Grenze.

## Entscheidung

1. **Eine Grenze für alle Anfragen:** `BODY_SIZE_LIMIT=11M` bleibt. Uploads werden nicht an der Web-App vorbei geleitet.
2. **Ohne JavaScript bleibt die Fehlerseite** mit Status 413 bei einer zu grossen Datei, statt einer Meldung im Formular. Das ist eine bekannte Grenze.
3. **Reverse Proxy:** Die Anleitung bleibt bei Caddy (`docs/installation.md`, Abschnitt 7) und nennt für einen anderen Proxy mindestens 11 MB (nginx: `client_max_body_size 11m;`). Der auskommentierte nginx-Dienst ist aus `docker-compose.prod.yml` entfernt; eine `nginx.conf` dazu gab es nie.

## Verworfene Optionen

- **Uploads direkt ans Backend, globale Grenze tiefer:** Der Browser bräuchte dafür einen Token, den er im BFF nie sieht, und das Backend müsste von aussen erreichbar sein, was #747 geschlossen hat.
- **Eigene Grenze nur für die Upload-Routen in der Web-App:** adapter-node kennt nur eine Grenze für den ganzen Server; eine eigene Prüfung bräuchte Code, der den Datenstrom selbst liest.
- **nginx in der Compose-Datei mitliefern:** zweiter Weg neben Caddy, mit einer Konfiguration, die gepflegt werden müsste.

## Tradeoffs und verbleibende Risiken

- Jede Anfrage, auch ohne Sitzung, darf bis 11 MB gross sein. Bei einem Vermieter pro Installation (ADR 0004) ist die Last daraus klein; wer mehr will, begrenzt im Reverse Proxy.
- Wer ohne JavaScript eine zu grosse Datei hochlädt, sieht die Fehlerseite statt einer Meldung im Formular und muss den Titel neu eingeben.
- Wird die Grösse der Dokumente erhöht, sind das `Dockerfile`, die Testkonfigurationen und der Hinweis in `docs/installation.md` gemeinsam anzupassen; `backend/src/__tests__/compose-prod.test.ts` prüft, dass die Anleitung die Grenze des `Dockerfile` nennt.
