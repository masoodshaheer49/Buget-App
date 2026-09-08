# Pockets — a budgeting app for your phone

Split your money into **pockets** — Tuition, Rent, Car payment, Bus, Groceries,
Phone, Internet, Insurance, Savings, Emergency fund — so you always know which
euro is already spoken for.

Revolut-style interface, works offline, and every number stays on your phone.

<p align="center">
  <img src="icons/icon-192.png" width="96" alt="Pockets icon">
</p>

---

## Getting it onto your phone

The app is one HTML file, so there is nothing to install and no account to make.
Three ways to run it:

### Option A — the instant link (nothing to set up)

Published as a Claude Artifact, private to the owner's account:

**<https://claude.ai/code/artifact/e64cb0fb-e2aa-4e2f-980a-1fbca10307e9>**

Open it on your phone and add it to your home screen — then open the same link
on your laptop and the two stay in step. This is the only copy with sync.

### Option B — GitHub Pages (gives you a proper offline app icon)

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

### Option C — just open the file

Download `index.html` and open it. It works, but you don't get the home-screen
icon or offline caching, and some browsers restrict saved data on local files.

> **Only Option A syncs.** The GitHub Pages and local copies each keep their own
> separate budget in their own browser storage. Move between them with the
> backup/restore below.

---

## How it works

**On a first run the app opens with a worked example month**, marked with an
amber *Example data* banner on every screen. It's there so the Bills and Stats
screens show something real instead of ten empty pockets. Tap **Start fresh** in
that banner to wipe it and begin with your own money — the banner disappears for
good once you do.

Money moves through three simple stages:

```
  Income  ─────────►  Unassigned  ─────────►  Pockets  ─────────►  Spent
          "Add"                    "Assign"            "Spend"/"Pay"
```

- **Add** — money arrives (salary, transfer, refund). It lands in *unassigned*.
- **Assign** — you split unassigned money into pockets. **Auto-assign** fills
  every pocket up to its monthly amount in one tap.
- **Spend / Pay** — money leaves a pocket. Your total balance drops.
- **Move** — borrow between pockets when something runs short.

Your **total balance** never changes when you assign or move — that's just
relabelling money you already have.

### Three kinds of pocket

| Kind | For | What it tracks |
|---|---|---|
| 🧾 **Fixed bill** | Rent, tuition, car payment, insurance | A set amount with a **due day** each month. Shows up on the Bills tab and warns you when it's overdue or the pocket is short. |
| 🛒 **Spending** | Groceries, transport, fun | A monthly budget you draw down. Turns red when you go over. |
| 🐷 **Savings** | Savings, emergency fund | A pot that builds up towards a **goal**, with an optional amount to put aside monthly. |

### The tabs

- **Home** — balance, quick actions, what's due soon, this month at a glance,
  recent activity.
- **Pockets** — every pocket with its balance and progress. Add, edit, archive.
- **Bills** — the month's due dates grouped into *Overdue*, *Unpaid* and *Paid*,
  plus whether you've actually set the money aside for them.
- **Stats** — income vs spending, a six-month trend, and plan-vs-actual per
  pocket. Scroll back through past months with the arrows.

---

## Sync across devices

Open the shared link on your phone and your laptop and both show the same
figures. **Settings → Sync across devices** shows the status and turns it off
for that device.

- **Your budget is stored with the app's shared link, not just on the device.**
  That is the trade for sync — the GitHub Pages and local copies still keep
  everything on-device and have no sync at all. Access is restricted to the
  owner's account, so even if the link were shared, nobody else can read the
  data.
- **Every device still keeps its own full copy**, so the app works with no
  signal and catches up when it reconnects.
- **Devices merge, they don't overwrite.** Add something on your phone on the
  bus and something else on the laptop at home, and you end up with both. A
  plain "last save wins" would have thrown one of them away.
- **Deleting really deletes.** Removals travel as tombstones, so an entry you
  delete on one device doesn't come back from the other.
- **Theme and the sync switch stay per-device** — your laptop can be light while
  your phone is dark.
- **Erase everything erases everywhere** while sync is on. The confirmation says
  so.

The merge rules: transactions union by id minus tombstones; pockets keep the
copy with the newer `updatedAt`; settings are whole-object newest-wins. Each
rule gives the same answer whichever order the devices apply it in, so both
converge on the same budget.

## Your data

Without sync, everything lives in `localStorage` **in the browser on your
device** — no server, no account, no analytics. The service worker caches only
the page itself, never your numbers.

Either way: **clearing your browser data deletes that device's copy.** So:

> **Settings → Back up my budget** saves everything as a JSON file.
> **Settings → Restore from a backup** loads it back, on this phone or a new one.

Worth doing every so often, and before you switch phones.

Restore takes either a file or pasted text, so a backup also moves your budget
between the three copies above. In the Artifact version the page can't hand you
a file directly unless the viewer allows it, so backup falls back to showing the
text with a **Copy to clipboard** button — paste that into a note and it
restores exactly the same.

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
| `tools/make_icons.py` | Regenerates the icons — pure Python, no dependencies |
| `tools/build_artifact.py` | Rebuilds `artifact/pockets.html` from `index.html` |
| `tools/embed_fonts.py` | Re-embeds the typefaces; only needed if the type changes |

After changing `index.html`, run `python3 tools/build_artifact.py` to bring the
Artifact copy along. It strips the `<html>/<head>/<body>` wrapper (the Artifact
host supplies its own) and drops the service worker, so there is only ever one
copy of the app to maintain.

A few things worth knowing if you change the code:

- **Balances are never stored.** The only saved records are the settings, the
  pockets, and a flat list of transactions. Every balance is recomputed from
  that list on each render (`derive()`), so history and deletions always stay
  consistent — delete an old entry and everything downstream just re-adds up.
- **Sync merges, it never replaces.** `mergeStates()` is the whole contract; if
  you add a field to the state, decide how it merges. Anything device-local
  (theme, the sync switch) goes in `LOCAL_SETTINGS` so it is never pushed.
  `saveLocal()` writes without syncing — use it when applying something that
  just arrived, or it bounces straight back.
- **Colour means something or it is not there.** The chrome is ink on paper;
  green, red and amber mean money in, money out, and something owed. A pocket's
  colour appears only as its 3px identifying rule and its monogram — never as a
  gauge fill or a decorative tint. If you find yourself reaching for a colour to
  make something look nicer, use weight or space instead.
- **Not everything is a card.** Rows are separated by hairlines. Border, fill
  and radius are spent on the one thing that needs lifting, not stamped on
  every block.
- **Figures are set in the mono face** with tabular figures so columns line up,
  and cents sit a shade back so the euros read first. Pockets are marked by
  two-letter monograms (`markFor`), which widen to three letters when two
  pockets would otherwise share one — Internet and Insurance both want "IN".
- **The typefaces are embedded, not linked.** Archivo and IBM Plex Mono ship as
  base64 woff2 inside the file, because a `<link>` to Google Fonts does not
  work with no signal. Regenerate with `tools/embed_fonts.py`.
- **The theme is resolved in one place.** `resolvedTheme()` picks the app
  setting, else a host that stamps `data-theme` on `<html>` (the Artifact viewer
  does), else the OS preference, and stamps the answer as `data-resolved-theme`.
  CSS defines light on `:root` and dark on `[data-resolved-theme="dark"]` — so
  each colour has exactly one definition per theme.
- Amounts are parsed leniently (`parseAmount`), so `1.234,56`, `1234.56` and
  `€12` all work.
- To change the starting categories, edit `DEFAULT_CATEGORIES`. To change the
  currencies offered, edit `CURRENCIES`.
- Bumping `VERSION` in `sw.js` forces phones to pick up a new cache.
