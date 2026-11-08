# Fach-Review #1261, Runde 1 (Schritt 1, vor der Umsetzung)

Gegenstand: @wip-Szenario «Während des Löschens sieht «Abbrechen» aus wie sonst und tut nichts» (`tests/e2e/features/tenant-documents.feature:152-165`, Commit 4c11034) und der Satz für `Dialog.svelte` im Zustand `busy`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Vorläufiger Satz «Dwello führt die Aktion aus. Sie lässt sich nicht mehr abbrechen.» (Szenario Z. 162, 163): Der zweite Satz beginnt mit «Sie». In einer App, die den Nutzer durchgehend mit «Sie» anspricht, liest man das beim ersten Lesen als «Sie (der Nutzer) lassen sich …». Das Verb «lässt» klärt es zwar, ein unerfahrener Nutzer stolpert aber, und ein Screenreader liest es ohne Grossschreibung vor. Lösung: ohne Pronomen formulieren, Text siehe Tabelle unten; Z. 162 und 163 übernehmen ihn. |
| V-2 | Verwalter | Minor | Das Szenario prüft den Satz nur während der Aktion, nicht, dass er vorher fehlt (Entscheid: «nur während busy»). Lösung: nach «das Dokument "Ausweiskopie" löschen will» einen Schritt «Und der Dialog sagt noch nicht "…"» einfügen (neuer Schritt im @wip-Szenario, ohne Freigabe möglich). |

Begründung zu V-1 (Minor, deshalb nur kurz): «Abbrechen ist nicht mehr möglich» kommt ohne Pronomen aus und nimmt das Wort des Knopfs auf. Damit ist klar, worauf sich der Satz als Beschreibung von «Abbrechen» bezieht. «gerade» macht deutlich, dass es um den laufenden Vorgang geht und nicht um eine unumkehrbare Folge der Aktion. Ohne das Wort könnte ein unerfahrener Vermieter «nicht mehr abbrechen» als «nicht mehr rückgängig zu machen» lesen, und das stimmt zum Beispiel für «Als versendet markieren» nicht. Einen dritten Satz «Bitte warten Sie» lasse ich bewusst weg: Der Bestätigungsknopf sagt gleichzeitig «Bitte warten …».

Platzhalter-Variante (Aktion nennen): Davon rate ich ab. Der Bestätigungsknopf hat den Fokus und nennt die Aktion schon (Busy-Label, etwa «Wird gelöscht …»). Ein Platzhalter bräuchte für 14 Dialoge in vier Sprachen je eine grammatisch passende Form (Kasus, Genus, «l’/la», «la/il»). Der generische Satz stimmt für alle heutigen Busy-Dialoge. Die beiden Dialoge mit eigenem `cancelLabel` («Weiter prüfen», «Weiter bearbeiten», `InvoiceUploadDialog.svelte:325`, `LeaveConfirm.svelte:52`) sind nie `busy`. Dort würde der Satz neben einem anders benannten Knopf stehen. Wird einer davon später `busy`, braucht er einen eigenen Satz.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| ui_dialog_busy_note | Dwello führt die Aktion gerade aus. Abbrechen ist nicht mehr möglich. | Dwello est en train d’exécuter l’action. Il n’est plus possible d’annuler. | Dwello sta eseguendo l’azione. Non è più possibile annullare. | Dwello is carrying out the action. Cancelling is no longer possible. |

(fr/it mit typografischem Apostroph ’ wie im übrigen `messages/fr.json`; en britisch wie «anonymise», «cancelled»; «annuler»/«annullare»/«Cancel» nach `docs/design/i18n-begriffe.md:174`.)

## Nicht bestätigt

- Kein Rechtsbezug: Der Satz berührt weder OR/VMWG noch DSG. Deshalb kein Fedlex-Zitat. Kein Begriff aus `UBIQUITOUS_LANGUAGE.md` betroffen («Aktion» ist dort kein Fachbegriff, in der UI bisher nur «Weitere Aktionen», `messages/de.json:1051`). Es fehlt also kein Begriff.
- Ob alle 14 Dialoge, die `Dialog.svelte` verwenden, während `busy` wirklich nichts mehr abbrechen können (Request schon abgeschickt), habe ich nur über `Dialog.svelte:48,117,124,169` geprüft, nicht in jedem einzelnen Aufrufer.

Geprüft: Szenarioablauf und Schritte Z. 155-165 (Kontrast, Ansage, Klick ohne Wirkung, Fokus), Begriffe «Abbrechen/annuler/annullare/Cancel» gegen i18n-begriffe.md, Busy-Aufrufer von `Dialog.svelte` und ihre `cancelLabel`.
