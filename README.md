# Ignitisx.0

Starting point for the Ignitisx.0 web product: a Wise-style marketing site and onboarding, using official Ignitis brand colors.

## Docs

| Doc | What it is |
| --- | --- |
| [docs/PLAN.md](docs/PLAN.md) | Implementation plan and phases |
| [docs/SYSTEM.md](docs/SYSTEM.md) | Product system: IA, pages, onboarding |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens, components, Wise → Ignitis mapping |

Layout and flows are taken from [Wise on Mobbin](https://mobbin.com). Color and type follow the [Ignitis Green Lithuanian Energy Style Guide](https://ignitis.lt/sites/default/files/inline-files/1-Green%20Lithuanian%20Energy%20Style%20guide%20EN.pdf).

---

# Household flexibility onboarding mockup

A clickable, zero-build concept mockup for the innovation unit strategy session. It opens on the
persona, walks him through eight onboarding screens, and closes with a "three months later"
epilogue. Underneath sits a **presenter layer** that maps every screen back to the 4 A's, the
monetised unit, and the four tests.

Runs entirely on `localhost`. No npm install, no build step, no dependencies. It is standalone —
it does not depend on the design system in `docs/`, though the two should converge if the concept
survives the session.

## Run it

```powershell
python -m http.server 4321 --bind 127.0.0.1
```

Then open <http://127.0.0.1:4321/>. Any static server works — `npx serve .` is equivalent.

Opening `index.html` directly with `file://` also works, but serving it is cleaner.

## Driving it in the room

| Control | What it does |
| --- | --- |
| `→` / `←` or the footer buttons | Move through the flow |
| The dashes in the top bar | Jump straight to any screen |
| `P` or **Presenter view** | Opens the dark strategy overlay along the bottom |
| **Hide agent** | Collapses the assistant rail for a cleaner projection |
| **Restart** | Resets all state |

The whole flow clicks through in about two minutes.

## The ten screens

0. **Persona** — Mantas, and the six facts every later number derives from. The only screen the
   customer never sees; read it out before starting.
1. **Trigger** — a loss statement computed from his own data, not a discount.
2. **Consent** — the real gate. A working toggle, deliberately not skippable.
3. **Reveal** — three derived facts, agent-narrated. The strongest sixty seconds.
4. **Confirm** — five pre-filled assets with confidence markers, three open toggles.
5. **What matters** — five customer-language cards, pick at most two.
6. **The offer** — three variants priced in three *different units*.
7. **The control ask** — three dispatch levels, each priced.
8. **What happens next** — a date, a named person, what changes on the bill.
9. **Three months later** — the operator screen. The only one showing a relationship.

## What actually argues the strategy

**Nothing is a static number.** `js/model.js` holds the whole value model. Change the control
level on screen 6 or 7 and every euro on screen recalculates, including the "where the money
comes from" breakdown.

**The hardware is legible without reading.** Each offer card carries a four-tile strip — battery,
solar, water heating, EV — so what's in the box is visible at a glance. Filled tiles are included,
the dashed periwinkle tile is ready-for-later, and a slashed grey tile is not included. Option B's
battery tile is slashed, which is the fastest way to see that it is a bill product rather than a
resilience product. The same icon set runs through the persona and detected-assets screens.

**Option B disappears at "Mine only."** Variant B *is* the dispatch right, so at zero control it
renders as unavailable rather than as a cheaper product. Worth pausing on in the room.

**The dispatch right has a named price.** Screen 7's callout computes the gap between full
flexibility and no dispatch — currently **€20/month, €423/year**. That is the number the session
has to decide, and the mockup refuses to leave it implicit.

**"Mine only" is negative.** At −€114/yr it shows the honest cost of financing hardware with no
market return. Showing it is what makes the other two options credible.

**Flexibility revenue is labelled, not promised.** Every market-revenue figure carries an
"estimated — mechanism, not a promise" marker, because BBCM capacity clearing prices aren't
published and a bid needs ≥1 MW (roughly 150–200 homes) before it clears. The zone spread
(€0.09/kWh incl. VAT) carries most of the illustrated saving because it is published and fixed.

**The presenter overlay** shows, per screen: which of the 4 A's is live, which of the six
alternative revenue units is being sold, the strategic note, and a live pass/partial/fail read
on the four tests for the currently selected variant and dispatch level.

## Tuning the numbers

Everything a session might argue about lives in `js/model.js`:

- `TARIFF` — zone spread, retail price, export value and the erosion rate
- `VARIANTS` — monthly price per dispatch level, savings components, flex revenue and split,
  and the `includes` list that drives the hardware icon strip
- `DISPATCH` — the control factor that gates every automation-dependent saving
- `PRIORITIES` — the five cards and their A-mapping

Edit and refresh. There is no build cache to clear.

## Files

```
index.html          shell, top bar, agent rail, presenter overlay
css/styles.css      brand system sampled from the supplied logos
js/model.js         persona, tariffs, variants, pricing, the four tests
js/app.js           icon set, the ten screens, agent narration, presenter content
assets/             ignitis-logo.png, ignitis-mark.png (unmodified)
```

## Caveats

This is a mockup for a strategy conversation, not a product spec. The persona is invented, the
February invoice is illustrative, and the market-revenue figures demonstrate a mechanism rather
than a business case. The tariff structure, the zone spread and the DataHub data granularity are
the parts that are real.
