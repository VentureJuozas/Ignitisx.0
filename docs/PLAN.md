# Implementation Plan: Ignitis website and onboarding (Wise pattern)

This plan turns the Wise web product pattern into an Ignitis-branded marketing site, signup, and logged-in home. Layout, hierarchy, and flow come from [Mobbin Wise web](https://mobbin.com). Color, type, and logo rules come from the [Ignitis Green Lithuanian Energy Style Guide](https://ignitis.lt/sites/default/files/inline-files/1-Green%20Lithuanian%20Energy%20Style%20guide%20EN.pdf).

Companion docs:

- [SYSTEM.md](./SYSTEM.md) — information architecture, page inventory, onboarding steps
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — tokens, components, and usage

## Overview

Build a consumer energy product that feels like Wise: a calculator-first homepage, a one-question-per-screen signup, and a quiet dashboard after login. Swap Wise lime/forest green for Ignitis green `#31c67c`, dark green `#006d67`, and blue `#4057e3`. Do not copy Wise copy, logo, or illustrations.

The first product surface is **Home** (household electricity). **Business** is a parallel segment toggle, same as Wise Personal / Business.

## Specification sources

| Source | What we take |
| --- | --- |
| [Wise onboarding flow](https://mobbin.com/flows/bba5b441-1d7e-4a83-a28b-4317e4105108) | Step order, chrome, one field per screen |
| [Setting up an account](https://mobbin.com/flows/db72a145-5398-4854-ad12-657e6eb2e505) | Account type → country → 2FA → password |
| [Create account](https://mobbin.com/screens/fa52fce0-5032-40d6-90ad-7e7ce55d1ef9) / [Login](https://mobbin.com/screens/a3adb2d7-f505-40dc-a6cf-f3adbeee8cdf) | Centered auth column, social row, pill CTA |
| [Hero + converter](https://mobbin.com/sites/sections/ed4009c4-f3a6-4228-9287-548135488099) | Two-column hero with live estimator |
| [How it works](https://mobbin.com/sites/sections/96d6e07b-b406-4314-b256-23ca5e0d76bc) | Numbered 3-step cards |
| [Footer](https://mobbin.com/sites/sections/74fdb05c-5413-48fd-827d-ac76653b0047) | Logo, link columns, legal, social |
| Ignitis style guide | Colors, Basetika, logo, accent usage |

## Technical approach

- **Stack (recommended):** Next.js App Router, TypeScript, CSS variables from `DESIGN_SYSTEM.md`, no visual library that fights pill buttons and 8px rhythm.
- **Two shells:** Marketing chrome (full nav + footer) vs onboarding chrome (logo, stepper, close). Never mix them.
- **Hero calculator:** Client widget on `/` that estimates a home electricity plan from home size, occupancy, and tariff. Submit routes to `/register` with query state.
- **Auth:** Email-first signup, optional Google/Apple, then the gated stepper. Phone 2FA before password.
- **i18n:** Lithuanian default, English second. Language control lives in the marketing header, not inside onboarding.
- **Brand assets:** Ignitis wordmark + figure. Do not invent a Wise-style flag mark.

## Phases

### Phase 0 — Foundations

- [ ] Add design tokens as CSS custom properties from `DESIGN_SYSTEM.md`
- [ ] Load Basetika (or Inter fallback) and set type scale
- [ ] Build `Button`, `TextField`, `Select`, `Stepper`, `PillToggle`, `AppHeader`, `OnboardingHeader`
- [ ] Lock two layout shells: marketing and onboarding

### Phase 1 — Marketing website

- [ ] Header: logo, Home / Business pills, Features, Plans, Help, language, Log in, Register
- [ ] Hero: headline + plan calculator card (Wise converter slot)
- [ ] How it works: three numbered cards + primary CTA
- [ ] Split feature rows (copy left / product mock right, then reverse)
- [ ] Trust row: regulation, support, security
- [ ] FAQ accordion
- [ ] Multi-column footer + legal strip
- [ ] Plans and Help routes using the same chrome

### Phase 2 — Auth and onboarding

- [ ] `/login` — email, password, social, passkey
- [ ] `/register` — email, Next, social, terms
- [ ] Step 1 Account type — Home vs Business selection cards
- [ ] Step 2 Location — country then municipality
- [ ] Step 3 Phone 2FA — number, send code, 6-digit confirm
- [ ] Step 4 Password — live requirement checklist
- [ ] Step 5 Profile — legal name, date of birth
- [ ] Exit (`X`) returns to marketing home; Back never loses entered data

### Phase 3 — Logged-in home

- [ ] Left sidebar: Home, Usage, Bills, Payments, Properties, Insights
- [ ] Plan calculator card (same widget as marketing, authenticated)
- [ ] Promo row “Do more with Ignitis” (EnergySmart, EV, solar)
- [ ] Empty and first-bill states

### Phase 4 — Quality

- [ ] Keyboard and screen-reader pass on onboarding
- [ ] Contrast: dark text on green CTAs, white text on blue CTAs
- [ ] Mobile: stacked hero, full-width pills, sidebar as drawer
- [ ] Lithuanian and English strings for auth + hero

## Dependencies

- Licensed Basetika files, or written approval to ship Inter as the digital product face
- Ignitis logo SVG (color, white, blue mono)
- Plan-estimate API or static tariff table for the calculator
- SMS/OTP provider for 2FA
- Legal URLs: terms, privacy, acceptable use

## Risks

| Risk | Mitigation |
| --- | --- |
| Green `#31c67c` fails white-on-green contrast | Primary pills use `text.inverse-on-brand` (`#163330`), never white |
| Style guide wants yellow/pink CTAs, Wise uses brand-color CTAs | Primary actions stay green (Wise pattern). Yellow and pink are highlights and alerts only |
| Copying Wise too closely | Reuse structure, not trademark, copy, or 3D assets |
| Onboarding drop-off | Keep one decision per screen; persist state; Back is always visible after step 1 |
| Calculator without live tariffs | Ship with a labelled estimate and a “final price after address” disclaimer |

## Out of scope for the first cut

- Full bill payment rails
- Native mobile apps (reuse tokens later)
- Partner / affiliate microsites
- CMS for news
