/* Value model for the Ignitis platform demo — contractor variant.

   The customer owns the asset. A financing partner pays for it through a
   point-of-sale loan. A contractor on the platform supplies, installs and
   services it. Ignitis holds the dispatch right and settles everything on one
   invoice, with no capital of its own at risk.

   Every figure here is illustrative. The baseline is anchored on slide 5 of
   Residential_BESS_Operating_Models so the numbers hang together: a
   10,000 kWh/yr household, roughly €200/month before and €169/month after a
   10 kW array with a 16 kWh battery on a ten-year loan. */

const LANG = { current: "lt" };

/* Copy lives as { lt, en } pairs. With no presenter layer every string in the
   demo is customer-facing, so the whole surface translates. */
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
  waterHeating: 2000,
  heatPumpYear: 2021,
  currentMonthlyCost: 200,
  currentAnnualCost: 2400,
  savings: 1800,          // what he has available — far short of a 9,000 € system
};

/* What his own data suggests, shown as a derived recommendation rather than a
   fixed specification. Contractors quote around it, not to it. */
const SIZING = {
  pv: 10,
  inverter: 12,
  battery: 16,
  basis: {
    lt: "Pagal 10 000 kWh metinį vartojimą, šilumos siurblio profilį ir vakarinį pikį",
    en: "From 10,000 kWh of annual use, the heat-pump profile and the evening peak",
  },
};

/* Flexibility reaches the customer as a guaranteed monthly floor netted off the
   instalment, with anything above it split evenly. The floor is what makes the
   monthly figure sayable at all — BBCM capacity clearing prices are not
   published, so an uncapped estimate would be a promise we cannot make. */
const FLEX = {
  upsideShare: 0.5,
  reserveKwh: 3,
  reserveHours: 9,
};

/* Point-of-sale loan. Zero upfront on every term — that is the whole offer.
   The platform shows the best partner offer per term rather than one lender. */
const TERMS = [
  {
    years: 5,
    rate: 0.045,
    partner: "Nordkreditas",
    note: {
      lt: "Mažiausiai palūkanų, bet įmoka viršija dabartinę sąskaitą.",
      en: "Least interest paid, but the instalment exceeds the current bill.",
    },
  },
  {
    years: 10,
    rate: 0.05,
    partner: "Finansų Tiltas",
    note: {
      lt: "Įmoka telpa į dabartinę sąskaitą ir baigiasi kartu su kaupiklio garantija.",
      en: "The instalment fits inside the current bill and ends with the battery warranty.",
    },
  },
  {
    years: 15,
    rate: 0.056,
    partner: "Finansų Tiltas",
    note: {
      lt: "Mažiausia mėnesio įmoka, bet 15 metų ilgiau nei įrangos garantija.",
      en: "Lowest monthly cost, but fifteen years outlives the equipment warranty.",
    },
  },
];

const PARTNER_COUNT = 3;   // how many financing partners the platform compared

/* Four contractors, each quoting its own hardware. This is the defining feature
   of the contractor variant: the bundles are not comparable as specifications,
   so the platform has to normalise them into monthly cost and annual benefit.

   billAfter / exportIncome / flexFloor are stated per bundle rather than derived
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
    flexFloor: 22,
    honest: {
      lt: "Ilgiausias laukimas tarp vidutinės kainos pasiūlymų — šeši mėnesiai metų pradžioje.",
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
    flexFloor: 21,
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
    flexFloor: 28,
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
    flexFloor: 14,
    honest: {
      lt: "Pigiausia įranga, bet mažas kaupiklis: mažesnė lankstumo garantija ir trumpesnis atsarginis maitinimas.",
      en: "Cheapest hardware, smallest battery: a lower flexibility floor and less backup time.",
    },
  },
];

const contractorById = (id) => CONTRACTORS.find((c) => c.id === id) || CONTRACTORS[0];
const termByYears = (y) => TERMS.find((x) => x.years === y) || TERMS[1];

/* ---------- derivation ---------- */

/* Standard annuity. Zero upfront, so the financed principal is the full price. */
function instalment(price, years, rate) {
  const r = rate / 12;
  const n = years * 12;
  return (price * r) / (1 - Math.pow(1 + r, -n));
}

/* The two figures the platform normalises every bundle down to: what leaves the
   household each month, and what that is worth against doing nothing. */
function quote(contractorId, years) {
  const c = contractorById(contractorId);
  const term = termByYears(years);
  const loan = instalment(c.price, term.years, term.rate);

  const monthly = c.billAfter + loan - c.exportIncome - c.flexFloor;
  const monthlySaving = PERSONA.currentMonthlyCost - monthly;
  const totalRepaid = loan * term.years * 12;

  return {
    contractor: c,
    term,
    loan,
    monthly,
    monthlySaving,
    annualBenefit: monthlySaving * 12,
    totalRepaid,
    interestPaid: totalRepaid - c.price,
    upfront: 0,
    /* Flexibility above the floor is shared, so the floor is a minimum rather
       than a cap. Shown as an illustrative good month on the final screen. */
    flexFloorYear: c.flexFloor * 12,
    warrantyGapYears: Math.max(0, term.years - c.warrantyBattery),
  };
}

/* Ordering for the marketplace: cheapest monthly first, which is deliberately
   not the same as cheapest hardware. */
function rankedQuotes(years) {
  return CONTRACTORS.map((c) => quote(c.id, years)).sort((a, b) => a.monthly - b.monthly);
}

function bestQuote(years) {
  return rankedQuotes(years)[0];
}

/* Illustrative aggregation state for the closing screen. Real BBCM
   prequalification needs at least 1 MW per product per direction. */
const POOL = {
  assets: 168,
  mw: 1.3,
  thresholdMw: 1,
};

/* One operating month, for the epilogue. January is the month the floor had to
   catch something, which is the only reason a floor is worth having. */
const MONTH = {
  label: { lt: "2027 m. kovas", en: "March 2027" },
  kwhSupplied: 712,
  cheapZoneShare: 81,
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
