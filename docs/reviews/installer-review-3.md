# Code-Review #579, Runde 3 (4280759b..c4351feb)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | .github/workflows/ci.yml:96 | Weiterhin offen: Für den Pfadfilter `installer` gibt es keinen Test. |
| C-6 | Minor | install/linux.sh:9 (ebenso macos.sh, windows.ps1) | Weiterhin offen: Der Ordner ist fest `~/dwello`. Eine bestehende Installation in einem anderen Ordner wird ohne ihre `.env` neu angelegt. |
| C-9 | Minor | install/linux.sh:47, macos.sh:44, windows.ps1:57 | Weiterhin offen: Dass nach abgeschlossener Einrichtung kein Einrichtungscode mehr erscheint, prüft kein Test. |

Geschlossen: C-7, C-8.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bash -n` auf linux.sh, außerdem die Zeile von C-7 rot ohne und grün mit `|| true`, sowohl mit als auch ohne `.env`. Selbst nachgeprüft habe ich nur den Fall ohne `.env` in einem leeren Ordner: Der ERR-Trap greift nicht, `url` bleibt leer, Exit 0.
- Job «Installer (Linux)»: Er ist noch nie gelaufen. Die offenen Punkte aus Runde 1 (AppArmor, Speicherplatz, SIGPIPE) gelten deshalb weiter.
- windows.ps1:23: Ob `wsl --install --no-distribution` bei nötigem Neustart 0 oder 3010 zurückgibt, ist ungeprüft. Beide Werte werden jetzt angenommen; nur ein Handtest unter Windows klärt das. Gelesen ist der Code: `-notin` gibt es ab PowerShell 3, und das Komma bindet stärker als `-notin`.
- windows.ps1:57: `-ErrorAction Stop` macht die 303-Antwort in PowerShell 5.1 zu einem abbrechenden Fehler, den `catch` abfängt (`$open = $false`). Das stützt sich auf das bekannte Verhalten von PS 5.1; ausgeführt habe ich nichts.

Geprüft: install/linux.sh und install/windows.ps1 im Delta. Der Merge 1593b31f hat diese Dateien nicht berührt und bringt nur Änderungen aus main (u. a. pr-comments.yml, ki-einstellungen), keine in installer-Dateien oder ci.yml. ponytail-review: nichts zu kürzen.
