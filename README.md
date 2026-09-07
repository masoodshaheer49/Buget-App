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

Open it on your phone and add it to your home screen. Data is stored in that
page's own browser storage on your device.

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

> **The three copies do not share data.** Each keeps its own budget in its own
> browser storage. Pick one and stay with it, or move between them with the
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

## Your data

Everything lives in `localStorage` **in the browser on your device**. Nothing is
uploaded, there is no server, no account, and no analytics. Not even the app's
own service worker touches your numbers — it only caches the page itself so it
opens offline.

The flip side: **clearing your browser data deletes your budget.** So:

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

After changing `index.html`, run `python3 tools/build_artifact.py` to bring the
Artifact copy along. It strips the `<html>/<head>/<body>` wrapper (the Artifact
host supplies its own) and drops the service worker, so there is only ever one
copy of the app to maintain.

A few things worth knowing if you change the code:

- **Balances are never stored.** The only saved records are the settings, the
  pockets, and a flat list of transactions. Every balance is recomputed from
  that list on each render (`derive()`), so history and deletions always stay
  consistent — delete an old entry and everything downstream just re-adds up.
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
