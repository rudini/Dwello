"""Run a project's test suite and say how it ended: pass, assertion failure, or error."""
import json
import os
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ElementTree
from dataclasses import dataclass
from pathlib import Path


class NoFramework(Exception):
    pass


@dataclass(frozen=True)
class Run:
    exit_code: int
    outcome: str  # "pass", "fail" (assertion failures only) or "error" (anything else)
    summary: str


def run(root):
    """Detect the test framework under `root`, run its whole suite and classify the result."""
    if _uses_vitest(root):
        return _run_vitest(root)
    if _uses_pytest(root):
        return _run_pytest(root)
    if not _has_python(root):
        raise NoFramework("no supported test framework detected (looked for Python unittest)")
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    done = subprocess.run([sys.executable, "-m", "unittest", "discover"], cwd=root, env=env,
                          capture_output=True, text=True)
    lines = done.stderr.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    return Run(done.returncode, _outcome(done.returncode, summary), summary)


def _has_python(root):
    files = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=root,
                           capture_output=True, text=True, check=True).stdout.splitlines()
    return any(f.endswith(".py") for f in files)


def _outcome(exit_code, summary):
    if exit_code == 0:
        return "pass"
    if summary.startswith("FAILED (failures=") and "errors=" not in summary:
        return "fail"
    return "error"


def _uses_vitest(root):
    manifest = Path(root) / "package.json"
    if not manifest.exists():
        return False
    data = json.loads(manifest.read_text())
    return "vitest" in {**data.get("dependencies", {}), **data.get("devDependencies", {})}


def _run_vitest(root):
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.json"
        done = subprocess.run(["npx", "--no-install", "vitest", "run", "--reporter=json",
                               f"--outputFile={report}"], cwd=root, capture_output=True, text=True)
        if not report.exists():
            last = (done.stderr.strip() or done.stdout.strip() or "no output").splitlines()[-1]
            return Run(done.returncode, "error", f"vitest wrote no report: {last}")
        data = json.loads(report.read_text())
    summary = f"{data['numFailedTests']} of {data['numTotalTests']} tests failed"
    return Run(done.returncode, _vitest_outcome(done.returncode, data), summary)


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
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    with tempfile.TemporaryDirectory() as tmp:
        report = Path(tmp) / "report.xml"
        done = subprocess.run([sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider",
                               f"--junitxml={report}"], cwd=root, env=env,
                              capture_output=True, text=True)
        cases = list(ElementTree.parse(report).iter("testcase")) if report.exists() else []
    lines = done.stdout.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    return Run(done.returncode, _pytest_outcome(done.returncode, cases), summary)


def _pytest_outcome(exit_code, cases):
    if exit_code == 0:
        return "pass"
    failures = [f.get("message", "") for case in cases for f in case.iter("failure")]
    errors = [e for case in cases for e in case.iter("error")]
    if exit_code == 1 and failures and not errors and all(m.startswith(("assert", "AssertionError")) for m in failures):
        return "fail"
    return "error"
