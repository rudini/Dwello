"""Replay a commit range and judge every commit from a real run of its tests."""
import subprocess
import tempfile
from dataclasses import dataclass, replace
from pathlib import Path

from tddcore import protocol, suite


class ReplayError(Exception):
    pass


@dataclass(frozen=True)
class Verdict:
    commit: str
    phase: str
    run: suite.Run
    violations: tuple
    suite: str = "full"  # the tier its trailer claims (and `run` came from)


def replay(repo, rev_range):
    """One Verdict per commit of `rev_range` (oldest first), each from a clean checkout of it."""
    commits, base = _range(repo, rev_range)
    previous = protocol.phase_of(_git(repo, "log", "-1", "--format=%s", base)) if base else "start"
    previous_suite = _trailer(repo, "TDD-Suite", base) if base else ""
    verdicts = []
    with tempfile.TemporaryDirectory() as tmp:
        tree = Path(tmp) / "replay"
        try:
            _git(repo, "worktree", "add", "-q", "--detach", str(tree), base or commits[0])
            _borrow_node_modules(repo, tree)
            known = _run(tree) if base else suite.Run(0, "pass", "", 0, 0)
            for commit in commits:
                _checkout(repo, tree, commit)
                subject = _git(tree, "log", "-1", "--format=%s")
                claimed = _trailer(tree, "TDD-Exit-Code", "HEAD")
                tier = _trailer(tree, "TDD-Suite", "HEAD")
                changed = _git(tree, "diff-tree", "-r", "--root", "--no-commit-id", "--name-only",
                               "--no-renames", commit).splitlines()
                full = _run(tree)
                run = _run(tree, "fast") if tier == "fast" else full
                phase = protocol.phase_of(subject)
                verdicts.append(Verdict(commit, phase, run,
                                        tuple(_judge(previous, previous_suite, known, subject,
                                                     claimed, tier, run, full, changed)), tier))
                previous, previous_suite, known = phase, tier, full
        finally:
            # twice --force: an add interrupted by a signal leaves the worktree locked
            subprocess.run(["git", "worktree", "remove", "--force", "--force", str(tree)], cwd=repo,
                           capture_output=True)
    if verdicts[-1].phase == "red":
        last = verdicts[-1]
        verdicts[-1] = replace(last, violations=last.violations
                               + ("the history ends in red: every red needs a green",))
    last = verdicts[-1]
    if last.suite != "full":
        verdicts[-1] = replace(last, violations=last.violations
                               + ("the final commit must run the full suite",))
    elif last.run.outcome != "pass":
        verdicts[-1] = replace(last, violations=last.violations
                               + (f"the final commit must pass the full suite, but it says: "
                                  f"{last.run.summary}",))
    return verdicts


def _range(repo, rev_range):
    """The commits of the range, oldest first, and the commit before them (None for a root)."""
    listed = subprocess.run(["git", "rev-list", "--reverse", "--first-parent", rev_range], cwd=repo,
                            capture_output=True, text=True)
    if listed.returncode != 0:
        raise ReplayError(f"cannot read the range {rev_range!r}: {listed.stderr.strip()}")
    commits = listed.stdout.split()
    if not commits:
        raise ReplayError(f"the range {rev_range!r} has no commits")
    has_base = subprocess.run(["git", "rev-parse", "--verify", "-q", f"{commits[0]}^"], cwd=repo,
                              capture_output=True).returncode == 0
    return commits, f"{commits[0]}^" if has_base else None


def _checkout(repo, tree, commit):
    _git(tree, "checkout", "-q", "--detach", commit)
    _git(tree, "clean", "-fdxq", "-e", "node_modules")
    _borrow_node_modules(repo, tree)


def _judge(previous, previous_suite, known, subject, claimed, tier, run, full, changed):
    """Why this commit breaks the protocol, judged from its real runs and the tests before it.

    `run` comes from the tier the commit claims (`tier`), `full` and `known` from the full suite."""
    phase = protocol.phase_of(subject)
    if phase not in protocol.PHASES:
        found = [f"not a TDD phase commit: {subject!r}"]
    else:
        found = protocol.violations(previous, phase, run, changed, tier, previous_suite)
        if tier not in ("fast", "full"):
            found.append(f"the TDD-Suite trailer must say fast or full, but says {tier or 'nothing'}")
        if claimed != str(run.exit_code):
            found.append(f"the trailer says exit code {claimed or 'nothing'}, "
                         f"but the tests exit with {run.exit_code}")
    new = full.tests - known.tests
    removed = (known.tests - known.skipped) - (full.tests - full.skipped)  # gone, or not running
    if phase == "red" and len(new) != 1:
        found.append(f"red must add exactly one new test, but adds {len(new)}")
    if phase == "red" and new - run.tests:
        found.append(f"red's new test is not in the {tier} suite: {', '.join(sorted(new - run.tests))}")
    if phase == "red" and run.failing - new:
        found.append(f"red's failing test must be its new test, but these fail: "
                     f"{', '.join(sorted(run.failing - new))}")
    if phase != "red" and new:
        found.append(f"only red may add tests, but {phase} adds {len(new)}")
    if removed:
        found.append(f"{phase} removes tests: {', '.join(sorted(removed))}")
    return found


def _borrow_node_modules(repo, tree):
    """Link each package's installed node_modules from the real checkout into the replay tree."""
    for manifest in _git(tree, "ls-files", "*package.json").splitlines():
        package = Path(manifest).parent
        installed, link = Path(repo) / package / "node_modules", tree / package / "node_modules"
        if Path(manifest).name == "package.json" and installed.is_dir() and not link.exists():
            link.symlink_to(installed.resolve())


def _trailer(cwd, key, commit):
    return _git(cwd, "log", "-1", f"--format=%(trailers:key={key},valueonly,separator=%x2C)", commit)


def _run(tree, tier="full"):
    """The suite's result; a commit without a test framework is an error run with exit code 2."""
    try:
        return suite.run(tree, tier)
    except suite.NoFramework as error:
        return suite.Run(2, "error", str(error), 0, 0)


def _git(cwd, *args):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True,
                          text=True).stdout.strip()
