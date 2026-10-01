/* Value model for the Ignitis platform demo — contractor variant.

   The customer owns the asset. A financing partner pays for it through a
   point-of-sale loan over ten years. A contractor on the platform supplies,
   installs and services it. Ignitis operates the battery, shares the flexibility
   revenue evenly, and settles everything on one invoice — with no capital of its
   own at risk.

   Every figure here is illustrative. The baseline is anchored on slide 5 of
   Residential_BESS_Operating_Models so the numbers hang together: a
   10,000 kWh/yr household paying roughly €200/month today. */

const LANG = { current: "lt" };

/* Copy lives as { lt, en } pairs. Every string in the demo is customer-facing,
   so the whole surface translates. */
const t = (o) => (typeof o === "string" ? o : o[LANG.current] ?? o.lt);

const EUR = (n, dp = 0) => {
  const num = n.toLocaleString(LANG.current === "lt" ? "lt-LT" : "en-IE", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
  return LANG.current === "lt" ? `${num} €` : `€${num}`;
};

/* Lithuanian numerals govern the case of the noun: 5 metai, but 10 metų and
   15 metų. Numbers ending in zero, and the teens, take the genitive plural. */
const YEARS = (n) => {
  if (LANG.current !== "lt") return n === 1 ? "year" : "years";
  const teens = n % 100 >= 11 && n % 100 <= 19;
  return n % 10 === 0 || teens ? "metų" : "metai";
};

/* Lithuanian writes 11,5 kWh; English 11.5 kWh. */
const NUM = (n, dp = 1) =>
  n.toLocaleString(LANG.current === "lt" ? "lt-LT" : "en-IE", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

const PERSONA = {
  name: "Darius",
  age: 41,
  place: {
    lt: "Nuosavas namas, Bajorai (Vilniaus r.)",
    en: "Detached house, Bajorai (Vilnius district)",
  },
  household: {
    lt: "Du vaikai · abu tėvai darbo dienomis dirba ne namuose",
    en: "Two kids · both parents work away from home on weekdays",
  },
  consumption: 10000,
  heatPumpYear: 2021,
  evYear: 2024,
  currentMonthlyCost: 200,
  currentAnnualCost: 2400,
};

/* What his own data suggests, shown as a derived recommendation rather than a
   fixed specification. Contractors quote around it, not to it. */
const SIZING = {
  pv: 10,
  inverter: 12,
  battery: 16,
  basis: {
    lt: "Pagal 10 000 kWh metinį vartojimą, šilumos siurblio ir elektromobilio profilį bei vakarinį pikį",
    en: "From 10,000 kWh of annual use, the heat-pump and EV profile, and the evening peak",
  },
};

/* No guaranteed minimum. Ignitis operates the battery and splits what it earns
   in the market evenly, so what appears in the monthly figure is an average of
   what the asset has actually been worth — not a promise. BBCM capacity clearing
   prices are not published, which is exactly why this is stated as a share. */
const FLEX = {
  share: 0.5,
  reserveKwh: 3,
  reserveHours: 9,
};

/* Point-of-sale loan, zero upfront, fixed at ten years. What the customer
   chooses is which financing partner on the platform funds it, so the
   comparison is a rate comparison rather than a cash-flow one. */
const LOAN_YEARS = 10;

const LENDERS = [
  {
    id: "ft",
    name: "Finansų Tiltas",
    rate: 0.05,
    note: {
      lt: "Mažiausia metinė norma platformoje. Sprendimas per 2 darbo dienas.",
      en: "The lowest rate on the platform. A decision within two working days.",
    },
  },
  {
    id: "nk",
    name: "Nordkreditas",
    rate: 0.054,
    note: {
      lt: "Priima paraiškas ir su esamais įsipareigojimais, bet norma didesnė.",
      en: "Accepts applications alongside existing obligations, at a higher rate.",
    },
  },
  {
    id: "bk",
    name: "Baltijos Kreditas",
    rate: 0.059,
    note: {
      lt: "Greičiausias sprendimas — tą pačią dieną, bet už tai sumokate norma.",
      en: "The fastest decision, same day, paid for in the rate.",
    },
  },
];

/* Four contractors, each quoting its own hardware. This is the defining feature
   of the contractor variant: the bundles are not comparable as specifications,
   so the platform has to normalise them into monthly cost and annual benefit.

   billAfter / exportIncome / flexAvg are stated per bundle rather than derived
   from kW, because all of it is illustrative and legible numbers argue better
   than a scaling formula nobody can check in the room. */
const CONTRACTORS = [
  {
    id: "sg",
    name: "Saulės Grąža",
    since: 2016,
    installs: 1840,
    rating: 4.6,
    reviews: 128,
    price: 9450,
    pv: 10.0,
    inverter: 12,
    battery: 16,
    brands: { lt: "Huawei inverteris · Dyness kaupiklis", en: "Huawei inverter · Dyness battery" },
    leadWeeks: 6,
    warrantyBattery: 10,
    warrantyInstall: 5,
    response: { lt: "Reakcija per 48 val.", en: "48-hour response" },
    billAfter: 120,
    exportIncome: 31,
    flexAvg: 22,
    honest: {
      lt: "Ilgiausias laukimas tarp vidutinės kainos pasiūlymų — šešios savaitės metų pradžioje.",
      en: "The longest wait among the mid-priced bundles — six weeks at the front of the year.",
    },
  },
  {
    id: "ev",
    name: "Energijos Vartai",
    since: 2019,
    installs: 610,
    rating: 4.3,
    reviews: 61,
    price: 8600,
    pv: 9.4,
    inverter: 10,
    battery: 15,
    brands: { lt: "Deye inverteris · Pylontech kaupiklis", en: "Deye inverter · Pylontech battery" },
    leadWeeks: 3,
    warrantyBattery: 10,
    warrantyInstall: 3,
    response: { lt: "Reakcija per 72 val.", en: "72-hour response" },
    billAfter: 128,
    exportIncome: 28,
    flexAvg: 21,
    honest: {
      lt: "Trumpiausia montavimo garantija platformoje — treji metai, o ne penki.",
      en: "The shortest installation warranty on the platform — three years, not five.",
    },
  },
  {
    id: "bs",
    name: "Baltijos Saulė",
    since: 2013,
    installs: 3270,
    rating: 4.8,
    reviews: 204,
    price: 11200,
    pv: 11.2,
    inverter: 12,
    battery: 20,
    brands: { lt: "Fronius inverteris · BYD kaupiklis", en: "Fronius inverter · BYD battery" },
    leadWeeks: 8,
    warrantyBattery: 12,
    warrantyInstall: 5,
    response: { lt: "Reakcija per 24 val.", en: "24-hour response" },
    billAfter: 108,
    exportIncome: 37,
    flexAvg: 28,
    honest: {
      lt: "Didžiausia kaina ir ilgiausias laukimas. Mėnesio nauda didesnė, bet paskola — irgi.",
      en: "Highest price and longest wait. The monthly benefit is larger, but so is the loan.",
    },
  },
  {
    id: "zj",
    name: "Žalia Jėga",
    since: 2021,
    installs: 240,
    rating: 4.1,
    reviews: 38,
    price: 7900,
    pv: 10.0,
    inverter: 10,
    battery: 10,
    brands: { lt: "Solax inverteris · Solax kaupiklis", en: "Solax inverter · Solax battery" },
    leadWeeks: 4,
    warrantyBattery: 10,
    warrantyInstall: 2,
    response: { lt: "Reakcija per 5 d. d.", en: "Five-working-day response" },
    billAfter: 138,
    exportIncome: 30,
    flexAvg: 14,
    honest: {
      lt: "Pigiausia įranga, bet mažas kaupiklis: mažesnė lankstumo vertė ir trumpesnis atsarginis maitinimas.",
      en: "Cheapest hardware, smallest battery: a lower flexibility value and less backup time.",
    },
  },
];

const contractorById = (id) => CONTRACTORS.find((c) => c.id === id) || CONTRACTORS[0];
const lenderById = (id) => LENDERS.find((x) => x.id === id) || LENDERS[0];

/* ---------- derivation ---------- */

/* Standard annuity. Zero upfront, so the financed principal is the full price. */
function instalment(price, years, rate) {
  const r = rate / 12;
  const n = years * 12;
  return (price * r) / (1 - Math.pow(1 + r, -n));
}

/* What leaves the household each month, and what that is worth against doing
   nothing. The flexibility component is an average, so the total is too. */
function quote(contractorId, lenderId) {
  const c = contractorById(contractorId);
  const lender = lenderById(lenderId);
  const loan = instalment(c.price, LOAN_YEARS, lender.rate);

  const monthly = c.billAfter + loan - c.exportIncome - c.flexAvg;
  const monthlySaving = PERSONA.currentMonthlyCost - monthly;
  const totalRepaid = loan * LOAN_YEARS * 12;

  return {
    contractor: c,
    lender,
    years: LOAN_YEARS,
    loan,
    monthly,
    monthlySaving,
    annualBenefit: monthlySaving * 12,
    totalRepaid,
    interestPaid: totalRepaid - c.price,
    upfront: 0,
  };
}

/* The same bundle bought outright: no instalment, so the monthly saving is as
   large as it gets. The platform does not offer this route yet, and the card
   exists to show what the financing costs in exchange for requiring no capital. */
function upfrontQuote(contractorId) {
  const c = contractorById(contractorId);
  const monthly = c.billAfter - c.exportIncome - c.flexAvg;
  return {
    contractor: c,
    upfront: c.price,
    loan: 0,
    monthly,
    monthlySaving: PERSONA.currentMonthlyCost - monthly,
  };
}

/* Ordering for the marketplace: cheapest monthly first, which is deliberately
   not the same as cheapest hardware. */
function rankedQuotes(lenderId) {
  return CONTRACTORS.map((c) => quote(c.id, lenderId)).sort((a, b) => a.monthly - b.monthly);
}

function bestQuote(lenderId) {
  return rankedQuotes(lenderId)[0];
}

/* The same, bought outright — used by the second approach card. */
function bestUpfrontQuote() {
  return CONTRACTORS.map((c) => upfrontQuote(c.id)).sort((a, b) => a.monthly - b.monthly)[0];
}

/* One operating month, for the epilogue. January is the month the market paid
   little, which is what an average rather than a guarantee actually means. */
const MONTH = {
  label: { lt: "2027 m. kovas", en: "March 2027" },
  kwhSupplied: 712,
  nightsCharged: 26,
  nightsTotal: 31,
  dispatchEvents: 11,
  reserveTouched: 0,
  outages: 1,
  outageDetail: {
    lt: "Kovo 14 d., 19:42, 34 minutės",
    en: "14 March, 19:42, 34 minutes",
  },
  flexGross: 58,
  previousMonth: {
    label: { lt: "sausį", en: "in January" },
    earned: 16,
  },
};
