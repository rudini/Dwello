# Persona test: Marco (38), employed, phone only, impatient, round 7

Date: 10.10.2026
Viewport: mobile (390 x 844, touch, de-CH), zoom 1, demo data on http://localhost:3300

## 1. Task completed

**Partly.**

- **(1) Last year's invoice: yes, but only by hand.** I recorded "Hauswartung Müller AG", 15.11.2025, CHF 480.00, for Alpenblick, as "Umlagefähig". The AI categorization did not work: the list showed "Ohne Kategorie" and "Ausstehend". The detail page showed "Kategorisierung ausstehend", and tapping "Neu kategorisieren" returned "Kategorisierung fehlgeschlagen – Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert." I set the category myself in "Rechnung bearbeiten" to "Hauswart". Choosing the category did not fill in a Verteilschlüssel ("Nicht zugewiesen"), so I edited the invoice a second time and picked "Pro Fläche (m²)". That was a guess on my part. Final state: "Manuell kategorisiert", Kategorie "Hauswart", Verteilschlüssel "Pro Fläche (m²)".
- **(2) Mark a statement paid: yes.** Hans Müller, NK-11111111-2024-0001, "Versendet", "Nachzahlung CHF 254.18". I tapped "Bezahlt" and confirmed "Als bezahlt markieren". It now shows "Bezahlt", "Bezahlt am 10.10.2026". It was the only open statement. The other two were "Bezahlt" and "Entwurf".
- **(3) Document list: yes.** It is in the burger menu under "Nebenkosten" → "Dokumente". The list is empty: "Noch keine Dokumente – Mahnungen, die Sie bei einer Nebenkostenabrechnung senden, erscheinen hier." The page explains that letters are printed, sent by post and then marked as "versendet". It has the filters "Alle" and "Zu versenden".

## 2. Effort

- Task 1: 5 screens (Übersicht → Neue Rechnung → Rechnungen → Rechnung detail → Rechnung bearbeiten, twice). About 20 taps and 4 text fields. About 4 minutes, half of it waiting for and then working around the AI.
- Task 2: 3 screens (menu → Nebenkostenabrechnungen → dialog). 4 taps, under 1 minute.
- Task 3: 2 taps (menu → Dokumente), 15 seconds.
- **Sideways scrolling / zoom / small targets:**
  - Sideways, 2 places:
    - Statements list: the title "Nebenkostenabrechnungen" is wider than the screen and gets cut off. The page is 425 px wide on a 390 px screen.
    - Statement detail: the "Kostenaufstellung" table makes the whole page 716 px wide, and the page itself moves sideways, header included (screenshot 08).
  - Zoom: none needed.
  - Too-small buttons: none that bothered me. The buttons I tapped were all at least 48 px high. The breadcrumb links ("Rechnungen", "Nebenkostenabrechnungen") are only 24 px high, but I did not need them.

## 3. Thinking aloud

1. **Übersicht.** First thing at the top: "Nebenkostenabrechnungen erstellen … Erfassen Sie zuerst alle Rechnungen dieser Periode". That fits my paper invoice. Under "Häufige Arbeiten" there is "Rechnung erfassen", one tap. Good.
2. **Neue Rechnung** (01). The hint under "Rechnungsdatum" is exactly what I need: "Übernehmen Sie das Datum von der Rechnung, nicht das heutige." The field is pre-filled with today, and I would have overlooked that without the hint. The date picker displayed "10/10/2026" (month/day order?). The weekday line below it ("Samstag, 15. November 2025") reassured me that I had the right date. I left "Kategorie (optional)" and "Verteilschlüssel (optional)" empty, because I thought the app sorts that itself. Tapped "Rechnung speichern".
3. **Rechnungen list** (02). A toast says "Rechnung von Hauswartung Müller AG gespeichert", but it sits on top of the "Umlagefähigkeit" filter. My invoice is at the top with "Ohne Kategorie" and a yellow "Ausstehend". I wondered whether it counts for 2025 at all as long as it is "Ausstehend". The list does not say.
4. **Invoice detail.** Waited about 30 s and reloaded: still "Kategorisierung ausstehend", Kategorie "Nicht kategorisiert", Verteilschlüssel "Nicht zugewiesen". Tapped "Neu kategorisieren" and got the red box "Kategorisierung fehlgeschlagen" (03). OK, at least it is honest. **But** after a reload the red box is gone and the badge says "Kategorisierung ausstehend" again, as if something were still running. Someone who comes back later would wait for nothing.
5. **Rechnung bearbeiten.** Picked "Hauswart" (the list has 21 categories, so a lot of scrolling in the native picker, but fine). I expected the Verteilschlüssel to follow from the category. It did not, and after saving it said "Verteilschlüssel: Nicht zugewiesen". So I edited again and guessed "Pro Fläche (m²)". I don't know whether "Pro Einheit" would have been correct. The demo statement later shows Hauswart as "Pro Einheit" for the other building, so I probably guessed differently from the default. Nothing in the form says what happens to an invoice without a Verteilschlüssel in the statement. The "Betrag" field in the edit form showed "480" instead of "480.00". Small, but it made me check twice.
6. **Menu → Nebenkostenabrechnungen** (05). The title is cut off on the right ("Nebenkostenabrechnunge…"), and the page wobbles sideways when I swipe. The status tiles at the top are nice: "1 Versendet". In the list, Hans Müller, "Versendet", "Nachzahlung CHF 254.18", has a "Bezahlt" button next to "PDF". Exactly what I was looking for.
7. **Dialog** (06). "Das heutige Datum wird als Zahlungsdatum eingetragen." Fine for me today, but if the money arrived last week I cannot change the date. "Als bezahlt markieren" → badge turns green "Bezahlt" (07). No toast, but the badge and the tile "2 Bezahlt" are enough.
8. **Statement detail** to double-check (08). "Bezahlt am 10.10.2026" is there. But the cost table is too wide: the whole page slides sideways, the burger icon is half off-screen and the title is cut ("brechnung NK-…"). The "Verlauf" box does not list the payment, and I see no way to undo it if I tapped the wrong tenant.
9. **Menu → Dokumente** (09). Empty: "Noch keine Dokumente". The text explains that reminders (Mahnungen) you send from a statement appear here, and then you print, post and mark them "versendet". Clear enough. I don't currently have an overdue statement, so there is nothing to remind anyone about. Fine.

## 4. Terms I did not understand

- **"Ausstehend"** (badge in the invoice list): outstanding payment? outstanding categorization? Only the detail page says "Kategorisierung ausstehend".
- **"Verteilschlüssel"**: I roughly know it, but not which one is right for Hauswartung. There is no hint or default per category.
- **"Umlagefähig"**: understood from the helper text ("fliesst in die Nebenkostenabrechnung ein").
- **"Manuell"** badge on demo invoices: it means manually categorized, but on its own in the list it is cryptic.

## 5. Error risks

- **Invoice stays without a Verteilschlüssel** when the AI is down and the user only picks a category. It is unclear whether it is silently left out of, or wrongly distributed in, the 2025 statement.
- **Wrong Verteilschlüssel by guessing.** I chose "Pro Fläche (m²)". The app's own demo uses "Pro Einheit" for Hauswart. Two buildings could end up with inconsistent keys.
- **The failure message is lost on reload.** "Kategorisierung ausstehend" reappears and suggests the AI is still working.
- **Payment date is always today.** A late recording creates a wrong "Bezahlt am".
- **Marking paid cannot be undone** (no visible action on the list or detail page), and the payment is not in "Verlauf". A mis-tap on the wrong row is hard to fix.
- **The date picker pre-filled with today** (shown as 10/10/2026) is easy to leave unchanged. Without the hint, the invoice would land in 2026.

## 6. Suggestions

- **Major:** Statement detail: make the "Kostenaufstellung" table scroll inside its own box, or stack it as cards on mobile, so that the page does not become 716 px wide and the header does not slide away (08).
- **Major:** When categorization fails or the AI is unreachable, keep that status after a reload: "Kategorisierung fehlgeschlagen – bitte manuell zuordnen" instead of "ausstehend". Show the same state in the invoice list.
- **Major:** When a category is chosen manually, pre-fill its default Verteilschlüssel (as configured under "Kategorien"). If none is set, warn before saving that the invoice has no Verteilschlüssel and say what that means for the statement.
- **Minor:** Let the user pick or edit the "Bezahlt am" date in the mark-paid dialog (default today).
- **Minor:** Offer "Zahlung zurücksetzen" on the statement detail page, and log "Bezahlt" in "Verlauf".
- **Minor:** Let the H1 "Nebenkostenabrechnungen" wrap or hyphenate (`hyphens: auto` / `overflow-wrap`) on narrow screens (05).
- **Minor:** Invoice list: replace the bare badge "Ausstehend" with "Kategorie ausstehend" or "Kategorisierung fehlgeschlagen".
- **Minor:** Place the save toast so that it does not cover the filter fields at the top of the invoice list (02).
- **Minor:** The edit form shows "480" instead of "480.00". Use the same CHF format as the create form.

Screenshots: `screens/marco-7/01-rechnung-erfassen-formular.png` to `09-dokumente-leer.png`.
