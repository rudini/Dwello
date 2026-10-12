# Persona run: Sven, keyboard and screen reader, English (repeat run 4)

Sven, 45, uses a screen reader and only the keyboard, desktop viewport (1440 x 900). Run on 2026-10-12 against http://localhost:3300 with demo data. Everything was done with `page.keyboard`; announcements were checked through the accessibility tree (`readOut`) and the accessible name of the focused element after every key press.

Task: on the dashboard switch to English with the language control, sign out with the app's own control, then from the sign-in page open the privacy notice, the terms of use and the help, returning to sign-in each time. Check that no page still announces me as signed in, that the links are reachable and well announced, and that everything is in English.

## 1. Task completed

**Yes.** Every step worked with the keyboard alone. After signing out no page announced my name, my e-mail, the user menu or the main navigation. All texts I met after switching were English.

## 2. Effort

- Screens: dashboard, sign-in, Privacy, sign-in, Terms of use, sign-in, Help, sign-in (8 page views).
- Key presses: about 9 to switch the language, 7 to sign out, then 6 / 5 / 2 Tabs to reach Privacy / Terms of use / Help from the top of the sign-in page and 2 Tabs (Skip to content, Sign in) to get back each time. About 45 key presses in total.
- Rough time for a real screen reader user: 4 to 5 minutes.

## 3. Thinking aloud

1. Dashboard (German). Tab 1 "Zum Inhalt springen", Tab 2 "Dwello", Tab 3 "Sprache: Deutsch". The button name tells me what it is and the current value. Good.
2. Enter opens it ("[expanded]"), Arrow Down moves through "Deutsch", "Français", "Italiano", "English". Each option is announced by its own name in its own language. Enter on "English".
3. The page reloads in English: `lang="en"`, title "Overview - Dwello". **But my focus is gone**: it sits on the page body and nothing is announced (the live region stays empty). I only know that it worked because the next Tab says "Skip to content" instead of "Zum Inhalt springen". ([dashboard in English](screens/sven-i18n-4/03-dashboard-en.png))
4. Tab to "Vera Verwalter User menu" (name plus role hint, clear). Enter expands it. I first tried Arrow Down as in the language menu: nothing happens, focus stays on the button. With Tab I reach "Settings" and then "Sign out". The e-mail "verwalter@example.com" is in the menu as plain text, which a screen reader reads in browse mode. ([user menu open](screens/sven-i18n-4/04-user-menu.png))
5. Enter on "Sign out". I land on /login, the announcer says "Sign in - Dwello". Focus is on the body, so Tab starts at "Skip to content", which is fine after a page change. There is no "You have been signed out" message; the heading "Sign in" makes the result clear enough. ([signed out](screens/sven-i18n-4/05-signed-out.png))
6. Sign-in page tab order: "Skip to content", "Help", "Language: English", "Sign in with Google", "Terms of use" (inline in "By signing in you accept the Terms of use."), "Privacy", "Terms of use" (footer). Logical, short, and the language stayed English after sign-out. No name, e-mail, user menu or "Main navigation" in the tree. The footer is a navigation landmark "Legal".
7. "Skip to content" on the sign-in page moves focus to the main region ("Dwello", "Sign in"), and the next Tab is "Sign in with Google". Works.
8. Tab to footer "Privacy", Enter. Announced: "Privacy - Dwello". Heading "Privacy" (h1) with h2 sections "What data Dwello stores", "Sign-in", "Sharing with third parties", "Cookies". Tab order: "Skip to content", "Sign in", "Help", "Language: English", "Privacy", "Terms of use". Nothing about me, no main navigation. ([privacy](screens/sven-i18n-4/06-privacy-en.png))
9. Back: Tab, Tab reaches "Sign in" right after the skip link. Enter, "Sign in - Dwello". Very quick.
10. Tab to the inline "Terms of use" link, Enter: "Terms of use - Dwello", h1 "Terms of use", h2 "Purpose", "Responsibility for statements", "Availability". Same short header with "Sign in" and "Help". Back the same way. ([terms of use](screens/sven-i18n-4/07-terms-en.png))
11. Tab, Tab to "Help", Enter: "Help - Dwello". h1 "Help", h2 sections per task, then "Terms explained" as a description list (term/definition pairs are announced as such). The header here has only "Sign in" and the language button; the Help link is left out on its own page, which is sensible. No signed-in traces. "Skip to content" works here as well. ([help](screens/sven-i18n-4/08-help-en.png))
12. Back with "Sign in": "Sign in - Dwello". Done.
13. Extra check: typing /dashboard after sign-out sends me to "/login?redirectTo=%2Fdashboard" ("Sign in - Dwello"). The session is really gone.
14. Extra check: Escape in the language menu on the sign-in page closes it and returns focus to "Language: English". Good.

## 4. Language

- No German or other non-English text after switching, on the dashboard, the user menu, the sign-in page, Privacy, Terms of use and Help. Page titles, the skip link, landmark names ("Main navigation", "Language selection", "Legal") and the route announcements are English too.
- Words that read oddly or that I did not understand:
  - "Re-let" on the dashboard ("0 Re-let") is unusual; the Help explains it ("a future rental contract has been signed"), so I could look it up.
  - "Blocked" as a rental status is explained in Help too.
  - Help text uses Swiss guillemets around UI names («Buildings», «Add rental contract»). A screen reader reads them as "left-pointing double angle quotation mark" in some verbosity settings; not wrong, but noisy.
- The sign-in text says "Sign in with your existing account", while Privacy says "You sign in through Google or Microsoft". Only Google is offered on the sign-in page, so "Microsoft" confused me slightly.

## 5. Layout at my viewport

Desktop 1440 px: no overflow, no clipped text. The language control sits top right on the dashboard and on all signed-out pages, always reachable within 3 Tabs. The user menu panel does not cover the language button. Focus rings are visible on every control I reached.

## 6. Error risks

- After choosing a language, focus falls back to the page body and nothing is announced. A screen reader user hears silence and may think the choice failed, then choose again.
- The user menu does not react to arrow keys while the language menu does. A user who learned the language menu presses Arrow Down, hears nothing change and may believe the menu is empty.
- Sign out has no confirmation message; on a shared computer a user may wonder whether it really worked. The "Sign in" heading mostly answers that.

## 7. Suggestions

- **Minor**: after changing the language, put focus back on the language button (now "Language: English") or announce the change, so the user gets feedback instead of silence.
- **Minor**: let the user menu respond to Arrow Up/Down like the language menu, or make both behave the same way (both Tab-only disclosure or both arrow-key menus).
- **Minor**: show a short status on the sign-in page after signing out ("You have been signed out.") announced in a polite live region.
- **Minor**: on the signed-out pages, the "Sign in" / "Help" links and the language control are outside any banner landmark; wrapping them in a header would let screen reader users jump there by landmark like on the dashboard.
- **Minor**: align Privacy ("Google or Microsoft") with the sign-in page, which offers only Google.

No Blocker or Major findings.
