/*
  ---------- DESIGN TOKENS ----------
  Subject: a shopping list is fundamentally an itemized receipt —
  so the UI is built as a paper receipt: cream stock, perforated
  tear lines between sections, monospace numerals for money.

  Type: Space Mono (prices, totals, logo — receipt-printer feel)
        Work Sans (labels, body, inputs)
  Color:
    --paper        #FAF6ED   cream stock
    --paper-2      #F1EBDC   inset paper (inputs, track backgrounds)
    --ink          #2B2620   receipt ink
    --ink-muted    #8A8171
    --line         #DDD3BE   perforation / rule color
    --green        #2F6B4F   primary action / bought state
    --amber        #D98324   warning / edit
    --red          #C1443C   over-budget / remove
*/

:root{
  --paper:#FAF6ED;
  --paper-2:#F1EBDC;
  --ink:#2B2620;
  --ink-muted:#8A8171;
  --line:#DDD3BE;
  --green:#2F6B4F;
  --green-tint:#E4EFE9;
  --amber:#D98324;
  --amber-tint:#FBEBD8;
  --red:#C1443C;
  --red-tint:#F7E3E1;
  --radius:12px;
  --mono:'Space Mono', ui-monospace, monospace;
  --sans:'Work Sans', system-ui, sans-serif;
}

*{ margin:0; padding:0; box-sizing:border-box; }

body{
  background: #E9E2D0;
  background-image: radial-gradient(circle at 50% 0%, #EFE8D8, #E3DAC5 80%);
  color: var(--ink);
  font-family: var(--sans);
  line-height:1.5;
  min-height:100vh;
}

.wrap{ max-width:600px; margin:0 auto; padding:0 18px; }
.hidden{ display:none !important; }
button{ font-family:inherit; }

/* ---------- TOPBAR ---------- */
.topbar{ padding:20px 0 8px; }
.topbar-row{ display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.logo{ font-family: var(--mono); font-size:22px; font-weight:700; }
.logo span{ color: var(--green); }
nav ul{ display:flex; gap:6px; list-style:none; }
.navlink{
  text-decoration:none; color: var(--ink-muted); font-weight:600; font-size:14px;
  padding:6px 12px; border-radius:999px;
}
.navlink.is-active{ background: var(--ink); color: var(--paper); }
.navlink:hover:not(.is-active){ background: rgba(0,0,0,0.06); }

/* ---------- RECEIPT ---------- */
.receipt{
  background: var(--paper);
  margin:20px 0 40px;
  border-radius: var(--radius) var(--radius) 0 0;
  box-shadow: 0 1px 2px rgba(43,38,32,0.06), 0 20px 40px rgba(43,38,32,0.12);
  position:relative;
}

.receipt-head{ padding:26px 24px 18px; text-align:center; }
.receipt-title{ font-family: var(--mono); font-weight:700; font-size:22px; letter-spacing:0.02em; }
.receipt-sub{ font-size:13px; color: var(--ink-muted); margin-top:6px; }

.tear{
  height:14px;
  background-image: radial-gradient(circle at center, transparent 5px, var(--paper) 5.5px);
  background-size: 16px 16px;
  background-position: -4px center;
  background-repeat: repeat-x;
  position:relative;
}
.tear::before{
  content:""; position:absolute; left:24px; right:24px; top:50%;
  border-top:1px dashed var(--line);
}

.receipt-block{ padding:18px 24px; }
.line-label{
  font-family: var(--mono); font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
  color: var(--ink-muted); font-weight:700;
}

/* ---------- BUDGET ---------- */
.budget-row{ display:flex; align-items:flex-end; justify-content:space-between; }
.budget-figure{ font-family: var(--mono); font-weight:700; font-size:24px; margin-top:4px; }
.link-btn{
  background:none; border:none; color: var(--green); font-weight:700; font-size:13px; cursor:pointer;
}
.link-btn:hover{ text-decoration:underline; }

.budget-form{ display:flex; align-items:center; gap:8px; margin-top:10px; }
.input-prefix{ font-family: var(--mono); color: var(--ink-muted); font-size:14px; }
.budget-form input{ flex:1; }

.budget-track{
  margin-top:12px; height:10px; border-radius:999px; background: var(--paper-2);
  border:1px solid var(--line); overflow:hidden;
}
.budget-fill{
  height:100%; width:0%; background: var(--green); border-radius:999px;
  transition: width 0.35s ease, background 0.25s ease;
}
.budget-fill.is-warn{ background: var(--amber); }
.budget-fill.is-over{ background: var(--red); }
.budget-caption{
  display:flex; justify-content:space-between; font-size:12px; color: var(--ink-muted); margin-top:6px;
}
.budget-caption.is-over span:last-child{ color: var(--red); font-weight:700; }

/* ---------- FORM ELEMENTS ---------- */
input[type="text"], input[type="number"], input[type="search"], select{
  background: var(--paper-2);
  border:1px solid var(--line);
  color: var(--ink);
  font-family: var(--sans);
  font-size:14px;
  padding:10px 12px;
  border-radius:8px;
  width:100%;
}
input::placeholder{ color:#A69C89; }
input:focus, select:focus, button:focus-visible{
  outline:2px solid var(--green); outline-offset:1px; border-color: var(--green);
}

.item-form-row{ display:grid; grid-template-columns:1fr 70px 90px; gap:8px; margin-top:10px; }
.chip-row{ display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.chip{
  border:1px solid var(--line); background: var(--paper-2); color: var(--ink-muted);
  font-size:13px; font-weight:600; padding:8px 12px; border-radius:999px; cursor:pointer;
}
.chip.is-active{ background: var(--green-tint); border-color: var(--green); color: var(--green); }
.filter-chip.is-active{ background: var(--ink); border-color: var(--ink); color: var(--paper); }

.form-error{ color: var(--red); font-size:12px; margin-top:10px; }

.btn{
  font-weight:700; font-size:14px; border-radius:8px; border:1px solid transparent;
  padding:11px 18px; cursor:pointer;
}
.btn-primary{ background: var(--green); color: var(--paper); margin-top:14px; }
.btn-primary:hover{ opacity:0.92; }
.btn-sm{ padding:9px 14px; font-size:13px; margin-top:0; white-space:nowrap; }
.btn-block{ width:100%; }

/* ---------- CONTROLS ---------- */
.controls-block{ display:flex; flex-direction:column; gap:10px; }
.search-wrap{
  display:flex; align-items:center; gap:8px; background: var(--paper-2);
  border:1px solid var(--line); border-radius:8px; padding:9px 12px; color: var(--ink-muted);
}
.search-wrap input{ border:none; background:none; padding:0; outline:none; width:100%; }
.search-wrap input:focus{ outline:none; }

/* ---------- ITEM LIST ---------- */
.list-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.item-list{ list-style:none; display:flex; flex-direction:column; gap:8px; }
.item-row{
  display:flex; align-items:center; gap:10px;
  background: var(--paper-2); border:1px solid var(--line); border-radius:8px;
  padding:10px 12px; animation: rowIn 0.2s ease;
}
@keyframes rowIn{ from{opacity:0; transform:translateY(-3px);} to{opacity:1; transform:translateY(0);} }

.item-check{
  width:20px; height:20px; border-radius:5px; border:2px solid var(--line);
  background: var(--paper); flex-shrink:0; cursor:pointer; display:flex; align-items:center; justify-content:center;
  color: var(--paper); font-size:12px;
}
.item-row.is-bought .item-check{ background: var(--green); border-color: var(--green); }

.item-main{ flex:1; min-width:0; }
.item-name{ font-weight:600; font-size:14px; }
.item-row.is-bought .item-name{ text-decoration: line-through; color: var(--ink-muted); }
.item-meta{ font-size:12px; color: var(--ink-muted); margin-top:1px; }

.item-subtotal{ font-family: var(--mono); font-weight:700; font-size:14px; flex-shrink:0; }

.item-delete{
  background:none; border:none; color: var(--ink-muted); cursor:pointer; font-size:15px;
  padding:4px 6px; border-radius:4px; flex-shrink:0;
}
.item-delete:hover{ color: var(--red); background: rgba(193,68,60,0.1); }

.empty-state{ text-align:center; padding:36px 14px; color: var(--ink-muted); }
.empty-glyph{ font-size:26px; margin-bottom:6px; }
.empty-title{ font-weight:700; color: var(--ink); font-size:15px; }
.empty-sub{ font-size:13px; margin-top:3px; }

/* ---------- SUMMARY ---------- */
.summary-block{ font-family: var(--mono); font-size:13px; }
.summary-line{
  display:flex; justify-content:space-between; padding:5px 0;
  border-bottom:1px dashed var(--line);
}
.summary-line:last-child{ border-bottom:none; }
.summary-total{ font-weight:700; font-size:15px; margin-top:4px; padding-top:10px; border-top:1px dashed var(--ink-muted); border-bottom:none; }

/* ---------- HISTORY: TRIP CARDS ---------- */
.trip{
  background: var(--paper-2); border:1px solid var(--line); border-radius:8px;
  margin-bottom:8px; overflow:hidden;
}
.trip[open]{ box-shadow: inset 0 0 0 1px var(--green); }
.trip summary{
  list-style:none; cursor:pointer; padding:12px 14px;
  display:flex; align-items:center; gap:10px;
}
.trip summary::-webkit-details-marker{ display:none; }
.trip summary::before{
  content:"▸"; color: var(--ink-muted); font-size:12px; flex-shrink:0;
  transition: transform 0.15s ease;
}
.trip[open] summary::before{ transform: rotate(90deg); }
.trip-date{ font-weight:600; font-size:14px; }
.trip-meta{ font-size:12px; color: var(--ink-muted); flex:1; }
.trip-total{ font-family: var(--mono); font-weight:700; font-size:14px; }

.trip-items{
  list-style:none; padding:0 14px 12px 34px; display:flex; flex-direction:column; gap:6px;
}
.trip-items li{
  display:flex; justify-content:space-between; gap:10px; font-size:13px;
  border-top:1px dashed var(--line); padding-top:6px;
}
.trip-items li:first-child{ border-top:none; padding-top:0; }
.trip-item-meta{ color: var(--ink-muted); font-size:12px; }
.trip-item-sub{ font-family: var(--mono); font-weight:700; flex-shrink:0; }

/* ---------- PERFORATED BOTTOM EDGE ---------- */
.perforation{
  height:16px;
  background:
    radial-gradient(circle at center, #E3DAC5 6px, transparent 6.5px) center / 20px 100% repeat-x;
  margin-top:-1px;
}

/* ---------- HISTORY: TRIP CARDS ---------- */
#tripList{ display:flex; flex-direction:column; gap:8px; }
.trip{
  background: var(--paper-2); border:1px solid var(--line); border-radius:8px;
  overflow:hidden; animation: rowIn 0.2s ease;
}
.trip summary{
  display:flex; align-items:center; gap:12px;
  cursor:pointer; padding:12px 14px; list-style:none;
}
.trip summary::-webkit-details-marker{ display:none; }
.trip summary::after{
  content:"⌄"; margin-left:auto; color: var(--ink-muted); flex-shrink:0;
  transition: transform 0.2s ease;
}
.trip[open] summary::after{ transform: rotate(180deg); }
.trip-date{ font-weight:600; font-size:14px; flex:1; min-width:0; }
.trip-meta{ font-size:12px; color: var(--ink-muted); flex-shrink:0; }
.trip-total{ font-family: var(--mono); font-weight:700; font-size:14px; flex-shrink:0; }

.trip-items{
  list-style:none; padding:0 14px 12px; display:flex; flex-direction:column; gap:6px;
}
.trip-items li{
  display:flex; justify-content:space-between; align-items:flex-start; gap:10px; font-size:13px;
  padding-top:8px; border-top:1px dashed var(--line);
}
.trip-item-meta{ font-size:12px; color: var(--ink-muted); }
.trip-item-sub{ font-family: var(--mono); flex-shrink:0; white-space:nowrap; }

/* ---------- FOOTER ---------- */
.site-footer{
  text-align:center; padding:0 0 40px; color: var(--ink-muted); font-size:13px;
}
.brand-accent{ color: var(--green); font-weight:700; }

/* ---------- TOAST ---------- */
.toast{
  position:fixed; bottom:22px; left:50%; transform:translateX(-50%);
  background: var(--ink); color: var(--paper);
  padding:12px 18px; border-radius:999px; font-size:13px; font-weight:600;
  display:flex; align-items:center; gap:14px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.25); z-index:40; max-width:90vw;
}
.toast-undo{ background:none; border:none; color:#E7C27A; font-weight:700; cursor:pointer; flex-shrink:0; }

/* ---------- RESPONSIVE ---------- */
@media (max-width:520px){
  .item-form-row{ grid-template-columns:1fr; }
  .receipt-block{ padding:16px 18px; }
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration:0.001ms !important; transition-duration:0.001ms !important; }
}
