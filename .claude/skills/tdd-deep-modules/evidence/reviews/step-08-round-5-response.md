# Response to step 08 (verify_all), round 5

The user granted a sixth round.

- [major] the independent check missed symbolic links: the `diff` in DESIGN.md now lists `find scripts -not -type d …` (every entry that is not a directory) against the locked paths, so an added symbolic link (which the lock never holds) shows up like an added file. Verified on a copy: clean lock → `sha256sum` 0, `diff` 0; attack S (`ln -s ../../evidence/evil scripts/tddcore/gate` with a fake `stage2`) → `diff` exit 1 with `> scripts/tddcore/gate`. The text above the commands says which command catches what, and the known-limits line names both.
- [minor] "any symbolic link under `scripts/`": now "any symbolic link in the locked part of `scripts/` (everything but `scripts/tests/` and `__pycache__/`)".
- [nit] two blank lines inside the test class: removed.
- [nit] `cut -c67-` and names with a backslash or newline: such names already cannot be locked (documented with whitespace); the check fails closed.
