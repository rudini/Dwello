# Fach-Review #577, Runde 1 (Szenario vor der Implementierung)

Gegenstand: `tests/e2e/features/einrichtung.feature` (@wip) im Worktree `review-577-fach` auf b325da0, Issue #577 («Decided» inkl. Entscheid 2026-10-21 zum Einrichtungscode), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `messages/de.json` (privacy_*, login_*, terms_*), `src/routes/privacy/+page.svelte`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| R-1 | Rechtstexte | Major | Auf einer frischen Installation sagt die Datenschutzerklärung, die /setup verlinkt, nichts über das Konto mit Passwort, das der Besucher dort gerade anlegt |
| R-2 | Rechtstexte | Major | Der automatische Download des KI-Modells ist eine neue Verbindung zu Ollama Inc. (USA); `privacy_third_5` («Ausser den hier … genannten Diensten erhält niemand Daten von Dwello») wird damit falsch |
| R-3 | Rechtstexte | Minor | `privacy_controller_none` sagt «tragen Sie sie bei der Einrichtung ein», aber die Seite «Dwello einrichten» fragt nicht nach Name und Adresse des Betreibers. Text ändern (siehe unten) oder die Einrichtung fragt danach (Entscheid) |
| R-4 | Rechtstexte | Minor | Es ist nicht festgelegt, ob das Anlegen des Kontos und die Anmeldung danach im Protokoll des Servers landen. `privacy_login_log` sagt «Jede Anmeldung … wird … festgehalten». Die automatische Anmeldung nach der Einrichtung muss wie eine Anmeldung protokolliert werden (mit Test), sonst wird der Satz falsch |
| R-5 | Rechtstexte | Minor | Datensicherheit (Art. 8 Abs. 1 DSG): Fehlversuche mit dem Einrichtungscode sind nicht begrenzt, und seine Länge ist nicht festgelegt. Einen Code mit genug Zufall (z. B. ≥ 80 Bit) oder eine Sperre wie bei der Anmeldung in einem Test festhalten; der Code darf nur im Protokoll des Backends stehen, nie in einer Antwort an den Browser oder im Log des Frontends |
| V-1 | Verwalter | Minor | Hinweis zum falschen Code, Zeile 27: Der Code wird bei jedem Start neu erzeugt. Nach einem Neustart scheitert «Geben Sie ihn erneut ein» mit dem alten Code wieder. Den zuletzt angezeigten Code nennen (Wortlaut unten) |
| V-2 | Verwalter | Minor | Neue Begriffe ohne Glossarzeile: «Einrichtung», «Einrichtungscode», «KI-Modell». Die Zeilen «Konto mit Passwort» und «Protokoll des Servers» widersprechen dem geplanten Verhalten. Vorschläge unten; Issue mit `fachlich`, `entscheiden`, und bis dahin `TODO(fachlich prüfen, #…)` |
| V-3 | Verwalter | Minor | `i18n-begriffe.md` hat keine Zeilen für Einrichtung, Einrichtungscode und KI-Modell; Vorschlag unten |
| V-4 | Verwalter | Minor | Fehlzustände ohne Szenario (`tests/e2e/CLAUDE.md`, «Rules»): die zwei Passwörter stimmen nicht überein; das Passwort ist zu kurz (`MIN_PASSWORD_LENGTH = 8`, `backend/src/services/local-account.service.ts:15`, es gibt noch keine Meldung `backend_PASSWORD_TOO_SHORT`); der Download des Modells scheitert (der Hinweis bliebe bei N % stehen). Szenarien bzw. Texte ergänzen (Wortlaut unten) |
| V-5 | Verwalter | Minor | `login_unavailable_text` («Legen Sie ein Konto … an, wie in der Installationsanleitung beschrieben») verweist auf den Befehl, den #577 ersetzt. /login muss auf einer frischen Installation zur Einrichtung führen (Szenario: «Wenn ein Besucher die Anmeldung öffnet»), dann entfällt der Text, sonst lautet er: «Dwello ist noch nicht eingerichtet. Öffnen Sie «Dwello einrichten» und legen Sie dort Ihr Konto an.» |

## R-1 (Major): Anmeldung in der Datenschutzerklärung fehlt bei der Einrichtung

**Beleg.** `src/routes/privacy/+page.svelte:109-111` zeigt `privacy_login_local_1` und `privacy_login_local_log` nur, wenn `data.password` gilt, also nur wenn schon ein Konto mit Passwort besteht (`src/routes/privacy/+page.server.ts:21`). Auf einer frischen Installation gibt es kein Konto und keinen Anbieter: Der Abschnitt «Anmeldung» zeigt dann nur `privacy_login_log`. Genau diese Fassung öffnet das Szenario «Von der Einrichtung zur Datenschutzerklärung» (Zeilen 39-43). Dort tippt der Besucher E-Mail-Adresse und Passwort ein.

Art. 19 Abs. 1 DSG: «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten». Abs. 2: «Er teilt der betroffenen Person bei der Beschaffung diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist». Für die Anmeldung ist der Betreiber verantwortlich (`privacy_controller_2`). Betreibt ein Anbieter Dwello, muss der Vermieter also bei der Einrichtung lesen können, was mit E-Mail-Adresse und Passwort geschieht. Betreibt er Dwello selbst, ist er selbst die betroffene Person, und die Pflicht entfällt nach Art. 20 Abs. 1 Bst. a («Die betroffene Person verfügt bereits über die entsprechenden Informationen»). Dwello kann die beiden Fälle nicht unterscheiden.

**Lösung.** Die Bedingung lautet «ein Konto mit Passwort besteht **oder die Einrichtung ist offen**» (also kein Konto und kein Anbieter). Dazu ein Szenario: «Dann nennt die Datenschutzerklärung, wie Dwello das Passwort speichert». `privacy_login_local_1` passt inhaltlich. Nur der erste Satz «Sie melden sich mit E-Mail-Adresse und Passwort an» passt nicht zum Moment, in dem man das Konto anlegt. Vorschlag:

> «Sie melden sich mit E-Mail-Adresse und Passwort an; das Konto legen Sie bei der Einrichtung von Dwello an. Dwello speichert dafür …» (Rest unverändert)

## R-2 (Major): Download des KI-Modells von Ollama ist nicht genannt

**Beleg.** Geplant ist: «when the KI runs locally (Ollama) and the model is missing, the backend downloads it from Ollama's registry by itself». Bisher löste der Betreiber diese Verbindung mit `docker exec dwello-ollama ollama pull …` selbst aus (`docs/installation.md:56`). Neu öffnet die Installation sie von sich aus. `privacy_llm_local` sagt «die Daten verlassen dafür den Server nicht», `privacy_third_5` sagt «Ausser den hier und unter «Anmeldung» genannten Diensten erhält niemand Daten von Dwello». Beim Download erhält Ollama Inc. die IP-Adresse des Servers. Laut ollama.com/privacy erfasst Ollama «Model download metadata» und «IP address and general location», und «Data may be transferred to and processed in the United States». Läuft Dwello beim Vermieter zu Hause, lässt sich die IP-Adresse ihm zuordnen. Sie ist dann ein Personendatum (Art. 5 Bst. a DSG: «alle Angaben, die sich auf eine bestimmte oder bestimmbare natürliche Person beziehen»). Art. 19 Abs. 4 DSG: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat … mit». Daten von Mietern oder Rechnungen gehen dabei nicht mit, solange nur das Modell geholt wird. Das ist im Plan so vorgesehen und gehört in einen Test (Anfrage an `/api/pull` nur mit dem Namen des Modells).

Die Pflicht zu informieren ist hier schwach, denn beim Selbstbetrieb gilt Art. 20 Abs. 1 Bst. a, und bei einem Anbieter ist es dessen IP-Adresse. Trotzdem: Die Erklärung behauptet, sie zähle alle Empfänger auf, und sie nennt swisstopo mit genau dieser Angabe («die IP-Adresse des Servers», `privacy_third_3`). Ohne Ollama wird sie falsch.

**Lösung.** Nur wenn die KI lokal läuft (Zweig von `privacy_llm_local`), einen Absatz im Abschnitt «Weitergabe an Dritte» anfügen:

> «Fehlt das KI-Modell auf dem Server, etwa beim ersten Start, lädt Dwello es einmal bei Ollama (Ollama Inc., USA) herunter, rund 6 GB. Ollama erhält dabei die IP-Adresse des Servers und den Namen des Modells, keine Daten, die Sie in Dwello erfassen; die Angaben können in die USA gelangen.»

Dazu einen Satz in `privacy_llm_local`, damit «verlassen den Server nicht» stimmt: «Die Rechnungen und Kategorien verlassen dafür den Server nicht.» Ob Ollama Inc. nach dem Swiss-U.S. Data Privacy Framework zertifiziert ist, ist **unsicher** (siehe «Nicht bestätigt»). Ist sie es nicht, keinen Satz über Garantien aufnehmen; Art. 19 Abs. 4 verlangt die Garantien nur «gegebenenfalls».

## Vorschläge zu den Minor-Befunden

**V-1, Hinweis bei falschem Code (Zeile 27):**
> «Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers mit dem Befehl docker logs dwello-backend; es gilt der zuletzt angezeigte Code. Geben Sie ihn erneut ein.»

Ansonsten erfüllt der Hinweis die Design-Regeln (Sie-Form, sagt, was geschah und was zu tun ist). Zum Protokoll des Backends: Das Issue nennt `docker logs dwello-frontend`. Dass Code und Szenario das Backend nennen, deckt die Coding-Guideline («follow the code»). Der Pull Request muss diese Abweichung nennen.

**V-2, Glossar (Vorschläge für das Issue):**
- **Einrichtung**: Seite «Dwello einrichten», die eine frische Installation (ohne Konto mit Passwort und ohne Anbieter wie Google) jedem Besucher zeigt. Dort legt der Liegenschaftsverwalter mit dem Einrichtungscode das Konto mit Passwort an und ist danach angemeldet. Besteht ein Konto, führt sie zur Anmeldung. Code: `/setup` (#577).
- **Einrichtungscode**: Zufälliger Code, den Dwello bei jedem Start erzeugt, solange kein Konto mit Passwort besteht, und ins Protokoll des Servers schreibt (`docker logs dwello-backend`). Nur wer ihn kennt, kann bei der Einrichtung das Konto anlegen; es gilt der zuletzt erzeugte (#577).
- **KI-Modell**: Sprachmodell, mit dem die KI auf dem Server des Betreibers (Ollama) Rechnungen kategorisiert und ausliest. Fehlt es, lädt Dwello es von Ollama herunter (rund 6 GB). Bis dahin erfasst der Liegenschaftsverwalter Rechnungen von Hand. Nicht zu verwechseln mit einem Anbieter der KI ausserhalb des Servers.
- **Konto mit Passwort** (Änderung): «Der Betreiber legt es mit einem Befehl auf dem Server an …» wird zu «Der Liegenschaftsverwalter legt es bei der Einrichtung mit dem Einrichtungscode an; der Betreiber setzt ein vergessenes Passwort mit einem Befehl auf dem Server zurück.»
- **Protokoll des Servers** (Änderung): nach «… sowie über Fehler» einfügen: «; auf einer frischen Installation steht darin auch der Einrichtungscode».

**V-3, i18n-begriffe:** Einrichtung / Einrichtungscode / Dwello einrichten: fr «configuration initiale / code de configuration / Configurer Dwello», it «configurazione iniziale / codice di configurazione / Configurare Dwello», en «setup / setup code / Set up Dwello». KI-Modell: fr «modèle d’IA», it «modello di IA», en «AI model».

**V-4, Texte für die Fehlzustände:**
- «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.»
- `backend_PASSWORD_TOO_SHORT`: «Das Passwort ist zu kurz. Wählen Sie eines mit mindestens {min} Zeichen, am besten ein langes, das Sie sonst nirgends verwenden.» (wie `docs/installation.md:59` und `privacy_login_local_1`). Die gleiche Empfehlung gehört als Hilfetext ans Passwortfeld.
- Download gescheitert: «Das KI-Modell konnte nicht geladen werden. Erfassen Sie Rechnungen von Hand; Dwello versucht es beim nächsten Start erneut.» (Ob Dwello es erneut versucht, muss der Plan festlegen.)
- Fortschritt (Zeilen 56-57): «Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand.»

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)
Einrichtung, Einrichtungscode, KI-Modell sowie die Änderungen an «Konto mit Passwort» und «Protokoll des Servers» (Wortlaut unter V-2). Im gleichen Issue zu entscheiden (R-3): Soll «Dwello einrichten» auch Name, Adresse und Kontakt des Betreibers abfragen (heute `OPERATOR_NAME` usw. in `.env`, die #577 optional macht)? Wenn nicht, wird `privacy_controller_none` zu: «… Betreiben Sie Dwello selbst, tragen Sie sie in der Einstellungsdatei ein, wie die Installationsanleitung beschreibt; sonst fragen Sie Ihren Anbieter danach.»

## Nicht bestätigt
- Ob Ollama Inc. nach dem Swiss-U.S. Data Privacy Framework zertifiziert ist, und ihr Sitz (LinkedIn und Preqin nennen Palo Alto, Kalifornien). Gesucht mit `mmx search` («Ollama Data Privacy Framework», «Ollama Inc headquarters»); ollama.com/privacy nennt weder eine Adresse noch das DPF. Die Liste auf dataprivacyframework.gov war nicht abrufbar.
- Über welchen Host und welches Land die Modelldateien kommen (registry.ollama.ai bzw. ein CDN). Gesucht mit `mmx search`; keine verlässliche Quelle gefunden. Für den Vorschlag zu R-2 reicht «Ollama (Ollama Inc., USA)».
- Ob die Anfrage zum Download ausser dem Namen des Modells weitere Daten mitsendet. Das zeigt erst die Implementierung (Test zu R-2).
- Fedlex: `fedlex.admin.ch/eli/cc/2022/491/de` gab 503 zurück. Den Wortlaut von Art. 5, 8, 16, 19, 20 DSG habe ich aus der Fedlex-Ablage (`filestore/fedlex.data.admin.ch/eli/cc/2022/491/20230901/de/html/…-html-1.html`, Stand 1.9.2023) zitiert.

Geprüft: Ablauf und Seitennamen der Szenarien 1, 2, 4-7 gegen «Decided» in #577 (Code im Protokoll, einmalige Einrichtung, Anmeldung danach, Links wie auf der Anmeldeseite). Die Kopfzeile mit der E-Mail-Adresse stimmt mit der Glossarzeile «Konto mit Passwort» überein. Ein Einrichtungscode im Protokoll ist kein Personendatum und braucht keinen Satz in der Datenschutzerklärung. `login_intro_password` («bei der Einrichtung festgelegt») und `login_password_forgot` (das Zurücksetzen bleibt ein Befehl) bleiben richtig. Nutzungsbedingungen: keine Aussage betroffen.
