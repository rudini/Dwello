# Fachreview Landing Page «warm», Runde 2

Gegenstand: `git diff eaa6240 a2ef734 -- marketing/index.html marketing/i18n marketing/{fr,it,en}/index.html` (Worktree `review-landing-warm-fach2`, Commit a2ef734). Vorbericht: `docs/reviews/landing-warm-fachreview-1.md`. Die Bilder `marketing/shots/*` sind im Delta unverändert.

## Status der offenen IDs

| ID | Rolle | Schwere | Status |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | Major | erledigt: `marketing/index.html:437` «etwa Juli bis Juni oder das Kalenderjahr», Labels `:436` «Das ganze Jahr», `:437` «Nach Periodenende»; fr/it/en (`fr.json`, `it.json`, `en.json`, die drei `index.html`) wie vorgeschlagen («par exemple de juillet à juin ou l’année civile», «ad esempio da luglio a giugno o l’anno civile», «say July to June or the calendar year»). Stimmt mit `docs/nebenkostenabrechnung-anforderungen.md:32`, den Werten der Einstellung im Glossar und mit Art. 4 Abs. 1 VMWG überein (keine Periode vorgeschrieben, Zitat in Runde 1). |
| V-2 | Verwalter | Minor | erledigt: Die Alt-Texte stimmen mit den Bildern überein. fr: Pierre Dubois, Appartement 2.01, Musterhaus Zentrum. it: Maria Rossi, Appartamento 3.01. en: Nina Brunner, Apartment A2, Seepark Residenz, mit den Kategorien «TV/Cable» und «Caretaker» im Bild (so heissen sie in `backend/migrations/0002_stammdaten.sql:21,25`), dazu «her». «ascenseur / ascensore et électricité des parties communes» ist für fr/it richtig: Allgemeinstrom 2025 ist im Musterhaus Zentrum gebucht (`demo-data.sql:134,139,143`). |
| V-3 | Verwalter | Minor | erledigt: `index.html:395` «Die Einrichtung, Updates und Datensicherungen macht jemand, der sich mit Computern auskennt; …». Das passt zu Installieren `:547` und FAQ `:689`; fr/it/en sagen dasselbe. |
| V-4 | Verwalter | Minor | erledigt: `en.json` `"Lift": "Elevator"`, `en/index.html:518` zeigt «Elevator», Beispielsatz und aria-label sagen «elevator». In `en/index.html` steht kein «lift» mehr. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

Nichts Neues. Der Punkt aus Runde 1 (ob der Mietvertrag die Abrechnungsperiode festlegt, **unsicher**) ist durch die neue Formulierung nicht mehr tragend: Der Text nennt nur noch Beispiele.

Geprüft: Zahlen im en-Screenshot (Nina Brunner, Mieterwechsel): TV/Cable 912.00 / 4 = 228.00, × 184/365 = 114.94 (12.6 %). Hauswart 784.13 × 184/365 = 395.29. 184 Tage = 01.07.–31.12. Der Absatz `:494`, der Hans Müller neben dem Screenshot einer anderen Person nennt, ist nicht falsch: Er behauptet nicht, dass das Bild Hans Müller zeigt.
