# Code-Review Runde 1: dwello.ch bei Suchmaschinen indexieren (76361f3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | marketing/sitemap.xml:4-33 | Die hreflang-Alternativen der Sitemap (`/`, `/fr/`, `/it/`, `/en/`) widersprechen denen der Seiten selbst: `index.html:11-14` und `{fr,it,en}/index.html:11-14` nennen `…/index.html`, z. B. `https://dwello.ch/fr/index.html`, und verweisen zurück auf `/index.html`, nicht auf `/`. Es gibt kein `rel="canonical"`, und die Sprachnavigation verlinkt ebenfalls `index.html`. Google sieht damit zwei URL-Sätze für dieselben Seiten (`/` aus der Sitemap, `/index.html` aus internen Links). Die hreflang-Angaben aus den beiden Quellen passen nicht zusammen, und Google kann sie verwerfen. Die Indexierung selbst klappt, aber die Sprachzuordnung, die die Sitemap liefern soll, ist nicht sicher. Behebung: entweder die Sitemap-URLs an die HTML-Angaben angleichen oder `<link rel="canonical">` plus HTML-hreflang auf `/`-URLs (über `marketing/i18n/build.py` Z. 73-74 für fr/it/en). |
| C-2 | Minor | .github/workflows/deploy-site.yml:89 | Der Glob `marketing/[0-9a-f]*.txt` passt auf jede `.txt` im Wurzelordner, deren Name mit 0-9 oder a-f beginnt. Bei einer zweiten solchen Datei (übliche Wurzeldateien wie `ads.txt`, oder `faq.txt`) bekommt `basename` drei Operanden und bricht mit «extra operand» ab. Unter `bash -e` scheitert dann der Schritt, und der Deploy-Job wird rot, obwohl der Upload durchlief. Passt keine Datei, wird der Literal-String `[0-9a-f]*` als Key gesendet. Behebung: einen genauen Glob mit 32 Hex-Zeichen verwenden oder den Key fest im Schritt eintragen. |
| C-3 | Minor | .github/workflows/deploy-site.yml:91-94 | `curl` läuft ohne `--fail`, also endet ein HTTP-Fehler von IndexNow (403 Key nicht gefunden, 422 Host/URL passt nicht, 429) mit Exit 0. Er erscheint nur als Logzeile `IndexNow: HTTP 403`, ohne `::warning::`, und der Job bleibt grün. Der Warnzweig `\|\| echo` greift nur bei Netzfehlern, ein falscher oder nicht hochgeladener Key bleibt also unbemerkt. Ausserdem fehlt `--max-time`: Ein hängender Endpunkt hält den Job bis zum Job-Timeout (6 h) fest, und wegen `concurrency: deploy-site` warten auch spätere Deploys. |

Keine Blocker oder Major.

Geprüft:
- Der Upload-Schritt lädt `robots.txt`, `sitemap.xml` und die Key-Datei hoch. `mirror --reverse` schliesst nur `i18n/`, `.fallow/`, `README.md` und Seiten mit `data-pending` aus.
- Der IndexNow-Schritt läuft nur bei `ready == 'yes'` und nach einem erfolgreichen Upload (Standard `success()`).
- Der Inhalt der Key-Datei ist gleich ihrem Namen, und `keyLocation` und `host` passen zu den URLs.
- Jeder `<url>` der Sitemap hat eine Selbstreferenz und `x-default`, mit Codes, die zu `<html lang>` passen, und die Namespaces stimmen.
- `robots.txt` ist korrekt.
- Kein Test liest `marketing/` (grep in `src`, `tests`, `tools`, `backend/src`).
- Der README-Eintrag und der Plan-Eintrag passen zur Änderung.
- «No scenario» ist für die statische Marketing-Site begründet: keine App-, UI- oder `messages`-Änderung.

## Nicht bestätigt

- `xmllint --noout marketing/sitemap.xml`, der YAML-Parse von `deploy-site.yml` und die JSON-Prüfung des IndexNow-Bodys sind vom Aufrufer gemeldet, nicht von mir wiederholt.
- Die Live-Antworten 200 für `/`, `/fr/`, `/it/`, `/en/` sind vom Aufrufer gemeldet. Ob `www.dwello.ch` und `http://` auf `https://dwello.ch/` umleiten (sonst andere Host-Varianten im Index) und ob Apache `/index.html` auf `/` umleitet, habe ich nicht geprüft (kein Netzzugriff verwendet).
- Ob api.indexnow.org den Ping nach dem Upload annimmt (200/202), lässt sich erst im ersten Deploy-Lauf sehen.
