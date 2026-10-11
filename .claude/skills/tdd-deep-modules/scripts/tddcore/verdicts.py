"""Read the reviewers' verdicts saved under evidence/reviews/."""
import re
from pathlib import Path


def final(reviews, step):
    """(round, last line) of the latest review round of `step`, or None when there is none."""
    rounds = {}
    for review in Path(reviews).glob(f"step-{step}-round-*.md"):
        number = re.fullmatch(rf"step-{step}-round-(\d+)\.md", review.name)
        if number:
            rounds.setdefault(int(number[1]), []).append(review)
    if not rounds:
        return None
    latest = max(rounds)
    if len(rounds[latest]) > 1:
        return latest, f"round {latest} has two reviews"
    try:
        lines = rounds[latest][0].read_text().strip().splitlines()
    except (OSError, UnicodeDecodeError):
        lines = []
    return latest, lines[-1] if lines else "unreadable review"
