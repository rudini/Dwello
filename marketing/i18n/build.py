"""Builds marketing/{fr,it,en}/<page> from the German pages in marketing/ (PAGES).

Each i18n/<lang>.json maps a German text (a whole text node or attribute value) to its translation;
keys prefixed "js:" replace a string in the page script, "code:" a fragment inside the terminal blocks.
The build fails when a key is found on no page, and lists German text left in the result.

Run: python3 marketing/i18n/build.py
"""
import json
import re
import sys
from html import escape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = {"fr": "fr-CH", "it": "it-CH", "en": "en"}
PAGES = ["index.html", "impressum.html", "datenschutz.html"]
# Texts that stay the same in every language (names, numbers, technical terms)
SAME = {"Dwello", "DE", "FR", "IT", "EN", "CHF 0.–", "48 px", "390 px", "7 : 1", "CHF 215.80", "AGPL-3.0", "Open Source",
        "GitHub", "dwello.next_steps", "dwello.deadlines", "(days: 14)", "Installation", "Community", "Mobile first",
        "Terminal · Windows, macOS, Linux", "SSH · Synology, Unraid, Mini-PC", "Linux-Server · Infomaniak, Exoscale, Hetzner",
        "Homeserver / NAS", "Roadmap", "Demo", "MCP-Server", "AGPL-3.0-or-later", "Deutsch", "Français", "Italiano", "English"}
# German words that must not survive a translation
GERMAN = re.compile(r"\b(und|oder|nicht|Sie|Ihre?n?|Wohnung\w*|Gebäude|Rechnung\w*|Abrechnung\w*|Mieter\w*|für|mit|auf|der|die|das|ist|wird)\b")


def texts(html):
    found = []

    class P(HTMLParser):
        skip = 0

        def handle_starttag(self, tag, attrs):
            if tag in ("style", "script", "pre", "code", "symbol"):
                self.skip += 1
            found.extend(v for k, v in attrs if k in ("alt", "aria-label", "content", "title") and v)

        def handle_endtag(self, tag):
            if tag in ("style", "script", "pre", "code", "symbol"):
                self.skip -= 1

        def handle_data(self, data):
            if not self.skip and data.strip():
                found.append(data.strip())

    P().feed(html)
    return found


def build(lang, tag, name, page, table, used):
    for german, text in sorted(table.items(), key=lambda kv: -len(kv[0])):
        if german.startswith(("js:", "code:")):
            src = german.split(":", 1)[1]
            if src not in page:
                continue
            used.add(german)
            page = page.replace(src, text if german.startswith("js:") else escape(text, quote=False))
            continue
        node = re.compile(r"(>\s*)" + re.escape(escape(german, quote=False)) + r"(\s*<)")
        attr = re.compile(r'(=")' + re.escape(escape(german)) + r'(")')
        page, n1 = node.subn(lambda m: m.group(1) + escape(text, quote=False) + m.group(2), page)
        page, n2 = attr.subn(lambda m: m.group(1) + escape(text) + m.group(2), page)
        if n1 + n2:
            used.add(german)
    page = page.replace('<html lang="de-CH">', f'<html lang="{tag}">')
    # paths: the page lives one folder down; screenshots per language
    page = re.sub(r'(src|href)="shots/', rf'\1="../shots/{lang}/', page)
    page = re.sub(r'(src|href)="(assets|fonts)/', r'\1="../\2/', page)
    page = page.replace('url("fonts/', 'url("../fonts/').replace('href="brand.html"', 'href="../brand.html"')
    # links between the language versions: the German pages one folder up, the others beside it
    page = re.sub(r'href="(fr|it|en)/([a-z]+\.html)"', r'href="../\1/\2"', page)
    page = re.sub(r'href="([a-z]+\.html)" hreflang="de"', r'href="../\1" hreflang="de"', page)
    page = re.sub(r'hreflang="de-CH" href="([a-z]+\.html)"', r'hreflang="de-CH" href="../\1"', page)
    # other links to a page: to the one in this language when it is built, else to the German one
    page = re.sub(r'href="([a-z]+\.html)"', lambda m: m.group(0) if m.group(1) in PAGES else f'href="../{m.group(1)}"', page)
    page = page.replace(f'href="../{lang}/', 'href="')
    page = page.replace(' aria-current="page"', "")
    page = re.sub(rf'(href="{name}" hreflang="{lang}" lang="{lang}")', r'\1 aria-current="page"', page)
    page = page.replace(f'<a href="{name}">', f'<a href="{name}" aria-current="page">') if name != "index.html" else page
    left = [t for t in texts(page) if t not in SAME and GERMAN.search(t)]
    for t in left:
        print(f"{lang}: German left? {t[:90]}")
    out = ROOT / lang / name
    out.parent.mkdir(exist_ok=True)
    out.write_text(page)
    print(f"{lang}: {out.relative_to(ROOT)}")


if __name__ == "__main__":
    for lang, tag in LANGS.items():
        table, used = json.loads((ROOT / "i18n" / f"{lang}.json").read_text()), set()
        for name in PAGES:
            build(lang, tag, name, (ROOT / name).read_text(), table, used)
        if set(table) - used:
            sys.exit(f"{lang}: found on no page: {sorted(set(table) - used)}")
