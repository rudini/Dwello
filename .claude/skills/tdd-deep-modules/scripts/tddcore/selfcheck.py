"""Run this skill's own unittest suite and say whether it really passed."""
import re
import subprocess
import sys
from pathlib import Path


def own_suite(scripts):
    """(passed, summary): passed only with exit 0, a bare `OK` summary (no skips, no expected failures) and at least one test executed."""
    scripts = Path(scripts)
    # -P: the caller's working directory is not put on the path, so nothing there can replace unittest
    done = subprocess.run([sys.executable, "-P", "-m", "unittest", "discover", "-s", str(scripts / "tests"),
                           "-t", str(scripts)], capture_output=True, text=True, errors="replace")
    lines = done.stderr.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    ran = re.search(r"^Ran (\d+) tests? in", done.stderr, re.MULTILINE)
    # a bare OK means nothing was skipped or expected to fail, so every test that ran passed
    return done.returncode == 0 and summary == "OK" and ran is not None and int(ran[1]) > 0, summary
