# Marco – #470, Runde 2: Hinweis «Ohne vereinbarte Verwaltungspauschale» vor «Weiter»

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 mit frischen Demodaten. Nichts gespeichert, ich bin nur bis Schritt 3 gegangen. Geprüft habe ich nur die Bildschirme von P-1 aus Runde 1 (`marco-470.md`).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/marco-470-2/` (`swipe.mjs`, `normal-s3-*.png`, `slow-s3-*.png`).
Zwei Durchgänge: einmal mit normaler Verbindung, einmal mit langsamer, nachgestellt mit 4 s Verzögerung auf `/api/statements/billed` und `/api/statements/agreements` (`page.route`, nur verzögert, kein Fehler). In beiden habe ich in Schritt 3 von oben etwa alle 0,8 s um je rund 500 px nach unten gewischt, bis «Weiter» ganz im Bild war.

**Status P-1 (Runde 1, Major): geschlossen.**

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – (geschlossen) | Abrechnungen erstellen, Schritt 3 «Heizprofil und Verwaltungspauschale» | Über «Weiter» steht jetzt fett «Lesen Sie die Hinweise unten, bevor Sie weitergehen.». Der Kasten «Ohne vereinbarte Verwaltungspauschale» steht direkt unter «Zurück», und seine Überschrift ist im selben Bild wie «Weiter» zu sehen. Ich merke vor dem Tippen, dass noch etwas kommt. |
| P-3 | Nit | Abrechnungen erstellen, Schritt 3 | Der Satz über «Weiter» sagt nur «die Hinweise unten», nicht worum es geht. In Eile könnte ich ihn als Floskel überlesen. Ausserdem steht dort «Hinweise» in der Mehrzahl, obwohl es nur einen Hinweis gibt. |

## Beobachtungen

- **Kein Springen von «Weiter»:** Mit langsamer Verbindung war der Knopf beim 1. bis 3. Wischen gesperrt («Bitte warten …»), danach entsperrt. Auf der Seite stand er die ganze Zeit an derselben Stelle (y = 2558 auf der Seite, gesperrt wie entsperrt). Danach habe ich 6 s lang alle 0,2 s nachgemessen: Er blieb bei y = 558 im Bild. Die Seite wird beim Entsperren länger (2863 → 3151 px), aber nur unterhalb von «Zurück», wo der Kasten dazukommt. Bei normaler Verbindung war Schritt 3 schon fertig, als ich unten ankam. Auch dort blieb der Knopf stehen.
- **Erstes Bild von Schritt 3 bei langsamer Verbindung:** Oben steht «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …» (wie in Runde 1).
- **Ansicht, in der ich «Weiter» zum ersten Mal sehe** (`normal-s3-settled.png`, beim langsamen Durchgang gleich): Eingabefeld Verwaltungspauschale «3». Darunter fett «Lesen Sie die Hinweise unten, bevor Sie weitergehen.», dann «Noch nicht gespeichert: … Stand: 08:27», eine Trennlinie, «Weiter» (blau), «← Zurück» und unten angeschnitten der blaue Kasten mit dem Info-Symbol, «Ohne vereinbarte Verwaltungspauschale» und dem Anfang von «Bei diesen Mietverträgen ist keine Verwaltungspauschale vereinbart …». Den Namen «Kevin Fischer, Wohnung OG1» sehe ich erst nach einem weiteren Wischen.
- Auch beim langsamen Durchgang war «Weiter» schon entsperrt, als er ins Bild kam (nach etwa 4 s). Darum habe ich nie gesehen, dass der Satz über «Weiter» leer oder mit gesperrtem Knopf dasteht, während unten noch nichts ist.
- Reihenfolge jetzt «Weiter» über «Zurück» (in Runde 1 auch so). Für den Daumen ist das gut.

## Aufgabe geschafft: teilweise

Ob ich den Hinweis vor «Weiter» bemerke: ja, geprüft, P-1 ist geschlossen. Dass «Weiter» nicht springt: ja, geprüft. Ob der Satz über «Weiter» während des Ladens leer oder verwirrend dasteht und ob er bei einem Gebäude ohne Hinweis gar nicht erscheint: nicht fertig geprüft. Die App auf :3300 war nach den ersten zwei Durchgängen nicht mehr erreichbar (ERR_CONNECTION_REFUSED, über 10 Minuten lang). Ich habe sie nicht neu gestartet.

## Aufwand

Etwa 15 Minuten. Pro Durchgang: 1 × «Weiter» (Schritt 1), 1 Häkchen (Alpenblick), 1 × «Weiter» (Schritt 2), dann 4 Wischbewegungen bis «Weiter» in Schritt 3. Zwei vollständige Durchgänge (normal, langsam), ein dritter Durchgang (gesperrter Zustand mit Screenshot, dazu Seepark Residenz allein) brach ab, weil die App weg war.

## Ablauf

1. **Schritt 1:** Erwartet war 2025. Gesehen: 1. Januar 2025 bis 31. Dezember 2025 vorbelegt. «Weiter».
2. **Schritt 2:** Nur Alpenblick angehakt, gewartet, bis «Weiter» bereit war, «Weiter».
3. **Schritt 3, erstes Bild:** Erwartet: Überschrift und Heizprofil. Gesehen: «Schritt 3 von 5: Heizprofil und Verwaltungspauschale», bei langsamer Verbindung darunter «Dwello prüft, ob die Mietverträge …», dann Heizprofil mit langem Text.
4. **Wischen 1–3:** Heizprofile, Monatsbalken, dann «Verwaltungspauschale in %» mit Erklärtext und Feld «3» (`normal-s3-3.png`). Bei langsamer Verbindung ist «Weiter» noch gesperrt und unter dem Bildrand.
5. **Wischen 4:** Erwartet hatte ich nach Runde 1, dass unter «Weiter» nur noch «Zurück» und die Fusszeile kommen und ich ohne Warnung weitertippe. Gesehen: Der fette Satz «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht im Bild, unten ragt die Überschrift des blauen Kastens «Ohne vereinbarte Verwaltungspauschale» herein. Ich hätte hier nochmals gewischt, bevor ich tippe, und dann «Kevin Fischer, Wohnung OG1» gelesen.
6. **Stehen bleiben und beobachten (6 s):** «Weiter» bleibt bei y = 558, nichts verschiebt sich, auch nicht im Moment, in dem das Laden endet.
7. **Gesperrten Zustand gezielt ansehen (dritter Durchgang):** abgebrochen, die App antwortete nicht mehr.

## Verwirrung

- «Lesen Sie die Hinweise unten» klingt wie ein Standardsatz. Erst der angeschnittene blaue Kasten darunter hat mir gezeigt, dass da wirklich etwas für mich steht. Ein Satz mit Inhalt, etwa «1 Mietvertrag ohne Verwaltungspauschale: siehe unten», würde mich sicherer stoppen.
- «Hinweise» (Mehrzahl) bei nur einem Kasten: Ich habe kurz einen zweiten gesucht.

## Fehlerrisiken

- Wer schnell tippt, kann den Satz noch überlesen. Dann wird Kevin Fischer ohne Pauschale abgerechnet. Das Risiko ist aber viel kleiner als in Runde 1, weil Satz und Kastenanfang jetzt im selben Bild wie «Weiter» stehen.
- Die Vorschau (Schritt 4) habe ich in dieser Runde nicht angesehen. In Runde 1 hat sie Kevin Fischer nicht noch einmal genannt.

## Vorschläge

- **P-3:** Abrechnungen erstellen, 2025, Weiter, nur Alpenblick, Weiter, in Schritt 3 bis «Weiter» wischen. Über dem Knopf steht «Lesen Sie die Hinweise unten, bevor Sie weitergehen.». Hilfreich wäre, wenn der Satz das Thema nennt («1 Mietvertrag ohne vereinbarte Verwaltungspauschale, siehe unten») oder bei einem einzigen Hinweis die Einzahl verwendet («den Hinweis unten»).

## Nicht geprüft

- **Satz über «Weiter» während des Ladens:** Beim langsamen Durchgang war der Knopf schon entsperrt, als er ins Bild kam. Ob der Platz über dem gesperrten Knopf leer ist, einen Wartetext zeigt oder schon den Satz «Lesen Sie die Hinweise unten …» zeigt, obwohl unten noch nichts steht, habe ich nicht gesehen. Gemessen habe ich nur: Der Knopf steht gesperrt und entsperrt an derselben Stelle, also ist der Platz während des Ladens reserviert. Was darin steht, weiss ich nicht. Der gezielte Durchgang dafür (`locked.mjs`) brach ab, weil :3300 nicht mehr antwortete.
- **Gebäude ohne Hinweis** (z. B. nur Seepark Residenz): Ob der Satz über «Weiter» dann wegfällt oder ins Leere zeigt, ist nicht geprüft. Grund wie oben.
- Fehlschlag von `/api/statements/agreements`, Schritt 4 und 5, Speichern: nicht Teil dieser Runde.
- Echtes iPhone/Safari: nur Chromium mit Touch-Emulation.
