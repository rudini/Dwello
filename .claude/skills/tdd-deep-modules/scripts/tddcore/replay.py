"""Replay a commit range and judge every commit from a real run of its tests."""
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from tddcore import protocol, suite


@dataclass(frozen=True)
class Verdict:
    commit: str
    phase: str
    run: suite.Run
    violations: list


def replay(repo, rev_range):
    """One Verdict per commit of `rev_range` (oldest first), each from a clean checkout of it."""
    commits = _git(repo, "rev-list", "--reverse", "--first-parent", rev_range).split()
    base = f"{commits[0]}^"
    previous = protocol.phase_of(_git(repo, "log", "-1", "--format=%s", base))
    verdicts = []
    with tempfile.TemporaryDirectory() as tmp:
        tree = Path(tmp) / "replay"
        _git(repo, "worktree", "add", "-q", "--detach", str(tree), base)
        try:
            known = suite.run(tree).tests
            for commit in commits:
                _git(tree, "checkout", "-q", "--detach", commit)
                _git(tree, "clean", "-fdxq")
                phase = protocol.phase_of(_git(tree, "log", "-1", "--format=%s"))
                run = suite.run(tree)
                changed = _git(tree, "diff", "--name-only", "--no-renames", f"{commit}^", commit).split("\n")
                found = protocol.violations(previous, phase, run, [c for c in changed if c])
                new = run.tests - known
                if phase == "red" and len(new) != 1:
                    found.append(f"red must add exactly one new test, but adds {len(new)}")
                verdicts.append(Verdict(commit, phase, run, found))
                previous, known = phase, run.tests
        finally:
            _git(repo, "worktree", "remove", "--force", str(tree))
    return verdicts


def _git(cwd, *args):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True,
                          text=True).stdout.strip()
