"""The red-green-refactor rules every phase commit must satisfy."""
import re
from pathlib import PurePosixPath

# Phase -> phases it may follow. A red cycle must close with green before anything else.
_FOLLOWS = {
    "test": {"start", "test", "green", "refactor"},
    "red": {"start", "test", "green", "refactor"},
    "green": {"red"},
    "refactor": {"green", "refactor"},
}
PHASES = tuple(_FOLLOWS)
TIERS = ("fast", "full")  # fast: no database, no external network; full: everything


def default_tier(phase):
    """The suite a phase runs unless told otherwise: refactor checks everything."""
    return "full" if phase == "refactor" else "fast"


def phase_of(subject):
    """The phase a commit subject claims, or "start" for a commit outside the protocol."""
    prefix = subject.partition(":")[0]
    return prefix if prefix in _FOLLOWS else "start"


_CODE_SUFFIXES = {".py", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts",
                  ".svelte", ".vue"}
_TEST_DIRS = {"tests", "test", "__tests__"}
# Files that decide which tests run: changing them can hide a failing test.
_TEST_CONFIG = {"conftest.py", "pytest.ini", ".pytest.ini", "pytest.toml", "pyproject.toml",
                "setup.cfg", "tox.ini", "package.json"}


def production_may_follow(previous):
    """Whether a commit after `previous` may contain production code (green or refactor)."""
    return any(previous in _FOLLOWS[phase] for phase in ("green", "refactor"))


def is_production(path):
    return _is_code(path) and not _is_test(PurePosixPath(path))


def _is_test(path):
    name = path.name
    return (name.startswith("test_") or re.search(r"_(test|spec)_?\.[^.]+$", name) is not None
            or ".test." in name or ".spec." in name
            or name in _TEST_CONFIG or name.startswith(("vitest.config.", "vite.config."))
            or not _TEST_DIRS.isdisjoint(path.parts[:-1]))


def violations(previous, phase, run, changed, suite, previous_suite):
    """Why committing `changed` as `phase` after `previous`, with suite result `run`, breaks TDD.

    `suite` is the tier `run` came from, `previous_suite` the tier of the commit before."""
    found = []
    if phase == "green" and previous == "red" and previous_suite == "full" and suite != "full":
        found.append("green must run the full suite, like its red")
    if phase == "refactor" and suite != "full":
        found.append("refactor must run the full suite")
    if phase == "test" and previous == "green" and previous_suite != "full":
        found.append("a test list after a green on the fast suite starts a new task, but the task before it did"
                     " not end on the full suite: refactor, or redo the green with --suite full")
    if not changed:
        found.append(f"nothing changed: a {phase} commit needs a change")
    if previous not in _FOLLOWS[phase]:
        found.append(f"{phase} cannot follow {previous}")
    if phase == "red" and run.outcome != "fail":
        found.append(f"red needs a failing assertion, but the suite says: {run.summary}")
    if phase == "red" and run.outcome == "fail" and run.failed != 1:
        found.append(f"red needs exactly one failing test, but {run.failed} fail")
    if phase in ("green", "refactor") and run.outcome != "pass":
        found.append(f"{phase} needs all tests passing, but the suite says: {run.summary}")
    code = [f for f in changed if _is_code(f)]
    if phase == "test" and code:
        found.append(f"test phase may only change the test list, not code: {', '.join(code)}")
    tests = [f for f in changed if _is_test(PurePosixPath(f))]
    if phase == "green" and tests:
        found.append(f"green may only change production code, not tests: {', '.join(tests)}")
    production = [f for f in changed if is_production(f)]
    if phase == "red" and production:
        found.append(f"production code changed: {', '.join(production)}")
    return found


def _is_code(path):
    return PurePosixPath(path).suffix.lower() in _CODE_SUFFIXES
