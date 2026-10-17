---
description: Update the website's CV from the Overleaf-synced Dropbox project, copying only the files the CV actually compiles from. Use whenever the CV was edited in Overleaf and the website needs to catch up, or when asked to sync/refresh/pull the CV from Overleaf or Dropbox.
---

# Sync CV from Overleaf

Christian edits the CV in **Overleaf**, which syncs to Dropbox at:

```
D:\Dropbox\Apps\Overleaf\cv (1)
```

That same project also holds **job-application documents** — cover letters, research
programmes, teaching profiles, audition paper lists, per-application CV variants, and an
`applicaitons/` folder (the typo is his). **None of that may reach the website.** The repo
is public and `cv/` is served as static files, so anything copied there is world-readable.

> `cv_finished` is a frozen September-2026 snapshot, **not** the live project. Use `cv (1)`.

## The rule: never hand-pick files

Do not maintain a list of "safe" files and do not copy files individually. That goes stale
the moment a new application document appears, and the failure mode is a private document
published on a public site.

Instead use the sync script, which resolves the **dependency closure** of `main.tex`:
it follows every `\input`, `\include` and `\includegraphics` and copies exactly what it
reaches. A file the CV does not compile from is never copied — an allowlist by
construction. Anything in `cv/` outside that closure is deleted as extraneous.

## Procedure

1. **Dry run first.** Shows what would change and lists everything deliberately left behind:

   ```bash
   py -3 bin/sync_cv_from_overleaf.py --check
   ```

   Exit code: `0` already in sync, `2` changes pending, `1` error.

2. **Sync:**

   ```bash
   py -3 bin/sync_cv_from_overleaf.py
   ```

3. **Read the output before committing.** Two sections matter:
   - *"will DELETE"* — files in `cv/` the CV does not use. Normally correct (that is how a
     leaked application document gets cleaned out), but confirm nothing legitimate is listed.
   - *"Left in Overleaf, never copied"* — should contain every application document. If
     something that belongs in the CV appears here, `main.tex` is not `\input`-ing it.

4. **Check the diff**, especially deletions: `git status --short && git diff --stat`.

5. **Mirror content changes into `_data/cv.yml`** so the on-site `/cv/` page matches the PDF —
   see the `update-cv` skill. The script only syncs LaTeX; it knows nothing about `cv.yml`.

6. **Commit.** Keep the sync in its own commit. Push only when asked.

7. **After pushing, confirm it is actually live** — see the `verify-deploy-after-push` memory.
   Verify `cv/cv.pdf` by **md5, not byte size** (recompiles often land on an identical size):

   ```bash
   curl -s "https://christianvedels.github.io/cv/cv.pdf?cb=$RANDOM" | md5sum
   ```

## ⚠️ The PDF is never synced

Overleaf's Dropbox sync does not include the compiled PDF, so the script cannot update it.
`cv/cv.pdf` is what the site's "Download CV" button and the CV icon serve, and it goes stale
silently. Whenever the `.tex` changes, **end the turn with an unmissable reminder**:

> ⚠️ **Action needed from you:** recompile on Overleaf, download the PDF, and save it over
> **`cv/cv.pdf`** (same path/filename) — otherwise the download button serves the old CV.
> Tell me when it is in place and I will commit it and verify it serves.

Keep repeating this every time the `.tex` changes until he confirms. Then commit the PDF
**on its own** and verify by md5.

## If the sync script errors

- `cannot resolve '...'` — `main.tex` references a file missing from the Overleaf folder;
  usually Dropbox has not finished syncing. Wait and retry rather than creating the file.
- `reference escapes the project root` — an `\input` points outside the project. Do not
  "fix" it by widening the script; ask, because that is exactly the leak the script prevents.
- Project renamed or moved: pass `--source "D:\path\to\project"`.

## Notes

- `cv/cv_preamble.tex` is part of the CV — `main.tex` does `\input{cv_preamble}`. It is not
  a stray file.
- The script does not touch `cv/cv.pdf` (it is in `PRESERVE`).
- Deleting a leaked file removes it from the live site on the next deploy, but it **remains
  in git history** on a public repo. If something genuinely sensitive leaks, say so plainly —
  scrubbing history needs a rewrite and a force-push, which is a separate decision.
