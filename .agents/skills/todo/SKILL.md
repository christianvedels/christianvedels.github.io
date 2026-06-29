---
description: Capture a quick task into the gitignored TODO.md backlog instead of doing it now. Use when the user types "/todo <something>" or asks to park/defer a task for later.
---

# Todo: park a task for later

The user wants to jot something down to come back to **later**, NOT have it done now.

## File

`not-public/TODO.md`

It lives in the gitignored `not-public/` folder (local-only working files), so it never gets committed.

## Behavior

When invoked as `/todo <something>`:

1. **Do NOT act on the task.** Just record it. (If the user clearly wants it done now, confirm first — the whole point of `/todo` is deferral.)
2. If `TODO.md` does not exist, create it with this header:

   ```markdown
   # TODO

   Scratch backlog for the website. Gitignored — local only.
   ```

3. Append the item as an unchecked checkbox with the date, e.g.:
   ```markdown
   - [ ] 2026-06-27 — <something>
   ```
   Use today's date (`currentDate` from context).
4. Reply with a one-line confirmation and the current open-item count. Don't restart the dev server or touch the site.

## Other todo operations

If the user asks (no strict syntax required):

- **list / show todos** → read `TODO.md` and show the open (`- [ ]`) items.
- **done / finished `<item>`** → mark the matching line `- [x]` (don't delete it).
- **clear / remove `<item>`** → delete the matching line.

Keep completed items in the file (checked) unless the user asks to clean up.
