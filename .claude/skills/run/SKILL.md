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

`pkill -f "jekyll serve"` does NOT work here: Jekyll runs as `ruby.exe`, so the
pattern never matches and old servers pile up as zombies (multiple servers then
fight over port 4000 and `_site`, causing stale builds). Kill by image name:

```bash
taskkill //F //IM ruby.exe        # kills ALL ruby procs (fine on this box — only jekyll uses ruby)
tasklist | grep -ic ruby.exe      # confirm 0 remain before restarting
```

Before any restart, run the `taskkill` above first, then start a single server.
If builds look stale, suspect leftover ruby processes — check `tasklist` and kill them.

## Logs

```bash
tail -f /tmp/jekyll.log
```

## Port

Default: `4000`. LiveReload on `35729`. To change: `bundle exec jekyll serve --port 4001`.
