"""Run a project's test suite and say how it ended: pass, assertion failure, or error."""
import os
import subprocess
import sys
from dataclasses import dataclass


class NoFramework(Exception):
    pass


@dataclass(frozen=True)
class Run:
    exit_code: int
    outcome: str  # "pass", "fail" (assertion failures only) or "error" (anything else)
    summary: str


def run(root):
    """Detect the test framework under `root`, run its whole suite and classify the result."""
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
