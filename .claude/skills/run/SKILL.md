---
description: Start the al-folio Jekyll dev server locally at http://127.0.0.1:4000/
---

# Run: Jekyll dev server

Jekyll + al-folio site. Ruby 3.3, Bundler, and Node.js are installed but not on the default
PowerShell PATH — they must be added explicitly each session.

## Prerequisites

All gems are installed under the system Ruby. If `Gemfile` changes, re-run `bundle install`
with the PATH below set first.

Known disabled features (not installed locally):
- **ImageMagick** — `imagemagick.enabled: false` in `_config.yml` (WebP generation skipped)
- **Jupyter** — sample `.ipynb` removed; do not add notebooks without installing `jupyter`

## Run

Use the Bash tool (Git Bash) to launch in the background:

```bash
export PATH="/c/Ruby33-x64/bin:/c/Program Files/Git/cmd:/c/Program Files/nodejs:$PATH"
cd "D:/Dropbox/Research_projects/Misc/CV/Website/christianvedels.github.io"
bundle exec jekyll serve --livereload &> /tmp/jekyll.log &
JEKYLL_PID=$!
```

Wait for the server to be ready (first build takes ~55 seconds):

```bash
until grep -q "Server address:" /tmp/jekyll.log; do sleep 3; done
tail -5 /tmp/jekyll.log
```

Expected output when ready:
```
LiveReload address: http://127.0.0.1:35729
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

## Verify

```bash
curl -sf http://127.0.0.1:4000/ | head -5
```

Should return the opening HTML of the page (title: "Christian Vedel").

## Stop

```bash
kill $JEKYLL_PID
# or if PID is lost:
pkill -f "jekyll serve"
```

## Logs

```bash
tail -f /tmp/jekyll.log
```

## Port

Default: `4000`. LiveReload on `35729`. To change: `bundle exec jekyll serve --port 4001`.
