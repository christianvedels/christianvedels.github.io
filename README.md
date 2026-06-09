# Markdown CV Site

Simple multi-page workflow:
- Write content in Markdown files under `pages/`
- Build HTML files into `site/`

## Quick Start (PowerShell)

Copy and run:

```powershell
Set-Location "D:\Dropbox\Research_projects\Misc\CV\Website\christianvedels.github.io"
pnpm install
pnpm run build
Start-Process .\site\start.html
```

## Daily Workflow (PowerShell)

After editing Markdown files, rebuild:

```powershell
Set-Location "D:\Dropbox\Research_projects\Misc\CV\Website\christianvedels.github.io"
pnpm run build
Start-Process .\site\start.html
```

## Where Things Are

- Source pages: `pages/start.md`, `pages/research.md`, `pages/teaching.md`
- Build script: `scripts/md-to-html.mjs`
- Output HTML: `site/*.html`

## Add PDFs

Put PDFs anywhere under `pages/` (for example `pages/files/CV-2025.pdf`).
When you run `pnpm run build`, non-Markdown files are copied to `site/` with the same folder structure.

Example Markdown link from `pages/start.md`:

```markdown
[Download my CV (PDF)](files/CV-2025.pdf)
```
