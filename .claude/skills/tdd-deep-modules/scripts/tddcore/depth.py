"""Measure how deep a TypeScript/JavaScript module is: its interface against its implementation."""
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Depth:
    path: str
    surface: int  # what a caller must know: exported names and their parameters
    size: int  # code lines: no blanks, no comments
    ratio: float  # size per unit of surface
    findings: tuple


SHALLOW_RATIO = 4  # fewer code lines per thing a caller must know means the module hides little


def measure(root, path):
    text = (Path(root) / path).read_text()
    surface, size = _surface(text), _size(text)
    ratio = size / surface if surface else float(size)
    findings = (f"shallow: ratio {ratio:.1f} < {SHALLOW_RATIO}",) if ratio < SHALLOW_RATIO else ()
    return Depth(path, surface, size, ratio, findings)


def _size(text):
    return sum(1 for line in text.splitlines() if line.strip() and not line.strip().startswith("//"))


def _surface(text):
    surface = 0
    for params in re.findall(r"^export (?:async )?function\*? *\w+ *\(([^)]*)\)", text, re.MULTILINE):
        surface += 1 + len([p for p in params.split(",") if p.strip()])
    return surface
