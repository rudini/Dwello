# Persona run: Sven (screen reader, keyboard only, desktop), English, second repeat run

Sven, 45, uses a screen reader and only the keyboard. Desktop viewport (1440 px). Everything was done with `page.keyboard`. I checked what he hears with `readOut(page)`, the accessible name of the focused element, and the live regions. Scripts are in `/tmp/claude-0/persona-sven-3/`.

## 1. Task completed

**Yes, with one Major finding.** I switched the dashboard to English with the language control using the arrow keys. I signed out with the user menu. On the sign-in page I reached both "Privacy" and "Terms of use" by Tab, opened the privacy notice, read it, and returned to sign-in with the keyboard. The landmarks and the focus order are clean and everything is in English.

The Major finding: if I go from sign-in to "Privacy" or "Terms of use" straight after signing out, the page shows the full signed-in shell. That includes "Vera Verwalter User menu" and the whole "Main navigation". I could reproduce it every time (3 of 3 runs). A full page reload shows the correct signed-out page.

## 2. Effort

- Screens: dashboard (de, then en), user menu, sign-in, privacy, terms. About 6 screens.
- Keystrokes: about 3 Tab, Enter, End and Enter to switch the language. About 4 Tab, Enter, 2 Tab and Enter to sign out. 5 Tab and Enter from sign-in to Privacy. 2 Tab and Enter back to sign-in. Roughly 25 keystrokes in all.
- Time: about 3 to 4 minutes for a practised screen reader user.

## 3. Thinking aloud

1. Dashboard (German). Tab 1 "Zum Inhalt springen", Tab 2 "Dwello", Tab 3 "Sprache: Deutsch". The control is easy to find and its name includes the current language.
2. Enter opens it and moves focus to "Deutsch". ArrowDown/ArrowUp move through "Deutsch, Français, Italiano, English", and Home/End jump to the first and last item. Each item has a `lang` attribute, so my screen reader pronounces "Français" correctly, and the current language has `aria-current`. Escape closes the menu and puts focus back on the button. Tabbing out of the menu also closes it. ([02-language-menu](screens/sven-i18n-3/02-language-menu.png))
3. End, then Enter on "English". The page reloads in English: title "Overview - Dwello", `lang="en"`, button "Language: English". Focus goes back to the top of the document. I hear the new page title, but nothing tells me "language changed", and I have to Tab through "Skip to content" and "Dwello" to get back to the control. That is acceptable, because it behaves like a new page load. ([03-dashboard-en](screens/sven-i18n-3/03-dashboard-en.png))
4. The whole dashboard reads in English: "Next to do", "Deadlines", "Common tasks", "Buildings at a glance", "Payment deadline · Hans Müller in 16 days". Landmarks: banner, navigation "Main navigation", main with named regions, contentinfo.
5. Tab 4 is "Vera Verwalter User menu". Enter expands it. Unlike the language menu, ArrowDown does nothing here and focus stays on the button. Tab reaches "Settings", then "Sign out". Escape closes the menu and returns focus to the button. The two menus in the same header behave differently. ([04-user-menu](screens/sven-i18n-3/04-user-menu.png))
6. Enter on "Sign out". I land on "Sign in - Dwello". The assertive live region announces "Sign in - Dwello". English is kept. Focus is on the document start. ([07-login-en](screens/sven-i18n-3/07-login-en.png))
7. Sign-in landmarks: "Skip to content" link, navigation "Language selection", main (h1 "Sign in"), contentinfo with navigation "Legal". Tab order: Skip to content, Language: English, Sign in with Google, Terms of use (inline), Privacy, Terms of use (footer), then back to the browser. This is logical and matches the visual order. Shift+Tab reverses it correctly. "Skip to content" moves focus to main, and the next Tab is "Sign in with Google".
8. "Terms of use" appears twice (inline and in the footer). This is fine for me, because both go to the same page and the context makes clear why.
9. Tab 5 "Privacy", then Enter. The title is "Privacy - Dwello" and it is announced. The headings are clear (h1 "Privacy", then h2 "What data Dwello stores", "Sign-in", "Sharing with third parties", "Cookies"), so I can jump by heading. All text is English. ([06-privacy-en](screens/sven-i18n-3/06-privacy-en.png))
10. **Problem.** On the privacy page I expected the signed-out layout. When I come straight from sign-out, I instead hear banner, "Dwello", "Language: English", "Vera Verwalter User menu" and the whole "Main navigation" with Overview, Buildings, Tenants and so on. I believe I am signed in again. When I follow "Overview" I end up at "Sign in" (`/login?redirectTo=/dashboard`). The same happens on "Terms of use". After a reload (or opening the page directly), privacy shows the correct signed-out layout: "Skip to content", "Sign in", "Language selection", main, footer. ([10-privacy-after-signout](screens/sven-i18n-3/10-privacy-after-signout.png))
11. Back to sign-in. On the correct signed-out privacy page, Tab 2 is the link "Sign in", and Enter takes me back. This works, but the "Sign in" link is outside every landmark (no banner or navigation around it), so I do not find it when I jump by landmark. On the faulty signed-in shell, the only way back is "Dwello" or "Overview", which then redirect to sign-in.
12. Alt+Left (browser back) did nothing in this test browser. I cannot say whether that is the app or the test setup, so it is not a finding.

## 4. Language

- **Everything I heard was English** on the dashboard, in the user menu, and on sign-in, privacy and terms. The German-word scan found no hits on privacy and terms. `lang="en"` is set on `<html>`.
- The language names are in their own language with matching `lang` attributes. This is correct.
- Words that may be unclear to a non-technical landlord on the privacy page: "PostgreSQL database", "SMTP server", "Resend", "XSRF". They are not wrong, but they are jargon.
- "categorised" uses British spelling. This is fine and consistent.
- The privacy page says "Fonts and symbols are loaded from Google Fonts. Google receives the browser's IP address." I only note this, so that someone checks it is still accurate.

## 5. Layout at my viewport

- Desktop 1440 px. Nothing is cut off or overlapping. The language control sits at the top right on every page. Focus rings are clearly visible on the language menu items.
- Sign-in has a centred card and a full-width footer, with no horizontal scrolling.

## 6. Error risks

- **False "still signed in" state after sign-out** (step 10). On a shared computer, the next person hears and sees "Vera Verwalter" and the full navigation. A screen reader user cannot tell whether the sign-out worked. The data itself is protected (links redirect to sign-in), but the user's name is exposed and the user is misled.
- Two different keyboard models in one header: the language menu uses arrows and the user menu uses only Tab. I pressed ArrowDown in the user menu and nothing happened. This is not a blocker, because Tab works.
- After switching language, focus resets to the top. It is not lost, just restarted.

## 7. Suggestions

1. **Major:** after "Sign out", the privacy and terms pages reached by client-side navigation from sign-in still render the signed-in shell ("Vera Verwalter User menu", "Main navigation"). Invalidate the user/layout data on sign-out (or do a full navigation), so that public pages show the signed-out layout.
2. **Minor:** put the "Sign in" link on the signed-out privacy and terms pages inside a landmark (banner or navigation), so landmark navigation finds it.
3. **Minor:** make the user menu respond to ArrowDown/ArrowUp like the language menu, or make neither use arrows, so the header is consistent.
4. **Minor:** the user menu button's accessible name "Vera Verwalter User menu" runs together. "User menu, Vera Verwalter" or a separator would be clearer.
5. **Minor:** after the language change, consider a short polite announcement ("Language changed to English") or returning focus to the language button.
6. **Minor:** on privacy, explain or drop jargon ("PostgreSQL", "SMTP", "XSRF") for non-technical landlords.
7. **Minor:** after sign-out, say on the sign-in page that the user was signed out ("You have been signed out."), so it is confirmed rather than only implied by the page title.
