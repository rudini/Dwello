# Code-Review www-Weiterleitung, Runde 1 (d49c36f3, `marketing/.htaccess`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | marketing/.htaccess:9 | `^www\.dwello\.ch$` trifft einen Host mit abschliessendem Punkt (`www.dwello.ch.`, gültiger FQDN) oder mit Port (`www.dwello.ch:443`) nicht: diese Anfragen bekommen weiter 200 statt 301. Ein auf `^www\.dwello\.ch\.?(:\d+)?$` erweitertes Muster würde sie abdecken. Kein Merge-Hindernis. |

Keine Blocker oder Major.

Geprüft:
- Schleife: Das Ziel `dwello.ch` erfüllt die RewriteCond nicht, also keine Schleife, auch nicht bei TLS-Terminierung vor Apache, weil die Regel nicht auf `%{HTTPS}` schaut.
- Query-String: `%{REQUEST_URI}` enthält ihn nicht. Weil die Substitution aber kein `?` enthält, hängt mod_rewrite den ursprünglichen Query-String selbst an. Der Pfad wird bei externen Weiterleitungen neu escaped.
- RedirectMatch 404: Der Fixup von mod_rewrite (per Verzeichnis, `APR_HOOK_FIRST`) läuft vor dem von mod_alias. Damit wird `www…/README.md` zuerst auf `dwello.ch/README.md` umgeleitet und gibt dort 404. Beide Reihenfolgen wären unschädlich. Ausserdem lädt der Mirror README.md und i18n/ gar nicht hoch.
- Unterordner: Im Repository gibt es keine weitere `.htaccess` (`find marketing -name .htaccess`). fr/, it/ und en/ übernehmen die Regel. `^` passt auf den gekürzten Pfad, und `%{REQUEST_URI}` liefert den vollen Pfad.
- Dotfiles: `lftp mirror --reverse` überträgt versteckte Dateien, und die Workflow-Excludes treffen `.htaccess` nicht. Live bestätigt: https://dwello.ch/ sendet die CSP- und HSTS-Header aus genau dieser Datei.
- dwello.ch selbst: Die RewriteCond greift nur beim Host www. Die anderen Direktiven bleiben unverändert. `Header always` setzt die Header auch auf den 301.
- Der Commit trägt `No scenario: static marketing site, not the app.`

## Nicht bestätigt

- Nichts am Apache ausgeführt (der Container hat kein Apache, und der Commit ist nicht deployt). Live antwortet https://www.dwello.ch/fr/?a=1 heute mit 200 ohne Weiterleitung, das ist der Stand vor dem Deploy.
- Bei Infomaniak nicht bestätigt:
  - dass `Options FollowSymLinks` (oder SymLinksIfOwnerMatch) für das Verzeichnis gilt. Ohne diese Option beantwortet Apache jede Anfrage mit RewriteRule in einer `.htaccess` mit 403, auch die an dwello.ch. Bei Infomaniak ist das üblich, weil die WordPress-.htaccess dort ohne `Options` läuft, aber geprüft ist es nicht.
  - dass der vorgeschaltete Proxy den Host-Header unverändert an Apache weitergibt. Ändert er ihn, greift die Regel nie, schadet aber auch nicht.
  - dass auf dem Server keine alte `.htaccess` in fr/, it/ oder en/ liegt, die `RewriteEngine` setzt und die Regel damit aufhebt. Der Mirror löscht nichts auf dem Server.
- http://www.dwello.ch/ und http://dwello.ch/ antworten über den Agent-Proxy mit 200 statt mit der HTTPS-Weiterleitung aus dem Manager. Ob das am Proxy liegt oder an der Website, liess sich nicht klären. Es liegt ausserhalb dieses Diffs.
- Vom Aufrufer gemeldet: keine lokal ausführbaren Checks. Live liefert https://www.dwello.ch/ 200 mit gültigem Zertifikat.
