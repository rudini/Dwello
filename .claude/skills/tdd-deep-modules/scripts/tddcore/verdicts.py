"""Read the reviewers' verdicts saved under evidence/reviews/."""
import re
from pathlib import Path


def final(reviews, step):
    """(round, last line) of the latest review round of `step`, or None when there is none."""
    rounds = {}
    for review in Path(reviews).glob(f"step-{step}-round-*.md"):
        number = re.fullmatch(rf"step-{step}-round-(\d+)\.md", review.name)
        if number:
            rounds[int(number[1])] = review
    if not rounds:
        return None
    latest = max(rounds)
    return latest, rounds[latest].read_text().strip().splitlines()[-1]
