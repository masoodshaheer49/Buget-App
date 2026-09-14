/* Generates the .dc.html artboards for the Pockets design canvas.
 *
 * The five app screens share one stylesheet lifted verbatim from index.html —
 * same tokens, same class names, same numbers — so a change made here cannot
 * quietly drift from the app it is meant to represent.
 *
 *     node design/build.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------
   The app's stylesheet, trimmed to the rules these screens use.
   Values are copied from index.html, not re-derived.
   ------------------------------------------------------------------ */
const CSS = `
body{margin:0;background:#EFF1F0}
a{color:#14181A;text-decoration:none}
a:hover{color:#565F63}

.s{
  --bg:#EFF1F0;--surface:#FFFFFF;--surface-2:#F7F8F7;--sunken:#E6E9E7;
  --rule:#DCE0DE;--rule-strong:#BFC6C3;
  --ink:#14181A;--ink-2:#565F63;--ink-3:#868F92;
  --pos:#16704F;--neg:#A32A28;--due:#8A5A00;--tint:8%;
  --pad:20px;
  --font-text:'Archivo',-apple-system,'Segoe UI',Roboto,system-ui,sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;
}
.s.dk{
  --bg:#0C0E0F;--surface:#131617;--surface-2:#191D1F;--sunken:#080A0B;
  --rule:#262B2D;--rule-strong:#3C4346;
  --ink:#F0F2F1;--ink-2:#9AA3A6;--ink-3:#6B7477;
  --pos:#4FBF8B;--neg:#F2685F;--due:#D9A03C;--tint:16%;
}

.s{
  width:390px;height:844px;position:relative;overflow:hidden;
  display:flex;flex-direction:column;
  background:var(--bg);color:var(--ink);
  font-family:var(--font-text);font-size:15px;line-height:1.45;
  -webkit-font-smoothing:antialiased;
}
.s *,.s *::before,.s *::after{box-sizing:border-box}
.s button{font:inherit;color:inherit;background:none;border:0;padding:0;text-align:left}

.num{font-family:var(--font-mono);font-variant-numeric:tabular-nums}
.cents{opacity:.55}

/* topbar */
.topbar{
  flex:none;padding:18px var(--pad) 12px;
  display:flex;align-items:flex-end;gap:12px;
  background:var(--bg);border-bottom:1px solid var(--rule);
}
.topbar-txt{flex:1;min-width:0}
.topbar-title{font-size:19px;font-weight:600;letter-spacing:-.025em;line-height:1.15}
.topbar-sub{
  font-family:var(--font-mono);font-size:10.5px;color:var(--ink-3);
  text-transform:uppercase;letter-spacing:.1em;margin-top:4px;
}
.icon-btn{
  width:34px;height:34px;flex:none;border-radius:2px;
  display:grid;place-items:center;color:var(--ink-2);
  border:1px solid var(--rule);background:var(--surface);
}

/* scroll area — the fold is real, this is a 390x844 phone */
.view{flex:1;min-height:0;overflow:hidden;padding:0 var(--pad) 28px}

/* type utilities */
.sec{
  font-family:var(--font-mono);
  font-size:10.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-3);margin:30px 0 0;padding-bottom:8px;
  display:flex;align-items:baseline;gap:12px;
  border-bottom:1px solid var(--rule);
}
.sec .sec-rule{flex:1}
.sec button{
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;
  color:var(--ink-2);text-transform:uppercase;border-bottom:1px solid var(--rule-strong);
}
.muted{color:var(--ink-2)}
.tiny{font-size:12px}
.pos{color:var(--pos)}
.neg{color:var(--neg)}
.warn{color:var(--due)}
.row{display:flex;align-items:center;gap:12px}
.spread{display:flex;align-items:center;justify-content:space-between;gap:12px}
.grow{flex:1;min-width:0}
.ellip{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card{background:var(--surface);border:1px solid var(--rule);padding:16px}

/* statement head */
.hero{padding:26px 0 0}
.hero-label{
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink-3);
}
.hero-amount{
  font-size:54px;font-weight:700;letter-spacing:-.04em;
  line-height:1;margin:10px 0 18px;font-variant-numeric:tabular-nums;
}
.hero-amount .cents{opacity:.4;font-weight:600}
.hero-chips{
  display:grid;grid-template-columns:1fr 1fr;
  border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);
}
.chip{padding:11px 0;display:block}
.chip + .chip{border-left:1px solid var(--rule);padding-left:14px}
.chip i{
  display:block;font-style:normal;
  font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink-3);margin-bottom:3px;
}
.chip b{
  font-family:var(--font-mono);font-size:15px;font-weight:500;
  font-variant-numeric:tabular-nums;letter-spacing:-.01em;
}

/* control strip */
.quick{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--rule)}
.quick button{
  padding:14px 2px 13px;display:flex;flex-direction:column;align-items:center;gap:7px;
  font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink-2);
}
.quick button + button{border-left:1px solid var(--rule)}
.quick svg{color:var(--ink)}

/* rows */
.list{display:block}
.item{
  display:flex;align-items:center;gap:13px;width:100%;
  padding:14px 0 14px 13px;position:relative;
  border-bottom:1px solid var(--rule);
}
.item::before{
  content:"";position:absolute;left:0;top:10px;bottom:10px;width:3px;
  background:var(--accent-c,transparent);
}
.list .item:last-child{border-bottom:0}
.ico{
  width:36px;height:36px;flex:none;border-radius:2px;
  display:grid;place-items:center;
  font-family:var(--font-mono);font-size:12px;font-weight:500;letter-spacing:.02em;
  color:var(--accent-c,var(--ink-2));
  background:color-mix(in srgb, var(--accent-c, var(--ink-3)) var(--tint), transparent);
}
.item-title{font-weight:600;font-size:14.5px;letter-spacing:-.012em;display:block}
.item-sub{
  font-family:var(--font-mono);font-size:11px;color:var(--ink-2);
  margin-top:3px;letter-spacing:-.01em;
}
.item-amt{
  font-family:var(--font-mono);font-size:14.5px;font-weight:500;
  text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;
}
.item-amt small{
  display:block;font-size:10px;font-weight:400;color:var(--ink-3);
  margin-top:3px;text-transform:uppercase;letter-spacing:.08em;
}

.bar{height:2px;background:var(--sunken);overflow:hidden;margin-top:10px;display:block}
.bar > i{display:block;height:100%}

.badge{
  font-family:var(--font-mono);font-size:9.5px;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  padding:3px 6px;border-radius:2px;white-space:nowrap;
  background:var(--sunken);color:var(--ink-2);display:inline-block;
}
.badge.red{background:color-mix(in srgb,var(--neg) var(--tint),transparent);color:var(--neg)}
.badge.amber{background:color-mix(in srgb,var(--due) var(--tint),transparent);color:var(--due)}
.badge.green{background:color-mix(in srgb,var(--pos) var(--tint),transparent);color:var(--pos)}
.badge.accent{background:var(--sunken);color:var(--ink)}

.seg{display:flex;gap:0;border-bottom:1px solid var(--rule);margin:20px 0 0}
.seg button{
  flex:1;padding:10px 4px;text-align:center;
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink-3);border-bottom:2px solid transparent;margin-bottom:-1px;
}
.seg button[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--ink)}

/* figures divided by rules */
.tiles{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--rule)}
.tile{padding:14px 0}
.tile + .tile{border-left:1px solid var(--rule);padding-left:14px}
.tile .t-lab{
  font-family:var(--font-mono);font-size:9.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink-3);
}
.tile .t-val{
  font-family:var(--font-mono);font-size:16px;font-weight:500;
  letter-spacing:-.02em;margin-top:6px;font-variant-numeric:tabular-nums;
}

.monthnav{
  display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:16px 0 14px;border-bottom:1px solid var(--rule);
}
.monthnav .m{font-size:16px;font-weight:600;letter-spacing:-.02em}
.monthnav button{
  width:32px;height:32px;border:1px solid var(--rule);border-radius:2px;
  display:grid;place-items:center;color:var(--ink-2);background:var(--surface);
}

/* chart */
.chart{display:flex;align-items:flex-end;gap:10px;height:118px;padding-top:8px;border-bottom:1px solid var(--ink)}
.chart .col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.chart .cval{font-family:var(--font-mono);font-size:9px;color:var(--ink-3);margin-bottom:5px;white-space:nowrap}
.chart .cbar{width:100%;max-width:22px;min-height:2px;background:var(--rule-strong)}
.chart .cbar.now{background:var(--ink)}
.chart-x{display:flex;gap:10px;padding-top:7px}
.chart-x span{
  flex:1;text-align:center;
  font-family:var(--font-mono);font-size:9.5px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--ink-3);
}
.chart-x span.now{color:var(--ink)}

/* runway + pace */
.runway{padding:22px 0 18px;border-top:1px solid var(--ink);border-bottom:1px solid var(--rule)}
.rw-lab{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.rw-big{font-size:42px;font-weight:700;letter-spacing:-.04em;line-height:1.05;margin:8px 0 6px}
.rw-big span{font-size:.5em;font-weight:600;color:var(--ink-2);letter-spacing:-.02em}
.rw-sub{font-size:14px;color:var(--ink-2)}
.rw-sub b{color:var(--ink);font-weight:600}
.rw-note{font-family:var(--font-mono);font-size:11px;color:var(--ink-3);margin-top:9px;line-height:1.5}
.pace{padding:14px 0 0}
.pace-row{display:flex;align-items:center;gap:12px;padding:7px 0}
.pace-lab{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);width:88px;flex:none}
.pace-row .bar{flex:1;margin:0;height:6px}
.pace-val{font-size:12.5px;width:38px;text-align:right;flex:none}
.pace-said{margin-top:12px;padding:12px 13px;border-radius:2px;font-size:13.5px;line-height:1.55}
.pace-said b{font-weight:600}
.okbox{background:color-mix(in srgb,var(--pos) var(--tint),transparent);color:var(--ink)}
.warnbox{background:color-mix(in srgb,var(--neg) var(--tint),transparent);color:var(--ink)}

/* tab bar */
.tabbar{
  position:absolute;left:0;right:0;bottom:0;z-index:50;height:64px;
  display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;
  background:var(--surface);border-top:1px solid var(--rule);
}
.tabbar button{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
  font-family:var(--font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink-3);border-top:2px solid transparent;margin-top:-1px;
}
.tabbar button[aria-selected="true"]{color:var(--ink);border-top-color:var(--ink)}
.tabbar .fab{
  align-self:center;justify-self:center;
  width:42px;height:42px;border-radius:3px;border-top:0;margin:0;
  background:var(--ink);color:var(--bg);display:grid;place-items:center;
}

/* sheets */
.backdrop{position:absolute;inset:0;z-index:60;background:rgba(8,10,11,.5)}
.sheet{
  position:absolute;left:0;right:0;bottom:0;z-index:61;
  background:var(--bg);border:1px solid var(--rule);border-bottom:0;border-radius:4px 4px 0 0;
  display:flex;flex-direction:column;max-height:92%;
}
.sheet-grab{width:34px;height:3px;background:var(--rule-strong);margin:9px auto 2px;flex:none;border-radius:2px}
.sheet-head{padding:8px var(--pad) 12px;display:flex;align-items:center;gap:12px;flex:none;border-bottom:1px solid var(--rule)}
.sheet-head h3{margin:0;font-size:19px;font-weight:600;letter-spacing:-.03em;flex:1}
.sheet-body{padding:0 var(--pad) 24px;overflow:hidden}
.field{margin:18px 0}
.field label{
  display:block;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink-3);margin-bottom:7px;
}
.input{
  width:100%;background:var(--surface);border:1px solid var(--rule);border-radius:2px;
  padding:12px 13px;font-size:16px;
}
.input.ph{color:var(--ink-3)}
.amount-input{display:flex;align-items:baseline;gap:10px;border-bottom:2px solid var(--ink);padding:2px 0 6px}
.amount-input .cur{font-family:var(--font-mono);font-size:22px;color:var(--ink-3)}
.amount-input .val{
  flex:1;font-family:var(--font-mono);font-size:30px;font-weight:500;
  letter-spacing:-.03em;font-variant-numeric:tabular-nums;padding:4px 0;
}
.btn{
  width:100%;padding:14px;border-radius:2px;text-align:center;display:block;
  font-family:var(--font-mono);font-size:12px;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  background:var(--surface);border:1px solid var(--rule-strong);color:var(--ink);
}
.btn.primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.btn-row{display:flex;gap:8px;margin-top:8px}
`.trim();

/* ------------------------------------------------------------------
   Icons — copied from index.html's svg helpers
   ------------------------------------------------------------------ */
const I = {
  plus: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>`,
  split: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h6l4 6h6M4 18h6l2-3"/><path d="M17 3l3 3-3 3M17 15l3 3-3 3"/></svg>`,
  swap: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>`,
  chevron: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ink-2)"><path d="M9 6l6 6-6 6"/></svg>`,
  chevL: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>`,
  chevR: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  gear: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.35.4.63.73.79H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  close: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  tHome: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
  tPockets: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2"/></svg>`,
  tBills: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
  tStats: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5 20V11M12 20V4M19 20v-6"/></svg>`,
  fab: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`
};

/* ------------------------------------------------------------------
   Shaheer's real budget, 14 September 2026
   ------------------------------------------------------------------ */
const P = {
  tuition: { name: "Tuition",              mark: "TU", c: "#2E5EAA" },
  sister:  { name: "Owes Money to sister", mark: "OM", c: "#A32A56" },
  sligo:   { name: "Sligo–Dublin",         mark: "SD", c: "#C1642B" },
  grocery: { name: "Groceries",            mark: "GR", c: "#6B4FA8" },
  phone:   { name: "Phone",                mark: "PH", c: "#B08A00" },
  leap:    { name: "Leap Card",            mark: "LC", c: "#2C7A5B" },
  takeout: { name: "Take out",             mark: "TO", c: "#8C3A2E" },
  coffee:  { name: "Coffee",               mark: "CO", c: "#3F7D8C" },
  other:   { name: "Other",                mark: "OT", c: "#5C6B2E" }
};

const mark = p => `<span class="ico" style="--accent-c:${p.c}">${p.mark}</span>`;

/* An amount with the cents set a shade back, the way fmtRich() does it. */
const money = (whole, cents) => `${whole}<span class="cents">.${cents}</span>`;

function topbar(title, sub) {
  return `<header class="topbar">
      <div class="topbar-txt">
        <div class="topbar-title">${title}</div>
        <div class="topbar-sub">${sub}</div>
      </div>
      <button class="icon-btn" aria-label="Settings">${I.gear}</button>
    </header>`;
}

function tabbar(active) {
  const tab = (k, icon, label) =>
    `<button aria-selected="${active === k}">${icon}<span>${label}</span></button>`;
  return `<nav class="tabbar">
      ${tab("home", I.tHome, "Home")}
      ${tab("pockets", I.tPockets, "Pockets")}
      <button class="fab" aria-label="Add">${I.fab}</button>
      ${tab("bills", I.tBills, "Bills")}
      ${tab("stats", I.tStats, "Stats")}
    </nav>`;
}

/* A pocket row as pocketCard() renders it. */
function pocketRow(p, bal, sub, badge, pct, over) {
  return `<div class="item" style="flex-direction:column;align-items:stretch;gap:0;--accent-c:${p.c}">
      <span class="row">
        ${mark(p)}
        <span class="grow">
          <span class="item-title ellip">${p.name}</span>
          <div class="item-sub ellip">${sub}</div>
        </span>
        <span style="text-align:right">
          <div class="item-amt num">${bal}</div>
          ${badge ? `<div style="margin-top:4px">${badge}</div>` : ""}
        </span>
      </span>
      ${pct == null ? "" : `<span class="bar"><i style="width:${pct}%;background:${over ? "var(--neg)" : "var(--ink)"}"></i></span>`}
    </div>`;
}

/* A transaction row as txRow() renders it. */
function txRow(p, title, sub, amt, when, cls) {
  return `<div class="item" style="--accent-c:${p ? p.c : "transparent"}">
      <span class="ico" style="--accent-c:${p ? p.c : "var(--ink-3)"}">${p ? p.mark : "IN"}</span>
      <span class="grow">
        <span class="item-title ellip">${title}</span>
        <div class="item-sub ellip">${sub}</div>
      </span>
      <span class="item-amt num ${cls || ""}">${amt}<small>${when}</small></span>
    </div>`;
}

/* ------------------------------------------------------------------
   Screens
   ------------------------------------------------------------------ */

const HOME = `
  ${topbar("Good afternoon, Shaheer", "Monday, 14 September")}
  <main class="view">
    <section class="hero">
      <div class="hero-label">Total balance</div>
      <div class="hero-amount">€${money("986", "25")}</div>
      <div class="hero-chips">
        <span class="chip"><i>In pockets</i><b>€406.25</b></span>
        <span class="chip"><i>To assign</i><b>€580.00</b></span>
      </div>
    </section>

    <div class="quick">
      <button>${I.plus}Add</button>
      <button>${I.split}Assign</button>
      <button>${I.minus}Spend</button>
      <button>${I.swap}Move</button>
    </div>

    <div class="item">
      <span class="grow">
        <span class="item-title">Auto-assign €580</span>
        <div class="item-sub">Fill every pocket to its monthly amount</div>
      </span>
      ${I.chevron}
    </div>

    <h2 class="sec">Due soon <button>See all</button></h2>
    <div class="list">
      <div class="item" style="--accent-c:${P.phone.c}">
        ${mark(P.phone)}
        <span class="grow">
          <span class="item-title ellip">Phone</span>
          <div class="item-sub">Money is ready</div>
        </span>
        <span style="text-align:right">
          <div class="item-amt num">€20</div>
          <div style="margin-top:4px"><span class="badge">2 Oct</span></div>
        </span>
      </div>
      <div class="item" style="--accent-c:${P.phone.c}">
        ${mark(P.phone)}
        <span class="grow">
          <span class="item-title ellip">Phone</span>
          <div class="item-sub">Short €20 · pocket has €20</div>
        </span>
        <span style="text-align:right">
          <div class="item-amt num">€20</div>
          <div style="margin-top:4px"><span class="badge">30 Oct</span></div>
        </span>
      </div>
    </div>

    <h2 class="sec">September 2026<span class="sec-rule"></span></h2>
    <div class="card">
      <div class="spread">
        <div>
          <div class="tiny muted">Spent</div>
          <div class="num" style="font-size:23px;font-weight:750;letter-spacing:-.03em">€125.75</div>
        </div>
        <div style="text-align:right">
          <div class="tiny muted">Planned</div>
          <div class="num" style="font-size:15px;font-weight:650">€358.00</div>
        </div>
      </div>
      <div class="bar"><i style="width:35%;background:var(--ink)"></i></div>
      <div class="spread tiny muted" style="margin-top:8px">
        <span>Income €1,112</span>
        <span>€232.25 left of plan</span>
      </div>
    </div>

    <h2 class="sec">Recent <button>See all</button></h2>
    <div class="list">
      ${txRow(P.sister, "Masala", "Owes Money to sister", "−€1.19", "4 days ago")}
      ${txRow(P.sister, "Hammer", "Owes Money to sister", "−€3.00", "4 days ago")}
      ${txRow(P.sister, "Tesco", "Owes Money to sister", "−€8.25", "4 days ago")}
    </div>
  </main>
  ${tabbar("home")}`;

const POCKETS = `
  ${topbar("Pockets", "9 pockets · €406.25 set aside")}
  <main class="view">
    <div class="card" style="margin-top:8px">
      <div class="spread">
        <div>
          <div class="tiny muted">To assign</div>
          <div class="num" style="font-size:26px;font-weight:750;letter-spacing:-.03em">€580.00</div>
        </div>
        <span class="btn primary" style="width:auto;padding:11px 16px;font-size:14px;text-transform:none;letter-spacing:0;font-family:var(--font-text);font-weight:600">Auto-assign</span>
      </div>
    </div>

    <div class="seg">
      <button aria-selected="true">All</button>
      <button>Bill</button>
      <button>Spending</button>
      <button>Savings</button>
    </div>

    <div class="list" style="margin-top:14px">
      ${pocketRow(P.tuition, "€150.00", "€383/mo to reach €4,600 by Sep 2027", `<span class="badge amber">Behind</span>`, 3)}
      ${pocketRow(P.sister, "€97.56", "€12.44 repaid · €97.56 left to transfer", "", null)}
      ${pocketRow(P.sligo, "€52.00", "€62.00 spent of €104.00 this month", "", 50)}
      ${pocketRow(P.grocery, "€41.75", "€1.30 spent of €50.00 this month", "", 84)}
      ${pocketRow(P.phone, "€20.00", "€20 every 28 days · next 2 Oct", `<span class="badge accent">Ready</span>`, 100)}
      ${pocketRow(P.leap, "€17.00", "€33.00 spent of €30.00 this month", `<span class="badge red">Over</span>`, 57, true)}
      ${pocketRow(P.takeout, "€14.94", "€4.06 spent of €25.00 this month", "", 60)}
    </div>
  </main>
  ${tabbar("pockets")}`;

const BILLS = `
  ${topbar("Bills &amp; due dates", "October 2026")}
  <main class="view">
    <div class="monthnav">
      <button aria-label="Previous month">${I.chevL}</button>
      <div class="m">October 2026</div>
      <button aria-label="Next month">${I.chevR}</button>
    </div>

    <div class="tiles" style="margin-top:12px">
      <div class="tile"><div class="t-lab">Due</div><div class="t-val num">€40.00</div></div>
      <div class="tile"><div class="t-lab">Paid</div><div class="t-val num pos">€0.00</div></div>
      <div class="tile"><div class="t-lab">Left</div><div class="t-val num">€40.00</div></div>
    </div>

    <div style="padding:14px 0 12px;border-bottom:1px solid var(--rule)">
      <div class="spread tiny">
        <span class="item-sub" style="margin:0">Money already set aside for these</span>
        <b class="num warn">€20.00 / €40.00</b>
      </div>
      <div class="bar"><i style="width:50%;background:var(--due)"></i></div>
    </div>

    <h2 class="sec">Unpaid · 2<span class="sec-rule"></span></h2>
    <div class="list">
      <div class="item" style="flex-direction:column;align-items:stretch;gap:12px;--accent-c:${P.phone.c}">
        <div class="row">
          ${mark(P.phone)}
          <span class="grow">
            <span class="item-title ellip">Phone</span>
            <div class="item-sub">Fri, 2 Oct · Ready to pay</div>
          </span>
          <span class="item-amt num">€20.00</span>
        </div>
        <div class="btn-row">
          <span class="btn" style="padding:10px;border-color:var(--ink)">Mark as paid</span>
          <span class="btn" style="padding:10px;color:var(--ink-2);border-color:var(--rule)">Open pocket</span>
        </div>
      </div>
      <div class="item" style="flex-direction:column;align-items:stretch;gap:12px;--accent-c:${P.phone.c}">
        <div class="row">
          ${mark(P.phone)}
          <span class="grow">
            <span class="item-title ellip">Phone</span>
            <div class="item-sub">Fri, 30 Oct · Short €20.00 in pocket</div>
          </span>
          <span class="item-amt num">€20.00</span>
        </div>
        <div class="btn-row">
          <span class="btn" style="padding:10px;border-color:var(--ink)">Mark as paid</span>
          <span class="btn" style="padding:10px;color:var(--ink-2);border-color:var(--rule)">Open pocket</span>
        </div>
      </div>
    </div>
  </main>
  ${tabbar("bills")}`;

const STATS = `
  ${topbar("Statistics", "Where your money goes")}
  <main class="view">
    <div class="monthnav">
      <button aria-label="Previous month">${I.chevL}</button>
      <div class="m">September 2026</div>
      <button aria-label="Next month">${I.chevR}</button>
    </div>

    <div class="runway">
      <div class="rw-lab">If nothing more comes in</div>
      <div class="rw-big num">70 <span>days</span></div>
      <div class="rw-sub">Until <b>Monday, 23 November</b> · about 10 weeks</div>
      <div class="rw-note">€13.97 a day — €125.75 spent over the last 9 days. €1,112.00 came in over the same period; this figure does not assume it repeats.</div>
    </div>

    <div class="tiles" style="margin-top:16px">
      <div class="tile"><div class="t-lab">In</div><div class="t-val num pos">€1,112.00</div></div>
      <div class="tile"><div class="t-lab">Out</div><div class="t-val num">€125.75</div></div>
      <div class="tile"><div class="t-lab">Net</div><div class="t-val num pos">€986.25</div></div>
    </div>

    <h2 class="sec">Pace<span class="sec-rule"></span></h2>
    <div class="pace">
      <div class="pace-row">
        <span class="pace-lab">Month gone</span>
        <span class="bar"><i style="width:47%;background:var(--ink-3)"></i></span>
        <span class="pace-val num">47%</span>
      </div>
      <div class="pace-row">
        <span class="pace-lab">Plan used</span>
        <span class="bar"><i style="width:35%;background:var(--ink)"></i></span>
        <span class="pace-val num">35%</span>
      </div>
      <div class="pace-said okbox">
        On pace for <b>€269.46</b> by September 30, against <b>€358.00</b> planned. That is <b>€88.54 under</b>.
      </div>
    </div>

    <h2 class="sec">Where it goes<span class="sec-rule"></span></h2>
    <div class="list">
      <div class="item" style="flex-direction:column;align-items:stretch;gap:0;--accent-c:${P.sligo.c}">
        <div class="row">
          ${mark(P.sligo)}
          <span class="grow">
            <span class="item-title ellip">Sligo–Dublin</span>
            <div class="item-sub">49% of everything · €104 planned</div>
          </span>
          <span class="item-amt num">€62.00</span>
        </div>
        <span class="bar"><i style="width:49%;background:var(--ink)"></i></span>
      </div>
      <div class="item" style="flex-direction:column;align-items:stretch;gap:0;--accent-c:${P.leap.c}">
        <div class="row">
          ${mark(P.leap)}
          <span class="grow">
            <span class="item-title ellip">Leap Card</span>
            <div class="item-sub">26% of everything · €30 planned</div>
          </span>
          <span class="item-amt num neg">€33.00</span>
        </div>
        <span class="bar"><i style="width:26%;background:var(--neg)"></i></span>
      </div>
    </div>
  </main>
  ${tabbar("stats")}`;

/* Home with the Spend sheet raised over it. */
const SPEND = `
  ${topbar("Good afternoon, Shaheer", "Monday, 14 September")}
  <main class="view">
    <section class="hero">
      <div class="hero-label">Total balance</div>
      <div class="hero-amount">€${money("986", "25")}</div>
      <div class="hero-chips">
        <span class="chip"><i>In pockets</i><b>€406.25</b></span>
        <span class="chip"><i>To assign</i><b>€580.00</b></span>
      </div>
    </section>
    <div class="quick">
      <button>${I.plus}Add</button>
      <button>${I.split}Assign</button>
      <button>${I.minus}Spend</button>
      <button>${I.swap}Move</button>
    </div>
  </main>
  ${tabbar("home")}
  <div class="backdrop"></div>
  <div class="sheet">
    <div class="sheet-grab"></div>
    <div class="sheet-head">
      <h3>Record spending</h3>
      <button class="icon-btn" aria-label="Close">${I.close}</button>
    </div>
    <div class="sheet-body">
      <div class="row" style="padding:16px 0;border-bottom:1px solid var(--rule)">
        ${mark(P.grocery)}
        <span class="grow">
          <b style="font-weight:600">Groceries</b>
          <div class="item-sub">Pocket holds €41.75</div>
        </span>
      </div>
      <div class="field">
        <label>How much did you pay?</label>
        <div class="amount-input">
          <span class="cur">€</span>
          <span class="val">8.25</span>
        </div>
      </div>
      <div class="field">
        <label>Note</label>
        <div class="input ph">e.g. weekly shop</div>
      </div>
      <div class="field">
        <label>Date</label>
        <div class="input num">14/09/2026</div>
      </div>
      <span class="btn primary">Record spending</span>
    </div>
  </div>`;

/* ------------------------------------------------------------------
   File assembly
   ------------------------------------------------------------------ */
function artboard(body) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap">
  <style>
${CSS}
  </style>
</helmet>
<div class="s {{themeClass}}">
${body.trim()}
</div>
</x-dc>
<script data-dc-script data-props='{"dark":{"editor":"boolean","default":false,"section":"Theme"},"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  renderVals() {
    return { themeClass: this.props.dark ? 'dk' : '' };
  }
}
</script>
</body>
</html>
`;
}

const SCREENS = {
  "Main.dc.html": HOME,
  "Pockets.dc.html": POCKETS,
  "Bills.dc.html": BILLS,
  "Stats.dc.html": STATS,
  "SpendSheet.dc.html": SPEND
};

for (const [file, body] of Object.entries(SCREENS)) {
  writeFileSync(join(OUT, file), artboard(body));
  console.log("wrote", file);
}

/* ------------------------------------------------------------------
   pockets-screens.html — one standalone page carrying all five
   screens and the system they are built from, for handing to a
   design tool. No scripts, no build step, nothing to install.
   ------------------------------------------------------------------ */
const PAGE_CSS = `
  :root{color-scheme:light}
  body{
    margin:0;background:#E2E5E3;color:#14181A;
    font-family:'Archivo',-apple-system,'Segoe UI',Roboto,system-ui,sans-serif;
    font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:1400px;margin:0 auto;padding:48px 24px 80px}
  h1{font-size:30px;font-weight:700;letter-spacing:-.035em;margin:0 0 10px}
  h2{
    font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;
    font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
    color:#6D7679;margin:56px 0 0;padding-bottom:10px;border-bottom:1px solid #C8CFCB;
  }
  p{max-width:62ch;margin:0 0 14px;color:#3B4347}
  .lede{font-size:17px;color:#14181A}
  code{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:.9em;background:#D3D8D5;padding:1px 5px;border-radius:2px}
  ul{max-width:62ch;padding-left:20px;color:#3B4347}
  li{margin:7px 0}
  li b{color:#14181A}

  .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;margin-top:24px}

  /* token swatches */
  .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px;margin-top:22px}
  .sw{background:#fff;border:1px solid #C8CFCB;border-radius:2px;overflow:hidden}
  .sw .chipc{height:52px}
  .sw .meta{
    padding:8px 10px;font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;
    font-size:10px;letter-spacing:.04em;line-height:1.6;
  }
  .sw .meta b{display:block;font-weight:500;text-transform:uppercase;letter-spacing:.1em}
  .sw .meta span{color:#6D7679}

  /* type ramp */
  .ramp{background:#fff;border:1px solid #C8CFCB;border-radius:2px;padding:4px 18px;margin-top:22px}
  .ramp > div{display:flex;align-items:baseline;gap:18px;padding:13px 0;border-bottom:1px solid #E6E9E7}
  .ramp > div:last-child{border-bottom:0}
  .ramp .k{
    font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;
    font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#6D7679;
    width:168px;flex:none;white-space:nowrap;
  }

  /* phone frames */
  .frames{display:flex;flex-wrap:wrap;gap:40px 34px;margin-top:30px}
  .frame{flex:none}
  .frame .cap{
    font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;
    font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#6D7679;
    margin-bottom:10px;
  }
  .frame .dev{
    box-sizing:content-box;
    width:390px;height:844px;max-width:100%;border-radius:12px;overflow:hidden;
    border:1px solid #BFC6C3;box-shadow:0 1px 2px rgba(0,0,0,.06),0 12px 28px rgba(0,0,0,.09);
  }
  @media (max-width:520px){
    .wrap{padding:28px 16px 56px}
    .frame{max-width:100%}
    .frame .dev{box-sizing:border-box}
  }
`.trim();

const swatch = (name, hex, note) => `
      <div class="sw">
        <div class="chipc" style="background:${hex}"></div>
        <div class="meta"><b>${name}</b><span>${hex} · ${note}</span></div>
      </div>`;

const device = (cap, body, dark) => `
    <div class="frame">
      <div class="cap">${cap}</div>
      <div class="dev"><div class="s${dark ? " dk" : ""}">${body.trim()}</div></div>
    </div>`;

const SHEET = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pockets — screens and design system</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap">
<style>
${PAGE_CSS}

/* ==================================================================
   The app's own stylesheet, copied from index.html. Class names and
   values match the shipping code — a redesign expressed against these
   tokens drops straight back in.
   ================================================================== */
${CSS}
</style>
</head>
<body>
<div class="wrap">

  <h1>Pockets</h1>
  <p class="lede">A budgeting app for one student in Ireland. Money arrives, gets labelled into
  pockets, and leaves. Balances are never stored — every figure on these screens is recomputed
  from a flat list of transactions.</p>

  <h2>Brief</h2>
  <p>Below are the five screens as they are built today, at true phone size, with real figures.
  Redesign them. The markup and CSS are in this file and use the same class names as the app,
  so a change made here can be read straight back into the code.</p>

  <div class="cols">
    <div>
      <p style="font-weight:600;margin-bottom:8px">Keep</p>
      <ul>
        <li><b>Colour means something or it is not there.</b> Green is money in, red is money out,
        amber is something owed. A pocket's colour appears only as its 3px rule and its monogram —
        never as a gauge fill or a decorative tint.</li>
        <li><b>Not everything is a card.</b> Rows are separated by hairlines. Border, fill and
        radius are spent on the one thing that needs lifting.</li>
        <li><b>Figures are set in the mono face</b> with tabular figures so columns line up, and
        cents sit a shade back so the euros read first.</li>
        <li><b>Both themes.</b> Every colour is a token with a light and a dark value.</li>
        <li><b>Monograms, not emoji</b> — two letters from the pocket name, widening to three when
        two pockets would collide.</li>
      </ul>
    </div>
    <div>
      <p style="font-weight:600;margin-bottom:8px">Open to change</p>
      <ul>
        <li>Hierarchy and rhythm — what leads each screen, how much air it gets.</li>
        <li>The type pairing, if something carries the voice better.</li>
        <li>How a pocket's progress is drawn. It is a 2px square track today.</li>
        <li>The tab bar and the quick-action strip.</li>
        <li>Stats in month one, when there is no history to chart yet.</li>
      </ul>
      <p style="font-weight:600;margin:22px 0 8px">Constraints</p>
      <ul>
        <li>It runs offline as a single HTML file — no frameworks, no icon packs, no images.</li>
        <li>Hit targets stay at 44px or more.</li>
        <li>One hand, on a phone, usually in a hurry.</li>
      </ul>
    </div>
  </div>

  <h2>Colour</h2>
  <div class="swatches">
${[
  ["Paper", "#EFF1F0", "page ground"],
  ["Surface", "#FFFFFF", "the one lifted block"],
  ["Sunken", "#E6E9E7", "gauge track"],
  ["Rule", "#DCE0DE", "hairline"],
  ["Ink", "#14181A", "text, active state"],
  ["Ink 2", "#565F63", "secondary"],
  ["Ink 3", "#868F92", "labels"],
  ["Positive", "#16704F", "money in"],
  ["Negative", "#A32A28", "over, owed"],
  ["Due", "#8A5A00", "something owed"]
].map(s => swatch(s[0], s[1], s[2])).join("")}
  </div>
  <p style="margin-top:18px">Dark redefines the same ten tokens:
  <code>--bg #0C0E0F</code>, <code>--ink #F0F2F1</code>, <code>--pos #4FBF8B</code>,
  <code>--neg #F2685F</code>, <code>--due #D9A03C</code>. Pocket colours are fixed hex and do
  not change between themes.</p>

  <h2>Pocket colours</h2>
  <div class="swatches">
${Object.values(P).map(p => swatch(p.name, p.c, p.mark)).join("")}
  </div>

  <h2>Type</h2>
  <div class="ramp">
    <div><span class="k">Balance · 54/700</span><span style="font-size:54px;font-weight:700;letter-spacing:-.04em">€986</span></div>
    <div><span class="k">Title · 19/600</span><span style="font-size:19px;font-weight:600;letter-spacing:-.025em">Good afternoon, Shaheer</span></div>
    <div><span class="k">Row · 14.5/600</span><span style="font-size:14.5px;font-weight:600;letter-spacing:-.012em">Owes Money to sister</span></div>
    <div><span class="k">Body · 15/400</span><span style="font-size:15px">Money is ready to pay this one.</span></div>
    <div><span class="k">Figure · mono 14.5</span><span class="num" style="font-size:14.5px;font-weight:500">−€8.25</span></div>
    <div><span class="k">Sub · mono 11</span><span class="num" style="font-size:11px;color:#565F63">Short €20 · pocket has €20</span></div>
    <div><span class="k">Label · mono 10.5</span><span class="num" style="font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#868F92">Due soon</span></div>
  </div>

  <h2>The five screens</h2>
  <div class="frames">
${device("Home", HOME)}
${device("Pockets", POCKETS)}
${device("Bills", BILLS)}
${device("Stats", STATS)}
${device("Spend sheet", SPEND)}
${device("Home · dark", HOME, true)}
  </div>

</div>
</body>
</html>
`;

writeFileSync(join(OUT, "pockets-screens.html"), SHEET);
console.log("wrote pockets-screens.html");
