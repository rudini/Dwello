"""Measure how deep a TypeScript/JavaScript module is: its interface against its implementation."""
import functools
import os
import re
import subprocess
from dataclasses import dataclass, replace
from pathlib import Path

from tddcore import protocol


class NotAModule(Exception):
    """The path cannot be measured: missing, not TypeScript/JavaScript, or outside git."""


@dataclass(frozen=True)
class Depth:
    path: str
    surface: int  # what a caller must know: exported names and their parameters
    size: int  # code lines: no blanks, no comments
    ratio: float  # size per unit of surface
    classitis: tuple  # names of tiny classes, when the module has two or more of them
    swarm: tuple  # exported helpers with one caller in the module, when there are SWARM or more
    pass_through: tuple  # names of functions that only forward their arguments
    tests: tuple  # test files that import the module
    unused: tuple  # names of private functions nothing in the module calls
    duplicate: int  # extra copies of repeated code lines
    findings: tuple


SHALLOW_RATIO = 4  # fewer code lines per thing a caller must know means the module hides little
BLOAT_DUPLICATES = 3  # repeated lines that make a module bloated
DUPLICATE_LENGTH = 12  # shorter lines (`}`, `return x;`) repeat naturally
TINY_CLASS = 2  # methods; two or more classes this small spread one decision over many places
SWARM = 3  # exported helpers with one caller; this many turn one module's internals into interface
SMALL_HELPER = 10  # code lines in a helper's body; longer functions are more than a helper


def measure(root, path):
    """Every depth metric of the module at `path` (relative to `root`), and the findings they raise."""
    module = Path(root) / path
    if Path(path).suffix not in _SOURCE:
        raise NotAModule(f"{path}: not a TypeScript or JavaScript file")
    if not module.exists():
        raise NotAModule(f"{path}: no such file")
    if not module.is_file():
        raise NotAModule(f"{path}: not a file")
    text = module.read_text(errors="replace")
    code = re.sub(r"/\*.*?\*/|//[^\n]*", "", text, flags=re.DOTALL)  # without comments
    surface, size = _surface(code), _size(code)
    # a class without methods (an error type, a record) carries a name, not a spread-out decision
    tiny = [name for name, methods in _classes(code) if 0 < len(methods) <= TINY_CLASS]
    top = _top(module, path)
    helpers = _one_caller_exports(code, _other_production_code(module, top))
    metrics = Depth(path, surface, size, size / surface if surface else float(size),
                    tuple(tiny) if len(tiny) >= 2 else (), helpers if len(helpers) >= SWARM else (),
                    _pass_through(code), _tests(module, top),
                    _unused(code), _duplicate(code), ())
    return replace(metrics, findings=_findings(metrics))


def _findings(module):
    findings = []
    if module.ratio < SHALLOW_RATIO:
        findings.append(f"shallow: ratio {module.ratio:.1f} < {SHALLOW_RATIO}")
    if module.classitis:
        findings.append(f"classitis: {', '.join(module.classitis)}")
    if module.swarm:
        findings.append(f"classitis: exported helpers with one caller: {', '.join(module.swarm)}")
    if module.pass_through:
        findings.append(f"pass-through: {', '.join(module.pass_through)}")
    if not module.tests:
        findings.append("untested: no test file imports it")
    bloat = ([f"unused {', '.join(module.unused)}"] if module.unused else []) + \
        ([f"{module.duplicate} duplicated lines"] if module.duplicate >= BLOAT_DUPLICATES else [])
    if bloat:
        findings.append(f"bloat: {'; '.join(bloat)}")
    return tuple(findings)


def _size(code):
    return sum(1 for line in code.splitlines() if line.strip())


_FUNCTION_EXPORT = re.compile(r"export\s+(?:default\s+)?(?:async\s+)?function\b\*?\s*\w*\s*")
_VARIABLE_EXPORT = re.compile(r"export\s+(?:declare\s+)?(?:const|let|var)\s+")
_LIST_EXPORT = re.compile(r"export\s*\{([^}]*)\}")
_NAME_EXPORT = re.compile(r"export\s+(?:default|type|interface|enum|declare|abstract|class|\*)")


def _surface(text):
    """Exported names, the parameters of exported functions, and the public members of exported classes."""
    surface = 0
    for start in re.finditer(r"^export\b", text, re.MULTILINE):
        at = start.start()
        if match := _FUNCTION_EXPORT.match(text, at):
            surface += 1 + len(_names(_parameters(text, match.end()) or ""))
        elif match := _VARIABLE_EXPORT.match(text, at):
            for declarator in _split(text[match.end():_statement_end(text, match.end())]):
                value = re.match(r"\s*\w+\s*(?::[^=]+)?=\s*(.*)", declarator, re.DOTALL)
                surface += 1 + len(_names(_function_parameters(value[1]) if value else ""))
        elif match := _LIST_EXPORT.match(text, at):
            surface += len(_split(match[1]))
        elif _NAME_EXPORT.match(text, at):
            surface += 1
    for match in re.finditer(r"^export\s+(?:default\s+)?(?:abstract\s+)?class\s+\w+[^{]*\{", text, re.MULTILINE):
        for modifiers, name, params in _members(_top_level(text[match.end():])):
            if name.startswith("#") or re.search(r"\b(private|protected)\b", modifiers):
                continue
            surface += len(_names(params)) + (name != "constructor")
    return surface


# `name(params) ... {` of a function or method, and `name = (params) => ` of an arrow function; a function header
# starts after `function` or, for a method, at the start of its line, never inside an expression (`if (has(a))`)
_FUNCTION = re.compile(r"(?:\bfunction\s*\*?\s*|^[ \t]*(?:(?:public|protected|private|static|async|readonly|get|set|"
                       r"override)\s+)*)(?!(?:if|for|while|switch|catch|return|function|async)\b)(\w+)\s*"
                       r"(?:<[^<>\n]*>)?\s*\(", re.MULTILINE)
_ARROW = re.compile(r"\b(\w+)\s*(?::[^=\n]+)?=\s*(?:async\s*)?(?:<[^<>\n]*>)?\s*\(")
_ARROW_HEAD = re.compile(r"\s*(?::[^=\n]+)?=>\s*")  # after the parameters: optional return type, `=>`
_FUNCTION_HEAD = re.compile(r"[^{};=\n]*\{")  # after the parameters: optional return type, `{`
_CALL = re.compile(r"(?:await\s+)?[\w.]+\s*\(")


def _pass_through(text):
    """Names of functions whose body only passes their own parameters, unchanged, to another call."""
    found = []
    for pattern, arrow in ((_FUNCTION, False), (_ARROW, True)):
        for match in pattern.finditer(text):
            close = _close(text, match.end() - 1)
            params = text[match.end():close - 1]
            head = (_ARROW_HEAD if arrow else _FUNCTION_HEAD).match(text, close)
            if not head:
                continue
            body_start = head.end()
            if arrow and text[body_start:body_start + 1] == "{":
                body = text[body_start + 1:_close(text, body_start) - 1]
            elif arrow:
                body = "return " + text[body_start:_expression_end(text, body_start)]
            else:
                body = text[body_start:_close(text, body_start - 1) - 1]
            args = _forwarded_args(body)
            if args is not None and _names(params) and _names(params) == [a.strip() for a in _split(args)]:
                found.append((match.start(), match[1]))
    return tuple(name for _, name in sorted(found))


def _forwarded_args(body):
    """The argument text when `body` is exactly `return [await] target(args)`, else None."""
    statement = re.fullmatch(r"\s*return\s+(.*?);?\s*", body, re.DOTALL)
    if not statement:
        return None
    call = _CALL.match(statement[1])
    if not call or _close(statement[1], call.end() - 1) != len(statement[1]):
        return None
    return statement[1][call.end():-1]


def _parameters(text, index):
    """The parameter list of a signature whose `(` follows `index` (after blanks and type parameters), or None."""
    index = _skip_type_parameters(text, _skip_blanks(text, index))
    return text[index + 1:_close(text, index) - 1] if text[index:index + 1] == "(" else None


def _function_parameters(value):
    """The parameters when the initialiser `value` is a function or arrow function, else ``."""
    head = re.match(r"(?:async\s*)?(function\b\*?\s*\w*\s*)?", value)
    opening = _skip_type_parameters(value, _skip_blanks(value, head.end()))
    if value[opening:opening + 1] != "(":
        return ""
    closing = _close(value, opening)
    arrow = re.match(r"\s*(?::[^=\n]+)?=>", value[closing:])
    return value[opening + 1:closing - 1] if head[1] or arrow else ""


def _skip_type_parameters(text, index):
    """The index after a `<...>` type parameter list (and the blanks after it) at `index`, else `index`."""
    if text[index:index + 1] != "<":
        return index
    depth = 0
    for position in range(index, len(text)):
        depth += (text[position] == "<") - (text[position] == ">" and text[position - 1] != "=")
        if depth == 0:
            return _skip_blanks(text, position + 1)
    return index


def _skip_blanks(text, index):
    return _BLANKS.match(text, index).end()


_BLANKS = re.compile(r"\s*")


def _statement_end(text, start):
    """Where the statement starting at `start` ends: `;` or a line break outside brackets."""
    depth = 0
    for index in range(start, len(text)):
        depth += (text[index] in "([{") - (text[index] in ")]}")
        if depth == 0 and text[index] in ";\n":
            return index
    return len(text)


def _close(text, opening):
    """The index just after the bracket that closes the one at `opening`."""
    depth = 0
    for index in range(opening, len(text)):
        if text[index] in "([{":
            depth += 1
        elif text[index] in ")]}":
            depth -= 1
            if depth == 0:
                return index + 1
    return len(text)


def _expression_end(text, start):
    """Where the expression starting at `start` ends: `;`, a line break, or a closing bracket at depth 0."""
    depth = 0
    for index in range(start, len(text)):
        if text[index] in "([{":
            depth += 1
        elif text[index] in ")]}":
            if depth == 0:
                return index
            depth -= 1
        elif depth == 0 and text[index] in ";,\n":
            return index
    return len(text)


def _names(params):
    """Parameter names without types or defaults: `a: number, b = 2` -> [a, b]."""
    return [re.split(r"[?:=]", p)[0].strip() for p in _split(params)]


def _split(items):
    """The non-empty parts of a comma-separated list, ignoring commas inside brackets."""
    parts, depth, angles, current = [], 0, 0, ""
    for index, char in enumerate(items):
        before = items[index - 1:index]
        depth += (char in "([{") - (char in ")]}")
        # `<` opens type arguments only right after a name (`Map<`); `a < b` and `=>` are no brackets
        angles += (char == "<" and (before.isalnum() or before == "_")) - (char == ">" and angles > 0 and before != "=")
        if char == "," and depth == 0 and angles == 0:
            parts.append(current)
            current = ""
        else:
            current += char
    return [part for part in parts + [current] if part.strip()]


def _classes(text):
    """[(name, [method names])] of every class, methods read from the class body's top level."""
    classes = []
    for match in re.finditer(r"\bclass\s+(\w+)[^{]*\{", text):
        members = _members(_top_level(text[match.end():]))
        classes.append((match[1], [name for _, name, _ in members if name != "constructor"]))
    return classes


def _members(body):
    """[(modifiers, name, parameters)] of the methods declared in a class body's top level."""
    return re.findall(r"^\s*((?:(?:public|protected|private|static|async|readonly|get|set)\s+)*)(#?\w+)\s*"
                      r"\(([^)]*)\)", body, re.MULTILINE)


def _top_level(text):
    """The text up to the brace that closes the current block, with nested blocks left out."""
    depth, kept = 0, []
    for char in text:
        if char == "{":
            depth += 1
        elif char == "}":
            if depth == 0:
                break
            depth -= 1
        elif depth == 0:
            kept.append(char)
    return "".join(kept)


_SOURCE = {".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"}
_IMPORT = re.compile(r"""(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']((?:\.{1,2}|\$lib)/[^"']*)["']""")


def _top(module, path):
    """The root of the git repository holding `module`."""
    found = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=module.resolve().parent,
                           capture_output=True, text=True)
    if found.returncode != 0:
        raise NotAModule(f"{path}: not inside a git repository")
    return Path(found.stdout.strip())


def _tests(module, top):
    """Test files of the module's repository whose relative imports resolve to the module."""
    target = module.resolve().with_suffix("")
    return tuple(rel for rel, imported in _test_imports(top) if target in imported)


@functools.lru_cache(maxsize=None)
def _test_imports(top):
    """[(test file, the module paths it imports)] of the repository at `top`, read once per run."""
    listed = subprocess.run(["git", "ls-files", "-z", "-co", "--exclude-standard"], cwd=top, check=True,
                            capture_output=True, text=True).stdout.split("\0")
    tests = []
    for rel in listed:
        test = top / rel
        if Path(rel).suffix not in _SOURCE or protocol.is_production(rel) or not test.is_file():
            continue
        specs = _IMPORT.findall(test.read_text(errors="replace"))
        # `$lib` is SvelteKit's alias for src/lib at the repository root
        resolved = (top / "src/lib" / spec[5:] if spec.startswith("$lib/") else test.parent / spec
                    for spec in specs)
        tests.append((rel, frozenset(_without_source_suffix(Path(os.path.normpath(path))) for path in resolved)))
    return tuple(tests)


_EXPORTED_FUNCTION = re.compile(r"^export\s+(?:async\s+)?function\b\*?\s*(\w+)|"
                                r"^export\s+const\s+(\w+)\s*(?::[^=\n]+)?=\s*(?:async\s*)?(?:<[^<>\n]*>)?\s*\(",
                                re.MULTILINE)


def _one_caller_exports(text, elsewhere):
    """Small exported functions the module uses exactly once besides declaring them, and no other
    production code (`elsewhere`) names: exported only to be tested."""
    headers = {}  # name -> header matches; overloads declare one name several times
    for match in _EXPORTED_FUNCTION.finditer(text):
        headers.setdefault(match[1] or match[2], []).append(match)
    found = []
    for name, matches in headers.items():
        word = re.compile(rf"\b{re.escape(name)}\b")
        bodies = sorted(_body(text, match) for match in matches)
        outside, last = "", 0
        for start, end in bodies:  # a recursive call is no caller
            outside, last = outside + text[last:start], end
        calls = len(word.findall(outside + text[last:])) - len(matches)
        size = max(_size(text[start:end]) for start, end in bodies)
        if calls == 1 and size <= SMALL_HELPER and not any(word.search(other) for other in elsewhere):
            found.append(name)
    return tuple(found)


def _other_production_code(module, top):
    """The text of every other TypeScript/JavaScript production file in the module's repository."""
    return tuple(text for path, text in _production_code(top) if path != module.resolve())


@functools.lru_cache(maxsize=None)
def _production_code(top):
    """[(path, text)] of the production source files of the repository at `top`, read once per run."""
    listed = subprocess.run(["git", "ls-files", "-z", "-co", "--exclude-standard"], cwd=top, check=True,
                            capture_output=True, text=True).stdout.split("\0")
    return tuple(((top / rel).resolve(), (top / rel).read_text(errors="replace")) for rel in listed
                 if Path(rel).suffix in _SOURCE and protocol.is_production(rel) and (top / rel).is_file())


def _body(text, match):
    """(start, end) of the body of the function whose header `match` found; empty without a body."""
    opening = text.index("(", match.end() - 1 if match[2] else match.end())
    close = _close(text, opening)
    head = _ARROW_HEAD.match(text, close) or _FUNCTION_HEAD.match(text, close)
    if not head:
        return close, close
    start = head.end()
    if text[start - 1:start] == "{":
        return start, _close(text, start - 1) - 1
    if text[start:start + 1] == "{":
        return start + 1, _close(text, start) - 1
    return start, _expression_end(text, start)


def _unused(text):
    """Top-level functions that are not exported and whose name appears nowhere else in the module."""
    declared = re.findall(r"^(?:async\s+)?function\*?\s*(\w+)|^(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?(?:\(|function\b)",
                          text, re.MULTILINE)
    names = [a or b for a, b in declared]
    return tuple(n for n in names if len(re.findall(rf"\b{re.escape(n)}\b", text)) == 1)


def _duplicate(text):
    """Extra copies of statement lines (DUPLICATE_LENGTH characters or longer) that occur more than once."""
    lines = [line.strip() for line in text.splitlines()]
    # members and openers of object, array and argument literals repeat in data, not in copied logic
    long = [line for line in lines if len(line) >= DUPLICATE_LENGTH and not line.endswith((",", "({", "["))]
    return len(long) - len(set(long))


def _without_source_suffix(path):
    """`a/b.service.js` -> `a/b.service`; `a/b.service` stays, its suffix is part of the name."""
    return path.with_suffix("") if path.suffix in _SOURCE else path
