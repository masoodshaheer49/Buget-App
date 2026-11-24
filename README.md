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

- **Money in** — it all lands in your balance. Nothing is split up for you. If
  you borrowed it, say who from and the app raises that debt by the same amount,
  because borrowing is two facts at once: you have the money, and you owe it.
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

**A goal can take its share of your pay as it lands.** Edit a goal and fill in
*From each salary*: an amount, and **Every pay** or **Each month**. From then
on, money in tagged **Salary** is cut to that goal the moment you add it, and
the Money in sheet says so before you confirm:

```
  €330 · Salary
  €150.00 to Mother, €100.00 to Tuition as it lands — €80.00 is yours to spend.
```

*Each month* takes from the month's first pay, and from the next one if the
first was short, until the month's amount is in. A cut you made to the goal by
hand that month counts towards it. Nothing takes more than the pay itself, so
goals higher up the list are served first, and nothing takes a goal past its
target. Undo the pay and its cuts go with it. Switching this on does not reach
back into pay you already had.

**Pay from it** spends money a savings goal is holding. Money set aside for
someone, like Mother's €150, is paid out of the goal, not out of Money left, which
already lost it when it was cut. So Money left stays where it is and the goal
drops. The spend is listed as *Mother · from Mother*. It counts as spending
everywhere, because it is money leaving, except in how long your money lasts,
which it never touched.

**Deleting a savings goal that holds money asks whether you spent it.** Saved
up and then paid out — a deposit, a fee, the IRP — the money has left your
account: **Spent it** records it as spending on the day you paid, and Money
left does not move, because it was set aside already. **Not spent** puts it
back into Money left. If you already recorded the payment as spending, choose
*Not spent*, or it would be counted twice.

Cutting takes the money out of **Money left** the moment you do it, which is the
point: it is no longer yours to spend. It does not take it out of your bank,
though — a savings goal is a decision, not a transfer. So **Count my money**
measures your hand count against *what you should be holding*, spelling out the
sum when a goal is holding anything:

```
  Money left                €792.72
  Held in goals             €100.00
  ─────────────────────────────────
  So you should be holding  €892.72
```

Money cut to a **debt** goal is not added back, because paying a debt really
does empty the account — for a debt, the cut *is* the payment. Measuring against
Money left alone would report every savings goal as money gone missing, and the
write-off would quietly spend it.

**The tip jar is left out of the count**, and the sheet says so. Tips are kept
out of your money, and they are not a pile of coins you are holding either:
they come in with the pay or get spent as they arrive. Adding the jar to what
you should be holding would report it as missing every time you count.

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

### Where money comes from

Money in takes a source the same way a spend takes a label: **Tips**, **Salary**,
or **From someone** — where you type who it was. Tips are not salary: one is the
plan, the other is what the day happened to give you, and a figure that blurs
the two tells you nothing about either. Tips land daily, so each day is its own
entry, and while you are typing the amount the sheet says what tips have come to
this month.

### The tip jar

**Tips do not land in your spending money.** They go into a jar, which Home
shows under the headline, and they sit there until you say otherwise:

```
  TP   Tip jar · 12 days this month  ·········  €102.40
```

Tap it for the jar's own docket — what is in it, what the month has come to, and
every day's tip newest first, under a heading per month carrying that month's
total. **Release** empties the lot into your balance in one tap and drops the
jar to zero, leaving a line out in the log so the jar's own history still adds
up:

```
  SEPTEMBER 2026                                €102.40
  Today   Released into my money      Undo      −€102.40
  Yest    Tip                         Undo        +€9.15
  22 Sep  Tip                         Undo        +€4.20
```

This is the point of the thing: a wage you can plan against, and beside it the
money the days actually gave you, kept whole until the month is done instead of
disappearing into a coffee. Undo works on any line, and undoing a tip takes its
holding with it.

**Spend some from the jar** pays for one thing out of the tips, not out of your
money. Type the amount and what it was for, and the jar drops by that much.
Money left does not move, because the money never passed through it:

```
  Today   GTA 6                       Undo      −€100.00
```

The spend is listed in the jar's docket, with an Undo that puts the money back
in the jar. It is also listed on Spending as *GTA 6 · from tips*. Like a tip it
is not counted there, not in a week's spending, a day's total, the month's
statement, or how long your money lasts, because it was tips and not money.
The sheet will not take more than the jar holds. A thing that costs more is the
jar's share here and the rest as ordinary spending.

Only the source named exactly **Tips** is held back. Rename it in Settings and
money tagged with the new name lands in your balance like anything else.

**Tips are cash kept apart, not money.** So Spending leaves them out: a week's
*Money in*, and a month's statement — what came in, and what rolls over. The
same goes for anything bought from the jar. The jar's own docket is where tips
are counted. Only a release turns them into
money, and the month you release shows it under *Came in*.

Both recording sheets carry a **When** row — Today, Yesterday, or a picker —
because money rarely lands on the day you get round to typing it. Tips come the
next morning; a receipt surfaces in a pocket a week later. The date cannot be in
the future, and it goes back to Today for the next entry rather than sticking.

Edit the sources in Settings. Money you borrowed is tagged by the goal it
belongs to instead, so a loan can never be mistaken for earnings.

### Spending

Every spend carries a **label**, not a pocket — Coffee, Groceries, Transport,
whatever you set in Settings, plus *Other* for anything else.

The Spending tab reads **a week or a month at a time**. Pick *Week* or *Month*
at the top, and step back with **‹** — **›** comes forward again, as far as
now. The headline is what that week or month cost, what it came to a day, and
how it compares with the one before:

```
  [Week] [Month]                          ‹  ›
  SPENT LAST WEEK
  €48.14
  5–11 Oct · 8 records · €6.88 a day
  €11.35 less than 28 Sep – 4 Oct

  WEEK BY WEEK
  THIS WEEK        ▪▪▪▪▪▪▪▪▪▪·········     €32
  LAST WEEK        ■■■■■■■■■■■■■■■····     €48
  28 SEP – 4 OCT   ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪     €59
```

Under it, the last six weeks or months sit side by side, each with a gauge
against the busiest of them, so a heavy week stands out without reading a
figure. Tap one to open it. Going back further than six slides the list along
with you. Neither the arrow nor the list goes back past your first record, so
you never step through empty weeks from before you started.

Switching keeps your place: from a week in September, *Month* opens September,
and *Week* from a month opens its last week. Which of the two you read by is
remembered on this device and is not synced.

Everything below follows the period you are reading: where it went by label,
what came in by source (apart from tips, which sit in the jar), and **every**
record in it — in and out — under a
heading per day carrying what that day cost, with an **Undo** beside each.
Money in is shown in green with a `+`, because an entry you cannot see is an
entry you cannot correct.

The daily rate counts only days that have happened, and none from before your
first record. A month you started on the 20th is not 31 days of data. Weeks
start on Monday; set `WEEK_STARTS` to `0` in `index.html` for Sunday.

### A month, start to finish

Read by the month, Spending also says where the month's money came from, where
it went, and what is left over to roll into the next one:

```
  OCTOBER SO FAR
  Carried in from September ··········· €1,421.70
  CAME IN                                €1,370.80
  Salary ··························· 5× +€1,320.80
     3 OCT   September's pay ················ €7.50
     4 OCT   September's pay ·············· €459.00
    11 OCT   October's pay ················ €321.00
    19 OCT   October's pay ················ €305.55
    25 OCT   October's pay ················ €227.75
  Dad ···································· +€50.00
  WENT OUT                                 €383.00
  Spent ······························ 31× −€383.00
  ────────────────────────────────────────────────
  Into November, so far ··············· €2,409.50
  FREE TO SPEND €2,009.50 · IN GOALS €400.00
```

Salary comes first, as one line, with every pay under it in date order and
which month each was for. Then everything else by source.

It counts **your money**, and tips are not part of it: they are cash kept apart
in the jar (see *The tip jar*). Money cut to a savings goal is still yours, so
it rolls over with the rest. The line under the total says how much of it is
actually free to spend, which is Money left. Money cut to a debt goal is a
payment, so it is a line under *Went out*. That is why one month's *Rolls into*
is always the next month's *Carried in*.

**Salary paid a week late.** If you are paid for a month a week after it ends,
the money landing on 7 October is September's pay. Settings → *Salary* →
**Paid a week late** (the default) reads it that way. Money tagged **Salary**
that lands in the first ten days of a month is shown, in that month, as the
month before's pay. Ten days, not seven, because a pay due on a Saturday lands
on the Monday, and the 9th is still last month's pay. Not more, because a pay
due on the 15th and paid early on the 13th belongs to its own month. The month it was earned
for then closes with a line saying when its pay came in. The money is still
counted in the month it actually arrived, because that is when you could
spend it. Until a month's pay arrives, the line says when to expect it: the
same day of the month as the last one, and says so if that day has passed
with nothing recorded. **Paid in the month** turns this off.

Taking money back from a debt goal is money coming back, so it is listed under
*Came in* as **Taken back from** the goal.

### A weekly limit

Set **Settings → Spend at most each week** and Home counts each week down from
it, Monday to Sunday, under the headline:

```
  WK   Left this week  ··························  €66.28
       ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪·················
       €98.72 spent · €11.05 a day for 6 days · of €165
```

Past the limit, the figure and the line turn red and say by how much. Tap it
for the week on Spending, which measures every week against the limit. The
Record spending sheet weighs each spend against the week it falls in: *Leaves
€54.28 of this week's €165*, or *Takes you €3.20 over*.

It counts what you live on, bills included. It does not count what you pay
out of a goal, like Mother's money, which came out of the pay before the week
got it, nor a spend from the tip jar. Money left stays the headline, because it
is what you actually have. A week under the limit leaves the rest there.

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

## Card payments from Apple Pay

An iPhone Shortcut can run every time a card in Wallet is tapped, and it is
handed the shop and the amount. It cannot open a home-screen web app, and a
link it opens lands in Safari, which keeps its own storage apart from the
home-screen app's. So the Shortcut writes each payment as a line in a text file
and copies the file, and Pockets reads it off the clipboard when you tap
**Paste**:

```
Pockets | 2026-11-24 13:02 | €5.65 | TESCO STORES 6387
```

The date can be in whatever form the phone writes it (`24/11/2026, 5:16 PM`,
`24 Nov 2026 at 17:16`, `2026-11-24 17:16`). Day before month, unless that
cannot be. The time is part of the payment's id, so two €3 lockers on one day
stay two payments.

Each payment is filed by the shop: like the last payment there of about the
same size (so Jacobs Inn at €48 is Hostel and at €2.50 is Coffee), else by what
the shop is (Tesco is Groceries, Bus Éireann is Transport), else as Other. A
shop you last paid out of a goal is paid out of that goal again, while it holds
enough. Pasting the same list twice adds nothing, a payment you undo stays
undone, and one you already typed in by hand, with the same amount within a
day, is skipped.

**Setting it up** (Shortcuts app → Automation → **+** → **Transaction**):

1. Pick every card you pay with. Choose **Run Immediately** → Next →
   **New Blank Automation**.
2. **Format Date**: Current Date, Date Format *Custom*, `yyyy-MM-dd HH:mm`.
3. **Text**: `Pockets | ` *Formatted Date* ` | ` *Shortcut Input → Amount*
   ` | ` *Shortcut Input → Merchant*.
4. **Append to Text File**: append *Text* to `pockets-payments.txt` in the
   Shortcuts folder, with *Make New Line* on.
5. **Get File from Folder**: Shortcuts, `pockets-payments.txt`.
6. **Get Text from Input**: *File*.
7. **Copy to Clipboard**: *Text*.

Make steps 5–7 a shortcut of their own too, called *Copy for Pockets*, for when
you have copied something else since you paid.

The first time, paste from **Settings → Card payments**. After that Home has a
**Card payments · Paste** row. iOS asks before a page reads the clipboard, so
tap its *Paste* button. If nothing comes through, run *Copy for Pockets*, or
press and hold in the box the app offers and paste there.

Only Apple Pay taps come through. Online payments, direct debits and bank
transfers do not, so record those yourself, or check them against your
statement.

A copy opened in Safari can take the same payment as a link instead:
`#card=Tesco&amount=5.65&at=2026-11-24%2013:02`.

### Collecting them automatically

A web app cannot read a file or the clipboard without a tap, so Paste is one
tap. To have payments come in just by opening Pockets, tap **Settings → Card
payments → Collect them automatically**. Pockets makes a private address on
[ntfy.sh](https://ntfy.sh), a free message relay:
`https://ntfy.sh/pockets-` followed by 32 random characters, as hard to guess
as a password. **Copy address**, and add one more action to the end of the
Shortcut:

- **Get Contents of URL**: the address, Method **POST**, Request Body **File**,
  and for the file, *Select Variable* → the **Text** box that starts
  `Pockets |`.

From then on Pockets checks the address each time it is opened or comes back
to the front, and brings in what is waiting through the same door as Paste.
So a payment already in, or one you undid, adds nothing, and **Check now**
does the same on demand.

What travels is the line and nothing else: the date, the amount and the shop.
No card number, balance, name or account. The relay does not encrypt it and
keeps it **12 hours**, so open Pockets at least once in that time. A payment
older than that is still in the Shortcut's file, and Paste brings it in. The
relay also limits how many messages one connection may send in a day. Anyone
who had the address could read what is waiting, or send a fake payment, which
Undo removes. So keep the address to yourself. **Stop collecting** forgets it,
and turning collecting on again makes a new one.

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
- **Deleting really deletes.** Removals travel as tombstones. The one
  exception is a goal: it gets a `deletedOn` date rather than being erased,
  so past months keep their figures — see below. A deletion always wins a
  merge, at its earliest date, so a device that had not heard yet cannot
  bring the goal back by editing it. A device still on an older build drops
  the date, so the next device to hear from it pushes the date back.
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

- **A month's statement is two sums split at a date.** `monthStatement()`
  totals the log before the month (what was carried in) and within it, as
  Money left plus savings goals (`left + goalSaved`), so the months chain
  without a stored balance. The tip jar is left out by counting its net —
  jar tips in, minus allocations to the jar — which is zero for a tip and its
  holding, and exactly the release when tips are let out. Allocations count only when their goal still exists, exactly as in
  `derive()`. That is why deleting a goal gives it a `deletedOn` date
  instead of removing it, even on a device that never saw money go through
  it, since another device may have: removed, its cuts would fall out
  of every past month, and September's roll-over would change after the fact.
  The date does the rest without writing a single entry. A deleted debt goal
  keeps counting, because a paid debt stays paid. A deleted savings goal
  stops counting, because its money came back that day. Past statements
  still show it held, up to that date. A give-back entry would be the
  obvious alternative, and it breaks under sync: two devices deleting the
  same goal would give its money back twice.
- **A week or a month is a pair of dates.** `periodAt(by, back)` returns the
  inclusive `from`/`to` ISO dates of the period `back` steps behind this one,
  and every Spending figure is filtered by `inPeriod()` — two string
  comparisons. Nothing about periods is stored, so they never need migrating.
- **Balances are never stored.** The only saved records are the settings, the
  items (goals, bills, repeating charges) and a flat list of transactions. Every
  figure is recomputed from that list on each render (`derive()`), so history and
  deletions always stay consistent.
- **`left = cash − cuts`.** `cash` is income minus every expense; `cuts` is what
  currently sits in goals. That one line is the app. `onHand` adds back only the
  savings goals — what a hand count should come to — and is what Count my money
  reconciles against. The tip jar is not added back.
- **A salary cut is an ordinary cut.** `applyPayCuts()` writes one `allocate`
  per goal with `payCut` set, with an id built from the pay and the goal
  (`pc-<pay>-<goal>`) and `pair` set to the pay, so Undo takes them together
  and one pay is never cut twice. `payCutsFor()` is the same sum without the
  writing, which is what the Money in sheet shows. Goals are served in list
  order and never past the pay or the target.
- **Paying from a goal is the jar's move.** An `expense` and an `allocate` of
  minus the same amount to the goal, paired to it. `paidFrom()` finds the goal
  through the pair. `burnRate()` skips the expense, as it skips a jar spend.
- **A card payment's id is the line it came from.** `card-` and a hash of its
  date, time, amount and shop, so pasting the Shortcut's whole list again adds
  nothing and a payment you undo stays undone (its tombstone blocks it). A
  payment skipped because you typed it in already gets a tombstone too, so it
  is judged once. `fileCard()` files it like the nearest-sized past payment at
  the same shop, else by `CARD_LABELS`, else as Other.
- **Saving waits 60ms, and leaving the page writes at once** (`flushSave()` on
  `pagehide` and on going hidden), so a tap followed by a swipe away is kept.
- **Goals, bills, repeating charges and the tip jar share one `items` array**,
  told apart by `type`. That is deliberate: the sync merge then has a single rule
  for all of them instead of four that can drift.
- **The tip jar is not a fourth kind of money.** A tip is ordinary income *and*
  an `allocate` into a `tips` item in the same breath, so the balance nets to
  nothing; releasing is that cut given back. No new transaction kind, no second
  set of sums. The two entries are joined by `pair`, so undoing the tip takes
  its holding with it — otherwise the balance drops while the jar keeps the
  coins. Spending from the jar is the same move the other way: an `expense`
  marked `jar`, and a cut of the same amount back out of the jar paired to it.
  Every money total (`spentIn`, `burnRate`, the statement) skips an expense
  marked `jar` (`fromJar()`), just as `incomeBy` skips a tip.
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
- **A recording sheet fits one screen, on every phone.** Amount, chips, date,
  keypad and the button it ends on are all reachable without a scroll, because
  a keypad you have to scroll to is slower than a notebook. Every vertical
  measure inside a sheet is therefore a `clamp()` on `vh` rather than a fixed
  number of pixels — generous on a Pro Max, tight on an SE, scrolling on
  neither. Add a row to a sheet and check it still fits at 320×568.
- **`touch-action:manipulation` on the body.** Without it a double tap zooms,
  and on a keypad you double-tap constantly. Pinch to zoom still works. Text
  inputs stay at 16px for the same family of reason: anything smaller and iOS
  zooms the page the moment the field takes focus.
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
