# Persona test: Sven (45, blind, screen reader, keyboard only), round 5

Task: starting at `/dashboard`, create a new Mietvertrag for an existing tenant and a free apartment, start 01.12.2026, unbefristet, Nettomiete 1200, Akonto 150, using only the keyboard. Along the way: press "Weiter" without a tenant, go back a step, check focus after each step change, check that the step progress is announced, listen to the summary, save, and check that the confirmation is announced.

Method: Playwright driven only through `page.keyboard`. What Sven "hears" was taken from the accessibility tree (`ariaSnapshot`), from the focused element (name, `aria-describedby`, `aria-invalid`) and from the contents of live regions. No real screen reader was used, so where an announcement depends on timing (live regions that appear during a page change) the report says so.

## 1. Task completed

**Yes.** The contract "Laura Keller – Wohnung B1, Seepark Residenz, 01.12.2026, unbefristet, CHF 1'200 + 150 Akonto" was saved. The new contract is at the top of `/contracts`, and a status message "Mietvertrag von Laura Keller gespeichert" is present.

On the first pass I saved the wrong start date (12.01.2026) into the summary. The summary read it back as a full date with the weekday, so I noticed and fixed it before saving (see 3, step 3).

## 2. Effort

- Shortest path (once I knew the layout): about **60 key presses**. That is the skip link, 4 Tabs to "Mietvertrag erfassen", then about 7 to 14 presses per step, counting typed characters.
- My real run, including the deliberate error, going back, fixing the date through "Ändern" and orientation tabbing: about **140 key presses**.
- One more step than necessary: after "Ändern" in the summary and a correction, "Weiter" goes through step 4 again instead of straight back to "Prüfen".

## 3. Walkthrough (thinking aloud)

**Dashboard.** "Übersicht – Dwello". There is a skip link "Zum Inhalt springen", good. Without it I would have to tab through 16 navigation links. After the skip link, 4 Tabs take me to "Häufige Arbeiten" and then "Mietvertrag erfassen". Enter.

**Step 1 – Mieter.** The page change is announced as "Neuer Mietvertrag – Dwello" (assertive route announcer). Focus is on `body`, though, so I need the skip link again (Tab, Enter) and then Tab past the breadcrumb. The heading structure is clear: H1 "Neuer Mietvertrag", a "Fortschritt" navigation with "Schritt 1 von 5: Mieter" and a progress bar "Schritt 1 von 5". I only hear that progress when I read through the page with the virtual cursor, not when I tab. The "Mieter" combobox has a good name and description ("Die Person, die die Wohnung mietet. Steht sie noch nicht in der Liste, erfassen Sie sie zuerst.").

*Deliberate error:* I tab to "Weiter" (past "Neuen Mieter erfassen" and "Abbrechen") and press Enter. **Silence.** Focus stays on "Weiter" and nothing goes into a live region. Only when I Shift+Tab back to the combobox do I hear "Mieter, ungültig, … Bitte wählen Sie einen Mieter aus". The error is correctly linked to the field (`aria-invalid="true"` and `aria-describedby` includes the error text). But a blind user who presses Enter and hears nothing will think the button is broken, or press it again.

I typed "Laura" on the combobox, which selected "Laura Keller" (type-ahead works). **The error does not clear.** The field still says "ungültig – Bitte wählen Sie einen Mieter aus" until I press "Weiter" again. Separately, a polite status "Entwurf gespeichert, 09:13" appears. That is reassuring, but it will be announced again and again while I type.

**Step 2 – Wohnung.** After "Weiter", **focus moves to the H2 "Wohnung"**. Good, I know where I am. I do not hear "Schritt 2 von 5", though. The combobox description explains that occupied apartments are marked "nicht verfügbar" and cannot be chosen. Very good. Type-ahead is useless here because every option starts with "Wohnung …", so I have to arrow through the list. With 3 or 4 free ones that is OK. (During my test another session rented OG2 Alpenblick, so the list changed between runs. The status "nicht verfügbar" made that understandable.)

*Going back:* "Zurück" puts focus on the H2 "Mieter". "Laura Keller" is still selected. After "Weiter", the apartment is still selected too. **Nothing is lost.** Even a reload (F5) on the summary restores everything, with focus on the H2 "Prüfen".

**Step 3 – Vertragsdauer.** Focus is on the H2 "Vertragsdauer". "Vertragsbeginn" is a native date field with three segments (three Tab stops) and a description, "Erster Tag des Mietverhältnisses." **The format is not explained.** I typed "01122026" as I would in Switzerland. The test browser used month/day/year order, so the field became **12 January 2026**. Then a polite live region announced "Montag, 12. Januar 2026". That echo is good, but it easily gets lost while typing, and it is not linked to the field through `aria-describedby`, so I don't hear it when I return to the field. Nothing warns me that the start date is in the past (today is 10.10.2026).

"Unbefristet" was already selected. The radio buttons are in a radiogroup "Vertragsdauer", but their names include the whole description ("Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird."), which makes them long to listen to.

*Deliberate empty date:* "Weiter" with an empty date gives the same picture as step 1. The error "Vertragsbeginn ist erforderlich" is linked and `aria-invalid` is set, but it is **not announced** and focus stays on "Weiter".

**Step 4 – Miete.** Focus is on the H2 "Miete". "Nettomiete pro Monat" has a good description ("Beispiel: 1500.00"). "Akonto pro Monat (optional)" explains what Akonto means. I typed 1200 and 150. "Monatlich total CHF 1'350.00" updates, but only visually and in the page text, not as an announcement. That is fine; I can read it.

**Step 5 – Prüfen.** Focus is on the H2 "Prüfen". The summary is a definition list: "Mieter: Laura Keller, Wohnung: Wohnung 2.02 – Musterhaus Zentrum, Vertragsbeginn: **Montag, 12. Januar 2026**, Vertragsende: Unbefristet, Nettomiete CHF 1'200.00, Akonto CHF 150.00, Zusatzmiete CHF 0.00, Monatlich total CHF 1'350.00". **This reads very well aloud.** The full date with the weekday made me notice "Januar". Each line has its own "Ändern" button with a clear name ("Vertragsbeginn ändern"). "Vertragsbeginn ändern" puts focus on the H2 "Vertragsdauer". I entered the date again in the order the field expected (heard as "Dienstag, 1. Dezember 2026"). Then "Weiter" went through step 4 again to "Prüfen".

**Saving.** Tab 9 times past all "Ändern" buttons to "Mietvertrag speichern", then Enter. The page changes to "Mietverträge – Dwello" (route announcer). A `role="status"` with "Mietvertrag von Laura Keller gespeichert" is in the DOM. **Focus is on `body` again.** Whether a screen reader actually speaks the status depends on whether the region existed before the text was inserted; since it appears together with the page change, it may be drowned out by the assertive title announcement. Also on the page are **12 more `role="status"` regions** with "AKTIV" / "Beendet", one for each status badge in the table. If those are announced, I hear "AKTIV, AKTIV, AKTIV …".

In the list, my contract says "01.12.2026 – heute" and "Status: AKTIV", even though it only starts in December. That is confusing.

## 4. Focus, labels, error messages – findings

| Topic | Finding | Rating |
|---|---|---|
| Focus on step change | Moves to the step's H2 every time (forward, back, "Ändern", reload) | good |
| Focus after page change | Lands on `body` (wizard start, after saving); skip link needed again | weak |
| Step progress | "Schritt n von 5: …" and a progress bar exist, but they are not announced on a step change (the H2 is the step name only) | gap |
| Labels | All fields have a visible `<label>`, helpful `aria-describedby` texts, a required flag on the date | good |
| Error association | `aria-invalid` + `aria-describedby` to the error text: correct | good |
| Error announcement | No live announcement and no focus move to the field after "Weiter" → silence | gap |
| Error clearing | The error stays after a valid selection until the next "Weiter" | weak |
| Date field | Native date field, format/segment order not explained; date echo polite and not linked to the field | risk |
| Draft | "Entwurf gespeichert, hh:mm" as `role=status`, repeated with every change | chatty |
| Summary | Definition list, full date with weekday, labelled "Ändern" buttons | very good |
| Confirmation | `role=status` "Mietvertrag von Laura Keller gespeichert" exists, but appears during the page change; 12 badge `status` regions compete with it | uncertain |
| Radio buttons | Accessible name = label + whole description (long) | minor |

## 5. Error risks

1. **Wrong start date without noticing.** The segment order of the native date field depends on the browser/OS locale. A user who types "01122026" can end up with 12.01.2026. Only the summary (and a quiet echo) catches it, and there is no warning that the date is in the past.
2. **Silent "Weiter".** The user thinks the app is not responding, presses again, or leaves the wizard.
3. **Stale error.** After choosing a tenant, the field still says "ungültig", so the user is unsure whether the choice counted.
4. **Missed confirmation.** If the status message is not spoken, the user is unsure whether the contract was saved and may create it twice. Focus on `body` gives no hint either.
5. **Future contract shown as "AKTIV … – heute".** This can lead to a wrong understanding of the occupancy.

## 6. Improvement suggestions

- **Major – Announce errors on "Weiter":** move focus to the first invalid field (then the existing `aria-describedby` is read automatically), or show an error summary with `role="alert"`.
- **Major – Date input:** describe the format in the help text ("Format TT.MM.JJJJ"), add the date echo ("Dienstag, 1. Dezember 2026") to `aria-describedby`, and warn if the start date lies in the past.
- **Major – Confirmation after saving:** put the success message into a live region that exists before the page change, or move focus to the message or to the new row; turn the "AKTIV"/"Beendet" badges into plain text instead of `role="status"`.
- **Minor – Step progress:** include the progress in the focused heading, e.g. H2 "Schritt 2 von 5: Wohnung", or announce it in the status region on each step change.
- **Minor – Clear errors immediately** once the field has a valid value.
- **Minor – "Entwurf gespeichert"** should be announced at most once per step, or not as a live region.
- **Minor – After "Ändern" + "Weiter"** go straight back to "Prüfen".
- **Minor – Radio buttons:** name = "Unbefristet" only; link the description via `aria-describedby`.
- **Minor – List:** show contracts that start in the future as "ab 01.12.2026" / "Zukünftig" instead of "– heute / AKTIV".
- **Minor – Focus after the wizard loads:** put focus on the H1 or the first field instead of `body`.

No blockers: every step can be done with the keyboard alone, and the summary is a real safety net.

## Screenshots

- `screens/sven-5/01-step1.png` – step 1, start
- `screens/sven-5/02-error-no-tenant.png` – error without a tenant (visible, not announced)
- `screens/sven-5/03-step3.png` – step 3 Vertragsdauer
- `screens/sven-5/04-summary-wrong-date.png` – summary with the accidental 12.01.2026
- `screens/sven-5/05-summary.png` – corrected summary before saving
- `screens/sven-5/06-after-save.png` – contract list after saving
