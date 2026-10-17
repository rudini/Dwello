# Code-Review: Merge-Commit 45de6c3c (origin/main in claude/w9c-privacy-82-178)

Worktree: `review-w9c-merge5` (detached, 45de6c3c; Eltern 617d0435 = Branch, 78aa4860 = main). Geprüft mit `git show --cc 45de6c3c` (Hunks, die keinem Elternteil gleichen) sowie `git diff` gegen beide Eltern und die Merge-Basis f900e5b7.

Hunks mit eigener Auflösung: `backend/src/app.ts`, `docs/archive/implementation-plan-verlauf.md`, `messages/{de,fr,it,en}.json`, `src/__tests__/privacy-page.dom.test.ts`, `src/routes/privacy/+page.svelte`, `src/routes/tenants/[id]/+page.server.ts`. Alle gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `messages/de.json` (`privacy_mail_smtp`, `privacy_mail_resend`), `messages/it.json` (dieselben Schlüssel) | Der Satz zählt «Zahlungserinnerungen und Mahnungen» getrennt auf, der Anhang nennt dann nur «bei einer Mahnung Adresse und offener Betrag» (IT: «per un sollecito»). Fachlich ist die Zahlungserinnerung die 1. Mahnstufe (`UBIQUITOUS_LANGUAGE.md`, «Mahnstufe»), gelesen wirkt es aber so, als fehle der Inhalt der Zahlungserinnerung. Vor dem Merge deckte «das Schreiben als PDF (Adresse, offener Betrag)» beide ab. Vorschlag: «bei einer Zahlungserinnerung oder Mahnung …» / «per un promemoria o un sollecito …». EN («for a reminder») und FR («pour un rappel») decken beide schon ab. |
| C-2 | Nit | `src/__tests__/privacy-page.dom.test.ts` (#86-Block) | Der #86-Test prüft nach der Aufteilung nur den SMTP-Text. Dass auch `privacy_mail_resend` Abrechnungen und PDF-Inhalt nennt, zeigt kein Test. Eine zweite Erwartung mit `mail: 'resend'` würde genügen. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Texte (Konflikt 1):** `privacy_third_1` ist in allen vier Dateien entfernt, und nirgends in `src`/`tests` steht noch ein Verweis darauf (nur in Archiv- und Review-Dokumenten). Der Inhalt aus main (#86) steht in DE/FR/IT/EN vollständig in `privacy_mail_smtp` und `privacy_mail_resend`: Nebenkostenabrechnungen, PDF im Anhang und dessen Inhalt (Korrespondenzadresse, Wohnung und Mietdauer, Kosten und Verteilung, Saldo, IBAN und Zahlungsreferenz). Die Sätze des Branches zum Transport (Mailserver des Betreibers / Resend mit Land und Art. 16 Abs. 2 Bst. d DSG) sind unverändert. `privacy_mail_none` bleibt richtig, weil ohne Transport nichts versendet wird. FR: vor jedem `:` und `;` in beiden Schlüsseln steht U+00A0 (Bytes geprüft). Die übrigen Schlüssel beider Seiten sind erhalten (combined diff: keine Zeile einer Seite verloren).
- **Seite (Konflikt 2):** `m.audit_privacy()` steht in den «Welche Daten»-Absätzen als Absatzobjekt, `m.audit_privacy_demo()` im Demo-Panel. Main hält beides mit `privacy.feature` (Protokoll-Szenario) und DOM-Tests fest.
- **Test (Konflikt 3):** Beide `describe`-Blöcke sind da. `mail: 'smtp'` im #86-Test ist nötig, weil die Seite ohne Transport `privacy_mail_none` zeigt. Der Test schlägt fehl, wenn der #86-Inhalt nicht übernommen ist (er prüft die Wortlaute aus DE).
- **Mieter-Detail (Konflikt 4):** `monthlyTotal` statt `grossRent` (main). `grossRent` kommt in `src`, `tests` und `backend/src` nicht mehr vor. `localToday` existiert genau einmal (`src/lib/contract-status.ts:38`), und `formerTenantDocuments` wird gebraucht (Zeile 62).
- **`backend/src/app.ts`:** Beide Imports (`auditLogRoutes`, `mailTransportName`) werden verwendet (Zeilen 73 und 89).
- **Archiv (Konflikt 5):** Beide Sessions sind erhalten, und keine Zeile einer Seite wurde entfernt.
- **Konfliktmarker:** keine im Baum.
- **E2E-Texte:** `privacy.feature:84` erwartet weiter «über den Mailserver zugestellt, den der Betreiber eingerichtet hat». Der Text ist in `privacy_mail_smtp` erhalten.
- **Ponytail:** Die Auflösung ist minimal, und es bleibt nichts Unbenutztes zurück.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (163 Dateien, 2988 Tests) und Backend-`type-check`: vom Aufrufer gemeldet. Selbst nachgeführt habe ich nur `bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/i18n.test.ts` (64 Tests, grün).
- E2E (`privacy.feature`, `demo.feature`, `sprachen-bildschirme.feature`, Szenarien aus main) und Backend-pg-Tests habe ich nach Auftrag nicht laufen lassen. Ob die automatisch gemergten Dateien ohne Konflikt auch zur Laufzeit zusammenpassen, ist nur durch Lesen der Konfliktstellen und durch die gemeldeten Unit-Tests gestützt.
- Ob die Inhaltsangabe des Abrechnungs-PDF stimmt, habe ich nicht gegen `pdf.service.ts` geprüft. Der Text stammt unverändert aus main und wurde dort fachgeprüft (`docs/reviews/w8d-fachreview-2.md`).
