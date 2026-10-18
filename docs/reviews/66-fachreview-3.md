# Fach-Review #66, Runde 3 (Commit cb6ce6e2)

Gegenstand: `git diff 5c1e00ea cb6ce6e2 -- messages`, Schlüssel `contracts_running_text` und `contracts_running_text_fixed_term` in `messages/{de,fr,it,en}.json` (Antwort auf Persona-Major P-1 von Weber und Helga).

Gesetzestext: Fedlex-Filestore, OR Fassung 1.1.2026 (`eli/cc/27/317_321_377/20260101/de/html/…-11.html`), Art. 269d.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-6 | Verwalter | Minor | «auch für die Zeit, die noch nicht abgerechnet ist» ist unvollständig: Eine berichtigte Abrechnung einer schon abgerechneten Periode rechnet ebenfalls mit dem heutigen Akonto (und den heutigen übrigen Angaben des Mietvertrags). |
| V-7 | Verwalter | Nit | «Tragen Sie eine Mietzinserhöhung erst ein» nennt das Feld nicht; das Formular heisst «Nettomiete pro Monat». |
| V-8 | Verwalter (i18n) | Nit | fr: «aussi pour la période pas encore décomptée» holpert, und «s'applique» weicht vom «prend effet» des Satzes davor ab. |

**Kein neuer Blocker oder Major.** P-1 ist fachlich beantwortet. Die Zuordnung von Weber P-3 zu #90 halte ich für richtig (Begründung unten).

---

## Die neuen Sätze: bestätigt

**Satz 1, «Dwello übernimmt Änderungen sofort, auch für die Zeit, die noch nicht abgerechnet ist.»** Das stimmt mit dem Code überein:
- Die geleisteten Akontobeiträge rechnet Dwello beim Erstellen aus dem aktuellen Wert des Mietvertrags: `const monthlyAdvance = parseFloat(contract.monthlyAdvancePayment);` (`backend/src/services/calculation.service.ts:408`), mal alle Monate der Überlappung (Z. 249).
- Eine erstellte Abrechnung speichert `totalAdvancePayments` (`statement.service.ts:413`). Das Feld ist geschützt (`protectedFields`, Z. 492). Eine erstellte Abrechnung ändert sich also nicht mehr.
- Der Satz widerspricht dem Satz zu Art. 269d nicht mehr. Er beschreibt jetzt, was Dwello tut, und nicht mehr, was rechtlich gilt. Damit ist V-1 aus Runde 1 im Text ehrlich gelöst. Der Fehler in der Rechnung bleibt bei #90 (Option 3, «Betrag ab {Datum}»).

Nachgerechnet (Kosten des Mieters CHF 2'000, Periode Januar bis Dezember, noch nicht abgerechnet):
- Akonto 150, im Juli auf 200 geändert: Dwello rechnet 12 × 200 = 2'400, also eine Rückerstattung von 400. Richtig wären 6 × 150 + 6 × 200 = 2'100 und eine Rückerstattung von 100. Der Satz sagt das voraus («auch für die Zeit, die noch nicht abgerechnet ist»).
- Randfall Null: Akonto im Oktober von 150 auf leer gesetzt. Dwello rechnet 0 statt 1'350. Auch das deckt der Satz.
- Randfall Mieterwechsel: Jeder Mietvertrag hat sein eigenes Akonto, siehe Runde 1. Der Satz betrifft nur Änderungen innerhalb eines Mietvertrags und ist dort richtig.

**Satz 3, «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.»** Der Rat ist richtig und schadet nicht:
- Die Nettomiete kommt in keiner Abrechnung vor. `base_rent` wird nur in `apartment.service.ts`, `contract.service.ts` und `tenant.service.ts` gelesen, also für Anzeigen (Monatlich total, Listen), nicht in `calculation.service.ts` oder `statement.service.ts`.
- Trägt der Vermieter die Erhöhung erst am Tag ein, ab dem sie gilt, zeigt Dwello immer den Betrag, den der Mieter wirklich schuldet. Glossar «Monatlich total» (`UBIQUITOUS_LANGUAGE.md:51`): «der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt».
- Rechtlich passt der Satz zu Art. 269d Abs. 1 OR (Fedlex): «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen.» Vor diesem Termin schuldet der Mieter den alten Mietzins.
- Im befristeten Text hängt der Satz am selben offenen Punkt wie bisher (#388, M-2 und M-5). Durch den neuen Satz wird der befristete Text nicht falscher.

**Glossar.** «Mietzinserhöhung» baut auf «Nettomiete … Auch: Mietzins» auf (`UBIQUITOUS_LANGUAGE.md:48`) und steht schon in den beschlossenen Texten. «abgerechnet» ist hier ein gewöhnliches Wort und kein neuer Fachbegriff. Fehlende Begriffe gibt es keine.

## V-6 (Minor, Verwalter): Berichtigte Abrechnung rechnet auch mit dem heutigen Akonto

**Beleg.** `calculateStatement` (`backend/src/services/statement.service.ts:344–355`) rechnet auch die berichtigte Abrechnung über `calculateStatementForContract`, also mit dem aktuellen `contract.monthlyAdvancePayment` (`calculation.service.ts:408`). Dasselbe gilt für den Satz der Verwaltungspauschale (`feePercentOf(contract, …)`, Z. 403).

**Nachgerechnet.** Die Abrechnung 2025 ist mit einem Akonto von 150 erstellt: 12 × 150 = 1'800. Im März 2026 setzt der Vermieter das Akonto auf 200. Im Mai 2026 kommt eine Gutschrift für 2025, und er berichtigt die Abrechnung 2025. Dwello rechnet dann 12 × 200 = 2'400 geleistete Akontobeiträge, also 600 zu viel. Der Vermieter verliert 600. Bei einer Senkung von 200 auf 150 bezahlt der Mieter 600 zu viel, entgegen Art. 257b Abs. 1 OR («tatsächliche Aufwendungen», Wortlaut in Runde 1).

**Warum ein Problem.** Der Satz sagt «auch für die Zeit, die noch nicht abgerechnet ist». Der Vermieter liest daraus, dass schon abgerechnete Perioden sicher sind. Das stimmt für die gespeicherte Abrechnung, aber nicht für ihre Berichtigung. Die Ursache ist dieselbe wie bei V-1 und bestand schon vorher (#90). Neu ist nur die zu enge Aussage im Text. Deshalb Minor.

**Fix.**
- Satz 1 nach dem Auslöser formulieren, zum Beispiel: «Jede Abrechnung, die Sie danach erstellen oder berichtigen, rechnet mit den neuen Angaben, auch für die Monate davor.» Das ist kürzer und für Helga greifbarer als «übernimmt» (Weber hatte «Dwello rechnet ab dem Speichern mit den neuen Beträgen» vorgeschlagen). fr, it und en müssen mitgehen.
- In jedem Fall gehört ein Kommentar in #90: Auch eine berichtigte Abrechnung (#120) muss das Akonto nach «Betrag ab {Datum}» rechnen, nicht mit dem aktuellen Wert.

## V-7 (Nit, Verwalter): Feld nennen

**Beleg.** `contracts_running_text`, letzter Satz. Das Feld heisst «Nettomiete pro Monat» (`contracts_base_rent_label`, `messages/de.json:739`).

**Warum.** Wer wenig Erfahrung hat, sucht kein Feld «Mietzinserhöhung». Dass er die Nettomiete ändern soll, muss er selbst ableiten.

**Fix (optional).** «Ändern Sie die Nettomiete erst an dem Tag, ab dem die Erhöhung gilt.»

## V-8 (Nit, i18n): Französisch

**Beleg.** `messages/fr.json`, beide Schlüssel: «Dwello applique les modifications immédiatement, aussi pour la période pas encore décomptée.» und «Saisissez une augmentation de loyer seulement quand elle s'applique.»

**Warum.** «aussi pour la période pas encore décomptée» ist umgangssprachlich verkürzt. Der Satz davor sagt «prend effet», der letzte Satz sagt «s'applique» für dasselbe.

**Fix (optional).** «… y compris pour la période qui n'a pas encore été décomptée.» und «Saisissez une augmentation de loyer seulement à partir du jour où elle prend effet.»

## fr/it/en: sonst bestätigt

- Begriffe nach `docs/design/i18n-begriffe.md`: «décompté», «conteggiato» und «billed» folgen der Zeile «Abgerechnet bis» (Z. 73: décompté / conteggiato / billed, dort ❓ #325, gleiche Wortwahl). «augmentation de loyer», «aumento della pigione» und «rent increase» folgen Z. 33 (loyer / pigione / rent). «Saisissez» entspricht «erfassen → saisir» (Z. 101). Im Deutschen steht «eintragen» und nicht «erfassen», trotzdem passt «saisir» in einem Formularfeld.
- it: «Dwello applica subito le modifiche, anche al periodo non ancora conteggiato. … Inserisca un aumento della pigione solo quando vale.» Das ist gleichwertig und passt zu «vale al più presto» im Satz davor.
- en: «Dwello applies changes immediately, also to the period not yet billed. … Enter a rent increase only once it applies.» Das ist gleichwertig. «including the period not yet billed» wäre etwas flüssiger, ist aber kein Befund.
- Keine Übersetzung fügt eine Regel hinzu oder lässt eine weg.

## Weber P-3 → #90: einverstanden

- Der Mangel bestand schon vorher. Die Akonto-Hilfe (`contracts_advance_help`) hat den beschlossenen Wortlaut von #66 Option A. Eine Formularregel dort zu ergänzen hiesse, einen beschlossenen Text zu ändern, und das entscheidet der Product Owner.
- Der richtige Ort ist das künftige Feld «Betrag ab {Datum}» aus #90. Der zweite Kommentar in #90 hält P-3 von Weber und Helga mit dieser Absicht fest (über `gh api` geprüft).
- Rechtsgrundlage, Art. 269d Abs. 3 OR (Fedlex): «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» Ob eine Erhöhung des Akontos darunter fällt oder unter Abs. 1 (Akonto als Teil des Mietzinses im weiteren Sinn), steht nicht im Wortlaut. Das bleibt **unsicher**, wie schon M-3 in Runde 1. Die kantonalen Formulare (SVIT, OW, NW, FR) nennen Abs. 3 ausdrücklich. Für die Praxis gilt in beiden Fällen dasselbe: Formular, Begründung, Termin.
- Einschränkung: Bis #90 umgesetzt ist, gibt es keinen richtigen Zeitpunkt, um ein geändertes Akonto in Dwello einzutragen. Ändert der Vermieter es mitten in der Periode, verfälscht das die laufende Abrechnung. Ändert er es erst nach der Abrechnung, verfälscht das die nächste (und jede Berichtigung, V-6). Ein Rat wie bei der Nettomiete («erst eintragen, wenn sie gilt») würde den Fehler nur verkleinern, nicht beheben. Deshalb fehlt der Satz zu Recht. Satz 1 legt das Verhalten offen, und das genügt als Übergang.

## Nicht bestätigt

- **unsicher:** Ob eine Akontoerhöhung unter Art. 269d Abs. 1 oder Abs. 3 OR fällt (siehe oben, unverändert seit Runde 1 M-3). Gesucht habe ich mit `mmx search` (Formulare der Kantone, gerichte-zh.ch) und im Fedlex-Wortlaut.
- **Nicht nachgeprüft:** Wie sich «Abgerechnet bis» (#133, geplant) auf Satz 1 auswirkt. Das ist noch nicht umgesetzt.
- **Nicht ausgeführt:** Ich habe keine Tests und keine E2E-Läufe gestartet. Ich habe nur den Diff, den Code (calculation.service.ts, statement.service.ts, die Leser von `base_rent` per grep), die Glossare, #90, #66 und Art. 269d auf Fedlex gelesen.
- **«nächsten» statt «nächstmöglichen» Kündigungstermin:** Der Wortlaut weicht vom Gesetz ab und war schon vor dieser Änderung so, auch im beschlossenen `statements_akonto_raise`. Wegen «frühestens» und der genannten Bedingungen ist er nicht falsch, siehe Runden 1 und 2. Weber P-4 nennt den Punkt ebenfalls. An diesem Diff ist es kein Befund.
- Für die englischen Texte gibt es keine amtliche Fassung. Ich habe sie nur mit dem Glossar abgeglichen.
