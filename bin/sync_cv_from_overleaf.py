#!/usr/bin/env python3
"""Sync the website's cv/ folder from the Overleaf-synced Dropbox CV project.

The Overleaf project is also where job-application documents live (cover
letters, research programmes, audition paper lists, per-application CV
variants). None of that may reach the public website, so this script never
works from a hand-maintained list of "safe" files -- that would silently go
stale the moment a new application document appears.

Instead it resolves the *dependency closure* of main.tex: start at the entry
point, follow every \\input, \\include and \\includegraphics, and copy exactly
the files reachable that way. A file the CV does not compile from is, by
construction, not copied. Anything already in cv/ that falls outside the
closure is reported as extraneous and (unless --keep-extraneous) deleted, which
is how application documents that leaked in previously get cleaned out.

Usage:
    py -3 bin/sync_cv_from_overleaf.py --check   # report drift, change nothing
    py -3 bin/sync_cv_from_overleaf.py           # perform the sync

Exit codes: 0 = in sync / synced, 1 = error, 2 = --check found pending changes.
"""

from __future__ import annotations

import argparse
import filecmp
import shutil
import sys
from pathlib import Path
import re

# The live Overleaf project. "cv_finished" is a frozen Sep-2026 snapshot, not
# this; override with --source if the project is ever renamed or moved.
DEFAULT_SOURCE = Path(r"D:\Dropbox\Apps\Overleaf\cv (1)")
DEFAULT_DEST = Path(__file__).resolve().parent.parent / "cv"

ENTRY_POINT = "main.tex"

# Compiled output: produced from Overleaf by hand and committed separately, so
# it lives in cv/ without being part of the source closure. Never delete it.
PRESERVE = {"cv.pdf"}

# Strip comments before scanning, or a commented-out \input would pull a file
# the CV does not actually use. (?<!\\) keeps escaped \% intact.
COMMENT_RE = re.compile(r"(?<!\\)%.*$", re.MULTILINE)
INPUT_RE = re.compile(r"\\(?:input|include)\s*\{([^}]*)\}")
GRAPHICS_RE = re.compile(r"\\includegraphics\s*(?:\[[^\]]*\])?\s*\{([^}]*)\}")

TEX_EXTENSIONS = [".tex"]
GRAPHICS_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".eps"]


class SyncError(Exception):
    pass


def resolve(source_root: Path, ref: str, extensions: list[str]) -> Path:
    """Resolve a LaTeX reference to a real file inside source_root.

    LaTeX lets you omit the extension, so try the reference as written first,
    then each candidate extension.
    """
    ref = ref.strip().replace("\\", "/")
    candidates = [ref] + [ref + ext for ext in extensions]
    for candidate in candidates:
        path = (source_root / candidate).resolve()
        # Never follow a reference out of the project (e.g. \input{../secret}).
        if source_root not in path.parents and path != source_root:
            raise SyncError(f"reference escapes the project root: {ref!r}")
        if path.is_file():
            return path
    raise SyncError(f"cannot resolve {ref!r} (tried: {', '.join(candidates)})")


def closure(source_root: Path) -> set[Path]:
    """Every file reachable from the entry point, as paths relative to the root."""
    entry = source_root / ENTRY_POINT
    if not entry.is_file():
        raise SyncError(f"no {ENTRY_POINT} in {source_root}")

    found: set[Path] = set()
    queue = [entry]
    while queue:
        current = queue.pop()
        rel = current.relative_to(source_root)
        if rel in found:
            continue
        found.add(rel)

        if current.suffix.lower() != ".tex":
            continue  # only .tex files can reference anything further

        text = COMMENT_RE.sub("", current.read_text(encoding="utf-8", errors="replace"))
        for ref in INPUT_RE.findall(text):
            queue.append(resolve(source_root, ref, TEX_EXTENSIONS))
        for ref in GRAPHICS_RE.findall(text):
            queue.append(resolve(source_root, ref, GRAPHICS_EXTENSIONS))

    return found


def existing_files(dest: Path) -> set[Path]:
    if not dest.exists():
        return set()
    return {
        p.relative_to(dest)
        for p in dest.rglob("*")
        if p.is_file() and p.name not in PRESERVE
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Overleaf project folder")
    parser.add_argument("--dest", type=Path, default=DEFAULT_DEST, help="website cv/ folder")
    parser.add_argument("--check", action="store_true", help="report what would change; write nothing")
    parser.add_argument("--keep-extraneous", action="store_true", help="do not delete files outside the closure")
    args = parser.parse_args()

    source_root = args.source.resolve()
    dest = args.dest.resolve()
    if not source_root.is_dir():
        print(f"ERROR: source not found: {source_root}", file=sys.stderr)
        return 1

    try:
        wanted = closure(source_root)
    except SyncError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    present = existing_files(dest)
    to_copy = sorted(f for f in wanted if not (dest / f).is_file() or not filecmp.cmp(source_root / f, dest / f, shallow=False))
    extraneous = sorted(present - wanted)
    unchanged = len(wanted) - len(to_copy)

    print(f"source: {source_root}")
    print(f"dest:   {dest}")
    print(f"\nCV compiles from {len(wanted)} file(s); {unchanged} already up to date.")

    for f in to_copy:
        status = "update" if (dest / f).is_file() else "new"
        print(f"  [{status:>6}] {f.as_posix()}")
    if extraneous:
        verb = "keep (--keep-extraneous)" if args.keep_extraneous else "DELETE"
        print(f"\nNot part of the CV -- will {verb}:")
        for f in extraneous:
            print(f"  [{'delete':>6}] {f.as_posix()}")

    # Everything in the project the CV does not use. Shown so it is visible that
    # application documents are being left behind on purpose, not missed.
    all_source = {p.relative_to(source_root) for p in source_root.rglob("*") if p.is_file()}
    left_behind = sorted(all_source - wanted)
    if left_behind:
        print(f"\nLeft in Overleaf, never copied ({len(left_behind)} file(s)):")
        for f in left_behind:
            print(f"    {f.as_posix()}")

    if args.check:
        pending = len(to_copy) + (0 if args.keep_extraneous else len(extraneous))
        print(f"\n--check: {'no changes pending' if not pending else f'{pending} change(s) pending'}")
        return 2 if pending else 0

    for f in to_copy:
        target = dest / f
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_root / f, target)
    if not args.keep_extraneous:
        for f in extraneous:
            (dest / f).unlink()
        # Drop any directory left empty by those deletions.
        for d in sorted((p for p in dest.rglob("*") if p.is_dir()), reverse=True):
            if not any(d.iterdir()):
                d.rmdir()

    print(f"\nDone: {len(to_copy)} copied, {0 if args.keep_extraneous else len(extraneous)} deleted.")
    print("The PDF is NOT synced -- recompile on Overleaf and save it over cv/cv.pdf.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
