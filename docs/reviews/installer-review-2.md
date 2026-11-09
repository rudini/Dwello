# Code-Review #579, Runde 2 (3b378d05..4280759b)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | .github/workflows/ci.yml:96 | Unverändert offen: Für den Pfadfilter `installer` gibt es keinen Test. |
| C-6 | Minor | install/linux.sh:9 (gleich macos.sh, windows.ps1) | Unverändert offen: Das Skript verwendet fest `~/dwello`. Eine bestehende Installation in einem anderen Ordner wird ohne ihre `.env` neu erstellt. |
| C-7 | Blocker | install/linux.sh:43 | `url=$(sed -n … .env 2>/dev/null \| tail -1)` läuft unter `set -euo pipefail`. Ohne `.env`, also bei jeder Standardinstallation, endet das Skript mit «Dwello installation stopped». Dwello läuft dann zwar, aber das Skript nennt weder Adresse noch Einrichtungscode und öffnet keinen Browser. |
| C-8 | Minor | install/windows.ps1:57 | Windows PowerShell 5.1 meldet bei `-MaximumRedirection 0` eine 303-Antwort von `/setup` (Einrichtung abgeschlossen, src/routes/setup/+page.server.ts:8) als nicht abbrechenden Fehler. `try/catch` fängt ihn deshalb nicht. Beim erneuten Ausführen nach der Einrichtung erscheint am Ende eines erfolgreichen Laufs rot «The maximum redirection count has been exceeded …». Abhilfe: `-ErrorAction Stop` (oder `SilentlyContinue`). |
| C-9 | Minor | install/linux.sh:47, macos.sh:44, windows.ps1:57 | Die Korrektur von C-2 (kein Code mehr, sobald die Einrichtung abgeschlossen ist) hat keinen Test. Der Job «Installer (Linux)» führt das Skript zweimal aus, solange die Einrichtung noch offen ist, und prüft nur, dass der Code erscheint. Dass er nach der Einrichtung fehlt, prüft er nicht. Würde die Bedingung entfernt, bliebe der Job grün. |

Geschlossen: C-1, C-2, C-3, C-4.

## C-7: Linux-Skript bricht ohne `.env` nach dem Start ab

`sed` findet keine `.env` und endet mit Status 2. Unter `pipefail` erhält die ganze Pipeline diesen Status, und damit auch die Zuweisung `url=$(…)`. `set -e` greift, der ERR-Trap ruft `fail "a step above failed …"` auf, Exit 1. `2>/dev/null` unterdrückt nur die Meldung von `sed`, nicht seinen Status. `~/dwello/.env` gibt es nur, wenn sie vorher von Hand angelegt wurde (docs/installation.md:22, nur für Server). Betroffen sind also der Desktop-Linux-Pfad und jeder Server ohne vorher angelegte `.env`. In beiden Fällen läuft Dwello, aber das Skript meldet einen Abbruch und zeigt keinen Einrichtungscode. Die Person kommt ohne `docker logs` nicht weiter.

Nachweis (ausgeführt in einem leeren Ordner):

```
bash -c 'set -euo pipefail; trap "echo ERR-TRAP; exit 1" ERR; url=$(sed -n "s/^PUBLIC_APP_URL=//p" .env 2>/dev/null | tail -1); echo reached'
```

Ausgabe: `ERR-TRAP`, Exit 1. Der CI-Job «Installer (Linux)» legt keine `.env` an (ci.yml:177-187). Er würde rot, weil `run` unter `pipefail` mit Status 1 endet, und `grep Einrichtungscode` fände nichts. Abhilfe z. B.: `url=$(sed -n 's/^PUBLIC_APP_URL=//p' .env 2>/dev/null | tail -1 || true)`, oder vorher `[ -f .env ]` prüfen.

Die neue Zeile 47 (`[ … ] || [ … ] || say`) ist dagegen sicher. Für Befehle vor dem letzten `||` greifen `set -e` und der ERR-Trap nicht. Der Status von `curl` in der Kommandosubstitution zählt nicht, nur der von `[`. Ausgeführt mit nicht erreichbarem Port: Das Skript läuft weiter.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bash -n` auf beiden .sh, vitest tools/ci und tools/deepcheck/test/workflows.test.ts (77), `python3 marketing/i18n/build.py`; auf 3b378d05 lint, svelte-check, backend type-check, fitness --structure.
- Job «Installer (Linux)»: Er ist noch nie gelaufen. Nach C-7 erwarte ich ihn rot. Die offenen Punkte aus Runde 1 (AppArmor, Speicherplatz, SIGPIPE) gelten weiter.
- Windows, `Start-Process -Verb RunAs -Wait -PassThru` in PS 5.1: Bei ShellExecuteEx ist der Prozess-Handle vorhanden, `ExitCode` sollte nach `-Wait` also lesbar sein. Eine abgelehnte UAC-Abfrage wirft dank `-ErrorAction Stop` einen Fehler, den `catch` mit dem allgemeinen «What to do» abfängt. Ungeprüft ist, ob `wsl --install --no-distribution` bei Erfolg mit nötigem Neustart 0 zurückgibt oder 3010 (ERROR_SUCCESS_REBOOT_REQUIRED). Bei 3010 würde Z. 23 fälschlich «WSL2 was not installed» melden. Nur ein Handtest auf Windows kann das klären.
- C-8 beruht auf dem bekannten Verhalten von Invoke-WebRequest in PS 5.1 (Weiterleitungsfehler nicht abbrechend, Antwort wird trotzdem zurückgegeben). Ausgeführt habe ich nichts.

Geprüft: alle 14 Dateien des Deltas. Texte de/fr/it/en wie im Fach-Report, 4 GB in Skripten, Doku und Seite einheitlich. `Test-Docker` mit `Get-Command` (C-1), `main-status` braucht `installer` (C-4), Windows-catch mit «What to do» (C-3). macOS-Zeile 44 sicher wie linux.sh:47. ponytail-review: nichts zu kürzen.
