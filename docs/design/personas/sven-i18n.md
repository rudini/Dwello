# Sven (45, screen reader, keyboard only, desktop): Dwello in English

Persona run on 12.10.2026 against http://localhost:3300 (demo data). Every action went through `page.keyboard` (Tab, Shift+Tab, Enter, arrows, Escape). What a screen reader announces was checked with the accessibility tree (`readOut`) and with the focused element's name, `aria-describedby` and `aria-invalid`. Nothing was saved: I stopped at the review step.

## 1. Task completed

**Partly.**

- **Switching the language by keyboard: yes.** The control is the third Tab stop and is announced as "Sprache: Deutsch" (after the switch, "Language: English"). Enter opens the list, Tab moves through "Deutsch", "Français", "Italiano", "English", and Enter switches.
- **Rental contract wizard in English up to the review step: yes.** Focus, labels, help texts and error messages all worked by keyboard and were announced correctly.
- **Help and privacy pages without signing in: no.** Signed out, `/help`, `/privacy` and `/terms` all redirect to the sign-in page. The "Terms of use" link on the sign-in page leads straight back to sign-in. I could switch the language on the sign-in page, but I could not reach any login-free content page. Signed in, all three pages switch to English correctly.

## 2. Effort

- **Screens:** dashboard, rental contracts list, wizard steps 1 to 5, sign-in, help, privacy and terms (about 12).
- **Switching the language:** 3 Tab + Enter + 4 Tab + Enter = 9 key presses.
- **Wizard without errors:** about 35 key presses. With all the error checks, about 70.
- **Way back to the language control from step 3 of the wizard:** 18 Shift+Tab.
- **Time:** about 25 minutes as a user, including trying out the errors.

## 3. Thinking aloud

1. On the dashboard, Tab gives me "Zum Inhalt springen", then "Dwello", then "button Sprache: Deutsch". The name already tells me the current language. ([01](screens/sven-i18n/01-language-menu-open.png))
2. Enter announces "expanded", but focus stays on the button. The arrow keys do nothing; I have to guess that Tab takes me into the list. The current option has `aria-current="true"` and a check mark. Escape closes the list and focus goes back to the button. Good.
3. I Tab to "English" and press Enter. The page reloads with `lang="en"` and the title "Overview - Dwello". **Focus is on the page body, not on the language control.** I hear nothing that confirms the change and have to Tab 3 times to find my place again. Acceptable, but I would expect focus to return to "Language: English".
4. In my first attempt on `/contracts/new` I pressed Enter right after loading. Nothing opened, and my next 4 Tab presses plus Enter took me to "Wohnungen" instead. The button only works once the page is fully loaded, which a fast keyboard user can hit.
5. Main navigation, "Rental contracts", then "Add rental contract". After each page change, focus goes back to the top of the document. Skip link first, then 17 Tab stops to the first field, because the skip link is the only shortcut.
6. **Step 1 "Tenant":** I hear "combobox Tenant, required", with the help text "The person who rents the apartment. If they are not in the list yet, add them first." When I press "Next" without choosing, focus jumps to the combobox and I hear "invalid, Please choose a tenant". Exactly right.
7. Choosing with ArrowDown works ("Maria Rossi, Zürich"). After "Next", focus is on the heading "Step 2 of 5: Apartment". Very good: I know where I am. The live region also says "Draft saved, 10:07" on every step, which is a little chatty but reassuring.
8. **Step 2:** "Next" with no apartment gives "Please choose an apartment" and focus on the field. Unavailable apartments are disabled and end with "(not available)". The help text calls this «not available», with Swiss guillemets. The "Cancel" link from step 1 is gone from step 2 onwards; only "Back" and "Next" remain.
9. **Step 3 "Contract term":**
   - "Contract start" announces the format: "Format DD.MM.YYYY. Example: 31.12.2025".
   - `31.02.2026` gives "This date does not exist. Please enter it as DD.MM.YYYY, for example 31.12.2025." Clear.
   - After a valid date I hear the weekday, "Sunday, 1 November 2026". Very helpful for me.
   - The radio buttons announce name and description together and then the description again: "Open-ended The rental contract has no contract end. It runs until it is terminated." twice in a row.
10. "Fixed-term" by ArrowDown shows "Contract end". An end date before the start gives "Contract end must be after contract start", and focus goes to the field. ([02](screens/sven-i18n/02-step3-end-error.png))
11. "Open calendar for Contract start" is named well. Enter opens the browser's own date picker. In my run, focus stayed on the button and I could not tell from the announcement whether anything had opened. Typing the date is the safer way for me.
12. **Step 4 "Rent":**
    - Empty: "Net rent is required".
    - `abc`: "Please enter a valid amount, for example 1450.00 or 1'450." ([03](screens/sven-i18n/03-step4-amount-error.png))
    - The info box "No advance payment" appears visually when the advance field is empty, but nothing announces it. I only find it with Tab or the virtual cursor.
13. **Step 5 "Review":** focus is on "Step 5 of 5: Review". It reads as a definition list (term/definition), and each "Change" button is named "Change Tenant", "Change Net rent" and so on. ([04](screens/sven-i18n/04-review.png))
    - "Change Net rent" takes me to step 4 with focus in the field.
    - "Next" brings me straight back to the review. Excellent.
    - Completed steps in the progress navigation are buttons ("Tenant (done)").
14. **Language switch mid-wizard:** I was on step 3 in German, used 18 Shift+Tab to reach the control and chose English. Focus lands on "Draft restored. Your entries, last edited on 12.10.2026 at 10:13, are back." That is good. But the wizard starts again at **step 1**. My entries, including the date, are still there, so I have to press "Next" twice more.
15. **Signed out**, on the sign-in page: "Skip to content", "Language: English" (inside a navigation "Language selection"), "Sign in with Google", "Terms of use". ([05](screens/sven-i18n/05-login-en.png)) Switching works and keeps `redirectTo`. But "Terms of use" leads back to "Sign in", so I cannot read what I am supposed to accept. There is no "Privacy" link at all on the sign-in page, and `/help` and `/privacy` also redirect to sign-in.
16. **Signed in:** Help, Privacy and Terms of use switch fully to English. ([06](screens/sven-i18n/06-privacy-en.png)) The privacy page says "You sign in through Google or Microsoft", but the sign-in page only offers Google. It lists only a session cookie and an XSRF cookie, but switching the language sets a third cookie, `PARAGLIDE_LOCALE`.

## 4. Language

**Texts not in English:**

- No UI text stayed in German after the switch in the screens I used.
- Data from the database is German, as expected: floor-based apartment numbers "OG2", "EG", "OG1" and building names. As an English speaker I do not know that "EG/OG" means ground or upper floor.
- The Google error page I reached by mistake was German, but that is Google's page, not Dwello's.

**Words or phrasing that read oddly in English:**

- Guillemets «…» everywhere ("marked «not available»", "«Save rental contract» creates the rental contract", the help page). English uses "…" quotation marks.
- "Add step by step who rents which apartment, from when and at what rent." The word order is German.
- "0 Re-let" and "0 Blocked" on the dashboard (the status filter is called `reserved`). "Re-let" is unclear to me.
- Terms page: "what the management is responsible for" and "The management is responsible for informing the tenants". It reads like "die Verwaltung"; "the property manager" would be clearer.
- "Contract end must be after contract start" has no full stop, while "This date does not exist. …" has one. The style is inconsistent.
- Amount example "1'450" with a straight apostrophe, while amounts are shown as "1’850.00" with a typographic one. Minor, but a screen reader may read the two differently.

**Words I did not understand:**

- "OG2", "EG" (data).
- "Re-let".
- "Distribution keys" and "Heating profiles" in the navigation (the help page explains them).

## 5. Layout at my viewport (1440 × 900)

- There is no horizontal scrolling and no clipped text.
- The language control shows an icon plus "English" and has a visible focus ring.
- The open list shows a check mark next to the current language. It does not rely on colour alone.
- The label "Open-ended" in the review is rendered with a hyphen that looks spaced ("Open - ended"), and "Apartment OG2 - Alpenblick" uses a spaced hyphen. Cosmetic only.
- (A full-page screenshot shows the sticky header in the middle of the page. That comes from the screenshot tool, not the app.)

## 6. Error risks

- **Pressing Enter on the language button before the page has loaded does nothing.** The following key presses then go to the wrong place; in my run I ended up on "Apartments" without meaning to.
- **After a language switch, focus starts at the top of the document.** A screen-reader user gets no confirmation that the language changed, except that everything now sounds different.
- **Switching the language mid-wizard drops me back to step 1.** I might think my entries were lost, although the "Draft restored" notice helps.
- **The info box "No advance payment" is not announced.** A blind user may save a contract without advance payment without understanding what it means.
- **The calendar button opens the native picker with no announced change.** The text field is the reliable way.
- **The "Cancel" link disappears after step 1.** To leave the wizard I must find the breadcrumb or the navigation.
- **Legal pages are not reachable before sign-in.** I "accept the Terms of use" without being able to read them.

## 7. Suggestions

- **Major:** Make `/terms`, `/privacy` and `/help` reachable without signing in, and add a "Privacy" link on the sign-in page. Today the "Terms of use" link on the sign-in page loops back to sign-in, so the user accepts terms they cannot read.
- **Minor:** After a language switch, put focus back on the language control (now "Language: English"), or announce "Language changed to English" in a live region.
- **Minor:** When the language switch reloads the wizard, restore the step the user was on (step 3), not only the entries.
- **Minor:** Do not include the description in the accessible name of the "Open-ended"/"Fixed-term" radios; it is announced twice now.
- **Minor:** Announce the "No advance payment" hint, for example by linking it to the advance field with `aria-describedby`.
- **Minor:** Keep "Cancel" visible on every wizard step.
- **Minor:** In English, use "…" instead of «…». Revise "Add step by step who rents…", "Re-let" and "the management" on the terms page.
- **Minor:** Privacy page: mention the language cookie, and either say "Google" only or offer Microsoft on the sign-in page.
- **Minor:** Make the language button work (or be visibly inactive) before the page has finished loading.
- **Minor:** Let the arrow keys move within the open language list. This is optional for a disclosure, but screen-reader users expect it from a list that looks like a menu.
