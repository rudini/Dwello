# Code-Review Runde 2 (Abschlussrunde), Slice «landing», Delta 8d029a3..55f6bb9

## Status der offenen IDs aus Runde 1

| ID | Status |
|---|---|
| C-1 | Vom Aufrufer abgelehnt, weil der PO entschieden hat, das Repository später freizuschalten. Aus Code-Sicht bleibt: Bis dahin führen der Link auf die Anleitung und `git clone` auf eine 404, und `deploy-site.yml` veröffentlicht die Seite beim Merge. Ob die Freischaltung vor dem Merge kommt, entscheidet der PO. |
| C-2 | Behoben (marketing/index.html:921-926, ebenso in fr/it/en). Link-Klick, Klick ausserhalb, Escape mit Fokus zurück auf `summary` und Wegtabben schliessen das Menü. Keine Regression: Der Klick auf `summary` liegt in `menu` und wird vom Aussen-Handler übergangen. Tabben im Menü hat ein `relatedTarget` innerhalb von `menu`. Ein Klick auf eine nicht fokussierbare Stelle liefert `relatedTarget === null` und schliesst nichts. `.menu` existiert auf jeder Seite, `querySelector` liefert also nie `null`. |
| C-3 | Behoben (Hero, Titel und Text «Installieren», FAQ; fr/it/en sinngemäss). |
| C-4 | Behoben (docs/installation.md:39). |
| C-5 | Teilweise behoben, siehe C-10. |
| C-6 | Behoben. |
| C-7 | Behoben. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Major | marketing/index.html:478; marketing/i18n/fr.json, it.json, en.json (Schlüssel «Für das ganze Gebäude auf einmal, … Die bezahlten Akontozahlungen zieht Dwello ab.») | Der Satz sagt das Gegenteil der Fachregel: Dwello zieht das **vereinbarte** Akonto ab, nicht das bezahlte. Der Begriff «Akontozahlungen» steht ausserdem nicht in `UBIQUITOUS_LANGUAGE.md`. Die Übersetzungen übernehmen den Fehler: «acomptes payés», «acconti pagati», «advance payments made». |
| C-9 | Minor | marketing/i18n/fr.json:329, en.json:325 | «Belege» heisst neu «justificatifs» bzw. «receipts». Nach `docs/design/i18n-begriffe.md:44` heisst es «pièce justificative»; die Seite selbst sagt sonst «pièces justificatives» (fr.json:106) bzw. «invoices» (en.json:105, :167). Die alte fr-Übersetzung dieses Satzes hielt sich an das Glossar. |
| C-10 | Minor | docs/installation.md:62 | Die neue Wiederherstellung `docker exec -i … psql … < dwello-backup.sql` scheitert in PowerShell, dem Standard-Terminal unter Windows: Dort ist `<` reserviert und ergibt einen ParserError. Die Anleitung nennt Windows ausdrücklich als Ziel (Zeile 7). Hinzu kommt, dass `>` in Windows PowerShell 5.1 die Sicherung als UTF-16 schreibt, und die liest `psql` nicht. Abhilfe: einen Hinweis auf Git Bash oder WSL geben, oder Varianten mit `docker cp` bzw. `pg_dump -f` innerhalb des Containers angeben. |

## C-8 Falsche Fachaussage zum Akonto (Major)

Warum falsch: `UBIQUITOUS_LANGUAGE.md:177` (Akontobeiträge) sagt: «Dwello zieht das vereinbarte Akonto ab, nicht das bezahlte; fehlende Zahlungen regelt der Vermieter ausserhalb der Abrechnung.» Auch das Schema zeigt das. Es kennt nur das vereinbarte Akonto mit Gültigkeit (`monthly_advance_payment`, `contract_advance_payments`, backend/src/db/schema.ts:131, :166) und keine erfassten Akontozahlungen. Eine Vermieterin, die der Seite glaubt, nimmt an, dass Dwello ausgebliebene Akontozahlungen berücksichtigt. Dann fordert sie diese nicht separat ein und verliert das Geld. Zielgruppe A sind Laien, die solche Aussagen wörtlich nehmen. Die Seite wird beim Merge sofort veröffentlicht.

So zeigt man es: Man vergleicht den Satz mit UL:177. In der Demo erfasst man für einen Mietvertrag ein Akonto, bucht keine Zahlung und erstellt die Abrechnung. Die Akontobeiträge enthalten dann trotzdem den vollen vereinbarten Betrag.

Lösung: z. B. «Das vereinbarte Akonto zieht Dwello ab.» (fr «Dwello déduit les acomptes convenus.», it «… gli acconti pattuiti», en «… the agreed advance payments»). Da es eine Fachaussage ist, prüft `fach-reviewer` den neuen Satz.

## Nicht bestätigt

- `python3 marketing/i18n/build.py` ist sauber: vom Aufrufer gemeldet, nicht erneut ausgeführt, weil der Build Dateien schreibt. Dass der Menü-Code in den generierten Seiten fr/it/en steht, habe ich per grep bestätigt.
- Die Menü-Prüfung mit Playwright auf 390 px in de und it, auch gegen die alte Seite: vom Aufrufer gemeldet. Ich habe keinen Browser gestartet und das Verhalten nur aus dem Code abgeleitet (siehe C-2). Ungeprüft bleibt das Verhalten in Safari/iOS (Links erhalten beim Klick keinen Fokus). Nach dem Code ist es unkritisch, weil der Klick-Handler schliesst.
- Ob «bis 50» bzw. «jusqu’à 50» / «fino a 50» als grosse Kennzahl in `.stats` auf 390 px ohne Umbruch oder Überlauf passt: nicht im Browser geprüft.
- Ob `psql` mit einer `--clean`-Sicherung bei laufendem Backend sauber durchläuft (Sperren durch offene Verbindungen): nicht ausgeführt.

Geprüft: das ganze Delta in marketing/index.html, docs/installation.md und i18n/{fr,it,en}.json. Die anderen Übersetzungen stimmen mit `i18n-begriffe.md` überein, darunter Akonto/acompte/acconto, vereinbarte Nebenkosten und VMWG/OBLF/OLAL. Die neuen aria-labels sind übersetzt. Der Schlüssel «Der ganze Quellcode …» ist inhaltlich unverändert, nur das Komma hat sich verschoben.
