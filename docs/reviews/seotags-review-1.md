# Review seotags, Runde 1 (27d08854)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | marketing/index.html:23 (und fr/it/en:23) | `og:image` ist WebP (2080×1104, 67 KB). Facebook, Messenger, WhatsApp und X zeigen WebP. Mehrere Quellen sagen aber, dass LinkedIn und einige andere Plattformen (Slack, Discord, ältere Crawler) WebP-Vorschaubilder nicht anzeigen (ctrl.blog «Can you use a WebP file as an Open Graph Protocol image?», 2022; chottulink.com, 2026). Auf diesen Plattformen erscheint der Link dann ohne Bild. Abhilfe ohne neues Bildformat im Repo gibt es nicht: Man müsste eine PNG- oder JPEG-Kopie von `statement-light` pro Sprache ablegen. Format und Grösse passen sonst: Seitenverhältnis 1,88 statt der empfohlenen 1,91, unter der WhatsApp-Grenze von rund 300 KB. |

Kein Blocker, kein Major.

Geprüft:
- **Ersetzungen in build.py:** Die vier neuen Ersetzungen (`build.py:68-71`) treffen nur `rel="canonical"`, `og:url`, `og:image` (`content="https://dwello.ch/shots/`) und `og:locale`. Die absoluten hreflang-Links für de-CH und x-default bleiben unberührt: Die bestehenden Regex `hreflang="de-CH" href="([a-z]+\.html)"` und `href="([a-z]+\.html)"` sowie `href="../{lang}/` greifen nicht auf `https://…`. Impressum und Datenschutz haben keine der neuen Zeichenketten und behalten ihre relativen hreflang-Links. Das ist ausserhalb der Anforderung, die nur die Landingpages nennt.
- **Übersetzungen:** `og:title` und `og:description` kommen über die bestehenden Tabellenschlüssel (`i18n/*.json:2`, meta description), über die Attribut-Regex auf `content="…"`. Der Test auf verbliebenes Deutsch prüft `content`-Attribute mit, JSON-LD wird übersprungen (`script`).
- **Sitemap:** Canonical, hreflang (de-CH, fr-CH, it-CH, en, x-default → `https://dwello.ch/index.html`) und die URLs mit `index.html` stimmen in allen vier Seiten mit `marketing/sitemap.xml` überein.
- **og:locale:** de_CH, fr_CH, it_CH, en_US (OG-Standard für hreflang `en`).
- **JSON-LD:** gültiges schema.org-JSON (SoftwareApplication, Offer price "0" CHF, `isAccessibleForFree`, `license` AGPL-3.0, passend zu `LICENSE`). Es ist für das Google-Rich-Result nicht ausreichend: Dafür fehlt `aggregateRating` oder `review`. Die Anforderung verlangt das Rich-Result aber nicht.
- **CSP** (`marketing/.htaccess`): Ein `<script type="application/ld+json">` ist ein Datenblock und wird nicht ausgeführt. Ausserdem erlaubt `script-src 'unsafe-inline'` ihn ohnehin. Es entstehen keine externen Requests.
- **Deploy:** Die Seiten werden ohne Änderung am Workflow hochgeladen.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, Reproduzierbarkeit:** `build.py` reproduziert fr/it/en ohne Diff. Ich habe es versehentlich im Review-Worktree erneut laufen lassen; `git status` war danach leer, das Ergebnis ist also bestätigt. Es wurde keine Datei geändert.
- **Vom Aufrufer gemeldet, JSON-LD und Tests:** Das JSON-LD lässt sich mit `json.loads` parsen. Kein Test im Repo liest `marketing/`.
- **Darstellung in sozialen Netzwerken:** Ob LinkedIn und andere WebP als `og:image` heute anzeigen, war nicht prüfbar, die Quellen der Websuche widersprechen sich. Ein Test mit den Debug-Tools der Plattformen ist erst nach dem Deploy möglich.
- **Validatoren:** Google Rich Results Test und Facebook Sharing Debugger wurden nicht ausgeführt, weil die Seite noch nicht live ist.
