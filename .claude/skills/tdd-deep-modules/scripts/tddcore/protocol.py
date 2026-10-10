"""The red-green-refactor rules every phase commit must satisfy."""
from pathlib import PurePosixPath

# Phase -> phases it may follow. A red cycle must close with green before anything else.
FOLLOWS = {
    "test": {"start", "test", "green", "refactor"},
    "red": {"start", "test", "green", "refactor"},
    "green": {"red"},
    "refactor": {"green", "refactor"},
}


def phase_of(subject):
    """The phase a commit subject claims, or "start" for a commit outside the protocol."""
    prefix = subject.partition(":")[0]
    return prefix if prefix in FOLLOWS else "start"


CODE_SUFFIXES = {".py", ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts", ".svelte", ".vue"}


TEST_DIRS = {"tests", "test", "__tests__"}


def is_production(path):
    return _is_code(path) and not _is_test(PurePosixPath(path))


def _is_test(path):
    name = path.name
    return (name.startswith("test_") or name.endswith("_test.py")
            or ".test." in name or ".spec." in name
            or not TEST_DIRS.isdisjoint(path.parts[:-1]))


def violations(previous, phase, run, changed):
    """Why committing `changed` as `phase` after `previous`, with suite result `run`, breaks TDD."""
    found = []
    if not changed:
        found.append(f"nothing changed: a {phase} commit needs a change")
    if previous not in FOLLOWS[phase]:
        found.append(f"{phase} cannot follow {previous}")
    if phase == "red" and run.outcome != "fail":
        found.append(f"red needs a failing assertion, but the suite says: {run.summary}")
    if phase in ("green", "refactor") and run.outcome != "pass":
        found.append(f"{phase} needs all tests passing, but the suite says: {run.summary}")
    code = [f for f in changed if _is_code(f)]
    if phase == "test" and code:
        found.append(f"test phase may only change the test list, not code: {', '.join(code)}")
    production = [f for f in changed if is_production(f)]
    if phase == "red" and production:
        found.append(f"production code changed: {', '.join(production)}")
    return found


def _is_code(path):
    return PurePosixPath(path).suffix in CODE_SUFFIXES
