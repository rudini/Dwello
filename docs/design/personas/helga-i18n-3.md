# Persona run: Helga (68, little computer experience, large font), German, repeat run 3

Viewport: desktop, zoom 1.5. Language: Deutsch (the app's default; nothing to change).
Task: sign out with «Abmelden», then open «Datenschutz», «Nutzungsbedingungen» and «Hilfe» from the sign-in page by clicking only, getting back to the sign-in page each time.

## 1. Task completed

**Yes.** Sign-out worked on the first try via the name menu, and each of the three pages has an «Anmelden» link at the top left that brings me straight back to the sign-in page. No page after sign-out shows my name, my e-mail or the app menu.

## 2. Effort

- Screens: dashboard, open name menu, sign-in page, Datenschutz, sign-in, Nutzungsbedingungen, sign-in, Hilfe, sign-in (9 screens).
- Clicks: 2 to sign out (name, then «Abmelden») and 2 per page (open, then «Anmelden»), 8 in total.
- Time: about 2 to 3 minutes for a slow user. The only search was for the sign-out control.

## 3. Thinking aloud

1. Dashboard. I don't see «Abmelden» anywhere. Top right shows "Vera Verwalter" with a person icon. I guess the sign-out is behind my name and click it.
2. A small menu opens with "verwalter@example.com", «Einstellungen» and «Abmelden», in red with an arrow. That is clear. ([02-usermenu](screens/helga-i18n-3/02-usermenu.png))
3. Clicking «Abmelden» brings me straight to «Anmelden». There is no message like "Sie sind abgemeldet", but the big «Anmelden» heading and the missing name tell me it worked. «Hilfe» is at top left, «Deutsch» at top right, and «Datenschutz» and «Nutzungsbedingungen» are at the bottom. ([03-after-logout](screens/helga-i18n-3/03-after-logout.png))
4. «Nutzungsbedingungen» appears twice (in the sentence under the button and in the footer). I find the footer first, which is fine.
5. «Datenschutz» (footer): the page has a clear heading and short sections in boxes. Top left now shows «Anmelden» and «Hilfe», so I know how to get back. No name, no menu. ([04-Datenschutz](screens/helga-i18n-3/04-Datenschutz.png))
6. Some words here I don't understand: "PostgreSQL-Datenbank", "SMTP-Server oder Resend", "XSRF", "Google Fonts". The rest reads well.
7. The page says the sign-in works "über Google oder Microsoft", but the sign-in page only offers «Mit Google anmelden». I wonder where Microsoft is.
8. «Anmelden» at the top brings me back to the sign-in page. Good.
9. «Nutzungsbedingungen»: short and in plain German. Back via «Anmelden». ([06-Nutzungsbedingungen](screens/helga-i18n-3/06-Nutzungsbedingungen.png))
10. «Hilfe» (top left of the sign-in page): numbered steps and a list of terms at the end («Begriffe kurz erklärt»), which I like. Only «Anmelden» is at the top (no «Hilfe» link, since I'm already there). ([08-Hilfe](screens/helga-i18n-3/08-Hilfe.png))
11. The help talks about «Gebäude», «Mieter», «Dokumente» and so on, which I cannot see while signed out. That is fine because it is meant for after sign-in. "Mietstagen" reads oddly to me ("Miettage"?), but the term list explains "Mietstage".
12. Back to the sign-in page again. ([09-back](screens/helga-i18n-3/09-back.png))
13. Extra check (not by clicking a page control): the browser's Back button after sign-out shows the sign-in form, not my data, and typing /dashboard also leads to sign-in. Good.

## 4. Language

- All visible texts were in German. I found no English or other-language strings on these screens, apart from proper names (Google, Microsoft, PostgreSQL, Resend, Google Fonts).
- Words I did not understand (Datenschutz page): "PostgreSQL-Datenbank", "SMTP-Server", "Resend", "XSRF", "Google Fonts", and partly "Sitzung führen" and "Sitzungs-Cookie, das für JavaScript nicht lesbar ist".
- Odd reading: "nach Mietstagen" (Hilfe). As a lay person I would expect "Miettage", though the term is explained in the glossary.
- Mismatch: Datenschutz says sign-in works "über Google oder Microsoft", but only «Mit Google anmelden» is offered.

## 5. Layout at my viewport (desktop, zoom 1.5)

- No horizontal scrolling on any screen. No clipped or overlapping text.
- The language control «Deutsch» sits top right on every page, both signed in and signed out.
- On the sign-in page, «Hilfe» sits alone at the far top left, small and easy to miss, but it was enough.
- The sign-in card is short. Below the footer, the lower half of the screen is empty grey. This is not a problem.

## 6. Error risks

- Sign-out is hidden behind my name. Someone who doesn't think of clicking the name won't find «Abmelden». At least the person icon hints at it.
- Signing out has no confirmation and no "Sie sind abgemeldet" message. That is fine here, but the help says unsaved drafts are kept "bis Sie … sich abmelden". So signing out silently throws away an unsaved draft of «Mietvertrag erfassen» or «Abrechnungen erstellen» without warning. I could not test this within my task.
- The Microsoft mention could lead me to look for a Microsoft button that does not exist.

## 7. Suggestions

- **Minor:** Show a short note on the sign-in page after sign-out, e.g. "Sie sind abgemeldet."
- **Minor:** Replace the technical words on «Datenschutz» with plain ones, for example "in der Datenbank des Betreibers", "über den Mailversand des Betreibers", "Schutz vor gefälschten Anfragen" without "XSRF".
- **Minor:** Make the Datenschutz text match the sign-in options actually offered (Google only), or show the Microsoft option.
- **Minor:** "nach Mietstagen" in Hilfe: consider the plainer "Miettage", if the glossary allows it.
- **Minor:** If an unsaved draft exists, warn about it at «Abmelden» (not verified in this run).

Blocker: none. Major: none.
