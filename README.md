# Pockets — a budgeting app for your phone

One number: **what you have left to spend**. Under it, goals you cut money to,
bills you can see coming, and everything you have spent.

Reads like a docket and works offline.

<p align="center">
  <img src="icons/icon-192.png" width="96" alt="Pockets icon">
</p>

---

## Getting it onto your phone

The app is one HTML file, so there is nothing to install and no account to make.

### Option A — GitHub Pages (a real home-screen app)

1. In this repository go to **Settings → Pages**.
2. Under *Source* pick **Deploy from a branch**, choose the branch holding this
   code and the `/ (root)` folder, then **Save**.
3. Wait a minute, then open the URL GitHub shows you
   (`https://<your-username>.github.io/<repo-name>/`) on your phone.
4. Add it to your home screen:
   - **iPhone (Safari):** Share button → *Add to Home Screen*.
   - **Android (Chrome):** ⋮ menu → *Add to Home screen* / *Install app*.

It now opens full-screen with its own icon, like a normal app, and keeps working
with no signal.

### Option B — just open the file

Download `index.html` and open it. It works, but you don't get the home-screen
icon or offline caching, and some browsers restrict saved data on local files.

> **Neither of these syncs.** Each keeps its own budget in its own browser
> storage; move a budget between them with the backup/restore below. Sync exists
> only in the Claude Artifact build, whose runtime provides the shared store —
> see [Sync across devices](#sync-across-devices).

---

## How it works

**On a first run the app opens with a worked example**, marked with an amber
*Example data* banner. It's there so the screens show something real instead of
an empty docket. Tap **Start fresh** to wipe it and begin with your own money.

There are only three things you can do:

```
  Money in  ─────────►  Money left  ─────────►  Spent
                            │
                            └──── Cut ────►  a goal
```

- **Money in** — it all lands in your balance. Nothing is split up for you.
- **Record spending** — an amount and what it was for. Your balance drops.
- **Cut money to a goal** — you decide this money is spoken for. It comes
  **straight out of what you have left**, because it is no longer yours to
  spend. Taking it back puts it straight back.

**Money left** is the headline, and it is the only figure that answers "can I
afford this". Everything else on the app is context for it.

### Goals

A goal is a pot you cut money to. Two kinds:

| Kind | For | The figure it shows |
|---|---|---|
| **Saving up** | Tuition, a trip, a deposit | What you have put in. Give it a target and a month and it works out what that asks per month. |
| **Money I owe** | A loan from your sister | What is still **left to pay**. Cutting money to it counts as paying it down. |

A goal holds nothing until you cut money to it. That is the whole model — there
are no envelopes to keep topped up.

### Bills

Bills are **listed, never reserved**. No money sits in them. Instead the app
walks down the ones ahead of you, taking each out of what you have left, and
tags every one **Covered** or **At risk** — so you find out *now* that the
second phone charge will not clear, not on the day it bounces.

Tap a bill when it goes out and it records the spend. Tap it again to undo.

A bill falls either on **a day each month**, or **every N days from a date** —
a 28-day prepay plan is not monthly. It drifts earlier through the year and
bills thirteen times, not twelve, so a day-of-the-month field quietly
under-budgets it.

### Spending

Every spend carries a **label**, not a pocket — Coffee, Groceries, Transport,
whatever you set in Settings, plus *Other* for anything else. The Spending tab
totals the month, ranks where it went by label, and lists every record newest
first with an **Undo** beside each.

### Payday, or not

Set a payday in Settings and Home counts down to it: *"12 days to payday ·
€31.40 a day"*, with a bar showing how much of the pay is cut, spent and left.

Leave it empty — which is right if you have no wage yet — and Home instead says
**how long your money lasts at what you are actually spending**. The rate is
spending only, never netted against income: netting would let a one-off lump,
the very money being counted down, pass for a wage and report a draining
account as stable.

---

## Repeating charges

A bus fare paid three times a week is not worth typing three times a week.
**Settings → Repeating charges** takes an amount, the weekdays it lands on, and
a date to count from, and the entries fill themselves in whenever you open the
app — including the ones already gone by.

The generated ids are **derived from the rule and the date** rather than random,
which is what makes this safe under sync: two devices produce the same id for
the same fare, so the merge folds them into one entry instead of charging twice.
Deleting one leaves a tombstone under that same id, so it stays deleted instead
of reappearing. Backfill reaches 92 days at most.

## Quick capture from the home screen

iOS will not give a web app a real home-screen widget — that needs a native
WidgetKit app. What it does allow is a **Shortcut** that opens a URL, and a
Shortcut can live on the home screen, in the widget area, or on Back Tap. So the
app takes its actions from the URL hash:

```
#spend=Coffee&amount=3.60&go     record it and show the new balance
#spend=Groceries                 open the sheet with the label chosen
#add&amount=1000                 money in, ready to confirm
```

The hash is consumed on arrival, so a refresh cannot record the same thing
twice, and the app listens for later hash changes too — so a Shortcut fired
while the app is already open still works.

## Sync across devices

*This applies to the Claude Artifact build only.* Its runtime provides the
shared store; on GitHub Pages or a local file the app reports sync as
unavailable and keeps everything on the device.

- **Your budget is stored server-side, not just on the device.** That is the
  trade for sync. Access is restricted to the owner's account.
- **Every device still keeps its own full copy**, so the app works with no
  signal and catches up when it reconnects.
- **Devices merge, they don't overwrite.** Record something on your phone on the
  bus and something else on the laptop at home, and you end up with both.
- **Deleting really deletes.** Removals travel as tombstones.
- **Theme and the sync switch stay per-device.**
- **Erase everything erases everywhere** while sync is on.

The merge rules: transactions union by id minus tombstones; goals, bills and
repeating charges keep the copy with the newer `updatedAt`; settings are
whole-object newest-wins. Each rule gives the same answer whichever order the
devices apply it in, so both converge.

## Your data

Without sync, everything lives in `localStorage` **in the browser on your
device** — no server, no account, no analytics. The service worker caches only
the page itself, never your numbers.

Either way: **clearing your browser data deletes that device's copy.** So:

> **Settings → Back up my budget** saves everything as a JSON file.
> **Settings → Restore from a backup** loads it back, on this phone or a new one.

Restore takes either a file or pasted text, so a backup also moves your budget
between copies of the app. In the Artifact version the page can't hand you a
file directly unless the viewer allows it, so backup falls back to showing the
text with a **Copy to clipboard** button.

## Coming from the old version

Earlier builds kept ten **pockets**, each with a type and a monthly amount, and
every spend pointed at one. That is gone. The app migrates itself the first time
it opens, and no money is lost:

- a **savings** pocket becomes a **goal**, keeping the money in it;
- a **bill** pocket becomes a **bill**, and the money it was holding goes back
  into your balance — bills reserve nothing now;
- a **spending** pocket is dissolved into a **label**, and its money goes back
  into your balance;
- every past spend keeps its old pocket's name as its label, so your history
  still reads the same;
- per-pocket repeating charges become per-label ones.

Every release is written into the log as an entry, not applied silently, so the
figures still add up afterwards. **A pocket you were using to track a debt will
come across as a label, not a goal** — remake it under Goals as *Money I owe*
with the total as its target, and the app will show what is left to pay.

---

## Editing it

Everything is in `index.html` — no build step, no dependencies, no framework.
Open it, change it, refresh.

| File | What it is |
|---|---|
| `index.html` | The whole app: markup, styles and logic in one file |
| `manifest.json` | Makes it installable as a home-screen app |
| `sw.js` | Service worker — network-first for the page, cache-first for assets |
| `icons/` | App icons (180/192/512 px) |
| `artifact/pockets.html` | Generated — the Artifact copy. Don't edit it by hand |
| `design/` | The design canvas and a standalone sheet of the screens |
| `tools/make_icons.py` | Regenerates the icons — pure Python, no dependencies |
| `tools/build_artifact.py` | Rebuilds `artifact/pockets.html` from `index.html` |
| `tools/embed_fonts.py` | Re-embeds the typefaces; only needed if the type changes |

After changing `index.html`, run `python3 tools/build_artifact.py` to bring the
Artifact copy along. It strips the `<html>/<head>/<body>` wrapper (the Artifact
host supplies its own) and drops the service worker, so there is only ever one
copy of the app to maintain.

A few things worth knowing if you change the code:

- **Balances are never stored.** The only saved records are the settings, the
  items (goals, bills, repeating charges) and a flat list of transactions. Every
  figure is recomputed from that list on each render (`derive()`), so history and
  deletions always stay consistent.
- **`left = cash − cuts`.** `cash` is income minus every expense; `cuts` is what
  currently sits in goals. That one line is the app.
- **Goals, bills and repeating charges share one `items` array**, told apart by
  `type`. That is deliberate: the sync merge then has a single rule for all
  three instead of three that can drift.
- **Sync merges, it never replaces.** `mergeStates()` is the whole contract; if
  you add a field to the state, decide how it merges. Anything device-local
  (theme, the sync switch) goes in `LOCAL_SETTINGS` so it is never pushed.
  `saveLocal()` writes without syncing — use it when applying something that
  just arrived, or it bounces straight back.
- **Colour means something or it is not there.** The chrome is ink on warm
  paper; green means a bill will clear, amber that it will not, red that you are
  past your money. If you find yourself reaching for a colour to make something
  look nicer, use weight or space instead.
- **Every rule is dashed and every figure is joined to its name by dots.** Rows
  are perforations on a docket, not cards. The one solid rule is the one that
  separates a section that sums.
- **Figures are set in Newsreader**, a serif, with tabular figures so columns
  line up; sentences are Barlow; labels and dates are IBM Plex Mono, uppercase
  and widely tracked. Three voices, each with one job.
- **Gauges are halftone, not solid** — a dotted ground with a hatched fill, so a
  bar reads as printed rather than as a progress widget.
- **The typefaces are embedded, not linked.** They ship as base64 woff2 inside
  the file, because a `<link>` to Google Fonts does not work with no signal.
  Regenerate with `tools/embed_fonts.py`.
- **The theme is resolved in one place.** `resolvedTheme()` picks the app
  setting, else a host that stamps `data-theme` on `<html>` (the Artifact viewer
  does), else the OS preference, and stamps the answer as `data-resolved-theme`.
  CSS defines light on `:root` and dark on `[data-resolved-theme="dark"]`.
- Amounts are parsed leniently (`parseAmount`), so `1.234,56`, `1234.56` and
  `€12` all work.
- Bumping `VERSION` in `sw.js` forces phones to pick up a new cache.
