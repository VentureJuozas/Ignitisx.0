/* Screens and interaction for the platform demo — contractor variant.
   Eleven screens, Lithuanian by default. No presenter layer: every string here
   is something the customer would see. */

const state = {
  i: 0,
  scenario: "full",   // "full" | "addon" — chosen on the profile screen
  approach: null,      // null until he picks; "financed" | "upfront"
  contractor: null,
  lender: "seb",
  dispatch: null,      // null until he answers, then "yes" or "no"
  formFilled: false,
  log: [],
};

const el = (id) => document.getElementById(id);

/* ---------- chrome ---------- */

const CHROME = {
  brandtag: { lt: "Platforma · koncepcijos maketas", en: "Platform · concept mockup" },
  agentName: { lt: "Ignitis pagalbininkas", en: "Ignitis assistant" },
  hideRail: { lt: "Slėpti pagalbininką", en: "Hide assistant" },
  showRail: { lt: "Rodyti pagalbininką", en: "Show assistant" },
  reset: { lt: "Pradėti iš naujo", en: "Restart" },
  back: { lt: "Atgal", en: "Back" },
  askMe: { lt: "Paklauskite", en: "Ask me" },
};

/* ---------- icons ---------- */

const ICON_PATHS = {
  bess: `<rect x="2.5" y="7" width="16" height="10" rx="2.2"/><path d="M21.5 10.5v3"/><path d="M6 10v4M9.5 10v4M13 10v4"/>`,
  ev: `<rect x="3" y="3" width="10" height="18" rx="2.2"/><path d="M6.2 7.2h3.6"/><path d="M9.6 11.4 6.9 15h3.2l-2.5 3.4"/><path d="M13 10.5h2.6a2 2 0 0 1 2 2v4.3a1.7 1.7 0 0 0 3.4 0v-5.6l-1.9-1.9"/>`,
  solar: `<path d="M3 16.2h18L18.7 7H5.3z"/><path d="M8.7 7 7.1 16.2M15.3 7l1.6 9.2M4.4 11.6h15.2"/><path d="M12 4.4V2.5M18 5.5l1.2-1.2M6 5.5 4.8 4.3"/>`,
  water: `<path d="M12 2.8s5.6 6.1 5.6 9.7a5.6 5.6 0 1 1-11.2 0C6.4 8.9 12 2.8 12 2.8z"/><path d="M12.8 9.6 10.4 13.2h2.9L10.9 17"/>`,
  heat: `<rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2.4"/><circle cx="12" cy="12" r="4.2"/><path d="M12 8.4V12l2.4 1.5"/>`,
  chart: `<path d="M3.5 20.5h17"/><path d="M6.5 20.5v-6M11 20.5V8M15.5 20.5v-8.5M20 20.5V4.5"/>`,
  bolt: `<path d="M13.4 2.4 4.6 13.6h6L9.8 21.6l9-11.6h-6.2z"/>`,
  grid: `<path d="M12 2.8v18.4M4.4 21.2 12 12l7.6 9.2"/><path d="M6.6 8.2h10.8M12 2.8h-4.2M12 2.8h4.2"/>`,
  hardhat: `<path d="M3.5 17.4h17"/><path d="M5.6 17.4v-2.8a6.4 6.4 0 0 1 12.8 0v2.8"/><path d="M9.8 8.8V4.8a1.4 1.4 0 0 1 1.4-1.4h1.6a1.4 1.4 0 0 1 1.4 1.4v4"/>`,
  card: `<rect x="2.6" y="5.4" width="18.8" height="13.2" rx="2.4"/><path d="M2.6 10h18.8"/><path d="M16.4 14.6h2.6"/>`,
  doc: `<path d="M6.2 2.8h7.4L18.8 8v13.2H6.2z"/><path d="M13.6 2.8V8h5.2"/><path d="M9.2 13h6.2M9.2 16.4h6.2"/>`,
  shield: `<path d="M12 2.8 20 5.6v6.2c0 4.6-3.3 7.9-8 9.4-4.7-1.5-8-4.8-8-9.4V5.6z"/><path d="m8.6 12 2.4 2.4 4.4-4.4"/>`,
  clock: `<circle cx="12" cy="12" r="8.7"/><path d="M12 6.8V12l3.4 2"/>`,
  check: `<path d="m4.6 12.6 4.6 4.6L19.4 7"/>`,
};

const icon = (name, cls = "ico") =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;

/* ---------- shared pieces ---------- */

/* Hardware strip: 7.3 kW PV · 11.52 kWh battery · 10 kW inverter.
   In the add-on scenario PV and inverter are already on the roof. */
function hwLabel(c) {
  return t({
    lt: `${NUM(c.pv)} kW PV · ${NUM(c.battery, 2)} kWh kaupiklis · ${NUM(c.inverter, 0)} kW inverteris`,
    en: `${NUM(c.pv)} kW PV · ${NUM(c.battery, 2)} kWh battery · ${NUM(c.inverter, 0)} kW inverter`,
  });
}

function kitStrip(c) {
  const addon = SCENARIO.id === "addon";
  const items = [
    {
      icon: "solar",
      short: t({ lt: "Saulės elektrinė", en: "Solar array" }),
      cap: addon
        ? t({ lt: `${NUM(c.pv)} kW · jau yra`, en: `${NUM(c.pv)} kW · already in` })
        : `${NUM(c.pv)} kW PV`,
      state: addon ? "owned" : "in",
    },
    {
      icon: "bess",
      short: t({ lt: "Kaupiklis", en: "Battery" }),
      cap: `${NUM(c.battery, 2)} kWh`,
      state: "in",
    },
    {
      icon: "bolt",
      short: t({ lt: "Inverteris", en: "Inverter" }),
      cap: addon
        ? t({ lt: `${NUM(c.inverter, 0)} kW · jau yra`, en: `${NUM(c.inverter, 0)} kW · already in` })
        : `${NUM(c.inverter, 0)} kW`,
      state: addon ? "owned" : "in",
    },
  ];
  return `<div class="kit kit-triple">` + items.map((k) => `
    <div class="kititem ${k.state}">
      <div class="tile">${icon(k.icon, "ico big")}</div>
      <b>${k.short}</b><em>${k.cap}</em>
    </div>`).join("") + `</div>`;
}

const stars = (c) => `<div class="stars"><em>★</em>${NUM(c.rating, 1)}
  <span>${c.reviews} ${t({ lt: "atsiliepimai", en: "reviews" })}</span></div>`;

/* Brand marks for contractors and financing partners. Keep the name in the
   markup as a fallback; the image carries recognition on the card. */
const brandLogo = (src, name, cls = "brandlogo") =>
  src
    ? `<img class="${cls}" src="${src}" alt="${name}" title="${name}" loading="lazy">`
    : "";

const contractorLogo = (c, cls = "brandlogo contractor") => brandLogo(c?.logo, c?.name || "", cls);
const lenderLogo = (lender, cls = "brandlogo partner") => brandLogo(lender?.logo, lender?.name || "", cls);

const lenderStrip = (cls = "partnerstrip") =>
  `<div class="${cls}" aria-label="${t({ lt: "Finansavimo partneriai", en: "Financing partners" })}">` +
  LENDERS.map((p) => brandLogo(p.logo, p.name, "brandlogo partner strip")).join("") +
  `</div>`;

const contractorStrip = (cls = "contractorstrip") =>
  `<div class="${cls}" aria-label="${t({ lt: "Rangovai", en: "Contractors" })}">` +
  CONTRACTORS.map((c) => brandLogo(c.logo, c.name, "brandlogo contractor strip")).join("") +
  `</div>`;

function activeQuote() {
  if (!state.contractor) return bestQuote(state.lender);
  return state.approach === "upfront"
    ? upfrontQuote(state.contractor)
    : quote(state.contractor, state.lender);
}

/* Skip lender / credit screens when the customer pays outright. */
function nextIndex(i) {
  if (state.approach === "upfront") {
    if (i === 2) return 4;  // offers -> flexibility
    if (i === 4) return 8;  // flexibility -> checkout
  }
  return i + 1;
}
function prevIndex(i) {
  if (state.approach === "upfront") {
    if (i === 4) return 2;
    if (i === 8) return 4;
  }
  return i - 1;
}


/* Where the monthly figure comes from. Electricity components (purchased /
   export / flexibility) are shown as separate rows so the net billAfter line
   is readable; export and flex annuals are converted to monthly equivalents.
   Those components are informational — billAfter is already net of them.
   Then loan (if financed), total, current bill, and saving. */
function breakdown(q) {
  const c = q.contractor;
  const financed = Boolean(q.lender);
  const exportMonthly = c.exportAnnual / 12;
  const flexMonthly = c.flexAnnual / 12;

  /* cls: "" | "detail" | "sub" — detail rows explain the net; only sub + loan
     count toward the monthly total visually. credit paints the value green. */
  const rows = [
    [t({ lt: "Įsigyjama elektra", en: "Purchased electricity" }),
     t({ lt: "Likę tinklo pirkimai su PV ir kaupikliu",
         en: "Remaining grid imports with PV and battery" }),
     c.purchasedElectricity, false, "detail"],
    [t({ lt: "Eksporto kreditas", en: "Export credit" }),
     t({ lt: `${EUR(c.exportAnnual)}/metus → mėnesio ekvivalentas — jau įskaičiuota`,
         en: `${EUR(c.exportAnnual)}/yr → monthly equivalent — already included` }),
     -exportMonthly, true, "detail"],
    [t({ lt: "Lankstumo dalis", en: "Flexibility share" }),
     t({ lt: `${EUR(c.flexAnnual)}/metus → mėnesio ekvivalentas — jau įskaičiuota`,
         en: `${EUR(c.flexAnnual)}/yr → monthly equivalent — already included` }),
     -flexMonthly, true, "detail"],
    [t({ lt: "Elektra su PV + kaupikliu", en: "Electricity with PV + battery" }),
     t({ lt: "Grynoji elektros eilutė — eksportas ir lankstumas jau įskaičiuoti",
         en: "Net electricity line — export and flexibility already included" }),
     c.billAfter, false, "sub"],
  ];
  if (financed) {
    rows.push([t({ lt: `Paskolos įmoka · ${q.lender.name}`, en: `Loan instalment · ${q.lender.name}` }),
      t({ lt: `${q.years} ${YEARS(q.years)}, ${NUM(q.lender.rate * 100, 1)} % metinės palūkanos, 0 € pradinis įnašas`,
         en: `${q.years} years at ${NUM(q.lender.rate * 100, 1)}%, zero upfront` }),
      q.loan, false, ""]);
  }

  const todayEm = SCENARIO.id === "addon"
    ? t({ lt: "Su esama saulės elektrine, be kaupiklio", en: "With the existing array, without a battery" })
    : t({ lt: "Be saulės elektrinės, be kaupiklio", en: "No array, no battery" });

  const rowHtml = ([l, basis, v, credit, cls]) => `
      <div class="brk${cls ? ` ${cls}` : ""}"><div class="l">${l}<em>${basis}</em></div>
      <div class="v mono"${credit ? ' style="color:var(--ok)"' : ""}>${v < 0 ? "−" : ""}${EUR(Math.abs(v), 2)}</div></div>`;

  return `<div class="card stack">
    <h3>${t({ lt: "Iš ko susideda mėnesio suma", en: "What the monthly figure is made of" })}</h3>
    <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">
      ${c.name}${financed ? ` · ${q.lender.name} · ${q.years} ${t({ lt: "metų terminas", en: "year term" })}` : ` · ${t({ lt: "pirkimas iš karto", en: "bought outright" })}`}.
      ${t({ lt: "Perskaičiuojama iškart.", en: "Recalculated live." })}
    </p>
    ${rows.map(rowHtml).join("")}
    <div class="brk total"><div class="l">${t({ lt: "Iš viso per mėnesį", en: "Total per month" })}
      <em>${financed
        ? t({ lt: "Elektra + paskola — kol mokama paskola", en: "Electricity + loan — while the loan runs" })
        : t({ lt: "Be paskolos — tik elektra su sistema", en: "No loan — electricity with the system only" })}</em></div>
      <div class="v mono">${EUR(q.monthly, 2)}</div></div>
    <div class="brk"><div class="l">${t({ lt: "Dabartinė elektros sąskaita", en: "Your electricity bill today" })}
      <em>${todayEm}</em></div>
      <div class="v mono">${EUR(PERSONA.currentMonthlyCost, 2)}</div></div>
    <div class="diffline ${q.monthlySaving >= 0 ? "" : "neg"}">
      <div>
        <span class="k">${q.monthlySaving >= 0
          ? t({ lt: "Sutaupote per mėnesį", en: "You save per month" })
          : t({ lt: "Mokate daugiau per mėnesį", en: "You pay more per month" })}</span>
        <em>${t({ lt: `Per metus ${q.annualBenefit >= 0 ? "+" : "−"}${EUR(Math.abs(q.annualBenefit))}`,
                  en: `${q.annualBenefit >= 0 ? "+" : "−"}${EUR(Math.abs(q.annualBenefit))} a year` })}</em>
      </div>
      <b class="mono">${q.monthlySaving >= 0 ? "" : "−"}${EUR(Math.abs(q.monthlySaving), 2)}</b>
    </div>
    ${!financed ? `<div class="honestpanel" style="margin-top:14px">
      <b>${t({ lt: `Po atsipirkimo — apie ${EUR(PAYBACK.afterPaybackSaving)}/mėn.`, en: `After payback — about ${EUR(PAYBACK.afterPaybackSaving)}/mo` })}</b>
      ${t({
        lt: `Atsiperkamumas ${NUM(PAYBACK.yearsNoSubsidy, 1)} m. be paramos, ${NUM(PAYBACK.yearsWithSubsidy30, 1)} m. su 30 % valstybės parama. Po to paskolos įmokos nebelieka — taupymas lygus elektros sutaupymui.`,
        en: `Payback in ${NUM(PAYBACK.yearsNoSubsidy, 1)} yr with no subsidy, ${NUM(PAYBACK.yearsWithSubsidy30, 1)} yr with a 30% state subsidy. After that there is no instalment — the saving equals the electricity saving.` })}
    </div>` : `<p style="font-size:12px;color:var(--navy-45);margin-top:14px">${t({
      lt: `Po paskolos laikotarpio įmokos nebelieka — tada mėnesio taupymas pakyla iki ~${EUR(PAYBACK.afterPaybackSaving)} (kaip pirkimo iš karto atveju).`,
      en: `When the loan ends the instalment drops away — monthly saving then rises to ~${EUR(PAYBACK.afterPaybackSaving)} (same as buying outright after payback).`,
    })}</p>`}
  </div>`;
}

/* ---------- screens ---------- */

const SCREENS = [

{ /* 0 — persona + scenario toggle */
  id: "profilis",
  label: { lt: "Profilis", en: "Profile" },
  next: { lt: "Pradėti demonstraciją", en: "Start the demo" },
  role: { lt: "Sesijos kontekstas", en: "Session context" },
  foot: { lt: "Pasirinkite scenarijų, tada perskaitykite namų ūkį. Visi tolesni skaičiai išvedami iš jo.",
          en: "Pick the scenario, then read the household. Every later number derives from it." },
  agent: [{ lt: "Prieš demonstraciją — pasirinkite, ar rodome visą sistemą, ar tik kaupiklio prieaugį prie esamos saulės elektrinės. Tada — namų ūkis, kuriam viskas sukurta.",
            en: "Before the demo, choose whether we show a full system or a battery add-on beside an existing array. Then meet the household it is built around." }],
  asks: [
    [{ lt: "Kuo skiriasi du scenarijai?", en: "How do the two scenarios differ?" },
     { lt: "Visa sistema — 7,3 kW PV, 10 kW inverteris ir 11,52 kWh kaupiklis už 7 995 €. Prieaugis — tik kaupiklis už 3 565 € namų ūkiui, kuris jau turi elektrinę ir vartoja 7 000 kWh/metus.",
       en: "Full system — 7.3 kW PV, 10 kW inverter and 11.52 kWh battery at €7,995. Add-on — battery only at €3,565 for a household that already has an array and uses 7,000 kWh/yr." }],
    [{ lt: "Kodėl būtent šis namų ūkis?", en: "Why this household?" },
     { lt: "Nes vartojimas jau didelis ir vakarinis: šilumos siurblys ir elektromobilis. Tokiam namų ūkiui kaupiklis duoda daugiausiai.",
       en: "Because consumption is already high and evening-heavy: heat pump and EV. A battery does the most for a household like this." }],
    [{ lt: "Ar galiu keisti scenarijų vėliau?", en: "Can I change scenario later?" },
     { lt: "Geriau grįžti į šį ekraną arba spausti „Pradėti iš naujo“. Scenarijus perrašo kainas, sąskaitą ir rangovų pasiūlymus.",
       en: "Come back to this screen or hit Restart. The scenario rewrites prices, the bill and the contractor quotes." }],
  ],
  can: () => Boolean(state.scenario),
  render: () => {
    const scenarioCards = Object.values(SCENARIOS).map((sc) => `
      <button class="acard ${state.scenario === sc.id ? "sel" : ""}" data-scenario="${sc.id}">
        <h3>${t(sc.label)}</h3>
        <p>${t(sc.blurb)}</p>
        <div class="afig" style="margin-top:12px">
          <div><span class="k">${t({ lt: "Bazinė kaina", en: "Baseline price" })}</span>
            <span class="v mono">${EUR(sc.contractors[0].price)}</span></div>
        </div>
      </button>`).join("");

    const facts = [
      ["chart", t({ lt: `${PERSONA.consumption.toLocaleString(LANG.current === "lt" ? "lt-LT" : "en-IE")} kWh/metus`,
                    en: `${PERSONA.consumption.toLocaleString("en-IE")} kWh/yr` }),
        t({ lt: "Visas namų ūkio vartojimas", en: "Total household consumption" })],
      ["card", t({ lt: `~${EUR(140)}/mėn.`, en: `~${EUR(140)}/mo` }),
        t({ lt: "Vidutinė elektros sąskaita", en: "Average electricity bill" })],
      PERSONA.hasSolar
        ? ["solar", t({ lt: "Saulės elektrinė jau yra", en: "Solar array already in" }),
           t({ lt: `${NUM(SIZING.pv)} kW · ${NUM(SIZING.inverter, 0)} kW inverteris`, en: `${NUM(SIZING.pv)} kW · ${NUM(SIZING.inverter, 0)} kW inverter` })]
        : ["heat", t({ lt: "Šilumos siurblys oras–vanduo", en: "Air-to-water heat pump" }),
           t({ lt: `Įrengtas ${PERSONA.heatPumpYear} m. — didžiausia vartojimo dalis`, en: `Installed ${PERSONA.heatPumpYear} — the largest single load` })],
      ["ev", t({ lt: "Elektromobilis", en: "Electric vehicle" }),
        t({ lt: `Nuo ${PERSONA.evYear} m., kraunamas namuose vakarais`, en: `Since ${PERSONA.evYear}, charged at home in the evening` })],
    ].map(([ic, b, s]) => `
      <div class="factcell">
        <span class="ic2">${icon(ic)}</span>
        <div><b>${b}</b><span>${s}</span></div>
      </div>`).join("");

    return `
      <div class="eyebrow">${t({ lt: "Prieš pradedant", en: "Before we begin" })}</div>
      <h1>${t({ lt: "Pasirinkite demonstracijos scenarijų", en: "Choose the demo scenario" })}</h1>
      <p class="lede">${t({
        lt: "Du keliai per tą pačią platformą. Skiriasi įranga, kaina ir namų ūkio sąskaita.",
        en: "Two paths through the same platform. Hardware, price and the household bill differ." })}</p>

      <div class="card stack">
        <div class="pcard">
          <div class="pavatar"><img src="assets/ignitis-mark.png" alt=""></div>
          <div>
            <h2>${PERSONA.name}, ${PERSONA.age}</h2>
            <div class="sub">${t(PERSONA.place)} · ${t(PERSONA.household)}</div>
          </div>
        </div>
        <div class="factgrid factgrid-4">${facts}</div>
      </div>

      <div class="approach stack" style="margin-top:22px">${scenarioCards}</div>`;
  },
},

{ /* 1 — the offer in principle */
  id: "galimybe",
  label: { lt: "Galimybė", en: "Opportunity" },
  next: { lt: "Rodyti, ką tai reiškia man", en: "Show me what this means" },
  role: { lt: "Pirmas kontaktas", en: "First contact" },
  wide: true,
  foot: { lt: "Pradinis ekranas: rezultatas, ne produktas. Trys dalyviai pavadinti iškart.",
          en: "Entry point: an outcome, not a product. All three parties named immediately." },
  agent: [
    { lt: "Sveiki, Dariau. Jūs jau esate Ignitis klientas, todėl galiu pasakyti konkrečiai: kas mėnesį galite mokėti mažiau nei šiandien, nesumokėję nė vieno euro iš savo kišenės.",
      en: "Hello Darius. You are already an Ignitis customer, so I can be specific: you can pay less every month than you do today, without spending a single euro of your own." },
    { lt: "Už įrangą sumoka finansavimo partneris, įrengia Jūsų pasirinktas rangovas, o kaupiklį valdome mes ir uždirbtą vertę dalijamės su Jumis. Būtent ta dalis ir padaro mėnesio sumą mažesnę.",
      en: "A financing partner pays for the equipment, a contractor you choose installs it, and we operate the battery and share the value it creates with you. That share is exactly what brings the monthly figure down." },
  ],
  asks: [
    [{ lt: "Kur čia paslėptas mokestis?", en: "Where is the catch?" },
     { lt: "Nėra paslėpto mokesčio, bet yra sąlyga: kaupiklį valdome mes. Apie tai bus atskiras ekranas. Jei to nesutinkate, platformos pasiūlymo tiesiog nėra.",
       en: "There is no hidden fee, but there is a condition: we control the battery. It gets its own screen. If you decline it, the platform offer simply does not exist." }],
    [{ lt: "Kam priklauso įranga?", en: "Who owns the equipment?" },
     { lt: "Jums. Nuo pirmos dienos. Ne Ignitis, ne rangovui, ne bankui — bankui priklauso paskola, o ne kaupiklis. Todėl ir valstybės parama atitenka Jums, o ne mums.",
       en: "You do, from day one. Not Ignitis, not the contractor, not the lender — the lender holds the loan, not the battery. That is also why any state support goes to you rather than to us." }],
    [{ lt: "O jei nieko nedarysiu?", en: "What if I do nothing?" },
     { lt: `Mokėsite apie ${EUR(PERSONA.currentMonthlyCost)} per mėnesį ir toliau, o šilumos siurblys kasmet suvartos tiek pat. Tai ir yra sąžiningas palyginimas — ne mėnesinė įmoka prieš nulį.`,
       en: `You keep paying around ${EUR(PERSONA.currentMonthlyCost)} a month, and the heat pump keeps consuming the same. That is the honest comparison — not the instalment against zero.` }],
  ],
  render: () => {
    const best = bestQuote(state.lender);
    const roles = [
      ["hardhat", t({ lt: "Rangovas", en: "Contractor" }),
        t({ lt: "Parduoda ir įrengia", en: "Supplies and installs" }),
        t({ lt: "Jūs pasirenkate iš platformoje patikrintų rangovų. Įranga, montavimas ir servisas — viename pasiūlyme, su viena garantija.",
            en: "You choose from vetted contractors on the platform. Equipment, installation and service in one bundle, under one warranty." }),
        contractorStrip()],
      ["card", t({ lt: "Finansavimo partneris", en: "Financing partner" }),
        t({ lt: "Sumoka už įrangą", en: "Pays for the equipment" }),
        t({ lt: `Vartojimo kreditas pardavimo vietoje: ${LOAN_YEARS} ${YEARS(LOAN_YEARS)}, 0 € pradinis įnašas. Pasirenkate vieną iš ${LENDERS.length} platformos partnerių.`,
            en: `A point-of-sale consumer loan over ${LOAN_YEARS} years with nothing upfront. You pick one of ${LENDERS.length} partners on the platform.` }),
        lenderStrip()],
      ["bolt", "Ignitis", t({ lt: "Valdo ir dalijasi verte", en: "Operates and shares the value" }),
        t({ lt: "Mes valdome kaupiklį, tiekiame elektrą ir viską sudedame į vieną sąskaitą. Tai, ką kaupiklis uždirba rinkoje, dalijamės su Jumis.",
            en: "We operate the battery, supply the electricity and put all of it on one invoice. What the battery earns in the market, we share with you." }),
        `<div class="partnerstrip ignitis"><img class="brandlogo ignitis" src="assets/ignitis-logo.png" alt="Ignitis"></div>`],
    ].map(([ic, who, b, p, logos]) => `
      <div class="role">
        <div class="ic3">${icon(ic, "ico big")}</div>
        <div class="who">${who}</div><b>${b}</b><p>${p}</p>
        ${logos}
      </div>`).join("");

    return `
      <div class="hero">
        <div class="eyebrow">${t({ lt: "Ignitis platforma", en: "The Ignitis platform" })}</div>
        <h1>${t({
          lt: `Sutaupykite apie ${EUR(best.monthlySaving)} per mėnesį neišleidę nė vieno euro.`,
          en: `Save around ${EUR(best.monthlySaving)} a month without spending a single euro.` })}</h1>
        <p class="lede">${t({
          lt: `Už įrangą sumoka finansavimo partneris, o kaupiklį valdome mes: kiekvieną mėnesį dalijamės tuo, ką jis uždirba rinkoje, ir Jūsų dalis nuimama nuo sąskaitos. Būtent todėl mėnesio suma būna mažesnė nei dabartinė sąskaita.`,
          en: `A financing partner pays for the equipment, and we operate the battery: each month we share what it earns in the market, and your share comes off the bill. That is why the monthly figure lands below your current one.` })}</p>
        <div class="bigfig">
          <div><span>${t({ lt: "Sumokate šiandien", en: "Due today" })}</span><b class="mono">${EUR(0)}</b>
            <em>${t({ lt: "Jokio pradinio įnašo, jokio užstato", en: "No deposit, no upfront payment" })}</em></div>
          <div><span>${t({ lt: "Sutaupote per mėnesį", en: "You save monthly" })}</span><b class="mono">${t({ lt: "iki", en: "up to" })} ${EUR(best.monthlySaving)}</b>
            <em>${t({ lt: `${EUR(best.monthly)} vietoje ${EUR(PERSONA.currentMonthlyCost)}`, en: `${EUR(best.monthly)} instead of ${EUR(PERSONA.currentMonthlyCost)}` })}</em></div>
          <div><span>${t({ lt: "Kam priklauso įranga", en: "Who owns it" })}</span><b class="mono">${t({ lt: "Jums", en: "You do" })}</b>
            <em>${t({ lt: "nuo pirmos dienos", en: "from day one" })}</em></div>
        </div>
      </div>
      <div class="roles">${roles}</div>
      <div class="persona">
        <img src="assets/ignitis-mark.png" alt="">
        <p><strong>${t({ lt: "Ignitis nefinansuoja nė vienos šios schemos dalies.", en: "Ignitis funds no part of this." })}</strong>
        ${t({ lt: "Įrangą apmoka partneris, įrengia rangovas, o nuosavybė atitenka klientui. Ignitis uždirba iš platformos maržos ir lankstumo pajamų dalies.",
              en: "The partner pays for the equipment, the contractor installs it, and ownership goes to the customer. Ignitis earns platform margin and a share of the flexibility revenue." })}</p>
      </div>`;
  },
},

{ /* 2 — the offer marketplace */
  id: "rangovai",
  label: { lt: "Pasiūlymai", en: "Offers" },
  next: { lt: "Pasirinkti šį rangovą", en: "Choose this contractor" },
  role: { lt: "Lyginu rangovų pasiūlymus", en: "Comparing contractor quotes" },
  wide: true,
  foot: { lt: "Pirmiausia pasirenkamas būdas, tik tada rangovas. Kiekvienas rangovas siūlo savo įrangą.",
          en: "The route comes first, the contractor second. Each contractor quotes its own hardware." },
  agent: [
    { lt: "Pirmiausia pasirinkite, kaip norite įsigyti — su paskola arba iš karto. Abu būdai veikia.",
      en: "First choose how you want to buy — financed or outright. Both routes are live." },
    { lt: "Pasirinkus būdą, parodysiu keturių rangovų pasiūlymus. Pirmasis cituoja bazinį atvejį; kiti brangesni.",
      en: "Once you pick a route I will show the four contractor quotes. The first quotes the baseline case; the others are dearer." },
  ],
  asks: [
    [{ lt: "Kuo skiriasi pirkimas iš karto?", en: "How does buying outright differ?" },
     { lt: "Sumokate visą kainą šiandien, paskolos įmokos nėra, todėl mėnesio taupymas didesnis. Po atsipirkimo taupymas lieka toks pats kaip finansuojant — tik be įmokos.",
       en: "You pay the full price today, there is no instalment, so the monthly saving is larger. After payback the saving matches the financed route — just without the loan." }],
    [{ lt: "Kodėl pigiausia įranga nėra geriausias pasirinkimas?", en: "Why isn't the cheapest hardware the best deal?" },
     { lt: "Nes mėnesio sumą sudaro keturios dalys, o ne viena. Mažesnis kaupiklis reiškia mažesnę vidutinę lankstumo vertę ir didesnę elektros sąskaitą, todėl mažesnė paskolos įmoka to nekompensuoja.",
       en: "Because the monthly figure has four parts, not one. A smaller battery means a lower average flexibility value and a larger electricity bill, so the lower instalment does not make up the difference." }],
    [{ lt: "Kas bus, jei rangovas bankrutuos?", en: "What if the contractor goes under?" },
     { lt: "Įrangos garantija lieka gamintojo, o montavimo garantiją perimame mes ir perduodame kitam platformos rangovui. Tai vienintelė vieta, kur Ignitis prisiima riziką be maržos.",
       en: "The equipment warranty stays with the manufacturer, and we take over the installation warranty and reassign it to another contractor on the platform. It is the one place where Ignitis carries risk without margin." }],
  ],
  can: () => Boolean(state.approach) && Boolean(state.contractor),
  render: () => {
    const ranked = rankedQuotes(state.lender);
    const cheapestMonthly = ranked[0].contractor.id;
    const cheapestHardware = [...CONTRACTORS].sort((a, b) => a.price - b.price)[0].id;

    const cards = ranked.map((q) => {
      const c = q.contractor;
      const badge = c.id === cheapestMonthly
        ? t({ lt: "Mažiausia mėnesio suma", en: "Lowest monthly cost" })
        : c.id === cheapestHardware
          ? t({ lt: "Pigiausia įranga", en: "Cheapest hardware" })
          : null;

      const specs = [
        [t({ lt: "Saulės elektrinė", en: "Solar array" }), `${NUM(c.pv)} kW`],
        [t({ lt: "Inverteris", en: "Inverter" }), `${NUM(c.inverter, 0)} kW`],
        [t({ lt: "Kaupiklis", en: "Battery" }), `${NUM(c.battery, 2)} kWh`],
        [t({ lt: "Įranga", en: "Equipment" }), t(c.brands)],
        [t({ lt: "Įrangos kaina", en: "Equipment price" }), EUR(c.price)],
        [t({ lt: "Laukimo laikas", en: "Lead time" }), t({ lt: `${c.leadWeeks} sav.`, en: `${c.leadWeeks} weeks` })],
        [t({ lt: "Garantijos", en: "Warranties" }),
          t({ lt: `kaupiklis ${c.warrantyBattery} m. · montavimas ${c.warrantyInstall} m.`,
              en: `battery ${c.warrantyBattery} yr · install ${c.warrantyInstall} yr` })],
        [t({ lt: "Servisas", en: "Service" }), t(c.response)],
      ].map(([k, v]) => `<li><span class="sk">${k}</span><span class="sv">${v}</span></li>`).join("");

      return `<button class="rcard ${state.contractor === c.id ? "sel" : ""}" data-contractor="${c.id}">
        ${badge ? `<span class="badge">${badge}</span>` : ""}
        <div class="rhead">
          <div class="rbrand">
            ${contractorLogo(c, "brandlogo contractor card")}
            <div>
              <h3>${c.name}</h3>
              <div class="since">${t({ lt: `Nuo ${c.since} m. · ${c.installs} įrengimų`, en: `Since ${c.since} · ${c.installs} installations` })}</div>
            </div>
          </div>
          ${stars(c)}
        </div>
        ${kitStrip(c)}
        <div class="rfig">
          <div>
            <span class="k">${t({ lt: "Mėnesio suma", en: "Monthly cost" })}</span>
            <span class="v mono">${EUR(q.monthly)}<small>/${t({ lt: "mėn.", en: "mo" })}</small></span>
          </div>
          <div>
            <span class="k">${t({ lt: "Metinė nauda", en: "Annual benefit" })}</span>
            <span class="v mono ${q.annualBenefit >= 0 ? "good" : "bad"}">${q.annualBenefit >= 0 ? "+" : "−"}${EUR(Math.abs(q.annualBenefit))}</span>
          </div>
        </div>
        <ul class="specs">${specs}</ul>
      </button>`;
    }).join("");

    const bestFin = ranked[0];
    const bestUp = bestUpfrontQuote();
    const chosenFin = state.approach === "financed";
    const chosenUp = state.approach === "upfront";
    const chosen = chosenFin || chosenUp;

    const approach = `<div class="approach">
      <button class="acard ${chosenFin ? "sel" : ""}" data-approach="financed">
        <span class="badge">${t({ lt: "Galima rinktis", en: "Available" })}</span>
        <h3>${t({ lt: "Nemokate nieko šiandien", en: "Pay nothing upfront" })}</h3>
        <div class="afig">
          <div><span class="k">${t({ lt: "Sumokate šiandien", en: "Due today" })}</span><span class="v mono">${EUR(0)}</span></div>
          <div><span class="k">${t({ lt: "Numatomas taupymas", en: "Expected saving" })}</span>
            <span class="v mono good">${EUR(bestFin.monthlySaving)}<small>/${t({ lt: "mėn.", en: "mo" })}</small></span></div>
        </div>
        <p>${t({
          lt: `Įrangą apmoka finansavimo partneris, Jūs mokate ${LOAN_YEARS} ${YEARS(LOAN_YEARS)} (~${EUR(bestFin.loan)}/mėn. baziniam komplektui).`,
          en: `A financing partner pays for the equipment; you repay over ${LOAN_YEARS} years (~${EUR(bestFin.loan)}/mo on the baseline).` })}</p>
      </button>
      <button class="acard ${chosenUp ? "sel" : ""}" data-approach="upfront">
        <span class="badge">${t({ lt: "Galima rinktis", en: "Available" })}</span>
        <h3>${t({ lt: "Didžiausias taupymas, visa kaina iš karto", en: "Optimal saving, full price upfront" })}</h3>
        <div class="afig">
          <div><span class="k">${t({ lt: "Sumokate šiandien", en: "Due today" })}</span><span class="v mono">${EUR(bestUp.upfront)}</span></div>
          <div><span class="k">${t({ lt: "Numatomas taupymas", en: "Expected saving" })}</span>
            <span class="v mono good">${EUR(bestUp.monthlySaving)}<small>/${t({ lt: "mėn.", en: "mo" })}</small></span></div>
        </div>
        <p>${t({
          lt: `Atsiperkamumas ${NUM(PAYBACK.yearsNoSubsidy, 1)} m. be paramos, ${NUM(PAYBACK.yearsWithSubsidy30, 1)} m. su 30 % parama. Po atsipirkimo — ~${EUR(PAYBACK.afterPaybackSaving)}/mėn.`,
          en: `Payback ${NUM(PAYBACK.yearsNoSubsidy, 1)} yr with no subsidy, ${NUM(PAYBACK.yearsWithSubsidy30, 1)} yr with 30% subsidy. After payback — ~${EUR(PAYBACK.afterPaybackSaving)}/mo.` })}</p>
      </button>
    </div>`;

    const displayCards = chosenFin ? cards : chosenUp ? ranked.map((fq) => {
      const uq = upfrontQuote(fq.contractor.id);
      const c = uq.contractor;
      return `<button class="rcard ${state.contractor === c.id ? "sel" : ""}" data-contractor="${c.id}">
        <div class="rhead"><div class="rbrand">${contractorLogo(c, "brandlogo contractor card")}<div>
          <h3>${c.name}</h3>
          <div class="since">${EUR(c.price)} · ${t({ lt: "pirkimas iš karto", en: "bought outright" })}</div>
        </div></div>${stars(c)}</div>
        ${kitStrip(c)}
        <div class="rfig">
          <div><span class="k">${t({ lt: "Mėnesio suma", en: "Monthly cost" })}</span>
            <span class="v mono">${EUR(uq.monthly)}<small>/${t({ lt: "mėn.", en: "mo" })}</small></span></div>
          <div><span class="k">${t({ lt: "Metinė nauda", en: "Annual benefit" })}</span>
            <span class="v mono good">+${EUR(uq.annualBenefit)}</span></div>
        </div>
        <ul class="specs">
          <li><span class="sk">${t({ lt: "Sumokate šiandien", en: "Due today" })}</span><span class="sv">${EUR(c.price)}</span></li>
          <li><span class="sk">${t({ lt: "Atsiperkamumas", en: "Payback" })}</span>
            <span class="sv">${NUM(PAYBACK.yearsNoSubsidy, 1)} / ${NUM(PAYBACK.yearsWithSubsidy30, 1)} ${t({ lt: "m.", en: "yr" })}</span></li>
          <li><span class="sk">${t({ lt: "Po atsipirkimo", en: "After payback" })}</span>
            <span class="sv">~${EUR(PAYBACK.afterPaybackSaving)}/${t({ lt: "mėn.", en: "mo" })}</span></li>
        </ul>
      </button>`;
    }).join("") : "";

    return `
      <div class="eyebrow">${t({ lt: "Du būdai, keturi rangovai", en: "Two routes, four contractors" })}</div>
      <h1>${t({ lt: "Pasirinkite pasiūlymą", en: "Choose your offer" })}</h1>
      <p class="lede">${t({
        lt: "Pirmiausia — kaip įsigyjate. Paskui — iš ko. Pirmasis rangovas cituoja bazinį atvejį; kiti brangesni.",
        en: "First how you buy, then from whom. The first contractor quotes the baseline case; the others are dearer." })}</p>

      <div class="sizing stack">
        <div>
          <div class="eyebrow" style="margin-bottom:4px">${t(SCENARIO.label)}</div>
          <div class="sz mono">${hwLabel(SIZING)}</div>
        </div>
        <p>${t(SIZING.basis)}</p>
      </div>

      ${approach}

      ${chosen ? `
        <div class="eyebrow" style="margin-top:28px">${chosenFin
          ? t({ lt: `Keturi pasiūlymai be pradinio įnašo · ${LOAN_YEARS} ${YEARS(LOAN_YEARS)}`, en: `Four quotes with nothing upfront · ${LOAN_YEARS} years` })
          : t({ lt: "Keturi pasiūlymai · pirkimas iš karto", en: "Four quotes · bought outright" })}</div>
        <div class="rangovai stack">${displayCards}</div>
      ` : `
        <div class="honestpanel">
          <b>${t({ lt: "Pasirinkite būdą, kad pamatytumėte rangovų pasiūlymus.", en: "Pick a route to see the contractor quotes." })}</b>
          <p>${t({
            lt: "Rangovų kainos ir mėnesio sumos skiriasi priklausomai nuo to, ar įranga finansuojama. Rodyti abu variantus vienu metu reikštų lyginti nelyginamus skaičius.",
            en: "Contractor prices and monthly figures differ depending on whether the equipment is financed. Showing both at once would mean comparing figures that are not comparable." })}</p>
        </div>
      `}`;
  },
},

{ /* 3 — bundle and financing partner */
  id: "pasiulymas",
  label: { lt: "Finansavimas", en: "Financing" },
  next: { lt: "Tęsti su šiuo partneriu", en: "Continue with this partner" },
  role: { lt: "Lyginu finansavimo pasiūlymus", en: "Comparing financing offers" },
  wide: true,
  foot: { lt: "Trys finansavimo partneriai, visi 10 metų ir 0 € pradinis įnašas. Skiriasi tik norma ir sprendimo greitis.",
          en: "Three financing partners, all ten years with nothing upfront. Only the rate and the decision speed differ." },
  agent: [
    { lt: "Dabar finansavimo partneris. Terminas visiems vienas — dešimt metų, nes tiek maždaug tveria kaupiklio garantija. Pradinis įnašas visais atvejais nulinis.",
      en: "Now the financing partner. The term is the same for all of them — ten years, which is roughly how long the battery warranty runs. The upfront payment is zero in every case." },
  ],
  asks: [
    [{ lt: "Kodėl visiems vienodas terminas?", en: "Why is the term the same for everyone?" },
     { lt: "Nes dešimt metų yra vienintelis terminas, kuris telpa į dabartinę sąskaitą ir nebūna ilgesnis už įrangos garantiją. Trumpesnis terminas mėnesio sumą pakeltų aukščiau dabartinės sąskaitos, ilgesnis — tęstųsi po garantijos.",
       en: "Because ten years is the only term that fits inside the current bill without outliving the equipment warranty. A shorter term pushes the monthly figure above the current bill; a longer one runs past the warranty." }],
    [{ lt: "Kodėl ne tiesiog mažiausia norma?", en: "Why not simply the lowest rate?" },
     { lt: "Dažniausiai taip ir būna, bet ne visada. Jei jau turite būsto paskolą, pigiausias partneris gali paraiškos nepriimti, o antras — priimti. Todėl parodome visus trys ir leidžiame pasirinkti.",
       en: "Usually it is, but not always. If you already carry a mortgage, the cheapest partner may decline the application where the second will accept it. So we show all three and let you choose." }],
    [{ lt: "Ar galiu grąžinti anksčiau?", en: "Can I repay early?" },
     { lt: "Taip, bet kada, be papildomų mokesčių — tai vartojimo kreditas. Lankstumo sutartis nuo paskolos nepriklauso ir tęsiasi toliau.",
       en: "Yes, at any time and without a fee — it is a consumer loan. The flexibility agreement is separate from the loan and continues regardless." }],
  ],
  render: () => {
    const q = activeQuote();
    const c = q.contractor;
    const cheapestRate = [...LENDERS].sort((a, b) => a.rate - b.rate)[0].id;

    const lenderCards = LENDERS.map((lender) => {
      const lq = quote(state.contractor, lender.id);
      return `<button class="dcard ${state.lender === lender.id ? "sel" : ""}" data-lender="${lender.id}">
        <div class="dcardhead">
          ${lenderLogo(lender, "brandlogo partner term")}
          <h3>${lender.name}</h3>
        </div>
        <p>${t({ lt: `${LOAN_YEARS} ${YEARS(LOAN_YEARS)} · ${NUM(lender.rate * 100, 1)} % · ${EUR(0)} pradinis įnašas`,
                 en: `${LOAN_YEARS} years · ${NUM(lender.rate * 100, 1)}% · ${EUR(0)} upfront` })}
          ${lender.id === cheapestRate ? `<em style="font-style:normal;color:var(--ok)"> · ${t({ lt: "mažiausia norma", en: "lowest rate" })}</em>` : ""}</p>
        <p style="margin-top:8px;font-size:12.5px;color:var(--navy-45)">${t(lender.note)}</p>
        <div class="dprice">
          <b class="mono">${EUR(lq.monthly)}</b><span>/${t({ lt: "mėn.", en: "mo" })}</span>
          <div class="delta ${lq.monthlySaving >= 0 ? "down" : "up"}">
            ${lq.monthlySaving >= 0
              ? t({ lt: `${EUR(lq.monthlySaving)}/mėn. mažiau nei dabar`, en: `${EUR(lq.monthlySaving)}/mo less than now` })
              : t({ lt: `${EUR(Math.abs(lq.monthlySaving))}/mėn. daugiau nei dabar`, en: `${EUR(Math.abs(lq.monthlySaving))}/mo more than now` })}
          </div>
          <div style="font-size:12px;color:var(--navy-45);margin-top:4px">
            ${t({ lt: `įmoka ${EUR(lq.loan)} · palūkanų ${EUR(lq.interestPaid)}`,
                  en: `instalment ${EUR(lq.loan)} · interest ${EUR(lq.interestPaid)}` })}
          </div>
        </div>
      </button>`;
    }).join("");

    return `
      <div class="eyebrow">${t({ lt: "Pasirinktas rangovas", en: "Selected contractor" })}</div>
      <div class="selectedbrand">
        ${contractorLogo(c, "brandlogo contractor hero")}
        <h1>${c.name}</h1>
      </div>
      <p class="lede">${t({
        lt: "Įranga ir montavimas iš rangovo, pinigai iš finansavimo partnerio, atsiskaitymas per Ignitis. Pradinis įnašas — nulis pas visus partnerius.",
        en: "Equipment and installation from the contractor, money from the financing partner, settlement through Ignitis. Zero upfront with every partner." })}</p>

      <div class="card stack">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div class="rbrand compact">
            ${contractorLogo(c, "brandlogo contractor inline")}
            <div>
              <h3>${t({ lt: "Kas bus įrengta", en: "What gets installed" })}</h3>
              <p style="font-size:13px;color:var(--navy-45);margin-top:4px">
                ${t(c.brands)} · ${EUR(c.price)} · ${t({ lt: `montavimas per ${c.leadWeeks} sav.`, en: `installed in ${c.leadWeeks} weeks` })}</p>
            </div>
          </div>
          <button class="linkbtn" data-goto="2">${t({ lt: "Keisti rangovą", en: "Change contractor" })}</button>
        </div>
        <div style="max-width:470px">${kitStrip(c)}</div>
      </div>

      <h3 class="stack">${t({ lt: "Pasirinkite finansavimo partnerį", en: "Choose your financing partner" })}</h3>
      <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">
        ${t({ lt: `Visi ${LENDERS.length} partneriai finansuoja ${LOAN_YEARS} ${YEARS(LOAN_YEARS)} be pradinio įnašo. Skiriasi norma ir tai, kaip greitai gausite sprendimą.`,
              en: `All ${LENDERS.length} partners finance over ${LOAN_YEARS} years with nothing upfront. The rate and the speed of the decision are what differ.` })}</p>
      <div class="dispatch">${lenderCards}</div>
      ${breakdown(q)}`;
  },
},

{ /* 4 — the mandatory dispatch gate */
  id: "lankstumas",
  label: { lt: "Lankstumas", en: "Flexibility" },
  next: { lt: "Sutinku ir tęsiu", en: "Agree and continue" },
  role: { lt: "Paaiškinu valdymo sąlygą", en: "Explaining the control condition" },
  foot: { lt: "Sąlyga, be kurios platformos pasiūlymo nėra. Uždirbtą vertę dalijamės — be įvardinto procento.",
          en: "The condition the platform offer does not exist without. We share the value we create — no named percentage." },
  agent: [
    { lt: "Čia ta vieta, kurią dauguma pasiūlymų paslepia. Už tai, kad galime valdyti Jūsų kaupiklį, dalijamės su Jumis tuo, ką jis uždirba rinkoje — ir būtent ta dalis mėnesio sumą nuleidžia žemiau dabartinės sąskaitos.",
      en: "This is the part most offers hide. In exchange for being able to operate your battery we share with you what it earns in the market — and it is that share which takes the monthly figure below your current bill." },
    { lt: "Tai nėra pasirenkama. Be valdymo platforma Jums neturi ko pasiūlyti, ir geriau tai pasakyti dabar nei po montavimo.",
      en: "It is not optional. Without control the platform has nothing to offer you, and it is better to say so now than after installation." },
  ],
  asks: [
    [{ lt: "Ką reiškia „valdome kaupiklį“?", en: "What does operating the battery mean?" },
     { lt: `Mes sprendžiame, kada jis kraunasi ir kada iškrauna, pagal tinklo zonas ir rinkos kainas. Elektromobilio nejudiname — tik kaupiklį. Jums visada lieka ${FLEX.reserveKwh} kWh rezervas, kurio netraukiame: tai apie ${FLEX.reserveHours} valandas šaldytuvo, apšvietimo, katilo ir interneto.`,
       en: `We decide when it charges and discharges, based on network zones and market prices. We never touch the car — only the battery. You always keep a ${FLEX.reserveKwh} kWh reserve we leave alone: roughly ${FLEX.reserveHours} hours of fridge, lights, boiler and router.` }],
    [{ lt: "Kodėl tai privaloma?", en: "Why is it mandatory?" },
     { lt: "Nes būtent iš valdymo mes ir uždirbame. Įrangos maržos negauname, paskolos neišduodame. Jei kaupiklio nevaldome, platformoje mums nelieka jokio pagrindo Jums ką nors subsidijuoti.",
       en: "Because control is the only thing we earn from. We take no hardware margin and we issue no loan. If we do not operate the battery, there is nothing on the platform for us to subsidise you with." }],
    [{ lt: "Kodėl dalijamės, o ne garantuojame sumą?", en: "Why share rather than a guaranteed amount?" },
     { lt: "Nes garantuota suma reikštų, kad arba pažadame to, ko negalime žinoti, arba imame mokestį už riziką. BBCM galios kainos nėra skelbiamos. Dalijimasis verte yra vienintelis dalykas, kurį galime pasakyti ir vėliau parodyti sąskaitoje.",
       en: "Because a guaranteed amount would mean either promising something we cannot know or charging you for the risk. BBCM capacity prices are not published. Sharing the value is the only thing we can state now and show you on the invoice later." }],
  ],
  can: () => state.dispatch === "yes",
  render: () => {
    const q = activeQuote();
    const c = q.contractor;
    const withoutFlex = q.monthly + (c.flexAnnual / 12);

    const choices = [
      ["yes", t({ lt: "Sutinku su kaupiklio valdymu", en: "I agree to battery control" }),
        t({ lt: `Ignitis valdo įkrovimą ir iškrovimą, Jums lieka ${FLEX.reserveKwh} kWh rezervas. Uždirbtą vertę dalijamės — vidutiniškai apie ${EUR((c.flexAnnual / 12))}/mėn. Jums.`,
            en: `Ignitis controls charge and discharge, you keep a ${FLEX.reserveKwh} kWh reserve. We share the value we create — around ${EUR((c.flexAnnual / 12))}/month to you on average.` })],
      ["no", t({ lt: "Nesutinku", en: "I decline" }),
        t({ lt: "Kaupiklį valdau tik aš. Platformos pasiūlymo tokiu atveju nėra.",
            en: "I control the battery myself. In that case there is no platform offer." })],
    ].map(([id, b, s]) => `
      <button class="choice ${state.dispatch === id ? "sel" : ""}" data-dispatch="${id}">
        <span class="tick">${state.dispatch === id ? "✓" : ""}</span>
        <span class="txt"><b>${b}</b><span>${s}</span></span>
      </button>`).join("");

    const deadend = state.dispatch === "no" ? `
      <div class="deadend">
        <b>${t({ lt: "Be kaupiklio valdymo platformos pasiūlymo nėra.", en: "Without battery control there is no platform offer." })}</b>
        <p>${t({
          lt: `Tai ne bauda ir ne nuolaidos atšaukimas. Mes negauname įrangos maržos ir neišduodame paskolos, todėl valdymas yra vienintelis dalykas, iš kurio uždirbame. Nedalydamiesi rinkos pajamomis, Jūsų mėnesio suma būtų apie ${EUR(withoutFlex)} vietoje ${EUR(q.monthly)} — tiek vertės sukuria dalijimasis.`,
          en: `This is not a penalty or a withdrawn discount. We take no hardware margin and issue no loan, so control is the only thing we earn from. With no market revenue to share, your monthly figure would be about ${EUR(withoutFlex)} instead of ${EUR(q.monthly)} — that is what sharing is worth.` })}</p>
        <p style="margin-bottom:0">${t({
          lt: "Jūsų alternatyva lieka visiškai atvira: tą pačią sistemą galite įsigyti rinkos kaina patys, susirasti finansavimą savarankiškai ir valdyti kaupiklį taip, kaip norite. Mes to nelaikome nei klaida, nei blogesniu pasirinkimu.",
          en: "Your alternative stays entirely open: buy the same system at market price yourself, arrange your own financing, and operate the battery however you like. We do not treat that as a mistake or as the worse choice." })}</p>
      </div>` : "";

    return `
      <div class="eyebrow">${t({ lt: "Sąlyga, ne priedas", en: "A condition, not an extra" })}</div>
      <h1>${t({ lt: "Kaupiklį valdome mes", en: "We operate the battery" })}</h1>
      <p class="lede">${t({
        lt: "Įranga Jūsų, bet sprendimą, kada ji kraunasi, priimame mes. Uždirbtą vertę dalijamės, ir Jūsų dalis kas mėnesį nuimama nuo sąskaitos.",
        en: "The equipment is yours, but we decide when it charges. We share the value the battery earns, and your share comes off the invoice every month." })}</p>

      <div class="callout">
        <b>${t({ lt: "Uždirbtą vertę dalijamės", en: "We share the value we create" })}</b>
        ${t({
          lt: `${NUM(c.battery, 2)} kWh kaupikliui tai vidutiniškai apie ${EUR((c.flexAnnual / 12))}/mėn., arba ${EUR((c.flexAnnual / 12) * 12)}/metus — bet tai vidurkis, o ne garantija: gerą mėnesį suma didesnė, tylų mėnesį mažesnė. Kiekvieną mėnesį sąskaitoje matysite ir bendrą sumą, ir savo dalį.`,
          en: `For a ${NUM(c.battery, 2)} kWh battery that averages around ${EUR((c.flexAnnual / 12))}/month, or ${EUR((c.flexAnnual / 12) * 12)} a year — but it is an average, not a guarantee: a good month pays more, a quiet one less. Every invoice shows both the gross figure and your share.` })}
      </div>

      <div class="choices stack">${choices}</div>
      ${deadend}

      <div class="honestpanel">
        <b>${t({ lt: "Ko ši sutartis Jums neuždeda", en: "What this agreement does not do to you" })}</b>
        ${t({
          lt: "Įranga yra Jūsų nuo pirmos dienos, ir elektros tiekėjo pasirinkimo neužrakiname — galite išeiti. Bet platforma veikia tik Ignitis klientams, todėl išėję iš tiekimo prarasite ir optimizavimą, ir savo rinkos pajamų dalį. Kaupiklis liks Jūsų: toliau kaupsite saulę sau, tik be rinkos pajamų.",
          en: "The equipment is yours from day one and we do not lock your choice of supplier — you can leave. But the platform only serves Ignitis customers, so leaving supply ends both the optimisation and your share of the market revenue. The battery stays yours: you keep storing your own solar, just without the market income." })}
      </div>`;
  },
},

{ /* 5 — credit application */
  id: "paraiska",
  label: { lt: "Paraiška", en: "Application" },
  next: { lt: "Pateikti paraišką", en: "Submit the application" },
  role: { lt: "Rengiu paraišką partneriui", en: "Preparing the application" },
  foot: { lt: "Paskutinis žingsnis kliento pusėje. Paraišką vertina įvardintas finansavimo partneris, ne Ignitis.",
          en: "The last step on the customer's side. The named financing partner assesses it, not Ignitis." },
  agent: [
    { lt: "Tai paskutinis žingsnis, kurį reikia atlikti Jums. Šiuos duomenis vertina pasirinktas finansavimo partneris — Ignitis jų nemato ir sprendimo nepriima.",
      en: "This is the last step you have to take. The financing partner you chose assesses this data — Ignitis does not see it and does not make the decision." },
  ],
  asks: [
    [{ lt: "Kas priima sprendimą?", en: "Who makes the decision?" },
     { lt: "Finansavimo partneris. Ignitis nėra kredito davėjas ir banko licencijos neturi — todėl ir rizikos neprisiimame. Jūsų pajamų duomenų mes nematome.",
       en: "The financing partner. Ignitis is not a lender and holds no banking licence — which is also why we carry none of the risk. We do not see your income data." }],
    [{ lt: "Ar tai paveiks mano kredito istoriją?", en: "Will this affect my credit record?" },
     { lt: "Partneris pateiks užklausą registrams, ir ji istorijoje bus matoma. Todėl ir siūlome vieną paraišką vienam partneriui, o ne keturias keturiems.",
       en: "The partner will query the registers, and that query is visible in your record. Which is why we send one application to one partner rather than four to four." }],
    [{ lt: "Kiek užtruks?", en: "How long does it take?" },
     { lt: "Iki dviejų darbo dienų. Atsakymą gausite el. paštu ir platformoje — nieko daryti nereikės, tiesiog grįšite.",
       en: "Up to two working days. You get the answer by email and on the platform — nothing to do, you just come back." }],
  ],
  can: () => state.formFilled,
  render: () => {
    const q = activeQuote();
    const fields = [
      [t({ lt: "Vardas, pavardė", en: "Full name" }), "Darius Petrauskas", false],
      [t({ lt: "Asmens kodas", en: "Personal code" }), "385•••••••••", false],
      [t({ lt: "Mėnesio pajamos (neto)", en: "Net monthly income" }), EUR(2140), false],
      [t({ lt: "Darbovietė ir pareigos", en: "Employer and role" }), t({ lt: "UAB „Vilmeta“ · gamybos vadovas", en: "Vilmeta UAB · production manager" }), false],
      [t({ lt: "Darbo stažas", en: "Time in employment" }), t({ lt: "7 metai", en: "7 years" }), false],
      [t({ lt: "Esami finansiniai įsipareigojimai", en: "Existing obligations" }), t({ lt: `Būsto paskola, ${EUR(412)}/mėn.`, en: `Mortgage, ${EUR(412)}/mo` }), false],
      [t({ lt: "Asmenų namų ūkyje", en: "People in household" }), "4", false],
      [t({ lt: "Kontaktai", en: "Contact" }), "darius.p@email.lt · +370 6•• ••123", false],
      [t({ lt: "Prašoma suma ir terminas", en: "Amount and term requested" }),
        `${EUR(q.contractor.price)} · ${q.years} ${YEARS(q.years)} · ${EUR(0)} ${t({ lt: "pradinis įnašas", en: "upfront" })}`, true],
    ];

    return `
      <div class="eyebrow partnerline">
        ${lenderLogo(q.lender, "brandlogo partner eyebrow")}
        <span>${t({ lt: `Paskutinis žingsnis · vartojimo kreditas`, en: `The last step · consumer credit` })}</span>
      </div>
      <h1>${t({ lt: `Paraiška finansavimui — „${q.lender.name}“`, en: `Financing application — ${q.lender.name}` })}</h1>
      <p class="lede">${t({
        lt: `Tai paskutinis žingsnis, kurį atliekate Jūs. Paraišką vertins „${q.lender.name}“ — Jūsų pasirinktas finansavimo partneris. Įrangos suma, terminas ir pradinis įnašas jau įrašyti, lieka tik Jūsų duomenys.`,
        en: `This is the last step you take. ${q.lender.name}, the financing partner you chose, will assess it. The amount, term and upfront payment are already filled in; only your own details are left.` })}</p>

      <div class="card stack">
        <div class="fillrow">
          <p>${t({
            lt: "Tai maketas: tikros formos čia nėra ir niekas nieko nerašo. Mygtukas užpildo pavyzdinius duomenis.",
            en: "This is a mockup: there is no real form and nobody types anything. The button fills in sample data." })}</p>
          <button class="fillbtn" data-fill="1">${state.formFilled
            ? t({ lt: "Išvalyti formą", en: "Clear the form" })
            : t({ lt: "Užpildyti demonstraciniais duomenimis", en: "Fill with demo data" })}</button>
        </div>
        <div class="form">
          ${fields.map(([label, value, wide]) => `
            <div class="field ${wide ? "wide" : ""}">
              <label>${label}</label>
              <div class="box ${wide ? "filled" : state.formFilled ? "filled" : "empty"}">${
                wide || state.formFilled ? value : t({ lt: "neužpildyta", en: "not filled in" })
              }</div>
            </div>`).join("")}
        </div>
        <div class="sentto">
          <span style="color:var(--blue)">${icon("shield")}</span>
          <span class="sentto-brand">
            ${lenderLogo(q.lender, "brandlogo partner inline")}
            <span>${t({
              lt: `Duomenys perduodami partneriui „${q.lender.name}“, ne Ignitis. Mes matome tik sprendimą: taip arba ne.`,
              en: `The data goes to ${q.lender.name}, not to Ignitis. We see only the decision: yes or no.` })}</span>
          </span>
        </div>
      </div>`;
  },
},

{ /* 6 — submitted, pending */
  id: "pateikta",
  label: { lt: "Pateikta", en: "Submitted" },
  next: { lt: "Praleisti laukimą", en: "Skip the wait" },
  role: { lt: "Paraiška vertinama", en: "Application under review" },
  foot: { lt: "Būklės ekranas: kas pateikta, kam, ir ko kliento pusėje nebereikia daryti.",
          en: "A status screen: what was submitted, to whom, and what is left for the customer to do." },
  agent: [
    { lt: "Paraiška pateikta. Daugiau nieko daryti nereikia — apie sprendimą ir tolesnius žingsnius parašysime el. paštu.",
      en: "The application is in. There is nothing else for you to do — we will email you the decision and the next steps." },
  ],
  asks: [
    [{ lt: "Ar man reikės ką nors daryti laukiant?", en: "Do I need to do anything while waiting?" },
     { lt: "Ne. Jei partneriui prireiks patikslinimo, parašysime mes, ne jie — ryšį su Jumis turime mes. Kitu atveju tiesiog gausite sprendimą.",
       en: "No. If the partner needs a clarification, we write to you rather than them — we are the ones with the relationship. Otherwise you simply get the decision." }],
    [{ lt: "Ar pasiūlymas kol kas užfiksuotas?", en: "Is the offer locked while I wait?" },
     { lt: "Rangovo kaina ir partnerio norma užfiksuotos 30 dienų. Jei per tą laiką sprendimo nebūna, pasiūlymą perskaičiuojame iš naujo ir pasakome, kas pasikeitė.",
       en: "The contractor's price and the partner's rate are held for 30 days. If no decision lands in that time, we requote and tell you what changed." }],
    [{ lt: "Kodėl rodome šį ekraną?", en: "Why show this screen at all?" },
     { lt: "Nes be jo klientas nežino, ar paraiška išvis išėjo. Tyla tarp pateikimo ir sprendimo yra vieta, kurioje platformos pameta žmones.",
       en: "Because without it the customer does not know the application went anywhere. The silence between submitting and deciding is where platforms lose people." }],
  ],
  render: () => {
    const q = activeQuote();
    const c = q.contractor;

    return `
      <div class="eyebrow">${t({ lt: "Paraiška pateikta", en: "Application submitted" })}</div>
      <h1>${t({ lt: "Paraiška pateikta ir vertinama", en: "Submitted and under review" })}</h1>
      <p class="lede">${t({
        lt: `Paraišką gavo „${q.lender.name}“. Jūsų pusėje veiksmų nebeliko — sprendimą ir tolesnius žingsnius išsiųsime el. paštu.`,
        en: `${q.lender.name} has your application. Nothing is left on your side — we will email you the decision and the next steps.` })}</p>

      <div class="decision pending">
        <span class="wait">${icon("clock")} ${t({ lt: "Vertinama", en: "Under review" })}</span>
        <h2>${EUR(c.price)} · ${q.years} ${YEARS(q.years)} · ${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}</h2>
        <div class="by partnerline">
          ${lenderLogo(q.lender, "brandlogo partner inline")}
          <span>${t({
          lt: `„${q.lender.name}“ · ${NUM(q.lender.rate * 100, 1)} % metinės palūkanos · pradinis įnašas ${EUR(0)} · sprendimas per 2 darbo dienas`,
          en: `${q.lender.name} · ${NUM(q.lender.rate * 100, 1)}% annual interest · ${EUR(0)} upfront · a decision within 2 working days` })}</span>
        </div>
      </div>

      <div class="card stack">
        <h3>${t({ lt: "Pateiktas pasiūlymas", en: "The deal as submitted" })}</h3>
        <div class="brk" style="margin-top:10px">
          <div class="l"><span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name}</span><em>${t(c.brands)} · ${hwLabel(c)}</em></div>
          <div class="v mono">${EUR(c.price)}</div></div>
        <div class="brk"><div class="l"><span class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${q.lender.name}</span>
          <em>${t({ lt: `${q.years} ${YEARS(q.years)} · ${NUM(q.lender.rate * 100, 1)} % · pradinis įnašas ${EUR(0)}`,
                     en: `${q.years} years · ${NUM(q.lender.rate * 100, 1)}% · ${EUR(0)} upfront` })}</em></div>
          <div class="v mono">${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Ignitis — tiekimas ir lankstumas", en: "Ignitis — supply and flexibility" })}
          <em>${t({ lt: "Kaupiklio valdymas — uždirbtą vertę dalijamės",
                     en: "Battery control — we share the value we create" })}</em></div>
          <div class="v mono">—</div></div>
        <div class="brk total"><div class="l">${t({ lt: "Mėnesio suma, jei bus patvirtinta", en: "Monthly total if approved" })}
          <em>${t({ lt: `dabar mokate ${EUR(PERSONA.currentMonthlyCost)} · skirtumas ${EUR(q.monthlySaving)}/mėn.`,
                     en: `you pay ${EUR(PERSONA.currentMonthlyCost)} today · a difference of ${EUR(q.monthlySaving)}/mo` })}</em></div>
          <div class="v mono">${EUR(q.monthly, 2)}</div></div>
      </div>

      <div class="sentto" style="margin-top:14px">
        <span style="color:var(--blue)">${icon("doc")}</span>
        <span>${t({
          lt: "Sprendimas — per 2 darbo dienas. Apie jį ir tolesnius žingsnius informuosime el. paštu adresu darius.p@email.lt. Platformoje tuo metu nieko daryti nereikia.",
          en: "A decision within 2 working days. We will notify you of it and of the next steps by email at darius.p@email.lt. Nothing to do on the platform meanwhile." })}</span>
      </div>`;
  },
},

{ /* 7 — the time break and the decision */
  id: "sprendimas",
  label: { lt: "Sprendimas", en: "Decision" },
  next: { lt: "Pereiti prie atsiskaitymo", en: "Go to checkout" },
  role: { lt: "Sprendimas gautas", en: "Decision received" },
  foot: { lt: "Laiko tarpas. Būtent čia realios platformos pameta klientus — ir būtent Ignitis jį sugrąžina.",
          en: "The time break. This is where real platforms lose people, and where Ignitis is the party that brings him back." },
  agent: [
    { lt: "Sveiki sugrįžę. Finansavimo partneris atsakė — paraiška patvirtinta tokia, kokios prašėte.",
      en: "Welcome back. The financing partner has answered, and the application is approved exactly as requested." },
    { lt: "Atkreipkite dėmesį, kas Jums parašė: ne bankas ir ne rangovas, o mes. Platformoje klientą sugrąžina tas, kuris turi su juo ryšį.",
      en: "Notice who wrote to you: not the bank, not the contractor, but us. On a platform, the party with the relationship is the one who brings the customer back." },
  ],
  asks: [
    [{ lt: "O jei būtų atsakę „ne“?", en: "What if they had said no?" },
     { lt: "Tada platforma pasiūlytų kitą finansavimo partnerį, o ne uždarytų langą. Būtent todėl jų yra trys. Šiame makete tos atšakos nėra — rodome tik patvirtinimą, ir tai sąmoningas supaprastinimas.",
       en: "The platform would offer another financing partner rather than closing the window. That is precisely why there are three of them. That branch is not built in this mockup — we show approval only, and that is a deliberate simplification." }],
    [{ lt: "Ar galiu dar keisti rangovą?", en: "Can I still change contractor?" },
     { lt: "Suma patvirtinta konkrečiam rangovui, todėl pakeitus jį paraiška būtų vertinama iš naujo. Praktiškai tai dar dvi darbo dienos.",
       en: "The amount is approved against a specific contractor, so changing it means the application is assessed again. In practice that is another two working days." }],
    [{ lt: "Kada pradeda eiti palūkanos?", en: "When does interest start?" },
     { lt: "Nuo tos dienos, kai partneris sumoka rangovui, o tai įvyksta po montavimo priėmimo. Iki tol nemokate nieko.",
       en: "From the day the partner pays the contractor, which happens after the installation is signed off. Until then you pay nothing." }],
  ],
  render: () => {
    const q = activeQuote();
    return `
      <div class="timebreak">
        <div class="el">${t({ lt: "Po dviejų darbo dienų", en: "Two working days later" })}</div>
        <h1>${t({ lt: "Jūs grįžtate į platformą", en: "You come back to the platform" })}</h1>
        <p>${t({
          lt: "Paraišką pateikėte ir išėjote. Sprendimas atėjo el. paštu, o platformoje jau laukia parengtos sutartys.",
          en: "You submitted the application and left. The decision arrived by email, and the agreements are already waiting on the platform." })}</p>
      </div>

      <div class="decision">
        <span class="ok">${icon("check")} ${t({ lt: "Paraiška patvirtinta", en: "Application approved" })}</span>
        <h2>${EUR(q.contractor.price)} · ${q.years} ${YEARS(q.years)} · ${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}</h2>
        <div class="by partnerline">
          ${lenderLogo(q.lender, "brandlogo partner inline")}
          <span>${t({
          lt: `„${q.lender.name}“ · ${NUM(q.lender.rate * 100, 1)} % metinės palūkanos · pradinis įnašas ${EUR(0)} · patvirtinta tokia suma, kokios prašyta`,
          en: `${q.lender.name} · ${NUM(q.lender.rate * 100, 1)}% annual interest · ${EUR(0)} upfront · approved as requested` })}</span>
        </div>
      </div>

      <div class="card stack">
        <h3>${t({ lt: "Kas patvirtinta", en: "What was approved" })}</h3>
        <div class="brk" style="margin-top:10px">
          <div class="l">${t({ lt: "Finansuojama suma", en: "Amount financed" })}
            <em class="partyline">${contractorLogo(q.contractor, "brandlogo contractor mini")}${q.contractor.name} · ${t(q.contractor.brands)}</em></div>
          <div class="v mono">${EUR(q.contractor.price)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Pradinis įnašas", en: "Upfront payment" })}
          <em>${t({ lt: "Nekeičiamas nė pas vieną partnerį", en: "Unchanged with every partner" })}</em></div>
          <div class="v mono">${EUR(0)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Mėnesio įmoka", en: "Monthly instalment" })}
          <em class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${t({ lt: `„${q.lender.name}“ · ${q.years} ${YEARS(q.years)} · ${NUM(q.lender.rate * 100, 1)} %`, en: `${q.lender.name} · ${q.years} years · ${NUM(q.lender.rate * 100, 1)}%` })}</em></div>
          <div class="v mono">${EUR(q.loan, 2)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Iš viso grąžinsite", en: "Total repayable" })}
          <em>${t({ lt: `iš jų palūkanų ${EUR(q.interestPaid)}`, en: `of which ${EUR(q.interestPaid)} interest` })}</em></div>
          <div class="v mono">${EUR(q.totalRepaid)}</div></div>
        <div class="brk total"><div class="l">${t({ lt: "Vidutinė elektros mėnesio kaina:", en: "Average monthly electricity cost:" })}
          <em>${t({ lt: `dabartinė sąskaita ${EUR(PERSONA.currentMonthlyCost)} · skirtumas ${EUR(q.monthlySaving)}/mėn.`,
                     en: `current bill ${EUR(PERSONA.currentMonthlyCost)} · a difference of ${EUR(q.monthlySaving)}/mo` })}</em></div>
          <div class="v mono">${EUR(q.monthly, 2)}</div></div>
      </div>`;
  },
},

{ /* 8 — checkout where nothing is paid */
  id: "atsiskaitymas",
  label: { lt: "Atsiskaitymas", en: "Checkout" },
  next: { lt: "Pasirašyti ir užsisakyti", en: "Sign and order" },
  role: { lt: "Trys sutartys, vienas paspaudimas", en: "Three agreements, one click" },
  wide: true,
  foot: { lt: "Vienas krepšelis, trys skirtingos sutartys su trimis skirtingomis šalimis. Šiandien nesumokama nieko.",
          en: "One basket, three separate agreements with three separate parties. Nothing is paid today." },
  agent: [
    { lt: "Po šiuo vienu paspaudimu yra trys sutartys su trimis skirtingomis šalimis. Nesakysiu, kad tai „viena paprasta sutartis“ — tai būtų netiesa.",
      en: "Underneath this one click there are three agreements with three different parties. I am not going to call it one simple contract, because that would not be true." },
  ],
  asks: [
    [{ lt: "Kam skambinti, jei kaupiklis neveiks?", en: "Who do I call if the battery fails?" },
     { lt: "Mums. Nors įrangos nepardavėme ir maržos iš jos negavome, kreipiatės į platformą, o mes perduodame rangovui ir sekame terminą. Tai sąmoningai neproporcinga: atsakomybę turime didesnę nei maržą.",
       en: "Us. We did not sell the equipment and took no margin on it, but you come to the platform and we pass it to the contractor and track the deadline. That is deliberately out of proportion: we hold more responsibility than margin." }],
    [{ lt: "Ar galiu atsisakyti?", en: "Can I withdraw?" },
     { lt: "Kredito sutarties galite atsisakyti per 14 dienų be jokios priežasties. Montavimo sutarties — iki objekto apžiūros be išlaidų, o po jos sumokate apžiūros kaštus.",
       en: "You can withdraw from the credit agreement within 14 days, no reason needed. From the installation contract up until the survey at no cost, and after it you cover the survey." }],
    [{ lt: "Kodėl trys sutartys, o ne viena?", en: "Why three agreements instead of one?" },
     { lt: "Nes trys skirtingos šalys prisiima tris skirtingas rizikas. Sudėję viską į vieną dokumentą paslėptume, kas kam atsako, o kai kas nors sulūžta, būtent tai ir yra svarbiausia.",
       en: "Because three different parties carry three different risks. Rolling it into one document would hide who answers for what, and when something breaks that is the thing that matters most." }],
  ],
  render: () => {
    const q = activeQuote();
    const c = q.contractor;
    const financed = Boolean(q.lender);

    const order = [
      [t({ lt: "Įranga ir montavimas", en: "Equipment and installation" }),
        `<span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name} · ${t(c.brands)}</span>`, EUR(c.price)],
      [t({ lt: "Sistema", en: "System" }), hwLabel(c), "—"],
      financed
        ? [t({ lt: "Finansavimas", en: "Financing" }),
          `<span class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${q.lender.name} · ${q.years} ${YEARS(q.years)} · ${NUM(q.lender.rate * 100, 1)} %</span>`,
          `${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}`]
        : [t({ lt: "Mokėjimas", en: "Payment" }),
          t({ lt: "Pirkimas iš karto · be paskolos", en: "Bought outright · no loan" }),
          EUR(c.price)],
      [t({ lt: "Ignitis — tiekimas ir lankstumas", en: "Ignitis — supply and flexibility" }),
        t({ lt: "Kaupiklio valdymas — uždirbtą vertę dalijamės",
            en: "Battery control — we share the value we create" }), "—"],
    ].map(([k, s, v]) => `
      <div class="brk"><div class="l">${k}<em>${s}</em></div><div class="v mono">${v}</div></div>`).join("");

    const roles = [
      ["hardhat", `<span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name}</span>`, t({ lt: "Pateikia ir įrengia įrangą", en: "Supplies and installs the equipment" }),
        t({ lt: `Saulės elektrinė, inverteris ir kaupiklis, montavimas, priėmimas ir servisas. Garantijos: kaupiklis ${c.warrantyBattery} m., montavimas ${c.warrantyInstall} m.`,
            en: `The array, inverter and battery, the installation, the sign-off and the service. Warranties: battery ${c.warrantyBattery} years, installation ${c.warrantyInstall} years.` })],
      financed
        ? ["card", `<span class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${q.lender.name}</span>`, t({ lt: "Finansuoja Jus", en: "Finances you" }),
          t({ lt: `Apmoka rangovui visą ${EUR(c.price)} sumą po montavimo priėmimo. Jūs grąžinate ${q.years} ${YEARS(q.years)} po ${EUR(q.loan, 2)}.`,
              en: `Pays the contractor the full ${EUR(c.price)} once the installation is signed off. You repay ${EUR(q.loan, 2)} a month over ${q.years} years.` })]
        : ["card", t({ lt: "Jūs", en: "You" }), t({ lt: "Apmokate rangovą", en: "Pay the contractor" }),
          t({ lt: `Sumokate visą ${EUR(c.price)} sumą šiandien. Paskolos nėra — mėnesio sąskaitoje lieka tik elektra ir lankstumas.`,
              en: `You pay the full ${EUR(c.price)} today. There is no loan — the monthly invoice keeps only electricity and flexibility.` })],
      ["bolt", `<span class="partyline"><img class="brandlogo ignitis mini" src="assets/ignitis-mark.png" alt="Ignitis">Ignitis</span>`, t({ lt: "Tiekia elektrą ir sukuria lankstumo vertę", en: "Supplies the electricity and creates the flexibility value" }),
        t({ lt: "Elektros tiekimas, kaupiklio valdymas ir uždirbtą rinkos vertę dalijamės su Jumis. Įrangos maržos negauname ir paskolos neišduodame.",
            en: "Electricity supply, battery control, and we share the market value we create with you. We take no hardware margin and issue no loan." })],
    ].map(([ic, who, b, p]) => `
      <div class="role">
        <div class="ic3">${icon(ic, "ico big")}</div>
        <div class="who">${who}</div><b>${b}</b><p>${p}</p>
      </div>`).join("");

    const agreements = [
      [t({ lt: "Įrangos ir montavimo sutartis", en: "Equipment and installation contract" }),
       `<span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name}</span>`,
       t({ lt: `Įranga, montavimas, priėmimas ir servisas. Garantijos: kaupiklis ${c.warrantyBattery} m., montavimas ${c.warrantyInstall} m.`,
           en: `Equipment, installation, sign-off and service. Warranties: battery ${c.warrantyBattery} years, installation ${c.warrantyInstall} years.` })],
      ...(financed ? [[t({ lt: "Vartojimo kredito sutartis", en: "Consumer credit agreement" }),
       `<span class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${q.lender.name}</span>`,
       t({ lt: `${EUR(c.price)}, ${q.years} ${YEARS(q.years)}, ${NUM(q.lender.rate * 100, 1)} % metinės palūkanos, pradinis įnašas ${EUR(0)}. Atsisakymo teisė — 14 dienų.`,
           en: `${EUR(c.price)} over ${q.years} years at ${NUM(q.lender.rate * 100, 1)}%, ${EUR(0)} upfront. Fourteen-day right of withdrawal.` })]] : []),
      [t({ lt: "Lankstumo ir elektros tiekimo sutartis", en: "Flexibility and supply agreement" }),
       `<span class="partyline"><img class="brandlogo ignitis mini" src="assets/ignitis-mark.png" alt="Ignitis">Ignitis</span>`,
       t({ lt: `Kaupiklio valdymas, uždirbtą vertę dalijamės, ${FLEX.reserveKwh} kWh rezervas Jums.`,
           en: `Battery control, we share the value we create, and a ${FLEX.reserveKwh} kWh reserve kept for you.` })],
    ].map(([b, who, s]) => `
      <li><div><b>${b}</b><span class="with">${t({ lt: "Šalis", en: "Party" })}: ${who}</span><span>${s}</span></div></li>`).join("");

    const agreementCount = financed ? 3 : 2;

    return `
      <div class="eyebrow">${t({ lt: "Užsakymas", en: "Your order" })}</div>
      <h1>${t({ lt: "Patvirtinkite ir užsisakykite", en: "Confirm and order" })}</h1>
      <p class="lede">${t({
        lt: financed
          ? "Viskas suderinta. Belieka pasirašyti tris sutartis — ir šiandien iš Jūsų sąskaitos neišeina nieko."
          : `Viskas suderinta. Belieka pasirašyti dvi sutartis ir sumokėti ${EUR(c.price)} šiandien.`,
        en: financed
          ? "Everything is agreed. Three signatures left — and nothing leaves your account today."
          : `Everything is agreed. Two signatures left, and ${EUR(c.price)} leaves your account today.` })}</p>

      <div class="roles">${roles}</div>

      <div class="callout">
        <b>${t({ lt: "Visi mokėjimai automatiškai nukreipiami per Ignitis savitarną.", en: "All payments are routed automatically through Ignitis savitarna." })}</b>
        ${financed ? t({
          lt: `Paskolos įmoka „${q.lender.name}“, elektros ir tinklo mokesčiai bei Jūsų lankstumo pajamų dalis sudedami į vieną sąskaitą savitarnoje. Jums nereikia nei trijų mokėjimų, nei trijų prisijungimų: nurašoma viena suma, o savitarnoje matote, kiek iš jos keliauja kiekvienai šaliai.`,
          en: `The instalment to ${q.lender.name}, the electricity and network charges, and your share of the flexibility revenue are combined into one invoice in savitarna. No three payments and no three logins: one amount is debited, and savitarna shows how much of it goes to each party.` })
        : t({
          lt: `Elektros ir tinklo mokesčiai bei Jūsų lankstumo pajamų dalis sudedami į vieną sąskaitą savitarnoje. Įrangą apmokėjote šiandien — mėnesio sąskaitoje paskolos nėra.`,
          en: `Electricity and network charges plus your share of flexibility revenue sit on one invoice in savitarna. You paid for the equipment today — there is no loan on the monthly bill.` })}
      </div>

      <div class="duetoday">
        <div>
          <span class="k">${t({ lt: "Sumokate šiandien", en: "Due today" })}</span>
          <span class="v mono">${EUR(financed ? 0 : c.price, 2)}</span>
        </div>
        <div class="then">${financed ? t({
          lt: `Pirmoji ${EUR(q.loan, 2)} įmoka — mėnesį po montavimo priėmimo. Iki tol nemokate nieko, net jei montavimas užtruktų.`,
          en: `The first instalment of ${EUR(q.loan, 2)} falls a month after the installation is signed off. Until then you pay nothing, even if the install slips.` })
        : t({
          lt: `Po atsipirkimo (~${NUM(PAYBACK.yearsNoSubsidy, 1)} m. be paramos) mėnesio taupymas — apie ${EUR(PAYBACK.afterPaybackSaving)}.`,
          en: `After payback (~${NUM(PAYBACK.yearsNoSubsidy, 1)} yr with no subsidy) monthly saving is about ${EUR(PAYBACK.afterPaybackSaving)}.` })}</div>
      </div>

      <div class="card stack">
        <h3>${t({ lt: "Ką užsisakote", en: "What you are ordering" })}</h3>
        <div style="margin-top:12px">${order}</div>
        <div class="brk total">
          <div class="l">${t({ lt: "Vidutinė elektros mėnesio kaina:", en: "Average monthly electricity cost:" })}
            <em>${t({ lt: `šiandien mokate ${EUR(PERSONA.currentMonthlyCost)} · skirtumas ${EUR(q.monthlySaving)}/mėn.`,
                       en: `you pay ${EUR(PERSONA.currentMonthlyCost)} today · a difference of ${EUR(q.monthlySaving)}/mo` })}</em></div>
          <div class="v mono">${EUR(q.monthly, 2)}</div>
        </div>
      </div>

      <div class="card">
        <h3>${t({
          lt: `Pasirašote ${agreementCount === 3 ? "tris" : "dvi"} sutartis, ne vieną`,
          en: `You are signing ${agreementCount === 3 ? "three" : "two"} agreements, not one` })}</h3>
        <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">${t({
          lt: "Skirtingos šalys, skirtingos rizikos. Platforma jas surenka į vieną vietą, bet nesulieja į vieną dokumentą.",
          en: "Different parties, different risks. The platform collects them in one place without merging them into one document." })}</p>
        <ul class="agreements">${agreements}</ul>
      </div>

      <div class="honestpanel">
        <b>${t({ lt: "Kaina patikslinama po objekto apžiūros", en: "The price is confirmed after the site survey" })}</b>
        ${t({
          lt: `${c.name} atvyks apžiūrėti skirstomojo skydo, stogo ir vietos kaupikliui. Jei prireiks papildomų darbų, kainą pamatysite prieš montavimą ir galėsite atsisakyti be išlaidų. Apžiūra nemokama.`,
          en: `${c.name} will inspect the consumer unit, the roof and the space for the battery. If extra work is needed you see the revised price before installation and can withdraw at no cost. The survey itself is free.` })}
      </div>`;
  },
},

{ /* 9 — survey, install, commissioning */
  id: "montavimas",
  label: { lt: "Montavimas", en: "Installation" },
  next: { lt: "Peršokti pusmetį", en: "Skip forward six months" },
  role: { lt: "Koordinuoju montavimą", en: "Coordinating the installation" },
  foot: { lt: "Atotrūkis tarp pasirašymo ir veikiančio kaupiklio — vieta, kurioje lankstumo projektai praranda klientus.",
          en: "The gap between signing and a working battery — where flexibility pilots actually lose their cohort." },
  agent: [
    { lt: "Sutartys pasirašytos. Toliau beveik viskas priklauso nuo rangovo, o mano darbas — sekti terminus ir priminti, jei kas vėluos.",
      en: "The agreements are signed. From here it is mostly the contractor's work, and my job is to track the dates and tell you if something slips." },
  ],
  asks: [
    [{ lt: "Ar man reikės būti namuose?", en: "Do I need to be home?" },
     { lt: "Apžiūros metu — maždaug pusvalandį. Montavimo dieną — taip, visą dieną, nes bus trumpas elektros atjungimas ir reikės priimti darbus.",
       en: "For the survey, about half an hour. On installation day yes, the whole day, because there is a short power cut and the work has to be signed off." }],
    [{ lt: "O jei po apžiūros kaina pakils?", en: "What if the price rises after the survey?" },
     { lt: "Pamatysite patikslintą kainą ir naują įmoką prieš bet kokius darbus. Galite sutikti, galite atsisakyti be išlaidų, galite grįžti į rangovų sąrašą.",
       en: "You see the revised price and the new instalment before any work starts. You can accept, withdraw at no cost, or go back to the contractor list." }],
    [{ lt: "Ar galiu gauti valstybės paramą?", en: "Can I get state support?" },
     { lt: "Galite, nes įranga yra Jūsų. Parama atitenka savininkui, todėl ji eina Jums, o ne Ignitis. Jei paramą gausite, perskaičiuosime įmoką.",
       en: "You can, because the equipment is yours. Support follows the owner, so it goes to you and not to Ignitis. If it comes through, we recalculate the instalment." }],
  ],
  render: () => {
    const q = activeQuote();
    const c = q.contractor;
    const financed = Boolean(q.lender);
    const steps = [
      [t({ lt: "Šiandien", en: "Today" }),
       financed
         ? t({ lt: `Trys sutartys pasirašytos. Iš Jūsų sąskaitos nepaimta ${EUR(0)}.`, en: `Three agreements signed. ${EUR(0)} taken from your account.` })
         : t({ lt: `Dvi sutartys pasirašytos. Sumokėta ${EUR(c.price)} už įrangą.`, en: `Two agreements signed. ${EUR(c.price)} paid for the equipment.` })],
      [t({ lt: "Per 3 darbo dienas", en: "Within 3 working days" }),
       t({ lt: `Mindaugas iš „${c.name}“ paskambins ir suderins objekto apžiūrą. Apžiūra nemokama ir užtrunka apie pusvalandį.`,
           en: `Mindaugas from ${c.name} calls to arrange the site survey. It is free and takes about half an hour.` })],
      [t({ lt: "Po apžiūros", en: "After the survey" }),
       t({ lt: "Patikslinta kaina ir įmoka. Jei kaina nekinta, montavimo data fiksuojama iškart.",
           en: "The confirmed price and instalment. If nothing changes, the installation date is locked in immediately." })],
      [t({ lt: `Po ${c.leadWeeks} savaičių`, en: `In ${c.leadWeeks} weeks` }),
       t({ lt: "Montavimas: viena darbo diena, apie 40 minučių be elektros. Reikia, kad kas nors būtų namuose.",
           en: "Installation: one working day with around 40 minutes without power. Someone needs to be home." })],
      [t({ lt: "Per 10 darbo dienų po montavimo", en: "Within 10 working days of installation" }),
       t({ lt: "ESO leidimas gaminti ir kaupiklio prijungimas prie Ignitis platformos. Nuo šios dienos jis pradeda uždirbti.",
           en: "Grid permission to generate, and the battery is connected to the Ignitis platform. From this day it starts earning." })],
      [t({ lt: "Pirmoji sąskaita", en: "First invoice" }),
       financed
         ? t({ lt: `Mėnesį po priėmimo, Ignitis savitarnoje. Vienoje sąskaitoje: elektra, ${EUR(q.loan, 2)} paskolos įmoka „${q.lender.name}“ ir Jūsų lankstumo pajamų dalis — vidutiniškai apie ${EUR((c.flexAnnual / 12))}.`,
             en: `A month after sign-off, in Ignitis savitarna. One invoice with the electricity, the ${EUR(q.loan, 2)} instalment to ${q.lender.name}, and your share of the flexibility revenue — around ${EUR((c.flexAnnual / 12))} on average.` })
         : t({ lt: `Mėnesį po priėmimo, Ignitis savitarnoje. Vienoje sąskaitoje: elektra ir Jūsų lankstumo pajamų dalis — vidutiniškai apie ${EUR((c.flexAnnual / 12))}. Paskolos nėra.`,
             en: `A month after sign-off, in Ignitis savitarna. One invoice with the electricity and your share of the flexibility revenue — around ${EUR((c.flexAnnual / 12))} on average. No loan.` })],
    ].map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join("");

    return `
      <div class="eyebrow">${t({ lt: "Užsakyta", en: "Ordered" })}</div>
      <div class="selectedbrand">
        ${contractorLogo(c, "brandlogo contractor hero")}
        <h1>${t({ lt: "Kas bus toliau", en: "What happens next" })}</h1>
      </div>
      <p class="lede partyline">${contractorLogo(c, "brandlogo contractor mini")}${financed ? lenderLogo(q.lender, "brandlogo partner mini") : ""}${t({
        lt: financed
          ? `${c.name} · ${hwLabel(c)} · „${q.lender.name}“, ${q.years} ${YEARS(q.years)} · ${EUR(q.monthly)} per mėnesį.`
          : `${c.name} · ${hwLabel(c)} · pirkimas iš karto · ${EUR(q.monthly)} per mėnesį.`,
        en: financed
          ? `${c.name} · ${hwLabel(c)} · ${q.lender.name}, ${q.years} years · ${EUR(q.monthly)} a month.`
          : `${c.name} · ${hwLabel(c)} · bought outright · ${EUR(q.monthly)} a month.` })}</p>

      <div class="card stack"><ul class="timeline">${steps}</ul></div>

      <div class="card">
        <h3 style="display:flex;align-items:center;gap:9px">
          ${contractorLogo(c, "brandlogo contractor inline")}
          ${t({ lt: "Jūsų kontaktas yra rangovas, ne skambučių centras", en: "Your contact is the contractor, not a call centre" })}</h3>
        <p style="font-size:13.5px;color:var(--navy-70);margin-top:8px">${t({
          lt: `Mindaugas, „${c.name}“ montavimo vadovas. Jo numeris bus programėlėje nuo rytojaus. ${t(c.response)} pagal sutartį — jei nesilaikoma, kreipiatės į platformą ir terminą sekame mes.`,
          en: `Mindaugas, installation lead at ${c.name}. His number is in the app from tomorrow. ${t(c.response)} under contract — if that slips, you come to the platform and we chase it.` })}</p>
      </div>

      <div class="honestpanel">
        <b>${t({ lt: "Parama atitenka Jums, ne Ignitis", en: "Any support goes to you, not to Ignitis" })}</b>
        ${t({
          lt: "Kadangi įranga nuo pirmos dienos yra Jūsų, valstybės paramos gavėjas esate Jūs. Modelyje, kuriame kaupiklį finansuotų Ignitis, parama būtų skirta juridiniam asmeniui — čia tokios problemos nėra.",
          en: "Because the equipment is yours from day one, you are the recipient of any state support. In a model where Ignitis financed the battery, the support would go to a company instead — here that problem does not arise." })}
      </div>`;
  },
},

{ /* 10 — the relationship screen */
  id: "pomenesiu",
  label: { lt: "Po pusmečio", en: "Six months on" },
  next: { lt: "Pradėti iš naujo", en: "Restart the demo" },
  role: { lt: "Valdau Jūsų kaupiklį", en: "Operating your battery" },
  foot: { lt: "Vienintelis ekranas, rodantis ryšį, o ne sandorį. Čia matoma, kad pasidalijimas tikrai veikia.",
          en: "The only screen showing a relationship rather than a transaction, and the one where the split is visibly real." },
  agent: [
    { lt: "Kovas. Kaupiklį kroviau pigiomis nakties zonomis 26 naktis iš 31, o rinkoje jis uždirbo daugiau nei vidutinį mėnesį.",
      en: "March. I charged the battery in the cheap night zones on 26 of 31 nights, and in the market it earned more than an average month." },
    { lt: "Į sąskaitą įskaityta lygiai pusė to, ką jis uždirbo. Sausį uždirbo gerokai mažiau — ir tada įskaityta buvo irgi pusė, tik mažesnė.",
      en: "Exactly half of what it earned is credited to the invoice. In January it earned considerably less — and half was credited then too, just a smaller half." },
  ],
  asks: [
    [{ lt: "Kodėl turėčiau atidaryti šią programėlę?", en: "Why would I open this app?" },
     { lt: "Nes čia yra skaičius, kuris kiekvieną mėnesį keičiasi ir kurio pusė yra Jūsų. Tai sąžiningas atsakymas — gražesnė sąsaja Jūsų nesugrąžintų.",
       en: "Because there is a number here that changes every month and half of it is yours. That is the honest answer — a nicer interface would not bring you back." }],
    [{ lt: "Parodykite penkias naktis, kai nekrovėte", en: "Show me the five nights you didn't charge" },
     { lt: "Kovo 3, 9, 17, 24 ir 29 d. — tomis naktimis skirtumas tarp zonų buvo mažesnis už kaupiklio nusidėvėjimo kaštus. Krauti būtų kainavę daugiau, nei uždirbę, todėl palikau ramybėje.",
       en: "3, 9, 17, 24 and 29 March — on those nights the zone spread was below the battery's degradation cost. Charging would have cost more than it earned, so I left it alone." }],
    [{ lt: "Kiek uždirbote Jūs, o ne aš?", en: "What did you earn, as opposed to me?" },
     { lt: `Tiek pat, kiek ir Jūs — pusiau. Rodome bendrą sumą būtent todėl, kad „uždirbate iš mano įrangos“ yra tas prieštaravimas, kuris šį produktą užmuša, jei jo nepaaiškini.`,
       en: `Exactly what you did — we split it. We show the gross figure precisely because "you are making money from my equipment" is the objection that kills this product if left unanswered.` }],
  ],
  render: () => {
    const q = activeQuote();
    const c = q.contractor;

    /* A good month: the market paid well, so the customer's half is above the
       average quoted at checkout. January is named to show it cuts both ways. */
    const flexGross = Math.round(MONTH.flexGross * (c.battery / 16));
    const credited = Math.round(flexGross * FLEX.share);
    const energy = c.billAfter * 0.72;
    const network = c.billAfter * 0.28;
    const financed = Boolean(q.lender);
    const total = c.billAfter + (financed ? q.loan : 0) - (c.exportAnnual / 12) - credited;

    const ops = [
      [t({ lt: "Naktys, krautos pigiomis zonomis", en: "Nights charged in cheap zones" }),
       t({ lt: "vidutinis startas 02:40", en: "02:40 average start" }), `${MONTH.nightsCharged} / ${MONTH.nightsTotal}`],
      [t({ lt: "Iškrovimai rinkos signalu", en: "Dispatches on a market signal" }),
       t({ lt: "visi vakariniame pike", en: "all in the evening peak" }), `${MONTH.dispatchEvents}`],
      [t({ lt: `Kiek kartų paliestas Jūsų ${FLEX.reserveKwh} kWh rezervas`, en: `Times your ${FLEX.reserveKwh} kWh reserve was touched` }),
       t({ lt: "pagal sutartį — niekada", en: "contractually, never" }), `${MONTH.reserveTouched}`],
      [t({ lt: "Elektros nutrūkimai, kuriuos pergyvenote be šviesų gesimo", en: "Outages ridden through without the lights going out" }),
       t(MONTH.outageDetail), `${MONTH.outages}`],
    ].map(([k, s, v]) => `<div class="brk"><div class="l">${k}<em>${s}</em></div><div class="v mono">${v}</div></div>`).join("");

    return `
      <div class="eyebrow">${t({ lt: `Po pusmečio · ${t(MONTH.label)}`, en: `Six months on · ${t(MONTH.label)}` })}</div>
      <h1>${t({ lt: "Jūsų mėnuo", en: "Your month" })}</h1>
      <p class="lede">${t({
        lt: "Viskas iki šio ekrano buvo pardavimas. Šis — ryšys, ir jis yra vienintelė priežastis, kodėl platforma turi vertę po montavimo.",
        en: "Everything before this screen was a sale. This one is a relationship, and it is the only reason the platform has value after the installation." })}</p>

      <div class="card stack">
        <div class="bill">
          <div class="billrow head"><span>${t({ lt: `${t(MONTH.label)} sąskaita`, en: `${t(MONTH.label)} invoice` })}</span>
            <span>${t({ lt: "Sutartis 4417-2290", en: "Account 4417-2290" })}</span></div>
          <div class="billrow"><span>${t({ lt: `Elektros energija — ${MONTH.kwhSupplied} kWh`, en: `Electricity supplied — ${MONTH.kwhSupplied} kWh` })}</span>
            <span class="mono">${EUR(energy, 2)}</span></div>
          <div class="billrow"><span>${t({ lt: "Tinklo mokesčiai", en: "Network charges" })}</span>
            <span class="mono">${EUR(network, 2)}</span></div>
          ${financed ? `<div class="billrow"><span class="partyline">${lenderLogo(q.lender, "brandlogo partner mini")}${t({ lt: `Paskolos įmoka — „${q.lender.name}“, ${q.years} m.`, en: `Loan instalment — ${q.lender.name}, ${q.years} yr` })}</span>
            <span class="mono">${EUR(q.loan, 2)}</span></div>` : ""}
          <div class="billrow credit"><span>${t({ lt: "Į tinklą atiduota saulės energija", en: "Solar exported to the grid" })}</span>
            <span class="mono">−${EUR((c.exportAnnual / 12), 2)}</span></div>
          <div class="billrow credit"><span>${t({
            lt: `Lankstumo pajamų dalis — uždirbta ${EUR(flexGross)}, Jums ${Math.round(FLEX.share * 100)} %`,
            en: `Your share of flexibility revenue — ${EUR(flexGross)} earned, ${Math.round(FLEX.share * 100)}% yours` })}</span>
            <span class="mono">−${EUR(credited, 2)}</span></div>
          <div class="billrow foot"><span>${t({ lt: "Iš viso", en: "Total" })}</span><span class="mono">${EUR(total, 2)}</span></div>
        </div>
        <p style="font-size:13px;color:var(--navy-45);margin-top:14px">${t({
          lt: `Pasirašant skaičiavome vidutiniškai ${EUR((c.flexAnnual / 12))}/mėn. Šis mėnuo buvo geresnis: rinkoje uždirbta ${EUR(flexGross)}, todėl Jūsų pusė — ${EUR(credited)}. Sausį kaupiklis uždirbo tik ${EUR(MONTH.previousMonth.earned)}, ir tą mėnesį Jums atiteko ${EUR(Math.round(MONTH.previousMonth.earned * FLEX.share))}. Pasidalijimas visada tas pats; suma kinta.`,
          en: `At signing we quoted an average of ${EUR((c.flexAnnual / 12))}/month. This month was better: ${EUR(flexGross)} was earned in the market, so your half came to ${EUR(credited)}. In January the battery earned only ${EUR(MONTH.previousMonth.earned)}, and your share that month was ${EUR(Math.round(MONTH.previousMonth.earned * FLEX.share))}. The split never changes; the amount does.` })}</p>
      </div>

      <div class="card">
        <h3 style="display:flex;align-items:center;gap:9px"><span style="color:var(--blue)">${icon("bess")}</span>
          ${t({ lt: "Ką dariau su Jūsų kaupikliu", en: "What I did with your battery" })}</h3>
        <div style="margin-top:12px">${ops}</div>
        <div class="brk total"><div class="l">${t({ lt: "Uždirbta rinkoje", en: "Earned in the market" })}
          <em>${t({ lt: `${EUR(credited)} įskaityta Jums`, en: `${EUR(credited)} credited to you` })}</em></div>
          <div class="v mono">${EUR(flexGross, 2)}</div></div>
      </div>`;
  },
},
];

/* ---------- rendering ---------- */

function render() {
  const s = SCREENS[state.i];

  const stage = el("stage");
  stage.innerHTML = `<div class="sheet ${s.wide ? "wide" : ""}">${s.render()}</div>`;
  stage.scrollTop = 0;

  el("steps").innerHTML = SCREENS.map((sc, i) =>
    `<button class="step ${i === state.i ? "active" : i < state.i ? "done" : ""}" data-step="${i}" title="${t(sc.label)}"></button>`).join("");

  el("brandtag").textContent = t(CHROME.brandtag);
  el("agentName").textContent = t(CHROME.agentName);
  el("resetBtn").textContent = t(CHROME.reset);
  el("backBtn").textContent = t(CHROME.back);
  el("footnote").textContent = t(s.foot);
  el("nextBtn").textContent = t(s.next);
  el("nextBtn").disabled = s.can ? !s.can() : false;
  el("backBtn").style.visibility = state.i === 0 ? "hidden" : "visible";

  const railHidden = el("app").classList.contains("rail-hidden");
  el("railBtn").textContent = t(railHidden ? CHROME.showRail : CHROME.hideRail);

  renderAgent(s);
}

function renderAgent(s) {
  el("agentRole").textContent = t(s.role);

  el("railBody").innerHTML =
    s.agent.map((m) => `<div class="msg">${t(m)}</div>`).join("") +
    state.log.map((m) => `<div class="msg ${m.me ? "me" : ""}">${m.text}</div>`).join("");
  el("railBody").scrollTop = el("railBody").scrollHeight;

  el("asks").innerHTML = `<div class="lbl">${t(CHROME.askMe)}</div>` +
    s.asks.map((a, i) => `<button class="ask" data-ask="${i}">${t(a[0])}</button>`).join("");
}

/* ---------- interaction ---------- */

function go(i) {
  if (i < 0) return;
  if (i >= SCREENS.length) return reset();
  /* Upfront path has no lender/credit screens — bounce step clicks away. */
  if (state.approach === "upfront" && (i === 3 || i === 5 || i === 6 || i === 7)) {
    i = i <= 3 ? 4 : 8;
  }
  state.i = i;
  state.log = [];
  render();
}

function reset() {
  state.i = 0;
  state.scenario = "full";
  setScenario("full");
  state.approach = null;
  state.contractor = null;
  state.lender = "seb";
  state.dispatch = null;
  state.formFilled = false;
  state.log = [];
  render();
}

document.addEventListener("click", (e) => {
  const node = e.target.closest(
    "[data-scenario],[data-approach],[data-contractor],[data-lender],[data-dispatch],[data-fill],[data-step],[data-goto],[data-ask],[data-lang]");
  if (!node) return;

  if (node.dataset.lang) {
    LANG.current = node.dataset.lang;
    document.documentElement.lang = LANG.current;
    document.querySelectorAll(".langbtn").forEach((b) =>
      b.classList.toggle("on", b.dataset.lang === LANG.current));
    /* Flow state survives a language change — only the copy is re-resolved. */
    return render();
  }

  if (node.dataset.scenario) {
    state.scenario = node.dataset.scenario;
    setScenario(state.scenario);
    state.approach = null;
    state.contractor = null;
    state.dispatch = null;
    state.formFilled = false;
    return render();
  }

  if (node.dataset.approach) {
    state.approach = node.dataset.approach;
    state.contractor = null;
    return render();
  }

  if (node.dataset.contractor) {
    state.contractor = node.dataset.contractor;
    return render();
  }

  if (node.dataset.lender) {
    state.lender = node.dataset.lender;
    return render();
  }

  if (node.dataset.dispatch) {
    state.dispatch = node.dataset.dispatch;
    return render();
  }

  if (node.dataset.fill) {
    state.formFilled = !state.formFilled;
    return render();
  }

  if (node.dataset.step) return go(+node.dataset.step);
  if (node.dataset.goto) return go(+node.dataset.goto);

  if (node.dataset.ask) {
    const [q, a] = SCREENS[state.i].asks[+node.dataset.ask];
    state.log.push({ me: true, text: t(q) }, { me: false, text: t(a) });
    return renderAgent(SCREENS[state.i]);
  }
});

el("nextBtn").onclick = () => go(nextIndex(state.i));
el("backBtn").onclick = () => go(prevIndex(state.i));
el("resetBtn").onclick = reset;

el("railBtn").onclick = () => {
  const hidden = el("app").classList.toggle("rail-hidden");
  el("railBtn").textContent = t(hidden ? CHROME.showRail : CHROME.hideRail);
};

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input,textarea")) return;
  if (e.key === "ArrowRight" && !el("nextBtn").disabled) go(nextIndex(state.i));
  if (e.key === "ArrowLeft") go(prevIndex(state.i));
});

render();
