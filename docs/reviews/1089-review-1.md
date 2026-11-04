# Code-Review #1089, Runde 1 (ad5e43f34)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/screenplay/questions.ts:215 | `CutInChoice` rechnet mit `clientWidth - paddingLeft - paddingRight` als Platz für den Text. Der Select hat das native Aussehen (kein `appearance: none` in `src/lib/ui/field.ts:3` oder `src/styles/globals.css`). Der Pfeil des Browsers liegt aber innerhalb der Inhaltsbox, deshalb ist der Platz um die Breite des Pfeils (rund 20 px) zu gross gerechnet. Ein Name, der um weniger als den Pfeil abgeschnitten wird, ergibt trotzdem 0. Heute passt der Text, also schlägt das Szenario nicht falsch fehl. Es würde aber eine neue, knappe Kürzung nicht bemerken. |
| C-2 | Minor | tests/e2e/screenplay/questions.ts:213 | `pen.font = style.font`: Liefert der Browser für die Kurzform `font` einen leeren oder ungültigen Wert, verwirft das Canvas die Zuweisung ohne Fehler und misst mit `10px sans-serif`. Dann kommt immer 0 heraus, und die Prüfung besteht, ohne etwas zu prüfen. Es fehlt eine Sicherung, etwa ein Vergleich von `pen.font` mit `style.fontSize`/`fontFamily` oder das Zusammensetzen aus den Einzelwerten. Das Szenario läuft auch in den Projekten `firefox` und `webkit` (`playwright.config.ts:278-291`, kein `@a11y`). Gemeldet ist nur Chromium. |

## Zur Frage des Aufrufers: kann ein anderes Profil oder «… - non selezionabile» abgeschnitten werden?

- Vordefinierte Profile auf Italienisch (`backend/migrations/0002_stammdaten.sql:60-90`): «Riscaldamento + acqua calda», «Riscaldamento Altipiano», «Riscaldamento Montagna», «Riscaldamento Ticino». Der vorgewählte Name ist der längste. `profileLabel` (`src/lib/heating-profile.ts:44`) lässt «(100%)» ausserhalb des Deutschen weg. Das Szenario misst damit den ungünstigsten vordefinierten Fall, kein anderes vordefiniertes Profil ist länger.
- Optionen mit «- non selezionabile» sind `disabled` (`SettingsStep.svelte:68`). Man kann sie nicht wählen, also erscheinen sie nie im geschlossenen Select. Eine Ausnahme ist denkbar: Ist kein Profil vollständig, bleibt `heatingProfileId` leer, und der Browser zeigt dann die erste Option an. Ebenso kann ein eigenes Profil mit langem Namen abgeschnitten werden. Ein Select kürzt seinen Text, statt umzubrechen. Beides liegt ausserhalb dessen, was #1089 verlangt, und ist kein Befund dieses Diffs.

## Nicht bestätigt

- Lint, check und Chromium-E2E von statement-send, statement-generate und statement-detail (243 bestanden): vom Aufrufer gemeldet.
- Rot vor der Änderung im Verlauf-Szenario (ein Datum auf 2 Zeilen, Kanten 2 px auseinander): vom Aufrufer gemeldet. Nach dem Lesen plausibel: Das `dt` mit der langen, nicht trennbaren Adresse `<id>@dwello.test` hatte `min-width: auto` und drückte so das `dd` zusammen. Laufen lassen habe ich es nicht.
- Italienisch-Szenario als Pin: Der Commit-Text sagt das (Workflow 2). Die Basis zeigt den Namen ganz, weil `profileLabel` «(100%)» auf it weglässt. Der Aufrufer nennt den angezeigten Text «Riscaldamento + acqua calda (100%)». Das widerspricht `src/lib/heating-profile.ts:44`, wonach auf Italienisch nur «Riscaldamento + acqua calda» erscheint. Am Ergebnis ändert das nichts, gemessen wird der Text, der wirklich angezeigt wird.
- Ob Firefox und WebKit für `getComputedStyle(select).font` eine nicht leere Kurzform liefern (zu C-2): nicht ausgeführt, kein Browser im Worktree.
- Dass Tailwind 4.3 `wrap-anywhere` als `overflow-wrap: anywhere` erzeugt: nach Versionsangabe (`package.json:77`) angenommen, CSS nicht gebaut.

Geprüft: Diff aller 8 Dateien. Screenplay-Schichten: Steps rufen nur Fragen auf, Fragen liefern Werte (Pixel, Zeilen). Formulierung der Features ohne UI-Wörter. Keine neuen Texte, Zustände oder Bildschirme (messages und a11y nicht betroffen). Keine bestehende Prüfung gelockert. Keine Kopie eines bestehenden Helpers in `questions.ts`. Nichts ohne Bezug zur Anforderung. Der Verlauf hängt an denselben Seitendaten wie der Status «Versendet», die Abfrage pollt (`actor.ts:48`). Die Klassenänderung zeigt sich nur im Layout, E2E ist darum die tiefste Schicht, die sie zeigen kann.
