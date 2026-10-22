# Sven – #459 Slice A: Dokumente eines ehemaligen Mieters prüfen

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt über den Accessibility-Tree (Playwright `ariaSnapshot`, Chromium-AX-Baum über CDP) und den Fokus nach jedem Tastendruck. Persona-App http://localhost:3300, Demodaten, 22.10.2026, 10:16–10:21 UTC.

Gespeichert habe ich einmal: «Als geprüft markieren» bei Sarah Meier (wie vom Auftrag verlangt).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Sarah Meier, nach dem Speichern | Der Fokus landet auf dem ganzen Hinweis (generisches `div`, `tabindex=-1`, ohne Rolle). Der Screenreader liest ca. 400 Zeichen Hinweistext noch einmal vor; die eigentliche Bestätigung «Geprüft am 22.10.2026» kommt erst ganz am Schluss. Keine Live-Meldung (die `status`-Region bleibt leer). |
| P-2 | Minor | Mieter Sarah Meier, vor dem Speichern | Mit Tab springe ich vom Link «Mietvertrag Wohnung A2» direkt auf den Knopf «Als geprüft markieren». Der Knopf hat keine Beschreibung (`aria-describedby` fehlt); was geprüft wird, höre ich nur, wenn ich vorher im Lesemodus den Hinweis gelesen habe. |
| P-3 | Minor | Mieter Sarah Meier | Der Titel «Hochgeladene Dokumente prüfen» ist nur ein fett gesetzter Absatz, keine Überschrift und keine Region. Mit H oder der Landmarkenliste finde ich ihn nicht; dass es ein Hinweis bzw. eine Warnung ist, zeigen nur Farbe und ein `aria-hidden`-Symbol. |
| P-4 | Nit | Mieter Sarah Meier, nach dem Speichern | Der Titel bleibt nach dem Speichern «Hochgeladene Dokumente prüfen» (Aufforderung), direkt gefolgt von «Geprüft am 22.10.2026». Vorgelesen klingt das widersprüchlich. Visuell wechselt nur die Farbe (Warnung zu Info). |
| P-5 | Nit | Übersicht | Der Link der Aufgabe heisst nur «Dokumente ansehen». In der Linkliste des Screenreaders steht er ohne Mieternamen (neben «Entwürfe ansehen»); den Bezug liefert nur die Überschrift im selben Listeneintrag. |

## Beobachtungen

- Nach dem Folgen des Links landet der Fokus auf `body` (normaler Seitenwechsel), angesagt wird «Sarah Meier - Dwello» über die Seitenwechsel-Meldung (`aria-live=assertive`). Der Link führt an den Seitenanfang, nicht zum Hinweis; mit H finde ich «Dokumente» (h2), der Hinweis folgt direkt darunter. Das reicht.
- Die Aufgabe auf der Übersicht ist gut vorlesbar: h3 «Dokumente von Sarah Meier prüfen», Text mit Datum und Anzahl, dann der Link. Reihenfolge stimmt.
- Hinweistext auf der Mieterseite, in dieser Reihenfolge: «Hochgeladene Dokumente prüfen» – «Der letzte Mietvertrag von Sarah Meier endete am 30.06.2025. Vor diesem Tag haben Sie hochgeladen: Ausweiskopie Sarah Meier. Löschen Sie, …» – «Dokumente, die Sie am Tag des Vertragsendes oder danach hochgeladen haben, … nennt Dwello hier nicht.» – Knopf «Als geprüft markieren» – danach Liste «Dokumente» mit «Ausweiskopie Sarah Meier, Hochgeladen am 20.07.2021», «Datei herunterladen: Ausweiskopie Sarah Meier», «Löschen: Ausweiskopie Sarah Meier». Die Knöpfe in der Liste haben gute Namen mit dem Dokumenttitel.
- Speichern ist ein normales Formular (`POST ?/checkDocuments`), kein Bestätigungsdialog, kein Seitenwechsel; die URL bleibt.
- Nach dem Speichern ist der Knopf weg, an seiner Stelle steht der Absatz «Geprüft am 22.10.2026». Das nächste Tab vom fokussierten Hinweis aus geht zu «Datei herunterladen: Ausweiskopie Sarah Meier» – sinnvoll.
- Die Dateiauswahl im Upload-Teil meldet sich im Tab-Fokus ohne `innerText`, im AX-Baum heisst sie «Datei Datei auswählen» (doppeltes «Datei»). Gehört nicht zu dieser Änderung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten Bedienung (ohne die verlangte Wartezeit von 3 Minuten). Übersicht: 21 × Tab bis zum Link, Enter. Mieterseite: 25 × Tab bis zum Knopf, Enter. Danach Übersicht neu geladen. Ohne Lesemodus-Sprünge (H) also 46 Tabs; mit H deutlich weniger.

## Ablauf

1. **Übersicht öffnen.** Erwartet: Aufgabe zu Sarah Meier unter «Als Nächstes zu tun». Gesehen: Region «Als Nächstes zu tun», dritter Eintrag h3 «Dokumente von Sarah Meier prüfen» mit Text «Der letzte Mietvertrag endete am 30.06.2025. 1 hochgeladenes Dokument stammt aus der Zeit davor. …» und Link «Dokumente ansehen». Screenshot `01-uebersicht.png`: Aufgabe als dritte Karte.
2. **Mit Tab zum Link.** Erwartet: nach Sprunglink, Kopf und Navigation die Aufgabenlinks. Gesehen: Tab 18–21 sind die Aufgabenlinks, Tab 21 «Dokumente ansehen». Reihenfolge logisch.
3. **Enter.** Erwartet: Mieterseite Sarah Meier. Gesehen: `/tenants/a0000001-…-000000000006`, Titel «Sarah Meier - Dwello», angesagt über die Live-Region; Fokus auf `body`.
4. **Hinweis lesen (nach 3 Minuten Wartezeit).** Erwartet: ein klar erkennbarer Hinweis mit Name, Datum und Dokument. Gesehen: Inhalt vollständig und verständlich, aber ohne Überschrift oder Rolle (P-3). Screenshot `02-mieter-vorher.png`: Hinweis mit gelblicher Warnfarbe unter «Dokumente», Knopf darin.
5. **Mit Tab zum Knopf.** Erwartet: Knopf mit Kontext. Gesehen: Tab 25 «Als geprüft markieren», ohne Beschreibung (P-2).
6. **Enter auf dem Knopf.** Erwartet: Bestätigung wird angesagt, Fokus bleibt sinnvoll. Gesehen: Nach 300 ms liegt der Fokus auf dem Hinweis-`div` (`data-testid=tenant-former-documents`, `tabindex=-1`), AX-Name ist der ganze Hinweistext mit «Geprüft am 22.10.2026» am Ende (P-1). Keine Änderung in einer Live-Region (MutationObserver leer). Screenshot `03-mieter-nachher.png`: Hinweis jetzt blau (Info), Knopf weg, «Geprüft am 22.10.2026» darunter.
7. **Übersicht prüfen.** Erwartet: Aufgabe weg. Gesehen: «Als Nächstes zu tun» enthält nur noch «Nebenkostenabrechnungen erstellen» und «Abrechnungen prüfen und versenden»; «Sarah Meier» kommt auf der Übersicht nicht mehr vor. Screenshot `04-uebersicht-nachher.png`.

## Verwirrung

- «Hochgeladene Dokumente prüfen» als Titel bleibt nach dem Prüfen stehen (P-4); ich habe kurz gezweifelt, ob das Speichern geklappt hat, bis ganz am Ende «Geprüft am» kam.
- «Als geprüft markieren» allein: Was wird markiert – der Mieter, das Dokument, der Vertrag? Erst im Zusammenhang klar (P-2).
- Der Satz «Dokumente, die Sie am Tag des Vertragsendes oder danach hochgeladen haben, … nennt Dwello hier nicht» ist lang, aber verständlich.

## Fehlerrisiken

- Wer nur mit Tab arbeitet, kann «Als geprüft markieren» drücken, ohne den Hinweis gelesen zu haben (P-2). Keine Bestätigung, aber auch nicht gefährlich: es löscht nichts.
- Nach dem Speichern hört ein Screenreader-Nutzer, der das Vorlesen abbricht (üblich bei langem Text), die Bestätigung nicht (P-1).

## Vorschläge

- **P-1:** Übersicht → Tab bis «Dokumente ansehen» → Enter → Tab bis «Als geprüft markieren» → Enter; Fokus und AX-Name prüfen. Hilfreich: Fokus auf den neuen Absatz «Geprüft am 22.10.2026» setzen (oder auf eine Überschrift des Hinweises), bzw. «Geprüft am …» zusätzlich über die `status`-Region ansagen.
- **P-2:** Mieterseite Sarah Meier, Tab bis zum Knopf. Hilfreich: `aria-describedby` auf den Hinweistext, oder ein Knopfname mit Bezug, z. B. «Dokumente von Sarah Meier als geprüft markieren».
- **P-3:** Mieterseite, Überschriftenliste/H-Taste. Hilfreich: Titel als Überschrift (h3 unter «Dokumente») und/oder der Hinweis als `role="note"`/Region mit Namen.
- **P-4:** Nach dem Speichern Titel ändern, z. B. «Hochgeladene Dokumente geprüft», oder den Titel nach dem Prüfen weglassen.
- **P-5:** Übersicht, Linkliste des Screenreaders. Hilfreich: «Dokumente von Sarah Meier ansehen» als Linkname (sichtbar oder per Beschreibung).

## Nicht geprüft

- Echte Screenreader (NVDA, JAWS, VoiceOver): beurteilt habe ich den Chromium-AX-Baum; wie viel ein Screenreader beim Fokus auf ein generisches `div` tatsächlich vorliest, hängt vom Screenreader ab.
- Fehlerfall beim Speichern (z. B. 500 auf `?/checkDocuments`): nicht verlangt, nicht ausprobiert.
- Löschen der Ausweiskopie: nicht Teil der Aufgabe, nicht ausgeführt.
- Andere Sprachen und Mobile: nicht Teil meines Profils.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/sven-459A/`.
