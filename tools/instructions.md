# Jekyll CV Site

Simple Jekyll workflow:
- Write content in Markdown files under `pages/`
- Jekyll renders them with the shared layout in `_layouts/`
- Build output goes to `_site/`

## Quick Start (PowerShell)

Copy and run:

```powershell
Set-Location "D:\Dropbox\Research_projects\Misc\CV\Website\christianvedels.github.io"
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

If `bundle` is not found, install Ruby first, then run `gem install bundler jekyll`.

## Daily Workflow (PowerShell)

After editing Markdown files, rebuild:

```powershell
Set-Location "D:\Dropbox\Research_projects\Misc\CV\Website\christianvedels.github.io"
bundle exec jekyll build
bundle exec jekyll serve
```

## Where Things Are

- Source pages: `pages/start.md`, `pages/research.md`, `pages/teaching.md`
- Shared layout: `_layouts/default.html`
- Jekyll config: `_config.yml`
- Output HTML: `_site/`

## Add PDFs

Put PDFs anywhere under `pages/` (for example `pages/files/CV-2025.pdf`).
Jekyll will copy them into `_site/` with the same folder structure when you build.

Example Markdown link from `pages/start.md`:

```markdown
[Download my CV (PDF)](files/CV-2025.pdf)
```