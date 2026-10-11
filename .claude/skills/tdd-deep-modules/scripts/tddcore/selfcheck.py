"""Run this skill's own unittest suite and say whether it really passed."""
import re
import subprocess
import sys
from pathlib import Path


def own_suite(scripts):
    """(passed, summary): passed only with exit 0, an `OK` summary and at least one test executed."""
    scripts = Path(scripts)
    done = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", str(scripts / "tests"),
                           "-t", str(scripts)], capture_output=True, text=True, errors="replace")
    lines = done.stderr.strip().splitlines()
    summary = lines[-1] if lines else f"exit code {done.returncode}, no output"
    ran = re.search(r"^Ran (\d+) tests? in", done.stderr, re.MULTILINE)
    skipped = re.search(r"skipped=(\d+)", summary)
    executed = (int(ran[1]) if ran else 0) - (int(skipped[1]) if skipped else 0)
    return done.returncode == 0 and summary.startswith("OK") and executed > 0, summary
