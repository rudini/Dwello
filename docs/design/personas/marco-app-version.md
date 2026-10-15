# Marco – App-Version in der Fusszeile

Persona: Marco, 38, Smartphone (390 × 844, Touch, kein Zoom). Nur angeschaut, nichts gespeichert.
Aufgabe: Fusszeile mit «© 2026 Dwello · Version …» auf Anmeldeseite, Dashboard und einer Detailseite prüfen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/cfe2a79f-c26e-50c3-9ca4-bd60a2e3192b/scratchpad/marco-app-version/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | alle (Fusszeile) | «Version unbekannt» klingt kurz nach «da stimmt etwas nicht»; man erfährt nicht, dass das harmlos ist. |
| P-2 | Nit | alle (Fusszeile) | Nach «Version 0.4.0+3-gabc1234» bleiben auf 390 px nur noch rund 30 px Platz in der Zeile; eine etwas längere Entwicklungsversion würde umbrechen (heute nicht sichtbar, nur simuliert). |

## Beobachtungen

- Die Anmeldeseite zeigt «Dwello» über «Anmelden» klein in Blau; mit dem Haus-Bild darüber wirkt die Karte aufgeräumt.
- Die Fusszeile steht auf dem Dashboard erst ganz unten nach langem Scrollen (Seite rund 2850 px hoch); das betrifft nicht die Version selbst.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 4 Seitenaufrufe (Dashboard, Gebäude-Liste, Gebäude «Alpenblick», Anmeldeseite ohne Anmeldung), jeweils bis ans Seitenende gescrollt.

## Ablauf

1. **Dashboard** (`/dashboard`). Erwartet: unten eine Zeile mit Copyright und Version, nicht auffällig. Gesehen: «© 2026 Dwello · Version unbekannt» in einer Zeile, darunter die Links «Datenschutz» und «Nutzungsbedingungen». Schrift 16 px, dunkelgrau auf hellem Grund, gut lesbar. Seite genau 390 px breit, kein seitliches Scrollen. Der Screenreader-Baum liest die Zeile als ein Absatz innerhalb der Fusszeile (contentinfo): «© 2026 Dwello · Version unbekannt».
2. **Detailseite Gebäude «Alpenblick»** (über Gebäude-Liste angetippt). Erwartet: dieselbe Fusszeile. Gesehen: identisch, eine Zeile, kein Umbruch, Breite 390 px.
3. **Anmeldeseite** (`/login`, ohne Anmeldung). Erwartet: Version auch hier. Gesehen: Fusszeile am unteren Bildschirmrand, durch eine Linie abgetrennt, «© 2026 Dwello · Version unbekannt», darunter die zwei Links. Passt ohne Scrollen auf den Bildschirm (Seite 844 px hoch), nichts überlappt die Anmeldekarte.
4. **Simulation längster Text** (nur Text im Browser ausgetauscht, nicht gebaut): «© 2026 Dwello · Version 0.4.0+3-gabc1234» passt noch in eine Zeile (Version endet bei etwa 345 px von 390), kein seitliches Scrollen. Siehe Screenshot `04-sim-dev-footer.png`.

## Verwirrung

- «Version unbekannt»: Ich verstehe, dass es um die Programmversion geht, weil es neben dem Copyright steht. Aber «unbekannt» lässt mich kurz stutzen: Ist meine App kaputt oder veraltet? Für mich als Vermieter ist die Version eigentlich egal; ich würde sie nur brauchen, wenn ich dem Support einen Fehler melde.
- «0.4.0+3-gabc1234» (simuliert) sagt mir als Laie nichts, stört aber nicht, weil es klein und unauffällig ist.

## Fehlerrisiken

- Gering. Die Zeile ist nicht antippbar und liegt nicht in der Nähe einer Aktion. Einziges Risiko: Ein Nutzer meldet «Version unbekannt» als Fehler beim Support.

## Vorschläge

- **P-1** – Reproduktion: Auf dem Handy eine beliebige Seite öffnen, ganz nach unten scrollen; dort steht «Version unbekannt». Hilfreich wäre ein neutralerer Text, der nicht nach Störung klingt, z. B. «Version: Entwicklungsstand» oder die Zeile ganz weglassen, wenn keine Version bekannt ist. Da Endnutzer einen veröffentlichten Build mit Versionsnummer sehen, ist das nur ein Nit.
- **P-2** – Reproduktion: Build mit langer Entwicklungsversion (z. B. «Version 0.12.0+123-gabcdef1») auf 390 px öffnen, Fusszeile ansehen. Hilfreich: sicherstellen, dass beim Umbruch die ganze Versionsangabe zusammen auf die nächste Zeile springt (nicht mitten in «0.4.0+3-…» getrennt) und weiterhin nichts seitlich scrollt.

## Nicht geprüft

- Echter Release- oder Entwicklungs-Build mit Versionsnummer: in diesem Build gibt es keinen Versions-Tag; der lange Text wurde nur im Browser simuliert.
- Andere Sprachen (fr/it/en) der Fusszeile: nicht Teil der Aufgabe.
- Dunkelmodus und Querformat: nicht Teil von Marcos Profil in dieser Aufgabe.
