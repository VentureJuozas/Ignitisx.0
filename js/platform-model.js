/* Value model for the Ignitis platform demo — contractor variant.

   Two demo scenarios share the same flow:
   - full: 7.3 kW PV + 10 kW inverter + 11.52 kWh BESS at €7,995, 7,000 kWh/yr household
   - addon: BESS only (PV already on the roof) at €3,565, 7,000 kWh/yr household

   Financed monthly figures for the full-system lead quote match the case table:
   €140 today → €39 electricity + €86 instalment = €125, saving €15/mo.
   Export (€30/yr) and flexibility (€15/yr) are shown as annual case figures;
   the €39 electricity line is already net of those effects. */

const LANG = { current: "lt" };

const t = (o) => (typeof o === "string" ? o : o[LANG.current] ?? o.lt);

const EUR = (n, dp = 0) => {
  const num = n.toLocaleString(LANG.current === "lt" ? "lt-LT" : "en-IE", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
  return LANG.current === "lt" ? `${num} €` : `€${num}`;
};

const YEARS = (n) => {
  if (LANG.current !== "lt") return n === 1 ? "year" : "years";
  const teens = n % 100 >= 11 && n % 100 <= 19;
  return n % 10 === 0 || teens ? "metų" : "metai";
};

const NUM = (n, dp = 1) =>
  n.toLocaleString(LANG.current === "lt" ? "lt-LT" : "en-IE", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

/* Flexibility is a revenue share, not a guaranteed floor. */
const FLEX = {
  share: 0.5,
  reserveKwh: 3,
  reserveHours: 9,
};

const LOAN_YEARS = 10;

/* SEB ~5.3% lands the €7,995 full-system loan near the case instalment of €86. */
const LENDERS = [
  {
    id: "seb",
    name: "SEB",
    logo: "assets/partners/seb.png",
    rate: 0.053,
    note: {
      lt: "Mažiausia metinė norma platformoje. Sprendimas per 2 darbo dienas.",
      en: "The lowest rate on the platform. A decision within two working days.",
    },
  },
  {
    id: "luminor",
    name: "Luminor",
    logo: "assets/partners/luminor.png?v=2",
    rate: 0.057,
    note: {
      lt: "Priima paraiškas ir su esamais įsipareigojimais, bet norma didesnė.",
      en: "Accepts applications alongside existing obligations, at a higher rate.",
    },
  },
  {
    id: "swedbank",
    name: "Swedbank",
    logo: "assets/partners/swedbank.png",
    rate: 0.062,
    note: {
      lt: "Greičiausias sprendimas — tą pačią dieną, bet už tai sumokate norma.",
      en: "The fastest decision, same day, paid for in the rate.",
    },
  },
];

const contractorShell = (extra) => ({
  since: 2016,
  installs: 1840,
  rating: 4.6,
  reviews: 128,
  leadWeeks: 6,
  warrantyBattery: 10,
  warrantyInstall: 5,
  response: { lt: "Reakcija per 48 val.", en: "48-hour response" },
  brands: { lt: "Huawei inverteris · Dyness kaupiklis", en: "Huawei inverter · Dyness battery" },
  ...extra,
});

/* First contractor quotes the real case; the other three are dearer. */
const FULL_CONTRACTORS = [
  contractorShell({
    id: "sg",
    name: "Saulės Grąža",
    logo: "assets/contractors/saules-graza.png",
    since: 2016,
    installs: 1840,
    rating: 4.6,
    reviews: 128,
    price: 7995,
    pv: 7.3,
    inverter: 10,
    battery: 11.52,
    billAfter: 39,
    purchasedElectricity: 84,
    exportAnnual: 30,
    flexAnnual: 15,
  }),
  contractorShell({
    id: "ev",
    name: "Energijos Vartai",
    logo: "assets/contractors/energijos-vartai.png",
    since: 2019,
    installs: 610,
    rating: 4.3,
    reviews: 61,
    price: 8690,
    pv: 7.3,
    inverter: 10,
    battery: 11.52,
    leadWeeks: 3,
    warrantyInstall: 3,
    brands: { lt: "Deye inverteris · Pylontech kaupiklis", en: "Deye inverter · Pylontech battery" },
    billAfter: 41,
    purchasedElectricity: 86,
    exportAnnual: 28,
    flexAnnual: 14,
    response: { lt: "Reakcija per 72 val.", en: "72-hour response" },
  }),
  contractorShell({
    id: "bs",
    name: "Baltijos Saulė",
    logo: "assets/contractors/baltijos-saule.png",
    since: 2013,
    installs: 3270,
    rating: 4.8,
    reviews: 204,
    price: 9450,
    pv: 8.2,
    inverter: 10,
    battery: 15.3,
    leadWeeks: 8,
    warrantyBattery: 12,
    brands: { lt: "Fronius inverteris · BYD kaupiklis", en: "Fronius inverter · BYD battery" },
    billAfter: 36,
    purchasedElectricity: 80,
    exportAnnual: 34,
    flexAnnual: 18,
    response: { lt: "Reakcija per 24 val.", en: "24-hour response" },
  }),
  contractorShell({
    id: "zj",
    name: "Žalia Jėga",
    logo: "assets/contractors/zalia-jega.png",
    since: 2021,
    installs: 240,
    rating: 4.1,
    reviews: 38,
    price: 8490,
    pv: 7.3,
    inverter: 10,
    battery: 10.2,
    leadWeeks: 4,
    warrantyInstall: 2,
    brands: { lt: "Solax inverteris · Solax kaupiklis", en: "Solax inverter · Solax battery" },
    billAfter: 44,
    purchasedElectricity: 90,
    exportAnnual: 26,
    flexAnnual: 12,
    response: { lt: "Reakcija per 5 d. d.", en: "Five-working-day response" },
  }),
];

/* Add-on: only the battery is sold; PV + inverter already sit on the roof. */
const ADDON_CONTRACTORS = [
  contractorShell({
    id: "sg",
    name: "Saulės Grąža",
    logo: "assets/contractors/saules-graza.png",
    price: 3565,
    pv: 7.3,
    inverter: 10,
    battery: 11.52,
    billAfter: 53,
    purchasedElectricity: 62,
    exportAnnual: 22,
    flexAnnual: 15,
  }),
  contractorShell({
    id: "ev",
    name: "Energijos Vartai",
    logo: "assets/contractors/energijos-vartai.png",
    since: 2019,
    installs: 610,
    rating: 4.3,
    reviews: 61,
    price: 3990,
    pv: 7.3,
    inverter: 10,
    battery: 11.52,
    leadWeeks: 3,
    warrantyInstall: 3,
    brands: { lt: "Deye inverteris · Pylontech kaupiklis", en: "Deye inverter · Pylontech battery" },
    billAfter: 54,
    purchasedElectricity: 63,
    exportAnnual: 20,
    flexAnnual: 14,
    response: { lt: "Reakcija per 72 val.", en: "72-hour response" },
  }),
  contractorShell({
    id: "bs",
    name: "Baltijos Saulė",
    logo: "assets/contractors/baltijos-saule.png",
    since: 2013,
    installs: 3270,
    rating: 4.8,
    reviews: 204,
    price: 4450,
    pv: 7.3,
    inverter: 10,
    battery: 15.3,
    leadWeeks: 8,
    warrantyBattery: 12,
    brands: { lt: "Fronius inverteris · BYD kaupiklis", en: "Fronius inverter · BYD battery" },
    billAfter: 49,
    purchasedElectricity: 58,
    exportAnnual: 24,
    flexAnnual: 18,
    response: { lt: "Reakcija per 24 val.", en: "24-hour response" },
  }),
  contractorShell({
    id: "zj",
    name: "Žalia Jėga",
    logo: "assets/contractors/zalia-jega.png",
    since: 2021,
    installs: 240,
    rating: 4.1,
    reviews: 38,
    price: 3890,
    pv: 7.3,
    inverter: 10,
    battery: 10.2,
    leadWeeks: 4,
    warrantyInstall: 2,
    brands: { lt: "Solax inverteris · Solax kaupiklis", en: "Solax inverter · Solax battery" },
    billAfter: 56,
    purchasedElectricity: 66,
    exportAnnual: 18,
    flexAnnual: 12,
    response: { lt: "Reakcija per 5 d. d.", en: "Five-working-day response" },
  }),
];

const SCENARIOS = {
  full: {
    id: "full",
    label: { lt: "Visa sistema (PV + kaupiklis)", en: "Full system (PV + battery)" },
    blurb: {
      lt: "Nėra nei saulės elektrinės, nei kaupiklio. Rangovas montuoja 7,3 kW PV, 10 kW inverterį ir 11,52 kWh kaupiklį.",
      en: "No array and no battery yet. The contractor installs 7.3 kW PV, a 10 kW inverter and an 11.52 kWh battery.",
    },
    persona: {
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
      consumption: 7000,
      heatPumpYear: 2021,
      evYear: 2024,
      currentMonthlyCost: 140,
      currentAnnualCost: 1680,
      hasSolar: false,
      hasBattery: false,
    },
    sizing: {
      pv: 7.3,
      inverter: 10,
      battery: 11.52,
      basis: {
        lt: "Pagal ~7 000 kWh metinį vartojimą ir vakarinį piką — 7,3 kW PV, 10 kW inverteris, 11,52 kWh kaupiklis",
        en: "From ~7,000 kWh of annual use and the evening peak — 7.3 kW PV, 10 kW inverter, 11.52 kWh battery",
      },
    },
    payback: {
      yearsNoSubsidy: 6.8,
      yearsWithSubsidy30: 4.9,
      afterPaybackSaving: 100,
      subsidyRate: 0.3,
    },
    contractors: FULL_CONTRACTORS,
  },
  addon: {
    id: "addon",
    label: { lt: "Kaupiklio prieaugis (PV jau yra)", en: "Battery add-on (PV already there)" },
    blurb: {
      lt: "Saulės elektrinė ir inverteris jau stovi. Rangovas prideda tik 11,52 kWh kaupiklį. Vartojimas — 7 000 kWh/metus.",
      en: "The array and inverter are already in. The contractor adds only an 11.52 kWh battery. Consumption is 7,000 kWh/yr.",
    },
    persona: {
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
      consumption: 7000,
      heatPumpYear: 2021,
      evYear: 2024,
      currentMonthlyCost: 90,
      currentAnnualCost: 1080,
      hasSolar: true,
      hasBattery: false,
    },
    sizing: {
      pv: 7.3,
      inverter: 10,
      battery: 11.52,
      basis: {
        lt: "Prie esamos 7,3 kW elektrinės ir 10 kW inverterio — 11,52 kWh kaupiklis. Namų ūkis vartoja 7 000 kWh/metus.",
        en: "Beside the existing 7.3 kW array and 10 kW inverter — an 11.52 kWh battery. The household uses 7,000 kWh/yr.",
      },
    },
    payback: {
      yearsNoSubsidy: 8,
      yearsWithSubsidy30: 3.1,
      afterPaybackSaving: 37,
      subsidyRate: 0.3,
    },
    contractors: ADDON_CONTRACTORS,
  },
};

/* Active scenario — switched from the profile screen before the demo starts. */
let SCENARIO = SCENARIOS.full;
let PERSONA = SCENARIO.persona;
let SIZING = SCENARIO.sizing;
let CONTRACTORS = SCENARIO.contractors;
let PAYBACK = SCENARIO.payback;

function setScenario(id) {
  SCENARIO = SCENARIOS[id] || SCENARIOS.full;
  PERSONA = SCENARIO.persona;
  SIZING = SCENARIO.sizing;
  CONTRACTORS = SCENARIO.contractors;
  PAYBACK = SCENARIO.payback;
}

const contractorById = (id) => CONTRACTORS.find((c) => c.id === id) || CONTRACTORS[0];
const lenderById = (id) => LENDERS.find((x) => x.id === id) || LENDERS[0];

function instalment(price, years, rate) {
  const r = rate / 12;
  const n = years * 12;
  return (price * r) / (1 - Math.pow(1 + r, -n));
}

/* billAfter is the net electricity line from the case table (€39 full / €53 add-on).
   Export and flexibility annuals are informational; they are already inside billAfter. */
function quote(contractorId, lenderId) {
  const c = contractorById(contractorId);
  const lender = lenderById(lenderId);
  const loan = instalment(c.price, LOAN_YEARS, lender.rate);
  const monthly = c.billAfter + loan;
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
    exportAnnual: c.exportAnnual,
    flexAnnual: c.flexAnnual,
    purchasedElectricity: c.purchasedElectricity,
  };
}

function upfrontQuote(contractorId) {
  const c = contractorById(contractorId);
  const monthly = c.billAfter;
  const monthlySaving = PERSONA.currentMonthlyCost - monthly;
  return {
    contractor: c,
    upfront: c.price,
    loan: 0,
    monthly,
    monthlySaving,
    annualBenefit: monthlySaving * 12,
    years: 0,
    lender: null,
    exportAnnual: c.exportAnnual,
    flexAnnual: c.flexAnnual,
    purchasedElectricity: c.purchasedElectricity,
    payback: PAYBACK,
  };
}

function rankedQuotes(lenderId) {
  return CONTRACTORS.map((c) => quote(c.id, lenderId)).sort((a, b) => a.monthly - b.monthly);
}

function bestQuote(lenderId) {
  return rankedQuotes(lenderId)[0];
}

function bestUpfrontQuote() {
  return CONTRACTORS.map((c) => upfrontQuote(c.id)).sort((a, b) => a.monthly - b.monthly)[0];
}

const MONTH = {
  label: { lt: "2027 m. kovas", en: "March 2027" },
  kwhSupplied: 580,
  nightsCharged: 26,
  nightsTotal: 31,
  dispatchEvents: 11,
  reserveTouched: 0,
  outages: 1,
  outageDetail: {
    lt: "Kovo 14 d., 19:42, 34 minutės",
    en: "14 March, 19:42, 34 minutes",
  },
  flexGross: 4,
  previousMonth: {
    label: { lt: "sausį", en: "in January" },
    earned: 1,
  },
};
