# Persona test: Helga (68, beginner, 150 % zoom), run 4

Task: create the tenant Herr Peter Brunner (Musterstrasse 12, 8400 Winterthur, peter.brunner@example.ch), then a Mietvertrag for a vacant apartment starting 01.11.2026, Nettomiete CHF 1'450, Nebenkosten Akonto CHF 180. Desktop, 150 % zoom, demo data, date 10.10.2026.

## 1. Task completed

**Yes.** Tenant "Peter Brunner" created, contract created for "Wohnung OG2 - Alpenblick" from 01.11.2026, unlimited ("Unbefristeter Vertrag"), CHF 1'450 + 180. One caveat: I picked the date with the calendar. When I first typed it the Swiss way, it became the wrong date (see 5).

## 2. Effort

About 15 clicks and fields across 4 pages (Übersicht → Neuer Mieter → Mieter page → Neuer Mietvertrag → list of Mietverträge). It took about 5 minutes and felt manageable. The shortcut buttons on the Übersicht made it easy to get started.

## 3. Walkthrough (thinking aloud)

- **Übersicht:** "Oh, there is a box 'Häufige Arbeiten', and the first button says 'Mieter erfassen'. That's exactly what I need." Clicked it straight away. The big card "Abrechnungen prüfen und versenden" at the top made me nervous ("Did I forget something already?"), but I left it alone.
- **Neuen Mieter erstellen** ([screen](screens/helga-4/02-tenant-form.png)): "Vorname, Nachname, fine. Where do I put 'Herr'? There is no field for it." I left it out. The address field already showed "Musterstrasse 12", and for a moment I thought someone had filled it in for me. It's only grey example text. "Korrespondenz: Per E-Mail" mentions "Mahnungen", which frightened me ("Will the app send him reminders on its own?"). I left "Deutsch" as the language and clicked "Mieter erstellen".
- **Peter Brunner's page:** No green "saved" message, but his details were there, so it probably worked. "Aktuelle Miete: Dieser Mieter hat keinen laufenden Mietvertrag" and next to it a button "+ Neuer Mietvertrag". Very helpful, I clicked it.
- **Neuen Mietvertrag erstellen** ([screen](screens/helga-4/05-contract-filled.png)): Peter was already chosen. That's nice. In the "Wohnung" list, many entries say "(nicht verfügbar)", so I chose the first one without that note: "Wohnung OG2 - Alpenblick". "Vertragsbeginn" showed **"mm/dd/yyyy"**. I typed "01.11.2026", and afterwards the field held 11 January 2026. I only noticed because I looked very closely. I then used the little calendar instead. "Unbefristeter Vertrag" was already ticked. "I think that's normal, a flat is rented with no end date." I typed "1'450" in "Nettomiete". The apostrophe vanished, but 1450 stayed. "Nebenkosten Akonto": "Akonto? I think it's the monthly advance, so the 180 goes there." Then "Total Bruttomiete CHF 1'630.00" appeared. Good: now I could see 1450 + 180 add up. I clicked "Vertrag erstellen".
- **Mietverträge list** ([screen](screens/helga-4/06-contract-done.png)): Peter is at the top with "01.11.2026 - heute", "CHF 1'630 /Mt." and "AKTIV". "Heute? It doesn't start until November! And why 1'630, I said 1'450?" Then I remembered the Bruttomiete line. Again there was no "Vertrag gespeichert" message.

## 4. Points of confusion

- **Terms I did not understand:**
  - "Akonto" (in "Nebenkosten Akonto (CHF)", contract form)
  - "Mietzins" (section heading) next to "Nettomiete" and "Bruttomiete"
  - "Unbefristeter Vertrag" (I guessed)
  - "Korrespondenz" / "Mahnungen" (tenant form)
  - "Verteilschlüssel" and "Heizprofile" (menu)
  - "Wiedervermietet" and "Gesperrt" (Übersicht)
- **Fields where I didn't know what to enter:**
  - "Herr" (no Anrede field)
  - "Parkplatz / Sonstiges" ("Must I fill it in? It shows 120.00." It turned out to be only an example)
  - "Vertragsende" (greyed out, no explanation why)
- Why some flats are "(nicht verfügbar)" and whether OG2 is really empty. Nothing in the form told me.
- No confirmation message after saving the tenant or the contract.

## 5. Error risks

- **Date:** the start date field expects month/day/year. Typing "01.11.2026" silently stored **11.01.2026**, a start in the past and the wrong month. (This may come from the test browser's English date format, but the app shows no check such as "Beginn: 1. November 2026" anywhere.)
- **Amounts:** the example numbers (2100.00 / 250.00 / 120.00) look like pre-filled values. I could easily have left "120.00" thinking it belonged there. Net rent and Akonto have identical boxes, and I could have swapped them. The "Total Bruttomiete" line helped me check.
- **List shows Bruttomiete as "Mietzins":** CHF 1'630 instead of the 1'450 I entered makes me think I typed it wrong.
- **"AKTIV" / "- heute"** for a contract that hasn't started yet: is Peter already being charged?

## 6. Readability at 150 % zoom

Overall good: large fields, nothing cut off, no horizontal scrolling. A few things are small:
- the help texts under "Korrespondenz" and "Sprache"
- the table headers (MIETER, WOHNUNG …, small capitals)
- the "AKTIV"/"Beendet" badges

In the contract list, dates wrap to two lines ("01.07.2023 -" / "heute"), and the eye and pencil icons have no text, so I didn't know what they do.

## 7. Improvement suggestions

- **Major:** Show and accept the Swiss date format (TT.MM.JJJJ), and repeat the chosen date in words ("Beginn: Sonntag, 1. November 2026") so a mistake is visible.
- **Major:** Show a clear confirmation after saving ("Mieter Peter Brunner wurde gespeichert", "Mietvertrag erstellt") with the key data.
- **Major:** A future contract should not appear as "AKTIV … - heute". Show something like "Beginnt am 01.11.2026" or "Zukünftig".
- **Major:** Explain "Nebenkosten Akonto" in plain words below the field ("monatliche Vorauszahlung für Heizung, Wasser usw.").
- **Minor:** In the list, label the amount as "Bruttomiete" or show net plus Akonto, so 1'630 doesn't look like a typo.
- **Minor:** Use example values that clearly look like examples ("z. B. 1500"), or none at all, in the amount fields and the address field.
- **Minor:** Add an Anrede field (Herr/Frau) for letters.
- **Minor:** In the Wohnung list, show only free flats first, or explain "(nicht verfügbar)" with "vermietet bis …".
- **Minor:** Add a short note "Unbefristet = ohne Enddatum, üblich bei Wohnungen".
- **Minor:** Give the eye and pencil icons text labels ("Ansehen", "Bearbeiten"), and use slightly larger help texts and badges.
