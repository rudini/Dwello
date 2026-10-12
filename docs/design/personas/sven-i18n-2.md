# Persona run (repeat): Sven, screen reader and keyboard only, English, desktop

Date: 2026-10-12. App: http://localhost:3300 (demo data). Operated only with `page.keyboard` (Tab, Shift+Tab, Enter, Space, arrow keys, Home, End, Escape). What a screen reader announces was taken from the accessibility tree (`readOut`) and the accessible name of the focused element. Scripts: `/tmp/claude-0/persona-sven-2/`.

## 1. Task completed

**Yes.** I found the language control by keyboard, chose English with the arrow keys and with Tab, and signed out with the app's own "Sign out" button. On the sign-in page I switched the language and followed "Terms of use". I then opened /help and /privacy while signed out, switched to Français and back to English, and stayed on the same page each time. The language survived sign-out and reload. I found no German text after switching. I found no blockers. The open points are about focus after a language switch and about dead ends on the signed-out pages.

## 2. Effort

- Screens: dashboard, user menu, sign-in, terms, help and privacy. I tested help and privacy at 1440 px and at 390 px.
- Keystrokes: switching the language from the top of a page takes 4–5 keys (Tab, Tab, Enter, End, Enter). Signing out from the dashboard takes 4 Tabs, Enter, then 2 Tabs and Enter.
- Time: about 15 minutes, including the mobile run.

## 3. Thinking aloud

1. Dashboard (German). Tab 1: "Zum Inhalt springen". Tab 2: "Dwello". Tab 3: "Sprache: Deutsch", a button with `aria-expanded=false`. I find it on the third Tab, so it is easy to reach.
2. I press Enter. The button reads "Sprache: Deutsch, expanded" and a list of four buttons appears: "Deutsch", "Français", "Italiano", "English" ([screenshot](screens/sven-i18n-2/02-menu-open.png)). Focus stays on the button.
3. Arrow keys work. ArrowDown moves to "Deutsch", then "Français", "Italiano" and "English". ArrowUp goes back one item. Home jumps to "Deutsch" and End to "English". Escape closes the menu, returns focus to the button and sets `aria-expanded` back to false. This is good.
4. Tab also works. Space opens the menu, then Tab moves through Deutsch, Français, Italiano and English and on to "Vera Verwalter Benutzermenü". The menu closes when I tab out. Each option carries its own `lang` attribute, so a screen reader pronounces "Français" in French. The current language has `aria-current="true"` and a check mark.
5. I chose English (End, Enter). The page reloads fully and `<html lang>` becomes "en". The title is now "Overview - Dwello", and the navigation and main content are all in English ([screenshot](screens/sven-i18n-2/03-dashboard-en.png)). **Focus lands on the document body**, and the live regions stay empty. A screen reader announces the new page load, but I have lost my place. My next Tab starts again at "Skip to content", not at the language button. It took me two more Tabs to get back to where I was.
6. I also chose Français with Tab and Space. The result was the same: the switch worked and focus went to the top of the page.
7. ArrowDown on the closed language button does nothing; only Enter or Space opens the menu. That is acceptable for a disclosure button.
8. The user menu "Vera Verwalter User menu" opens with Enter and shows "verwalter@example.com", "Settings" and "Sign out". **ArrowDown, End and Home do nothing here**, unlike the language menu. Focus stays on the button, so I have to Tab to "Sign out". The two header menus behave differently.
9. Tab, Tab, Enter on "Sign out" took me to `/login` in English, so the language survived sign-out. The title is "Sign in - Dwello", and the route announcer said "Sign in - Dwello". Nothing tells me "You have been signed out", although the page itself makes that clear.
10. In a fresh signed-out browser the sign-in page is German ("Anmelden - Dwello"). Tab, Tab reaches "Sprache: Deutsch", inside a navigation landmark called "Sprachwahl". I pressed Enter, End, Enter, and the page is now English: "Sign in", "Sign in with Google", "By signing in you accept the Terms of use." ([screenshot](screens/sven-i18n-2/06-login-en.png)). Focus went to the body again.
11. I tabbed to "Terms of use" and pressed Enter. I am on /terms, and the announcer said "Terms of use - Dwello". The headings are "Purpose", "Responsibility for statements" and "Availability" ([screenshot](screens/sven-i18n-2/07-terms-en.png)). The text is clear. The page has **no link back to sign-in and no link to Privacy**: Tab goes from "Skip to content" to "Language: English" and then off the page. I have to use the browser's Back.
12. I opened /help directly while signed out, with English already chosen. It shows a clear list of steps and a definition list "Terms explained" ([screenshot, 1440 px](screens/sven-i18n-2/desktop-help-en.png)). I switched to Français (Tab, Tab, Enter, ArrowDown to "Français", Enter) and stayed on /help, with the title "Aide - Dwello". I switched back to English and was still on /help. No German remained.
13. I did the same on /privacy: Français gave "Protection des données - Dwello", and back to English stayed on /privacy. No German remained.
14. Mobile run at 390 px for /help and /privacy: the text has 16 px on both sides and nothing scrolls sideways ([screenshot, privacy in French](screens/sven-i18n-2/mobile-privacy-fr.png)). The language switch also stays on the same page there.
15. I reloaded /privacy and it was still English. The setting is kept in a `PARAGLIDE_LOCALE` cookie, which also survived sign-out.

## 4. Language

- **No German** in English on the dashboard, sign-in, terms, help or privacy, including page titles, landmark names ("Language selection", "Main navigation"), the skip link and the route announcer. After the round trip to Français and back I found no German either.
- Translations that read oddly:
  - On Terms, "The **management** is responsible for informing the tenants…" stands next to "The **property manager** remains responsible…". Two different words for the same role read as two different parties.
  - On Help, "re-let (a future rental contract has been signed)" is an unusual term. I understood it only from the explanation.
  - On Privacy, "Fonts and symbols are loaded from Google Fonts. Google receives the browser's IP address." This is clear, but it surprised me in a privacy-friendly app.
- Words I did not understand: none. "Allocable" is explained under "Terms explained".

## 5. Layout at my viewport

- **1440 px (signed out):** the text column is 768 px wide and starts 144 px from the left edge, leaving 528 px empty on the right. The margins are normal and nothing is clipped, but the column sits left of centre while the language button sits at the far right. The page looks unbalanced, though it reads fine.
- **390 px:** the side margins are 16 px each, with no horizontal scrolling (`scrollWidth` = 390) and no clipped text. The French headings wrap cleanly.
- **Language control:** the button is at least 48 px high with a visible focus ring. Its name ("Language: English") always states the current language, and the open menu does not cover the control.

## 6. Error risks

- After any language switch, focus goes to the document body. With a screen reader I have to find my way back and could think the switch did nothing. The live regions stay silent.
- On the signed-out Terms, Help and Privacy pages the only interactive elements are the skip link and the language button. There is no way back to sign-in from inside the page.
- Arrow keys work in the language menu but not in the user menu. A keyboard user who learned one may expect the other to behave the same.
- The Privacy page lists only the session and XSRF cookies, but the app also sets a language cookie (`PARAGLIDE_LOCALE`). That statement is not quite accurate.

## 7. Suggestions

- **Minor:** after a language switch, put focus back on the language button, or on the `h1`. The switch is a full reload, so a short note on the new page would also help, for example "Language changed to English" or focus on the button.
- **Minor:** give the user menu the same keyboard behaviour as the language menu (ArrowDown, ArrowUp, Home, End), or remove arrow-key handling from both so they behave alike.
- **Minor:** add a "Back to sign-in" link, or the Dwello brand link, on the signed-out Terms, Help and Privacy pages. Also link Terms and Privacy to each other.
- **Minor:** on Terms, use one word for the responsible role ("property manager" or "management").
- **Minor:** on Privacy, mention the language cookie under "Cookies".
- **Minor:** at 1440 px, centre the signed-out text column, or align it with the language control.

**Blocker / Major: none.**
