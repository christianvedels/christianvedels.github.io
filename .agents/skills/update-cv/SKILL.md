---
description: Update the CV everywhere it lives — the LaTeX source, the on-site /cv/ page, and (by reminder) the downloadable PDF. Use whenever the user asks to change, add, or remove anything on their CV: a publication, working paper, position, grant, prize, talk, teaching, supervision, service, education, language, etc. Keeps cv/main.tex and _data/cv.yml in sync and bugs the user to recompile the PDF.
---

# Update CV

A CV change must land in **every** place the CV lives, or the website and the downloadable PDF drift apart. There are two authored representations plus one compiled artifact.

## The three CV surfaces

1. **`cv/main.tex`** — LaTeX source of the downloadable CV. **This is authoritative — edit it first.** Uses custom macros: `\cvsection{}`, `\cvitem{date}{body}`, `\pubitem{citation}`.
2. **`_data/cv.yml`** — RenderCV data driving the on-site HTML CV at `/cv/` (`_pages/cv.md` sets `cv_format: rendercv`). It must **mirror** `main.tex`. Sections are generic `bullet:` lists except Experience/Education/Publications/Languages, which are structured.
3. **`cv/cv.pdf`** — the compiled PDF, served at `/cv/cv.pdf`. Both the download button on `/cv/` and the CV social icon point here (`cv_pdf: /cv/cv.pdf` in `_pages/cv.md` and `_data/socials.yml`). **Do NOT compile it — the user does that themselves.**

## Procedure

1. **Edit `cv/main.tex`** to make the change. Match the surrounding LaTeX and conventions: alphabetical author order (econ convention), the section macros, en-dashes for ranges.
2. **Mirror it in `_data/cv.yml`** so the `/cv/` page matches. Pick the right section: `Experience`, `Education`, `Publications`, `Working Papers`, `Other Publications`, `Funding & Prizes`, `Teaching`, `Supervision`, `Presentations`, `Academic Service`, `Non-academic Employment`, `Languages`.
3. **Propagate to the rest of the site if the change touches it:**
   - New/updated **publication or working paper** → also `_bibliography/papers.bib` (drives `/research/` and the homepage selected list).
   - New **position, PhD, or job-market status** → also the homepage bio in `_pages/about.md`.
   - New **grant/prize** → consider the `/research/` **Funded projects** entry in `papers.bib`.
   - New **course** → also `_pages/teaching.md`.
4. **Rebuild and verify** — start the dev server (see the `run` skill), confirm `/cv/` renders the change, and `/research/` if `papers.bib` changed.
5. **Commit** on `main` (the working + deploy branch). Push only when the user explicitly asks — see the `website-dev-branch` memory.

## ⚠️ ALWAYS bug the user about the PDF

Editing the site does **not** update the downloadable PDF. Whenever `cv/main.tex` changes, **end the turn with an unmissable reminder**, for example:

> ⚠️ **Action needed from you:** recompile `cv/main.tex` and save the PDF over **`cv/cv.pdf`** (same path/filename), or the "Download CV" button and the CV icon will keep serving the old version. Tell me when it's in place and I'll verify it serves.

Keep repeating this every time `main.tex` changes until the user confirms the new `cv/cv.pdf` is in place. Then verify `/cv/cv.pdf` returns HTTP 200 (and, if useful, that the file's modified time is recent).
