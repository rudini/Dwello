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
    suite: str  # the tier its trailer claims (and `run` came from)


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
            empty = suite.Run(0, "pass", "", 0, 0)
            known = _runs(tree) if base else {"fast": empty, "full": empty}
            for commit in commits:
                _checkout(repo, tree, commit)
                subject = _git(tree, "log", "-1", "--format=%s")
                claimed = _trailer(tree, "TDD-Exit-Code", "HEAD")
                tier = _trailer(tree, "TDD-Suite", "HEAD")
                changed = _git(tree, "diff-tree", "-r", "--root", "--no-commit-id", "--name-only",
                               "--no-renames", commit).splitlines()
                runs = _runs(tree)
                phase = protocol.phase_of(subject)
                verdicts.append(Verdict(commit, phase, runs.get(tier, runs["full"]),
                                        tuple(_judge(previous, previous_suite, known, subject,
                                                     claimed, tier, runs, changed)), tier))
                previous, previous_suite, known = phase, tier, runs
        finally:
            # twice --force: an add interrupted by a signal leaves the worktree locked
            subprocess.run(["git", "worktree", "remove", "--force", "--force", str(tree)], cwd=repo,
                           capture_output=True)
    if verdicts[-1].phase == "red":
        verdicts[-1] = _flag(verdicts[-1], "the history ends in red: every red needs a green")
    # a task ends with the range, and before each test list that follows a green or refactor
    ends = [i for i in range(len(verdicts) - 1)
            if verdicts[i].phase in ("green", "refactor") and verdicts[i + 1].phase == "test"]
    for i in ends + [len(verdicts) - 1]:
        verdicts[i] = _task_end(verdicts[i])
    return verdicts


def _task_end(verdict):
    """The last commit of a task must have run the full suite, all green."""
    if verdict.suite != "full":
        return _flag(verdict, "the final commit must run the full suite")
    if verdict.run.outcome != "pass":
        return _flag(verdict, f"the final commit must pass the full suite, but it says: {verdict.run.summary}")
    return verdict


def _flag(verdict, violation):
    return replace(verdict, violations=verdict.violations + (violation,))


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


def _judge(previous, previous_suite, known, subject, claimed, tier, runs, changed):
    """Why this commit breaks the protocol, judged from its real runs and the tests before it.

    `runs` and `known` hold the fast and full runs of this commit and the one before; the
    protocol is checked on the run of the tier the commit claims (`tier`)."""
    phase = protocol.phase_of(subject)
    run, full = runs.get(tier, runs["full"]), runs["full"]
    if phase not in protocol.PHASES:
        found = [f"not a TDD phase commit: {subject!r}"]
    else:
        found = protocol.violations(previous, phase, run, changed, tier, previous_suite)
        if tier not in protocol.TIERS:
            found.append(f"the TDD-Suite trailer must say fast or full, but says {tier or 'nothing'}")
        if claimed != str(run.exit_code):
            found.append(f"the trailer says exit code {claimed or 'nothing'}, "
                         f"but the tests exit with {run.exit_code}")
    new = full.tests - known["full"].tests
    removed, dropped = (_running(known[t]) - _running(runs[t]) for t in ("full", "fast"))
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
    elif dropped:
        found.append(f"{phase} removes tests from the fast suite: {', '.join(sorted(dropped))}")
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


def _running(run):
    """Tests that ran: gone, skipped, todo and filtered tests are not among them."""
    return run.tests - run.skipped


def _runs(tree):
    return {tier: _run(tree, tier) for tier in protocol.TIERS}


def _run(tree, tier):
    """The suite's result; a commit without a test framework is an error run with exit code 2."""
    try:
        return suite.run(tree, tier)
    except suite.NoFramework as error:
        return suite.Run(2, "error", str(error), 0, 0)


def _git(cwd, *args):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True,
                          text=True).stdout.strip()
