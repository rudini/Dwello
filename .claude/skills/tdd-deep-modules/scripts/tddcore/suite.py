"""Run a project's test suite and say how it ended: pass, assertion failure, or error."""
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ElementTree
from dataclasses import dataclass
from pathlib import Path, PurePosixPath


_PYTHON_ENV = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}


class NoFramework(Exception):
    pass


@dataclass(frozen=True)
class Run:
    exit_code: int
    outcome: str  # "pass", "fail" (assertion failures only) or "error" (anything else)
    summary: str
    failed: int  # number of failing tests
    ran: int  # tests run, not skipped
    empty: bool  # the framework collected no tests at all (not: crashed before collecting)


def run(root):
    """Detect every test framework under `root`, run each whole suite and classify the result."""
    runners = _node_runners(root)
    if _uses_pytest(root):
        runners.append(lambda: _run_pytest(root))
    elif _has_python(root):
        runners.append(lambda: _run_unittest(root))
    if not runners:
        raise NoFramework("no supported test framework detected"
                          " (looked for vitest, bun, pytest, unittest)")
    return _combine([runner() for runner in runners])


def _combine(all_runs):
    runs = [r for r in all_runs if not r.empty] or all_runs  # a framework without tests is left out
    outcomes = {r.outcome for r in runs}
    outcome = next(o for o in ("error", "fail", "pass") if o in outcomes)
    ran = sum(r.ran for r in runs)
    summary = "; ".join(r.summary for r in runs)
    if outcome == "pass" and not ran:
        outcome, summary = "error", f"no tests ran ({summary})"
    # the exit code covers every command run, so the trailer never hides a failing one
    return Run(max(r.exit_code for r in all_runs), outcome, summary, sum(r.failed for r in runs),
               ran, all(r.empty for r in runs))


def _files(root):
    listed = subprocess.run(["git", "ls-files", "-z", "-co", "--exclude-standard"], cwd=root,
                            check=True, capture_output=True, text=True,
                            errors="surrogateescape").stdout.split("\0")
    return [f for f in listed if (Path(root) / f).is_file()]  # tracked files may be deleted


def _has_python(root):
    return any(f.endswith(".py") for f in _files(root))


def _run_unittest(root):
    done = subprocess.run([sys.executable, "-m", "unittest", "discover"], cwd=root, env=_PYTHON_ENV,
                          capture_output=True, text=True, errors="replace")
    verdicts = [line for line in done.stderr.splitlines()
                if line.startswith(("OK", "FAILED (", "NO TESTS RAN"))]
    summary = verdicts[-1] if verdicts else f"exit code {done.returncode}, no unittest summary"
    failed = re.search(r"failures=(\d+)", summary)
    ran = re.search(r"^Ran (\d+) tests? in", done.stderr, re.MULTILINE)
    skipped = re.search(r"skipped=(\d+)", summary)
    return Run(done.returncode, _unittest_outcome(done.returncode, summary), summary,
               int(failed[1]) if failed else 0,
               (int(ran[1]) if ran else 0) - (int(skipped[1]) if skipped else 0),
               summary == "NO TESTS RAN")


def _unittest_outcome(exit_code, summary):
    if exit_code == 0:
        return "pass"
    if summary.startswith("FAILED (failures=") and "errors=" not in summary:
        return "fail"
    return "error"


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
            runners.append(lambda d=directory: _run_vitest(d))
        elif command:
            runners.append(lambda d=directory, c=command: _run_bun(d, c))
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
                      " (supported: vitest, bun test, pytest, unittest)")


def _run_bun(directory, command):
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
    output = done.stdout + done.stderr
    errors = re.search(r"^\s*(\d+) errors?$", output, re.MULTILINE)
    hidden = errors is not None and int(errors[1]) > 0
    outcome = _bun_outcome(done.returncode, cases) if reported and not hidden else "error"
    summary = f"bun: {failed} of {len(cases)} tests failed"
    if hidden:
        summary += f" ({errors[1]} errors outside tests)"
    return Run(done.returncode, outcome, summary, failed, ran, reported and not cases)


def _run_vitest(root):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.json"
        done = subprocess.run(["npx", "--no-install", "vitest", "run", "--reporter=default",
                               "--reporter=json", f"--outputFile.json={report}"],
                              cwd=root, capture_output=True, text=True, errors="replace")
        if not report.exists():
            last = (done.stderr.strip() or done.stdout.strip() or "no output").splitlines()[-1]
            return Run(done.returncode, "error", f"vitest wrote no report: {last}", 0, 0, False)
        data = json.loads(report.read_text())
    summary = f"{data['numFailedTests']} of {data['numTotalTests']} tests failed"
    load_errors = sum(1 for f in data["testResults"] if f["message"])
    ran = data["numTotalTests"] - data["numPendingTests"] - data["numTodoTests"]
    unhandled = re.search(r"^Vitest caught \d+ unhandled errors? during the test run",
                          done.stderr + done.stdout, re.MULTILINE) is not None
    return Run(done.returncode, _vitest_outcome(done.returncode, data, unhandled), summary,
               data["numFailedTests"], ran, data["numTotalTests"] == 0 and not load_errors)


def _bun_outcome(exit_code, cases):
    if exit_code == 0:
        return "pass"
    types = [f.get("type") for case in cases for f in case.iter("failure")]
    return "fail" if types and all(t == "AssertionError" for t in types) else "error"


def _is_vitest_assertion(message):
    # .resolves/.rejects failures are plain Errors raised inside vitest's assertion chain
    lines = message.splitlines()
    return message.startswith("AssertionError") or (
        len(lines) > 1 and lines[0].startswith("Error: ")
        and lines[1].strip().startswith("at _Assertion."))


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


# Files that configure pytest, with the section that must appear in them ("" = any content).
_PYTEST_CONFIG = {"pytest.ini": "", "conftest.py": "", "pyproject.toml": "[tool.pytest",
                  "setup.cfg": "[tool:pytest]", "tox.ini": "[pytest]"}


_PYTEST_FILE = re.compile(r"test_.*\.py|.*_test\.py")
_PYTEST_FUNCTION = re.compile(r"^def test", re.MULTILINE)  # module level: only pytest runs it


def _uses_pytest(root):
    for name, section in _PYTEST_CONFIG.items():
        config = Path(root) / name
        if config.exists() and section in config.read_text(errors="replace"):
            return True
    return any(_PYTEST_FUNCTION.search((Path(root) / f).read_text(errors="replace"))
               for f in _files(root) if _PYTEST_FILE.fullmatch(Path(f).name))


def _run_pytest(root):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.xml"
        done = subprocess.run([sys.executable, "-m", "pytest", "-q",
                               f"--junitxml={report}"], cwd=root, env=_PYTHON_ENV,
                              capture_output=True, text=True, errors="replace")
        reported = report.exists()
        cases = list(ElementTree.parse(report).iter("testcase")) if reported else []
    output = done.stdout if reported else done.stderr.strip() or done.stdout
    lines = output.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    if not reported:
        summary = f"pytest wrote no report: {summary}"
    failed = sum(1 for case in cases for _ in case.iter("failure"))
    ran = sum(1 for case in cases if case.find("skipped") is None)
    outcome = _pytest_outcome(done.returncode, cases) if reported else "error"
    return Run(done.returncode, outcome, summary, failed, ran,
               done.returncode == 5)  # pytest's "no tests collected"


def _pytest_outcome(exit_code, cases):
    if exit_code == 0:
        return "pass"
    failures = [f.get("message", "") for case in cases for f in case.iter("failure")]
    errors = [e for case in cases for e in case.iter("error")]
    asserted = all(m.startswith(("assert", "AssertionError", "Failed: ")) for m in failures)
    if exit_code == 1 and failures and not errors and asserted:
        return "fail"
    return "error"
