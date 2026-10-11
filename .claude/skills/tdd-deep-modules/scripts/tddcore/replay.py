"""Replay a commit range and judge every commit from a real run of its tests."""
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from tddcore import protocol, suite


class ReplayError(Exception):
    pass


@dataclass(frozen=True)
class Verdict:
    commit: str
    phase: str
    run: suite.Run
    violations: list


def replay(repo, rev_range):
    """One Verdict per commit of `rev_range` (oldest first), each from a clean checkout of it."""
    listed = subprocess.run(["git", "rev-list", "--reverse", "--first-parent", rev_range], cwd=repo,
                            capture_output=True, text=True)
    if listed.returncode != 0:
        raise ReplayError(f"cannot read the range {rev_range!r}: {listed.stderr.strip()}")
    commits = listed.stdout.split()
    if not commits:
        raise ReplayError(f"the range {rev_range!r} has no commits")
    has_base = subprocess.run(["git", "rev-parse", "--verify", "-q", f"{commits[0]}^"], cwd=repo,
                              capture_output=True).returncode == 0
    base = f"{commits[0]}^" if has_base else commits[0]
    previous = protocol.phase_of(_git(repo, "log", "-1", "--format=%s", base)) if has_base else "start"
    verdicts = []
    with tempfile.TemporaryDirectory() as tmp:
        tree = Path(tmp) / "replay"
        _git(repo, "worktree", "add", "-q", "--detach", str(tree), base)
        try:
            _borrow_node_modules(repo, tree)
            known = _run(tree).tests if has_base else frozenset()
            for commit in commits:
                _git(tree, "checkout", "-q", "--detach", commit)
                _git(tree, "clean", "-fdxq", "-e", "node_modules")
                _borrow_node_modules(repo, tree)
                subject = _git(tree, "log", "-1", "--format=%s")
                phase = protocol.phase_of(subject)
                claimed = _git(tree, "log", "-1", "--format=%(trailers:key=TDD-Exit-Code,valueonly,separator=%x2C)")
                run = _run(tree)
                changed = _git(tree, "diff-tree", "-r", "--root", "--no-commit-id", "--name-only",
                               "--no-renames", commit).split("\n")
                if phase not in protocol.PHASES:
                    found = [f"not a TDD phase commit: {subject!r}"]
                else:
                    found = protocol.violations(previous, phase, run, [c for c in changed if c])
                if phase in protocol.PHASES and claimed != str(run.exit_code):
                    found.append(f"the trailer says exit code {claimed or 'nothing'}, "
                                 f"but the tests exit with {run.exit_code}")
                new = run.tests - known
                if phase == "red" and len(new) != 1:
                    found.append(f"red must add exactly one new test, but adds {len(new)}")
                if phase != "red" and new:
                    found.append(f"only red may add tests, but {phase} adds {len(new)}")
                removed = known - run.tests
                if phase in ("green", "refactor") and removed:
                    found.append(f"{phase} removes tests: {', '.join(sorted(removed))}")
                verdicts.append(Verdict(commit, phase, run, found))
                previous, known = phase, run.tests
        finally:
            _git(repo, "worktree", "remove", "--force", str(tree))
    if verdicts[-1].phase == "red":
        verdicts[-1].violations.append("the history ends in red: every red needs a green")
    return verdicts


def _borrow_node_modules(repo, tree):
    """Link each package's installed node_modules from the real checkout into the replay tree."""
    for manifest in _git(tree, "ls-files", "*package.json").splitlines():
        package = Path(manifest).parent
        installed, link = Path(repo) / package / "node_modules", tree / package / "node_modules"
        if Path(manifest).name == "package.json" and installed.is_dir() and not link.exists():
            link.symlink_to(installed.resolve())


def _run(tree):
    """The suite's result; a commit without a test framework is an error run with exit code 2."""
    try:
        return suite.run(tree)
    except suite.NoFramework as error:
        return suite.Run(2, "error", str(error), 0, 0)


def _git(cwd, *args):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True,
                          text=True).stdout.strip()
