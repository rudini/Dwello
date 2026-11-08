# Fachreview #1318, Runde 1 (Schritt 1, Commit 40cdd2a)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geprüft: alle 8 geänderten Szenarien geben den Wortlaut der Entscheidung genau wieder («Höchstens {max} Zeichen, Sie haben {length} eingegeben. Kürzen Sie den Text.»), jeweils mit {length} = {max}+1 passend zum Schritt «einen Text von N Zeichen» (21/20, 31/30, 256/255, 101/100). Die drei Rechnungs-Szenarien mit eigener Meldung (#743: invoice-edit.feature:78, invoices.feature:152, invoice-new.feature:99) sind wie entschieden unverändert. Deutsch: «Sie», «ss», kurze Sätze, sagt, was passiert ist und was zu tun ist; kein Begriff aus UBIQUITOUS_LANGUAGE.md betroffen. Gezählt wird mit `[...value].length` (Codepoints, backend/src/services/text-length.ts:13), so wie PostgreSQL `char_length` in UTF-8 zählt.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| backend_text_too_long | Höchstens {max} Zeichen, Sie haben {length} eingegeben. Kürzen Sie den Text. | {max} caractères au maximum, vous en avez saisi {length}. Raccourcissez le texte. | Al massimo {max} caratteri, ne ha inseriti {length}. Accorci il testo. | At most {max} characters; you entered {length}. Shorten the text. |

- fr: kein « » ; : ! ? im Text, also kein U+00A0. «saisir» wie in i18n-begriffe.md:165 (erfassen → saisir); «vous en avez saisi» ohne Angleichung des Partizips (en + avoir, richtig).
- it: «ne ha inseriti» mit Angleichung an «caratteri» (ne partitiv + avere, maskulin Plural, richtig); Lei-Form wie «Accorci».
- en: Strichpunkt statt Komma, sonst ein Komma-Spleiss (zwei Hauptsätze); der Rest wie die bisherige Fassung.
- Der Anfang jeder Fassung und der Schlusssatz bleiben wie bisher in messages/*.json:2369.

## Plural ({length} = 1 und Ränder)

Kein Plural nötig. Die Annahme «Limits ≥ 20» stimmt nicht: backend/src/db/schema.ts hat auch Spalten mit 2 (canton, country), 5 (language), 10 (postalCode, channel …) und 27 Zeichen. Das kleinste Limit ist aber 2, also gilt {max} ≥ 2 und {length} ≥ 3: in allen vier Sprachen bleibt es immer Plural («2 Zeichen», «2 caractères», «2 caratteri», «2 characters»). {length} = 1 kann nicht vorkommen. Ein Limit von 1 gibt es nicht; käme eines dazu, bräuchte nur {max} eine Pluralform.

## Nicht bestätigt

- Zeilenumbrüche: Ein Browser schickt einen Umbruch in einer textarea als CRLF (2 Zeichen). Bei einem mehrzeiligen Feld kann {length} darum höher sein als die Zahl, die der Liegenschaftsverwalter selbst zählt. Ich habe nicht geprüft, ob ein Feld mit TEXT_TOO_LONG eine textarea ist (geschaut: nur schema.ts, Limits bis 500). Die Entscheidung sagt «so, wie PostgreSQL zählt», also kein Befund.
- Tausendertrennzeichen: Ab 1000 eingegebenen Zeichen (möglich bei Feldern mit 500) zeigt Paraglide die rohe Zahl («1200»). Vierstellige Zahlen ohne Trennzeichen sind in de-CH und fr-CH üblich; docs/design/i18n-begriffe.md sagt dazu nichts.
- Fedlex: nicht anwendbar (Formulartext, keine Regel aus dem Recht).
