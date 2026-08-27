/* Value model for the Ignitis consumer-flexibility mockup.
   Every euro shown in the UI is derived here so the offer recalculates
   when the customer changes dispatch level or variant. */

const EUR = (n, dp = 0) => "€" + n.toLocaleString("en-IE", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const PERSONA = {
  name: "Mantas",
  age: 44,
  place: "Detached house, Avizieniai (Vilnius district)",
  pv: 6.5,
  pvYear: 2022,
  consumption: 6500,
  generation: 6000,
  exported: 3000,
  waterHeating: 1850,
  currentAnnualCost: 712,
};

/* Publicly defensible figures. The zone spread is the one number that carries
   most of the illustrated saving; everything flexibility-related is flagged. */
const TARIFF = {
  zoneSpread: 0.09,        // EUR/kWh incl. VAT, four-zone network tariff spread
  retail: 0.24,            // EUR/kWh incl. VAT, all-in import price
  exportValue2022: 0.21,   // effective value returned per exported kWh
  exportValue2026: 0.144,
  erosionPerYear: 0.09,    // net metering terms degrade ~9%/yr by design
};

const DISPATCH = {
  full: {
    id: "full",
    label: "Full flexibility",
    blurb: "We control charge and discharge. You keep a guaranteed 3 kWh reserve for backup at all times.",
    detail: "Highest revenue share to you, lowest monthly cost.",
    control: 1.0,
    test1: "Held by Ignitis, contractually, for the term.",
  },
  reserved: {
    id: "reserved",
    label: "Reserved days",
    blurb: "We can use it on up to 8 days a month, announced the evening before. You can veto twice a month.",
    detail: "Middle price, middle share.",
    control: 0.65,
    test1: "Held by Ignitis, but interruptible — a lender discounts it.",
  },
  none: {
    id: "none",
    label: "Mine only",
    blurb: "No dispatch. The asset is yours to use and nothing is offered to the market.",
    detail: "You pay more, and we say so plainly.",
    control: 0,
    test1: "Held by the customer. We are a hardware financier, nothing more.",
  },
};

const VARIANTS = {
  A: {
    id: "A",
    name: "Battery, no upfront cost",
    kicker: "We own it. You use it.",
    hardware: "10 kWh battery + hybrid inverter, installed",
    upfront: 0,
    term: "36-month agreement",
    ownership: "Ignitis owns the asset and the residual value",
    includes: [
      { icon: "bess", short: "Battery", cap: "10 kWh", state: "in", title: "10 kWh battery — financed and owned by Ignitis" },
      { icon: "solar", short: "Solar", cap: "6.5 kW", state: "in", title: "Your existing 6.5 kW array, now charging the battery instead of exporting" },
      { icon: "water", short: "Water", cap: "Shifted", state: "in", title: "Water heating moved into the cheap network zones automatically" },
      { icon: "ev", short: "EV", cap: "Ready", state: "later", title: "Smart charging switches on the day your EV arrives — no hardware change" },
    ],
    units: ["Service level (€/month)", "Financing spread", "Dispatch right"],
    monthly: { full: 21, reserved: 29, none: 41 },
    savings: {
      // Battery self-consumption does not need our dispatch — it happens anyway.
      selfConsumption: { label: "Solar you keep instead of export", value: 378, needsControl: false,
        basis: "2,100 kWh/yr moved from export (€0.144) to self-use (€0.24)" },
      zoneShift: { label: "Water heating moved to cheap network zones", value: 63, needsControl: true,
        basis: "700 winter kWh × €0.09 four-zone spread" },
    },
    flexGross: 240,
    flexCustomerShare: 0.5,
    caps: { billCap: 61, backup: "3 kWh reserve — fridge, boiler, lights, router for ~9 hours" },
    honestly: "You do not own the hardware, and you are committed for three years.",
    fit: { availability: 3, certainty: 3, cheapest: 1, acceptability: 3, accessibility: 3 },
  },
  B: {
    id: "B",
    name: "No hardware — just control",
    kicker: "Nothing installed. We move your load.",
    hardware: "A relay on the water heater. Later, your EV charger.",
    upfront: 0,
    term: "12 months, cancel any time after 3",
    ownership: "Nothing to own",
    includes: [
      { icon: "bess", short: "Battery", cap: "None", state: "out", title: "No battery. Nothing is installed and nothing is stored." },
      { icon: "solar", short: "Solar", cap: "6.5 kW", state: "in", title: "Your existing 6.5 kW array, with heating scheduled into its hours" },
      { icon: "water", short: "Water", cap: "Shifted", state: "in", title: "Water heating moved into the cheap network zones automatically" },
      { icon: "ev", short: "EV", cap: "Ready", state: "later", title: "Smart charging switches on the day your EV arrives — no hardware change" },
    ],
    units: ["Certainty premium", "Tariff optimisation"],
    monthly: { full: 5, reserved: 7, none: 11 },
    savings: {
      zoneShift: { label: "Water heating moved to cheap network zones", value: 135, needsControl: true,
        basis: "1,500 kWh/yr × €0.09 four-zone spread" },
      solarTiming: { label: "Heating scheduled into your own solar hours", value: 40, needsControl: true,
        basis: "280 kWh/yr shifted from import to self-use" },
    },
    flexGross: 90,
    flexCustomerShare: 0.5,
    caps: { billCap: 74, backup: "None. An outage is still an outage." },
    honestly: "No backup power. This is a bill product, not a resilience product.",
    unavailableWithoutDispatch: true,
    fit: { availability: 0, certainty: 2, cheapest: 3, acceptability: 1, accessibility: 3 },
  },
  C: {
    id: "C",
    name: "You buy it, we run it",
    kicker: "Your asset. Our market access.",
    hardware: "10 kWh battery + hybrid inverter, installed",
    upfront: 6900,
    term: "No lock-in. Operating agreement, 12 months rolling.",
    ownership: "You own the asset and the residual value",
    includes: [
      { icon: "bess", short: "Battery", cap: "Yours", state: "in", title: "10 kWh battery — you buy it, you own it, we operate it" },
      { icon: "solar", short: "Solar", cap: "6.5 kW", state: "in", title: "Your existing 6.5 kW array, now charging the battery instead of exporting" },
      { icon: "water", short: "Water", cap: "Shifted", state: "in", title: "Water heating moved into the cheap network zones automatically" },
      { icon: "ev", short: "EV", cap: "Ready", state: "later", title: "Smart charging switches on the day your EV arrives — no hardware change" },
    ],
    units: ["Financing spread", "Thinner dispatch share"],
    monthly: { full: 6, reserved: 9, none: 15 },
    savings: {
      selfConsumption: { label: "Solar you keep instead of export", value: 378, needsControl: false,
        basis: "2,100 kWh/yr moved from export (€0.144) to self-use (€0.24)" },
      zoneShift: { label: "Water heating moved to cheap network zones", value: 63, needsControl: true,
        basis: "700 winter kWh × €0.09 four-zone spread" },
    },
    flexGross: 240,
    flexCustomerShare: 0.7,
    caps: { billCap: null, backup: "3 kWh reserve — fridge, boiler, lights, router for ~9 hours" },
    honestly: "€6,900 up front, and well over a decade before you break even.",
    fit: { availability: 3, certainty: 1, cheapest: 2, acceptability: 3, accessibility: 0 },
  },
};

const PRIORITIES = [
  { id: "availability", a: "Availability", customer: "I want the lights on when the power cuts out",
    wtp: "Who actually experiences outages, and what will they pay to remove them?" },
  { id: "certainty", a: "Affordability — certainty", customer: "I want to know what I'll pay each month",
    wtp: "Is this customer buying cheap, or buying certainty? Different products." },
  { id: "cheapest", a: "Affordability — cheapness", customer: "I want the lowest possible cost, and I'll shift when I use things",
    wtp: "Same A, opposite product. Someone in the room should notice." },
  { id: "acceptability", a: "Acceptability", customer: "I want to actually use the energy my roof makes",
    wtp: "Will they hand over control of an asset, and on what terms?" },
  { id: "accessibility", a: "Accessibility", customer: "I don't want to spend upfront or manage anything",
    wtp: "What is the capital and cognitive barrier, and who removes it?" },
];

/* ---------- derivation ---------- */

function priceVariant(variantId, dispatchId) {
  const v = VARIANTS[variantId];
  const d = DISPATCH[dispatchId];
  const unavailable = Boolean(v.unavailableWithoutDispatch) && d.control === 0;

  const lines = Object.values(v.savings).map((s) => ({
    label: s.label,
    basis: s.basis,
    value: Math.round(s.needsControl ? s.value * d.control : s.value),
    gated: s.needsControl,
  }));

  const flexGrossYear = Math.round(v.flexGross * d.control);
  const flexToCustomer = Math.round(flexGrossYear * v.flexCustomerShare);
  const savingsTotal = lines.reduce((t, l) => t + l.value, 0);
  const monthly = v.monthly[dispatchId];
  const annualCost = monthly * 12;
  const net = savingsTotal + flexToCustomer - annualCost;

  return {
    variant: v, dispatch: d, unavailable, lines,
    flexGrossYear, flexToCustomer, savingsTotal,
    monthly, annualCost, net,
    newAnnualBill: PERSONA.currentAnnualCost - net,
    paybackYears: v.upfront > 0 && net > 0 ? Math.round((v.upfront / net) * 10) / 10 : null,
  };
}

/* The number the strategy doc says we must be able to name:
   what we are willing to pay a household for a dispatch right. */
function dispatchRightPrice(variantId) {
  const full = priceVariant(variantId, "full");
  const none = priceVariant(variantId, "none");
  return { perYear: full.net - none.net, perMonth: VARIANTS[variantId].monthly.none - VARIANTS[variantId].monthly.full };
}

function recommendVariant(selectedPriorities) {
  if (!selectedPriorities.length) return "A";
  const scored = Object.values(VARIANTS).map((v) => ({
    id: v.id,
    score: selectedPriorities.reduce((t, p) => t + (v.fit[p] || 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

function fourTests(variantId, dispatchId) {
  const v = VARIANTS[variantId];
  const d = DISPATCH[dispatchId];
  const held = d.control > 0;
  return [
    { q: "Do we hold the dispatch right, or does the customer?", a: d.test1, pass: d.control === 1 ? "pass" : d.control > 0 ? "partial" : "fail" },
    { q: "Prequalified where firmness is paid, or only arbitraging price?",
      a: held ? "BBCM prequalification requires ≥1 MW per product per direction — roughly 150–200 homes. Below that this is arbitrage." : "Not applicable. Nothing is offered to the market.",
      pass: held ? "partial" : "fail" },
    { q: "Who paid for the hardware and owns the residual?",
      a: v.upfront === 0 ? (v.id === "B" ? "No hardware exists. Nothing to finance, nothing to own." : "Ignitis paid and holds the residual.") : "The customer paid and holds the residual.",
      pass: v.id === "A" ? "pass" : v.id === "C" ? "partial" : "fail" },
    { q: "Contracted or merely aggregated — would a lender finance it?",
      a: d.control === 1 ? "Contracted for 36 months with a defined reserve. Financeable." : d.control > 0 ? "Contracted but interruptible and vetoable. A lender haircuts it." : "Neither. This is a hardware sale with a service wrapper.",
      pass: d.control === 1 && v.id === "A" ? "pass" : d.control > 0 ? "partial" : "fail" },
  ];
}
