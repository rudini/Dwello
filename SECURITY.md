# Security policy

Dwello stores personal data of tenants (names, addresses, rents, bank details). Please report a vulnerability
privately, never as a public issue or pull request.

## How to report

Use GitHub's private vulnerability reporting (**Security → Report a vulnerability** in this repository) or write to
[info@dwello.ch](mailto:info@dwello.ch). Describe what you found, how to reproduce it and what an attacker could reach.

## What happens next

- You get an answer within 7 days.
- We agree on a fix and a date to publish it; you are credited in the advisory unless you prefer not to be.

## Alerts from scanning

CodeQL (default setup) scans the code, Dependabot the dependencies; a pull request with a new CodeQL alert of severity
high or critical cannot be merged, nor one that adds a dependency with a known high or critical vulnerability.

- **Who:** the maintainer, with a nightly Claude routine that works the `nfr:security` issues.
- **How an alert becomes work:** each night `.github/workflows/security-alerts.yml` opens an `nfr:security` issue for
  every open CodeQL alert that has none. Dependabot opens a fix pull request for each alert it can fix; one it cannot
  fix the maintainer turns into an `nfr:security` issue.
- **Deadlines**, from the day the alert opens: critical within 2 days, high within 7 days, medium and low with the next
  release.
- **Tests and tooling** (`tests/`, `tools/`, test files, development dependencies): a finding is fixed like one in the
  app, so the scan closes it; without a real attack path it has no deadline (#803).
- **False positives** are dismissed on GitHub ("False positive", with a comment why) only when the code cannot be
  written so that the scan no longer reports it.

## Supported versions

Only the latest release and `main` get security fixes.
