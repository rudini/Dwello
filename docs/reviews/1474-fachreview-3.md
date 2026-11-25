# Fachreview #1474, Runde 3 (Schritt 1, letzte Runde)

Gegenstand: Commit 0eb6eef (Worktree review-1474-fach3), Diff 8e6578b..0eb6eef (Prompt-Zeile `heatingMaterial`, Parser, Eval-Bild `salz-lieferdatum.png`, `@wip`-Szenario in `statement-detail.feature:808-822`), die geplante Regel in `getInvoicesForStatement` und der Glossar-Zusatz. Massstab ist der Entscheid vom 25.11.2026 (dritte Runde, V-5 Variante 1), wie der Aufrufer ihn wiedergibt.

Geschlossen: V-5 (Entscheid umgesetzt: Prompt auf Heizmaterial beschränkt, Gate `heatingMaterial`, Regel und Szenario geplant), V-6 (seit Runde 2)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-7 | Verwalter | Major | Der Glossar-Zusatz soll **vor** «Bei einem Gebäude ohne Tank gilt das nur …» stehen. Dann bezieht sich dieses «das» auf den neuen Satz statt auf die Regel für fehlende Bestände (#1470). Der neue Satz schliesst ein Gebäude ohne Tank aber gerade aus. Ausserdem widerspricht er dem «nur» im zweiten Satz der Zeile, und «Liefertag» und «nicht ohne Tank festgehalten» sind keine Begriffe des Glossars. Lösung: den Satz unten im Wortlaut **ans Ende** der Zeile setzen. |
| V-8 | Verwalter / Mietrecht | Minor | `sharesNoteDelivery` (`pdf-texts/de.ts:134` und fr/it/en:133) sagt «Für den Tank fehlt der Anfangs- oder der Endbestand». Gilt das neu auch für ein Gebäude ganz ohne Tankbestand, liest der Mieter daraus, einer der beiden Bestände sei erfasst. Nach Art. 8 Abs. 2 VMWG kann er über beide Auskunft verlangen. Lösung: Einen ersten Satz, der für beide Fälle stimmt, in allen vier Sprachen ersetzen (Tabelle «Wortlaut»), mit Test. Eine eigene Variante ist nicht nötig. `partDelivery` und `heatingNoteDelivery` bleiben unverändert. |
| V-9 | Verwalter | Minor | `UBIQUITOUS_LANGUAGE.md:104` «Brennstoff (Kategorie)» nennt eine Lieferung nur «in der Kategorie des Tankbestands eines Gebäudes». Ohne Verweis findet ein Leser die neue Regel dort nicht. Zeile 104 sagt allerdings nicht «nur», ist also nicht falsch. Der Entscheid nennt nur Zeile 163. Lösung: Den Verweis unten im Wortlaut ergänzen, wenn der Product Owner das in #1474 dazu nimmt. Sonst bleibt Zeile 104, wie sie ist. |

## V-7: Stellung und Wortlaut des Glossar-Zusatzes

**Beleg:** `UBIQUITOUS_LANGUAGE.md:163`:
- Satz 2: «Lieferungen sind **nur** die Rechnungen der Kategorie des Tankbestands …».
- Satz 4: «Fehlt der Anfangs- oder Endbestand, zählen die Lieferungen … (#1470).»
- Satz 5: «Bei einem Gebäude ohne Tank gilt **das** nur für eine Abrechnungsperiode, nach deren Tankbestand der Abrechnungslauf noch fragt; in den anderen ist keine Rechnung eine Lieferung.»

Steht der Zusatz zwischen Satz 4 und Satz 5, bezieht sich «das» auf den Zusatz. Für ein stillgelegtes Gebäude mit alten Beständen (#1470, Test «rechnet nach der Stilllegung des Tanks eine eintägige Rechnung mit ihrem Tag ab») fehlt dann die Regel. Der Code dazu (`fuel-stock.service.ts`, `periodReadings`: `rows[0].noTank && !covered ? null`) bleibt unverändert. Das Glossar würde also etwas anderes sagen als der Code.

**Begriffe:**
- Im Glossar heisst es «Lieferdatum» (Z. 163) und «Gebäude ohne Tank» (Z. 164). «Liefertag» und «ohne Tank festgehalten» stehen dort nicht.
- «noch keinen Tankbestand» passt nicht zum Code. `readings.length === 0` heisst: kein einziger Tankbestand, an keinem Stichtag. Ein späterer Stichtag macht die Periode `covered`, dann gilt die Regel von #1470.

**Nachgerechnet** (Szenario `statement-detail.feature:808 ff.`):
- Gebäude mit 2 Wohnungen: 900.00 / 2 = 450.00.
- Periode 01.01.–31.12.2025 hat 365 Tage. Mietbeginn 15.08.2025: 17 + 30 + 31 + 30 + 31 = 139 Mietstage.
- Anteil Mieterin: 450.00 × 139/365 = 171.3699 → **171.37**. Den Rest 450.00 × 226/365 = 278.63 trägt der Vermieter (Leerstand). Zusammen 450.00.
- Heute: 1/1 Tage = 450.00. Damit trüge die Mieterin des Liefertags die ganze Lieferung.
- Randfall Liefertag 2026: nicht in der Periode 2025, keine Position.
- Randfall `no_tank` true ohne Tankbestand: wie heute, nur der Tag (Satz 5).

Das Szenario prüft die Regel richtig.

**Lösung:** Den Satz unten in der Tabelle «Wortlaut» als **letzten** Satz an Zeile 163 anhängen, nach «… in den anderen ist keine Rechnung eine Lieferung.».

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| `UBIQUITOUS_LANGUAGE.md:163` letzter Satz (V-7) | `Ist für ein Gebäude, das kein Gebäude ohne Tank ist, gar kein Tankbestand erfasst, gibt es keine Kategorie des Tankbestands; dann ist in jeder Brennstoff-Kategorie eine Rechnung mit eintägigem Leistungszeitraum eine Lieferung: Sie zählt ganz in der Abrechnungsperiode ihres Lieferdatums, über die ganze Periode wie eine Rechnung ohne Leistungszeitraum (#1474).` | – (Glossar nur deutsch) | – | – |
| `UBIQUITOUS_LANGUAGE.md:104` angehängter Satz (V-9, nur mit Entscheid) | `Ist gar kein Tankbestand erfasst, siehe Verbrauch (Heizmaterial) (#1474).` | – | – | – |
| `sharesNoteDelivery` (V-8) | ` Für den Tank sind der Anfangs- und der Endbestand nicht beide erfasst. Die Lieferungen von Heizmaterial in den Tank in dieser Abrechnungsperiode sind deshalb als Verbrauch abgerechnet; sie zählen über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat.` | ` Pour la citerne, le stock initial et le stock final ne sont pas saisis tous les deux. Les livraisons de combustible dans la citerne pendant cette période de décompte sont donc décomptées comme consommation ; elles comptent pour toute la période de décompte, même si une livraison a une période de prestation.` | ` Per il serbatoio la scorta iniziale e la scorta finale non sono registrate entrambe. Le forniture di combustibile nel serbatoio in questo periodo di conteggio sono quindi conteggiate come consumo; contano per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.` | ` For the tank, the opening and the closing stock are not both recorded. The deliveries of fuel into the tank in this billing period are therefore billed as consumption; they count for the whole billing period, even if a delivery has a service period.` |

## Nicht bestätigt

- **Eval 7/7 in zwei Läufen:** nicht selbst ausgeführt, weil Tests und Server nicht erlaubt waren. Das Bild `salz-lieferdatum.png` habe ich geprüft: 360.00 + 45.00 = 405.00, MWST 8.1 % = 32.81, Total 437.81 stimmt. Regeneriersalz ist kein Heizmaterial, die Erwartung null ist richtig.
- **Zweite Brennstoff-Kategorie neben einem erfassten Tank:** Der Fall bleibt offen und ist nicht Teil des Entscheids. Beispiel: Ein Gebäude hat Tankbestände in «Heizung» (Öl) und dazu eine eigene Kategorie «Holz» mit `is_fuel`. Eine eintägige Holzrechnung zählt dann weiterhin nur an ihrem Tag (`delivery()` vergleicht mit `tank.categoryId`). Das ist derselbe Schaden wie V-5 (a). Wie oft das vorkommt, weiss ich nicht. Vorschlag für eine Issue (Labels `domain`, `needs-decision`): «Eine Rechnung mit eintägigem Leistungszeitraum in einer Brennstoff-Kategorie, die nicht die Kategorie des Tankbestands ist, zählt wie eine Lieferung über die ganze Periode ihres Lieferdatums.»
- **Fernwärme-Gebäude ohne `no_tank`:** Die vordefinierte Kategorie «Heizung» ist eine Brennstoff-Kategorie (`migrations/0024_category_fuel.sql`). Dorthin gehören auch Rechnungen für Fernwärme und Erdgas. Ein solches Gebäude ist oft nicht als «Gebäude ohne Tank» festgehalten. Erfasst der Vermieter dort von Hand eine Rechnung mit eintägigem Leistungszeitraum, steht im PDF «Lieferung in den Tank», obwohl es keinen Tank gibt. Der Abrechnungslauf fordert ihn aber auf, das Gebäude ohne Tank festzuhalten (`messages/de.json:1667`), und die KI setzt für Energie keinen Liefertag. Häufigkeit nur aus dem Code geschlossen.
- **Zeitanteilige Verteilung beim Mieterwechsel:** Art. 257a/257b OR habe ich nicht neu abgerufen, die Einstufung **unsicher** aus Runde 2 bleibt. Den VMWG habe ich neu abgerufen (Fedlex, Stand 1. Oktober 2025):
  - Art. 5 Abs. 2 lit. a: «die Brennstoffe und die Energie, die verbraucht wurden».
  - Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»

  Ohne Tankbestand wird der Einkauf statt des Verbrauchs abgerechnet. Das weicht von lit. a ab. Die Regel stammt aber schon aus #1470, und der Hinweis im PDF legt es offen.
- **Text von Issue #1474 und der Entscheid der dritten Runde:** nicht selbst gelesen, die Grundlage ist die Wiedergabe des Aufrufers.

Geprüft: Prompt-Zeile `heatingMaterial` und `deliveryDates` (Wortlaut aus Runde 2) setzen den Entscheid um. Ohne Feld oder bei `false` gibt es keinen Liefertag, also das Verhalten von vor #1474. Die Sicherheit kommt weiter aus `deliveryDates`. Die geplante Regel stimmt mit `periodReadings` überein: `null` ohne jeden Tankbestand, und bei `no_tank` ohne `covered`, das bleibt wie heute. Der Filter nach dem Periodenende ist für einen Tag in der Periode nicht nötig. `partDelivery` und `heatingNoteDelivery` passen auch ohne Tankbestand: Ohne Bestände gilt der Einkauf als Verbrauch, wie `statements_tank_text` es dem Vermieter ankündigt.
