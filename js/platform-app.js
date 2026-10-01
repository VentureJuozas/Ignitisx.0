/* Screens and interaction for the platform demo — contractor variant.
   Eleven screens, Lithuanian by default. No presenter layer: every string here
   is something the customer would see. */

const state = {
  i: 0,
  consent: false,
  contractor: null,
  years: 10,
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

/* The same four-tile hardware strip as the household mockup: what is in the box,
   visible without reading. */
function kitStrip(c) {
  const items = [
    { icon: "solar", short: t({ lt: "Saulė", en: "Solar" }), cap: `${NUM(c.pv)} kW`, state: "in" },
    { icon: "bess", short: t({ lt: "Kaupiklis", en: "Battery" }), cap: `${NUM(c.battery)} kWh`, state: "in" },
    { icon: "water", short: t({ lt: "Vanduo", en: "Water" }), cap: t({ lt: "Perstumta", en: "Shifted" }), state: "in" },
    { icon: "ev", short: t({ lt: "Elektromobilis", en: "EV" }), cap: t({ lt: "Paruošta", en: "Ready" }), state: "later" },
  ];
  return `<div class="kit">` + items.map((k) => `
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

const contractorLogo = (c, cls = "brandlogo contractor") => brandLogo(c.logo, c.name, cls);
const partnerLogo = (termOrPartner, cls = "brandlogo partner") => {
  if (!termOrPartner) return "";
  if (termOrPartner.logo) return brandLogo(termOrPartner.logo, termOrPartner.name, cls);
  return brandLogo(termOrPartner.partnerLogo, termOrPartner.partner, cls);
};

const partnerStrip = (cls = "partnerstrip") =>
  `<div class="${cls}" aria-label="${t({ lt: "Finansavimo partneriai", en: "Financing partners" })}">` +
  PARTNERS.map((p) => brandLogo(p.logo, p.name, "brandlogo partner strip")).join("") +
  `</div>`;

const contractorStrip = (cls = "contractorstrip") =>
  `<div class="${cls}" aria-label="${t({ lt: "Rangovai", en: "Contractors" })}">` +
  CONTRACTORS.map((c) => brandLogo(c.logo, c.name, "brandlogo contractor strip")).join("") +
  `</div>`;

/* Where the monthly figure comes from. Four lines and a total, recalculated on
   every contractor and term change. */
function breakdown(q) {
  const c = q.contractor;
  const rows = [
    [t({ lt: "Elektra ir tinklo mokesčiai", en: "Electricity and network charges" }),
     t({ lt: "Po saulės elektrinės ir kaupiklio įrengimo", en: "After the array and battery are in" }),
     c.billAfter, false],
    [t({ lt: `Paskolos įmoka · ${q.term.partner}`, en: `Loan instalment · ${q.term.partner}` }),
     t({ lt: `${q.term.years} ${YEARS(q.term.years)}, ${NUM(q.term.rate * 100, 1)} % metinės palūkanos, 0 € pradinis įnašas`,
        en: `${q.term.years} years at ${NUM(q.term.rate * 100, 1)}%, zero upfront` }),
     q.loan, false],
    [t({ lt: "Pajamos už atiduotą elektrą", en: "Income from exported electricity" }),
     t({ lt: "Tai, ko namai nesuvartoja ir kaupiklis nesukaupia", en: "What the house and battery cannot absorb" }),
     -c.exportIncome, true],
    [t({ lt: "Garantuota lankstumo garantija", en: "Guaranteed flexibility floor" }),
     t({ lt: "Minimumas, kurį Ignitis sumoka už kaupiklio valdymą. Uždirbus daugiau, skirtumas dalijamas pusiau",
        en: "The minimum Ignitis pays for control of the battery. Anything above it is split evenly" }),
     -c.flexFloor, true],
  ];

  return `<div class="card stack">
    <h3>${t({ lt: "Iš ko susideda mėnesio suma", en: "What the monthly figure is made of" })}</h3>
    <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">
      ${c.name} · ${q.term.years} ${t({ lt: "metų terminas", en: "year term" })}.
      ${t({ lt: "Perskaičiuojama iškart.", en: "Recalculated live." })}
    </p>
    ${rows.map(([l, basis, v, credit]) => `
      <div class="brk"><div class="l">${l}<em>${basis}</em></div>
      <div class="v mono" ${credit ? 'style="color:var(--ok)"' : ""}>${v < 0 ? "−" : ""}${EUR(Math.abs(v), 2)}</div></div>`).join("")}
    <div class="brk total"><div class="l">${t({ lt: "Iš viso per mėnesį", en: "Total per month" })}
      <em>${t({ lt: `Šiandien jis moka ${EUR(PERSONA.currentMonthlyCost)}`, en: `He pays ${EUR(PERSONA.currentMonthlyCost)} today` })}</em></div>
      <div class="v mono">${EUR(q.monthly, 2)}</div></div>
    <p style="font-size:12px;color:var(--navy-45);margin-top:14px">
      ${t({
        lt: "Visi skaičiai ilustratyvūs. Lankstumo garantija yra sutartinis minimumas, o ne rinkos prognozė — BBCM galios kainos nėra skelbiamos.",
        en: "All figures illustrative. The flexibility floor is a contractual minimum, not a market forecast — BBCM capacity prices are not published.",
      })}
    </p>
  </div>`;
}

/* ---------- screens ---------- */

const SCREENS = [

{ /* 0 — persona */
  id: "profilis",
  label: { lt: "Profilis", en: "Profile" },
  next: { lt: "Pradėti demonstraciją", en: "Start the demo" },
  role: { lt: "Sesijos kontekstas", en: "Session context" },
  foot: { lt: "Perskaitykite namų ūkį prieš pradedant. Visi tolesni skaičiai išvedami iš jo.",
          en: "Read the household out before starting. Every later number derives from it." },
  agent: [{ lt: "Prieš demonstraciją — namų ūkis, kuriam viskas sukurta. Visi tolesni ekranai rodomi lygiai taip, kaip juos matytų klientas. Šis ekranas — vienintelis, kurio klientas niekada nemato.",
            en: "Before the demo, meet the household it is built around. Everything after this is shown exactly as the customer would see it. This screen is the only one he never sees." }],
  asks: [
    [{ lt: "Kodėl būtent šis namų ūkis?", en: "Why this household?" },
     { lt: "Nes jam trukdo ne atsipirkimas, o pradinis įnašas. Šilumos siurblys jau yra, vartojimas didelis, stogas tinkamas — bet 9 500 € jis neturi. Paimkite namų ūkį su santaupomis ir demonstruosite nuolaidą, o ne platformą.",
       en: "Because what blocks him is the upfront cost, not the payback. The heat pump is already there, consumption is high, the roof works — he simply does not have €9,500. Pick a household with savings and you demo a discount, not a platform." }],
    [{ lt: "Kiek tokių namų ūkių?", en: "How many households look like this?" },
     { lt: "Šilumos siurblys plius elektrinis vandens šildymas plius jokios saulės elektrinės — tai didelė ir iš DataHub duomenų atpažįstama dalis. Būtent šie namų ūkiai turi didžiausią vartojimą ir mažiausiai kapitalo.",
       en: "A heat pump plus electric water heating plus no solar is a large slice, and one we can identify from DataHub without asking anyone a question. These households have the highest consumption and the least capital." }],
    [{ lt: "Kodėl svarbu, kad jis neturi saulės elektrinės?", en: "Why does it matter that he has no solar?" },
     { lt: "Nes tada rangovas parduoda visą komplektą, o ne papildymą. Ignitis gauna kaupiklį į portfelį, klientas gauna visą sprendimą, o finansavimo partneris — vieną sutartį, o ne dvi.",
       en: "Because the contractor then sells a whole system rather than an add-on. Ignitis gets a battery into the portfolio, the customer gets a complete solution, and the lender writes one agreement instead of two." }],
  ],
  render: () => {
    const facts = [
      ["chart", t({ lt: "10 000 kWh/metus", en: "10,000 kWh/yr" }),
        t({ lt: "Visas namų ūkio vartojimas", en: "Total household consumption" }), false],
      ["heat", t({ lt: "Šilumos siurblys oras–vanduo", en: "Air-to-water heat pump" }),
        t({ lt: `Įrengtas ${PERSONA.heatPumpYear} m. — didžiausia vartojimo dalis`, en: `Installed ${PERSONA.heatPumpYear} — the largest single load` }), false],
      ["water", t({ lt: "Elektrinis vandens šildymas", en: "Electric water heating" }),
        t({ lt: "~2 000 kWh/metus, veikia vakariniame pike", en: "~2,000 kWh/yr, runs in the evening peak" }), false],
      ["solar", t({ lt: "Saulės elektrinės nėra", en: "No solar array" }),
        t({ lt: "Stogas tinkamas, bet neįrengta nieko", en: "The roof works, nothing is installed" }), true],
      ["bess", t({ lt: "Kaupiklio nėra", en: "No battery" }),
        t({ lt: "Nėra kuo kaupti ar perstumti vartojimo", en: "Nothing on site can store or shift" }), true],
      ["ev", t({ lt: "Elektromobilio nėra", en: "No EV" }),
        t({ lt: "Kol kas neplanuoja", en: "Not planning one yet" }), true],
    ].map(([ic, b, s, none]) => `
      <div class="factcell ${none ? "none" : ""}">
        <span class="ic2">${icon(ic)}</span>
        <div><b>${b}</b><span>${s}</span></div>
      </div>`).join("");

    return `
      <div class="eyebrow">${t({ lt: "Prieš pradedant", en: "Before we begin" })}</div>
      <h1>${t({ lt: "Namų ūkis, kuriam tai sukurta", en: "The household this is built for" })}</h1>
      <p class="lede">${t({
        lt: "Vienas personažas, nuosekliai pernešamas per kiekvieną ekraną ir kiekvieną skaičių.",
        en: "One persona, carried consistently through every screen and every number." })}</p>
      <div class="card stack">
        <div class="pcard">
          <div class="pavatar"><img src="assets/ignitis-mark.png" alt=""></div>
          <div>
            <h2>${PERSONA.name}, ${PERSONA.age}</h2>
            <div class="sub">${t(PERSONA.place)} · ${t(PERSONA.household)}</div>
          </div>
        </div>
        <div class="factgrid">${facts}</div>
      </div>
      <div class="callout" style="margin-top:14px">
        <b>${t({ lt: "Jam trukdo ne atsipirkimas, o pradinis įnašas.", en: "What blocks him is the upfront cost, not the payback." })}</b>
        ${t({
          lt: `Dariaus santaupos — apie ${EUR(PERSONA.savings)}. Sistema kainuoja apie ${EUR(9500)}. Jis puikiai supranta, kad per dešimt metų tai atsipirktų; problema ta, kad pradėti jis negali. Platforma keičia būtent šį vieną dalyką.`,
          en: `His savings are around ${EUR(PERSONA.savings)}. The system costs about ${EUR(9500)}. He understands perfectly well that it would pay back over ten years; the problem is that he cannot start. The platform changes exactly this one thing.` })}
      </div>`;
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
    { lt: "Sveiki, Dariau. Jūs jau esate Ignitis klientas, todėl galiu pasakyti konkrečiai: saulės elektrinę su kaupikliu galite įrengti nesumokėję nė euro.",
      en: "Hello Darius. You are already an Ignitis customer, so I can be specific: you can have solar with a battery installed without paying a single euro upfront." },
    { lt: "Už įrangą sumoka finansavimo partneris. Įrengia Jūsų pasirinktas rangovas. Mes tvarkome viską viena sąskaita.",
      en: "A financing partner pays for the equipment. A contractor you choose installs it. We settle all of it on one invoice." },
  ],
  asks: [
    [{ lt: "Kur čia paslėptas mokestis?", en: "Where is the catch?" },
     { lt: "Nėra paslėpto mokesčio, bet yra sąlyga: kaupiklį valdome mes. Apie tai bus atskiras ekranas su konkrečia suma. Jei to nesutinkate, platformos pasiūlymo tiesiog nėra.",
       en: "There is no hidden fee, but there is a condition: we control the battery. It gets its own screen with a specific number attached. If you decline it, the platform offer simply does not exist." }],
    [{ lt: "Kam priklauso įranga?", en: "Who owns the equipment?" },
     { lt: "Jums. Nuo pirmos dienos. Ne Ignitis, ne rangovui, ne bankui — bankui priklauso paskola, o ne kaupiklis. Todėl ir valstybės parama atitenka Jums, o ne mums.",
       en: "You do, from day one. Not Ignitis, not the contractor, not the lender — the lender holds the loan, not the battery. That is also why any state support goes to you rather than to us." }],
    [{ lt: "O jei nieko nedarysiu?", en: "What if I do nothing?" },
     { lt: `Mokėsite apie ${EUR(PERSONA.currentMonthlyCost)} per mėnesį ir toliau, o šilumos siurblys kasmet suvartos tiek pat. Tai ir yra sąžiningas palyginimas — ne mėnesinė įmoka prieš nulį.`,
       en: `You keep paying around ${EUR(PERSONA.currentMonthlyCost)} a month, and the heat pump keeps consuming the same. That is the honest comparison — not the instalment against zero.` }],
  ],
  render: () => {
    const best = bestQuote(state.years);
    const roles = [
      ["hardhat", t({ lt: "Rangovas", en: "Contractor" }),
        t({ lt: "Parduoda ir įrengia", en: "Supplies and installs" }),
        t({ lt: "Jūs pasirenkate iš platformoje patikrintų rangovų. Įranga, montavimas ir servisas — viename pasiūlyme, su viena garantija.",
            en: "You choose from vetted contractors on the platform. Equipment, installation and service in one bundle, under one warranty." }),
        contractorStrip()],
      ["card", t({ lt: "Finansavimo partneris", en: "Financing partner" }),
        t({ lt: "Sumoka už įrangą", en: "Pays for the equipment" }),
        t({ lt: `Vartojimo kreditas pardavimo vietoje: 5, 10 arba 15 metų, 0 € pradinis įnašas. Platforma palygina ${PARTNER_COUNT} partnerių pasiūlymus.`,
            en: `A point-of-sale consumer loan over 5, 10 or 15 years with nothing upfront. The platform compares offers from ${PARTNER_COUNT} partners.` }),
        partnerStrip()],
      ["bolt", "Ignitis", t({ lt: "Valdo ir atsiskaito", en: "Operates and settles" }),
        t({ lt: "Mes valdome kaupiklį, tiekiame elektrą ir viską sudedame į vieną sąskaitą. Už valdymą mokame garantuotą minimumą kiekvieną mėnesį.",
            en: "We operate the battery, supply the electricity and put all of it on one invoice. We pay a guaranteed minimum every month for the control." }),
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
        <h1>${t({ lt: "Saulės elektrinė ir kaupiklis. Be pradinio įnašo.", en: "Solar and a battery. Nothing upfront." })}</h1>
        <p class="lede">${t({
          lt: "Jūs nieko nemokate šiandien, o įranga nuo pirmos dienos yra Jūsų. Mėnesio suma būna mažesnė nei dabartinė sąskaita.",
          en: "You pay nothing today, and the equipment is yours from day one. The monthly figure comes in below your current bill." })}</p>
        <div class="bigfig">
          <div><span>${t({ lt: "Sumokate šiandien", en: "Due today" })}</span><b class="mono">${EUR(0)}</b>
            <em>${t({ lt: "Jokio pradinio įnašo, jokio užstato", en: "No deposit, no upfront payment" })}</em></div>
          <div><span>${t({ lt: "Mėnesio suma", en: "Monthly" })}</span><b class="mono">${t({ lt: "nuo", en: "from" })} ${EUR(best.monthly)}</b>
            <em>${t({ lt: `šiandien mokate ${EUR(PERSONA.currentMonthlyCost)}`, en: `you pay ${EUR(PERSONA.currentMonthlyCost)} today` })}</em></div>
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

{ /* 2 — data consent */
  id: "sutikimas",
  label: { lt: "Sutikimas", en: "Consent" },
  next: { lt: "Leidžiu ir tęsiu", en: "Allow and continue" },
  role: { lt: "Skaitau Jūsų duomenis", en: "Reading your data" },
  foot: { lt: "Tikras barjeras. Be jo kiekvienas rangovas turėtų atvykti į objektą prieš pasiūlymą.",
          en: "A real gate. Without it every contractor would need a site visit before quoting." },
  agent: [{ lt: "Kad rangovai galėtų pasiūlyti konkrečią sistemą, o ne vidutinį paketą, man reikia Jūsų leidimo perskaityti skaitiklio duomenis iš DataHub. Šito apeiti negaliu.",
            en: "For the contractors to quote a specific system rather than an average package, I need your permission to read your metering data from DataHub. I cannot work around this one." }],
  asks: [
    [{ lt: "Ką būtent perskaitote?", en: "What exactly do you read?" },
     { lt: "Vartojimą ir atidavimą 15 minučių intervalais per pastaruosius 24 mėnesius, dabartinį planą ir tinklo zoną. Ne vardą, ne adresų istoriją, ne kitų paslaugų duomenis.",
       en: "Consumption and export in 15-minute intervals for the last 24 months, your current tariff and your network zone. Not your name, address history or anything from other utilities." }],
    [{ lt: "Ar rangovai pamatys mano duomenis?", en: "Will the contractors see my data?" },
     { lt: "Ne. Jie gauna tik reikalingą sistemos dydį ir objekto tipą. Pats vartojimo profilis lieka platformoje — tai ir yra skirtumas tarp platformos ir skelbimų lentos.",
       en: "No. They receive the required system size and the property type, nothing more. The consumption profile stays on the platform — that is the difference between a platform and a noticeboard." }],
    [{ lt: "Ar galiu atšaukti?", en: "Can I withdraw it?" },
     { lt: "Vienu paspaudimu, bet kada. Tada nutrūksta personalizavimas. Jei iki to jau būsite įrengę sistemą, įranga ir paskola lieka Jūsų — tai atskiros sutartys.",
       en: "In one click, at any time. Personalisation then stops. If you have already had a system installed, the equipment and the loan remain yours — those are separate agreements." }],
  ],
  can: () => state.consent,
  render: () => `
    <div class="eyebrow">${t({ lt: "Vienas leidimas", en: "One permission" })}</div>
    <h1>${t({ lt: "Ar galiu perskaityti Jūsų skaitiklį?", en: "May I read your meter?" })}</h1>
    <p class="lede">${t({
      lt: "Viskas po šio ekrano apskaičiuota iš tikrų Jūsų duomenų, o ne iš anketos. Būtent todėl rangovų pasiūlymai bus konkretūs.",
      en: "Everything after this screen is computed from your actual data rather than a questionnaire. That is what makes the contractor quotes specific." })}</p>
    <div class="card stack">
      <div class="toggle-row" style="border-top:0">
        <span><strong>${t({ lt: "Leidžiu perskaityti skaitiklio duomenis iš DataHub", en: "Read my metering data from DataHub" })}</strong><br>
          <span style="font-size:13px;color:var(--navy-45)">${t({
            lt: "24 mėnesiai 15 minučių vartojimo ir atidavimo duomenų, planas ir tinklo zona.",
            en: "24 months of 15-minute consumption and export data, plus tariff and network zone." })}</span></span>
        <button class="switch ${state.consent ? "on" : ""}" data-toggle="consent" aria-pressed="${state.consent}"></button>
      </div>
      <p style="font-size:13px;color:var(--navy-45);margin-top:14px">${t({
        lt: "Duomenų neparduodame. Rangovams perduodame tik reikalingą sistemos dydį, ne vartojimo profilį.",
        en: "We do not sell this data. Contractors receive only the required system size, never the consumption profile." })}</p>
    </div>
    <div class="callout">
      <b>${t({ lt: "Be šio sutikimo platforma neturi ką pasiūlyti.", en: "Without this consent the platform has nothing to offer." })}</b>
      ${t({
        lt: "Kiekvienas rangovas turėtų atvykti į objektą prieš bet kokią kainą, o Jūs lygintumėte keturis skirtingus apsilankymus per keturias savaites. Duomenys tai sutraukia į vieną ekraną.",
        en: "Every contractor would have to visit before naming a price, and you would be comparing four separate visits across four weeks. The data collapses that into one screen." })}
    </div>`,
},

{ /* 3 — contractor marketplace */
  id: "rangovai",
  label: { lt: "Rangovai", en: "Contractors" },
  next: { lt: "Pasirinkti šį rangovą", en: "Choose this contractor" },
  role: { lt: "Lyginu rangovų pasiūlymus", en: "Comparing contractor quotes" },
  wide: true,
  foot: { lt: "Kiekvienas rangovas siūlo savo įrangą. Platforma suvienodina tik du skaičius.",
          en: "Each contractor quotes its own hardware. The platform normalises just two figures." },
  agent: [
    { lt: "Pagal Jūsų duomenis keturi platformos rangovai pateikė pasiūlymus. Įranga visų skirtinga, todėl lyginti galiu tik tuo, kas Jums tikrai svarbu: mėnesio suma ir metinė nauda.",
      en: "Four contractors on the platform have quoted against your data. The hardware differs in every case, so I can only compare them on what matters to you: the monthly figure and the annual benefit." },
    { lt: "Atkreipkite dėmesį: pigiausia įranga nėra pigiausias mėnuo. Didesnis kaupiklis uždirba didesnę lankstumo garantiją.",
      en: "Worth noticing: the cheapest hardware is not the cheapest month. A bigger battery earns a bigger flexibility floor." },
  ],
  asks: [
    [{ lt: "Kodėl pigiausia įranga nėra geriausias pasirinkimas?", en: "Why isn't the cheapest hardware the best deal?" },
     { lt: "Nes mėnesio sumą sudaro keturios dalys, o ne viena. Mažesnis kaupiklis reiškia mažesnę lankstumo garantiją ir didesnę elektros sąskaitą, todėl mažesnė paskolos įmoka to nekompensuoja.",
       en: "Because the monthly figure has four parts, not one. A smaller battery means a smaller flexibility floor and a larger electricity bill, so the lower instalment does not make up the difference." }],
    [{ lt: "Kaip atrenkate rangovus?", en: "How are the contractors vetted?" },
     { lt: "Į platformą priimame tik turinčius reikiamas atestacijas, bent dvejų metų montavimo garantiją ir sutartą reakcijos laiką. Reitingas — iš mūsų klientų, ne iš interneto.",
       en: "Only firms with the required certification, at least a two-year installation warranty and a contracted response time get on the platform. The rating comes from our own customers, not from the internet." }],
    [{ lt: "Kas bus, jei rangovas bankrutuos?", en: "What if the contractor goes under?" },
     { lt: "Įrangos garantija lieka gamintojo, o montavimo garantiją perimame mes ir perduodame kitam platformos rangovui. Tai vienintelė vieta, kur Ignitis prisiima riziką be maržos.",
       en: "The equipment warranty stays with the manufacturer, and we take over the installation warranty and reassign it to another contractor on the platform. It is the one place where Ignitis carries risk without margin." }],
  ],
  can: () => Boolean(state.contractor),
  render: () => {
    const ranked = rankedQuotes(state.years);
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
        [t({ lt: "Kaupiklis", en: "Battery" }), `${NUM(c.battery, 0)} kWh`],
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
        <div class="honest">${t(c.honest)}</div>
      </button>`;
    }).join("");

    return `
      <div class="eyebrow">${t({ lt: "Keturi pasiūlymai pagal Jūsų duomenis", en: "Four quotes against your data" })}</div>
      <h1>${t({ lt: "Pasirinkite rangovą", en: "Choose your contractor" })}</h1>
      <p class="lede">${t({
        lt: "Kiekvienas rangovas pasiūlė savo įrangą, todėl komplektai nėra vienodi. Suvienodinome tik tai, ką galima palyginti: kiek išeina iš namų kiekvieną mėnesį.",
        en: "Each contractor quoted its own hardware, so the bundles are not identical. We normalised the only thing that can be compared: what leaves the household each month." })}</p>

      <div class="sizing stack">
        <div>
          <div class="eyebrow" style="margin-bottom:4px">${t({ lt: "Pagal Jūsų duomenis", en: "From your data" })}</div>
          <div class="sz mono">${NUM(SIZING.pv, 0)} kW · ${NUM(SIZING.inverter, 0)} kW · ${NUM(SIZING.battery, 0)} kWh</div>
        </div>
        <p>${t(SIZING.basis)}. ${t({
          lt: "Rangovai siūlo apie šį dydį, bet ne lygiai jį — tai jų įranga ir jų sprendimas.",
          en: "Contractors quote around this, not to it — it is their equipment and their call." })}</p>
      </div>

      <div class="rangovai stack">${cards}</div>

      ${(() => {
        const cheap = ranked.find((q) => q.contractor.id === cheapestHardware);
        const best = ranked[0];
        const place = ranked.indexOf(cheap) + 1;
        if (cheap === best) return "";
        return `<div class="callout">
          <b>${t({ lt: "Pigiausia įranga nėra pigiausias mėnuo.", en: "The cheapest hardware is not the cheapest month." })}</b>
          ${t({
            lt: `${cheap.contractor.name} siūlo pigiausią sistemą (${EUR(cheap.contractor.price)}), bet pagal mėnesio sumą yra ${place} vietoje iš ${ranked.length}: ${NUM(cheap.contractor.battery, 0)} kWh kaupiklis uždirba mažesnę lankstumo garantiją ir mažiau nuima nuo elektros sąskaitos, todėl mažesnė paskolos įmoka to neatsveria. Skaičiuota ${state.years} metų terminui — terminą pasirinksite kitame žingsnyje.`,
            en: `${cheap.contractor.name} quotes the cheapest system at ${EUR(cheap.contractor.price)}, but comes ${place} of ${ranked.length} on monthly cost: a ${NUM(cheap.contractor.battery, 0)} kWh battery earns a smaller flexibility floor and takes less off the electricity bill, so the lower instalment does not make up the difference. Calculated on a ${state.years}-year term — you choose the term on the next screen.` })}
        </div>`;
      })()}`;
  },
},

{ /* 4 — bundle and term */
  id: "pasiulymas",
  label: { lt: "Pasiūlymas", en: "Offer" },
  next: { lt: "Tęsti su šiuo terminu", en: "Continue with this term" },
  role: { lt: "Lyginu finansavimo pasiūlymus", en: "Comparing financing offers" },
  wide: true,
  foot: { lt: "Trys terminai, 0 € pradinis įnašas visuose. Platforma rodo geriausią partnerio pasiūlymą kiekvienam terminui.",
          en: "Three terms, zero upfront on all of them. The platform shows the best partner offer per term." },
  agent: [
    { lt: "Dabar terminas. Pradinis įnašas visais atvejais nulinis — skiriasi tik tai, per kiek laiko atiduodate paskolą ir kiek sumokate palūkanų.",
      en: "Now the term. The upfront payment is zero in every case — what changes is how long you repay over and how much interest you pay." },
  ],
  asks: [
    [{ lt: "Kodėl 5 metų terminas nuostolingas?", en: "Why is the 5-year term loss-making?" },
     { lt: "Nes mėnesio įmoka viršija dabartinę sąskaitą. Palūkanų sumokate mažiausiai, bet penkerius metus mokate daugiau nei dabar. Tai sąžininga tik tiems, kurie taupo visą sumą, o ne mėnesio pinigų srautą.",
       en: "Because the instalment exceeds the current bill. You pay the least interest, but for five years you pay more than you do now. That only works for someone optimising the total, not the monthly cash flow." }],
    [{ lt: "O 15 metų?", en: "What about 15 years?" },
     { lt: "Mažiausia mėnesio suma, bet terminas ilgesnis už kaupiklio garantiją. Paskutinius metus mokėsite už įrangą, kurios garantija jau pasibaigusi. Mes tai rodome, o ne nutyliame.",
       en: "The lowest monthly figure, but the term outlives the battery warranty. In the final years you would be paying for equipment whose warranty has expired. We show that rather than hide it." }],
    [{ lt: "Ar galiu grąžinti anksčiau?", en: "Can I repay early?" },
     { lt: "Taip, bet kada, be papildomų mokesčių — tai vartojimo kreditas. Lankstumo sutartis nuo paskolos nepriklauso ir tęsiasi toliau.",
       en: "Yes, at any time and without a fee — it is a consumer loan. The flexibility agreement is separate from the loan and continues regardless." }],
  ],
  render: () => {
    const q = quote(state.contractor, state.years);
    const c = q.contractor;

    const termCards = TERMS.map((term) => {
      const tq = quote(state.contractor, term.years);
      return `<button class="dcard ${state.years === term.years ? "sel" : ""}" data-years="${term.years}">
        <div class="dcardhead">
          ${partnerLogo(term, "brandlogo partner term")}
          <h3>${term.years} ${YEARS(term.years)}</h3>
        </div>
        <p>${t({ lt: `${term.partner} · ${NUM(term.rate * 100, 1)} % · ${EUR(0)} pradinis įnašas`,
                 en: `${term.partner} · ${NUM(term.rate * 100, 1)}% · ${EUR(0)} upfront` })}</p>
        <p style="margin-top:8px;font-size:12.5px;color:var(--navy-45)">${t(term.note)}</p>
        <div class="dprice">
          <b class="mono">${EUR(tq.monthly)}</b><span>/${t({ lt: "mėn.", en: "mo" })}</span>
          <div class="delta ${tq.monthlySaving >= 0 ? "down" : "up"}">
            ${tq.monthlySaving >= 0
              ? t({ lt: `${EUR(tq.monthlySaving)}/mėn. mažiau nei dabar`, en: `${EUR(tq.monthlySaving)}/mo less than now` })
              : t({ lt: `${EUR(Math.abs(tq.monthlySaving))}/mėn. daugiau nei dabar`, en: `${EUR(Math.abs(tq.monthlySaving))}/mo more than now` })}
          </div>
          <div style="font-size:12px;color:var(--navy-45);margin-top:4px">
            ${t({ lt: `įmoka ${EUR(tq.loan)} · palūkanų ${EUR(tq.interestPaid)}`,
                  en: `instalment ${EUR(tq.loan)} · interest ${EUR(tq.interestPaid)}` })}
          </div>
        </div>
      </button>`;
    }).join("");

    const warn = q.warrantyGapYears > 0 ? `
      <div class="honestpanel">
        <b>${t({ lt: `Terminas ${q.warrantyGapYears} metais ilgesnis už kaupiklio garantiją.`,
                 en: `The term outlives the battery warranty by ${q.warrantyGapYears} years.` })}</b>
        ${t({ lt: `${c.name} kaupikliui teikia ${c.warrantyBattery} metų garantiją, o paskolą mokėsite ${q.term.years} metus. Paskutinius ${q.warrantyGapYears} metus įranga bus Jūsų atsakomybė.`,
              en: `${c.name} warrants the battery for ${c.warrantyBattery} years and you would repay over ${q.term.years}. For the last ${q.warrantyGapYears} years the equipment is your responsibility.` })}
      </div>` : "";

    return `
      <div class="eyebrow">${t({ lt: "Pasirinktas rangovas", en: "Selected contractor" })}</div>
      <div class="selectedbrand">
        ${contractorLogo(c, "brandlogo contractor hero")}
        <h1>${c.name}</h1>
      </div>
      <p class="lede">${t({
        lt: "Įranga ir montavimas iš rangovo, pinigai iš finansavimo partnerio, atsiskaitymas per Ignitis. Pradinis įnašas — nulis visais terminais.",
        en: "Equipment and installation from the contractor, money from the financing partner, settlement through Ignitis. Zero upfront on every term." })}</p>

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
          <button class="linkbtn" data-goto="3">${t({ lt: "Keisti rangovą", en: "Change contractor" })}</button>
        </div>
        <div style="max-width:470px">${kitStrip(c)}</div>
      </div>

      <h3 class="stack">${t({ lt: "Pasirinkite paskolos terminą", en: "Choose your loan term" })}</h3>
      <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">
        ${t({ lt: `Platforma palygino ${PARTNER_COUNT} finansavimo partnerių pasiūlymus ir kiekvienam terminui rodo geriausią.`,
              en: `The platform compared offers from ${PARTNER_COUNT} financing partners and shows the best one per term.` })}</p>
      <div class="dispatch">${termCards}</div>
      ${warn}
      ${breakdown(q)}`;
  },
},

{ /* 5 — the mandatory dispatch gate */
  id: "lankstumas",
  label: { lt: "Lankstumas", en: "Flexibility" },
  next: { lt: "Sutinku ir tęsiu", en: "Agree and continue" },
  role: { lt: "Paaiškinu valdymo sąlygą", en: "Explaining the control condition" },
  foot: { lt: "Sąlyga, be kurios platformos pasiūlymo nėra. Garantuotas minimumas turi konkrečią sumą.",
          en: "The condition the platform offer does not exist without. The guaranteed minimum has a number." },
  agent: [
    { lt: "Čia ta vieta, kurią dauguma pasiūlymų paslepia. Už tai, kad galime valdyti Jūsų kaupiklį, mokame garantuotą sumą kiekvieną mėnesį — ir būtent ji mėnesio sumą nuleidžia žemiau dabartinės sąskaitos.",
      en: "This is the part most offers hide. In exchange for being able to operate your battery we pay a guaranteed amount every month — and it is that payment which takes the monthly figure below your current bill." },
    { lt: "Tai nėra pasirenkama. Be valdymo platforma Jums neturi ko pasiūlyti, ir geriau tai pasakyti dabar nei po montavimo.",
      en: "It is not optional. Without control the platform has nothing to offer you, and it is better to say so now than after installation." },
  ],
  asks: [
    [{ lt: "Ką reiškia „valdome kaupiklį“?", en: "What does operating the battery mean?" },
     { lt: `Mes sprendžiame, kada jis kraunasi ir kada iškrauna, pagal tinklo zonas ir rinkos kainas. Jums visada lieka ${FLEX.reserveKwh} kWh rezervas, kurio nejudiname — tai apie ${FLEX.reserveHours} valandas šaldytuvo, apšvietimo, katilo ir interneto.`,
       en: `We decide when it charges and discharges, based on network zones and market prices. You always keep a ${FLEX.reserveKwh} kWh reserve we never touch — roughly ${FLEX.reserveHours} hours of fridge, lights, boiler and router.` }],
    [{ lt: "Kodėl tai privaloma?", en: "Why is it mandatory?" },
     { lt: "Nes būtent iš valdymo mes ir uždirbame. Įrangos maržos negauname, paskolos neišduodame. Jei kaupiklio nevaldome, platformoje mums nelieka jokio pagrindo Jums ką nors subsidijuoti.",
       en: "Because control is the only thing we earn from. We take no hardware margin and we issue no loan. If we do not operate the battery, there is nothing on the platform for us to subsidise you with." }],
    [{ lt: "Ar pajusiu, kai juo naudojatės?", en: "Will I notice when you use it?" },
     { lt: "Namuose neturėtumėte. Programėlėje kitą rytą pamatysite, kada jis veikė ir kiek uždirbo. Jei pajutote — tai gedimas, ir to mėnesio garantija vis tiek sumokama.",
       en: "You should not feel it in the house. The next morning the app shows when it ran and what it earned. If you did feel it, that is a fault, and the month's floor is paid anyway." }],
  ],
  can: () => state.dispatch === "yes",
  render: () => {
    const q = quote(state.contractor, state.years);
    const c = q.contractor;
    const withoutFlex = q.monthly + c.flexFloor;

    const choices = [
      ["yes", t({ lt: "Sutinku su kaupiklio valdymu", en: "I agree to battery control" }),
        t({ lt: `Ignitis valdo įkrovimą ir iškrovimą, Jums lieka ${FLEX.reserveKwh} kWh rezervas. Garantuota ${EUR(c.flexFloor)}/mėn., o uždirbus daugiau — skirtumas pusiau.`,
            en: `Ignitis controls charge and discharge, you keep a ${FLEX.reserveKwh} kWh reserve. ${EUR(c.flexFloor)}/month guaranteed, with anything above it split evenly.` })],
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
          lt: `Tai ne bauda ir ne nuolaidos atšaukimas. Mes negauname įrangos maržos ir neišduodame paskolos, todėl valdymas yra vienintelis dalykas, iš kurio uždirbame. Be jo Jūsų mėnesio suma būtų ${EUR(withoutFlex)} vietoje ${EUR(q.monthly)}, o finansavimo partneris vertintų Jus be mūsų garantijos.`,
          en: `This is not a penalty or a withdrawn discount. We take no hardware margin and issue no loan, so control is the only thing we earn from. Without it your monthly figure would be ${EUR(withoutFlex)} instead of ${EUR(q.monthly)}, and the financing partner would assess you without our guarantee.` })}</p>
        <p style="margin-bottom:0">${t({
          lt: "Jūsų alternatyva lieka visiškai atvira: tą pačią sistemą galite įsigyti rinkos kaina patys, susirasti finansavimą savarankiškai ir valdyti kaupiklį taip, kaip norite. Mes to nelaikome nei klaida, nei blogesniu pasirinkimu.",
          en: "Your alternative stays entirely open: buy the same system at market price yourself, arrange your own financing, and operate the battery however you like. We do not treat that as a mistake or as the worse choice." })}</p>
      </div>` : "";

    return `
      <div class="eyebrow">${t({ lt: "Sąlyga, ne priedas", en: "A condition, not an extra" })}</div>
      <h1>${t({ lt: "Kaupiklį valdome mes", en: "We operate the battery" })}</h1>
      <p class="lede">${t({
        lt: "Įranga Jūsų, bet sprendimą, kada ji kraunasi, priimame mes. Už tai mokame garantuotą sumą kiekvieną mėnesį, neatsižvelgiant į tai, kiek uždirbome rinkoje.",
        en: "The equipment is yours, but we decide when it charges. For that we pay a guaranteed amount every month, regardless of what we earned in the market." })}</p>

      <div class="callout">
        <b class="mono">${EUR(c.flexFloor)}/${t({ lt: "mėn.", en: "mo" })} · ${EUR(q.flexFloorYear)}/${t({ lt: "metus", en: "yr" })}</b>
        ${t({
          lt: `Garantuotas minimumas už ${NUM(c.battery, 0)} kWh kaupiklio valdymą. Jei per mėnesį rinkoje uždirbame daugiau, nei sudaro šis minimumas, skirtumą dalijamės pusiau. Jei uždirbame mažiau arba nieko — minimumas vis tiek įskaitomas į sąskaitą.`,
          en: `The guaranteed minimum for control of a ${NUM(c.battery, 0)} kWh battery. If we earn more than the minimum in a given month, we split the difference evenly. If we earn less, or nothing, the minimum is credited anyway.` })}
      </div>

      <div class="choices stack">${choices}</div>
      ${deadend}

      <div class="honestpanel">
        <b>${t({ lt: "Ko ši sutartis Jums neuždeda", en: "What this agreement does not do to you" })}</b>
        ${t({
          lt: `Įranga yra Jūsų nuo pirmos dienos, ir elektros tiekėjo pasirinkimo neužrakiname — galite išeiti. Bet platforma veikia tik Ignitis klientams, todėl išėję iš tiekimo prarasite ir optimizavimą, ir ${EUR(c.flexFloor)} mėnesinę garantiją. Kaupiklis ir paskola liks Jūsų: toliau kaupsite saulę sau, tik be rinkos pajamų.`,
          en: `The equipment is yours from day one and we do not lock your choice of supplier — you can leave. But the platform only serves Ignitis customers, so leaving supply ends both the optimisation and the ${EUR(c.flexFloor)} monthly guarantee. The battery and the loan stay yours: you keep storing your own solar, just without the market income.` })}
      </div>`;
  },
},

{ /* 6 — credit application */
  id: "paraiska",
  label: { lt: "Paraiška", en: "Application" },
  next: { lt: "Pateikti paraišką", en: "Submit the application" },
  role: { lt: "Rengiu paraišką partneriui", en: "Preparing the application" },
  foot: { lt: "Paraišką vertina finansavimo partneris, ne Ignitis. Formą užpildo mygtukas — demonstracijoje niekas nerašo ranka.",
          en: "The financing partner assesses this, not Ignitis. A button fills the form — nobody types in a live demo." },
  agent: [
    { lt: "Paskutinis žingsnis prieš sprendimą. Šiuos duomenis vertina finansavimo partneris — Ignitis jų nemato ir sprendimo nepriima.",
      en: "Last step before the decision. The financing partner assesses this data — Ignitis does not see it and does not make the decision." },
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
    const q = quote(state.contractor, state.years);
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
        `${EUR(q.contractor.price)} · ${q.term.years} ${YEARS(q.term.years)} · ${EUR(0)} ${t({ lt: "pradinis įnašas", en: "upfront" })}`, true],
    ];

    return `
      <div class="eyebrow partnerline">
        ${partnerLogo(q.term, "brandlogo partner eyebrow")}
        <span>${t({ lt: `Vartojimo kreditas · ${q.term.partner}`, en: `Consumer credit · ${q.term.partner}` })}</span>
      </div>
      <h1>${t({ lt: "Paraiška finansavimui", en: "Financing application" })}</h1>
      <p class="lede">${t({
        lt: "Įrangos suma, terminas ir pradinis įnašas jau įrašyti iš Jūsų pasirinkimo. Lieka tik Jūsų duomenys.",
        en: "The amount, term and upfront payment are already filled in from your choices. Only your own details are left." })}</p>

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
            ${partnerLogo(q.term, "brandlogo partner inline")}
            <span>${t({
              lt: `Duomenys perduodami partneriui „${q.term.partner}“, ne Ignitis. Mes matome tik sprendimą: taip arba ne.`,
              en: `The data goes to ${q.term.partner}, not to Ignitis. We see only the decision: yes or no.` })}</span>
          </span>
        </div>
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
     { lt: "Tada platforma pasiūlytų kitą partnerį arba ilgesnį terminą, o ne uždarytų langą. Šiame makete tos atšakos nėra — rodome tik patvirtinimą, ir tai sąmoningas supaprastinimas.",
       en: "The platform would offer another partner or a longer term rather than closing the window. That branch is not built in this mockup — we show approval only, and that is a deliberate simplification." }],
    [{ lt: "Ar galiu dar keisti rangovą?", en: "Can I still change contractor?" },
     { lt: "Suma patvirtinta konkrečiam rangovui, todėl pakeitus jį paraiška būtų vertinama iš naujo. Praktiškai tai dar dvi darbo dienos.",
       en: "The amount is approved against a specific contractor, so changing it means the application is assessed again. In practice that is another two working days." }],
    [{ lt: "Kada pradeda eiti palūkanos?", en: "When does interest start?" },
     { lt: "Nuo tos dienos, kai partneris sumoka rangovui, o tai įvyksta po montavimo priėmimo. Iki tol nemokate nieko.",
       en: "From the day the partner pays the contractor, which happens after the installation is signed off. Until then you pay nothing." }],
  ],
  render: () => {
    const q = quote(state.contractor, state.years);
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
        <h2>${EUR(q.contractor.price)} · ${q.term.years} ${YEARS(q.term.years)} · ${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}</h2>
        <div class="by partnerline">
          ${partnerLogo(q.term, "brandlogo partner inline")}
          <span>${t({
            lt: `${q.term.partner} · ${NUM(q.term.rate * 100, 1)} % metinės palūkanos · pradinis įnašas ${EUR(0)} · patvirtinta tokia suma, kokios prašyta`,
            en: `${q.term.partner} · ${NUM(q.term.rate * 100, 1)}% annual interest · ${EUR(0)} upfront · approved as requested` })}</span>
        </div>
      </div>

      <div class="card stack">
        <h3>${t({ lt: "Kas patvirtinta", en: "What was approved" })}</h3>
        <div class="brk" style="margin-top:10px">
          <div class="l">${t({ lt: "Finansuojama suma", en: "Amount financed" })}
            <em class="partyline">${contractorLogo(q.contractor, "brandlogo contractor mini")} ${q.contractor.name} · ${t(q.contractor.brands)}</em></div>
          <div class="v mono">${EUR(q.contractor.price)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Pradinis įnašas", en: "Upfront payment" })}
          <em>${t({ lt: "Nekeičiamas nė viename termine", en: "Unchanged on every term" })}</em></div>
          <div class="v mono">${EUR(0)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Mėnesio įmoka", en: "Monthly instalment" })}
          <em>${t({ lt: `${q.term.years} ${YEARS(q.term.years)} · ${NUM(q.term.rate * 100, 1)} %`, en: `${q.term.years} years · ${NUM(q.term.rate * 100, 1)}%` })}</em></div>
          <div class="v mono">${EUR(q.loan, 2)}</div></div>
        <div class="brk"><div class="l">${t({ lt: "Iš viso grąžinsite", en: "Total repayable" })}
          <em>${t({ lt: `iš jų palūkanų ${EUR(q.interestPaid)}`, en: `of which ${EUR(q.interestPaid)} interest` })}</em></div>
          <div class="v mono">${EUR(q.totalRepaid)}</div></div>
        <div class="brk total"><div class="l">${t({ lt: "Mėnesio suma su elektra ir lankstumu", en: "Monthly total with electricity and flexibility" })}
          <em>${t({ lt: `šiandien mokate ${EUR(PERSONA.currentMonthlyCost)}`, en: `you pay ${EUR(PERSONA.currentMonthlyCost)} today` })}</em></div>
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
    const q = quote(state.contractor, state.years);
    const c = q.contractor;

    const order = [
      [t({ lt: "Įranga ir montavimas", en: "Equipment and installation" }),
        `<span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name} · ${t(c.brands)}</span>`, EUR(c.price)],
      [t({ lt: "Sistema", en: "System" }), `${NUM(c.pv)} kW · ${NUM(c.inverter, 0)} kW · ${NUM(c.battery, 0)} kWh`, "—"],
      [t({ lt: "Finansavimas", en: "Financing" }),
        `<span class="partyline">${partnerLogo(q.term, "brandlogo partner mini")}${q.term.partner} · ${q.term.years} ${YEARS(q.term.years)} · ${NUM(q.term.rate * 100, 1)} %</span>`,
        `${EUR(q.loan, 2)}/${t({ lt: "mėn.", en: "mo" })}`],
      [t({ lt: "Lankstumo garantija", en: "Flexibility floor" }), t({ lt: "Ignitis · garantuotas minimumas", en: "Ignitis · guaranteed minimum" }), `−${EUR(c.flexFloor)}/${t({ lt: "mėn.", en: "mo" })}`],
    ].map(([k, s, v]) => `
      <div class="brk"><div class="l">${k}<em>${s}</em></div><div class="v mono">${v}</div></div>`).join("");

    const agreements = [
      [t({ lt: "Įrangos ir montavimo sutartis", en: "Equipment and installation contract" }),
       `<span class="partyline">${contractorLogo(c, "brandlogo contractor mini")}${c.name}</span>`,
       t({ lt: `Įranga, montavimas, priėmimas ir servisas. Garantijos: kaupiklis ${c.warrantyBattery} m., montavimas ${c.warrantyInstall} m.`,
           en: `Equipment, installation, sign-off and service. Warranties: battery ${c.warrantyBattery} years, installation ${c.warrantyInstall} years.` })],
      [t({ lt: "Vartojimo kredito sutartis", en: "Consumer credit agreement" }),
       `<span class="partyline">${partnerLogo(q.term, "brandlogo partner mini")}${q.term.partner}</span>`,
       t({ lt: `${EUR(c.price)}, ${q.term.years} ${YEARS(q.term.years)}, ${NUM(q.term.rate * 100, 1)} % metinės palūkanos, pradinis įnašas ${EUR(0)}. Atsisakymo teisė — 14 dienų.`,
           en: `${EUR(c.price)} over ${q.term.years} years at ${NUM(q.term.rate * 100, 1)}%, ${EUR(0)} upfront. Fourteen-day right of withdrawal.` })],
      [t({ lt: "Lankstumo ir elektros tiekimo sutartis", en: "Flexibility and supply agreement" }),
       `<span class="partyline"><img class="brandlogo ignitis mini" src="assets/ignitis-mark.png" alt="Ignitis">Ignitis</span>`,
       t({ lt: `Kaupiklio valdymas, ${EUR(c.flexFloor)}/mėn. garantuotas minimumas, pajamų dalis pusiau virš jo, ${FLEX.reserveKwh} kWh rezervas Jums.`,
           en: `Battery control, a ${EUR(c.flexFloor)}/month guaranteed minimum, an even split above it, and a ${FLEX.reserveKwh} kWh reserve kept for you.` })],
    ].map(([b, who, s]) => `
      <li><div><b>${b}</b><span class="with">${t({ lt: "Šalis", en: "Party" })}: ${who}</span><span>${s}</span></div></li>`).join("");

    return `
      <div class="eyebrow">${t({ lt: "Užsakymas", en: "Your order" })}</div>
      <h1>${t({ lt: "Patvirtinkite ir užsisakykite", en: "Confirm and order" })}</h1>
      <p class="lede">${t({
        lt: "Viskas suderinta. Belieka pasirašyti tris sutartis — ir šiandien iš Jūsų sąskaitos neišeina nieko.",
        en: "Everything is agreed. Three signatures left — and nothing leaves your account today." })}</p>

      <div class="duetoday">
        <div>
          <span class="k">${t({ lt: "Sumokate šiandien", en: "Due today" })}</span>
          <span class="v mono">${EUR(0, 2)}</span>
        </div>
        <div class="then">${t({
          lt: `Pirmoji ${EUR(q.loan, 2)} įmoka — mėnesį po montavimo priėmimo. Iki tol nemokate nieko, net jei montavimas užtruktų.`,
          en: `The first instalment of ${EUR(q.loan, 2)} falls a month after the installation is signed off. Until then you pay nothing, even if the install slips.` })}</div>
      </div>

      <div class="card stack">
        <h3>${t({ lt: "Ką užsisakote", en: "What you are ordering" })}</h3>
        <div style="margin-top:12px">${order}</div>
        <div class="brk total">
          <div class="l">${t({ lt: "Mėnesio suma su elektra", en: "Monthly total with electricity" })}
            <em>${t({ lt: `šiandien mokate ${EUR(PERSONA.currentMonthlyCost)} · skirtumas ${EUR(q.monthlySaving)}/mėn.`,
                       en: `you pay ${EUR(PERSONA.currentMonthlyCost)} today · a difference of ${EUR(q.monthlySaving)}/mo` })}</em></div>
          <div class="v mono">${EUR(q.monthly, 2)}</div>
        </div>
      </div>

      <div class="card">
        <h3>${t({ lt: "Pasirašote tris sutartis, ne vieną", en: "You are signing three agreements, not one" })}</h3>
        <p style="font-size:13px;color:var(--navy-45);margin:6px 0 14px">${t({
          lt: "Trys šalys, trys skirtingos rizikos. Platforma jas surenka į vieną vietą, bet nesulieja į vieną dokumentą.",
          en: "Three parties, three different risks. The platform collects them in one place without merging them into one document." })}</p>
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
    const q = quote(state.contractor, state.years);
    const c = q.contractor;
    const steps = [
      [t({ lt: "Šiandien", en: "Today" }),
       t({ lt: `Trys sutartys pasirašytos. Iš Jūsų sąskaitos nepaimta ${EUR(0)}.`, en: `Three agreements signed. ${EUR(0)} taken from your account.` })],
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
       t({ lt: `Mėnesį po priėmimo. Vienoje sąskaitoje: elektra, ${EUR(q.loan, 2)} paskolos įmoka ir ${EUR(c.flexFloor)} lankstumo garantija.`,
           en: `A month after sign-off. One invoice with the electricity, the ${EUR(q.loan, 2)} instalment and the ${EUR(c.flexFloor)} flexibility credit.` })],
    ].map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join("");

    return `
      <div class="eyebrow">${t({ lt: "Užsakyta", en: "Ordered" })}</div>
      <div class="selectedbrand">
        ${contractorLogo(c, "brandlogo contractor hero")}
        <h1>${t({ lt: "Kas bus toliau", en: "What happens next" })}</h1>
      </div>
      <p class="lede partyline">${contractorLogo(c, "brandlogo contractor mini")}${partnerLogo(q.term, "brandlogo partner mini")}${t({
        lt: `${c.name} · ${NUM(c.pv)} kW ir ${NUM(c.battery, 0)} kWh · ${q.term.partner} ${q.term.years} m. · ${EUR(q.monthly)} per mėnesį.`,
        en: `${c.name} · ${NUM(c.pv)} kW and ${NUM(c.battery, 0)} kWh · ${q.term.partner} ${q.term.years} yr · ${EUR(q.monthly)} a month.` })}</p>

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
  foot: { lt: "Vienintelis ekranas, rodantis ryšį, o ne sandorį. Čia matoma, kad garantija tikrai veikia.",
          en: "The only screen showing a relationship rather than a transaction, and the one where the floor is visibly real." },
  agent: [
    { lt: "Kovas. Kaupiklį kroviau pigiomis nakties zonomis 26 naktis iš 31, o rinkoje jis uždirbo daugiau, nei sudaro garantuotas minimumas.",
      en: "March. I charged the battery in the cheap night zones on 26 of 31 nights, and in the market it earned more than the guaranteed minimum." },
    { lt: "Todėl šį mėnesį į sąskaitą įskaityta ne garantija, o pusė realių pajamų. Sausį buvo priešingai, ir tada garantija suveikė.",
      en: "So this month the invoice carries half the real revenue rather than the floor. In January it was the other way round, and the floor did its job." },
  ],
  asks: [
    [{ lt: "Kodėl turėčiau atidaryti šią programėlę?", en: "Why would I open this app?" },
     { lt: "Nes čia yra skaičius, kuris kiekvieną mėnesį keičiasi ir kurio pusė yra Jūsų. Tai sąžiningas atsakymas — gražesnė sąsaja Jūsų nesugrąžintų.",
       en: "Because there is a number here that changes every month and half of it is yours. That is the honest answer — a nicer interface would not bring you back." }],
    [{ lt: "Parodykite penkias naktis, kai nekrovėte", en: "Show me the five nights you didn't charge" },
     { lt: "Kovo 3, 9, 17, 24 ir 29 d. — tomis naktimis skirtumas tarp zonų buvo mažesnis už kaupiklio nusidėvėjimo kaštus. Krauti būtų kainavę daugiau, nei uždirbę, todėl palikau ramybėje.",
       en: "3, 9, 17, 24 and 29 March — on those nights the zone spread was below the battery's degradation cost. Charging would have cost more than it earned, so I left it alone." }],
    [{ lt: "Kiek uždirbote Jūs, o ne aš?", en: "What did you earn, as opposed to me?" },
     { lt: `Bendrai kaupiklis uždirbo ${EUR(58)}, Jums atiteko pusė. Rodome bendrą sumą būtent todėl, kad „uždirbate iš mano įrangos“ yra tas prieštaravimas, kuris šį produktą ir užmuša, jei jo nepaaiškini.`,
       en: `The battery earned ${EUR(58)} gross and you got half. We show the gross figure precisely because "you are making money from my equipment" is the objection that kills this product if left unanswered.` }],
  ],
  render: () => {
    const q = quote(state.contractor, state.years);
    const c = q.contractor;

    /* A good month: the market beat the floor, so the customer gets the share
       rather than the minimum. The floor still has to be visible, or there is
       no reason to believe it exists. */
    const flexGross = Math.round(MONTH.flexGross * (c.battery / 16));
    const share = Math.round(flexGross * FLEX.upsideShare);
    const credited = Math.max(share, c.flexFloor);
    const energy = c.billAfter * 0.72;
    const network = c.billAfter * 0.28;
    const total = c.billAfter + q.loan - c.exportIncome - credited;
    const poolPct = Math.min(100, Math.round((POOL.thresholdMw / POOL.mw) * 100));

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
          <div class="billrow"><span>${t({ lt: `Tinklo mokesčiai — ${MONTH.cheapZoneShare} % pigiose zonose`, en: `Network charges — ${MONTH.cheapZoneShare}% in cheap zones` })}</span>
            <span class="mono">${EUR(network, 2)}</span></div>
          <div class="billrow"><span class="partyline">${partnerLogo(q.term, "brandlogo partner mini")}${t({ lt: `Paskolos įmoka — ${q.term.partner}, ${q.term.years} m.`, en: `Loan instalment — ${q.term.partner}, ${q.term.years} yr` })}</span>
            <span class="mono">${EUR(q.loan, 2)}</span></div>
          <div class="billrow credit"><span>${t({ lt: "Į tinklą atiduota saulės energija", en: "Solar exported to the grid" })}</span>
            <span class="mono">−${EUR(c.exportIncome, 2)}</span></div>
          <div class="billrow credit"><span>${t({
            lt: `Lankstumo pajamų dalis — uždirbta ${EUR(flexGross)}, Jums 50 %`,
            en: `Your share of flexibility revenue — ${EUR(flexGross)} earned, 50% yours` })}</span>
            <span class="mono">−${EUR(credited, 2)}</span></div>
          <div class="billrow foot"><span>${t({ lt: "Iš viso", en: "Total" })}</span><span class="mono">${EUR(total, 2)}</span></div>
        </div>
        <p style="font-size:13px;color:var(--navy-45);margin-top:14px">${t({
          lt: `Garantuotas minimumas — ${EUR(c.flexFloor)}/mėn. Šį mėnesį jo neprireikė: rinkoje uždirbta ${EUR(flexGross)}, todėl Jums atiteko ${EUR(share)}. Sausį buvo priešingai — kaupiklis uždirbo ${EUR(MONTH.previousMonth.earned)}, o į sąskaitą vis tiek įskaityti ${EUR(c.flexFloor)}. Būtent tam garantija ir egzistuoja.`,
          en: `The guaranteed minimum is ${EUR(c.flexFloor)}/month. It was not needed this month: ${EUR(flexGross)} was earned in the market, so your half came to ${EUR(share)}. In January it was the other way round — the battery earned ${EUR(MONTH.previousMonth.earned)} and ${EUR(c.flexFloor)} was credited anyway. That is what the floor is for.` })}</p>
      </div>

      <div class="card">
        <h3 style="display:flex;align-items:center;gap:9px"><span style="color:var(--blue)">${icon("bess")}</span>
          ${t({ lt: "Ką dariau su Jūsų kaupikliu", en: "What I did with your battery" })}</h3>
        <div style="margin-top:12px">${ops}</div>
        <div class="brk total"><div class="l">${t({ lt: "Uždirbta rinkoje", en: "Earned in the market" })}
          <em>${t({ lt: `${EUR(share)} įskaityta Jums`, en: `${EUR(share)} credited to you` })}</em></div>
          <div class="v mono">${EUR(flexGross, 2)}</div></div>
      </div>

      <div class="card pool">
        <h3 style="display:flex;align-items:center;gap:9px"><span style="color:var(--blue)">${icon("grid")}</span>
          ${t({ lt: "Jūsų kaupiklis veikia ne vienas", en: "Your battery does not work alone" })}</h3>
        <p style="font-size:13.5px;color:var(--navy-70);margin-top:8px">${t({
          lt: `Jis yra vienas iš ${POOL.assets} kaupiklių platformoje. Kartu jie sudaro ${NUM(POOL.mw)} MW valdomos galios — pakankamai, kad būtų galima dalyvauti rinkoje, kurioje minimalus dalyvio dydis yra ${NUM(POOL.thresholdMw, 0)} MW. Vienas kaupiklis jokioje rinkoje nedalyvautų.`,
          en: `It is one of ${POOL.assets} batteries on the platform. Together they make ${NUM(POOL.mw)} MW of controllable capacity — enough to participate in a market where the minimum bid is ${NUM(POOL.thresholdMw, 0)} MW. A single battery would not clear anywhere.` })}</p>
        <div class="poolbar"><i style="width:${poolPct}%"></i></div>
        <div class="poolnote">
          <span>${t({ lt: `Minimalus dalyvio dydis ${NUM(POOL.thresholdMw, 0)} MW`, en: `${NUM(POOL.thresholdMw, 0)} MW minimum bid` })}</span>
          <span>${t({ lt: `Šiuo metu ${NUM(POOL.mw)} MW · ${POOL.assets} kaupiklių`, en: `Currently ${NUM(POOL.mw)} MW · ${POOL.assets} batteries` })}</span>
        </div>
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
  state.i = i;
  state.log = [];
  render();
}

function reset() {
  state.i = 0;
  state.consent = false;
  state.contractor = null;
  state.years = 10;
  state.dispatch = null;
  state.formFilled = false;
  state.log = [];
  render();
}

document.addEventListener("click", (e) => {
  const node = e.target.closest(
    "[data-toggle],[data-contractor],[data-years],[data-dispatch],[data-fill],[data-step],[data-goto],[data-ask],[data-lang]");
  if (!node) return;

  if (node.dataset.lang) {
    LANG.current = node.dataset.lang;
    document.documentElement.lang = LANG.current;
    document.querySelectorAll(".langbtn").forEach((b) =>
      b.classList.toggle("on", b.dataset.lang === LANG.current));
    /* Flow state survives a language change — only the copy is re-resolved. */
    return render();
  }

  if (node.dataset.toggle === "consent") {
    state.consent = !state.consent;
    return render();
  }

  if (node.dataset.contractor) {
    state.contractor = node.dataset.contractor;
    return render();
  }

  if (node.dataset.years) {
    state.years = +node.dataset.years;
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

el("nextBtn").onclick = () => go(state.i + 1);
el("backBtn").onclick = () => go(state.i - 1);
el("resetBtn").onclick = reset;

el("railBtn").onclick = () => {
  const hidden = el("app").classList.toggle("rail-hidden");
  el("railBtn").textContent = t(hidden ? CHROME.showRail : CHROME.hideRail);
};

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input,textarea")) return;
  if (e.key === "ArrowRight" && !el("nextBtn").disabled) go(state.i + 1);
  if (e.key === "ArrowLeft") go(state.i - 1);
});

render();
