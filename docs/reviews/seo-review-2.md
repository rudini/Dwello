# Code-Review Runde 2 (Abschluss): dwello.ch bei Suchmaschinen indexieren (76361f3..7039344)

## Status der offenen IDs aus `docs/reviews/seo-review-1.md`

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `marketing/sitemap.xml`: alle `<loc>` und hreflang-`href` lauten jetzt `https://dwello.ch/{,fr/,it/,en/}index.html`. Das passt zu den `<link rel="alternate">` in `marketing/index.html:11-14` und `marketing/{fr,it,en}/index.html:11-14` und zur Sprachnavigation (Z. 377, 382, 770). Dass die Sitemap zusätzlich `x-default` nennt, widerspricht den HTML-Angaben nicht, es ergänzt sie. |
| C-2 | behoben | `.github/workflows/deploy-site.yml:88-89`: Der Key steht als Step-`env` `KEY` fest im Schritt, der Glob ist weg. Der Wert ist gleich dem Namen und dem Inhalt der einzigen Key-Datei `marketing/1f373c571ac81444c9ecb4893b5fca7d.txt`. |
| C-3 | behoben | `deploy-site.yml:91-96`: `--max-time 30`, `-w '%{http_code}'` in `code`. Alles ausser 200/202 gibt `::warning::`. Unter `bash -e` bricht die Zuweisung `code=$(curl …) \|\| code=000` nicht ab. Nachgestellt mit einem Verbindungsfehler (curl Exit 7): Die Ausgabe war `IndexNow: HTTP 000` und `::warning::…000`, das Skript lief weiter, Exit 0. Ein Timeout (Exit 28) nimmt denselben Pfad. Der Schritt scheitert also nie am Ping. |

## Neue Befunde im Delta

Keine Befunde.

Geprüft: Die README-Zeile zum Key passt zum festen Eintrag in `deploy-site.yml`. Der Plan-Eintrag und `docs/reviews/seo-review-1.md` entsprechen der Ablage der übrigen Reviews in `docs/reviews/`. Im Delta gibt es keine fremden Änderungen.

## Nicht bestätigt

- Prettier auf den neu hinzugefügten Dateien ist vom Aufrufer gemeldet, ich habe es nicht wiederholt. `xmllint --noout marketing/sitemap.xml` und den YAML-Parse von `deploy-site.yml` habe ich wiederholt, beide ohne Fehler.
- Ob api.indexnow.org die `…/index.html`-URLs mit 200/202 annimmt und ob Google die `/index.html`-URLs statt `/` als kanonisch wählt, zeigt erst der erste Deploy-Lauf bzw. die Search Console. Die Live-Abfrage dieser URLs habe ich nicht ausgeführt.
