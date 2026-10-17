# Fachreview Runde 1: #166 (Vordefinierte Kategorien) und #219 (KI aus), Commit c9a800f

Gegenstand: drei `@wip`-Szenarien am Ende von `tests/e2e/features/categories.feature` (Z. 110–126), ihre Schritte in `tests/e2e/steps/categories.steps.ts` (Z. 261–298) und die geplanten deutschen Texte (Badges, Hinweis in der Liste, Hinweisbox auf der Bearbeitungsseite). #219 ist ohne Szenario geplant.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | «werden Rechnungen anders eingeordnet» verschweigt die echte Folge: Stellt man die Kategorie auf nicht umlagefähig, fallen alle schon erfassten Rechnungen aus der Abrechnung, und Zurückstellen holt sie nicht zurück |
| M-1 | Mietrecht | Major | Der Hinweis lädt neutral dazu ein, die Umlagefähigkeit zu ändern; dass Dwello sie nach Gesetz voreingestellt hat (z. B. Liegenschaftssteuer, Art. 256b OR), sagt er nicht |
| V-2 | Verwalter | Major (Produktentscheid) | Das Feld «Heizkosten» bleibt bei vordefinierten Kategorien änderbar und ändert Beträge beim Mieterwechsel; Hinweis und #166 schweigen dazu |
| V-3 | Verwalter | Minor | «die Namen»: Nur der deutsche Name geht in den KI-Prompt, fr/it/en nicht; die Beschreibung geht hinein, wird aber nicht genannt; bei ausgeschalteter KI ändert sich gar nichts |
| V-4 | Verwalter | Minor | Der Löschgrund «Dwello ordnet Rechnungen nach ihnen ein» trifft auf eigene Kategorien genauso zu und ist falsch, wenn die KI aus ist |
| V-5 | Verwalter | Minor | «Nicht löschbar» und «Schlüssel bleibt» prüfen die Szenarien nur in der Oberfläche; das Backend nimmt `name` im PUT an und löscht ohne Prüfung von `type` |
| V-6 | Verwalter | Nit | Zwei Hinweise zum Löschen stehen direkt untereinander auf der Listenseite |
| V-7 | Verwalter | Nit | Schritt für «Treppenhausreinigung» nennt den Glossarbegriff «eigene Kategorie» nicht |

## V-1 (Major): Der Hinweis nennt die echte Folge einer geänderten Umlagefähigkeit nicht

- Beleg: geplanter Text «Wenn Sie die Namen oder die Umlagefähigkeit ändern, werden Rechnungen anders eingeordnet.» (Schritt `categories.steps.ts:291–297`). Code: `backend/src/services/category.service.ts:185–188`. Bei `isAllowedUtilityCost === false` werden alle Rechnungen der Kategorie mit `isValidUtilityCost = true` auf `false` gesetzt. Beim Zurückstellen auf umlagefähig gibt es kein Gegenstück. Neue Rechnungen erhalten die Umlagefähigkeit aus der Kategorie bzw. der KI (`invoice.service.ts:217, 231, 441`).
- Warum falsch: In Dwello heisst «einordnen» bisher «einer Kategorie zuordnen» (`categories_purpose` «Kategorien ordnen Rechnungen nach Kostenart», `categories_in_use_note` «Kategorien, nach denen schon Rechnungen eingeordnet sind …», `categories_new_purpose`). Der Vermieter liest also: Rechnungen landen künftig in anderen Kategorien. Tatsächlich bleiben bestehende Rechnungen in ihrer Kategorie. Sie zählen aber sofort nicht mehr zur Nebenkostenabrechnung, und das lässt sich nicht durch Zurückstellen rückgängig machen. Ein Vermieter, der «Kehricht» versehentlich umstellt und wieder zurückstellt, rechnet ein ganzes Jahr Kehrichtgebühren nicht mehr ab. Nach den Design-Regeln bestätigen unumkehrbare Aktionen ihre echte Folge.
- Behebung (Textvorschlag, ersetzt den dritten Satz der Hinweisbox): «Stellen Sie die Kategorie auf nicht umlagefähig, fliessen auch ihre schon erfassten Rechnungen nicht mehr in die Nebenkostenabrechnung. Stellen Sie sie zurück, bleiben diese Rechnungen nicht umlagefähig.» Für Namen und Beschreibung siehe V-3. Den Schritt Z. 291–297 und seinen Szenariotext auf die neue Aussage anpassen. Ob die Folge zusätzlich beim Speichern bestätigt werden soll, entscheidet der Product Owner (Issue `fachlich`, `entscheiden`). Gilt für eigene Kategorien genauso und war schon vor dieser Änderung so, wird durch den neuen Hinweis aber sichtbar falsch beschrieben.

## M-1 (Major): Der Hinweis verschweigt, dass die Umlagefähigkeit nach Gesetz voreingestellt ist

- Beleg: Die Hinweisbox stellt das Ändern der Umlagefähigkeit neutral als Möglichkeit dar. «Liegenschaftssteuer» ist vordefiniert und nicht umlagefähig (`backend/migrations/0002_stammdaten.sql:32`, Glossar «Nicht umlagefähig»). Der «Grund der Umlagefähigkeit» verschwindet, sobald die Wahl im Formular geändert wird (Glossar Z. 87, `CategoryForm.svelte` `chosen`): Der gesetzliche Hinweis fehlt also genau dann, wenn er gebraucht würde.
- Fedlex, Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»
- Art. 257a Abs. 1 OR: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Warum falsch: Wer die Liegenschaftssteuer, die Gebäudeversicherung oder Reparaturen auf umlagefähig stellt, verrechnet dem Mieter Kosten, die nach Art. 256b OR der Vermieter trägt. Die Abrechnung ist dann insoweit unzulässig. Der neue Hinweis macht das Umstellen sichtbarer, ohne davor zu warnen.
- Behebung (Textvorschlag, als zusätzlicher Satz vor dem Satz zu den Folgen): «Dwello hat die Umlagefähigkeit nach Gesetz eingestellt; der Grund steht bei der Wahl. Kosten, die der Vermieter trägt, werden nicht umlagefähig, nur weil Sie die Wahl ändern.» Falls das über den in #166 entschiedenen Hinweis hinausgeht: Issue `fachlich`, `entscheiden`.

## V-2 (Major, braucht Produktentscheid): «Heizkosten» bei vordefinierten Kategorien

- Beleg: `CategoryForm.svelte:152–159` zeigt die Checkbox `isHeatingCost` auch beim Bearbeiten einer vordefinierten Kategorie. `categories_heating_help`: «Zieht ein Mieter während der Abrechnungsperiode ein oder aus, verteilt Dwello diese Kosten nach dem Heizprofil auf die Monate, alle anderen nach Tagen.» `calculation.service.ts:335` (`group.isHeatingCost && heatingProfileId`).
- Warum falsch: Entfernt der Vermieter das Häkchen bei «Heizung» oder «Kaminfeger», ändert sich der Mieteranteil bei jedem Mieterwechsel. Die Hinweisbox zählt die Folgen von Änderungen auf und lässt genau die einzige aus, die direkt Beträge ändert. #166 entscheidet nur über Namen und «umlagefähig».
- Behebung: Entscheid des Product Owners (Issue `fachlich`, `entscheiden`). Entweder ist «Heizkosten» bei vordefinierten Kategorien fest, oder der Hinweis ergänzt: «Ändern Sie das Häkchen «Heizkosten», verteilt Dwello die Kosten beim Mieterwechsel anders.» Das Verhalten bestand schon vor der Änderung.

## V-3 (Minor): «die Namen» trifft nicht zu, was die KI liest

- Beleg: `backend/src/config/llm.ts:85–92` (`categoryLines`). Der Prompt enthält den Schlüssel `name`, `nameDE` und `description`, nicht aber `nameFR/IT/EN`. Die Beschreibung ist im Formular änderbar (`CategoryForm.svelte` `description`). Bei `LLM_ENABLED=false` gibt es keine Kategorisierung (#219).
- Warum falsch: Eine neue italienische Bezeichnung ändert nichts an der Einordnung, eine geänderte Beschreibung schon, wird aber nicht genannt. Bestehende Rechnungen ändern sich durch Namen und Beschreibung überhaupt nicht, nur die Vorschläge der KI für neue Rechnungen.
- Behebung (Textvorschlag): «Ändern Sie den deutschen Namen oder die Beschreibung, schlägt die KI für neue Rechnungen womöglich eine andere Kategorie vor.» Zusammen mit V-1 ergibt sich als Hinweistext: «Dwello liefert diese Kategorie mit. Sie lässt sich nicht löschen. Ändern Sie den deutschen Namen oder die Beschreibung, schlägt die KI für neue Rechnungen womöglich eine andere Kategorie vor. Stellen Sie die Kategorie auf nicht umlagefähig, fliessen auch ihre schon erfassten Rechnungen nicht mehr in die Nebenkostenabrechnung.» Den Satz zur KI nur zeigen, wenn die KI eingeschaltet ist (wie bei #219).

## V-4 (Minor): Der Löschgrund unterscheidet nicht und ist bei ausgeschalteter KI falsch

- Beleg: geplanter Text «Kategorien «Von Dwello» lassen sich nicht löschen: Dwello ordnet Rechnungen nach ihnen ein.» (Schritt Z. 279–285). `backend/src/services/llm.service.ts:29`: Die Kategorisierung bekommt alle Kategorien (`listCategories({ limit: 1000 })`), auch die eigenen. Nur die Prüfung einer neuen Kategorie nimmt ausschliesslich vordefinierte (`llm.ts:141–142`, #202). Der «Grund der Umlagefähigkeit» hängt am Schlüssel (`CategoryReason.svelte:7 ff.`).
- Warum falsch: Der Vermieter fragt zu Recht, warum er dann seine eigenen Kategorien löschen darf. Bei `LLM_ENABLED=false` ordnet Dwello gar nichts ein.
- Behebung (Textvorschlag): «Kategorien «Von Dwello» lassen sich nicht löschen: Dwello liefert sie mit dem Grund ihrer Umlagefähigkeit, und die KI vergleicht neue Kategorien mit ihnen.» Die Schritte Z. 282–283 entsprechend anpassen.

## V-5 (Minor): Die Regeln greifen nur in der Oberfläche

- Beleg: `backend/src/routes/categories.ts:41` (`categoryUpdateSchema = t.Partial(categoryBodySchema)` enthält `name`), `category.service.ts:175–191` (übernimmt `data` ungeprüft) und `:197–231` (`deleteCategory` ohne Prüfung von `type`). Die Szenarien prüfen nur den deaktivierten Knopf (`categories.steps.ts:273–277`).
- Warum falsch: #166 verlangt «cannot be deleted» und «key stays fixed». Ein verlorener Schlüssel nimmt der Kategorie den Grund der Umlagefähigkeit und den Vergleich der KI mit ihr.
- Behebung: Je ein `*.pg.test.ts` für «Löschen einer vordefinierten Kategorie wird abgelehnt» (mit Code, z. B. `CATEGORY_PREDEFINED`, und `backend_<code>`) und «PUT ändert `name` einer vordefinierten Kategorie nicht». Kein zusätzliches Szenario nötig.

## V-6 (Nit): Zwei Hinweise zum Löschen

- Beleg: `+page.svelte` zeigt schon `categories_in_use_note` («Kategorien, nach denen schon Rechnungen eingeordnet sind, lassen sich nicht löschen.»); der neue Hinweis käme direkt dazu.
- Behebung: in einem Absatz zusammenfassen, z. B. «Nicht löschen lassen sich Kategorien, nach denen schon Rechnungen eingeordnet sind, und Kategorien «Von Dwello» (…Grund nach V-4).» Für `aria-describedby` braucht der Knopf dann eine eigene id auf dem zweiten Satz.

## V-7 (Nit): Glossarbegriff im Schritt

- Beleg: `categories.feature:114` «Und ist die Kategorie "Treppenhausreinigung" als "Eigene" gekennzeichnet». Im Glossar Z. 85 heisst der Begriff «Eigene Kategorie».
- Behebung: «Und ist die eigene Kategorie "Treppenhausreinigung" als "Eigene" gekennzeichnet» (Gegenstück zu Z. 113).

## Bestätigt

- Begriffe: «Vordefinierte Kategorie» (`UBIQUITOUS_LANGUAGE.md:84`, in der Oberfläche «Von Dwello») und «Eigene Kategorie» (Z. 85). Die Szenarien verwenden «vordefiniert», die Badges «Von Dwello» und «Eigene», wie in #205 entschieden.
- «Liegenschaftssteuer» ist vordefiniert (`0002_stammdaten.sql:32`, Schlüssel `Property Tax`, `type` Standard `predefined`) und im E2E-Bestand ohne Rechnungen. Der deaktivierte Knopf in Szenario 2 kommt also nicht aus der Regel «Kategorie in Gebrauch». Szenario 2 prüft zusätzlich die Beschreibung, damit ist die Unterscheidung abgesichert.
- «Treppenhausreinigung» ist in der Grundlage (`categories.feature:9`) eine eigene Kategorie.
- Die geplanten Texte enthalten kein «ß», sind in Sie-Form und kurz.
- Schlüssel fest in der Oberfläche: `src/lib/server/category.ts:45` schreibt das Formularfeld `name` beim Bearbeiten nur nach `nameDE` (`:116`).
- #219: Der Text `backend_ki_proposal_unavailable` bleibt für eine eingeschaltete KI, die nicht antwortet. Die Seite «Neue Kategorie» hat sonst keinen Text, der die KI voraussetzt (`categories_new_purpose`, `categories_allocable_help`). Dass es kein Szenario gibt, ist fachlich vertretbar: Ohne Knopf verlangt die Pflichtwahl ohne Vorgabe (Glossar Z. 86) weiterhin die Wahl des Vermieters.
- Gesetzeswortlaut Art. 256b, 257a, 257b OR: Fedlex, OR Fassung 2026-10-01 (filestore `eli/cc/27/317_321_377/20261001/de/html`).

## Fehlende Begriffe

Keine neuen Glossarbegriffe nötig. Issues für den Aufrufer (Labels `fachlich`, `entscheiden`):

- V-2: «Heizkosten» bei vordefinierten Kategorien sperren oder im Hinweis nennen.
- V-1: falls gewünscht, eine Bestätigung beim Speichern einer auf «nicht umlagefähig» geänderten Kategorie.
- M-1: nur falls der Zusatzsatz über den entschiedenen Hinweis hinausgeht.

## Nicht bestätigt

- Ob schon erstellte Nebenkostenabrechnungen neu berechnet werden, wenn sich die Umlagefähigkeit ändert. Ich habe nur `category.service.ts` und `invoice.service.ts` gelesen, nicht den Statement-Service. Davon hängt ab, wie weit die Folge in V-1 reicht.
- fr/it/en-Fassungen der neuen Texte: noch nicht vorhanden, nicht geprüft.
- `aria-describedby` an einem `disabled`-Knopf: ein Thema der Barrierefreiheit, nicht dieser Rollen. Ein deaktivierter Knopf ist nicht fokussierbar, die Beschreibung wird also womöglich nicht angesagt. Das gehört zum Code- bzw. a11y-Review.
- #219 Umsetzung (`GET /api/v1/invoices/llm-recipient` → `enabled` auf der Seite «Neue Kategorie»): ohne Code, keine Prüfung möglich.
