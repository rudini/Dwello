# Review #1378, Runde 1 (2a4bdd00..31904b68)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .github/workflows/deploy-site.yml:14 | Der neue Kommentar sagt «SITE_SFTP_KNOWN_HOSTS pins the host key whenever an SFTP host is used». Das stimmt nicht: Das Secret ist optional (Z. 9), und ohne es liest der Workflow den Schlüssel bei jedem Lauf per `ssh-keyscan` (Z. 78–81). Laut Entscheid gilt «used when set», das heisst, der Schlüssel ist nur gepinnt, wenn das Secret gesetzt ist. |

Keine Blocker und keine Major.

Geprüft:
- Alle 47 `uses:` in den 8 Workflows sind auf eine 40-stellige SHA mit `# vX.Y.Z` gepinnt. Es gibt keine lokalen Aktionen, keine `action.yml` im Repo und keine wiederverwendbaren Workflows. `fallback-review.yml` und `security-alerts.yml` haben kein `uses:`.
- Jede Pin hat dieselbe Major-Version wie der Stand auf der Basis.
- Stichprobe mit `git ls-remote` stimmt:
  - checkout v7.0.1 = 3d3c42e5 (= v7)
  - setup-bun v2.2.0 = 0c5077e5 (= v2)
  - upload-artifact v7.0.2 = cf430e03 (= v7)
  - docker/login-action v4.8.0 = 8aa5831f
  - dependency-review-action v5.0.0 = a1d282b3: Auf der Basis zeigte `@v5` auf den Branch `refs/heads/v5`, und der hat dieselbe SHA.
- Dependabot hat einen Eintrag `github-actions` (Ökosystem `github-actions`, Verzeichnis `/`).
- `deploy-site.yml` behält SFTP und SITE_FTP_PLAIN und begründet das im Kommentar. SITE_SFTP_KNOWN_HOSTS wird verwendet, wenn es gesetzt ist (Z. 78).
- Zu Punkt (3): `ui-screenshots` in `ci.yml` hat nur `permissions: contents: read`, beim Checkout `persist-credentials: false` und weder Push noch Token. Die Artefakte lädt der Job mit upload-artifact hoch.
- Den neuen Test `tools/ci/action-pins.test.ts` habe ich gelesen. Er wäre ohne die Pins rot. Die Zusicherung zu Dependabot hält schon auf der Basis, sie pinnt also bestehendes Verhalten.
- Die zwei angepassten Wiring-Regexe prüfen weiterhin dasselbe Artefakt.
- Ponytail: kein ungenutzter Code, keine Kopie eines bestehenden Helpers.
- Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt
- `bunx vitest run tools/ci tools/deepcheck/test/workflows.test.ts tools/testcheck/test/wiring.test.ts tools/review-report tools/open-work` (162 grün): vom Aufrufer gemeldet.
- Der Rotlauf von `action-pins.test.ts` vor dem Pinnen: vom Aufrufer gemeldet.
- YAML-Parse aller Workflows, ESLint und Prettier: vom Aufrufer gemeldet.
- Die übrigen SHAs habe ich nicht gegen GitHub geprüft: cache, download-artifact, github-script, setup-node, build-push-action, setup-buildx-action und setup-qemu-action. Mit der Stichprobe oben habe ich nur 5 von 12 verifiziert.
- Ob Dependabot SHA-Pins mit dem Versionskommentar tatsächlich aktualisiert, zeigt erst sein nächster Lauf.
