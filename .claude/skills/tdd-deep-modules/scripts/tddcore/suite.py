"""Run a project's test suite and say how it ended: pass, assertion failure, or error."""
import json
import os
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ElementTree
from dataclasses import dataclass
from pathlib import Path


_PYTHON_ENV = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}


class NoFramework(Exception):
    pass


@dataclass(frozen=True)
class Run:
    exit_code: int
    outcome: str  # "pass", "fail" (assertion failures only) or "error" (anything else)
    summary: str
    failed: int  # number of failing tests


def run(root):
    """Detect every test framework under `root`, run each whole suite and classify the result."""
    runners = []
    if _uses_vitest(root):
        runners.append(_run_vitest)
    if _uses_pytest(root):
        runners.append(_run_pytest)
    elif _has_python(root):
        runners.append(_run_unittest)
    if not runners:
        raise NoFramework("no supported test framework detected (looked for vitest, pytest, unittest)")
    return _combine([runner(root) for runner in runners])


def _combine(runs):
    outcomes = {r.outcome for r in runs}
    outcome = next(o for o in ("error", "fail", "pass") if o in outcomes)
    return Run(max(r.exit_code for r in runs), outcome, "; ".join(r.summary for r in runs),
               sum(r.failed for r in runs))


def _has_python(root):
    files = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=root,
                           capture_output=True, text=True, check=True).stdout.splitlines()
    return any(f.endswith(".py") for f in files)


def _run_unittest(root):
    done = subprocess.run([sys.executable, "-m", "unittest", "discover"], cwd=root, env=_PYTHON_ENV,
                          capture_output=True, text=True)
    verdicts = [line for line in done.stderr.splitlines()
                if line.startswith(("OK", "FAILED (", "NO TESTS RAN"))]
    summary = verdicts[-1] if verdicts else f"exit code {done.returncode}, no unittest summary"
    failed = re.search(r"failures=(\d+)", summary)
    return Run(done.returncode, _unittest_outcome(done.returncode, summary), summary,
               int(failed[1]) if failed else 0)


def _unittest_outcome(exit_code, summary):
    if exit_code == 0:
        return "pass"
    if summary.startswith("FAILED (failures=") and "errors=" not in summary:
        return "fail"
    return "error"


def _uses_vitest(root):
    manifest = Path(root) / "package.json"
    if not manifest.exists():
        return False
    try:
        data = json.loads(manifest.read_text())
    except json.JSONDecodeError as error:
        raise NoFramework(f"package.json is not valid JSON: {error}") from None
    if "vitest" in {**data.get("dependencies", {}), **data.get("devDependencies", {})}:
        if not (Path(root) / "node_modules" / ".bin" / "vitest").exists():
            raise NoFramework("vitest is not installed: run npm install first")
        return True
    command = data.get("scripts", {}).get("test")
    if command:
        raise NoFramework(f"no supported test framework for package.json test script {command!r}"
                          " (supported: vitest, pytest, unittest)")
    return False


def _run_vitest(root):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.json"
        done = subprocess.run(["npx", "--no-install", "vitest", "run", "--reporter=json",
                               f"--outputFile={report}"], cwd=root, capture_output=True, text=True)
        if not report.exists():
            last = (done.stderr.strip() or done.stdout.strip() or "no output").splitlines()[-1]
            return Run(done.returncode, "error", f"vitest wrote no report: {last}", 0)
        data = json.loads(report.read_text())
    summary = f"{data['numFailedTests']} of {data['numTotalTests']} tests failed"
    return Run(done.returncode, _vitest_outcome(done.returncode, data), summary,
               data["numFailedTests"])


def _vitest_outcome(exit_code, data):
    if exit_code == 0:
        return "pass"
    files = data["testResults"]
    messages = [m for f in files for a in f["assertionResults"] for m in a["failureMessages"]]
    load_errors = [f for f in files if f["message"]]
    if messages and not load_errors and all(m.startswith("AssertionError") for m in messages):
        return "fail"
    return "error"


def _uses_pytest(root):
    base = Path(root)
    pyproject = base / "pyproject.toml"
    return ((base / "pytest.ini").exists() or (base / "conftest.py").exists()
            or (pyproject.exists() and "[tool.pytest" in pyproject.read_text()))


def _run_pytest(root):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.xml"
        done = subprocess.run([sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider",
                               f"--junitxml={report}"], cwd=root, env=_PYTHON_ENV,
                              capture_output=True, text=True)
        cases = list(ElementTree.parse(report).iter("testcase")) if report.exists() else []
    lines = done.stdout.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    failed = sum(1 for case in cases for _ in case.iter("failure"))
    return Run(done.returncode, _pytest_outcome(done.returncode, cases), summary, failed)


def _pytest_outcome(exit_code, cases):
    if exit_code == 0:
        return "pass"
    failures = [f.get("message", "") for case in cases for f in case.iter("failure")]
    errors = [e for case in cases for e in case.iter("error")]
    asserted = all(m.startswith(("assert", "AssertionError")) for m in failures)
    if exit_code == 1 and failures and not errors and asserted:
        return "fail"
    return "error"
