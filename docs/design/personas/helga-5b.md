# Persona test: Helga (5b): new tenant from inside a new Mietvertrag

Persona: Helga, 68, inherited an apartment building, has little computer experience, uses the browser at 150 % zoom and is unsure about property terms.
Setup: desktop 1440x900 at 150 % zoom, demo data, "today" = 10.10.2026. The test drove the app with Playwright and looked at every screen.

Task: create Frau Rosa Meier (Lindenweg 4, 8400 Winterthur, rosa.meier@example.ch) from inside a new Mietvertrag. Then finish the contract for a vacant apartment from 01.12.2026, with Nettomiete CHF 1'380 and Akonto CHF 160 per month.

## 1. Task completed

**Yes.** Contract saved: Rosa Meier, Wohnung 2.02 Musterhaus Zentrum, Vertragsbeginn 01.12.2026, unbefristet, Nettomiete CHF 1'380.00, Akonto CHF 160.00, total CHF 1'540.00. The tenant record has the address and e-mail.

The task did not go smoothly. The start date I typed the first time became **12 January 2026**. I only found the error because the app read the date back to me in words and the review step listed it. When I tried to fix it, the date became **year 12026**.

Side note: my first apartment choice, OG2 Alpenblick, was booked by someone else in the meantime (another session that shares the demo database). I took the next free apartment.

## 2. Effort

- About 25 actions over 5 wizard steps plus the tenant form. A smooth run would take about 15.
- Two detours, both caused by the date field: reading the warning, then "Ändern" → step 3, and then having to click "Weiter" twice to get back to "Prüfen".
- Felt confidence: high for the tenant part, low for the date, and medium–high at the end.

## 3. Walkthrough (thinking aloud)

1. **Übersicht.** "Lots of things here. Under 'Häufige Arbeiten' I see 'Mietvertrag erfassen'. That's what I want." Click.
2. **Neuer Mietvertrag, Schritt 1 von 5: Mieter.** "Good, five steps, and it shows me where I am. 'Steht sie noch nicht in der Liste, erfassen Sie sie zuerst.' Rosa isn't in the list. There's a 'Sarah Meier', but that's someone else. So I click 'Neuen Mieter erfassen'." I was a bit worried that leaving the page would lose my contract.
3. **Neuen Mieter erstellen.** "It says 'Danach geht es mit dem Mietvertrag weiter.' That calms me down." There is no field for "Frau", so I typed just "Rosa" and wondered whether the "Frau" would be missing on letters later. "Korrespondenz: Per E-Mail" and "Sprache" each have a little explanation, which I liked. I filled everything in and clicked the blue "Mieter erstellen" button. This button is a brighter blue than the dark buttons in the wizard, and I wondered if I was somewhere else in the program.
4. **Back in the wizard.** I got a green box: "Mieter erfasst – Rosa Meier ist gespeichert und für diesen Mietvertrag gewählt." "Wonderful, exactly what I wanted to know." (Screenshot 01.) Weiter.
5. **Schritt 2: Wohnung.** "Freie Wohnungen stehen zuoberst." I opened the list. The free ones don't say "frei", only the others say "(nicht verfügbar)". I picked the first one. Weiter. Underneath it said "Entwurf gespeichert, 09:35". "Nice, but what is a 'Entwurf'? Did it already save the contract?"
6. **Schritt 3: Vertragsdauer.** The date box says **"mm/dd/yyyy"**. "I don't know what that means. I write dates like everybody: 01.12.2026." I clicked in and typed it. The box showed "01/12/2026". Below it in bold: **"Montag, 12. Januar 2026"**, and a yellow box: **"Vertragsbeginn prüfen – Der Vertragsbeginn Montag, 12. Januar 2026 liegt in der Vergangenheit. Stimmt das Datum?"** (Screenshot 02.) "January? I wanted December!" I'm glad it told me in words. But the "Weiter" button still let me go on, and if I hadn't read the yellow box I would have continued.
7. **Fixing it (first attempt).** I clicked into the box again and typed 01.12.2026 again. The cursor was in the year part, though, so my digits went into the year. The read-back now said **"Montag, 12. Januar 12026"**, and the yellow box still said that date "liegt in der Vergangenheit". "Year twelve thousand in the past? Now I'm completely lost." "Weiter" still worked.
8. **Schritt 4: Miete.** I typed "1'380" as I would on paper and "160" for Akonto. The total showed **"Monatlich total CHF 1'540.00"**. "It understood my apostrophe, good." The explanations for "Akonto" ("Monatlicher Vorschuss des Mieters für Nebenkosten … Wird mit der Nebenkostenabrechnung verrechnet") and "Zusatzmiete" (Garage, Parkplatz) told me what to put where. My task said "Nebenkosten Akonto", and "Akonto pro Monat" matched it.
9. **Schritt 5: Prüfen.** A clear table with "Ändern" next to each line. It showed **"Vertragsbeginn: Montag, 12. Januar 12026"** (Screenshot 03). "This is wrong. Good that I can see it here." I clicked "Ändern" next to Vertragsbeginn and was back in step 3.
10. **Fixing it (second attempt).** I clicked on the first number in the box and this time typed the day and month swapped, "12.01.2026", because the program seemed to read them the other way round. The read-back said **"Dienstag, 1. Dezember 2026"** and the yellow warning was gone. "Finally." I had to click "Weiter" twice, through the Miete step again, to get back to Prüfen. Everything there was correct, so I clicked "Mietvertrag speichern".
11. **After saving.** I landed on the "Mietverträge" list. I did **not see a message** like "Mietvertrag gespeichert". Rosa Meier appears in the second row, so it worked (Screenshot 04). The row says "01.12.2026 - heute" and "AKTIV", though the contract hasn't started yet. "Is she already living there? And what does 'heute' mean, does it end today?" The "Mietzins" column shows CHF 1'540, but I entered 1'380 as rent. "Did I enter the wrong number?" The contract detail page explained it: "Nettomiete 1'380, Akonto 160, Total Bruttomiete 1'540".

## 4. Points of confusion (incl. terms)

- **"mm/dd/yyyy"** in the date field: English placeholder, and month before day. This is the browser's native date field. In this test browser it used US order even though the page is in Swiss German. A Swiss user doesn't recognise it.
- **"Entwurf gespeichert"** during the wizard: I wasn't sure whether the contract was already created or only a draft. Nobody explains what an "Entwurf" is.
- **Read-back "liegt in der Vergangenheit" for year 12026**: the warning is wrong for an absurd future date, and it hides the real problem.
- **List after saving:**
  - **"AKTIV"** for a contract that starts in the future
  - **"01.12.2026 - heute"** reads as "until today"
  - **"Mietzins"** is the gross amount, while the wizard called the rent "Nettomiete"
- **Terms:**
  - "Akonto" and "Zusatzmiete" were explained well.
  - "Bruttomiete" appears only on the detail page and is never explained.
  - "Vertragsdauer: Unbefristet/Befristet" is explained in plain words, which was good.
- **No "Anrede" (Frau/Herr)** field. The task said "Frau Rosa Meier", and I didn't know where the "Frau" should go.
- **Two similar names**: "Rosa Meier" and "Sarah Meier" sit next to each other in the tenant list. The green box made it clear which one was selected.
- **Free apartments aren't labelled "frei"**: only the unavailable ones are marked.

## 5. Error risks

- **High: date silently day/month-swapped.** Typing "01.12.2026" stored 12.01.2026. The warning is only a warning, and "Weiter" and the save button stay enabled. In a browser with a German date order the swap wouldn't happen, but the app depends on that.
- **High: the date can't be corrected by retyping.** Clicking into the field again puts the cursor in the year segment, which produced year 12026. Nothing stopped me: step 3 accepted it, the review showed it, and saving was possible (I did not save it). A contract starting in 12026 would be absurd. Whether the backend would reject it was not tested.
- **Medium: misleading warning text.** "liegt in der Vergangenheit" is shown for a date in the year 12026.
- **Medium: no confirmation after saving.** Without a message, a user might click "Mietvertrag speichern" again or create the contract a second time. I found no success message in the list page's contents about 1.5 s after it loaded.
- **Low: amounts are robust.** "1'380" was accepted and the total updated right away.
- **Low: lost apartment.** Another session booked my chosen apartment between runs. The list then marked it "(nicht verfügbar)", which was clear.

## 6. Readability at 150 % zoom

- Good overall. At 150 % the wizard is a single column with large labels, large fields and large buttons. Nothing is cut off and there is no horizontal scrolling.
- The step indicator (1–5 with ticks) is readable, and the done steps get a green tick.
- The help texts under the fields ("Erster Tag des Mietverhältnisses.") are grey and a bit light, but readable.
- On the tenant form, the help texts under "Korrespondenz" and "Sprache" are noticeably smaller than the rest.
- On the list page, the "Zeitraum" column wraps ("01.12.2026 -" / "heute"), and the row action icons (eye, pencil) have no text, so I had to guess what they do.
- The tenant form and the contract list use a brighter blue button style than the wizard. Mixing the two styles felt like switching between two programs.

## 7. Improvement suggestions

- **Blocker: make the start date safe to enter.** Replace or augment the native date field so that "01.12.2026" typed with the keyboard is always read as Swiss day.month.year, whatever the browser language. For example, use a text field in TT.MM.JJJJ format with a German placeholder "TT.MM.JJJJ", or three labelled fields (Tag / Monat / Jahr).
- **Major: block impossible dates.**
  - Reject years far in the future, such as 12026, with a clear message ("Bitte ein Datum zwischen … und … eingeben").
  - Ask for confirmation before "Weiter" when the start date is in the past, instead of only showing a passive yellow box.
- **Major: fix the warning logic.** Never say "liegt in der Vergangenheit" for a future date.
- **Major: show a success message after "Mietvertrag speichern"**, e.g. "Mietvertrag für Rosa Meier gespeichert", or go to the new contract's detail page.
- **Major: add a way back to the review after "Ändern".** Offer "Zurück zur Prüfung" in the edited step so the user doesn't have to click through every step again.
- **Minor: label future contracts correctly in the list.** Use something like "Beginnt am 01.12.2026" or "Ab 01.12.2026" instead of "AKTIV" and "… - heute". Write "unbefristet" instead of "heute".
- **Minor: name the list column after what it shows.** Either call it "Bruttomiete" or "Total pro Monat", or show the Nettomiete as it was entered.
- **Minor: explain what "Entwurf gespeichert" means**, e.g. "Ihre Angaben sind zwischengespeichert, der Mietvertrag ist noch nicht erstellt".
- **Minor: mark free apartments as "frei"** in the apartment list, not only the occupied ones.
- **Minor: add an optional "Anrede" field** (Frau/Herr) to the tenant form for letters.
- **Minor: use one button style** across the tenant form, the contract list and the wizard. Add text labels to the eye and pencil icons in the list.

## Screenshots

- `screens/helga-5b/01-tenant-created.png`: back in the wizard with "Mieter erfasst"
- `screens/helga-5b/02-date-misread.png`: "01.12.2026" typed, read back as "Montag, 12. Januar 2026" with the warning
- `screens/helga-5b/03-review-wrong-year.png`: review step showing "12. Januar 12026"
- `screens/helga-5b/04-list-after-save.png`: contract list after saving, with no confirmation and "AKTIV" / "01.12.2026 - heute"
