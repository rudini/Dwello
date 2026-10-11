"""Read the reviewers' verdicts saved under evidence/reviews/."""
import re
from pathlib import Path


def final(reviews, step):
    """(passed, description) of the latest review round of `step`: passed only on `VERDICT: PASS`."""
    rounds = {}
    for review in Path(reviews).glob(f"step-{step}-round-*.md"):
        number = re.fullmatch(rf"step-{step}-round-(\d+)\.md", review.name)
        if number:
            rounds.setdefault(int(number[1]), []).append(review)
    if not rounds:
        return False, "no review"
    latest = max(rounds)
    if len(rounds[latest]) > 1:
        return False, f"round {latest} has two reviews"
    try:
        lines = rounds[latest][0].read_text().strip().splitlines()
    except (OSError, UnicodeDecodeError):
        lines = []
    verdict = lines[-1] if lines else "unreadable review"
    return verdict == "VERDICT: PASS", f"{verdict} (round {latest})"
