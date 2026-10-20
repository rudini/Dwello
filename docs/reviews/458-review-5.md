# Code-Review Runde 5, PR #515 (#458): Konfliktlösung Merge origin/main (6980519e)

Geprüft im Worktree `review-458-code5` (detached 6980519e). Grundlage: Vergleich Schlüssel für Schlüssel über Merge-Basis 7261d21a, PR-Seite 5defa1e1, main 07406740 (#514) und Merge 6980519e für alle vier `messages/*.json`, dazu `git show --remerge-diff 6980519e -- messages` und `git diff 6980519e^2 6980519e -- messages`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Bestätigt

- **JSON und Schlüssel:** Alle vier Dateien lassen sich als JSON parsen, jede hat 1823 Schlüssel, und die Schlüsselmengen sind gleich. Gegenüber main fehlt kein Schlüssel.
- **de/en:** Der remerge-diff zeigt nur, dass die PR-Schlüssel ans Dateiende verschoben wurden (`legal_as_of`, `privacy_stored_country`, `privacy_controller_4`, `privacy_mail_smtp_provider`, `terms_no_contract`, `terms_processor`, `terms_responsibility_3..5`). Die Werte gleichen genau denen der PR-Seite.
- **Texte aus #514 bleiben erhalten:** Alle Schlüssel, die nur main geändert hat, stehen im Merge genau wie in main. Alle Schlüssel, die nur die PR geändert hat, stehen genau wie auf der PR-Seite, mit diesen Ausnahmen:
  - **fr `privacy_mail_smtp_provider`:** Der einzige Unterschied zur PR-Seite: «Les décomptes des charges, les rappels de paiement et les rappels» wird zu «Les décomptes des charges et les rappels». Das folgt `privacy_mail_smtp` fr aus #514, wie die Anforderung verlangt. Der Rest des Satzes bleibt unverändert, auch die Datenliste zu Rappel und Décompte.
  - **it `privacy_controller_1`, `_none`, `_2`, `_3`, `_4`, `terms_processor`, `terms_responsibility_3`, `_4`:** Ohne Gross-/Kleinschreibung verglichen gleichen sie der PR-Seite genau. Es wurden nur Höflichkeitsformen klein geschrieben (Suoi/Suo/Sua → suoi/suo/sua, chiederLe → chiederle, raggiungerLa → raggiungerla); «Lei» bleibt gross. Kein Satz hat Inhalt verloren.
  - **fr/it `privacy_demo_1`:** Der Merge-Text beginnt genau mit dem main-Text aus #514 (fr mit U+00A0, it mit «suo»). Danach folgt genau der Demo-Satz der PR («Dans la démo, l’exploitant est le responsable du traitement de toutes les données.» / «Nella demo il titolare del trattamento di tutti i dati è il gestore.»). Gegenüber der PR-Seite unterscheidet sich fr nur in den Leerzeichen (U+00A0).
- **Regeln aus #405 für die 17 Schlüssel, die diese PR gegenüber main hinzufügt oder ändert** (privacy_*, terms_*, `login_terms_before`, `legal_as_of`, per Skript geprüft):
  - fr: kein gewöhnliches Leerzeichen vor `: ; ? ! %` und keine Guillemets ohne geschütztes Leerzeichen. Die Prüfung erkennt nachweislich «a :» und lässt «a :» durch.
  - it: keine gross geschriebenen Höflichkeitsformen (Suo/Sua/Suoi/Sue/Le/La, auch nicht angehängt wie -La/-Le).
  - en/de/it: keine “” oder „. Die neuen en-Texte verwenden «» (z. B. `terms_responsibility_3`, `privacy_demo_1`). In `en.json` stehen insgesamt keine “ oder ” mehr.
- **Inhalt aus #458 und 458-fachreview-1:** In keinem Konfliktschlüssel fehlt ein Satz oder Satzteil. Die einzigen Unterschiede sind Gross-/Kleinschreibung (it), Leerzeichen (fr) und die vorgegebene Angleichung an `privacy_mail_smtp` (fr).

## Nicht bestätigt

- `bun run lint`, `bun run check` und die Tests zu i18n, privacy, terms, login, design-guard und open-work (616): **vom Aufrufer gemeldet**. Mein erneuter Lauf von `bunx vitest run` (i18n, privacy, terms) im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab. `node_modules` im Worktree ist wegen einer Deny-Regel für `/home/user/Dwello/node_modules` nicht lesbar, und ich habe nichts installiert.
- Ob die Kleinschreibung im Italienischen («il suo nome» für den Betreiber neben «al suo fornitore» für den Vermieter in `privacy_controller_none`) bei Muttersprachlern Missverständnisse auslöst, habe ich nicht geprüft. Sie folgt der Regel von #405/#514 und gleicht dem Text auf main; sprachlich ist das nicht bewertet.
- Die übrigen Dateien des Merges (Backend, Docs von main) habe ich nicht geprüft. Laut `git show --remerge-diff --stat` betrifft die Konfliktlösung nur die vier `messages/*.json`.
