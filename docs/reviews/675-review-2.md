# #675 Demo-Hinweis – Code-Review 2 (Schlussrunde)

Bereich: `git diff 980afab fdbb758 -- . ':!docs'` in /home/user/w-672 (fdbb758). Vorheriger Bericht: 675-review-1.md.

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | src/lib/DemoNotice.svelte:15-18 | `contact.includes('@')` macht den ganzen Kontakt zum `mailto:`-Link. Das dokumentierte Format `OPERATOR_CONTACT="betrieb@muster-hosting.ch, 044 123 45 67"` (`.env.example:80`) ergibt `href="mailto:betrieb@muster-hosting.ch, 044 123 45 67"`. Das Mailprogramm erhält damit einen zweiten, ungültigen Empfänger, und die Telefonnummer gehört zum Link. Der Test «verlinkt … eine E-Mail-Adresse» prüft nur eine reine Adresse und eine reine Telefonnummer, nicht das Beispielformat. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: login-view, public-pages-layout, help-page und design-guard (537 bestanden), check 0, lint, fallow, fitness exit 0. Demo-E2E laut Aufrufer noch am Laufen.
- Rot gegen 980afab nur durch Lesen geprüft: Der `closest('.min-h-screen')`-Test und der mailto-Test schlagen dort fehl.
- Den Wechsel von `src/lib/ui` nach `src/lib` habe ich nicht weiter verfolgt. `DemoNotice` ist Demo-Inhalt und keine Basiskomponente, also passt der Ort. Ob `fe:lib` dadurch eine neue Abhängigkeit bekommt, zeigt nur fitness (gemeldet exit 0).

Geprüft: Das Snippet steht in beiden `min-h-screen`-Rahmen als erstes Kind, vor dem Header und ausserhalb von `main`. Die Aufteilung um `\u0000` ergibt denselben Text wie zuvor, und die E2E- und DOM-Prüfungen über `textContent` halten weiter. Der Link-Stil entspricht `TenantContactCard.svelte`, und Svelte escaped das `href`. Der README-Satz beantwortet C-1.
