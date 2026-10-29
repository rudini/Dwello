# ADR 0007: Zugangsschlüssel für KI-Programme am MCP-Server

- **Status:** angenommen (Product Owner, 26.10.2026, #817; der Weg durch die Web-App nach der Empfehlung der umsetzenden Sitzung, 28.10.2026)
- **Szenario:** S1 (Sitzung und Mieterdaten geschützt), AP2 (Fachregeln nur im Backend), AP3 (Kein Update ohne Rückweg)

## Kontext

Ein KI-Programm der Wahl des Vermieters (etwa Claude Desktop) soll seine Daten lesen können, über das Model Context Protocol (MCP). Bisher meldet sich nur der Browser an: Die Web-App macht OAuth oder prüft das Passwort, hält das JWT der Sitzung im HTTPOnly-Cookie und gibt es dem Backend im `Authorization`-Header weiter. Ein KI-Programm hat keinen Browser und kein Cookie.

Nur die Web-App hat einen Port nach aussen. Backend, Datenbank und KI bleiben im `dwello-network` (#747, `docker-compose.prod.yml`).

## Entscheidung

1. **Zugangsschlüssel:** Der Vermieter erstellt unter «Einstellungen» › «Zugangsschlüssel für KI-Programme» einen Schlüssel mit einem Namen. Dwello zeigt ihn einmal. Gespeichert wird nur seine SHA-256-Prüfsumme (`access_keys.key_hash`). Der Schlüssel hat 256 zufällige Bits. Darum genügt eine schnelle Prüfsumme ohne Salz, anders als bei einem Passwort. Jeder Schlüssel läuft nach 90 Tagen ab und lässt sich einzeln widerrufen. Ein widerrufener Schlüssel wird gelöscht.
2. **Nur an `/mcp`:** Das Backend nimmt einen Schlüssel (`Authorization: Bearer dwello_…`) nur am Pfad `/mcp` an. Die übrige API nimmt weiter nur das JWT der Sitzung an. `/mcp` nimmt nur einen Schlüssel an, keine Sitzung. Ein fehlender, unbekannter oder widerrufener Schlüssel bekommt 401 mit `ACCESS_KEY_INVALID`, ein abgelaufener 401 mit `ACCESS_KEY_EXPIRED`.
3. **Nur lesen, über die API:** Jedes Werkzeug des MCP-Servers (`backend/src/routes/mcp.ts`) ruft eine `GET`-Route der API im Prozess auf (`app.handle`), mit einem JWT, das das Backend nur für diesen Aufruf ausstellt. So gelten dieselben Prüfungen und dieselben Ablehnungen (Codes) wie für die UI (AP2). Routen, die eine Datei liefern (PDF, Beleg, Export), ruft kein Werkzeug auf. Zu jedem Ergebnis gibt das Werkzeug einen Link auf die Seite in Dwello. Dort öffnet der Vermieter ein Dokument und bestätigt jede unumkehrbare Aktion.
4. **Durch die Web-App:** Die Web-App leitet `/mcp` unverändert ans Backend weiter (`src/routes/mcp/+server.ts`), ohne Sitzung und ohne eigene Regel. Der Schlüssel wird nur im Backend geprüft. So bleibt das Backend ohne eigenen Port (#747).
5. **Protokoll:** Erstellen, Widerrufen und Ablauf eines Schlüssels sowie jeder Aufruf eines Werkzeugs (Werkzeug und Name des Schlüssels, ohne Inhalte) kommen ins Protokoll unter «Einstellungen». Den Ablauf hält Dwello fest, sobald es ihn zum ersten Mal sieht: in der Liste oder bei einem Aufruf.

## AP3: Update und Restore

Die Tabelle `access_keys` kommt mit der Migration `0039_access_keys.sql`. Sie ist neu. Der Upgrade-Test vom letzten Release (`upgrade`, `docs/architecture/fitness-functions.md`) prüft sie mit. Die Schlüssel liegen in der Datenbank. Darum sind sie im Backup und gelten nach einem Restore weiter. Das Backup enthält nur die Prüfsummen, nie die Schlüssel. Wer nach einem Restore alte Schlüssel nicht mehr will, widerruft sie in der Liste.

## Verworfene Optionen

- **Backend mit eigenem Port für `/mcp`:** öffnet einen zweiten Weg von aussen, an der Prüfung der Web-App vorbei (#747).
- **Werkzeuge aus der OpenAPI erzeugen:** Der Product Owner hat Werkzeuge in den Worten des Vermieters entschieden (#817).
- **Die Dienste direkt aufrufen statt der Routen:** Prüfungen der Eingabe und Codes der Routen müssten nachgebaut werden, und eine Abweichung von der UI wäre möglich.
- **Das offizielle MCP-SDK:** Für `initialize`, `tools/list` und `tools/call` mit einer JSON-Antwort genügen wenige Zeilen. Das SDK brächte eine Abhängigkeit mit eigenem Transport, die der Server nicht braucht.

## Tradeoffs und verbleibende Risiken

- Wer einen Schlüssel hat, liest alle Daten, auch die Personendaten der Mieter, bis der Schlüssel abläuft oder widerrufen ist. Dwello hat keinen Einfluss darauf, was das KI-Programm damit tut (Datenschutzerklärung, Abschnitt «KI-Programme mit Zugangsschlüssel»).
- Kein Rate Limiting (ADR 0004). Ein Schlüssel lässt sich bei 256 Bits nicht erraten.
- Nur JSON-Antworten, kein Server-Sent-Events-Strom. Der Server sendet nichts von sich aus. Das genügt dem Streamable-HTTP-Transport.
