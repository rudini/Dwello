"""Run a project's test suite and say how it ended: pass, assertion failure, or error."""
import json
import re
import shlex
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ElementTree
from dataclasses import dataclass
from pathlib import Path, PurePosixPath


class NoFramework(Exception):
    pass


@dataclass(frozen=True)
class Run:
    exit_code: int
    outcome: str  # "pass", "fail" (assertion failures only) or "error" (anything else)
    summary: str
    failed: int  # number of failing tests
    ran: int  # tests run, not skipped
    tests: frozenset = frozenset()  # ids of the tests the framework collected
    failing: frozenset = frozenset()  # ids of the tests that failed


def run(root):
    """Detect every test framework under `root`, run each whole suite and classify the result."""
    runners = _node_runners(root)
    if not runners:
        raise NoFramework("no supported test framework detected (looked for vitest, bun test)")
    return _combine([runner() for runner in runners])


def _combine(runs):
    outcomes = {r.outcome for r in runs}
    outcome = next(o for o in ("error", "fail", "pass") if o in outcomes)
    ran = sum(r.ran for r in runs)
    summary = "; ".join(r.summary for r in runs)
    if outcome == "pass" and not ran:
        outcome, summary = "error", f"no tests ran ({summary})"
    # the exit code covers every command run, so the trailer never hides a failing one
    return Run(max(r.exit_code for r in runs), outcome, summary, sum(r.failed for r in runs), ran,
               frozenset().union(*(r.tests for r in runs)),
               frozenset().union(*(r.failing for r in runs)))


def _files(root):
    listed = subprocess.run(["git", "ls-files", "-z", "-co", "--exclude-standard"], cwd=root,
                            check=True, capture_output=True, text=True,
                            errors="surrogateescape").stdout.split("\0")
    return [f for f in listed if (Path(root) / f).is_file()]  # tracked files may be deleted


_NPM_PLACEHOLDER = 'echo "Error: no test specified" && exit 1'  # what `npm init` writes


def _node_runners(root):
    """One runner per package.json in the repository: vitest or `bun test`, run in its directory."""
    runners = []
    for path in _files(root):
        package = PurePosixPath(path)
        if package.name != "package.json":
            continue
        directory = str(Path(root) / package.parent)
        command = _test_command(directory)
        if command == "vitest":
            runners.append(lambda d=directory, p=package.parent: _run_vitest(d, p))
        elif command:
            runners.append(lambda d=directory, c=command, p=package.parent: _run_bun(d, c, p))
    return runners


def _test_command(directory):
    """"vitest", the `bun test ...` command line, or None for a package.json without tests."""
    manifest = Path(directory) / "package.json"
    try:
        data = json.loads(manifest.read_text())
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise NoFramework(f"package.json is not valid JSON: {error}") from None
    sections = ("dependencies", "devDependencies", "scripts")
    if not isinstance(data, dict) or any(not isinstance(data.get(k, {}), dict) for k in sections):
        raise NoFramework(f"package.json must be an object whose {', '.join(sections)} are objects")
    if "vitest" in {**data.get("dependencies", {}), **data.get("devDependencies", {})}:
        if not (Path(directory) / "node_modules" / ".bin" / "vitest").exists():
            raise NoFramework("vitest is not installed: run npm install first")
        return "vitest"
    command = data.get("scripts", {}).get("test")
    if not command or command == _NPM_PLACEHOLDER:
        return None
    bun = [part.strip() for part in re.split(r"&&|\|\||;", command)
           if re.search(r"(^|\s)bun test(\s|$)", part)]
    if bun:
        if shutil.which("bun") is None:
            raise NoFramework(f"bun is not installed, but {manifest} runs bun test")
        return bun[0]
    raise NoFramework(f"no supported test framework for package.json test script {command!r}"
                      " (supported: vitest, bun test)")


def _run_bun(directory, command, package):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.xml"
        done = subprocess.run(["sh", "-c", f"{command} --reporter=junit"
                               f" --reporter-outfile={shlex.quote(str(report))}"],
                              cwd=directory, capture_output=True, text=True, errors="replace")
        reported = report.exists()
        cases = list(ElementTree.parse(report).iter("testcase")) if reported else []
    failed = sum(1 for case in cases for _ in case.iter("failure"))
    ran = sum(1 for case in cases if case.find("skipped") is None)
    # Files that fail to load never reach the JUnit report; bun's own summary counts them.
    errors = _bun_summary_errors(done.stderr)
    hidden = errors > 0
    outcome = _bun_outcome(done.returncode, cases) if reported and not hidden else "error"
    summary = f"bun: {failed} of {len(cases)} tests failed"
    if hidden:
        summary += f" ({errors} errors outside tests)"
    ids = _numbered(f"{package / case.get('file', '')}::{case.get('classname', '')}::"
                    f"{case.get('name')}" for case in cases)
    failing = frozenset(i for i, case in zip(ids, cases) if case.find("failure") is not None)
    return Run(done.returncode, outcome, summary, failed, ran, frozenset(ids), failing)


def _run_vitest(root, package):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.json"
        done = subprocess.run(["npx", "--no-install", "vitest", "run", "--reporter=default",
                               "--reporter=json", f"--outputFile.json={report}"],
                              cwd=root, capture_output=True, text=True, errors="replace")
        if not report.exists():
            last = (done.stderr.strip() or done.stdout.strip() or "no output").splitlines()[-1]
            return Run(done.returncode, "error", f"vitest wrote no report: {last}", 0, 0)
        data = json.loads(report.read_text())
    summary = f"{data['numFailedTests']} of {data['numTotalTests']} tests failed"
    ran = data["numTotalTests"] - data["numPendingTests"] - data["numTodoTests"]
    unhandled = re.search(r"^Vitest caught \d+ unhandled errors? during the test run",
                          done.stderr + done.stdout, re.MULTILINE) is not None
    here = Path(root).resolve()
    results = [(f"{package / Path(f['name']).relative_to(here)}::{a['fullName']}", a["status"])
               for f in data["testResults"] for a in f["assertionResults"]]
    ids = _numbered(i for i, _ in results)
    return Run(done.returncode, _vitest_outcome(done.returncode, data, unhandled), summary,
               data["numFailedTests"], ran, frozenset(ids),
               frozenset(i for i, (_, status) in zip(ids, results) if status == "failed"))


def _numbered(ids):
    """Test ids in report order, the n-th repeat of a name suffixed with #n so none collapse."""
    seen, numbered = {}, []
    for test_id in ids:
        seen[test_id] = seen.get(test_id, 0) + 1
        numbered.append(test_id if seen[test_id] == 1 else f"{test_id}#{seen[test_id]}")
    return numbered


def _bun_summary_errors(stderr):
    """The `N error(s)` count of bun's closing summary (the counter lines above `Ran N tests`)."""
    lines = stderr.splitlines()
    ran = [i for i, line in enumerate(lines) if re.match(r"Ran \d+ tests? across", line)]
    if not ran:
        return 0
    for line in reversed(lines[:ran[-1]]):
        counter = re.fullmatch(r"\s*(\d+) (\w+).*", line)
        if not counter:
            break
        if counter[2] in ("error", "errors"):
            return int(counter[1])
    return 0


def _bun_outcome(exit_code, cases):
    if exit_code == 0:
        return "pass"
    types = [f.get("type") for case in cases for f in case.iter("failure")]
    return "fail" if types and all(t == "AssertionError" for t in types) else "error"


def _is_vitest_assertion(message):
    # .resolves/.rejects failures are plain Errors raised inside vitest's assertion chain
    lines = message.splitlines()
    # (vitest rewraps anything thrown in that chain, so the message must read like chai's)
    return message.startswith("AssertionError") or (
        len(lines) > 1 and re.match(r"Error: (expected |promise (resolved|rejected) )", lines[0])
        is not None and lines[1].strip().startswith("at _Assertion."))


def _vitest_outcome(exit_code, data, unhandled):
    if exit_code == 0:
        return "pass"
    files = data["testResults"]
    messages = [m for f in files for a in f["assertionResults"] for m in a["failureMessages"]]
    load_errors = [f for f in files if f["message"]]
    asserted = all(_is_vitest_assertion(m) for m in messages)
    if messages and not load_errors and not unhandled and asserted:
        return "fail"
    return "error"
