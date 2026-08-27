/* Screen flow, agent narration and presenter layer. */

const state = {
  i: 0,
  consent: false,
  plans: { ev: true, heatPump: false, wfh: false },
  priorities: [],
  variant: null,
  dispatch: "reserved",
  log: [],
};

const GEN = [0,0,0,0,.1,.4,1,1.9,2.9,3.9,4.8,5.4,5.6,5.3,4.6,3.6,2.5,1.5,.7,.2,0,0,0,0];
const USE = [.25,.25,.9,.9,.3,.3,.6,.8,.35,.3,.3,.3,.3,.3,.3,.35,.7,1.2,1.6,1.4,1.1,.8,.5,.3];

/* ---------- small helpers ---------- */

const el = (id) => document.getElementById(id);

const ICON_PATHS = {
  bess: `<rect x="2.5" y="7" width="16" height="10" rx="2.2"/><path d="M21.5 10.5v3"/><path d="M6 10v4M9.5 10v4M13 10v4"/>`,
  ev: `<rect x="3" y="3" width="10" height="18" rx="2.2"/><path d="M6.2 7.2h3.6"/><path d="M9.6 11.4 6.9 15h3.2l-2.5 3.4"/><path d="M13 10.5h2.6a2 2 0 0 1 2 2v4.3a1.7 1.7 0 0 0 3.4 0v-5.6l-1.9-1.9"/>`,
  solar: `<path d="M3 16.2h18L18.7 7H5.3z"/><path d="M8.7 7 7.1 16.2M15.3 7l1.6 9.2M4.4 11.6h15.2"/><path d="M12 4.4V2.5M18 5.5l1.2-1.2M6 5.5 4.8 4.3"/>`,
  water: `<path d="M12 2.8s5.6 6.1 5.6 9.7a5.6 5.6 0 1 1-11.2 0C6.4 8.9 12 2.8 12 2.8z"/><path d="M12.8 9.6 10.4 13.2h2.9L10.9 17"/>`,
  house: `<path d="M3 11.2 12 4l9 7.2V19a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19z"/><path d="M9.6 20.5v-6h4.8v6"/>`,
  bolt: `<path d="M13.4 2.4 4.6 13.6h6L9.8 21.6l9-11.6h-6.2z"/>`,
  chart: `<path d="M3.5 20.5h17"/><path d="M6.5 20.5v-6M11 20.5V8M15.5 20.5v-8.5M20 20.5V4.5"/>`,
  clock: `<circle cx="12" cy="12" r="8.7"/><path d="M12 6.8V12l3.4 2"/>`,
  grid: `<path d="M12 2.8v18.4M4.4 21.2 12 12l7.6 9.2"/><path d="M6.6 8.2h10.8M12 2.8h-4.2M12 2.8h4.2"/>`,
};

const icon = (name, cls = "ico") =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;

function kitStrip(v) {
  return `<div class="kit">` + v.includes.map((k) => {
    // The EV is the anchor load: say so plainly when he's told us one is coming.
    const cap = k.icon === "ev" && !state.plans.ev ? "If you get one" : k.cap;
    return `<div class="kititem ${k.state}" title="${k.title}">
      <div class="tile">${icon(k.icon, "ico big")}</div>
      <b>${k.short}</b><em>${cap}</em>
    </div>`;
  }).join("") + `</div>`;
}

function chart() {
  const max = 5.8;
  const bars = GEN.map((g, h) =>
    `<i class="gen" style="height:${Math.max(2, (g / max) * 96)}px" title="${h}:00 generating ${g} kW"></i>` +
    `<i class="use" style="height:${Math.max(2, (USE[h] / max) * 96)}px" title="${h}:00 using ${USE[h]} kW"></i>`
  ).join("");
  return `<div class="chart">${bars}</div>
    <div class="chartaxis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
    <div class="legend">
      <span><b style="background:linear-gradient(180deg,var(--cyan),var(--teal))"></b>What your roof makes</span>
      <span><b style="background:var(--peri)"></b>What your house uses</span>
      <span style="color:var(--navy-45)">Average weekday, June 2026</span>
    </div>`;
}

function dispatchSwitcher(compact) {
  return `<div class="choices" style="grid-template-columns:repeat(3,1fr);display:grid">` +
    Object.values(DISPATCH).map((d) => `
      <button class="choice ${state.dispatch === d.id ? "sel" : ""}" data-dispatch="${d.id}" style="padding:11px 13px">
        <span class="tick">${state.dispatch === d.id ? "✓" : ""}</span>
        <span class="txt"><b style="font-size:13.5px">${d.label}</b>${compact ? "" : `<span>${d.detail}</span>`}</span>
      </button>`).join("") + `</div>`;
}

function breakdown(q) {
  const rows = q.lines.map((l) => `
    <div class="brk"><div class="l">${l.label}${l.gated && state.dispatch !== "full" ? ` <em>reduced — we only control it ${state.dispatch === "none" ? "never" : "8 days a month"}</em>` : `<em>${l.basis}</em>`}</div>
    <div class="v mono">${EUR(l.value)}/yr</div></div>`).join("");

  return `<div class="card stack">
    <h3>Where the money comes from</h3>
    <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">
      ${VARIANTS[q.variant.id].name} · ${q.dispatch.label}. Recalculated live.
    </p>
    ${rows}
    <div class="brk"><div class="l">Your share of what the asset earns in the market
      <em>${EUR(q.flexGrossYear)}/yr gross × ${Math.round(q.variant.flexCustomerShare * 100)}% to you</em></div>
      <div class="v mono">${EUR(q.flexToCustomer)}/yr <span class="est">estimated — mechanism, not a promise</span></div></div>
    <div class="brk"><div class="l">What you pay us<em>${EUR(q.monthly)}/month × 12</em></div>
      <div class="v mono">−${EUR(q.annualCost)}/yr</div></div>
    <div class="brk total"><div class="l">Net change to your year</div>
      <div class="v mono">${q.net >= 0 ? "+" : "−"}${EUR(Math.abs(q.net))}</div></div>
    <p style="font-size:12px;color:var(--navy-45);margin-top:14px">
      The four-zone network tariff spread (€0.09/kWh incl. VAT) carries most of this and is published.
      Market revenue is an illustration of the mechanism: BBCM capacity clearing prices are not published,
      and a bid needs ≥1 MW — roughly 150–200 homes — before it clears at all.
    </p>
  </div>`;
}

/* ---------- screens ---------- */

const SCREENS = [

{ /* 0 — persona */
  id: "persona", label: "Persona", next: "Start the demo", role: "Session context",
  foot: "Read the household out loud before anything else. Every number in the demo is derived from it.",
  agent: ["Before the demo starts, meet the household it is built around. Everything from the next screen on is shown exactly as he would see it — this screen is the only one the customer never sees."],
  asks: [
    ["Why this household?", "Because he already has solar, and no battery, no EV and no dynamic tariff. The offer is a genuine decision for him rather than an upgrade. Pick a household that already has a battery and you'll demo a feature instead of a strategy."],
    ["How many households look like this?", "Lithuania has more than 170,000 prosumers. This profile — old net-metering terms, weekday-empty, electric water heating — is a large and identifiable slice of them, and we can identify it from DataHub without asking anyone a single question."],
    ["Why does the empty house matter so much?", "It is the whole story. His generation peaks when nobody is home and his consumption peaks after dark. Net metering used to hide that mismatch and it is eroding about 9% a year by design. He hasn't noticed yet, which is exactly why a trigger works."],
  ],
  a: [], units: ["Nothing — this is the frame, not the product"],
  note: "Choose a persona for whom the offer is a real decision, not an upgrade. No battery and no EV means every screen after this is a genuine choice rather than a feature tour. The weekday-empty detail is what makes the whole flow cohere — hold onto it.",
  render: () => {
    const facts = [
      ["solar", "6.5 kW PV", "Installed 2022, old net-metering terms", false],
      ["chart", "6,500 kWh/yr", "Consumed across the household", false],
      ["bolt", "3,000 kWh/yr", "Exported — about half of what he makes", false],
      ["water", "Electric water heating", "1,850 kWh/yr, runs at the worst hour", false],
      ["ev", "No EV yet", "Researching one. This matters later.", true],
      ["bess", "No battery", "Nothing on site can store or shift", true],
    ].map(([ic, b, s, none]) => `
      <div class="factcell ${none ? "none" : ""}">
        <span class="ic2">${icon(ic)}</span>
        <div><b>${b}</b><span>${s}</span></div>
      </div>`).join("");

    return `
      <div class="eyebrow">Before we begin</div>
      <h1>The household this is built for</h1>
      <p class="lede">One persona, carried consistently through every screen and every number that follows.</p>
      <div class="card stack">
        <div class="pcard">
          <div class="pavatar"><img src="assets/ignitis-mark.png" alt=""></div>
          <div>
            <h2>${PERSONA.name}, ${PERSONA.age}</h2>
            <div class="sub">${PERSONA.place} · Two kids · Both parents work away from home on weekdays</div>
          </div>
        </div>
        <div class="factgrid">${facts}</div>
      </div>
      <div class="callout" style="margin-top:14px">
        <b>His roof produces while his house is empty.</b>
        Generation peaks between 10:00 and 15:00; consumption peaks after dark. Net metering used to
        hide that mismatch and it is eroding about 9% a year by design. His annual bill still looks
        acceptable, so nothing has prompted him to look. That is the opening.
      </div>`;
  },
},

{ /* 1 — trigger */
  id: "trigger", label: "Trigger", next: "See what it's earning",
  foot: "Entry point: a statement of loss, computed from his own meter data. Not an offer.",
  agent: ["I'm the Ignitis assistant. Before you decide anything, let me show you something about your roof that your annual bill is hiding."],
  asks: [
    ["Why are you telling me this now?", "Because the net metering terms you signed in 2022 step down about 9% a year by design. Your bill still looks fine, so nothing has prompted you to look. By the time it prompts you, four more years will have passed."],
    ["Is this a sales pitch?", "Yes, eventually. But the first three screens are just your own data. If you close the tab after them you'll still know something useful."],
  ],
  a: [], units: ["Nothing yet — this screen spends attention, not money"],
  note: "The trigger is a loss statement, not a discount. It works only because we hold 15-minute data on >90% of consumption. Roughly ten firms have ever used third-party DataHub access — this is uncontested ground today.",
  render: () => `
    <div class="hero">
      <div class="eyebrow">Your solar, 2026</div>
      <h1>Your solar is worth less than it was in 2022.</h1>
      <p class="lede">Same roof. Same sun. Same 6,000 kWh. The terms underneath it have moved, and nothing on your bill has told you.</p>
      <div class="bigfig">
        <div><span>Value of an exported kWh, 2022</span><b class="mono">€0.21</b></div>
        <div><span>Value of an exported kWh, 2026</span><b class="mono">€0.144</b><em>−31% in four years</em></div>
        <div><span>What that cost you this year</span><b class="mono">€198</b><em>≈ €330/yr by 2030 on trend</em></div>
      </div>
    </div>
    <div class="persona">
      <img src="assets/ignitis-mark.png" alt="">
      <p><strong>${PERSONA.name} sees this first.</strong> No login, no questionnaire — the figures above
      were computed from his own metering data before he opened anything.</p>
    </div>`,
},

{ /* 1 — consent */
  id: "consent", label: "Consent", next: "Allow and continue",
  foot: "The real gate. Treated as a product feature, not a legal footnote.",
  agent: ["To go further I need your permission to read your metering data from the national DataHub. It's a real permission with a real switch — I can't fake my way past this one."],
  asks: [
    ["What exactly do you read?", "Your consumption and export in 15-minute intervals, for the last 24 months, plus your current tariff and network zone. Not your name, address history, or anything from other utilities."],
    ["Can I withdraw it?", "Yes, in one click, at any point. If you withdraw it, personalisation stops and you fall back to a standard tariff. Nothing else changes."],
  ],
  a: [], units: ["Cost-to-serve — every consent granted here removes a phone call later"],
  note: "Don't skip this in the demo. Consent rate is the real constraint on every personalised product downstream, and it is the number the session should be arguing about.",
  can: () => state.consent,
  render: () => `
    <div class="eyebrow">One permission</div>
    <h1>May I read your meter?</h1>
    <p class="lede">Everything after this screen is computed from your actual half-hourly data rather than a questionnaire. That's the whole difference.</p>
    <div class="card stack">
      <div class="toggle-row" style="border-top:0">
        <span><strong>Read my metering data from DataHub</strong><br>
          <span style="font-size:13px;color:var(--navy-45)">24 months of 15-minute consumption and export, plus my tariff and network zone.</span></span>
        <button class="switch ${state.consent ? "on" : ""}" data-toggle="consent" aria-pressed="${state.consent}"></button>
      </div>
      <p style="font-size:13px;color:var(--navy-45);margin-top:14px">
        Withdraw at any time in the app. We do not sell this data, and we do not share it with hardware partners
        without a separate permission you'd see on its own screen.</p>
    </div>`,
},

{ /* 2 — reveal */
  id: "reveal", label: "Reveal", next: "That looks right",
  foot: "Sixty seconds of narration no party without DataHub access could produce.",
  agent: [
    "Right. Your roof generates most of its power between 10:00 and 15:00 — and on weekdays, that is exactly when nobody is home.",
    "Three years ago that mismatch cost you almost nothing, because the export terms carried it. This year it cost you about €198.",
    "There's a second thing, and it's easier to fix: your water heater runs at the most expensive time of day, every single day.",
  ],
  asks: [
    ["How do you know nobody's home?", "Your weekday load between 08:00 and 17:00 averages 0.31 kW. At weekends the same window averages 0.82 kW. A 62% difference, every week, for two years."],
    ["Is €198 really a loss? I still got paid.", "You got paid €0.144 per exported kWh and bought it back in the evening at €0.24. The €198 is the gap on 3,000 kWh — money that exists only because of when you use power, not how much."],
    ["What's a network zone?", "Lithuanian distribution tariffs have four time zones, and the gap between the cheapest and most expensive is about €0.09 per kWh including VAT. That is wider than a typical day-ahead spread — and it's fixed and published, so it's the most reliable saving available to you."],
  ],
  a: ["certainty", "acceptability"], units: ["Share of verified savings — the counterfactual is provable here"],
  note: "This is the strongest sixty seconds of the demo. The 62% weekday/weekend delta and the €198 are both derived, not asserted. Personalisation that is factual rather than demographic.",
  render: () => `
    <div class="eyebrow">What your data says</div>
    <h1>Three things about your house</h1>
    <div class="card stack">
      <div class="fact">
        <div class="num mono">71%<small>of generation</small></div>
        <div>
          <h3>Your roof produces while your house is empty</h3>
          <p>71% of what you generate lands between 10:00 and 15:00. In that window your weekday load averages 0.31 kW —
          against 0.82 kW at weekends. A 62% gap, every week, for two years.</p>
          ${chart()}
        </div>
      </div>
      <div class="fact">
        <div class="num mono">€198<small>this year</small></div>
        <div>
          <h3>The gap between what you export and what you buy back</h3>
          <p>You export around 3,000 kWh at an effective €0.144 and buy it back in the evening at €0.24.
          On your 2022 terms that gap was worth €0.21 against €0.24 and barely mattered. The terms step down about 9% a year,
          so on trend this becomes roughly €330 a year by 2030.</p>
        </div>
      </div>
      <div class="fact">
        <div class="num mono">€135<small>fixable now</small></div>
        <div>
          <h3>Your water heater runs at the worst hour of the day</h3>
          <p>1,850 kWh a year, 78% of it landing in the two most expensive network zones.
          The four-zone spread is €0.09/kWh including VAT. Moving 1,500 kWh of it is worth €135 a year
          and requires no hardware, no capital, and no change you would notice.</p>
        </div>
      </div>
    </div>`,
},

{ /* 3 — confirm */
  id: "confirm", label: "Confirm", next: "Confirm and continue",
  foot: "Pre-filled from data with confidence markers. If this ever renders as empty checkboxes, the demo has failed.",
  agent: ["Here's what I think is in your house, inferred from your load shape. Correct anything I got wrong — I'd rather be corrected than confident."],
  asks: [
    ["How can you tell I have no EV?", "There is no repeating draw above 3.6 kW anywhere in 24 months. An EV charging is the most obvious signature in domestic data — you can't hide one."],
    ["What if I correct something?", "The offer on the next screens recalculates. Nothing here is decoration; each line feeds a number."],
  ],
  a: ["accessibility"], units: ["Cost-to-serve — a form nobody has to fill in"],
  note: "The claim being tested: 'we already know you.' Five inferred assets with confidence, three genuinely open questions. Everything we can derive, we derive.",
  render: () => {
    const rows = [
      ["solar", "Solar array, 6.5 kW", "Inferred from your export curve on clear-sky days in June", 96],
      ["water", "Electric water heating, ~1,850 kWh/yr", "From the recurring 2.1 kW block at 18:40 most evenings", 91],
      ["ev", "No electric vehicle", "No repeating draw above 3.6 kW in 24 months", 88, true],
      ["bess", "No battery storage", "Your export profile has no evening flattening", 99, true],
      ["clock", "House empty 08:00–17:00, Mon–Fri", "Weekday and weekend load in that window differ by 62%", 84],
    ].map(([ic, t, s, c, absent]) => `
      <div class="detected ${absent ? "absent" : ""}">
        <div class="ic">${icon(ic)}</div>
        <div class="body"><b>${t}</b><span>${s}</span></div>
        <span class="conf ${c < 90 ? "mid" : ""}">${c}% sure</span>
        <button class="linkbtn">Edit</button>
      </div>`).join("");

    const toggles = [
      ["ev", "Planning an electric vehicle in the next two years?"],
      ["heatPump", "Planning a heat pump?"],
      ["wfh", "Does anyone work from home during the week?"],
    ].map(([k, t]) => `
      <div class="toggle-row"><span>${t}</span>
      <button class="switch ${state.plans[k] ? "on" : ""}" data-toggle="${k}" aria-pressed="${state.plans[k]}"></button></div>`).join("");

    return `
      <div class="eyebrow">What we already know</div>
      <h1>Correct me where I'm wrong</h1>
      <p class="lede">Nothing here was typed by you. Every line was derived from your load shape.</p>
      <div class="card stack">${rows}</div>
      <div class="card">
        <h3 style="margin-bottom:6px">Three things your data can't tell me</h3>
        <p style="font-size:13px;color:var(--navy-45);margin-bottom:6px">These change the sizing, so they're worth thirty seconds.</p>
        ${toggles}
      </div>`;
  },
},

{ /* 4 — priorities */
  id: "priorities", label: "What matters", next: "Show me what fits",
  foot: "Pick up to two. Forcing a maximum makes this a strategy rather than a wishlist.",
  agent: ["Last question before I put numbers on anything. What are you actually trying to buy? Pick two at most — the constraint is deliberate, because a household that wants everything gets a muddle."],
  asks: [
    ["Why only two?", "Because 'cheapest possible' and 'completely predictable' are opposite products. If you pick both, whatever I build for you will be mediocre at each."],
    ["What if none of these are it?", "Then the offer won't fit, and I'd rather find that out now than after an installation date."],
  ],
  a: [], units: ["Nothing — this screen selects which unit we sell you"],
  note: "Live A-mapping is shown against each card. Note that the two Affordability cards are deliberately in tension: same A, opposite product. Someone in the room should catch it — that's the point of putting both on screen.",
  can: () => state.priorities.length > 0,
  render: () => `
    <div class="eyebrow">Your priorities</div>
    <h1>What matters most to you?</h1>
    <p class="lede">Pick up to two. <span id="pickCount" style="color:var(--navy)">${state.priorities.length}/2 chosen</span></p>
    <div class="choices stack">
      ${PRIORITIES.map((p) => `
        <button class="choice ${state.priorities.includes(p.id) ? "sel" : ""} ${state.priorities.length >= 2 && !state.priorities.includes(p.id) ? "disabled" : ""}" data-priority="${p.id}">
          <span class="tick">${state.priorities.includes(p.id) ? "✓" : ""}</span>
          <span class="txt"><b>“${p.customer}”</b></span>
          <span class="amap" data-presenter-only>${p.a}</span>
        </button>`).join("")}
    </div>`,
},

{ /* 5 — offer */
  id: "offer", label: "The offer", next: "Choose this one", wide: true,
  foot: "Three variants, priced in three different units. The numbers move when you change anything.",
  agent: [],
  asks: [
    ["Why not just buy a battery myself?", "You can — that's variant C, and you'd keep the asset and a bigger share of what it earns. On these numbers it pays back in about 13 years, which is why most households don't. The zero-upfront version exists because we can raise capital at a rate you can't."],
    ["What if I move house?", "Variant A transfers to the new occupant if they'll take it, or we remove the battery and you pay the remaining months at half rate. Variant B just ends. Variant C moves with you because it's yours."],
    ["Is doing nothing an option?", "Always. Doing nothing costs you about €198 this year and roughly €330 a year by 2030, and that's the honest comparison — not the monthly fee against zero."],
    ["Where does the monthly figure come from?", "Hardware and install amortised over the term, our financing cost, and the operating margin — less what we expect to earn from dispatching your battery. That last part is why the price falls when you give us more control."],
  ],
  a: ["certainty", "accessibility", "availability"],
  units: ["A: service level + financing spread + dispatch right", "B: certainty premium + tariff optimisation", "C: financing spread + thinner dispatch share"],
  note: "Three cards priced in three different units, so the room can see there is more than one way off the kWh. Default-highlight follows the priorities picked on the previous screen. Flip the control level and watch every number move — that's the proof the model exists rather than three static post-its.",
  tests: true,
  enter: () => { if (!state.variant) state.variant = recommendVariant(state.priorities); },
  render: () => {
    const rec = recommendVariant(state.priorities);
    const cards = Object.values(VARIANTS).map((v) => {
      const q = priceVariant(v.id, state.dispatch);
      if (q.unavailable) {
        return `<div class="offer na" data-variant="${v.id}">
          <div class="vlabel">OPTION ${v.id}</div><h3>${v.name}</h3>
          <div class="kicker">${v.kicker}</div>
          ${kitStrip(v)}
          <p style="font-size:13.5px;color:var(--bad);font-weight:600;margin-top:14px">Not available at this control level.</p>
          <p style="font-size:13px;color:var(--navy-70);margin-top:8px">This product <em>is</em> the dispatch right.
          Without control there is no hardware, no saving and nothing to sell you.</p>
        </div>`;
      }
      return `<div class="offer ${state.variant === v.id ? "sel" : ""}" data-variant="${v.id}">
        ${rec === v.id ? `<span class="tag">Best fit for you</span>` : ""}
        <div class="vlabel">OPTION ${v.id}</div>
        <h3>${v.name}</h3>
        <div class="kicker">${v.kicker}</div>
        <div class="price"><b class="mono">€${q.monthly}</b><span>/month</span></div>
        <div class="upfront">${v.upfront ? `<strong>${EUR(v.upfront)}</strong> up front` : "No upfront cost"} · ${v.term}</div>
        ${kitStrip(v)}
        <div class="netline ${q.net < 0 ? "neg" : ""}">
          <b class="mono">${q.net >= 0 ? "+" : "−"}${EUR(Math.abs(q.net))}/yr</b>
          net against doing nothing${q.paybackYears ? ` · ${q.paybackYears}-yr payback` : ""}
        </div>
        <ul class="feats">
          <li>${v.hardware}</li>
          <li>${v.ownership}</li>
          <li>Backup: ${v.caps.backup}</li>
          <li>${v.caps.billCap ? `Winter bill capped at €${v.caps.billCap}/month` : "No bill cap"}</li>
        </ul>
        <div class="units">${v.units.map((u) => `<span class="unit">${u}</span>`).join("")}</div>
        <div class="honest">${v.honestly}</div>
      </div>`;
    }).join("");

    return `
      <div class="eyebrow">Three ways to do this</div>
      <h1>What we'd offer you</h1>
      <p class="lede">Each of these makes money in a different way, and we've said which on each card.
      Doing nothing costs you about €198 this year — that's the comparison.</p>
      <div class="offers stack">${cards}</div>
      <div class="card stack" style="padding:16px 18px">
        <div style="font-size:12.5px;font-weight:650;color:var(--navy-70);margin-bottom:9px">
          Assumed control level — you decide this properly on the next screen
        </div>
        ${dispatchSwitcher(true)}
      </div>
      ${state.variant && !priceVariant(state.variant, state.dispatch).unavailable ? breakdown(priceVariant(state.variant, state.dispatch)) : ""}`;
  },
},

{ /* 6 — dispatch */
  id: "dispatch", label: "Control", next: "Agree and continue", wide: true,
  foot: "The moment the strategy turns. Dispatch has a price and we are willing to name it.",
  agent: ["Now the part most offers hide. Your battery is worth more to us if we can use it — so how much control you give us changes what you pay. All three options are real, including the one where you give us none."],
  asks: [
    ["What if you use my battery and there's an outage the same day?", "You always keep a 3 kWh reserve we cannot touch. That's roughly nine hours of fridge, boiler, lights and router. We dispatch only what sits above it."],
    ["Will I notice when you use it?", "You'll see it in the app the next morning, with what it earned. You shouldn't feel it in the house — if you do, that's a fault and it voids that month's fee."],
    ["Why does 'mine only' cost more?", "Because we've financed a €6,900 asset and get nothing back from the market. That's the honest price of the hardware on its own. We show it so the other two options mean something."],
  ],
  a: ["acceptability", "availability"],
  units: ["€/kW of controllable capacity — here the payer is BBCM and our own balancing position, not the customer"],
  note: "The number in the callout is the answer to 'what are we willing to pay a household for a dispatch right?' Base Power charges $695 plus $19/month and keeps 80% of the asset. Voltalis gives the device away and takes 100%. This screen forces us to have a number.",
  tests: true,
  render: () => {
    const v = state.variant || "A";
    const base = priceVariant(v, "reserved");
    const cards = Object.values(DISPATCH).map((d) => {
      const q = priceVariant(v, d.id);
      const diff = q.monthly - base.monthly;
      return `<button class="dcard ${state.dispatch === d.id ? "sel" : ""}" data-dispatch="${d.id}">
        <h3>${d.label}</h3>
        <p>${d.blurb}</p>
        <div class="dprice">
          ${q.unavailable
            ? `<b style="font-size:18px;color:var(--bad)">Not available</b><div class="delta" style="color:var(--navy-45)">This product is the dispatch right.</div>`
            : `<b class="mono">€${q.monthly}</b><span>/month</span>
               <div class="delta ${diff > 0 ? "up" : diff < 0 ? "down" : ""}">${diff === 0 ? "Reference price" : diff > 0 ? `+€${diff}/month` : `−€${Math.abs(diff)}/month`}
               · net ${q.net >= 0 ? "+" : "−"}${EUR(Math.abs(q.net))}/yr</div>`}
        </div>
      </button>`;
    }).join("");

    const price = dispatchRightPrice(v);
    return `
      <div class="eyebrow">Option ${v} · ${VARIANTS[v].name}</div>
      <h1>How much of it do we get to use?</h1>
      <p class="lede">You keep a guaranteed reserve in every case. What changes is what happens to the rest.</p>
      <div class="dispatch stack">${cards}</div>
      <div class="callout">
        <b class="mono">€${price.perMonth}/month · ${EUR(price.perYear)}/year</b>
        That is the difference between full flexibility and no dispatch — in other words, what we are willing to pay
        this household for the right to control its battery. Naming that number is the decision the strategy session has to make.
      </div>
      ${!priceVariant(v, state.dispatch).unavailable ? breakdown(priceVariant(v, state.dispatch)) : ""}`;
  },
},

{ /* 7 — what happens next */
  id: "next", label: "Next", next: "Skip forward three months",
  foot: "Closing the loop: a date, a named person, and exactly what changes on the bill.",
  agent: ["That's it. No paperwork to print, no meter appointment. Here's what actually happens, and when."],
  asks: [
    ["Can I change my mind?", "You have 14 days after installation, and we take the battery back at no cost. After that the 36 months apply."],
    ["What changes on my bill?", "One line replaces the old supply charge, and the flexibility credit appears separately so you can check our arithmetic. Same invoice, same date, same account."],
  ],
  a: ["accessibility"], units: ["Cost-to-serve — the cheapest install is the one with no phone calls attached"],
  note: "Unremarkable by design. Onboarding drop-off between agreement and installation is where most utility flexibility pilots actually lose their cohort.",
  render: () => {
    const v = state.variant || "A";
    const q = priceVariant(v, state.dispatch);
    return `
      <div class="eyebrow">Confirmed</div>
      <h1>What happens next</h1>
      <p class="lede">Option ${v}, ${DISPATCH[state.dispatch].label.toLowerCase()}, €${q.monthly} a month.</p>
      <div class="card stack" style="padding-bottom:16px">
        <h3 style="margin-bottom:2px">What you're getting</h3>
        <div style="max-width:460px">${kitStrip(VARIANTS[v])}</div>
      </div>
      <div class="card">
        <ul class="timeline">
          <li><b>Today</b><span>Agreement signed in the app. Nothing charged yet.</span></li>
          <li><b>Within 3 working days</b><span>Tomas from Ignitis ON calls to confirm the meter cabinet has room. Five minutes, or a photo if you'd rather.</span></li>
          <li><b>Tuesday 8 September, 09:00–13:00</b><span>Installation. About three hours, one 20-minute power cut. Someone needs to be home.</span></li>
          <li><b>That evening</b><span>Battery starts charging from your own solar. Water heater moves to the cheap zone automatically.</span></li>
          <li><b>1 October</b><span>First invoice with the new line. Your winter cap of €${VARIANTS[v].caps.billCap || "—"} applies from November.</span></li>
          <li><b>Every month after</b><span>What your battery earned, and your half of it, credited on the same invoice.</span></li>
        </ul>
      </div>`;
  },
},

{ /* 8 — operator epilogue */
  id: "operator", label: "3 months later", next: "Restart the demo",
  foot: "The only screen that shows a relationship rather than a transaction.",
  agent: [
    "February. I charged your battery at 03:10 on 24 of the 28 nights, and ran your water heater in the cheap zone every day.",
    "Your bill is €48. Your cap was €61, so the cap didn't need to catch anything this month.",
    "Your battery earned €19 in the balancing market. Half of that is yours and it's already on this invoice.",
  ],
  asks: [
    ["Show me the four nights you didn't charge", "26, 27 January and 4, 11 February — day-ahead prices were below your network zone spread, so charging would have cost you money. I left it alone. You can see the hourly detail if you want it."],
    ["Why would I open this app again?", "Because there's a number here that changes every month and half of it is yours. That's the honest answer — a nicer interface wouldn't have brought you back."],
    ["Can I see what you earned, not just my share?", "€19 gross, €9.50 to you. We show the gross figure precisely because 'you're using my battery to make money' is the objection that kills this product otherwise."],
  ],
  a: ["acceptability", "certainty", "availability"],
  units: ["€/kW controllable + share of verified savings — both visible on one invoice"],
  note: "Strategically the most valuable screen in the build. It answers 'why would anyone open the app', and it is the mechanism that converts the 'you're profiting from my asset' objection into the engagement loop we currently don't have. Transparent revenue share is doing the work, not the visual design.",
  tests: true,
  render: () => `
    <div class="eyebrow">Three months later · February 2027</div>
    <h1>Your month</h1>
    <p class="lede">This is the screen the whole thing exists for. Everything before it was a sale; this is a relationship.</p>
    <div class="card stack">
      <div class="bill">
        <div class="billrow head"><span>February invoice</span><span>Account 4417-2290</span></div>
        <div class="billrow"><span>Electricity supplied — 612 kWh</span><span class="mono">€41.20</span></div>
        <div class="billrow"><span>Network charges — 78% in cheap zones (was 22%)</span><span class="mono">€27.40</span></div>
        <div class="billrow"><span>Flexibility service — Option A, reserved days</span><span class="mono">€29.00</span></div>
        <div class="billrow credit"><span>Solar you used instead of exporting — 187 kWh</span><span class="mono">−€40.10</span></div>
        <div class="billrow credit"><span>Your share of what your battery earned — €19.00 gross, 50% yours</span><span class="mono">−€9.50</span></div>
        <div class="billrow foot"><span>Total</span><span class="mono">€48.00</span></div>
      </div>
      <p style="font-size:13px;color:var(--navy-45);margin-top:14px">
        Your winter cap was €61. It didn't need to catch anything this month — which is what a cap should mostly do.</p>
    </div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:9px"><span style="color:var(--blue)">${icon("bess")}</span> What I did with your battery</h3>
      <div class="brk"><div class="l">Nights charged from cheap-zone power<em>03:10 average start</em></div><div class="v mono">24 of 28</div></div>
      <div class="brk"><div class="l">Reserved days used<em>You allowed up to 8</em></div><div class="v mono">6</div></div>
      <div class="brk"><div class="l">Times your 3 kWh reserve was touched<em>Contractually, never</em></div><div class="v mono">0</div></div>
      <div class="brk"><div class="l">Outages ridden through<em>7 February, 19:42, 34 minutes</em></div><div class="v mono">1</div></div>
      <div class="brk total"><div class="l">Earned in the balancing market<em>€9.50 credited to you</em></div><div class="v mono">€19.00</div></div>
    </div>`,
},
];

/* ---------- rendering ---------- */

function render() {
  const s = SCREENS[state.i];
  if (s.enter) s.enter();

  const stage = el("stage");
  stage.innerHTML = `<div class="sheet ${s.wide ? "wide" : ""}">${s.render()}</div>`;
  stage.scrollTop = 0;

  el("steps").innerHTML = SCREENS.map((sc, i) =>
    `<button class="step ${i === state.i ? "active" : i < state.i ? "done" : ""}" data-step="${i}" title="${sc.label}"></button>`).join("");

  el("footnote").textContent = s.foot;
  el("nextBtn").textContent = s.next;
  el("nextBtn").disabled = s.can ? !s.can() : false;
  el("backBtn").style.visibility = state.i === 0 ? "hidden" : "visible";

  renderAgent(s);
  renderPresenter(s);
}

function renderAgent(s) {
  el("agentRole").textContent = s.role ||
    (state.i <= 4 ? "Reading your meter data" : state.i <= 7 ? "Explaining the offer" : "Operating your assets");

  el("railBody").innerHTML = s.agent.map((m) => `<div class="msg">${m}</div>`).join("") +
    state.log.map((m) => `<div class="msg ${m.me ? "me" : ""}">${m.text}</div>`).join("");
  el("railBody").scrollTop = el("railBody").scrollHeight;

  el("asks").innerHTML = `<div class="lbl">Ask me</div>` +
    s.asks.map((a, i) => `<button class="ask" data-ask="${i}">${a[0]}</button>`).join("");
}

function renderPresenter(s) {
  el("pPills").innerHTML = PRIORITIES.map((p) =>
    `<span class="pill ${s.a.includes(p.id) ? "on" : ""}">${p.a}</span>`).join("");
  el("pNote").textContent = s.note;
  el("pUnits").innerHTML = `<ul>${s.units.map((u) => `<li>${u}</li>`).join("")}</ul>` +
    (state.priorities.length
      ? `<p style="margin-top:10px">Chosen by customer: <strong style="color:#fff">${state.priorities.map((p) => PRIORITIES.find((x) => x.id === p).a).join(" + ")}</strong>
         → recommends <strong style="color:#fff">Option ${recommendVariant(state.priorities)}</strong>.</p>`
      : "");

  el("pTests").innerHTML = s.tests
    ? fourTests(state.variant || "A", state.dispatch).map((t) =>
        `<div class="test"><span class="dot ${t.pass}"></span><div><b>${t.q}</b><span>${t.a}</span></div></div>`).join("")
    : `<p>Not yet applicable — no asset or dispatch right is on the table on this screen.</p>`;
}

/* ---------- interaction ---------- */

function go(i) {
  if (i < 0) return;
  if (i >= SCREENS.length) return reset();
  state.i = i;
  state.log = [];
  render();
}

function reset() {
  state.i = 0; state.consent = false; state.priorities = [];
  state.variant = null; state.dispatch = "reserved"; state.log = [];
  state.plans = { ev: true, heatPump: false, wfh: false };
  render();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-toggle],[data-priority],[data-variant],[data-dispatch],[data-step],[data-ask]");
  if (!t) return;

  if (t.dataset.toggle) {
    const k = t.dataset.toggle;
    if (k === "consent") state.consent = !state.consent;
    else state.plans[k] = !state.plans[k];
    return render();
  }

  if (t.dataset.priority) {
    const id = t.dataset.priority;
    const at = state.priorities.indexOf(id);
    if (at > -1) state.priorities.splice(at, 1);
    else if (state.priorities.length < 2) state.priorities.push(id);
    state.variant = null;
    return render();
  }

  if (t.dataset.variant) {
    if (priceVariant(t.dataset.variant, state.dispatch).unavailable) return;
    state.variant = t.dataset.variant;
    return render();
  }

  if (t.dataset.dispatch) {
    state.dispatch = t.dataset.dispatch;
    if (state.variant && priceVariant(state.variant, state.dispatch).unavailable) state.variant = "A";
    return render();
  }

  if (t.dataset.step) return go(+t.dataset.step);

  if (t.dataset.ask) {
    const [q, a] = SCREENS[state.i].asks[+t.dataset.ask];
    state.log.push({ me: true, text: q }, { me: false, text: a });
    return renderAgent(SCREENS[state.i]);
  }
});

el("nextBtn").onclick = () => go(state.i + 1);
el("backBtn").onclick = () => go(state.i - 1);
el("resetBtn").onclick = reset;

el("railBtn").onclick = () => {
  const hidden = el("app").classList.toggle("rail-hidden");
  el("railBtn").textContent = hidden ? "Show agent" : "Hide agent";
};

function togglePresenter(force) {
  const p = el("presenter");
  p.hidden = force !== undefined ? !force : !p.hidden;
  el("presenterBtn").classList.toggle("on", !p.hidden);
  document.body.classList.toggle("presenting", !p.hidden);
}
el("presenterBtn").onclick = () => togglePresenter();
el("presenterClose").onclick = () => togglePresenter(false);

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input,textarea")) return;
  if (e.key === "p" || e.key === "P") togglePresenter();
  if (e.key === "ArrowRight" && !el("nextBtn").disabled) go(state.i + 1);
  if (e.key === "ArrowLeft") go(state.i - 1);
});

render();
